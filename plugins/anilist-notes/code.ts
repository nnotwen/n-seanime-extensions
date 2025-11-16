/// <reference path="./../../plugin.d.ts" />
/// <reference path="./../../system.d.ts" />
/// <reference path="./../../app.d.ts" />

function init() {
	$ui.register((ctx) => {
		const iconUrl =
			"https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/anilist-notes/icon.png";

		const currentMediaId = ctx.state<number | null>(null);
		const titleFieldRef = ctx.fieldRef("initial title");
		const noteFieldRef = ctx.fieldRef("initial note");

		// Cache the notes from the anime collection
		$anilist
			.getAnimeCollection(false)
			.MediaListCollection?.lists?.forEach((list) =>
				list.entries?.forEach((entry) => {
					if (entry.media && entry.notes) {
						$store.set("anilist-notes." + entry.media.id, entry.notes);
					}
				})
			);

		const tray = ctx.newTray({ iconUrl, withContent: true });

		function updateTray(anime: $app.AL_BaseAnime) {
			currentMediaId.set(anime.id);
			titleFieldRef.setValue(anime.title?.userPreferred || "Untitled");
			noteFieldRef.setValue($store.get("anilist-notes." + anime.id) || "");
		}

		const handleButtonPress = (event: { media: $app.AL_BaseAnime }) => {
			currentMediaId.set(event.media.id);
			updateTray(event.media);
			tray.open();
		};

		async function getCurrentAnime(): Promise<$app.AL_BaseAnime | undefined> {
			return (await ctx.anime.getAnimeEntry(currentMediaId.get() || 0)).media;
		}

		tray.render(() => {
			if (!$database.anilist.getToken())
				return tray.div([
					tray.stack(
						[
							tray.text("Anilist Notes"),
							tray.text(
								"You need to be logged in to Anilist to use this plugin.",
								{
									style: { color: "#e26f6fff", fontSize: "13px" },
								}
							),
						],
						{ gap: 1 }
					),
				]);

			if (!currentMediaId.get())
				return tray.flex(
					[
						tray.div([], {
							style: {
								width: "2.5em",
								height: "2.5em",
								backgroundImage: `url(${iconUrl})`,
								backgroundSize: "contain",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
							},
						}),
						tray.stack(
							[
								tray.text("AniList Notes", {
									style: { fontSize: "1.2em", "font-weight": "700" },
								}),
								// tray.text("Open an anime page to start editing notes", {
								// 	style: { fontSize: "14px", color: "#666" },
								// }),
								// Temporary solution:::
								tray.text(
									'To edit a note, click the "Edit Note" button on the anime’s page, or right‑click the anime and choose "Edit Note" from the menu.',
									{
										style: { fontSize: "14px", color: "#666" },
									}
								),
							],
							{ gap: 1 }
						),
					],
					{ direction: "row", gap: 3, style: { padding: "10px" } }
				);

			return tray.stack(
				[
					// Header
					tray.flex(
						[
							tray.div([], {
								style: {
									width: "2.5em",
									height: "2.5em",
									backgroundImage: `url(${iconUrl})`,
									backgroundSize: "contain",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
								},
							}),
							tray.stack(
								[
									tray.text("Edit Note", {
										style: { fontSize: "1.5em", "font-weight": "700" },
									}),
									tray.text(titleFieldRef.current, {
										style: { fontSize: "14px", color: "#666" },
									}),
								],
								{ gap: 1 }
							),
						],
						{ direction: "row", gap: 3 }
					),
					// Body
					tray.stack([
						tray.input({
							fieldRef: noteFieldRef,
							textarea: true,
						}),
						tray.text(
							"Note will be automatically saved to Anilist when you click save.",
							{
								style: {
									color: "#666",
									fontSize: "13px",
								},
							}
						),
					]),
					// Footer
					tray.button("Save", {
						size: "md",
						intent: "primary",
						onClick: "save",
					}),
				],
				{ gap: 5, style: { padding: "10px" } }
			);
		});

		// Currently doesn't work
		tray.onClick(() => {
			console.log("Tray clicked!");
			getCurrentAnime().then((anime) => {
				if (anime) updateTray(anime);
			});
		});

		tray.onClose(() => {
			currentMediaId.set(null);
		});

		// Handle save function
		ctx.registerEventHandler("save", async function () {
			if (currentMediaId.get()) {
				// Sync with anilist
				const query = `mutation SaveMediaListEntry($mediaId: Int!, $notes: String!) {
                        SaveMediaListEntry(mediaId: $mediaId, notes: $notes) {
                            notes
                            media {
                                id
                            }
                            updatedAt
                        }
                    }`;

				type AnilistResponse = {
					SaveMediaListEntry: {
						notes: string;
						media: {
							id: number;
						};
						updatedAt: number;
					};
				};

				type AnilistError = {
					errors: {
						message: string;
					}[];
				};

				ctx.toast.info("Saving...");

				const res: AnilistResponse | AnilistError = await $anilist.customQuery(
					{
						query,
						variables: {
							mediaId: currentMediaId.get(),
							notes: noteFieldRef.current,
						},
					},
					$database.anilist.getToken()
				);

				if ("errors" in res) {
					ctx.toast.error(
						"Failed to save the note to Anilist: " + res.errors[0].message
					);
				} else {
					ctx.toast.success("Note saved successfully!");
					$store.set(
						"anilist-notes." + currentMediaId.get(),
						res.SaveMediaListEntry.notes
					);
					tray.close();
				}
			}
		});

		// Register Button
		const animePageButton = ctx.action.newAnimePageButton({
			label: "Edit Note",
			intent: "gray-subtle",
		});
		animePageButton.mount();
		animePageButton.onClick(handleButtonPress);

		// Register media context menu
		const mediaCardEntry = ctx.action.newMediaCardContextMenuItem({
			label: "Edit Note",
			for: "anime",
		});
		mediaCardEntry.mount();
		mediaCardEntry.onClick(handleButtonPress);

		// Reset currentMediaId on navigation
		ctx.screen.onNavigate(async (e) => {
			// This path is for anime page
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const id = parseInt(e.searchParams.id);
				// currentMediaId.set(id);

				// This relies on DOM content (Unreliable, race condition)
				// This works as long as the attributes remains unchanged on subsequent
				// app updates. fix on tray.onClick should fix this
				// const mediaEl = await ctx.dom.queryOne("[data-media]");
				// if (mediaEl) {
				// 	const media = await mediaEl.getDataAttribute("media");
				// 	if (media) {
				// 		updateTray(JSON.parse(media));
				// 	}
				// }
			} else currentMediaId.set(null);
		});

		ctx.screen.loadCurrent();
	});
}
