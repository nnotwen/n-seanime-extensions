/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./untracked.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		// prettier-ignore
		const trackIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2NhY2FjYSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOCAxNi4wMTZhNy41IDcuNSAwIDAgMCAxLjk2Mi0xNC43NEExIDEgMCAwIDAgOSAwSDdhMSAxIDAgMCAwLS45NjIgMS4yNzZBNy41IDcuNSAwIDAgMCA4IDE2LjAxNm02LjUtNy41YTYuNSA2LjUgMCAxIDEtMTMgMCA2LjUgNi41IDAgMCAxIDEzIDAiLz48cGF0aCBkPSJtNi45NCA3LjQ0IDQuOTUtMi44My0yLjgzIDQuOTUtNC45NDkgMi44MyAyLjgyOC00Ljk1eiIvPjwvc3ZnPg==";
		const iconStyles = {
			backgroundRepeat: "no-repeat",
			backgroundPosition: "0.65em center",
			textIndent: "1.8em",
		};

		const preference = {
			isAllEcchiUntracked: $getUserPreference("ecchi") === "true",
			isAllHentaiUntracked: $getUserPreference("hentai") === "true",
		};

		const state = {
			dropdownItemLabel: ctx.state<"Untrack" | "Track">("Untrack"),
			pageReloadDueToMissedDom: ctx.state<number>(2_000),
			isCurrentMediaUntracked: ctx.state<boolean>(false),
		};

		const storage = {
			key: "899bb401-e9bb-4796-ab11-971be4c4f6c0",
			init() {
				if (!$storage.has(this.key)) {
					$storage.set(this.key, [] as number[]);
				}
			},
			get(): number[] {
				this.init();
				return ($storage.get(this.key) as number[]) ?? [];
			},
			isUntracked(mediaId: number): boolean {
				return this.get().includes(mediaId);
			},
			untrack(mediaId: number) {
				this.init();
				const ids = this.get();
				if (!ids.includes(mediaId)) {
					ids.push(mediaId);
					$storage.set(this.key, ids);
				}
			},
			retrack(mediaId: number) {
				this.init();
				const ids = this.get().filter((id) => id !== mediaId);
				$storage.set(this.key, ids);
			},
		};

		const dropdownItem = ctx.action.newAnimePageDropdownItem({
			label: state.dropdownItemLabel.get(),
			style: { ...iconStyles, backgroundImage: `url(${trackIcon})` },
		});

		dropdownItem.mount();
		dropdownItem.onClick(({ media }) => {
			if (storage.isUntracked(media.id)) {
				state.dropdownItemLabel.set("Track");
				storage.retrack(media.id);
			} else {
				state.dropdownItemLabel.set("Untrack");
				storage.untrack(media.id);
			}
			ctx.screen.loadCurrent();
		});

		ctx.effect(() => {
			dropdownItem.setLabel(state.dropdownItemLabel.get());
		}, [state.dropdownItemLabel]);

		ctx.screen.onNavigate(async (e) => {
			if (e.pathname !== "/entry" || !e.searchParams.id) return;
			const mediaId = parseInt(e.searchParams.id);

			const anime = $anilist.getAnime(mediaId);
			if (anime && anime.isAdult?.valueOf() && preference.isAllHentaiUntracked) {
				state.isCurrentMediaUntracked.set(true);
				dropdownItem.unmount();
			} else if (anime && anime.genres?.some((g) => g.trim().toLowerCase() === "ecchi") && preference.isAllEcchiUntracked) {
				state.isCurrentMediaUntracked.set(true);
				dropdownItem.unmount();
			} else {
				state.isCurrentMediaUntracked.set(storage.isUntracked(mediaId));
				state.dropdownItemLabel.set(state.isCurrentMediaUntracked.get() ? "Track" : "Untrack");
				dropdownItem.mount();
			}

			const container = await ctx.dom.queryOne("[data-media-page-header-entry-details-date-container]");
			if (!container) {
				// retry loading the current page after several seconds
				ctx.setTimeout(() => {
					ctx.screen.loadCurrent();
					state.pageReloadDueToMissedDom.set(state.pageReloadDueToMissedDom.get() + 2_000);
				}, 2_000);
				return console.log("Error: Unable to get page header entry details container. Reoading page in 2 seconds.");
			}

			state.pageReloadDueToMissedDom.set(2_000);

			if (!state.isCurrentMediaUntracked.get()) {
				const tags = await container.query(`[data-untracked]`);
				for (const tag of tags) tag.remove();
			} else {
				// Check the page if tag already exists (early return if it does)
				const existing = await container.queryOne(`[data-untracked]`);
				if (existing) return;

				const tag = await ctx.dom.createElement("span");
				tag.setInnerHTML("Untracked");
				tag.setAttribute(`data-untracked`, mediaId.toString());
				tag.setStyle("background-color", "#ef4444d9");
				tag.setStyle("padding", "0 10px");
				tag.setStyle("border-radius", "9999px");
				tag.setStyle("color", "#fff");
				container.append(tag);
			}
		});

		ctx.screen.loadCurrent();
	});

	$app.onPreUpdateEntryProgress((e) => {
		if (!e.mediaId) return;

		if (($storage.get("899bb401-e9bb-4796-ab11-971be4c4f6c0") as Array<number> | undefined)?.map(Number).includes(Number(e.mediaId))) {
			console.log(`[Untracked:Record]: Skipping entry progress update for ${e.mediaId}`);
			e.preventDefault();
			return;
		}

		if ($getUserPreference("hentai") === "true") {
			try {
				const mediaEntry = $anilist.getAnime(e.mediaId);
				if (mediaEntry?.isAdult?.valueOf()) {
					console.log(`[Untracked:Hentai]: Skipping entry progress update for ${e.mediaId}`);
					e.preventDefault();
					return;
				}
			} catch (err) {}
		}

		if ($getUserPreference("ecchi") === "true") {
			try {
				const mediaEntry = $anilist.getAnime(e.mediaId);
				if (mediaEntry?.genres?.some((g) => g.trim().toLowerCase() === "ecchi")) {
					console.log(`[Untracked:Ecchi]: Skipping entry progress update for ${e.mediaId}`);
					e.preventDefault();
					return;
				}
			} catch (err) {}
		}

		e.next();
	});

	$app.onPreUpdateEntryRepeat((e) => {
		if (!e.mediaId) return;

		if (($storage.get("899bb401-e9bb-4796-ab11-971be4c4f6c0") as Array<number> | undefined)?.map(Number).includes(Number(e.mediaId))) {
			console.log(`[Untracked:Record]: Skipping entry progress update for ${e.mediaId}`);
			e.preventDefault();
			return;
		}

		if ($getUserPreference("hentai") === "true") {
			try {
				const mediaEntry = $anilist.getAnime(e.mediaId);
				if (mediaEntry?.isAdult?.valueOf()) {
					console.log(`[Untracked:Hentai]: Skipping entry progress update for ${e.mediaId}`);
					e.preventDefault();
					return;
				}
			} catch (err) {}
		}

		if ($getUserPreference("ecchi") === "true") {
			try {
				const mediaEntry = $anilist.getAnime(e.mediaId);
				if (mediaEntry?.genres?.some((g) => g.trim().toLowerCase() === "ecchi")) {
					console.log(`[Untracked:Ecchi]: Skipping entry progress update for ${e.mediaId}`);
					e.preventDefault();
					return;
				}
			} catch (err) {}
		}

		e.next();
	});

	$app.onDiscordPresenceAnimeActivityRequested((e) => {
		if ($getUserPreference("hidediscord") === "true") {
			if (($storage.get("899bb401-e9bb-4796-ab11-971be4c4f6c0") as Array<number> | undefined)?.map(Number).includes(Number(e?.animeActivity?.id))) {
				console.log(`[Untracked:Record]: Skipping entry progress update for ${e?.animeActivity?.id}`);
				e.preventDefault();
				return;
			}
		}
		e.next();
	});

	$app.onDiscordPresenceMangaActivityRequested((e) => {
		if ($getUserPreference("hidediscord") === "true") {
			if (($storage.get("899bb401-e9bb-4796-ab11-971be4c4f6c0") as Array<number> | undefined)?.map(Number).includes(Number(e?.mangaActivity?.id))) {
				console.log(`[Untracked:Record]: Skipping entry progress update for ${e?.mangaActivity?.id}`);
				e.preventDefault();
				return;
			}
		}
		e.next();
	});
}
