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

		const icons = {
			html: {
				back: /*html*/ `
					<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 256 256" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a8 8 0 0 1-8 8h-60.69l18.35 18.34a8 8 0 0 1-11.32 11.32l-32-32a8 8 0 0 1 0-11.32l32-32a8 8 0 0 1 11.32 11.32L107.31 120H168a8 8 0 0 1 8 8" stroke="none"/>
					</svg>`,
				chevyleft: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path stroke="#cacaca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 6-6-6-6"/>
					</svg>`,
				refresh: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
						<path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
						<path d="M16 16h5v5"/>
					</svg>`,
				search: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" fill="#5a5a5a" height="512" width="512" viewBox="0 0 512 512">
						<path d="M495 466.2 377.2 348.4c29.2-35.6 46.8-81.2 46.8-130.9C424 103.5 331.5 11 217.5 11 103.4 11 11 103.5 11 217.5S103.4 424 217.5 424c49.7 0 95.2-17.5 130.8-46.7L466.1 495c8 8 20.9 8 28.9 0 8-7.9 8-20.9 0-28.8m-277.5-83.3C126.2 382.9 52 308.7 52 217.5S126.2 52 217.5 52C308.7 52 383 126.3 383 217.5s-74.3 165.4-165.5 165.4"/>
					</svg>`,
			},
			get(name: keyof typeof this.html, raw: boolean = false) {
				if (raw) return this.html[name];
				return `data:image/svg+xml;base64,${Buffer.from(this.html[name].trim(), "utf-8").toString("base64")}`;
			},
		};

		enum Tabs {
			General = 1,
			Media = 2,
			People = 3,
			Person = 4,
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
							{ characterId: characterPage.id, characterMediaPage: characterPage.media.pageInfo.currentPage + 1 },
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
							{ staffId: staff.id, staffMediaPage: staff.staffMedia.pageInfo.currentPage + 1 },
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
							nodes.reduce(
								(acc, entry) => {
									acc[entry.id] = entry;
									return acc;
								},
								{} as Record<number, (typeof nodes)[number]>,
							),
						);
					} else {
						$store.set(
							`favorites:types:${key}`,
							res.Viewer.favourites[key].nodes.reduce(
								(acc, entry) => {
									acc[entry.id] = entry;
									return acc;
								},
								{} as Record<number, (typeof nodes)[number]>,
							),
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
			header(primary: string, subtext?: string, additionalComponents?: any[]) {
				const icon = tray.div([], {
					className: "w-10 h-10 bg-contain bg-no-repeat bg-center shrink-0",
					style: { backgroundImage: `url(${iconUrl})` },
				});

				const text = tray.stack(
					[
						tray.span(`${primary}`, { className: " text-lg font-bold" }), //
						subtext ? tray.span(`${subtext}`, { className: "text-[--muted] text-sm" }) : [],
					],
					{ gap: 0, className: "flex-1" },
				);

				return tray.flex([icon, text, tray.div(additionalComponents ?? [])], {
					gap: 3,
					className: "mb-4",
				});
			},
			loadingRect() {
				return tray.div([], {
					className: "animate-pulse w-32 bg-gray-800 p-2 rounded-lg",
					style: { height: "calc(48 * 0.25rem)" },
				});
			},

			loadingCircles() {
				return tray.stack(
					[
						tray.div([], { className: "w-20 h-20 animate-pulse bg-gray-800 rounded-full" }),
						tray.span("", { className: "w-24 h-4 block animate-pulse rounded-full bg-gray-800" }),
						tray.span("", { className: "w-full h-4 block animate-pulse rounded-full bg-gray-800" }),
					],
					{
						gap: 1,
						className: "w-32 justify-center items-center",
					},
				);
			},

			noEntries() {
				return tray.text("No entries yet", {
					className: "w-full h-full p-4 opacity-80 text-center",
					style: { alignSelf: "center", justifySelf: "center" },
				});
			},

			formatMediaCard(
				media:
					| $favorite.FavoriteAnimeFetchResponse["Viewer"]["favourites"]["anime"]["nodes"][number]
					| $favorite.FavoriteMangaFetchResponse["Viewer"]["favourites"]["manga"]["nodes"][number],
			) {
				const background = tray.div([], {
					className: "favorites-tab-general-entry-card-background w-full h-full absolute bg-cover bg-no-repeat pointer-events-none",
					style: {
						backgroundImage: `url(${media.coverImage.large})`,
						maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 100%)",
					},
				});

				const info = tray.stack(
					[
						tray.flex(
							[
								media.seasonYear ? tray.text(`${media.seasonYear}`, { style: { wordBreak: "normal" } }) : [],
								tray.text(`${media.format}`, { style: { wordBreak: "normal" } }),
							],
							{
								className: "w-fit bg-gray-900 text-xs font-bold py-0 px-2 rounded-lg z-[2] bg-gray-900 border",
							},
						),
						tray.text(`${media.title.userPreferred}`, {
							className: "overflow-hidden line-clamp-3 text-xs leading-none break-normal",
						}),
					],
					{
						className: "w-full h-full p-2 justify-between z-[2] shadow pointer-events-none",
					},
				);

				return tray.div([background, info], {
					className: "favorites-tab-general-container relative w-32 cursor-pointer rounded-lg border overflow-hidden shrink-0",
					style: { height: "calc(48 * 0.25rem)" },
					onClick: ctx.eventHandler(`navigate-to:${media.id}`, () => {
						const path = String(media.type) === "ANIME" ? "/entry" : "/manga/entry";
						ctx.screen.navigateTo(path, { id: media.id.toString() });
						tray.close();
						tabs.current.set(Tabs.General);
					}),
				});
			},

			formatPeopleCard(
				people:
					| $favorite.FavoriteCharactersFetchResponse["Viewer"]["favourites"]["characters"]["nodes"][number]
					| $favorite.FavoriteStaffFetchResponse["Viewer"]["favourites"]["staff"]["nodes"][number],
			) {
				const avatar = tray.div([], {
					className: "w-20 h-20 rounded-full bg-cover bg-no-repeat",
					style: { backgroundImage: `url(${people.image.large})` },
				});

				const name = tray.text(`${people.name.full}`, {
					className: "mt-3 overflow-hiden clamp-3 text-sm opacity-90 text-center leading-none font-bold break-normal",
				});

				const media = tray.div(
					[
						tray.text(`${"media" in people ? people.media.edges[0]?.node.title.userPreferred : people.languageV2}`, {
							className: "overflow-hidden line-clamp-3 text-xs opacity-60 text-center leading-none break-normal",
						}),
					],
					{ className: "flex-1" },
				);

				return tray.div([avatar, name, media], {
					className: "flex flex-col relative w-32 p-2 rounded-lg gap-1 hover:bg-gray-800 shrink-0 justify-center items-center cursor-pointer",
					onClick: ctx.eventHandler(`navigate-to:${people.id}`, () => {
						state.currentPerson.set(people);
						tabs.current.set(Tabs.Person);
						tabs.previous.set(Tabs.People);
					}),
				});
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
							}),
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
						lineRes.push(tray.text(heading, { className: "text-lg font-bold" }));
						return;
					}

					// Bold (**text**)
					text = text.replace(/\*\*(.*?)\*\*/g, (_, bold) => {
						lineRes.push(tray.span(`${bold}`, { className: "font-bold" }));
						return "";
					});

					// Underline (__text__)
					text = text.replace(/__(.*?)__/g, (_, underline) => {
						lineRes.push(tray.span(`${underline}`, { className: "underline" }));
						return "";
					});

					// Italic
					text = text.replace(/\*(.*?)\*/g, (_, italic) => {
						lineRes.push(tray.span(`${italic}`, { className: "italic" }));
						return "";
					});

					// Inline code
					text = text.replace(/`(.*?)`/g, (_, code) => {
						lineRes.push(tray.span(`${code}`, { style: { fontFamily: "monospace", backgroundColor: "#eee" } }));
						return "";
					});

					// Spoilers (~! text !~)
					text = text.replace(/~!(.*?)!~/g, (_, spoiler) => {
						lineRes.push(tray.text(`${spoiler}`, { className: "favorites-spoiler cursor-pointer" }));
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
						lineRes.push(tray.span(`${text}`));
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
				const refresh = tray.button("\u200b", {
					intent: "gray-subtle",
					loading: state.isFetching.get() || !favorites.hasInitialized.get(),
					className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center p-0",
					style: {
						...(state.isFetching.get() || !favorites.hasInitialized.get() ? {} : { backgroundImage: `url(${icons.get("refresh")})` }),
						backgroundSize: "1.2rem",
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
								}, 2_000),
							);
					}),
				});

				const header = this.header("AniList Favorites", "Browse your favorite entries", [
					tray.flex([tray.tooltip(refresh, { text: "Refresh" })], {
						className: "items-center",
					}),
				]);

				const bodyComponents = [];

				const sources = {
					ANIME: Object.values(favorites.types.anime.cache),
					MANGA: Object.values(favorites.types.manga.cache),
					CHARACTERS: Object.values(favorites.types.characters.cache),
					STAFF: Object.values(favorites.types.staff.cache),
					STUDIO: Object.values(favorites.types.studios.cache),
				} as const;

				for (const [prop, entries] of Object.entries(sources) as { [K in keyof typeof sources]: [K, (typeof sources)[K]] }[keyof typeof sources][]) {
					const initd = favorites.hasInitialized.get();

					const type = tray.span(`${prop.charAt(0).toUpperCase() + prop.slice(1).toLowerCase()}`, { className: "text-lg font-semibold mr-2" });
					const len = tray.span(`${entries.length || ""}`, { className: "text-sm text-[--muted]" });
					const heading = tray.div([type, len], { className: "flex-1 border-b" });

					const more =
						prop !== "STUDIO"
							? tray.button("More", {
									intent: "gray-subtle",
									disabled: !favorites.hasInitialized.get() || state.isFetching.get(),
									className: "bg-transparent rounded-full bg-no-repeat mr-2",
									style: {
										backgroundPosition: "calc(100% - 0.5rem) center",
										backgroundSize: "1.1rem",
										backgroundImage: `url(${icons.get("chevyleft")})`,
										paddingInlineEnd: "2rem",
									},
									onClick: ctx.eventHandler(`goto-${prop}`, () => {
										this.type.set(prop);
										this.current.set(Tabs[["ANIME", "MANGA"].includes(prop) ? "Media" : "People"]);
									}),
								})
							: [];

					const ent = [];
					switch (prop) {
						case "ANIME":
							ent.push(initd ? entries.map(this.formatMediaCard) : Array.from({ length: 4 }).map(this.loadingRect));
							break;
						case "CHARACTERS":
							ent.push(initd ? entries.map(this.formatPeopleCard) : Array.from({ length: 4 }).map(this.loadingCircles));
							break;
						case "MANGA":
							ent.push(initd ? entries.map(this.formatMediaCard) : Array.from({ length: 4 }).map(this.loadingRect));
							break;
						case "STAFF":
							ent.push(initd ? entries.map(this.formatPeopleCard) : Array.from({ length: 4 }).map(this.loadingCircles));
							break;
						case "STUDIO":
							ent.push(
								initd
									? entries.map((studio) =>
											tray.anchor(`${studio.name}`, {
												href: studio.siteUrl ?? "",
												className: "no-underline bg-gray-800 hover:bg-gray-700 py-0 px-3 rounded-full",
											}),
										)
									: Array.from({ length: 6 }).map(() =>
											tray.span("", {
												className: `h-4 block animate-pulse rounded-full bg-gray-800`,
												style: { width: `${4 + Math.floor(Math.random() * 6)}rem` },
											}),
										),
							);
							break;
					}

					const top = tray.flex([heading, more], { className: "justify-between" });
					const btm = tray.flex(ent.length ? ent : [this.noEntries()], {
						className: "overflow-hidden",
						style: { maskImage: "linear-gradient(to right, rgba(0,0,0,1) 90%, transparent 100%)" },
					});

					bodyComponents.push(tray.stack([top, btm]));
				}

				const body = tray.stack(bodyComponents, {
					gap: 5,
					style: { overflow: "hidden scroll", height: "28rem" },
				});

				return tray.stack([header, body], { style: { padding: "0.5rem" } });
			},

			[Tabs.Media]() {
				const type = this.type.get();
				const favorite = favorites.types[type === "ANIME" ? "anime" : "manga"];

				const back = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.get("back")})`, backgroundSize: "1.5rem" },
					onClick: ctx.eventHandler(`favorites-goback`, () => {
						tabs.current.set(Tabs.General);
						state.searchQuery.set("");
					}),
				});

				const header = this.header(`Favorite ${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}`, "Browse your favorite entries", [
					tray.flex([tray.tooltip(back, { text: "Go Back" })], {
						className: "items-center",
					}),
				]);

				const search = tray.input({
					placeholder: `Search favorite ${this.type.get()?.toLowerCase()}...`,
					value: state.searchQuery.get(),
					style: {
						borderRadius: "0.5rem",
						paddingInlineStart: "2.5rem",
						backgroundImage: `url(${icons.get("search")})`,
						backgroundSize: "1rem",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "calc(0% + 0.75rem) center",
					},
					onChange: ctx.eventHandler("search-query", (e) => state.searchQuery.set(String(e.value))),
				});

				const entries = tray.div(
					[
						...Object.values(favorite.cache)
							.filter((a) =>
								[...Object.values(a.title).filter(Boolean), ...(a.synonyms || [])].join(" ").toLowerCase().includes(state.searchQuery.get().toLowerCase()),
							)
							.sort((A, B) => A.title.userPreferred!.localeCompare(B.title.userPreferred!))
							.map(this.formatMediaCard),
						state.isFetching.get() ? Array.from({ length: 6 }).map(this.loadingRect) : [],
					],
					{
						className: "grid gap-2",
						style: { gridTemplateColumns: `repeat(auto-fill, minmax(8rem, 1fr))` },
					},
				);

				const loadMore = tray.button("Load more", {
					intent: "gray-subtle",
					className: "rounded-full bg-no-repeat px-0 pt-3 pb-8",
					style: {
						backgroundImage: state.isFetching.get() || !favorites.hasInitialized.get() ? "" : `url(${icons.get("refresh")})`,
						backgroundPosition: "calc(0% + 0.5rem) center",
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
								}, 2_000),
							);
					}),
				});

				const plusEntries = favorite.cacheInfo.hasNextPage && !state.isFetching.get() ? tray.flex([loadMore], { className: "justify-center" }) : [];

				const body = tray.stack([entries, plusEntries], {
					style: { height: "25rem", overflowY: "scroll" },
				});

				return tray.stack([header, search, body], { className: "p-2" });
			},

			[Tabs.People]() {
				const type = this.type.get();
				const favorite = favorites.types[type === "CHARACTERS" ? "characters" : "staff"];

				const back = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.get("back")})`, backgroundSize: "1.5rem" },
					onClick: ctx.eventHandler(`favorites-goback`, () => {
						tabs.current.set(Tabs.General);
						state.searchQuery.set("");
					}),
				});

				const header = this.header(`Favorite ${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}`, "Browse your favorite entries", [
					tray.flex([tray.tooltip(back, { text: "Go Back" })], {
						className: "items-center",
					}),
				]);

				const search = tray.input({
					placeholder: `Search favorite ${this.type.get()?.toLowerCase()}...`,
					value: state.searchQuery.get(),
					style: {
						borderRadius: "0.5rem",
						paddingInlineStart: "2.5rem",
						backgroundImage: `url(${icons.get("search")})`,
						backgroundSize: "1rem",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "calc(0% + 0.75rem) center",
					},
					onChange: ctx.eventHandler("search-query", (e) => state.searchQuery.set(String(e.value))),
				});

				const entries = tray.div(
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
					],
					{
						className: "grid gap-2",
						style: { gridTemplateColumns: `repeat(auto-fill, minmax(8rem, 1fr))` },
					},
				);

				const loadMore = tray.button("Load more", {
					intent: "gray-subtle",
					className: "rounded-full bg-no-repeat px-0 pt-3 pb-8",
					style: {
						backgroundImage: state.isFetching.get() || !favorites.hasInitialized.get() ? "" : `url(${icons.get("refresh")})`,
						backgroundPosition: "calc(0% + 0.5rem) center",
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
								}, 2_000),
							);
					}),
				});

				const plusEntries = favorite.cacheInfo.hasNextPage && !state.isFetching.get() ? tray.flex([loadMore], { className: "justify-center" }) : [];

				const body = tray.stack([entries, plusEntries], {
					style: { height: "25rem", overflowY: "scroll" },
				});

				return tray.stack([header, search, body], { className: "p-2" });
			},

			[Tabs.Person]() {
				const person = state.currentPerson.get();
				if (!person) throw new Error("Could not get the required info.");

				const back = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.get("back")})`, backgroundSize: "1.5rem" },
					onClick: ctx.eventHandler(`favorites-goback`, () => {
						tabs.type.set("media" in (person ?? {}) ? "CHARACTERS" : "STAFF");
						tabs.current.set(tabs.previous.get());
						state.searchQuery.set("");
					}),
				});

				const name = tray.text(`${person.name.full}`, { className: "text-lg font-bold" });
				const altname = tray.text(`${person.name.alternative?.join(", ")}`, { className: "text-xs text-[--muted] break-normal" });
				const header = this.header("Favorite", "Browse your favorite entries", [
					tray.flex([tray.tooltip(back, { text: "Go Back" })], {
						className: "items-center",
					}),
				]);

				const avatar = tray.div(
					[
						tray.div([], {
							className: "absolute w-full h-full rounded-lg bg-no-repeat bg-cover pointer-events-none",
							style: { backgroundImage: `url(${person.image.large})` },
						}),
					],
					{
						className: "relative p-0 w-32",
						style: { height: "12rem" },
					},
				);

				const info = tray.flex(
					[
						tray.stack([avatar]),
						tray.div(this.parseMarkdownText(person.description ?? "No available bio"), {
							className: "w-full text-sm",
							style: { overflowY: "scroll", height: "14rem" },
						}),
					],
					{ gap: 4 },
				);

				const voiceActors =
					"staffMedia" in person
						? []
						: tray.stack([
								tray.text("Voice Actors", { className: "text-lg font-semibold" }),
								tray.flex(
									[
										[
											...new Map(
												person.media?.edges
													.map((e) => e.voiceActors)
													.flat()
													.map((e) => [e.id, e]),
											).values(),
										].map((e) =>
											tray.a(
												[
													tray.flex(
														[
															tray.div(
																[
																	tray.div([], {
																		className: "absolute w-full h-full pointer-events-none bg-cover bg-no-repeat bg-center",
																		style: { backgroundImage: `url(${e.image.large})` },
																	}),
																],
																{ className: "relative w-12 h-20 p-0" },
															),
															tray.stack(
																[
																	tray.text(e.name.full ?? "", { className: "overflow-hidden line-clamp-2 text-sm leading-none" }),
																	tray.text(e.languageV2, { className: "text-xs text-[--muted]" }),
																],
																{
																	className: "p-2 justify-between",
																	style: { width: "10rem" },
																},
															),
														],
														{ className: "rounded-lg overflow-hidden bg-gray-900 border", gap: 0 },
													),
												],
												{ href: `https://anilist.co/staff/${e.id}`, className: "no-underline" },
											),
										),
									],
									{ className: "flex-wrap" },
								),
							]);

				const relatedWorks = tray.flex(
					[
						tray.stack([
							tray.text("staffMedia" in person ? "Related Works" : "Appearances", { className: "text-lg font-semibold" }),
							tray.flex([("staffMedia" in person ? person.staffMedia : person.media).edges.map((e) => this.formatMediaCard(e.node))], {
								className: "flex-wrap",
							}),
						]),
					],
					{ className: "flex-wrap" },
				);

				const body = tray.stack([tray.stack([name, altname, info]), voiceActors, relatedWorks], {
					gap: 5,
					style: { height: "28rem", overflowY: "scroll" },
				});

				return tray.stack([header, body], { className: "p-2" });
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
					button.setTooltipText(state.isCurrentMediaFavorite.get() ? "Unfavorite" : "Favorite");
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

		const animeButton = ctx.action.newAnimePageButton({ label: "\u200b" });
		const mangaButton = ctx.action.newMangaPageButton({ label: "\u200b" });
		for (const btn of [animeButton, mangaButton]) {
			btn.setIntent("gray-subtle");
			btn.setStyle(btnIconStyles);
			btn.mount();

			btn.onClick(handleButtonPress);
		}

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
				animeButton.setTooltipText(state.isCurrentMediaFavorite.get() ? "Unfavorite" : "Favorite");
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
				mangaButton.setTooltipText(state.isCurrentMediaFavorite.get() ? "Unfavorite" : "Favorite");
			}
		});

		ctx.dom.onReady(async () => {
			const style = await ctx.dom.createElement("style");
			style.setText(
				".favorites-tab-general-entry-card-background { transition: transform ease-in-out 0.2s;  } .favorites-tab-general-container:hover .favorites-tab-general-entry-card-background { transform: scale(1.1) } .favorites-spoiler { background: rgb(var(--color-gray-700)); color: rgb(var(--color-gray-700))} .favorites-spoiler:hover { background: rgb(var(--color-gray-900)); color: rgb(var(--color-gray-400));}",
			);
		});

		favorites
			.init()
			.then(() => ctx.screen.loadCurrent())
			.catch((e) => ctx.toast.error(e.message));
	});
}
