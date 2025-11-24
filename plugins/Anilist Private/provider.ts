/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />

function init() {
	$ui.register((ctx) => {
		const storeId = "anilist-private";
		const isUpdating = ctx.state<boolean>(false);

		// INTERFACE and TYPES
		interface AnilistData {
			data: {
				SaveMediaListEntry: {
					private: boolean;
					media: {
						id: number;
						title: {
							userPreferred: string;
						};
						updatedAt: number;
					};
				};
			};
		}

		interface AnilistError {
			data: null;
			errors: {
				message: string;
				status: number;
				locations: {
					line: number;
					column: number;
				}[];
			}[];
		}

		type PrivateEntryResponse =
			| { data: AnilistData["data"]; error: undefined }
			| { data: null; error: string };

		// FUNCTIONS
		/**
		 *
		 * @param mediaId The Anilist media Id
		 * @param isPrivate Whether to set the media to private
		 * @returns
		 */
		// prettier-ignore
		async function updateAnilistPrivateEntry(mediaId: number, isPrivate: boolean): Promise<PrivateEntryResponse> {
			// prettier-ignore
			const query = "mutation SaveMediaListEntry($mediaId: Int!, $private: Boolean!) { SaveMediaListEntry(mediaId: $mediaId, private: $private) { private media { id title { userPreferred } } updatedAt } }";
			const variables = { mediaId, private: isPrivate };

			const res = await ctx.fetch("https://graphql.anilist.co", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + $database.anilist.getToken(),
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ query, variables }),
			});

			if (!res.ok) {
				const errorCode = res.status;
				const errorMsg = res.statusText;
				return { data: null, error: `${errorCode}: ${errorMsg}` };
			}

			const jsonData: AnilistData | AnilistError = await res.json();
			if (!jsonData.data) {
				const errors = jsonData.errors.map(e => `${e.status}: ${e.message}`);
				return { data: null, error: errors.join("\n") };
			}

			return { data: jsonData.data, error: undefined };
		}

		/**
		 * Retrieves media info on private anime and cache them, which
		 * can then be found on `$store.get(storeId.mediaId)`.
		 */
		function updateLocalStore(bypassCache: boolean) {
			const MLC = $anilist.getAnimeCollection(bypassCache).MediaListCollection;
			if (!MLC || !MLC.lists) return;

			for (const list of MLC.lists) {
				const entries = list.entries;
				if (!entries?.length) continue;

				for (const entry of entries) {
					const media = entry.media;
					const isPrivate = entry.private?.valueOf();

					if (!media) continue;
					$store.set(`${storeId}.${media.id}`, isPrivate);
				}
			}
		}

		/**
		 * Updates the button on the anime page whether it was set to private
		 * or not (Red background if private, regular if not private)
		 */
		function updatePrivateTag(isPrivate: boolean) {
			pivateButton.setLabel(isPrivate ? "Private" : "Set to Private");
			pivateButton.setIntent(isPrivate ? "alert" : "gray-subtle");

			// Only mount the button if user is connected to anilist
			if ($database.anilist.getToken()) {
				pivateButton.mount();
			}
		}

		/**
		 * Wait for specified amount of time
		 * @param ms Time to wait in milliseconds
		 * @returns
		 */
		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		const pivateButton = ctx.action.newAnimePageButton({
			label: "Private",
			intent: "gray-subtle",
		});

		pivateButton.onClick(async (event) => {
			// Prevent simultaneous API request
			if (isUpdating.get()) {
				return ctx.toast.warning("Currently updating data... Please wait");
			}

			// Toggle updating state
			isUpdating.set(true);

			const key = `${storeId}.${event.media.id}`;
			const current = $store.get(key) ?? false;
			const next = !current;

			const mediaTitle = event.media.title?.userPreferred || "current entry";

			ctx.toast.info(`Updating ${mediaTitle}...`);
			const response = await updateAnilistPrivateEntry(event.media.id, next);

			// Wait for several seconds (helps avoid hitting ratelimit)
			await $_wait(2_000);

			if (!response.data) {
				isUpdating.set(false);
				return ctx.toast.error(
					`Failed to update ${mediaTitle}!\n\n${response.error}`
				);
			}

			// Updates the button on the current anime page
			updatePrivateTag(response.data.SaveMediaListEntry.private);

			ctx.toast.success(
				response.data.SaveMediaListEntry.private
					? `Set ${mediaTitle} to private!`
					: `Removed ${mediaTitle} from private!`
			);

			// Warning: If you use `updateLocalStore` again after you saved this data
			// the cache will be overwritten by the old data. To always be up to date
			// with the cache, we will need the function to update a single entry only
			// to the local collection. However, this function is yet to be available
			// in the app, the other solution would be to always update the entire
			// local collection everytime we save the changes.
			$store.set(key, response.data.SaveMediaListEntry.private);
			isUpdating.set(false);

			return;
		});

		ctx.screen.onNavigate((e) => {
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const id = parseInt(e.searchParams.id);
				const isCurrentMediaPrivate = $store.get(`${storeId}.${id}`);
				updatePrivateTag(Boolean(isCurrentMediaPrivate));
			}
		});

		updateLocalStore(false);
		ctx.screen.loadCurrent();

		// If enabled by the user, hide private entries from appearing on collection
		// $app.onGetAnimeCollection((event) => {});
		// Comment out since missing permissions for that hook
	});

	// $app.onAnimeLibraryCollectionRequested((e) => {
	// 	const hidePrivateEntries = $getUserPreference("isMediaEntriesHidden");
	// 	const storeId = "anilist-private";
	// 	if (hidePrivateEntries?.toLowerCase() !== "true") {
	// 		e.next();
	// 		return;
	// 	}

	// 	const mediaList = e.animeCollection?.MediaListCollection?.lists;
	// 	if (!mediaList || !mediaList.length) {
	// 		e.next();
	// 		return;
	// 	}

	// 	for (const list of mediaList) {
	// 		if (!list.entries || !list.entries.length) continue;
	// 		console.log({ name: list.name, beforeCount: list.entries.length });
	// 		list.entries = list.entries.filter(
	// 			(e) => !$store.get(`${storeId}.${e.media?.id}`)
	// 		);
	// 		console.log({ name: list.name, afterCount: list.entries.length });
	// 	}

	// 	e.next();
	// });
}
