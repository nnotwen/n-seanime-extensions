/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./anilist-private.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const storeId = "anilist-private";
		const isCurrentMediaPrivate = ctx.state<boolean>(false);
		// prettier-ignore
		const privateIcon = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iI2NhY2FjYSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJtMTAuNzkgMTIuOTEyLTEuNjE0LTEuNjE1YTMuNSAzLjUgMCAwIDEtNC40NzQtNC40NzRsLTIuMDYtMi4wNkMuOTM4IDYuMjc4IDAgOCAwIDhzMyA1LjUgOCA1LjVhNyA3IDAgMCAwIDIuNzktLjU4OE01LjIxIDMuMDg4QTcgNyAwIDAgMSA4IDIuNWM1IDAgOCA1LjUgOCA1LjVzLS45MzkgMS43MjEtMi42NDEgMy4yMzhsLTIuMDYyLTIuMDYyYTMuNSAzLjUgMCAwIDAtNC40NzQtNC40NzR6Ii8+PHBhdGggZD0iTTUuNTI1IDcuNjQ2YTIuNSAyLjUgMCAwIDAgMi44MjkgMi44Mjl6bTQuOTUuNzA4LTIuODI5LTIuODNhMi41IDIuNSAwIDAgMSAyLjgyOSAyLjgyOXptMy4xNzEgNi0xMi0xMiAuNzA4LS43MDggMTIgMTJ6Ii8+PC9zdmc+)";
		const btnIconStyles: IconButtonStyles = {
			backgroundImage: privateIcon,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			backgroundSize: "21.5px 21.5px",
			width: "40px",
			padding: "0",
			paddingInlineStart: "0.5rem",
		};

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
		function updatePrivateTag(disabled: boolean) {
			if (disabled) {
				privateButton.setStyle({
					...btnIconStyles,
					backgroundImage: "",
				});
			} else {
				privateButton.setStyle({
					...btnIconStyles,
					backgroundImage: privateIcon,
				});
			}
			privateButton.setLoading(disabled);
			privateButton.setIntent(isCurrentMediaPrivate.get() ? "alert" : "gray-subtle");
		}

		/**
		 * Wait for specified amount of time
		 * @param ms Time to wait in milliseconds
		 * @returns
		 */
		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		const privateButton = ctx.action.newAnimePageButton({
			label: "\u200b\u200b",
			intent: "gray-subtle",
			style: btnIconStyles,
		});

		privateButton.onClick(async (event) => {
			updatePrivateTag(true);

			const key = `${storeId}.${event.media.id}`;
			const current = $store.get(key) ?? false;
			const next = !current;

			const mediaTitle = event.media.title?.userPreferred || "current entry";
			const response = await updateAnilistPrivateEntry(event.media.id, next);

			// Wait for several seconds (helps avoid hitting ratelimit)
			await $_wait(2_000);

			if (!response.data) {
				updatePrivateTag(false);
				return ctx.toast.error(`Failed to update ${mediaTitle}!\n\n${response.error}`);
			}

			// Updates the button on the current anime page
			isCurrentMediaPrivate.set(response.data.SaveMediaListEntry.private);
			updatePrivateTag(false);

			$store.set(key, response.data.SaveMediaListEntry.private);
			return;
		});

		ctx.screen.onNavigate((e) => {
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const id = parseInt(e.searchParams.id);
				isCurrentMediaPrivate.set($store.get(`${storeId}.${id}`));
				updatePrivateTag(false);
			}
		});

		if ($database.anilist.getToken()) {
			updateLocalStore(false);
			privateButton.mount();
			ctx.screen.loadCurrent();
		}
	});
}
