/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />

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
		function populateLastWatchedStore(bypassCache: boolean, type: $app.AL_MediaType = "MANGA") {
			cleanupLastWatchedStore(bypassCache, type);

			const fnName = type === "ANIME" ? "getAnimeCollection" : "getMangaCollection";
			const MLC = $anilist[fnName](bypassCache).MediaListCollection;
			if (!MLC?.lists) return;
			if (!$storage.has(storageId)) $storage.set(storageId, []);

			const current = MLC.lists.find((li) => li.name?.trim().toLowerCase() === (type === "ANIME" ? "watching" : "reading"));
			const localStore: Map<string, number> = new Map($storage.get(storageId));
			const today = Date.now();

			if (!current?.entries?.length) {
				$debug.log(`status:${type === "ANIME" ? "WATCHING" : "READING"} entries size is 0`);
				return;
			}

			for (const entry of current.entries) {
				if (!entry.media) continue;
				if (localStore.has(entry.media.id.toString())) {
					$debug.log(`[${entry.media.id}] -> baseline already exists (skipped)`);
				} else {
					$debug.log(`[${entry.media.id}] -> set baseline to ${today}`);
					localStore.set(entry.media.id.toString(), today);
				}
			}

			$storage.set(storageId, Array.from(localStore.entries()));
		}

		// Update the last watch of the specific media to today
		function updateLastWatchedStore(mediaId: number) {
			if (!$storage.has(storageId)) $storage.set(storageId, []);

			const today = Date.now();
			const localStore: Map<string, number> = new Map($storage.get(storageId));
			localStore.set(mediaId.toString(), today);

			// Store as array of entries for consistency
			$storage.set(storageId, Array.from(localStore.entries()));
			$debug.log(`[${mediaId}] -> set baseline to ${today}`);
		}

		// Prune store with non-completed/invalid entries
		function cleanupLastWatchedStore(bypassCache: boolean, type: $app.AL_MediaType = "MANGA") {
			if (!$storage.has(storageId)) $storage.set(storageId, []);

			const fnName = type === "ANIME" ? "getAnimeCollection" : "getMangaCollection";
			const MLC = $anilist[fnName](bypassCache).MediaListCollection;
			if (!MLC?.lists) return;

			const current = MLC.lists.find((li) => li.name?.trim().toLowerCase() === (type === "ANIME" ? "watching" : "reading"));
			if (!current?.entries?.length) return;

			const localStore: Map<string, number> = new Map($storage.get(storageId));

			for (const mediaId of localStore.keys()) {
				if (!current.entries.some((x) => x.media?.id.toString() === mediaId)) {
					localStore.delete(mediaId);
					$debug.log(`[${mediaId}] -> status no longer ${type === "ANIME" ? "WATCHING" : "READING"} (removed)`);
				}
			}

			$storage.set(storageId, Array.from(localStore.entries()));
		}

		function isCustomSource(mediaId?: number) {
			return (mediaId ?? 0) >= 2 ** 31;
		}

		// prettier-ignore
		$store.watch("entry-preupdate", async (e: $app.PreUpdateEntryEvent) => {
			if (e.status?.toLowerCase() === "current" && e.mediaId && (isCustomSource(e.mediaId))){
                updateLastWatchedStore(e.mediaId);
                return;
            }
		});

		// prettier-ignore
		$store.watch("entry-preupdate-progress",async (e: $app.PreUpdateEntryProgressEvent) => {
            if (e.status?.toLowerCase() === "current" && e.mediaId && (isCustomSource(e.mediaId))){
                updateLastWatchedStore(e.mediaId);
                return;
            }
        })

		// prettier-ignore
		const query = "mutation ($mediaId: Int!) { SaveMediaListEntry(mediaId: $mediaId, status: PAUSED) { id status media { id title { userPreferred } } } }";
		const isUpdated = ctx.state<boolean>(false);

		ctx.setInterval(
			async () => {
				// Do a cleanup first to prevent finished media from being updated to PAUSED
				cleanupLastWatchedStore(false);

				isUpdated.set(false);
				if (!$storage.has(storageId)) $storage.set(storageId, []);

				const duration = $getUserPreference("duration");
				if (!duration) return;

				const threshold = parseInt(duration);
				const localStore: Map<string, number> = new Map($storage.get(storageId));
				for (const [mediaId, timestamp] of localStore) {
					if (timestamp + threshold > Date.now()) continue;
					await $_wait(2_500); // prevents hitting the rate limit
					$debug.log(`[${mediaId}] has reached it's update threshold. Updating to status:PAUSED`);

					if (!$database.anilist.getToken()) {
						$debug.log(`[${mediaId}] was not updated -> Not logged in to Anilist.`);
						ctx.toast.error(`Cannot update [${mediaId}] status to PAUSED. Not logged in to Anilist`);
						return;
					}

					const res = await $anilist.customQuery({ query, variables: { mediaId } }, $database.anilist.getToken());
					isUpdated.set(true);

					if (res.errors?.length) {
						$debug.log(`[${mediaId}] was not updated -> ${res}`);
						ctx.toast.error(`Failed updating [${mediaId}] status to PAUSED: ${res.errors.map((e: { message: string }) => e.message).join()}`);
					}
				}

				// Refresh anilist
				if (isUpdated.get()) $anilist.refreshAnimeCollection();
			},
			5 * 60 * 1000,
		);

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
