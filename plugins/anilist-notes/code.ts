/// <reference path="./../../plugin.d.ts" />
/// <reference path="./../../system.d.ts" />
/// <reference path="./../../app.d.ts" />

function init() {
	$ui.register((ctx) => {
		const currentMediaId = ctx.state<number | null>(null);
		const titleFieldRef = ctx.fieldRef("initial title");
		const noteFieldRef = ctx.fieldRef("initial note");

		$anilist
			.getAnimeCollection(false)
			.MediaListCollection?.lists?.forEach((list) =>
				list.entries?.forEach((entry) => {
					if (entry.media && entry.notes) {
						$store.set("anilist-notes." + entry.media.id, entry.notes);
					}
				})
			);

		const tray = ctx.newTray({
			iconUrl:
				"https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/anilist-notes/icon.png",
			withContent: true,
		});

		function updateTray(anime: $app.AL_BaseAnime) {
			currentMediaId.set(anime.id);
			titleFieldRef.setValue(anime.title?.userPreferred || "Untitled");

			noteFieldRef.setValue($store.get("anilist-notes." + anime.id) || "");
			tray.open();
		}

		const handleButtonPress = (event: any) => {
			const anime = event.media;
			currentMediaId.set(anime.id);
			updateTray(anime);
		};

		async function getCurrentAnime(): Promise<$app.AL_BaseAnime | undefined> {
			return (await ctx.anime.getAnimeEntry(currentMediaId.get() || 0)).media;
		}

		async function getWidth() {
			const body = await ctx.dom.queryOne("body");
			if (body) {
				const width = await body.getComputedStyle("width");
				return width;
			}
			return null;
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
				return tray.div([
					tray.div([
						tray.stack(
							[
								tray.text("Anilist Notes"),
								tray.text("Open an anime page to start adding/editing note.", {
									style: { color: "#666", fontSize: "13px" },
								}),
							],
							{ gap: 1 }
						),
					]),
				]);

			return tray.stack(
				[
					tray.text("Edit Note"),
					tray.text(titleFieldRef.current, {
						style: { color: "#666", fontSize: "16px" },
					}),
					tray.input({
						fieldRef: noteFieldRef,
						textarea: true,
						style: {
							"margin-top": "10px",
						},
					}),
					tray.text(
						"Note will be automatically saved to Anilist when you click save.",
						{
							style: {
								color: "#666",
								fontSize: "13px",
								"margin-bottom": "25px",
							},
						}
					),
					tray.button("Save", {
						intent: "primary",
						onClick: "save",
					}),
				],
				{
					gap: 1,
				}
			);
		});

		// Currently doesn't work
		tray.onClick(() => {
			getCurrentAnime().then((anime) => {
				if (anime) updateTray(anime);
			});
		});

		tray.onClose(() => {
			currentMediaId.set(null);
		});

		// Handle save function
		ctx.registerEventHandler("save", async () => {
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

		const animePageButton = ctx.action.newAnimePageButton({
			label: "Edit Note",
			intent: "gray-subtle",
		});

		animePageButton.onClick(handleButtonPress);

		const animePageDropdown = ctx.action.newAnimePageDropdownItem({
			label: "Edit Note",
		});

		animePageDropdown.onClick((event) => {
			ctx.setTimeout(() => {
				handleButtonPress(event);
			}, 400);
		});

		const mediaCardEntry = ctx.action.newMediaCardContextMenuItem({
			label: "Edit Note",
			for: "anime",
		});

		mediaCardEntry.mount();
		mediaCardEntry.onClick(handleButtonPress);

		// Reset currentMediaId on navigation
		ctx.screen.onNavigate((e) => {
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const id = parseInt(e.searchParams.id);
				currentMediaId.set(id);
			} else currentMediaId.set(null);

			getWidth().then((width) => {
				if (!width) return;

				if (parseInt(width) > 526) {
					animePageButton.mount();
					animePageDropdown.unmount();
				} else {
					animePageButton.unmount();
					animePageDropdown.mount();
				}
			});
		});

		ctx.screen.loadCurrent();
	});
}
