/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />

function init() {
	$app.onDiscordPresenceAnimeActivityRequested((e) => {
		const animeActivity = e.animeActivity;
		if (!animeActivity) {
			e.next();
			return;
		}

		const isAdult = $anilist.getAnime(animeActivity.id).isAdult ?? false;
		if (isAdult) {
			console.log("Adult media detected... cancelling Discord RPC Update");
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

		const isAdult = $anilist.getManga(mangaActivity.id).isAdult ?? false;
		if (isAdult) {
			console.log("Adult media detected... cancelling Discord RPC Update");
			e.preventDefault();
			return;
		}

		e.next();
	});
}
