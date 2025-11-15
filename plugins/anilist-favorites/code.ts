/// <reference path="./../../plugin.d.ts" />
/// <reference path="./../../system.d.ts" />
/// <reference path="./../../app.d.ts" />

function init() {
	$ui.register(async (ctx) => {
		// This does not work yet. Logic is hard
		return;

		const favorites: number[] = []; // mediaId favorites

		// Query favorites
		const query = `query {
						Viewer {
							favourites {
								anime {
									nodes {
									id
									}
								}
							}
						}
					}
		`;

		const res = await ctx.fetch("https://graphql.anilist.co", {
			method: "POST",
			headers: {
				Authorization: "Bearer " + $database.anilist.getToken(),
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ query }),
		});

		if (!res.ok)
			return ctx.toast.error("Failed to fetch user favorites: " + res.status);

		const json = await res.json();
		if (json.errors)
			return ctx.toast.error(
				"Failed to update entry: " +
					json.errors.map((e: any) => e.message).join(", ")
			);

		favorites.push(
			...json.data.Viewer.favourites.anime.nodes.map(
				(node: { id: number }) => node.id
			)
		);

		const animePageButton = ctx.action.newAnimePageButton({
			label: "Favorite",
			intent: "gray-subtle",
		});

		animePageButton.mount();

		animePageButton.onClick(async function (event) {
			if (!$database.anilist.getToken())
				return ctx.toast.warning(
					"Feature Unavailable. Please login with your Anilist Account"
				);

			ctx.toast.info("Updating current entry...");
			const isFavouriteBeforeUpdate = favorites.indexOf(event.media.id) !== -1;

			// Save to anilist
			const query = `mutation ToggleFavourite($animeId: Int!) {
							ToggleFavourite(animeId: $animeId) {
								anime(page:1, perPage:1){
									pageInfo {
										hasNextPage
									}
								}
							}
						}
					`;

			const variables = {
				animeId: event.media.id,
			};

			const res = await ctx.fetch("https://graphql.anilist.co", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + $database.anilist.getToken(),
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ query, variables }),
			});

			if (!res.ok)
				return ctx.toast.error("Failed to update entry: " + res.status);

			const json = await res.json();
			if (json.errors)
				return ctx.toast.error(
					"Failed to update entry: " +
						json.errors.map((e: any) => e.message).join(", ")
				);

			if (isFavouriteBeforeUpdate) {
				removeFavouriteTagToMediaPage();
				favorites.splice(favorites.indexOf(event.media.id), 1);
			} else {
				favorites.push(event.media.id);
				addFavouriteTagToMediaPage();
			}
		});

		ctx.screen.onNavigate((e) => {
			// If viewing an anime page
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const id = parseInt(e.searchParams.id);

				if (favorites.indexOf(id) !== -1) {
					addFavouriteTagToMediaPage();
				} else {
					removeFavouriteTagToMediaPage();
				}
			}
		});

		function addFavouriteTagToMediaPage() {
			animePageButton.setIntent("alert");
			animePageButton.mount();
		}

		function removeFavouriteTagToMediaPage() {
			animePageButton.setIntent("gray-subtle");
			animePageButton.mount();
		}
	});
}
