/// <reference path="./../../plugin.d.ts" />
/// <reference path="./../../system.d.ts" />
/// <reference path="./../../app.d.ts" />

function init() {
	$ui.register((ctx) => {
		// const indicator = "anilist-private-media-page-indicator";
		const storeId = "anilist-private";

		// Preload private flags into store
		$anilist
			.getAnimeCollection(false)
			.MediaListCollection?.lists?.forEach((list) =>
				list.entries?.forEach((entry) => {
					if (entry.media?.id) {
						$store.set(
							`${storeId}.${entry.media.id}`,
							entry.private?.valueOf()
						);
					}
				})
			);

		const animePageButton = ctx.action.newAnimePageButton({
			label: "Private",
			intent: "gray-subtle",
		});

		animePageButton.mount();

		animePageButton.onClick(async (event) => {
			if (!$database.anilist.getToken()) {
				return ctx.toast.warning(
					"Feature Unavailable. Please login with your Anilist Account"
				);
			}

			const key = `${storeId}.${event.media.id}`;
			const current = $store.get(key) ?? false;
			const next = !current;

			ctx.toast.info("Updating current entry...");

			const query = `
        mutation SaveMediaListEntry($mediaId: Int!, $private: Boolean!) {
          SaveMediaListEntry(mediaId: $mediaId, private: $private) {
            private
            media { id title { userPreferred } }
            updatedAt
          }
        }
      `;

			const variables = { mediaId: event.media.id, private: next };

			const res = await ctx.fetch("https://graphql.anilist.co", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + $database.anilist.getToken(),
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ query, variables }),
			});

			if (!res.ok) {
				return ctx.toast.error("Failed to update entry: " + res.status);
			}

			const json = await res.json();
			if (json.errors) {
				return ctx.toast.error(
					"Failed to update entry: " +
						json.errors.map((e: any) => e.message).join(", ")
				);
			}

			const entry = json.data.SaveMediaListEntry;
			const title = entry.media.title.userPreferred;
			const isPrivate = entry.private;

			updatePrivateTag(isPrivate);

			ctx.toast.success(
				isPrivate
					? `Set ${title} to private!`
					: `Removed ${title} from private!`
			);

			$store.set(key, isPrivate);
		});

		function updatePrivateTag(isPrivate: boolean) {
			animePageButton.setIntent(isPrivate ? "alert" : "gray-subtle");
			animePageButton.mount();

			// Optional DOM tag logic (currently commented out)
			// if (isPrivate) {
			//   ctx.dom.queryOne("[data-media-page-header-entry-details-more-info='true']").then(async (el) => {
			//     if (!el) return;
			//     const privateEl = await ctx.dom.createElement("div");
			//     privateEl.setAttribute("class", `${indicator} ...`);
			//     privateEl.setText("Private");
			//     el.append(privateEl);
			//   });
			// } else {
			//   ctx.dom.queryOne("." + indicator).then((el) => el?.remove());
			// }
		}

		ctx.screen.onNavigate((e) => {
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const id = parseInt(e.searchParams.id);
				const isCurrentMediaPrivate = $store.get(`${storeId}.${id}`);
				updatePrivateTag(Boolean(isCurrentMediaPrivate));
			}
		});
	});
}
