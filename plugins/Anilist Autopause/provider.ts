/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		// If entries are not found in the $storage
		const storageId = "anilist-autopause-lastWatched";

		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		// Register currently watching media to the storage
		// Does not override previous entry
		function populateLastWatchedStore(bypassCache: boolean) {
			cleanupLastWatchedStore(bypassCache);

			const MLC = $anilist.getAnimeCollection(bypassCache).MediaListCollection;
			if (!MLC?.lists) return;

			if (!$storage.has(storageId)) {
				$storage.set(storageId, []);
			}

			// prettier-ignore
			const watching = MLC.lists.find((li) => li.name?.trim().toLowerCase() === "watching");
			const localStore: Map<string, number> = new Map($storage.get(storageId));
			const today = Date.now();

			if (!watching?.entries?.length) {
				// prettier-ignore
				console.log(`<populate-watched-store> -> status:WATCHING entries size is 0`);
				return;
			}

			for (const entry of watching.entries) {
				if (!entry.media) continue;
				if (localStore.has(entry.media.id.toString())) {
					// prettier-ignore
					console.log(`<populate-watched-store> -> [${entry.media.id}] -> baseline already exists (skipped)`);
					continue;
				}
				// prettier-ignore
				console.log(`<populate-watched-store> -> [${entry.media.id}] -> set baseline to ${today}`);
				localStore.set(entry.media.id.toString(), today);
			}

			$storage.set(storageId, Array.from(localStore.entries()));
		}

		// Update the last watch of the specific media to today
		function updateLastWatchedStore(mediaId: number) {
			if (!$storage.has(storageId)) {
				$storage.set(storageId, []);
			}

			const today = Date.now();
			const localStore: Map<string, number> = new Map($storage.get(storageId));
			localStore.set(mediaId.toString(), today);

			// Store as array of entries for consistency
			$storage.set(storageId, Array.from(localStore.entries()));

			// prettier-ignore
			console.log(`<update-watched-store> -> [${mediaId}] -> set baseline to ${today}`);
		}

		// Prune store with non-completed/invalid entries
		function cleanupLastWatchedStore(bypassCache: boolean) {
			if (!$storage.has(storageId)) {
				$storage.set(storageId, []);
			}

			const MLC = $anilist.getAnimeCollection(bypassCache).MediaListCollection;
			if (!MLC?.lists) return;

			// prettier-ignore
			const watching = MLC.lists.find((li) => li.name?.trim().toLowerCase() === "watching");
			if (!watching?.entries?.length) return;

			const localStore: Map<string, number> = new Map($storage.get(storageId));

			for (const mediaId of localStore.keys()) {
				if (!watching.entries.some((x) => x.media?.id.toString() === mediaId)) {
					localStore.delete(mediaId);
					// prettier-ignore
					console.log(`<cleanup-watched-store> -> [${mediaId}] -> status no longer WATCHING (removed)`);
				}
			}

			$storage.set(storageId, Array.from(localStore.entries()));
		}

		async function isAnime(mediaId: number) {
			try {
				await ctx.anime.getAnimeEntry(mediaId);
				return true;
			} catch {
				return false;
			}
		}

		// prettier-ignore
		$store.watch("entry-preupdate", async (e: $app.PreUpdateEntryEvent) => {
			if (e.status?.toLowerCase() === "current" && e.mediaId && (await isAnime(e.mediaId))){
                updateLastWatchedStore(e.mediaId);
                return;
            }
		});

		// prettier-ignore
		$store.watch("entry-preupdate-progress",async (e: $app.PreUpdateEntryProgressEvent) => {
            if (e.status?.toLowerCase() === "current" && e.mediaId && (await isAnime(e.mediaId))){
                updateLastWatchedStore(e.mediaId);
                return;
            }
        })

		// prettier-ignore
		const query = "mutation ($mediaId: Int!) { SaveMediaListEntry(mediaId: $mediaId, status: PAUSED) { id status media { id title { userPreferred } } } }";
		const isUpdated = ctx.state<boolean>(false);
		ctx.setInterval(async () => {
			// Do a cleanup first to prevent finished media from being updated to PAUSED
			cleanupLastWatchedStore(false);

			isUpdated.set(false);

			if (!$storage.has(storageId)) {
				$storage.set(storageId, []);
			}

			const duration = $getUserPreference("duration");
			if (!duration) return;

			const threshold = parseInt(duration);
			const localStore: Map<string, number> = new Map($storage.get(storageId));
			for (const [mediaId, timestamp] of localStore) {
				if (timestamp + threshold > Date.now()) continue;
				await $_wait(2_500); // prevents hitting the rate limit
				// prettier-ignore
				console.log(`[${mediaId}] has reached it's update threshold. Updating to status:PAUSED`);

				if (!$database.anilist.getToken()) {
					// prettier-ignore
					console.log(`[${mediaId}] was not updated -> Not logged in to Anilist.`)
					// prettier-ignore
					ctx.toast.error(`Cannot update [${mediaId}] status to PAUSED. Not logged in to Anilist`);
					return;
				}

				const res = await $anilist.customQuery(
					{ query, variables: { mediaId } },
					$database.anilist.getToken()
				);

				isUpdated.set(true);

				if (res.errors?.length) {
					// prettier-ignore
					console.log(`[${mediaId}] was not updated -> ${res}`);
					// prettier-ignore
					ctx.toast.error(`Failed updating [${mediaId}] status to PAUSED: ${res.errors.map((e: { message: string }) => e.message).join()}`)
				}
			}

			// Refresh anilist
			if (isUpdated.get()) $anilist.refreshAnimeCollection();
		}, 5 * 60 * 1000);

		populateLastWatchedStore(false);
	});

	// Observe when an entry gets updated to status:WATCHING.
	$app.onPreUpdateEntry((e) => {
		$store.set("entry-preupdate", $clone(e));
		e.next();
	});

	// Observe when an episode progress is updated.
	$app.onPreUpdateEntryProgress((e) => {
		$store.set("entry-preupdate-progress", $clone(e));
		e.next();
	});
}
