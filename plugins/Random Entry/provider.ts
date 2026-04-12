/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />

//@ts-ignore
function init() {
	$ui.register((ctx) => {
		const GENRES = [
			"Action",
			"Adventure",
			"Comedy",
			"Drama",
			"Ecchi",
			"Fantasy",
			"Horror",
			"Mahou Shoujo",
			"Mecha",
			"Music",
			"Mystery",
			"Psychological",
			"Romance",
			"Sci-Fi",
			"Slice of Life",
			"Sports",
			"Supernatural",
			"Thriller",
		];

		const FORMATS: $app.AL_MediaFormat[] = ["TV", "MOVIE", "ONA", "OVA", "TV_SHORT", "SPECIAL", "MUSIC"];
		const MANGA_FORMATS: $app.AL_MediaFormat[] = ["MANGA", "NOVEL", "ONE_SHOT"];
		const SEASONS: $app.AL_MediaSeason[] = ["WINTER", "SPRING", "SUMMER", "FALL"];
		const STATUS: $app.AL_MediaStatus[] = ["FINISHED", "RELEASING", "NOT_YET_RELEASED", "HIATUS", "CANCELLED"];
		const MEDIALIST_STATUS: $app.AL_MediaListStatus[] = ["CURRENT", "PLANNING", "COMPLETED", "DROPPED", "PAUSED", "REPEATING"];

		const tray = ctx.newTray({
			iconUrl: "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Random%20Entry/icon.png",
			withContent: true,
		});

		// Create separate options for anime and manga
		const animeOptions = {
			genres: ctx.state<typeof GENRES>([]),
			format: ctx.state<$app.AL_MediaFormat | null>(null),
			season: ctx.state<$app.AL_MediaSeason | null>(null),
			status: ctx.state<$app.AL_MediaStatus | null>(null),
			medialistStatus: ctx.state<$app.AL_MediaListStatus | null>(null),
			calendarYearFrom: ctx.state<number | null>(null),
			calendarYearTo: ctx.state<number | null>(null),
		};

		const mangaOptions = {
			genres: ctx.state<typeof GENRES>([]),
			format: ctx.state<$app.AL_MediaFormat | null>(null),
			season: ctx.state<$app.AL_MediaSeason | null>(null),
			status: ctx.state<$app.AL_MediaStatus | null>(null),
			medialistStatus: ctx.state<$app.AL_MediaListStatus | null>(null),
			calendarYearFrom: ctx.state<number | null>(null),
			calendarYearTo: ctx.state<number | null>(null),
		};

		const state = {
			invalidYearFromInput: ctx.state<boolean>(false),
			invalidYearToInput: ctx.state<boolean>(false),
		};

		const icons = {
			html: {
				anime: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="text-xl mr-3 transition-transform duration-200" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z"></path><path d="M12 17v4"></path><path d="M8 21h8"></path><rect x="2" y="3" width="20" height="14" rx="2"></rect>
					</svg>`,
				checkmark: /*html*/ `
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="m7 13 3 3 7-7" stroke="#cacaca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>`,
				calendar: /*html*/ `
                    <svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>
                    </svg>`,
				crossmark: /*html*/ `
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M16.95 8.464a1 1 0 1 0-1.414-1.414L12 10.586 8.465 7.05A1 1 0 0 0 7.05 8.464L10.586 12 7.05 15.536a1 1 0 1 0 1.415 1.414L12 13.414l3.536 3.536a1 1 0 1 0 1.414-1.414L13.414 12z" fill="#cacaca"/>
					</svg>`,
				dice: /*html*/ `
					<svg viewBox="0 0 256 256" fill="#cacaca" xmlns="http://www.w3.org/2000/svg">
						<g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><g fill-rule="evenodd"><path d="M47.895 88.097c.001-4.416 3.064-9.837 6.854-12.117l66.257-39.858c3.785-2.277 9.915-2.277 13.707.008l66.28 39.934c3.786 2.28 6.853 7.703 6.852 12.138l-.028 79.603c-.001 4.423-3.069 9.865-6.848 12.154l-66.4 40.205c-3.781 2.29-9.903 2.289-13.69-.01l-66.167-40.185c-3.78-2.295-6.842-7.733-6.84-12.151zm13.936-6.474 65.834 36.759 62.766-36.278-62.872-36.918L61.83 81.623zM57.585 93.52c0 1.628-1.065 71.86-1.065 71.86-.034 2.206 1.467 4.917 3.367 6.064l61.612 37.182.567-77.413s-64.48-39.322-64.48-37.693zm76.107 114.938 60.912-38.66c2.332-1.48 4.223-4.915 4.223-7.679V93.125l-65.135 37.513z"/><path d="M77.76 132.287c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526s1.623 11.765-3.16 14.526m32 21c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526s1.623 11.765-3.16 14.526m-32 16c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526s1.623 11.765-3.16 14.526m32 21c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526s1.623 11.765-3.16 14.526m78.238-78.052c-4.783-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.623 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526s1.623-11.765-3.16-14.526m-16.238 29c-4.782-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.622 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526s1.623-11.765-3.16-14.526m-17 28c-4.782-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.622 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526s1.623-11.765-3.16-14.526M128.5 69c-6.351 0-11.5 4.925-11.5 11s5.149 11 11.5 11S140 86.075 140 80s-5.149-11-11.5-11"/></g>
					</svg>`,
				format: /*html*/ `
                    <svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h24v24H0z"></path><path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 0 0-2-2zm0 14H3V5h18v12z"></path>
                    </svg>`,
				genres: /*html*/ `
                    <svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 3v5l-11 9l-4 4l-3 -3l4 -4l9 -11z"></path><path d="M5 13l6 6"></path><path d="M14.32 17.32l3.68 3.68l3 -3l-3.365 -3.365"></path><path d="M10 5.5l-2 -2.5h-5v5l3 2.5"></path>
                    </svg>`,
				manga: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="text-xl mr-3 transition-transform duration-200" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
					</svg>`,
				season: /*html*/ `
                    <svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                    </svg>`,
				settings: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="text-2xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle>
					</svg>`,
				status: /*html*/ `
                    <svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.11629 20.0868L7.1308 18.348C5.2271 16.8856 4 14.5861 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 14.5861 18.7729 16.8856 16.8692 18.348L17.8837 20.0868C20.3786 18.2684 22 15.3236 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.3236 3.62137 18.2684 6.11629 20.0868ZM8.14965 16.6018C6.83562 15.5012 6 13.8482 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 13.8482 17.1644 15.5012 15.8503 16.6018L14.8203 14.8365C15.549 14.112 16 13.1087 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 13.1087 8.45105 14.112 9.17965 14.8365L8.14965 16.6018ZM11 13H13V22H11V13Z"></path>
                    </svg>`,
				medialistStatus: /*html*/ `
                    <svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.11629 20.0868L7.1308 18.348C5.2271 16.8856 4 14.5861 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 14.5861 18.7729 16.8856 16.8692 18.348L17.8837 20.0868C20.3786 18.2684 22 15.3236 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.3236 3.62137 18.2684 6.11629 20.0868ZM8.14965 16.6018C6.83562 15.5012 6 13.8482 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 13.8482 17.1644 15.5012 15.8503 16.6018L14.8203 14.8365C15.549 14.112 16 13.1087 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 13.1087 8.45105 14.112 9.17965 14.8365L8.14965 16.6018ZM11 13H13V22H11V13Z"></path>
                    </svg>`,
			},
			get(name: keyof typeof this.html, options?: { raw?: boolean; stroke?: string; fill?: string }) {
				let html = this.html[name];

				if (options?.stroke || options?.fill) {
					html = html
						.replace(/stroke="[^"]*"/g, options?.stroke ? `stroke="${options.stroke}"` : 'stroke="none"')
						.replace(/fill="[^"]*"/g, options?.fill ? `fill="${options.fill}"` : 'fill="none"');
				}

				if (options?.raw) return html;
				return `data:image/svg+xml;base64,${Buffer.from(html.trim(), "utf-8").toString("base64")}`;
			},
		};

		// Factory function to create filter sections
		const createFilterSection = (options: typeof animeOptions, formats: typeof FORMATS, prefix: string) => [
			tray.stack(
				[
					tray.flex(
						[
							tray.div([], { className: "bg-center bg-no-repeat w-7 h-7", style: { backgroundImage: `url(${icons.get("genres")})` } }),
							tray.span("Genres", { className: "text-lg font-semibold" }),
						],
						{ gap: 0 },
					),
					tray.div(
						[
							GENRES.map((genre) =>
								tray.checkbox(genre, {
									value: options.genres.value.includes(genre),
									size: "sm",
									onChange: ctx.eventHandler(`${prefix}:cb:${genre}`, ({ value }) => {
										options.genres.set(value ? [...options.genres.value, genre] : options.genres.value.filter((x) => x !== genre));
									}),
								}),
							),
						],
						{ className: "grid grid-cols-3 w-full gap-x-2" },
					),
				],
				{ className: "items-center p-3 rounded-xl border my-4 bg-gray-950" },
			),
			...createSelectFilters(options, formats, prefix),
			createYearFilter(options, prefix),
		];

		// Factory function for select filters (format, season, status)
		const createSelectFilters = (options: typeof animeOptions, formats: typeof FORMATS, prefix: string) => [
			createSelectFilter("format", formats, options, prefix),
			createSelectFilter("season", SEASONS, options, prefix),
			createSelectFilter("status", STATUS, options, prefix),
			createSelectFilter("medialistStatus", MEDIALIST_STATUS, options, prefix),
		];

		// Factory function for individual select filter
		const createSelectFilter = <T extends string>(name: string, values: readonly T[], options: typeof animeOptions, prefix: string) =>
			tray.flex(
				[
					tray.flex(
						[
							tray.div([], {
								className: "bg-center bg-no-repeat w-4 h-4",
								style: { backgroundImage: `url(${icons.get(name as keyof typeof icons.html)})` },
							}),
							tray.span(name.replace(/\b\w/g, (l) => l[0].toUpperCase() + l.slice(1).toLowerCase())),
						],
						{
							className: "items-center px-3 rounded-xl border bg-gray-800/40",
							style: { borderTopRightRadius: "0", borderBottomRightRadius: "0" },
						},
					),
					tray.select("", {
						value: (options[name as keyof typeof options] as any).get() ?? "ALL",
						style: { borderTopLeftRadius: "0", borderBottomLeftRadius: "0", marginLeft: "-1px" },
						options: ["ALL", ...values].map((value) => ({
							value,
							label: value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
						})),
						onChange: ctx.eventHandler(`${prefix}:opts:${name}`, ({ value }) => {
							const optionState = options[name as keyof typeof options] as any;
							optionState.set(value === "ALL" ? null : value);
						}),
					}),
				],
				{ gap: 0, className: "my-4" },
			);

		// Factory function for year filter
		const createYearFilter = (options: typeof animeOptions, prefix: string) =>
			tray.flex(
				[
					tray.flex(
						[tray.div([], { className: "bg-center bg-no-repeat w-4 h-4", style: { backgroundImage: `url(${icons.get("calendar")})` } }), tray.span("From")],
						{
							className: "items-center px-3 rounded-xl border bg-gray-800/40",
							style: { borderTopRightRadius: "0", borderBottomRightRadius: "0" },
						},
					),
					tray.input({
						placeholder: "Year",
						style: { borderRadius: "0", marginLeft: "-1px", ...(state.invalidYearFromInput.get() ? { borderColor: "#eb4343" } : {}) },
						value: options.calendarYearFrom.get()?.toString() ?? "",
						onChange: ctx.eventHandler(`${prefix}:yearfrm`, ({ value }) => {
							if (value.length && (isNaN(parseInt(value)) || parseInt(value) < 1900 || parseInt(value) > 2100)) {
								return state.invalidYearFromInput.set(true);
							}
							state.invalidYearFromInput.set(false);
							options.calendarYearFrom.set(value.length ? parseInt(value) : null);
						}),
					}),
					tray.flex([tray.span("To")], { className: "items-center px-3 border bg-gray-800/40", style: { marginLeft: "-2px" } }),
					tray.input({
						placeholder: "Year",
						style: { borderTopLeftRadius: "0", borderBottomLeftRadius: "0", marginLeft: "-1px" },
						value: options.calendarYearTo.get()?.toString() ?? "",
						onChange: ctx.eventHandler(`${prefix}:yearto`, ({ value }) => {
							if (value.length && (isNaN(parseInt(value)) || parseInt(value) < 1900 || parseInt(value) > 2100)) {
								return state.invalidYearToInput.set(true);
							}
							state.invalidYearToInput.set(false);
							options.calendarYearTo.set(value.length ? parseInt(value) : null);
						}),
					}),
				],
				{ gap: 0, className: "my-4" },
			);

		tray.render(() =>
			tray.stack([
				tray.css(/*css*/ `
                    hover\\:text-[--muted] {
                        color: #fff6;
                    }
                    hover\\:bg-transparent {
                        background-color: #00000000;
                    }
                `),
				tray.flex(
					[
						tray.img({
							src: "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Random%20Entry/icon.png",
							alt: "re-icon",
							width: "100%",
							className: "w-10 h-10",
						}),
						tray.stack(
							[
								tray.text("Random Entry", { className: "text-lg font-bold" }),
								tray.text("Open a random media entry", { className: "text-[--muted] text-xs" }),
							],
							{ gap: 0, className: "flex-1" },
						),
						tray.tooltip(
							tray.button("\u200b", {
								intent: "gray-subtle",
								className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent",
								style: {
									backgroundImage: `url(${icons.get("anime")})`,
									backgroundSize: "1.5rem",
								},
								onClick: ctx.eventHandler("anime:random:button", () => {
									const { media } = getRandomMedia("Anime", animeOptions) ?? {};
									if (!media) return ctx.toast.warning("No entries found. Adjust your filters from the settings or update your list with more entries!");
									ctx.toast.success(`Navigating to random anime: ${media.title?.userPreferred ?? "???"} [${media.id}]`);
									ctx.screen.navigateTo("/entry", { id: media.id.toString() });
								}),
							}),
							{ text: "Random Anime" },
						),
						tray.tooltip(
							tray.button("\u200b", {
								intent: "gray-subtle",
								className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent",
								style: {
									backgroundImage: `url(${icons.get("manga")})`,
									backgroundSize: "1.5rem",
								},
								onClick: ctx.eventHandler("manga:random:button", () => {
									const { media } = getRandomMedia("Manga", mangaOptions) ?? {};
									if (!media) return ctx.toast.warning("No entries found. Adjust your filters from the settings or update your list with more entries!");
									ctx.toast.success(`Navigating to random manga: ${media.title?.userPreferred ?? "???"} [${media.id}]`);
									ctx.screen.navigateTo("/manga/entry", { id: media.id.toString() });
								}),
							}),
							{ text: "Random Manga" },
						),
						tray.modal({
							trigger: tray.tooltip(
								tray.button("\u200b", {
									intent: "gray-subtle",
									className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent",
									style: {
										backgroundImage: `url(${icons.get("settings")})`,
										backgroundSize: "1.5rem",
									},
								}),
								{ text: "Filters" },
							),
							title: "Random Entry Filters",
							description: "Configure filters for more granular control over randomly picked entries.",
							items: [
								tray.tabs({
									defaultValue: "anime",
									items: [
										tray.tabsList({
											items: [tray.tabsTrigger(tray.text("Anime"), { value: "anime" }), tray.tabsTrigger(tray.text("Manga"), { value: "manga" })],
										}),
										tray.tabsContent({
											value: "anime",
											className: "mt-3",
											items: createFilterSection(animeOptions, FORMATS, "anime"),
										}),
										tray.tabsContent({
											value: "manga",
											className: "mt-3",
											items: createFilterSection(mangaOptions, MANGA_FORMATS, "manga"),
										}),
									],
								}),
							],
						}),
					],
					{ className: "items-center" },
				),
			]),
		);

		// Create dropdown items for both anime and manga
		const animeDropdownEntry = ctx.action.newAnimeLibraryDropdownItem({
			label: "Open Random Anime",
			style: {
				backgroundImage: `url(${icons.get("dice")})`,
				backgroundSize: "1.5rem",
				backgroundPosition: "0.3rem center",
				backgroundRepeat: "no-repeat",
				paddingInlineStart: "2.15rem",
			},
		});

		animeDropdownEntry.mount();

		animeDropdownEntry.onClick(() => {
			const { media } = getRandomMedia("Anime", animeOptions) ?? {};
			if (!media) return ctx.toast.warning("No entries found. Adjust your filters from the settings or update your list with more entries!");
			ctx.toast.success(`Navigating to random anime: ${media.title?.userPreferred ?? "???"} [${media.id}]`);
			ctx.screen.navigateTo("/entry", { id: media.id.toString() });
		});

		function getRandomMedia<T extends "Anime" | "Manga">(type: T, options: typeof animeOptions, bypassCache: boolean = false) {
			const { lists } = $anilist[`get${type}Collection`](bypassCache).MediaListCollection ?? {};
			if (!lists) return;

			const entries = lists
				.flatMap(({ entries }) => entries)
				.filter(Boolean)
				.map((e) => ({ id: e!.id, status: e!.status, media: e!.media as T extends "Anime" ? $app.AL_BaseAnime : $app.AL_BaseManga }));

			const filtered = entries
				// Genre filters
				.filter((e) => options.genres.get().every((x) => e.media?.genres?.map((g) => g.valueOf())?.includes(x) ?? false))
				// Format filters
				.filter((e) => (options.format.get() ? options.format.get() === e.media?.format?.valueOf() : true))
				// Season filters
				.filter((e) => (options.season.get() ? options.season.get() === e.media?.season?.valueOf() : true))
				// Status filters
				.filter((e) => (options.status.get() ? options.status.get() === e.media?.status?.valueOf() : true))
				// Medialist status filters
				.filter((e) => (options.medialistStatus.get() ? options.medialistStatus.get() === e.status?.valueOf() : true))
				// Year filters
				.filter((e) => {
					const fr = options.calendarYearFrom.get();
					const to = options.calendarYearTo.get();
					const sy = ("seasonYear" in e.media ? e.media?.seasonYear : e.media.startDate?.year) ?? 0;

					if (fr && to) return Math.min(fr, to) <= sy && sy <= Math.max(fr, to);
					if (fr || to) return fr == sy || to == sy;
					return true;
				});

			// Using Fischer-Yates for better-less biased randomness
			const shuffled = [...filtered];
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
			return shuffled[0];
		}
	});
}
