/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./anilist-favorites.d.ts" />

function init() {
	$ui.register(async (ctx) => {
		// prettier-ignore
		const heartIconOff = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iI2NhY2FjYSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDEuMzE0QzEyLjQzOC0zLjI0OCAyMy41MzQgNC43MzUgOCAxNS03LjUzNCA0LjczNiAzLjU2Mi0zLjI0OCA4IDEuMzE0Ii8+PC9zdmc+)";
		// prettier-ignore
		const heartIconOn = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iI2VmNDQ0NGQ5IiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTggMS4zMTRDMTIuNDM4LTMuMjQ4IDIzLjUzNCA0LjczNSA4IDE1LTcuNTM0IDQuNzM2IDMuNTYyLTMuMjQ4IDggMS4zMTQiLz48L3N2Zz4=)";

		// --- State ---
		// prettier-ignore
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Anilist%20Favorites/icon.png";
		const isPopulatingCache = ctx.state<boolean>(false);
		const isCurentMediaFavorite = ctx.state<boolean>(false);
		const favoriteStoreId = "anilist-favorite";

		// Persisted pagination states
		const page = ctx.state<number>(1);
		const hasNextPage = ctx.state<boolean>(false);
		const ids = ctx.state<{ mediaId: number; title: string; coverImage: string | null }[]>([]);

		// --- Utility ---
		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		// --- Fetch all favorites with pagination (uses ctx.state for persistence) ---
		async function fetchFavoriteAnime(): Promise<FetchedFavorites> {
			// prettier-ignore
			const query = "query ($page: Int!, $perPage: Int!) { Viewer { favourites { anime(page: $page, perPage: $perPage) { nodes { id title { userPreferred } coverImage { large } } pageInfo { currentPage hasNextPage } } } } }";
			const perPage = 50;

			// reset persisted states
			page.set(1);
			hasNextPage.set(false);
			ids.set([]);

			do {
				const res = await ctx.fetch("https://graphql.anilist.co", {
					method: "POST",
					headers: {
						Authorization: "Bearer " + $database.anilist.getToken(),
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({
						query,
						variables: { page: page.get(), perPage },
					}),
				});

				if (!res.ok) {
					return { data: null, error: `${res.status}: ${res.statusText}` };
				}

				const jsonData: AnilistViewer | AnilistError = await res.json();
				if ("errors" in jsonData) {
					const error = jsonData.errors.map((e) => e.message).join("\n");
					return { data: null, error };
				}

				const animePage = jsonData.data.Viewer.favourites.anime;
				const newIds = animePage.nodes.map((n) => ({
					mediaId: n.id,
					title: n.title.userPreferred,
					coverImage: n.coverImage.large,
				}));

				ids.set([...ids.get(), ...newIds]);
				hasNextPage.set(animePage.pageInfo.hasNextPage);
				page.set(animePage.pageInfo.currentPage + 1);

				if (hasNextPage.get()) await $_wait(1500); // only wait between pages
			} while (hasNextPage.get());

			return { data: ids.get(), error: undefined };
		}

		// --- Toggle favorite entry (mutation only, no reliance on returned nodes) ---
		async function updateAnilistFavoriteEntry(mediaId: number) {
			// prettier-ignore
			const query = "mutation ($mediaId: Int!) { ToggleFavourite(animeId: $mediaId) { anime { nodes { id } } } }";

			const res = await ctx.fetch("https://graphql.anilist.co", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + $database.anilist.getToken(),
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ query, variables: { mediaId } }),
			});

			if (!res.ok) {
				return { data: null, error: `${res.status}: ${res.statusText}` };
			}

			const jsonData: AnilistFavoriteData | AnilistError = await res.json();
			if (!jsonData.data) {
				const errors = jsonData.errors.map((e) => `${e.status}: ${e.message}`);
				return { data: null, error: errors.join("\n") };
			}

			return { data: jsonData.data, error: undefined };
		}

		// --- Verify favorite state for a single media (avoids pagination risk) ---
		async function checkIsFavourite(mediaId: number): Promise<{
			isFavourite: boolean;
			title: string;
			coverImage: string | null;
		}> {
			// prettier-ignore
			const query = "query ($mediaId: Int!) { Media(id: $mediaId) { id isFavourite title { userPreferred } coverImage { large } } }";

			const res = await ctx.fetch("https://graphql.anilist.co", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + $database.anilist.getToken(),
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ query, variables: { mediaId } }),
			});

			if (!res.ok) return { isFavourite: false, title: "", coverImage: null };
			const json = await res.json();
			const media = json?.data?.Media;
			return {
				isFavourite: Boolean(media?.isFavourite),
				title: media?.title?.userPreferred || "",
				coverImage: media?.coverImage?.large || null,
			};
		}

		// --- Populate cache once (initial/full sync) ---
		async function populateCache() {
			isPopulatingCache.set(true);
			const res = await fetchFavoriteAnime();

			if (!res.data) {
				const errmsg = "Error populating cache [Anilist Favorites]";
				ctx.toast.error(errmsg + " " + res.error);
				return;
			}

			const data: StoreEntry[] = res.data.map((m) => [m.mediaId.toString(), { title: m.title, coverImage: m.coverImage }]);

			$store.set(favoriteStoreId, data);
			isPopulatingCache.set(false);
		}

		// --- Update cache locally using verified state ---
		function updateCache(mediaId: number, title: string, coverImage: string | null, isFavourite: boolean) {
			const cache = new Map<StoreEntry[0], StoreEntry[1]>($store.get(favoriteStoreId));
			const key = mediaId.toString();

			if (isFavourite) {
				cache.set(key, { title, coverImage });
			} else {
				cache.delete(key);
			}

			$store.set(favoriteStoreId, Array.from(cache.entries()));
		}

		// --- UI helpers ---
		function updateFavoriteTag(isFavorite: boolean) {
			favoriteBtn.setStyle({
				backgroundImage: isFavorite ? heartIconOn : heartIconOff,
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				backgroundSize: "21.5px 21.5px",
				width: "40px",
			});
			if ($database.anilist.getToken()) favoriteBtn.mount();
		}

		function disableFavoriteTag(disabled: boolean) {
			const styles: IconButtonStyles = {
				backgroundImage: isCurentMediaFavorite.get() ? heartIconOn : heartIconOff,
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				backgroundSize: "21.5px 21.5px",
				width: "40px",
				opacity: "0.5",
				pointerEvents: "none",
			};

			if (!disabled) {
				delete styles.opacity;
				delete styles.pointerEvents;
			}

			favoriteBtn.setStyle(styles);
		}

		function formatFavorites() {
			type K = StoreEntry[0];
			type V = StoreEntry[1];

			// prettier-ignore
			const favoriteMediaEntries:[K, V][] = $store.getOrSet(favoriteStoreId, () => []);
			const noEntries = tray.text("No Entries", {
				// prettier-ignore
				className: "bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl text-center",
				style: {
					padding: "25px 0",
					fontSize: "1.5em",
					fontWeight: "500",
					color: "#666",
				},
			});

			if (!favoriteMediaEntries.length) return [noEntries];

			const sortedFavorites = favoriteMediaEntries.sort(([, a], [, b]) => (a.title ?? "").localeCompare(b.title ?? ""));

			return sortedFavorites.map(([id, media]) => {
				const buttonStyle = {
					wordBreak: "unset",
					width: "100%",
					fontSize: "12px",
					alignSelf: "bottom",
					"border-top-left-radius": "0",
					"border-top-right-radius": "0",
				};

				const coverImage = tray.div([], {
					style: {
						width: "100%",
						height: "12rem",
						flexShrink: "0",
						flexGrow: "0",
						backgroundImage: `url(${media.coverImage})`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						borderRadius: "0.75em 0.75em 0 0",
					},
				});

				const title = tray.text(String(media.title) || "\u200b", {
					style: {
						"user-select": "none",
						padding: "0 5px 10px 5px",
						lineHeight: "1.2",
						fontWeight: "600",
						wordBreak: "unset",
					},
				});

				const goToPageBtn = tray.button("Go to Page", {
					onClick: ctx.eventHandler(`note-navigate-${id}`, () => {
						ctx.toast.info("Navigating to " + media.title);
						ctx.screen.navigateTo("/entry", { id });
						tray.close();
					}),
					intent: "gray-subtle",
					style: { ...buttonStyle },
				});

				const gap = tray.div([], { style: { "flex-grow": "1" } });

				return tray.flex([coverImage, title, gap, goToPageBtn], {
					className: "bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl",
					direction: "column",
					style: {
						width: "10rem",
					},
				});
			});
		}

		const favoriteBtn = ctx.action.newAnimePageButton({
			label: "\u200b",
			intent: "gray-subtle",
		});

		// --- Tray render (Viewer for anilist) ---
		const tray = ctx.newTray({ iconUrl, withContent: true, width: "45rem" });
		tray.render(() => {
			const pluginIcon = tray.div([], {
				style: {
					width: "2.5em",
					height: "2.5em",
					backgroundImage: `url(${iconUrl})`,
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					flexGrow: "0",
					flexShrink: "0",
				},
			});

			const header_text = tray.text("AniList Favorites", {
				style: {
					fontSize: "1.2em",
					"font-weight": "700",
					"user-select": "none",
				},
			});

			const text_notSignedIn = tray.text("You need to be logged in to Anilist to use this plugin.", {
				style: {
					fontSize: "13px",
					color: "#e26f6fff",
					lineHeight: "normal",
					wordBreak: "unset",
					"user-select": "none",
				},
			});

			const text_SignedIn = tray.text("Browse your Favorite Anime", {
				style: {
					fontSize: "13px",
					color: "#666",
					lineHeight: "normal",
					wordBreak: "unset",
					"user-select": "none",
					fontWeight: "500",
				},
			});

			if (!$database.anilist.getToken()) {
				return tray.flex([pluginIcon, tray.stack([header_text, text_notSignedIn], { gap: 1 })], {
					direction: "row",
					gap: 3,
					style: { padding: "10px" },
				});
			}

			return tray.stack(
				[
					tray.flex([pluginIcon, tray.stack([header_text, text_SignedIn], { gap: 1 })], {
						direction: "row",
						gap: 3,
						style: { padding: "10px" },
					}),
					tray.div([
						tray.flex(isPopulatingCache.get() ? [] : formatFavorites(), {
							gap: 4,
							style: {
								flexWrap: "wrap",
								"overflow-y": "auto",
								"overflow-x": "hidden",
								maxHeight: "29rem" /*Based on parent max height*/,
							},
						}),
					]),
				],
				{ gap: 1 }
			);
		});

		// --- Button click handler (toggle → verify → cache → UI) ---
		favoriteBtn.onClick(async (event) => {
			disableFavoriteTag(true);

			const mediaId = event.media.id;
			const mediaTitle = event.media.title?.userPreferred || "current entry";
			ctx.toast.info(`Updating ${mediaTitle}...`);

			const response = await updateAnilistFavoriteEntry(mediaId);
			await $_wait(2000); // short pause to avoid rate limits

			if (!response.data) return disableFavoriteTag(false);

			// Verify actual state with single query
			const verified = await checkIsFavourite(mediaId);

			// Update cache based on verified state
			updateCache(mediaId, verified.title, verified.coverImage, verified.isFavourite);

			// Update UI
			ctx.toast.success(
				verified.isFavourite ? `Added ${verified.title} to Favorites!` : `Removed ${verified.title} from Favorites!`
			);

			disableFavoriteTag(false);
			updateFavoriteTag(verified.isFavourite);
			isCurentMediaFavorite.set(verified.isFavourite);
		});

		// --- Navigation handler (reflect cache on entry pages) ---
		ctx.screen.onNavigate((e) => {
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const id = e.searchParams.id;
				const map = new Map<StoreEntry[0], StoreEntry[1]>($store.get(favoriteStoreId));

				isCurentMediaFavorite.set(map.has(id));
				updateFavoriteTag(map.has(id));
			}
		});

		// --- Initial cache population ---
		if ($database.anilist.getToken()) {
			populateCache();
		}

		ctx.screen.loadCurrent();
	});
}
