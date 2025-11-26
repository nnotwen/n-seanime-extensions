/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./anilist-favorites.d.ts" />

function init() {
	$ui.register(async (ctx) => {
		// BUTTON-STYLES
		// prettier-ignore
		const heartIcon = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iI2NhY2FjYSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDEuMzE0QzEyLjQzOC0zLjI0OCAyMy41MzQgNC43MzUgOCAxNS03LjUzNCA0LjczNiAzLjU2Mi0zLjI0OCA4IDEuMzE0Ii8+PC9zdmc+)";
		const btnIconStyles: IconButtonStyles = {
			backgroundImage: heartIcon,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			backgroundSize: "21.5px 21.5px",
			width: "40px",
		};

		// prettier-ignore
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Anilist%20Favorites/icon.png";

		// --- State ---
		const isPopulatingCache = ctx.state<boolean>(false);
		const isCurentMediaFavorite = ctx.state<boolean>(false);
		const searchQuery = ctx.state<string>("");
		const favoriteStoreId = "anilist-favorite";

		// Persisted pagination states
		const page = ctx.state<number>(1);
		const hasNextPage = ctx.state<boolean>(false);
		const ids = ctx.state<{ mediaId: number; title: string; coverImage: string | null; alternativeTitles?: string[] }[]>(
			[]
		);

		// --- Utility ---
		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		// --- Fetch all favorites with pagination (uses ctx.state for persistence) ---
		async function fetchFavoriteAnime(): Promise<FetchedFavorites> {
			// prettier-ignore
			const query = "query ($page: Int!, $perPage: Int!) { Viewer { favourites { anime(page: $page, perPage: $perPage) { nodes { id title { userPreferred romaji english native  } synonyms coverImage { large } } pageInfo { currentPage hasNextPage } } } } }";
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
					alternativeTitles: [...n.synonyms, n.title.native, n.title.english, n.title.romaji, n.title.userPreferred].filter(
						Boolean
					) as string[],
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
			alternativeTitles?: string[];
		}> {
			// prettier-ignore
			const query = "query ($mediaId: Int!) { Media(id: $mediaId) { id isFavourite title { userPreferred english romaji native } synonyms coverImage { large } } }";

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

			const json: AnilistFavoiteCheckingResponse = await res.json();
			const media = json.data.Media;
			const alternativeTitles = [media.title.romaji, media.title.native, media.title.english, ...media?.synonyms].filter(
				Boolean
			) as string[];

			return {
				isFavourite: Boolean(media?.isFavourite),
				title: media?.title?.userPreferred || "",
				coverImage: media?.coverImage?.large || null,
				alternativeTitles,
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

			const data: StoreEntry[] = res.data.map((m) => [
				m.mediaId.toString(),
				{ title: m.title, coverImage: m.coverImage, alternativeTitles: m.alternativeTitles },
			]);

			$store.set(favoriteStoreId, data);
			isPopulatingCache.set(false);
		}

		// --- Update cache locally using verified state ---
		function updateCache(
			mediaId: number,
			title: string,
			coverImage: string | null,
			isFavourite: boolean,
			alternativeTitles?: string[]
		) {
			const cache = new Map<StoreEntry[0], StoreEntry[1]>($store.get(favoriteStoreId));
			const key = mediaId.toString();

			if (isFavourite) {
				cache.set(key, { title, coverImage, alternativeTitles });
			} else {
				cache.delete(key);
			}

			$store.set(favoriteStoreId, Array.from(cache.entries()));
		}

		// --- UI helpers ---

		/**
		 * Update the button based on `isCurrentMediaFavorite`
		 * @param disabled Whether to enable or disable the button
		 */
		function updateFavoriteTag(disabled: boolean) {
			const styles = { ...btnIconStyles };
			if (disabled) {
				styles.opacity = "0.5";
				styles.pointerEvents = "none";
			}
			favoriteBtn.setStyle(styles);
			favoriteBtn.setIntent(isCurentMediaFavorite.get() ? "alert" : "gray-subtle");
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

			const query = searchQuery.get().trim().toLowerCase();
			const filteredFavorites = favoriteMediaEntries.filter(([, f]) =>
				query.length > 0
					? f.title.toLowerCase().includes(query) || f.alternativeTitles?.some((s) => s.toLowerCase().includes(query))
					: true
			);

			if (!filteredFavorites.length) return [noEntries];

			const sortedFavorites = filteredFavorites.sort(([, a], [, b]) => (a.title ?? "").localeCompare(b.title ?? ""));

			return sortedFavorites.map(([id, media]) => {
				const buttonStyle = {
					background: "transparent",
					border: "none",
					color: "transparent",
					cursor: "pointer",
					height: "100%",
					left: "0px",
					position: "absolute",
					top: "0px",
					width: "100%",
				};

				const coverImage = tray.div([], {
					className: "coverImage",
					style: {
						width: "100%",
						height: "15rem",
						flexShrink: "0",
						flexGrow: "0",
						backgroundImage: `url(${media.coverImage})`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
					},
				});

				const backdrop = tray.div([], {
					className: "backdrop",
					style: {
						background: "linear-gradient(to top, rgba(0,0,0,1)0%, rgba(0,0,0,1)15%, rgba(0,0,0,0)100%)",
						width: "100%",
						height: "100%",
						position: "absolute",
						top: "0",
						left: "0",
					},
				});

				const title = tray.text(String(media.title) || "\u200b", {
					style: {
						userSelect: "none",
						padding: "0 10px",
						lineHeight: "1.2",
						fontWeight: "600",
						fontSize: "14px",
						whiteSpace: "normal",
						wordBreak: "break-word",

						display: "-webkit-box",
						WebkitBoxOrient: "vertical",
						WebkitLineClamp: "3",
						overflow: "hidden",

						maxHeight: "calc(1.2em * 3)",
						position: "absolute",
						bottom: "10px",
						left: "0",
						width: "100%",
					},
				});

				const goToPageBtn = tray.button("", {
					onClick: ctx.eventHandler(`note-navigate-${id}`, () => {
						ctx.screen.navigateTo("/entry", { id });
						tray.close();
					}),
					intent: "gray-subtle",
					style: { ...buttonStyle },
				});

				return tray.flex([coverImage, backdrop, title, goToPageBtn], {
					className: "bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl anilist-favorite-hover",
					direction: "column",
					style: {
						overflow: "hidden",
						position: "relative",
						width: "10rem",
						borderRadius: "0.75em",
					},
				});
			});
		}

		const favoriteBtn = ctx.action.newAnimePageButton({
			label: "\u200b",
			intent: "gray-subtle",
			style: btnIconStyles,
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

			const searchInput = tray.input({
				placeholder: "Search Favorites",
				size: "sm",
				value: searchQuery.get(),
				style: {
					width: "100%",
					margin: "0 0 0 50px",
				},
				onChange: ctx.eventHandler("search", ({ value }: { value: string }) => {
					searchQuery.set(String(value || ""));
				}),
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
					tray.flex(
						[
							pluginIcon,
							tray.stack([header_text, text_SignedIn], {
								gap: 1,
								style: {
									minWidth: "fit-content",
								},
							}),
							searchInput,
						],
						{
							direction: "row",
							gap: 3,
							style: { padding: "10px", flexWrap: "wrap" },
						}
					),
					tray.div([
						tray.flex(isPopulatingCache.get() ? [] : [...formatFavorites(), tray.div([], { style: { flex: "1" } })], {
							gap: 4,
							style: {
								flexWrap: "wrap",
								"overflow-y": "auto",
								"overflow-x": "hidden",
								justifyContent: "center",
								maxHeight: "26rem" /*Based on parent max height*/,
							},
						}),
					]),
				],
				{ gap: 1 }
			);
		});

		tray.onClose(() => searchQuery.set(""));

		// --- Button click handler (toggle → verify → cache → UI) ---
		favoriteBtn.onClick(async (event) => {
			updateFavoriteTag(true);

			const response = await updateAnilistFavoriteEntry(event.media.id);
			await $_wait(2000); // short pause to avoid rate limits

			if (!response.data) return updateFavoriteTag(false);

			// Verify actual state with single query
			const verified = await checkIsFavourite(event.media.id);

			// Update cache based on verified state
			updateCache(event.media.id, verified.title, verified.coverImage, verified.isFavourite);

			// Update UI
			ctx.toast.success(
				verified.isFavourite ? `Added ${verified.title} to Favorites!` : `Removed ${verified.title} from Favorites!`
			);

			isCurentMediaFavorite.set(verified.isFavourite);
			updateFavoriteTag(false);
		});

		// --- Navigation handler (reflect cache on entry pages) ---
		ctx.screen.onNavigate((e) => {
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const id = e.searchParams.id;
				const map = new Map<StoreEntry[0], StoreEntry[1]>($store.get(favoriteStoreId));

				isCurentMediaFavorite.set(map.has(id));
				updateFavoriteTag(false);
			}
		});

		// --- Initial cache population ---
		if ($database.anilist.getToken()) {
			ctx.dom.onReady(async () => {
				const style = await ctx.dom.createElement("style");
				style.setInnerHTML(
					".anilist-favorite-hover:hover .coverImage { transform: scale(1.05); transition: transform 0.3s ease; } .anilist-favorite-hover:hover .backdrop { background: linear-gradient(to top, rgba(0,0,0,1)0%, rgba(0,0,0,0.8)15%, rgba(0,0,0,0)50%)!important; }"
				);
			});

			try {
				await populateCache();
				console.log("Cache populated");
			} catch (e) {
				console.log("Failed to populate cache: " + e);
			}

			favoriteBtn.mount();
			ctx.screen.loadCurrent();
		} else {
			console.log("No token found, caching skipped.");
		}
	});
}
