/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./untracked.d.ts" />

function init() {
	$ui.register((ctx) => {
		// prettier-ignore
		const trackIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2NhY2FjYSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOCAxNi4wMTZhNy41IDcuNSAwIDAgMCAxLjk2Mi0xNC43NEExIDEgMCAwIDAgOSAwSDdhMSAxIDAgMCAwLS45NjIgMS4yNzZBNy41IDcuNSAwIDAgMCA4IDE2LjAxNm02LjUtNy41YTYuNSA2LjUgMCAxIDEtMTMgMCA2LjUgNi41IDAgMCAxIDEzIDAiLz48cGF0aCBkPSJtNi45NCA3LjQ0IDQuOTUtMi44My0yLjgzIDQuOTUtNC45NDkgMi44MyAyLjgyOC00Ljk1eiIvPjwvc3ZnPg==";
		const iconStyles = {
			backgroundRepeat: "no-repeat",
			backgroundPosition: "0.65em center",
			textIndent: "1.8em",
		};

		// states
		const dropdownItemLabel = ctx.state<"Untrack" | "Track">("Untrack");
		const isCurrentMediaUntracked = ctx.state<boolean>(false);
		const isAllHentaiUntracked = $getUserPreference("hentai") === "true";
		const isAllEcchiUntracked = $getUserPreference("ecchi") === "true";

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
			label: dropdownItemLabel.get(),
			style: { ...iconStyles, backgroundImage: `url(${trackIcon})` },
		});

		dropdownItem.mount();

		dropdownItem.onClick(({ media }) => {
			if (storage.isUntracked(media.id)) {
				dropdownItemLabel.set("Track");
				storage.retrack(media.id);
			} else {
				dropdownItemLabel.set("Untrack");
				storage.untrack(media.id);
			}
			ctx.screen.loadCurrent();
		});

		ctx.effect(() => {
			dropdownItem.setLabel(dropdownItemLabel.get());
		}, [dropdownItemLabel]);

		ctx.screen.onNavigate(async (e) => {
			if (e.pathname !== "/entry" || !e.searchParams.id) return;
			const mediaId = parseInt(e.searchParams.id);

			const anime = $anilist.getAnime(mediaId);
			if (anime && anime.isAdult?.valueOf() && isAllHentaiUntracked) {
				isCurrentMediaUntracked.set(true);
				dropdownItem.unmount();
			} else if (anime && anime.genres?.some((g) => g.trim().toLowerCase() === "ecchi") && isAllEcchiUntracked) {
				isCurrentMediaUntracked.set(true);
				dropdownItem.unmount();
			} else {
				isCurrentMediaUntracked.set(storage.isUntracked(mediaId));
				dropdownItemLabel.set(isCurrentMediaUntracked.get() ? "Track" : "Untrack");
				dropdownItem.mount();
			}

			const container = await ctx.dom.queryOne("[data-media-page-header-entry-details-date-container]");
			if (!container) {
				// retry loading the current page after several seconds
				ctx.setTimeout(() => ctx.screen.loadCurrent(), 2_000);
				return console.log("Error: Unable to get page header entry details container. Reoading page in 2 seconds.");
			}

			if (!isCurrentMediaUntracked.get()) {
				const tag = await container.queryOne(`[data-untracked]`);
				if (tag) tag.remove();
			} else {
				// Check the page if tag already exists (early return if it is)
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

	// $app.onPreUpdateEntry is called when user edits so do not
	// modify it, just use these two
	$app.onPreUpdateEntryProgress((e) => {
		if (!e.mediaId) return;

		if ($storage.get("899bb401-e9bb-4796-ab11-971be4c4f6c0")?.includes(e.mediaId)) {
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

		if ($storage.get("899bb401-e9bb-4796-ab11-971be4c4f6c0")?.includes(e.mediaId)) {
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
}
