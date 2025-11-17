/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />

function init() {
	$ui.register(async (ctx) => {
		// --- Types ---
		interface AnilistViewer {
			data: {
				Viewer: {
					favourites: {
						anime: {
							nodes: {
								id: number;
								title: { userPreferred: string };
								coverImage: { medium: string | null };
							}[];
							pageInfo: { currentPage: number; hasNextPage: boolean };
						};
					};
				};
			};
		}

		interface AnilistError {
			data: null;
			errors: { message: string; status: number }[];
		}

		interface AnilistFavoriteData {
			data: {
				anime: {
					nodes: {
						id: number;
						title: { userPreferred: string };
						coverImage: { medium: string | null };
						isFavourite: boolean;
					}[];
				};
			};
		}

		type StoreEntry = [string, { title: string; coverImage: string | null }];

		type FetchedFavorites =
			| {
					data: { mediaId: number; title: string; coverImage: string | null }[];
					error: undefined;
			  }
			| { data: null; error: string };

		// --- State ---
		// prettier-ignore
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Anilist%20Favorites/icon.png";
		const isUpdating = ctx.state<boolean>(false);
		const isPopulatingCache = ctx.state<boolean>(false);
		const storeId = "anilist-favorite";

		// Persisted pagination states
		const page = ctx.state<number>(1);
		const hasNextPage = ctx.state<boolean>(false);
		const ids = ctx.state<
			{ mediaId: number; title: string; coverImage: string | null }[]
		>([]);

		// --- Utility ---
		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		// --- Fetch all favorites with pagination (uses ctx.state for persistence) ---
		async function fetchFavoriteAnime(): Promise<FetchedFavorites> {
			// prettier-ignore
			const query = "query ($page: Int!, $perPage: Int!) { Viewer { favourites { anime(page: $page, perPage: $perPage) { nodes { id title { userPreferred } coverImage { medium } } pageInfo { currentPage hasNextPage } } } } }";
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
					coverImage: n.coverImage.medium,
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
			const query = `
        mutation ($mediaId: Int!) {
          ToggleFavourite(animeId: $mediaId) {
            anime { nodes { id } }
          }
        }`;

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
			const query = "query ($mediaId: Int!) { Media(id: $mediaId) { id isFavourite title { userPreferred } coverImage { medium } } }";

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
				coverImage: media?.coverImage?.medium || null,
			};
		}

		// --- Populate cache once (initial/full sync) ---
		async function populateCache() {
			isPopulatingCache.set(true);
			const res = await fetchFavoriteAnime();
			if (!res.data) {
				ctx.toast.error(
					"Error populating cache [Anilist Favorites]: " + res.error
				);
				return;
			}

			$store.set(
				storeId,
				res.data.map<StoreEntry>((m) => [
					m.mediaId.toString(),
					{ title: m.title, coverImage: m.coverImage },
				])
			);
			isPopulatingCache.set(false);
		}

		// --- Update cache locally using verified state ---
		function updateCache(
			mediaId: number,
			title: string,
			coverImage: string | null,
			isFavourite: boolean
		) {
			const cache = new Map<StoreEntry[0], StoreEntry[1]>($store.get(storeId));
			const key = mediaId.toString();

			if (isFavourite) {
				cache.set(key, { title, coverImage });
			} else {
				cache.delete(key);
			}

			$store.set(storeId, Array.from(cache.entries()));
		}

		// --- UI helpers ---
		function updateFavoriteTag(isFavorite: boolean) {
			favoriteBtn.setLabel(isFavorite ? "Favorite" : "Set as favorite");
			favoriteBtn.setIntent(isFavorite ? "alert" : "gray-subtle");
			if ($database.anilist.getToken()) favoriteBtn.mount();
		}

		function formatFavorites() {
			type K = StoreEntry[0];
			type V = StoreEntry[1];

			const data = $store
				.get(storeId)
				.sort(([, a]: [K, V], [, b]: [K, V]) =>
					(a.title ?? "").localeCompare(b.title ?? "")
				)
				.map(([id, entry]: [K, V]) => {
					const buttonStyle = {
						wordBreak: "unset",
						width: "100%",
						fontSize: "12px",
						alignSelf: "bottom",
						"border-top-left-radius": "0",
						"border-top-right-radius": "0",
					};

					const title = tray.text(String(entry.title) || "\u200b", {
						style: {
							"user-select": "none",
							padding: "0 5px 10px 5px",
							lineHeight: "1.2",
							fontWeight: "600",
						},
					});

					const coverImage = tray.div([], {
						style: {
							width: "100%",
							height: "15rem",
							flexShrink: "0",
							flexGrow: "0",
							backgroundImage: `url(${entry.coverImage})`,
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "top",
							borderRadius: "0.75em 0.75em 0 0",
						},
					});

					const button = tray.button("Go to Page", {
						onClick: ctx.eventHandler(`note-navigate-${id}`, () => {
							ctx.toast.info("Navigating to " + entry.title);
							ctx.screen.navigateTo("/entry", { id });
							tray.close();
						}),
						intent: "gray-subtle",
						style: { ...buttonStyle },
					});

					const gap = tray.div([], { style: { "flex-grow": "1" } });

					return tray.flex([coverImage, title, gap, button], {
						className:
							"bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl",
						direction: "column",
						style: {
							width: "10rem",
						},
					});
				});

			if (data.length <= 0) {
				return [
					tray.text("No Entries", {
						className:
							"bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl",
						style: {
							textAlign: "center",
							padding: "25px 0",
							fontSize: "1.5em",
							fontWeight: "500",
							color: "#666",
						},
					}),
				];
			}
			return data;
		}

		const favoriteBtn = ctx.action.newAnimePageButton({
			label: "Private",
			intent: "gray-subtle",
		});

		// --- Tray render (Viewer for anilist) ---
		const tray = ctx.newTray({ iconUrl, withContent: true, width: "45rem" });
		tray.render(() => {
			if (!$database.anilist.getToken())
				return tray.flex(
					[
						tray.div([], {
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
						}),
						tray.stack(
							[
								tray.text("AniList Favorites", {
									style: {
										fontSize: "1.2em",
										"font-weight": "700",
										"user-select": "none",
									},
								}),
								tray.text(
									"You need to be logged in to Anilist to use this plugin.",
									{
										style: {
											fontSize: "13px",
											color: "#e26f6fff",
											lineHeight: "normal",
											wordBreak: "unset",
											"user-select": "none",
										},
									}
								),
							],
							{ gap: 1 }
						),
					],
					{ direction: "row", gap: 3, style: { padding: "10px" } }
				);

			return tray.stack(
				[
					tray.flex(
						[
							tray.div([], {
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
							}),
							tray.stack(
								[
									tray.text("AniList Favorites", {
										style: {
											fontSize: "1.2em",
											"font-weight": "700",
											"user-select": "none",
										},
									}),
									tray.text("Browse your Favorite Anime", {
										style: {
											fontSize: "13px",
											color: "#666",
											lineHeight: "normal",
											wordBreak: "unset",
											"user-select": "none",
											fontWeight: "500",
										},
									}),
								],
								{ gap: 1 }
							),
						],
						{ direction: "row", gap: 3, style: { padding: "10px" } }
					),
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
			if (isUpdating.get()) {
				return ctx.toast.warning("Currently updating data... Please wait");
			}

			const mediaId = event.media.id;
			const mediaTitle = event.media.title?.userPreferred || "current entry";
			ctx.toast.info(`Updating ${mediaTitle}...`);
			isUpdating.set(true);

			const response = await updateAnilistFavoriteEntry(mediaId);
			await $_wait(2000); // short pause to avoid rate limits

			if (!response.data) {
				isUpdating.set(false);
				return ctx.toast.error(
					`Failed to update ${mediaTitle}!\n\n${response.error}`
				);
			}

			// Verify actual state with single query
			const verified = await checkIsFavourite(mediaId);

			// Update cache based on verified state
			updateCache(
				mediaId,
				verified.title,
				verified.coverImage,
				verified.isFavourite
			);

			// Update UI
			updateFavoriteTag(verified.isFavourite);
			ctx.toast.success(
				verified.isFavourite
					? `Added ${verified.title} to Favorites!`
					: `Removed ${verified.title} from Favorites!`
			);

			isUpdating.set(false);
		});

		// --- Navigation handler (reflect cache on entry pages) ---
		ctx.screen.onNavigate((e) => {
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const id = e.searchParams.id;
				const map = new Map<StoreEntry[0], StoreEntry[1]>($store.get(storeId));
				updateFavoriteTag(map.has(id));
			}

			console.log($store.get(storeId));
		});

		// --- Initial cache population ---
		if ($database.anilist.getToken()) {
			populateCache();
		}

		ctx.screen.loadCurrent();
	});
}
