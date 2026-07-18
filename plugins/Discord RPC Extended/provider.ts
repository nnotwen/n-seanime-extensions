/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./discord-rpc-extended.d.ts" />

// @ts-ignore
function init() {
	$shared.define("validate_presence_hook", function () {
		function validate<T extends $app.AL_MediaType>(
			type: T,
			e: T extends "ANIME" ? $app.DiscordPresenceAnimeActivityRequestedEvent : $app.DiscordPresenceMangaActivityRequestedEvent,
		) {
			let defaultPrevented = false;

			// Title language
			const t_lang = $getUserPreference("media_title_lang") as "userPreferred" | "english" | "romaji" | "native";
			if ("animeActivity" in e) {
				e.details = $anilist.getAnime(e.animeActivity?.id ?? NaN)?.title?.[t_lang] ?? e.details;
			}
			if ("mangaActivity" in e) {
				e.details = $anilist.getManga(e.mangaActivity?.id ?? NaN)?.title?.[t_lang] ?? e.details;
			}

			// Episode/Chapter formatting
			if ("animeActivity" in e && e.animeActivity?.episodeTitle)
				e.state = ($getUserPreference("episode_format") ?? "")
					.replace(/{{EP_NUM}}/g, e.animeActivity.episodeNumber.toString())
					.replace(/{{EP_TITLE}}/g, e.animeActivity.episodeTitle);

			if ("mangaActivity" in e && e.mangaActivity?.title) {
				e.state = ($getUserPreference("chapter_format") ?? "").replace(/{{CH_NUM}}/g, e.mangaActivity.chapter.toString());
			}

			// Hide Media Link
			if ($getUserPreference("disable_media_link") == "true") {
				e.detailsUrl = "";
			}

			// Displaying profile on tooltip
			if ($getUserPreference("display_profile_on_tooltip") == "true") {
				e.smallText = $database.anilist.getUsername();
				e.smallUrl = `https://anilist.co/user/${e.smallText}`;
				e.smallImage = $database.anilist.getAvatarUrl();
			}

			if ($getUserPreference("hide_private") == "true") {
				const mediaId = "animeActivity" in e ? e.animeActivity?.id : "mangaActivity" in e ? e.mangaActivity?.id : undefined;
				const isMediaPrivate = ($anilist[type === "ANIME" ? "getAnimeCollection" : "getMangaCollection"](false).MediaListCollection?.lists ?? [])
					.flatMap((list) => list.entries)
					.filter((entry) => Boolean(entry?.private?.valueOf()))
					.some((entry) => entry?.media?.id === mediaId);
				if (isMediaPrivate) defaultPrevented = true;
			}

			// Hide Adult Entries
			if ($getUserPreference("hide_adult") == "true") {
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
				e.smallText = "Paused";
				e.smallImage = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Discord%20RPC%20Extended/pause-icon.png";
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

		const t_lang = $getUserPreference("media_title_lang") as "userPreferred" | "english" | "romaji" | "native";
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
			"/schedule": "Viewing release schedules",
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
			"/schedule": "",
		};

		function isGenreIn(genre: string) {
			const genres = $getUserPreference("hide_genre_in")?.split(", ") ?? [];
			return genres.map((g) => g.toLowerCase()).some((g) => genre.toLowerCase() === g);
		}

		ctx.screen.onNavigate(async ({ pathname, searchParams }) => {
			const e: Required<$app.DiscordRPC_CustomActivity> = {
				type: 3,
				details: pnames[pathname as $drp.PathNames] || "Browsing",
				state: snames[pathname as $drp.PathNames] || "",
				largeImageKey: "",
				largeImageText: "",
				smallImageKey: "",
				smallImageText: "",
				buttons: [],
				startTimestamp: NaN,
				endTimestamp: NaN,
			};

			try {
				if (pathname === "/entry") {
					const anime = await ctx.anime.getAnimeEntry(Number(searchParams.id));
					e.state = anime.media?.title?.[t_lang] ?? anime.media?.title?.userPreferred ?? "";

					if ($getUserPreference("hide_adult") == "true" && anime.media?.isAdult?.valueOf()) return;
					if (anime.media?.genres?.some((g) => isGenreIn(g))) return;
				}

				if (pathname === "/manga/entry") {
					const manga = await ctx.manga.getMangaEntry(Number(searchParams.id));
					e.state = manga.media?.title?.[t_lang] ?? manga.media?.title?.userPreferred ?? "Manga";

					if ($getUserPreference("hide_adult") == "true" && manga.media?.isAdult?.valueOf()) return;
					if (manga.media?.genres?.some((g) => isGenreIn(g))) return;
				}

				if ($getUserPreference("display_profile_on_tooltip") == "true" && $getUserPreference("disable_tooltip_on_navigation") != "true") {
					e.smallImageText = $database.anilist.getUsername();
					e.smallImageKey = $database.anilist.getAvatarUrl();
				}

				ctx.discord.setCustomActivity(e);
			} catch (error) {
				ctx.toast.error(`Discord RPC Extended: ${(error as Error).message}`);
			}
		});

		// Emit onNavigate event to refresh the RPC Status
		$store.watch("DISCORD_PRESENCE_CLIENT_CLOSED", () => ctx.screen.loadCurrent());
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

	$app.onDiscordPresenceClientClosed((e) => $store.set("DISCORD_PRESENCE_CLIENT_CLOSED", undefined));
}
