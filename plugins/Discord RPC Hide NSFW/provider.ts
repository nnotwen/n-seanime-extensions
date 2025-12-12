/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />

// @ts-ignore
function init() {
	$app.onDiscordPresenceAnimeActivityRequested((e) => {
		const animeActivity = e.animeActivity;
		if (!animeActivity) {
			e.next();
			return;
		}

		const media = $anilist.getAnime(animeActivity.id);
		if (media.isAdult?.valueOf()) {
			console.log("Adult media detected... cancelling Discord RPC Update");
			e.preventDefault();
			return;
		}

		const ecchi = $getUserPreference("ecchi") === "true";
		if (ecchi && media.genres?.some((g) => g.trim().toLowerCase() === "ecchi")) {
			console.log("Ecchi media detected... cancelling Discord RPC Update");
			e.preventDefault();
			return;
		}

		const isPrivate = $getUserPreference("private") === "true";
		if (isPrivate) {
			const isMediaPrivate = ($anilist.getAnimeCollection(false).MediaListCollection?.lists ?? [])
				.flatMap((list) => list.entries)
				.filter((entry) => Boolean(entry?.private?.valueOf()))
				.some((entry) => entry?.media?.id === animeActivity.id);
			if (isMediaPrivate) {
				console.log("Private media detected... Cancelling Discord RPC Update");
				e.preventDefault();
				return;
			}
		}

		e.next();
	});

	$app.onDiscordPresenceMangaActivityRequested((e) => {
		const mangaActivity = e.mangaActivity;
		if (!mangaActivity) {
			e.next();
			return;
		}

		const media = $anilist.getManga(mangaActivity.id);
		if (media.isAdult?.valueOf()) {
			console.log("Adult media detected... cancelling Discord RPC Update");
			e.preventDefault();
			return;
		}

		const ecchi = $getUserPreference("ecchi") === "true";
		if (ecchi && media.genres?.some((g) => g.trim().toLowerCase() === "ecchi")) {
			console.log("Ecchi media detected... cancelling Discord RPC Update");
			e.preventDefault();
			return;
		}

		const isPrivate = $getUserPreference("private") === "true";
		if (isPrivate) {
			const isMediaPrivate = ($anilist.getMangaCollection(false).MediaListCollection?.lists ?? [])
				.flatMap((list) => list.entries)
				.filter((entry) => Boolean(entry?.private?.valueOf()))
				.some((entry) => entry?.media?.id === mangaActivity.id);
			if (isMediaPrivate) {
				console.log("Private media detected... Cancelling Discord RPC Update");
				e.preventDefault();
				return;
			}
		}

		e.next();
	});
}
