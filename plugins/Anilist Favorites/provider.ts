/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./anilist-favorites.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		// prettier-ignore
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Anilist%20Favorites/icon.png";
		const tray = ctx.newTray({ iconUrl, withContent: true });

		enum Tabs {
			General = 1,
			Media = 2,
			People = 3,
			PeopleSpecific = 4,
		}

		const state = {
			isCurrentMediaFavorite: ctx.state<boolean>(false),
			isFetching: ctx.state<boolean>(false),
			searchQuery: ctx.state<string>(""),
			currentPerson: ctx.state<
				| $favorite.FavoriteCharactersFetchResponse["Viewer"]["favourites"]["characters"]["nodes"][number]
				| $favorite.FavoriteStaffFetchResponse["Viewer"]["favourites"]["staff"]["nodes"][number]
				| null
			>(null),
		};

		const favorites = {
			types: {
				anime: {
					get cache(): Record<number, $favorite.FavoriteAnimeFetchResponse["Viewer"]["favourites"]["anime"]["nodes"][number]> {
						return $store.getOrSet("favorites:types:anime", () => ({}));
					},
					cacheInfo: {
						get currentPage() {
							return $store.getOrSet("favorites:types:anime:currentPage", () => 0);
						},
						get hasNextPage() {
							return $store.getOrSet("favorites:types:anime:hasNextPage", () => true);
						},
					},
					async fetchNextPage() {
						if (!this.cacheInfo.hasNextPage)
							throw new Error("No page remaining. Please check cacheInfo#hasNextPage before calling fetchNextPage() to prevent these types of error.");
						// prettier-ignore
						const query = "query ($page: Int) { Viewer { favourites { anime(page: $page, perPage: 50) { pageInfo { currentPage hasNextPage } nodes { id title { romaji english native userPreferred } synonyms coverImage { large } format seasonYear type } } } } }";
						const data: $favorite.FavoriteAnimeFetchResponse = await favorites.fetch(query, { page: this.cacheInfo.currentPage + 1 });

						$store.set("favorites:types:anime:currentPage", data.Viewer.favourites.anime.pageInfo.currentPage);
						$store.set("favorites:types:anime:hasNextPage", data.Viewer.favourites.anime.pageInfo.hasNextPage);

						const cache = this.cache;
						for (const media of data.Viewer.favourites.anime.nodes) {
							cache[media.id] = media;
						}
						$store.set("favorites:types:anime", cache);
						tray.update();
						return cache;
					},
					async toggle(mediaId: number) {
						await favorites.fetch("mutation ($mediaId: Int!) { ToggleFavourite( animeId: $mediaId) { anime { nodes { id } } } }", { mediaId });

						await $_wait(1_500);
						// prettier-ignore
						const query = "query ($mediaId: Int!) { Media(id: $mediaId) { id isFavourite title { userPreferred english romaji native } synonyms coverImage { large } format seasonYear type } }";
						const res: { Media: $favorite.FavoriteAnimeFetchResponse["Viewer"]["favourites"]["anime"]["nodes"][number] & { isFavourite: boolean } } =
							await favorites.fetch(query, { mediaId });

						const { isFavourite, ...media } = res.Media;
						const cache = this.cache;

						if (isFavourite) {
							cache[media.id] = media;
						} else {
							delete cache[mediaId];
						}

						$store.set("favorites:types:anime", cache);
						tray.update();
						return isFavourite;
					},
				},
				manga: {
					get cache(): Record<number, $favorite.FavoriteMangaFetchResponse["Viewer"]["favourites"]["manga"]["nodes"][number]> {
						return $store.getOrSet("favorites:types:manga", () => ({}));
					},
					cacheInfo: {
						get currentPage() {
							return $store.getOrSet("favorites:types:manga:currentPage", () => 0);
						},
						get hasNextPage() {
							return $store.getOrSet("favorites:types:manga:hasNextPage", () => true);
						},
					},
					async fetchNextPage() {
						if (!this.cacheInfo.hasNextPage)
							throw new Error("No page remaining. Please check cacheInfo#hasNextPage before calling fetchNextPage() to prevent these types of error.");
						// prettier-ignore
						const query = "query ($page: Int) { Viewer { favourites { manga(page: $page, perPage: 50) { pageInfo { currentPage hasNextPage } nodes { id title { romaji english native userPreferred } synonyms coverImage { large } format seasonYear type } } } } }";
						const data: $favorite.FavoriteMangaFetchResponse = await favorites.fetch(query, { page: this.cacheInfo.currentPage + 1 });

						$store.set("favorites:types:manga:currentPage", data.Viewer.favourites.manga.pageInfo.currentPage);
						$store.set("favorites:types:manga:hasNextPage", data.Viewer.favourites.manga.pageInfo.hasNextPage);

						const cache = this.cache;
						for (const media of data.Viewer.favourites.manga.nodes) {
							cache[media.id] = media;
						}
						$store.set("favorites:types:manga", cache);
						return cache;
					},
					async toggle(mediaId: number) {
						await favorites.fetch("mutation ($mediaId: Int!) { ToggleFavourite( mangaId: $mediaId) { manga { nodes { id } } } }", { mediaId });

						await $_wait(1_000);
						// prettier-ignore
						const query = "query ($mediaId: Int!) { Media(id: $mediaId) { id isFavourite title { userPreferred english romaji native } synonyms coverImage { large } format seasonYear type } }";
						const res: { Media: $favorite.FavoriteMangaFetchResponse["Viewer"]["favourites"]["manga"]["nodes"][number] & { isFavourite: boolean } } =
							await favorites.fetch(query, { mediaId });

						const { isFavourite, ...media } = res.Media;
						const cache = this.cache;

						if (isFavourite) {
							cache[media.id] = media;
						} else {
							delete cache[mediaId];
						}

						$store.set("favorites:types:manga", cache);
						tray.update();
						return isFavourite;
					},
				},
				characters: {
					get cache(): Record<number, $favorite.FavoriteCharactersFetchResponse["Viewer"]["favourites"]["characters"]["nodes"][number]> {
						return {
							...$store.getOrSet("favorites:types:characters", () => ({})),
						};
					},
					cacheInfo: {
						get currentPage() {
							return $store.getOrSet("favorites:types:characters:currentPage", () => 0);
						},
						get hasNextPage() {
							return $store.getOrSet("favorites:types:characters:hasNextPage", () => true);
						},
					},
					async fetchNextPage() {
						if (!this.cacheInfo.hasNextPage)
							throw new Error("No page remaining. Please check cacheInfo#hasNextPage before calling fetchNextPage() to prevent these types of error.");
						// prettier-ignore
						const query = "query ($page: Int) { Viewer { favourites { characters(page: $page, perPage: 50) { pageInfo { currentPage hasNextPage } nodes { id name { full native alternative } image { large } description(asHtml: false) gender dateOfBirth { day month year } age bloodType media(page: 1, perPage: 50) { pageInfo { currentPage hasNextPage } edges { node { id type title { userPreferred } synonyms coverImage { large } format seasonYear } voiceActors { id name { full native } languageV2 image { large } } } } } } } } }";
						const data: $favorite.FavoriteCharactersFetchResponse = await favorites.fetch(query, { page: this.cacheInfo.currentPage + 1 });

						$store.set("favorites:types:characters:currentPage", data.Viewer.favourites.characters.pageInfo.currentPage);
						$store.set("favorites:types:characters:hasNextPage", data.Viewer.favourites.characters.pageInfo.hasNextPage);

						const cache = this.cache;
						for (const character of data.Viewer.favourites.characters.nodes) {
							character.media.edges = character.media.edges.filter((e) => !["NOVEL", "ONE_SHOT"].includes(e.node.format));

							cache[character.id] = character;
						}
						$store.set("favorites:types:characters", cache);
						return cache;
					},
					async fetchNextMediaPage(characterPage: $favorite.FavoriteCharactersFetchResponse["Viewer"]["favourites"]["characters"]["nodes"][number]) {
						if (!characterPage.media.pageInfo.hasNextPage)
							throw new Error("No page remaining. Please check cacheInfo#hasNextPage before calling fetchNextPage() to prevent these types of error.");

						// prettier-ignore
						const query = "query ($characterId: Int!, $characterMediaPage: Int!) { Character(id: $characterId) { media(page: $characterMediaPage, perPage: 50) { pageInfo { currentPage hasNextPage } edges { node { id type title { userPreferred } coverImage { large } format seasonYear } voiceActors { id name { full native } languageV2 image { large } } } } } }";
						const data: $favorite.FavoriteCharactersFetchResponse["Viewer"]["favourites"]["characters"]["nodes"][number]["media"] = await favorites.fetch(
							query,
							{ characterId: characterPage.id, characterMediaPage: characterPage.media.pageInfo.currentPage + 1 }
						);

						const cache = this.cache;
						cache[characterPage.id].media.pageInfo = {
							hasNextPage: data.pageInfo.hasNextPage,
							currentPage: data.pageInfo.currentPage,
						};

						cache[characterPage.id].media.edges.push(...data.edges);

						$store.set("favorites:types:characters", cache);
						return cache;
					},
				},
				staff: {
					get cache(): Record<number, $favorite.FavoriteStaffFetchResponse["Viewer"]["favourites"]["staff"]["nodes"][number]> {
						return {
							...$store.getOrSet("favorites:types:staff", () => ({})),
						};
					},
					cacheInfo: {
						get currentPage() {
							return $store.getOrSet("favorites:types:staff:currentPage", () => 0);
						},
						get hasNextPage() {
							return $store.getOrSet("favorites:types:staff:hasNextPage", () => true);
						},
					},
					async fetchNextPage() {
						if (!this.cacheInfo.hasNextPage)
							throw new Error("No page remaining. Please check cacheInfo#hasNextPage before calling fetchNextPage() to prevent these types of error.");

						// prettier-ignore
						const query = "query ($page: Int) { Viewer { favourites { staff(page: $page, perPage: 50) { pageInfo { currentPage hasNextPage } nodes { id name { full native alternative } image { large } description(asHtml: false) gender dateOfBirth { day month year } age bloodType languageV2 staffMedia: staffMedia(page: 1, perPage: 50) { pageInfo { currentPage hasNextPage } edges { node { id type title { userPreferred } synonyms coverImage { large } format seasonYear } staffRole } } } } } } }";
						const data: $favorite.FavoriteStaffFetchResponse = await favorites.fetch(query, { page: this.cacheInfo.currentPage + 1 });

						$store.set("favorites:types:staff:currentPage", data.Viewer.favourites.staff.pageInfo.currentPage);
						$store.set("favorites:types:staff:hasNextPage", data.Viewer.favourites.staff.pageInfo.hasNextPage);

						const cache = this.cache;
						for (const staff of data.Viewer.favourites.staff.nodes) {
							cache[staff.id] = staff;
						}
						$store.set("favorites:types:staff", cache);
						return cache;
					},
					async fetchNextMediaPage(staff: $favorite.FavoriteStaffFetchResponse["Viewer"]["favourites"]["staff"]["nodes"][number]) {
						if (!staff.staffMedia.pageInfo.hasNextPage)
							throw new Error("No page remaining. Please check cacheInfo#hasNextPage before calling fetchNextPage() to prevent these types of error.");

						// prettier-ignore
						const query = "query ($staffId: Int!, $staffMediaPage: Int!) { Staff(id: $staffId) { staffMedia(page: $staffMediaPage, perPage: 50) { pageInfo { currentPage hasNextPage } edges { staffRole node { id type title synonyms { userPreferred } coverImage { large } format seasonYear } } } } }";
						const data: $favorite.FavoriteStaffFetchResponse["Viewer"]["favourites"]["staff"]["nodes"][number]["staffMedia"] = await favorites.fetch(
							query,
							{ staffId: staff.id, staffMediaPage: staff.staffMedia.pageInfo.currentPage + 1 }
						);

						const cache = this.cache;
						cache[staff.id].staffMedia.pageInfo = {
							hasNextPage: data.pageInfo.hasNextPage,
							currentPage: data.pageInfo.currentPage,
						};

						cache[staff.id].staffMedia.edges.push(...data.edges);

						$store.set("favorites:types:staff", cache);
						return cache;
					},
				},
				studios: {
					get cache(): Record<number, $favorite.FavoriteStudiosFetchResponse["Viewer"]["favourites"]["studios"]["nodes"][number]> {
						return {
							...$store.getOrSet("favorites:types:studios", () => ({})),
						};
					},
					cacheInfo: {
						get currentPage() {
							return $store.getOrSet("favorites:types:studios:currentPage", () => 0);
						},
						get hasNextPage() {
							return $store.getOrSet("favorites:types:studios:hasNextPage", () => true);
						},
					},
					async fetchNextPage() {
						if (!this.cacheInfo.hasNextPage)
							throw new Error("No page remaining. Please check cacheInfo#hasNextPage before calling fetchNextPage() to prevent these types of error.");

						// prettier-ignore
						const query = "query ($page: Int) { Viewer { favourites { studios(page: $page, perPage: 50) { pageInfo { currentPage hasNextPage } nodes { id name siteUrl } } } } }";
						const data: $favorite.FavoriteStudiosFetchResponse = await favorites.fetch(query, { page: this.cacheInfo.currentPage + 1 });

						$store.set("favorites:types:studios:currentPage", data.Viewer.favourites.studios.pageInfo.currentPage);
						$store.set("favorites:types:studios:hasNextPage", data.Viewer.favourites.studios.pageInfo.hasNextPage);

						const cache = this.cache;
						for (const studios of data.Viewer.favourites.studios.nodes) {
							cache[studios.id] = studios;
						}
						$store.set("favorites:types:studios", cache);
						return cache;
					},
				},
			},
			hasInitialized: ctx.state<boolean>(false),
			async init() {
				if (this.hasInitialized.get()) throw new Error("Already initialized");
				// prettier-ignore
				const query = "query { Viewer { favourites { anime(page: 1, perPage: 50) { pageInfo { currentPage hasNextPage } nodes { id title { romaji english native userPreferred } synonyms coverImage { large } format seasonYear type } } manga(page: 1, perPage: 50) { pageInfo { currentPage hasNextPage } nodes { id title { romaji english native userPreferred } synonyms coverImage { large } format seasonYear type } } characters(page: 1, perPage: 50) { pageInfo { currentPage hasNextPage } nodes { id name { full native alternative } image { large } description(asHtml: false) gender dateOfBirth { day month year } age bloodType media(page: 1, perPage: 50) { pageInfo { currentPage hasNextPage } edges { node { id type title { userPreferred } coverImage { large } format seasonYear } voiceActors { id name { full native } languageV2 image { large } } } } } } staff(page: 1, perPage: 50) { pageInfo { currentPage hasNextPage } nodes { id name { full native alternative } image { large } description(asHtml: false) gender dateOfBirth { day month year } age bloodType languageV2 staffMedia(page: 1, perPage: 50) { pageInfo { currentPage hasNextPage } edges { staffRole node { id type title { userPreferred } coverImage { large } format seasonYear } } } } } studios(page: 1, perPage: 50) { pageInfo { currentPage hasNextPage } nodes { id name siteUrl } } } } }";
				const res: $favorite.InitFetchResponse = await this.fetch(query);

				for (const key of Object.keys(res.Viewer.favourites) as Array<keyof typeof res.Viewer.favourites>) {
					$store.set(`favorites:types:${key}:currentPage`, res.Viewer.favourites[key].pageInfo.currentPage);
					$store.set(`favorites:types:${key}:hasNextPage`, res.Viewer.favourites[key].pageInfo.hasNextPage);

					const nodes = res.Viewer.favourites[key].nodes;
					if (key === "characters") {
						for (const character of res.Viewer.favourites[key].nodes) {
							character.media.edges = character.media.edges.filter((e) => !["NOVEL", "ONE_SHOT"].includes(e.node.format));
						}
						$store.set(
							`favorites:types:${key}`,
							nodes.reduce((acc, entry) => {
								acc[entry.id] = entry;
								return acc;
							}, {} as Record<number, (typeof nodes)[number]>)
						);
					} else {
						$store.set(
							`favorites:types:${key}`,
							res.Viewer.favourites[key].nodes.reduce((acc, entry) => {
								acc[entry.id] = entry;
								return acc;
							}, {} as Record<number, (typeof nodes)[number]>)
						);
					}
				}

				return this.hasInitialized.set(true);
			},
			async refetch() {
				this.hasInitialized.set(false);
				for (const key of Object.keys(this.types) as Array<keyof typeof this.types>) {
					$store.set(`favorites:types:${key}`, {});
					$store.set(`favorites:types:${key}:currentPage`, 0);
					$store.set(`favorites:types:${key}:hasNextPage`, true);
				}
				return this.init();
			},
			async fetch(query: string, variables?: Record<string, any>) {
				const res = await ctx.fetch("https://graphql.anilist.co", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${$database.anilist.getToken()}`,
					},
					body: JSON.stringify({ query, variables }),
				});

				if (!res.ok) {
					let err = null;
					try {
						err = res.json();
					} catch {
						err = null;
					}
					console.log(err?.errors?.map((m: any) => m.message).join(" ") ?? res.statusText);
					throw new Error(err?.errors?.map((m: any) => m.message).join(" ") ?? res.statusText);
				}

				return res.json().data;
			},
		};

		const tabs = {
			current: ctx.state<Tabs>(Tabs.General),
			previous: ctx.state<Tabs>(Tabs.General),
			type: ctx.state<"ANIME" | "MANGA" | "CHARACTERS" | "STAFF">("ANIME"),
			styles: {
				media: {
					minWidth: "8rem",
					minHeight: "12rem",
					padding: "0.5rem",
					borderRadius: "0.5rem",
				},
				people: {
					width: "5.5rem",
					height: "5.5rem",
					borderRadius: "50%",
				},
				pill: {
					width: "6rem",
					height: "1rem",
				},
			},
			loadingRect() {
				return tray.div([], {
					className: "animate-pulse",
					style: { ...tabs.styles.media, backgroundColor: "rgb(var(--color-gray-800))" },
				});
			},

			loadingCircles() {
				return tray.stack(
					[
						tray.div([], {
							className: "animate-pulse",
							style: { ...tabs.styles.people, backgroundColor: "rgb(var(--color-gray-800))" },
						}),
						tabs.loadingPill("5.5rem"),
						tabs.loadingPill("7.5rem"),
					],
					{
						gap: 1,
						style: { width: tabs.styles.media.minWidth, justifyContent: "center", alignItems: "center" },
					}
				);
			},

			loadingPill(width?: string, height?: string) {
				return tray.div([], {
					className: "animate-pulse",
					style: {
						width: width ?? tabs.styles.pill.width,
						height: height ?? tabs.styles.pill.height,
						borderRadius: "9999px",
						backgroundColor: "rgb(var(--color-gray-800))",
					},
				});
			},

			noEntries() {
				return tray.text("No entries yet", {
					style: {
						width: "100%",
						height: "100%",
						alignSelf: "center",
						justifySelf: "center",
						textAlign: "center",
						padding: "1rem",
						opacity: "0.8",
					},
				});
			},

			formatMediaCard(
				media:
					| $favorite.FavoriteAnimeFetchResponse["Viewer"]["favourites"]["anime"]["nodes"][number]
					| $favorite.FavoriteMangaFetchResponse["Viewer"]["favourites"]["manga"]["nodes"][number]
			) {
				return tray.stack(
					[
						tray.div([], {
							className: "favorites-tab-general-entry-card-background",
							style: {
								...tabs.styles.media,
								pointerEvents: "none",
								position: "absolute",
								backgroundImage: `url(${media.coverImage.large})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 100%)",
							},
						}),
						tray.stack(
							[
								tray.flex(
									[
										media.seasonYear ? tray.text(`${media.seasonYear}`, { style: { wordBreak: "normal" } }) : [],
										tray.text(`${media.format}`, { style: { wordBreak: "normal" } }),
									],
									{
										style: {
											fontSize: "0.65rem",
											fontWeight: "bold",
											width: "fit-content",
											background: "rgb(var(--color-gray-900) / 0.8)",
											padding: "0 0.5rem",
											borderRadius: "0.5rem",
										},
									}
								),
								tray.text(`${media.title.userPreferred}`, {
									style: {
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "-webkit-box",
										"-webkit-line-clamp": "3",
										"-webkit-box-orient": "vertical",
										fontSize: "0.8rem",
										lineHeight: "normal",
									},
								}),
							],
							{
								style: {
									width: "100%",
									height: "100%",
									padding: "0.5rem",
									justifyContent: "space-between",
									zIndex: "2",
									textShadow: "0 0 10px black",
								},
							}
						),
						// Button
						tray.button("\u200b", {
							onClick: ctx.eventHandler(`navigate-to:${media.id}`, () => {
								const path = String(media.type) === "ANIME" ? "/entry" : "/manga/entry";
								ctx.screen.navigateTo(path, { id: media.id.toString() });
								tray.close();
								tabs.current.set(Tabs.General);
							}),
							style: {
								width: "calc(100% + 0.5rem)",
								height: "calc(100% + 0.5rem)",
								position: "absolute",
								marginTop: "-0.5em",
								marginLeft: "-0.5rem",
								zIndex: "2",
								background: "none",
							},
						}),
					],
					{
						className: "favorites-tab-general-container",
						style: {
							minWidth: tabs.styles.media.minWidth,
							minHeight: tabs.styles.media.minHeight,
							width: tabs.styles.media.minWidth,
							height: tabs.styles.media.minHeight,
							borderRadius: tabs.styles.media.borderRadius,
							border: "1px solid var(--border)",
							overflow: "hidden",
							position: "relative",
						},
					}
				);
			},

			formatPeopleCard(
				people:
					| $favorite.FavoriteCharactersFetchResponse["Viewer"]["favourites"]["characters"]["nodes"][number]
					| $favorite.FavoriteStaffFetchResponse["Viewer"]["favourites"]["staff"]["nodes"][number]
			) {
				return tray.stack(
					[
						tray.div([], {
							style: { ...tabs.styles.people, backgroundImage: `url(${people.image.large})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" },
						}),
						tray.text(`${people.name.full}`, {
							style: {
								marginTop: "0.75rem",
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								"-webkit-line-clamp": "3",
								"-webkit-box-orient": "vertical",
								fontSize: "0.8rem",
								opacity: "0.9",
								textAlign: "center",
								lineHeight: "normal",
								fontWeight: "bold",
							},
						}),
						tray.div(
							[
								tray.text(`${"media" in people ? people.media.edges[0]?.node.title.userPreferred : people.languageV2}`, {
									style: {
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "-webkit-box",
										"-webkit-line-clamp": "3",
										"-webkit-box-orient": "vertical",
										fontSize: "0.7rem",
										opacity: "0.6",
										textAlign: "center",
										lineHeight: "normal",
									},
								}),
							],
							{ style: { flex: "1" } }
						),
						// Button
						tray.button("\u200b", {
							onClick: ctx.eventHandler(`navigate-to:${people.id}`, () => {
								state.currentPerson.set(people);
								tabs.current.set(Tabs.PeopleSpecific);
								tabs.previous.set(Tabs.People);
							}),
							style: {
								width: "calc(100% + 0.5rem)",
								height: "calc(100% + 0.5rem)",
								position: "absolute",
								marginTop: "-0.5em",
								marginLeft: "-0.5rem",
								zIndex: "2",
								background: "none",
							},
						}),
					],
					{
						gap: 1,
						className: "hover:bg-gray-800",
						style: {
							minWidth: tabs.styles.media.minWidth,
							width: tabs.styles.media.minWidth,
							justifyContent: "center",
							alignItems: "center",
							padding: "0.5rem",
							position: "relative",
							borderRadius: "0.75rem",
						},
					}
				);
			},

			parseMarkdownText(md: string) {
				const res: any[] = [];

				function emitLine(line: string) {
					const lineRes: any[] = [];
					const linkRegex = /\[(.*?)\]\((.*?)\)/g;
					let lastIndex = 0;
					let match;

					while ((match = linkRegex.exec(line)) !== null) {
						if (match.index > lastIndex) {
							const before = line.slice(lastIndex, match.index);
							processStyledText(before, lineRes);
						}

						lineRes.push(
							tray.anchor(match[1], {
								href: match[2],
								style: { textDecoration: "underline", color: "var(--blue)" },
							})
						);

						lastIndex = linkRegex.lastIndex;
					}

					// Remaining text after last link
					if (lastIndex < line.length) {
						const after = line.slice(lastIndex);
						processStyledText(after, lineRes);
					}

					// Wrap the whole line in a div
					res.push(tray.div(lineRes));
				}

				function processStyledText(text: string, lineRes: any[]) {
					// Headings
					if (/^#{1,6}\s/.test(text)) {
						const heading = text.replace(/^#{1,6}\s*/, "");
						lineRes.push(tray.text(heading, { style: { fontWeight: "bold", fontSize: "1.25rem" } }));
						return;
					}

					// Bold (**text**)
					text = text.replace(/\*\*(.*?)\*\*/g, (_, bold) => {
						lineRes.push(
							tray.text(`${bold}`, {
								style: { fontWeight: "bold", display: "inline" },
							})
						);
						return "";
					});

					// Underline (__text__)
					text = text.replace(/__(.*?)__/g, (_, underline) => {
						lineRes.push(
							tray.text(`${underline}`, {
								style: { textDecoration: "underline", display: "inline" },
							})
						);
						return "";
					});

					// Italic
					text = text.replace(/\*(.*?)\*/g, (_, italic) => {
						lineRes.push(tray.text(`${italic}`, { style: { fontStyle: "italic", display: "inline" } }));
						return "";
					});

					// Inline code
					text = text.replace(/`(.*?)`/g, (_, code) => {
						lineRes.push(tray.text(`${code}`, { style: { fontFamily: "monospace", backgroundColor: "#eee", display: "inline" } }));
						return "";
					});

					// Spoilers (~! text !~)
					text = text.replace(/~!(.*?)!~/g, (_, spoiler) => {
						lineRes.push(
							tray.text(`${spoiler}`, {
								className: "favorites-spoiler",
								style: {
									cursor: "pointer",
									display: "inline",
								},
							})
						);
						return "";
					});

					// Lists
					if (/^[-*]\s+/.test(text)) {
						const item = text.replace(/^[-*]\s+/, "• ");
						lineRes.push(tray.text(`${item}`, { style: { marginLeft: "1rem", display: "inline" } }));
						return;
					}

					// Fallback plain text
					if (text.length > 0) {
						lineRes.push(tray.text(`${text}`, { style: { display: "inline" } }));
					}
				}

				const lines = md.split(/\n/);
				for (const line of lines) {
					if (line.length > 0) {
						emitLine(line);
					} else {
						res.push(tray.div([])); // preserve blank lines
					}
				}

				return res;
			},

			[Tabs.General]() {
				const moreButtonOpts = {
					className: "bg-transparent",
					intent: "gray-subtle" as $ui.Intent,
					disabled: !favorites.hasInitialized.get() || state.isFetching.get(),
					style: {
						borderRadius: "9999px",
						backgroundImage:
							"url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIj48cGF0aCBzdHJva2U9IiNjYWNhY2EiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJtNyAxNiA2LTYtNi02Ii8+PC9zdmc+)",
						backgroundPosition: "calc(100% - 0.5rem) center",
						backgroundRepeat: "no-repeat",
						backgroundSize: "1.1rem",
						paddingInlineEnd: "2.3rem",
						marginRight: "0.5rem",
					},
				};

				const header = tray.flex(
					[
						tray.div([], {
							style: {
								width: "2.5rem",
								height: "2.5rem",
								marginTop: "-0.3rem",
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
								tray.text("Anilist Favorites", { style: { fontSize: "1.2em", fontWeight: "bold" } }),
								tray.text("Browse your favorite entries", { style: { fontSize: "0.8em" }, className: "opacity-30" }),
							],
							{
								style: {
									lineHeight: "1em",
									width: "100%",
								},
							}
						),
						tray.flex(
							[
								tray.button("\u200b", {
									intent: "gray-subtle",
									loading: state.isFetching.get() || !favorites.hasInitialized.get(),
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										// prettier-ignore
										backgroundImage: state.isFetching.get() || !favorites.hasInitialized.get() ? "" : "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDNhNSA1IDAgMSAwIDQuNTQ2IDIuOTE0LjUuNSAwIDAgMSAuOTA4LS40MTdBNiA2IDAgMSAxIDggMnoiLz48cGF0aCBkPSJNOCA0LjQ2NlYuNTM0YS4yNS4yNSAwIDAgMSAuNDEtLjE5MmwyLjM2IDEuOTY2Yy4xMi4xLjEyLjI4NCAwIC4zODRMOC40MSA0LjY1OEEuMjUuMjUgMCAwIDEgOCA0LjQ2NiIvPjwvc3ZnPg==)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem 1rem",
										padding: "0",
										paddingInlineStart: "0.5rem",
									},
									onClick: ctx.eventHandler(`refresh-favorites`, () => {
										state.isFetching.set(true);
										favorites
											.refetch()
											.then(() => ctx.setTimeout(() => ctx.toast.success("Successfully refetched favorites from AniList!"), 2_000))
											.catch((err) => ctx.toast.error(`An error occured while fetching favorites: ${err.message}`))
											.finally(() =>
												ctx.setTimeout(() => {
													state.isFetching.set(false);
													tray.update();
												}, 2_000)
											);
									}),
								}),
							],
							{
								style: {
									alignItems: "center",
								},
							}
						),
					],
					{
						gap: 3,
						style: {
							marginBottom: "1rem",
						},
					}
				);

				const animeCache = Object.values(favorites.types.anime.cache);
				const animeEntries = favorites.hasInitialized.get() ? animeCache.map(this.formatMediaCard) : Array.from({ length: 6 }).map(this.loadingRect);
				const anime = tray.stack([
					tray.flex(
						[
							tray.text(`Anime (${favorites.hasInitialized.get() ? animeCache.length : "..."})`, {
								style: { fontSize: "1.1rem", borderBottom: "1px solid var(--border)" },
							}),
							tray.button("More", {
								...moreButtonOpts,
								disabled: moreButtonOpts.disabled || !animeCache.length,
								onClick: ctx.eventHandler("goto-anime", () => {
									this.type.set("ANIME");
									this.current.set(Tabs.Media);
								}),
							}),
						],
						{ style: { justifyContent: "space-between" } }
					),
					tray.flex(animeEntries.length ? animeEntries : [this.noEntries()], {
						style: {
							overflow: "hidden",
							maskImage: "linear-gradient(to right, rgba(0,0,0,1) 90%, transparent 100%)",
						},
					}),
				]);

				const mangaCache = Object.values(favorites.types.manga.cache);
				const mangaEntries = favorites.hasInitialized.get() ? mangaCache.map(this.formatMediaCard) : Array.from({ length: 6 }).map(this.loadingRect);
				const manga = tray.stack([
					tray.flex(
						[
							tray.text(`Manga (${favorites.hasInitialized.get() ? mangaCache.length : "..."})`, {
								style: { fontSize: "1.1rem", borderBottom: "1px solid var(--border)" },
							}),
							tray.button("More", {
								...moreButtonOpts,
								disabled: moreButtonOpts.disabled || !mangaCache.length,
								onClick: ctx.eventHandler("goto-manga", () => {
									this.type.set("MANGA");
									this.current.set(Tabs.Media);
								}),
							}),
						],
						{ style: { justifyContent: "space-between" } }
					),
					tray.flex(mangaEntries.length ? mangaEntries : [this.noEntries()], {
						style: {
							overflow: "hidden",
							maskImage: !mangaEntries.length ? "" : "linear-gradient(to right, rgba(0,0,0,1) 90%, transparent 100%)",
						},
					}),
				]);

				const characterCache = Object.values(favorites.types.characters.cache);
				const characterEntries = favorites.hasInitialized.get()
					? characterCache.map(this.formatPeopleCard)
					: Array.from({ length: 6 }).map(this.loadingCircles);
				const characters = tray.stack([
					tray.flex(
						[
							tray.text(`Characters (${favorites.hasInitialized.get() ? characterCache.length : "..."})`, {
								style: { fontSize: "1.1rem", borderBottom: "1px solid var(--border)" },
							}),
							tray.button("More", {
								...moreButtonOpts,
								disabled: moreButtonOpts.disabled || !characterCache.length,
								onClick: ctx.eventHandler("goto-characters", () => {
									this.type.set("CHARACTERS");
									this.current.set(Tabs.People);
								}),
							}),
						],
						{ style: { justifyContent: "space-between" } }
					),
					tray.flex(characterEntries.length ? characterEntries : [this.noEntries()], {
						style: {
							overflow: "hidden",
							maskImage: "linear-gradient(to right, rgba(0,0,0,1) 90%, transparent 100%)",
						},
					}),
				]);

				const staffCache = Object.values(favorites.types.staff.cache);
				const staffEntries = favorites.hasInitialized.get() ? staffCache.map(this.formatPeopleCard) : Array.from({ length: 6 }).map(this.loadingCircles);
				const staff = tray.stack([
					tray.flex(
						[
							tray.text(`Staff (${favorites.hasInitialized.get() ? staffCache.length : "..."})`, {
								style: { fontSize: "1.1rem", borderBottom: "1px solid var(--border)" },
							}),
							tray.button("More", {
								...moreButtonOpts,
								disabled: moreButtonOpts.disabled || !staffCache.length,
								onClick: ctx.eventHandler("goto-staff", () => {
									this.type.set("STAFF");
									this.current.set(Tabs.People);
								}),
							}),
						],
						{ style: { justifyContent: "space-between" } }
					),
					tray.flex(staffEntries.length ? staffEntries : [this.noEntries()], {
						style: {
							overflow: "hidden",
							maskImage: "linear-gradient(to right, rgba(0,0,0,1) 90%, transparent 100%)",
						},
					}),
				]);

				const studioCache = Object.values(favorites.types.studios.cache);
				const studioEntries = favorites.hasInitialized.get()
					? studioCache.map((x) =>
							tray.anchor(`${x.name}`, {
								href: x.siteUrl ?? "",
								target: "_blank",
								className: "no-underline bg-gray-800 hover:bg-gray-700",
								style: {
									padding: "0 0.75rem",
									borderRadius: "0.75rem",
								},
							})
					  )
					: Array.from({ length: 10 }).map(() => this.loadingPill(`${4 + Math.floor(Math.random() * 6)}rem`));
				const studio = tray.stack(
					[
						tray.flex(
							[
								tray.text(`Studio (${favorites.hasInitialized.get() ? studioCache.length : "..."})`, {
									style: { fontSize: "1.1rem", borderBottom: "1px solid var(--border)" },
								}),
							],
							{ style: { justifyContent: "space-between" } }
						),
						tray.flex(studioEntries.length ? studioEntries : [this.noEntries()], { style: { flexWrap: "wrap" } }),
					],
					{
						style: {
							marginBottom: "1rem",
						},
					}
				);

				const body = tray.stack([anime, manga, characters, staff, studio], {
					gap: 5,
					style: {
						overflowY: "scroll",
						overflowX: "hidden",
						height: "28rem",
					},
				});
				return tray.stack([header, body], { style: { padding: "0.5rem" } });
			},

			[Tabs.Media]() {
				const type = this.type.get();
				const favorite = favorites.types[type === "ANIME" ? "anime" : "manga"];

				const header = tray.flex(
					[
						tray.div([], {
							style: {
								width: "2.5rem",
								height: "2.5rem",
								marginTop: "-0.3rem",
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
								tray.text(`Favorite ${type === "ANIME" ? "Anime" : "Manga"}`, { style: { fontSize: "1.2em", fontWeight: "bold" } }),
								tray.text("Browse your favorite entries", { style: { fontSize: "0.8em" }, className: "opacity-30" }),
							],
							{
								style: {
									lineHeight: "1em",
									width: "100%",
								},
							}
						),
						tray.flex(
							[
								tray.button("\u200b", {
									intent: "gray-subtle",
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										// prettier-ignore
										backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSA4YS41LjUgMCAwIDAtLjUtLjVIMi43MDdsMy4xNDctMy4xNDZhLjUuNSAwIDEgMC0uNzA4LS43MDhsLTQgNGEuNS41IDAgMCAwIDAgLjcwOGw0IDRhLjUuNSAwIDAgMCAuNzA4LS43MDhMMi43MDcgOC41SDE0LjVBLjUuNSAwIDAgMCAxNSA4Ii8+PC9zdmc+)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem 1rem",
									},
									onClick: ctx.eventHandler(`favorites-goback`, () => {
										tabs.current.set(Tabs.General);
										state.searchQuery.set("");
									}),
								}),
							],
							{
								style: {
									alignItems: "center",
								},
							}
						),
					],
					{
						gap: 3,
						style: {
							marginBottom: "1rem",
						},
					}
				);

				const search = tray.input({
					placeholder: `Search favorite ${this.type.get()?.toLowerCase()}...`,
					value: state.searchQuery.get(),
					style: {
						borderRadius: "0.5rem",
						paddingInlineStart: "2.5rem",
						backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM1YTVhNWEiIGhlaWdodD0iNTEyIiB3aWR0aD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTQ5NSA0NjYuMiAzNzcuMiAzNDguNGMyOS4yLTM1LjYgNDYuOC04MS4yIDQ2LjgtMTMwLjlDNDI0IDEwMy41IDMzMS41IDExIDIxNy41IDExIDEwMy40IDExIDExIDEwMy41IDExIDIxNy41UzEwMy40IDQyNCAyMTcuNSA0MjRjNDkuNyAwIDk1LjItMTcuNSAxMzAuOC00Ni43TDQ2Ni4xIDQ5NWM4IDggMjAuOSA4IDI4LjkgMCA4LTcuOSA4LTIwLjkgMC0yOC44bS0yNzcuNS04My4zQzEyNi4yIDM4Mi45IDUyIDMwOC43IDUyIDIxNy41UzEyNi4yIDUyIDIxNy41IDUyQzMwOC43IDUyIDM4MyAxMjYuMyAzODMgMjE3LjVzLTc0LjMgMTY1LjQtMTY1LjUgMTY1LjQiLz48L3N2Zz4=)`,
						backgroundSize: "1rem",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "calc(0% + 0.75rem) center",
					},
					onChange: ctx.eventHandler("search-query", (e) => {
						state.searchQuery.set(String(e.value));
					}),
				});

				const entries = tray.flex(
					[
						...Object.values(favorite.cache)
							.filter((a) =>
								[...Object.values(a.title).filter(Boolean), ...(a.synonyms || [])].join(" ").toLowerCase().includes(state.searchQuery.get().toLowerCase())
							)
							.sort((A, B) => A.title.userPreferred!.localeCompare(B.title.userPreferred!))
							.map(this.formatMediaCard),
						state.isFetching.get() ? Array.from({ length: 6 }).map(this.loadingRect) : [],
						Array.from({ length: 4 }).map((x) => tray.div([], { style: { width: tabs.styles.media.minWidth } })),
					],
					{
						gap: 2,
						style: {
							flexWrap: "wrap",
							justifyContent: "center",
						},
					}
				);

				const additionalEntries =
					favorite.cacheInfo.hasNextPage && !state.isFetching.get()
						? tray.flex(
								[
									tray.button("Load more", {
										intent: "gray-subtle",
										style: {
											borderRadius: "999px",
											// prettier-ignore
											backgroundImage: state.isFetching.get() || !favorites.hasInitialized.get() ? "" : "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDNhNSA1IDAgMSAwIDQuNTQ2IDIuOTE0LjUuNSAwIDAgMSAuOTA4LS40MTdBNiA2IDAgMSAxIDggMnoiLz48cGF0aCBkPSJNOCA0LjQ2NlYuNTM0YS4yNS4yNSAwIDAgMSAuNDEtLjE5MmwyLjM2IDEuOTY2Yy4xMi4xLjEyLjI4NCAwIC4zODRMOC40MSA0LjY1OEEuMjUuMjUgMCAwIDEgOCA0LjQ2NiIvPjwvc3ZnPg==)",
											backgroundRepeat: "no-repeat",
											backgroundPosition: "calc(0% + 0.5rem) center",
											backgroundSize: "1rem 1rem",
											padding: "0 0.75rem 0 2rem",
										},
										onClick: ctx.eventHandler("load-more", () => {
											state.isFetching.set(true);
											favorite
												.fetchNextPage()
												.then(() => ctx.setTimeout(() => ctx.toast.success("Successfully refetched favorites from AniList!"), 2_000))
												.catch((err) => ctx.toast.error(`An error occured while fetching favorites: ${err.message}`))
												.finally(() =>
													ctx.setTimeout(() => {
														state.isFetching.set(false);
														tray.update();
													}, 2_000)
												);
										}),
									}),
								],
								{ style: { justifyContent: "center" } }
						  )
						: [];

				const body = tray.stack([entries, additionalEntries], {
					style: {
						height: "25rem",
						overflowY: "scroll",
					},
				});

				return tray.stack([header, search, body], { style: { padding: "0.5rem" } });
			},

			[Tabs.People]() {
				const type = this.type.get();
				const favorite = favorites.types[type === "CHARACTERS" ? "characters" : "staff"];

				const header = tray.flex(
					[
						tray.div([], {
							style: {
								width: "2.5rem",
								height: "2.5rem",
								marginTop: "-0.3rem",
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
								tray.text(`Favorite ${type === "CHARACTERS" ? "Characters" : "Staff"}`, { style: { fontSize: "1.2em", fontWeight: "bold" } }),
								tray.text("Browse your favorite entries", { style: { fontSize: "0.8em" }, className: "opacity-30" }),
							],
							{
								style: {
									lineHeight: "1em",
									width: "100%",
								},
							}
						),
						tray.flex(
							[
								tray.button("\u200b", {
									intent: "gray-subtle",
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										// prettier-ignore
										backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSA4YS41LjUgMCAwIDAtLjUtLjVIMi43MDdsMy4xNDctMy4xNDZhLjUuNSAwIDEgMC0uNzA4LS43MDhsLTQgNGEuNS41IDAgMCAwIDAgLjcwOGw0IDRhLjUuNSAwIDAgMCAuNzA4LS43MDhMMi43MDcgOC41SDE0LjVBLjUuNSAwIDAgMCAxNSA4Ii8+PC9zdmc+)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem 1rem",
									},
									onClick: ctx.eventHandler(`favorites-goback`, () => {
										tabs.current.set(tabs.current.get() === Tabs.People ? Tabs.General : Tabs.People);
										state.searchQuery.set("");
									}),
								}),
							],
							{
								style: {
									alignItems: "center",
								},
							}
						),
					],
					{
						gap: 3,
						style: {
							marginBottom: "1rem",
						},
					}
				);

				const search = tray.input({
					placeholder: `Search favorite ${this.type.get()?.toLowerCase()}...`,
					value: state.searchQuery.get(),
					style: {
						borderRadius: "0.5rem",
						paddingInlineStart: "2.5rem",
						backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM1YTVhNWEiIGhlaWdodD0iNTEyIiB3aWR0aD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTQ5NSA0NjYuMiAzNzcuMiAzNDguNGMyOS4yLTM1LjYgNDYuOC04MS4yIDQ2LjgtMTMwLjlDNDI0IDEwMy41IDMzMS41IDExIDIxNy41IDExIDEwMy40IDExIDExIDEwMy41IDExIDIxNy41UzEwMy40IDQyNCAyMTcuNSA0MjRjNDkuNyAwIDk1LjItMTcuNSAxMzAuOC00Ni43TDQ2Ni4xIDQ5NWM4IDggMjAuOSA4IDI4LjkgMCA4LTcuOSA4LTIwLjkgMC0yOC44bS0yNzcuNS04My4zQzEyNi4yIDM4Mi45IDUyIDMwOC43IDUyIDIxNy41UzEyNi4yIDUyIDIxNy41IDUyQzMwOC43IDUyIDM4MyAxMjYuMyAzODMgMjE3LjVzLTc0LjMgMTY1LjQtMTY1LjUgMTY1LjQiLz48L3N2Zz4=)`,
						backgroundSize: "1rem",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "calc(0% + 0.75rem) center",
					},
					onChange: ctx.eventHandler("search-query", (e) => {
						state.searchQuery.set(String(e.value));
					}),
				});

				const entries = tray.flex(
					[
						(type === "CHARACTERS"
							? [
									...Object.values(favorites.types.characters.cache)
										.filter((a) => Object.values(a.name).filter(Boolean).join(" ").toLowerCase().includes(state.searchQuery.get().toLowerCase()))
										.sort((A, B) => A.name.full!.localeCompare(B.name.full!)),
							  ]
							: [
									...Object.values(favorites.types.staff.cache)
										.filter((a) => Object.values(a.name).filter(Boolean).join(" ").toLowerCase().includes(state.searchQuery.get().toLowerCase()))
										.sort((A, B) => A.name.full!.localeCompare(B.name.full!)),
							  ]
						).map(this.formatPeopleCard),
						state.isFetching.get() ? Array.from({ length: 6 }).map(this.loadingRect) : [],
						Array.from({ length: 4 }).map((x) => tray.div([], { style: { width: tabs.styles.media.minWidth } })),
					],
					{
						gap: 2,
						style: {
							flexWrap: "wrap",
							justifyContent: "center",
						},
					}
				);

				const additionalEntries =
					favorite.cacheInfo.hasNextPage && !state.isFetching.get()
						? tray.flex(
								[
									tray.button("Load more", {
										intent: "gray-subtle",
										style: {
											borderRadius: "999px",
											// prettier-ignore
											backgroundImage: state.isFetching.get() || !favorites.hasInitialized.get() ? "" : "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDNhNSA1IDAgMSAwIDQuNTQ2IDIuOTE0LjUuNSAwIDAgMSAuOTA4LS40MTdBNiA2IDAgMSAxIDggMnoiLz48cGF0aCBkPSJNOCA0LjQ2NlYuNTM0YS4yNS4yNSAwIDAgMSAuNDEtLjE5MmwyLjM2IDEuOTY2Yy4xMi4xLjEyLjI4NCAwIC4zODRMOC40MSA0LjY1OEEuMjUuMjUgMCAwIDEgOCA0LjQ2NiIvPjwvc3ZnPg==)",
											backgroundRepeat: "no-repeat",
											backgroundPosition: "calc(0% + 0.5rem) center",
											backgroundSize: "1rem 1rem",
											padding: "0 0.75rem 0 2rem",
										},
										onClick: ctx.eventHandler("load-more", () => {
											state.isFetching.set(true);
											favorite
												.fetchNextPage()
												.then(() => ctx.setTimeout(() => ctx.toast.success("Successfully refetched favorites from AniList!"), 2_000))
												.catch((err) => ctx.toast.error(`An error occured while fetching favorites: ${err.message}`))
												.finally(() =>
													ctx.setTimeout(() => {
														state.isFetching.set(false);
														tray.update();
													}, 2_000)
												);
										}),
									}),
								],
								{ style: { justifyContent: "center" } }
						  )
						: [];

				const body = tray.stack([entries, additionalEntries], {
					style: {
						height: "25rem",
						overflowY: "scroll",
					},
				});

				return tray.stack([header, search, body], { style: { padding: "0.5rem" } });
			},

			[Tabs.PeopleSpecific]() {
				const person = state.currentPerson.get();
				if (!person) throw new Error("Could not get the required info.");

				const header = tray.flex(
					[
						tray.div([], {
							style: {
								width: "2.5rem",
								height: "2.5rem",
								marginTop: "-0.3rem",
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
								tray.text(`Favorite`, { style: { fontSize: "1.2em", fontWeight: "bold" } }),
								tray.text("Browse your favorite entries", { style: { fontSize: "0.8em" }, className: "opacity-30" }),
							],
							{
								style: {
									lineHeight: "1em",
									width: "100%",
								},
							}
						),
						tray.flex(
							[
								tray.button("\u200b", {
									intent: "gray-subtle",
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										// prettier-ignore
										backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSA4YS41LjUgMCAwIDAtLjUtLjVIMi43MDdsMy4xNDctMy4xNDZhLjUuNSAwIDEgMC0uNzA4LS43MDhsLTQgNGEuNS41IDAgMCAwIDAgLjcwOGw0IDRhLjUuNSAwIDAgMCAuNzA4LS43MDhMMi43MDcgOC41SDE0LjVBLjUuNSAwIDAgMCAxNSA4Ii8+PC9zdmc+)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem 1rem",
									},
									onClick: ctx.eventHandler(`favorites-goback`, () => {
										tabs.type.set("media" in (person ?? {}) ? "CHARACTERS" : "STAFF");
										tabs.current.set(tabs.previous.get());
										state.searchQuery.set("");
									}),
								}),
							],
							{
								style: {
									alignItems: "center",
								},
							}
						),
					],
					{
						gap: 3,
						style: {
							marginBottom: "1rem",
						},
					}
				);

				const info = tray.flex(
					[
						tray.stack([
							tray.div(
								[
									tray.div([], {
										style: {
											...tabs.styles.media,
											pointerEvents: "none",
											position: "absolute",
											backgroundImage: `url(${person.image.large})`,
											backgroundSize: "cover",
											backgroundRepeat: "no-repeat",
										},
									}),
								],
								{
									style: {
										...tabs.styles.media,
										position: "relative",
										padding: "0",
									},
								}
							),
							// tray.button("Unfavorite", {
							// 	intent: "alert-subtle",
							// 	style: {
							// 		width: "100%",
							// 	},
							// }),
						]),
						tray.div(this.parseMarkdownText(person.description ?? "No available bio"), {
							style: {
								fontSize: "0.8rem",
								overflowY: "scroll",
								height: "14rem",
								width: "100%",
							},
						}),
					],
					{
						gap: 4,
					}
				);

				const voiceActors =
					"staffMedia" in person
						? []
						: tray.stack([
								tray.text("Voice Actors", {}),
								tray.flex(
									[
										[
											...new Map(
												person.media?.edges
													.map((e) => e.voiceActors)
													.flat()
													.map((e) => [e.id, e])
											).values(),
										].map((e) =>
											tray.flex(
												[
													tray.div(
														[
															tray.div([], {
																style: {
																	width: "100%",
																	height: "100%",
																	pointerEvents: "none",
																	position: "absolute",
																	backgroundImage: `url(${e.image.large})`,
																	backgroundSize: "cover",
																	backgroundRepeat: "no-repeat",
																	backgroundPosition: "center",
																},
															}),
														],
														{
															style: {
																width: "3rem",
																height: "5rem",
																position: "relative",
																padding: "0",
															},
														}
													),
													tray.stack(
														[
															tray.text(e.name.full ?? "", {
																style: {
																	overflow: "hidden",
																	textOverflow: "ellipsis",
																	display: "-webkit-box",
																	"-webkit-line-clamp": "2",
																	"-webkit-box-orient": "vertical",
																	fontSize: "0.85rem",
																	lineHeight: "normal",
																},
															}),
															tray.text(e.languageV2, {
																style: {
																	fontSize: "0.7rem",
																	opacity: "0.8",
																},
															}),
														],
														{
															style: {
																justifyContent: "space-between",
																width: "10rem",
																padding: "0.5rem",
															},
														}
													),
												],
												{
													gap: 0,
													style: {
														borderRadius: "0.5rem",
														overflow: "hidden",
														backgroundColor: "rgb(var(--color-gray-900))",
														border: "1px solid var(--border)",
													},
												}
											)
										),
									],
									{
										style: {
											flexWrap: "wrap",
										},
									}
								),
						  ]);

				const relatedWorks = tray.flex(
					[
						tray.stack([
							tray.text("staffMedia" in person ? "Related Works" : "Appearances"),
							tray.flex([("staffMedia" in person ? person.staffMedia : person.media).edges.map((e) => this.formatMediaCard(e.node))], {
								style: {
									flexWrap: "wrap",
								},
							}),
						]),
					],
					{
						style: {
							flexWrap: "wrap",
						},
					}
				);

				const body = tray.stack([info, voiceActors, relatedWorks], {
					gap: 5,
					style: {
						height: "28rem",
						overflowY: "scroll",
					},
				});

				return tray.stack([header, body], { style: { padding: "0.5rem" } });
			},

			get() {
				return this[this.current.get()]();
			},
		};

		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		function isCustomSource(mediaId?: number) {
			return (mediaId ?? 0) >= 2 ** 31;
		}

		async function handleButtonPress({ media }: { media: $app.AL_BaseAnime | $app.AL_BaseManga }) {
			state.isFetching.set(true);
			const button = media.type === "ANIME" ? animeButton : mangaButton;
			const type = media.type === "ANIME" ? "anime" : "manga";
			button.setLoading(true);
			button.setStyle({ ...btnIconStyles, backgroundImage: "" });
			button.setIntent(state.isCurrentMediaFavorite.get() ? "alert" : "gray-subtle");

			return favorites.types[type]
				.toggle(media.id)
				.then((res) => state.isCurrentMediaFavorite.set(res))
				.catch((err) => ctx.toast.error((err as Error).message))
				.finally(() => {
					state.isFetching.set(false);
					button.setLoading(false);
					button.setStyle({ ...btnIconStyles });
					button.setIntent(state.isCurrentMediaFavorite.get() ? "alert" : "gray-subtle");
				});
		}

		// prettier-ignore
		const favoriteIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iI2NhY2FjYSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDEuMzE0QzEyLjQzOC0zLjI0OCAyMy41MzQgNC43MzUgOCAxNS03LjUzNCA0LjczNiAzLjU2Mi0zLjI0OCA4IDEuMzE0Ii8+PC9zdmc+";
		const btnIconStyles = {
			backgroundImage: `url(${favoriteIcon})`,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			backgroundSize: "21.5px 21.5px",
			width: "40px",
			padding: "0",
			paddingInlineStart: "0.5rem",
		};

		const animeButton = ctx.action.newAnimePageButton({ label: "\u200b", intent: "gray-subtle", style: btnIconStyles });
		animeButton.mount();
		animeButton.onClick(handleButtonPress);

		const mangaButton = ctx.action.newMangaPageButton({ label: "\u200b", intent: "gray-subtle", style: btnIconStyles });
		mangaButton.mount();
		mangaButton.onClick(handleButtonPress);

		tray.render(() => tabs.get());

		tray.onOpen(() => {
			if (!favorites.hasInitialized.get()) {
				favorites.init().catch((e) => ctx.toast.error(e.message));
			}
		});

		tray.onClose(() => {
			tabs.current.set(Tabs.General);
			tabs.previous.set(Tabs.General);
			state.searchQuery.set("");
		});

		ctx.screen.onNavigate((e) => {
			// Anime
			if (e.pathname === "/entry") {
				const mediaId = Number(e.searchParams.id);
				if (isCustomSource(mediaId)) {
					return animeButton.unmount();
				} else {
					animeButton.mount();
				}
				state.isCurrentMediaFavorite.set(!!favorites.types.anime.cache[mediaId]);
				animeButton.setIntent(state.isCurrentMediaFavorite.get() ? "alert" : "gray-subtle");
			}

			if (e.pathname === "/manga/entry") {
				const mediaId = Number(e.searchParams.id);
				if (isCustomSource(mediaId)) {
					return mangaButton.unmount();
				} else {
					mangaButton.mount();
				}
				state.isCurrentMediaFavorite.set(!!favorites.types.manga.cache[mediaId]);
				mangaButton.setIntent(state.isCurrentMediaFavorite.get() ? "alert" : "gray-subtle");
			}
		});

		ctx.dom.onReady(async () => {
			const style = await ctx.dom.createElement("style");
			style.setText(
				".favorites-tab-general-entry-card-background { transition: transform ease-in-out 0.2s;  } .favorites-tab-general-container:hover .favorites-tab-general-entry-card-background { transform: scale(1.1) } .favorites-spoiler { background: rgb(var(--color-gray-700)); color: rgb(var(--color-gray-700))} .favorites-spoiler:hover { background: rgb(var(--color-gray-900)); color: rgb(var(--color-gray-400));}"
			);
		});

		favorites
			.init()
			.then(() => ctx.screen.loadCurrent())
			.catch((e) => ctx.toast.error(e.message));
	});
}
