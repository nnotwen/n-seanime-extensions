/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./discord-rpc-extended.d.ts" />

// @ts-ignore
function init() {
	$shared.define("validate_presence_hook", function () {
		function validate<T extends $app.AL_MediaType>(
			_: T,
			e: T extends "ANIME" ? $app.DiscordPresenceAnimeActivityRequestedEvent : $app.DiscordPresenceMangaActivityRequestedEvent,
		) {
			let defaultPrevented = false;

			// Episode/Chapter formatting
			if ("animeActivity" in e && e.animeActivity?.episodeTitle)
				e.state = ($getUserPreference("episode_format") ?? "")
					.replace(/{{EP_NUM}}/g, e.animeActivity.episodeNumber.toString())
					.replace(/{{EP_TITLE}}/g, e.animeActivity.episodeTitle);

			if ("mangaActivity" in e && e.mangaActivity?.title) {
				e.state = ($getUserPreference("chapter_format") ?? "").replace(/{{CH_NUM}}/g, e.mangaActivity.chapter.toString());
			}

			// Hide Media Link
			if ($getUserPreference("disable_media_link")) {
				e.detailsUrl = "";
			}

			// Displaying profile on tooltip
			if ($getUserPreference("display_profile_on_tooltip")) {
				e.smallText = $database.anilist.getUsername();
				e.smallUrl = `https://anilist.co/user/${e.smallText}`;
				// Temporary, wait on $database.anilist.getAvatarURL()
				e.smallImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/AniList_logo.svg/250px-AniList_logo.svg.png";
			}

			// Hide Adult Entries
			if ($getUserPreference("hide_adult")) {
				if ("animeActivity" in e && $anilist.getAnime(e.animeActivity?.id ?? NaN).isAdult?.valueOf()) {
					defaultPrevented = true;
				}

				if ("mangaActivity" in e && $anilist.getManga(e.mangaActivity?.id ?? NaN).isAdult?.valueOf()) {
					defaultPrevented = true;
				}
			}

			// Hide Genres in:
			const genres =
				$getUserPreference("hide_genre_in")
					?.split(",")
					.map((g) => g.toLowerCase()) ?? [];
			if (genres.length) {
				if ("animeActivity" in e && $anilist.getAnime(e.animeActivity?.id ?? NaN).genres?.some((g) => genres.includes(g.valueOf().toLowerCase()))) {
					defaultPrevented = true;
				}

				if ("mangaActivity" in e && $anilist.getManga(e.mangaActivity?.id ?? NaN).genres?.some((g) => genres.includes(g.valueOf().toLowerCase()))) {
					defaultPrevented = true;
				}
			}

			// Suppress state if media is paused
			if ("animeActivity" in e && e.animeActivity?.paused) {
				if (e.animeActivity?.isMovie) {
					e.state = "Paused";
				} else {
					e.state = ($getUserPreference("episode_paused_format") ?? "")
						.replace(/{{EP_NUM}}/g, e.animeActivity.episodeNumber.toString())
						.replace(/{{EP_TITLE}}/g, (e.animeActivity.episodeTitle ?? "").toString());
				}
			}

			const { next, preventDefault, ...newVal } = e;
			return { defaultPrevented, newVal };
		}

		return {
			anime(e: $app.DiscordPresenceAnimeActivityRequestedEvent) {
				return validate("ANIME", e);
			},
			manga(e: $app.DiscordPresenceMangaActivityRequestedEvent) {
				return validate("MANGA", e);
			},
		};
	});

	$ui.register((ctx) => {
		// Never register ui context if not required by the current runtime
		if ($getUserPreference("disable_rpc_navigation") == "true") return;

		const pnames: Record<$drp.PathNames, string> = {
			"/": "On the Homepage",
			"/custom-sources": "Browsing Custom Source",
			"/discover": "Discovering Media",
			"/entry": "Viewing Anime",
			"/extensions": "Browsing the Marketplace",
			"/lists": "Checking my lists",
			"/manga": "On the Homepage",
			"/manga/entry": "Viewing Manga",
			"/scan-summaries": "Checking scan summaries",
			"/search": "Searching for anime...",
			"/settings": "Checking the Settings",
			"/sync": "",
			"/torrent-list": "",
		};

		const snames: Record<$drp.PathNames, string> = {
			"/": "Browsing Anime",
			"/custom-sources": "",
			"/discover": "",
			"/entry": "",
			"/extensions": "",
			"/lists": "",
			"/manga": "Browsing Manga",
			"/manga/entry": "",
			"/scan-summaries": "",
			"/search": "",
			"/settings": "",
			"/sync": "",
			"/torrent-list": "",
		};

		ctx.screen.onNavigate(async ({ pathname, searchParams }) => {
			const genres =
				$getUserPreference("hide_genre_in")
					?.split(",")
					.map((g) => g.toLowerCase()) ?? [];

			try {
				let title = pnames[pathname as $drp.PathNames] ?? "Browsing";
				let state = snames[pathname as $drp.PathNames] ?? "";

				if (pathname === "/entry") {
					const anime = await ctx.anime.getAnimeEntry(Number(searchParams.id));
					state = anime.media?.title?.userPreferred ?? "";
					if (anime.media?.isAdult?.valueOf() || anime.media?.genres?.some((g) => genres.includes(g.valueOf().toLowerCase()))) return;
				}

				if (pathname === "/manga/entry") {
					const manga = await ctx.manga.getMangaEntry(Number(searchParams.id));
					state = manga.media?.title?.userPreferred ?? "Manga";
					if (manga.media?.isAdult?.valueOf() || manga.media?.genres?.some((g) => genres.includes(g.valueOf()))) return;
				}

				// custom status here

				// // Displaying profile on tooltip
				// if ($getUserPreference("display_profile_on_tooltip")) {
				// 	e.smallText = $database.anilist.getUsername();
				// 	e.smallUrl = `https://anilist.co/user/${e.smallText}`;
				// 	e.smallImage = ""; // wait on $database.anilist.getAvatarURL()
				// }
			} catch (error) {
				ctx.toast.error((error as Error).message);
			}
		});

		ctx.screen.loadCurrent();
	});

	$app.onDiscordPresenceAnimeActivityRequested((e) => {
		const v: { defaultPrevented: boolean; newVal: Omit<typeof e, "next" | "preventDefault"> } = $shared.use("validate_presence_hook").anime(e);
		if (v.defaultPrevented) return e.preventDefault();
		e = { ...e, ...v.newVal };
		e.next();
	});

	$app.onDiscordPresenceMangaActivityRequested((e) => {
		const v: { defaultPrevented: boolean; newVal: Omit<typeof e, "next" | "preventDefault"> } = $shared.use("validate_presence_hook").manga(e);
		if (v.defaultPrevented) return e.preventDefault();
		e = { ...e, ...v.newVal };
		e.next();
	});

	$app.onDiscordPresenceClientClosed((e) => {
		e.next();
	});
}
