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
		// prettier-ignore
		if (ecchi && media.genres?.some(g => g.trim().toLowerCase() === "ecchi")){
			console.log("Ecchi media detected... cancelling Discord RPC Update");
			e.preventDefault();
			return;
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
		// prettier-ignore
		if (ecchi && media.genres?.some(g => g.trim().toLowerCase() === "ecchi")){
			console.log("Ecchi media detected... cancelling Discord RPC Update");
			e.preventDefault();
			return;
		}

		e.next();
	});
}
