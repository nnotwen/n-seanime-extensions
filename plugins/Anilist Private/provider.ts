/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./anilist-private.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const currentMediaId = ctx.state<number | null>(null);
		const currentMediaType = ctx.state<$app.AL_MediaType | null>(null);
		const isUpdating = ctx.state<boolean>(false);
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

		const Private = {
			id: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
				const r = (Math.random() * 16) | 0;
				const v = c === "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			}),
			get store() {
				return $store.getOrSet(this.id, () => [] as number[]);
			},
			has(mediaId: number) {
				return this.store.includes(mediaId);
			},
			// Returns true if the mediaId was added
			async add(mediaId: number) {
				const data = await this.toggleAnilist(mediaId, true).catch((e) => (e as Error).message);
				if (typeof data === "string") throw new Error(data);
				if (data.data.SaveMediaListEntry.private !== true) throw new Error(`Conflict on returned data: request=private:true response=private:false`);
				$store.set(this.id, [...new Set([...this.store, mediaId])]);
				return this.has(mediaId);
			},
			// Returns true if mediaId was removed
			async remove(mediaId: number) {
				const data = await this.toggleAnilist(mediaId, false).catch((e) => (e as Error).message);
				if (typeof data === "string") throw new Error(data);
				if (data.data.SaveMediaListEntry.private !== false) throw new Error(`Conflict on returned data: request=private:false response=private:true`);
				// prettier-ignore
				$store.set(this.id, this.store.filter(n => mediaId !== n));
				return !this.has(mediaId);
			},
			// Calls Anilist API;
			async toggleAnilist(mediaId: number, isPrivate: boolean) {
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

				const json = res.json?.();
				if (!res.ok || !json?.data) throw new Error(json?.errors?.map((e: any) => `(${e.status}) ${e.message}`).join("\n") ?? res.statusText);

				return json as AnilistData;
			},
			async init() {
				type listEntries = $app.AL_AnimeCollection_MediaListCollection_Lists_Entries | $app.AL_MangaCollection_MediaListCollection_Lists_Entries;
				type media = $app.AL_BaseAnime | $app.AL_BaseManga;
				type EntryWithMedia = listEntries & { media: media; private: boolean };

				for (const mediaType of ["Anime", "Manga"] as const) {
					($anilist[`get${mediaType}Collection`](false).MediaListCollection?.lists ?? [])
						.flatMap((list) => list.entries)
						.filter((entry): entry is EntryWithMedia => Boolean(entry?.media && entry?.private?.valueOf()))
						.forEach((entry) => this.add(entry.media.id));
				}
			},
		};

		async function handleButtonPress({ media }: { media: $app.AL_BaseAnime | $app.AL_BaseManga }) {
			isUpdating.set(true);
			return ctx.setTimeout(
				() =>
					Private[Private.has(media.id) ? "remove" : "add"](media.id)
						.then(() => ctx.toast.success(`Set ${media.title?.userPreferred ?? "entry"} to ${Private.has(media.id) ? "private" : "public"}!`))
						.catch((err) => ctx.toast.error(`Error on updating ${media.title?.userPreferred ?? "entry"}: ${(err as Error).message}`))
						.finally(() => isUpdating.set(false)),
				1_500
			);
		}

		const animeButton = ctx.action.newAnimePageButton({ label: "\u200b", intent: "gray-subtle", style: btnIconStyles });
		const mangaButton = ctx.action.newMangaPageButton({ label: "\u200b", intent: "gray-subtle", style: btnIconStyles });

		for (const button of [animeButton, mangaButton]) {
			button.mount();
			(button.onClick as (h: (e: { media: $app.AL_BaseAnime | $app.AL_BaseManga }) => void) => void)(handleButtonPress);
		}

		ctx.screen.onNavigate((e) => {
			if ((e.pathname === "/entry" || e.pathname === "/manga/entry") && !!e.searchParams.id) {
				const id = parseInt(e.searchParams.id);
				currentMediaId.set(id);
				currentMediaType.set(e.pathname === "/entry" ? "ANIME" : "MANGA");
			} else {
				currentMediaId.set(null);
				currentMediaType.set(null);
			}
		});

		ctx.effect(() => {
			const mediaType = currentMediaType.get();
			if (!mediaType) return;

			const mediaId = currentMediaId.get();
			if (!mediaId) return;

			const updating = isUpdating.get();
			const button = mediaType === "ANIME" ? animeButton : mangaButton;

			button.setStyle({ ...btnIconStyles, ...(updating ? { backgroundImage: "" } : {}) });
			button.setLoading(updating);
			button.setIntent(Private.has(mediaId) ? "alert" : "gray-subtle");
		}, [currentMediaId, isUpdating]);

		Private.init();
		ctx.screen.loadCurrent();
	});
}
