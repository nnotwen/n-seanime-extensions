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
		const btnIsSaving = ctx.state(false);

		$store.set("anilist-notes", new Map());

		interface AnimeNote {
			coverImage: string | undefined;
			title: string | undefined;
			notes: string;
		}

		function setAnimeNote(id: string, entry: AnimeNote) {
			const notes = $store.get("anilist-notes");
			$store.set(
				"anilist-notes",
				new Map(notes).set(id, {
					coverImage: entry.coverImage,
					title: entry.title,
					notes: entry.notes,
				})
			);
		}

		function formatNotes() {
			const data = $store
				.get("anilist-notes")
				.filter(([, value]: [string, AnimeNote]) => value.notes)
				.sort(([, a]: [any, AnimeNote], [, b]: [any, AnimeNote]) =>
					(a.title ?? "").localeCompare(b.title ?? "")
				)
				.map(([key, value]: [string, AnimeNote]) => {
					const content = tray.stack(
						[
							tray.div(
								[
									tray.text(String(value.title) || "\u200b", {
										style: {
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
											"user-select": "none",
										},
									}),
									tray.text(String(value.notes) || "\u200b", {
										style: {
											fontSize: "14px",
											color: "#666",
											wordBreak: "unset",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
											"user-select": "none",
										},
									}),
								],
								{ style: { lineHeight: "normal" } }
							),
							tray.button("Go to Page", {
								onClick: ctx.eventHandler(`navigate-to-${key}`, () => {
									ctx.screen.navigateTo("/entry", { id: key });
									tray.close();
								}),
								size: "xs",
								intent: "gray-subtle",
								style: {
									wordBreak: "unset",
									justifyContent: "flex-start",
									width: "fit-content",
									fontSize: "12px",
								},
							}),
						],
						{ style: { justifyContent: "space-between" } }
					);

					const coverImage = tray.div([], {
						style: {
							width: "50px",
							flexShrink: "0",
							flexGrow: "0",
							backgroundImage: `url(${value.coverImage})`,
							backgroundSize: "contain",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
						},
					});

					return tray.flex([coverImage, content], {
						gap: 3,
						direction: "row",
						className:
							"bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl",
						style: { padding: "10px", margin: "10px 0" },
					});
				});

			if (data.length <= 0) {
				return [
					tray.text("No Entries", {
						className:
							"bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl",
						style: {
							textAlign: "center",
							padding: "25px 0",
							fontSize: "1.5em",
							fontWeight: "500",
							color: "#666",
						},
					}),
				];
			}
			return data;
		}

		// Cache the notes from the anime collection
		$anilist
			.getAnimeCollection(false)
			.MediaListCollection?.lists?.forEach((list) =>
				list.entries?.forEach((entry) => {
					if (entry.media && entry.notes) {
						setAnimeNote(entry.media.id.toString(), {
							coverImage: entry.media.coverImage?.medium,
							title: entry.media.title?.userPreferred,
							notes: entry.notes,
						});
					}
				})
			);

		const tray = ctx.newTray({ iconUrl, withContent: true });

		function updateTray(anime: $app.AL_BaseAnime) {
			const map: Map<string, AnimeNote> = new Map($store.get("anilist-notes"));
			const noteEntry = map.get(anime.id.toString());

			currentMediaId.set(anime.id);
			titleFieldRef.setValue(anime.title?.userPreferred || "Untitled");
			noteFieldRef.setValue(noteEntry?.notes || "");
		}

		const handleButtonPress = (event: { media: $app.AL_BaseAnime }) => {
			currentMediaId.set(event.media.id);
			updateTray(event.media);
			tray.open();
		};

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
				return tray.stack(
					[
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
										flexGrow: "0",
										flexShrink: "0",
									},
								}),
								tray.stack(
									[
										tray.text("AniList Notes", {
											style: {
												fontSize: "1.2em",
												"font-weight": "700",
												"user-select": "none",
											},
										}),
										tray.text(
											'To edit a note, click the "Edit Note" button on the anime’s page, or right‑click the anime and choose "Edit Note" from the menu.',
											{
												style: {
													fontSize: "13px",
													color: "#666",
													lineHeight: "normal",
													wordBreak: "unset",
													"user-select": "none",
													fontWeight: "500",
												},
											}
										),
									],
									{ gap: 1 }
								),
							],
							{ direction: "row", gap: 3, style: { padding: "10px" } }
						),
						tray.div([
							tray.text("My Notes", {
								style: {
									textAlign: "center",
									fontWeight: "700",
									paddingBottom: "10px",
									"user-select": "none",
								},
							}),
							tray.div(formatNotes(), {
								style: {
									"overflow-y": "auto",
									"overflow-x": "hidden",
									maxHeight: "24.5rem" /*Based on parent max height*/,
								},
							}),
						]),
					],
					{ gap: 1 }
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
										style: {
											fontSize: "1.5em",
											"font-weight": "700",
											"user-select": "none",
										},
									}),
									tray.text(titleFieldRef.current, {
										style: {
											fontSize: "14px",
											color: "#666",
											"user-select": "none",
										},
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
									"user-select": "none",
								},
							}
						),
					]),
					// Footer
					tray.button("Save", {
						size: "md",
						intent: "primary",
						onClick: "save",
						loading: btnIsSaving.get(),
					}),
				],
				{ gap: 5, style: { padding: "10px" } }
			);
		});

		tray.onClose(() => {
			currentMediaId.set(null);
		});

		// Handle save function
		ctx.registerEventHandler("save", async function () {
			if (currentMediaId.get()) {
				btnIsSaving.set(true);
				// Sync with anilist
				const query = `mutation SaveMediaListEntry($mediaId: Int!, $notes: String!) {
                        SaveMediaListEntry(mediaId: $mediaId, notes: $notes) {
                            notes
                            media {
                                id
								title {
									userPreferred
								}
								coverImage {
									medium
								}
                            }
                            updatedAt
                        }
                    }`;

				type AnilistResponse = {
					SaveMediaListEntry: {
						notes: string;
						media: {
							id: number;
							title: {
								userPreferred?: string;
							};
							coverImage?: {
								medium?: string;
							};
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

				ctx.setTimeout(() => {
					if ("errors" in res) {
						ctx.toast.error(
							"Failed to save the note to Anilist: " + res.errors[0].message
						);
					} else {
						ctx.toast.success("Note saved successfully!");
						setAnimeNote(currentMediaId.get()!.toString(), {
							title: res.SaveMediaListEntry.media.title.userPreferred,
							coverImage: res.SaveMediaListEntry.media.coverImage?.medium,
							notes: res.SaveMediaListEntry.notes,
						});

						btnIsSaving.set(false);
						tray.close();
					}
					currentMediaId.set(null);
				}, 3000);
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

		ctx.screen.loadCurrent();

		function truncateText(text: string, maxLength: number) {
			if (typeof text !== "string") return "";
			if (text.length <= maxLength) return text;
			return text.slice(0, maxLength) + "...";
		}
	});
}
