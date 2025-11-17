/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />

function init() {
	$ui.register((ctx) => {
		// TYPES AND INTERFACES
		type SaveNoteResponse = {
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

		type SaveNoteError = { errors: { message: string }[] };

		interface AnimeNote {
			coverImage: string | undefined;
			title: string | undefined;
			notes: string;
		}

		// CONSTANTS
		// prettier-ignore
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Anilist%20Notes/icon.png";
		const storeNoteId = "anilist-notes";

		// STATES
		const currentMediaId = ctx.state<number | null>(null);
		const titleFieldRef = ctx.fieldRef("initial title");
		const noteFieldRef = ctx.fieldRef("initial note");
		const isSaving = ctx.state(false);
		const editInvokedFromTray = ctx.state(false);

		// Ensure that there is a map on $store every init that stores notes
		// so it is `$store.get(storeNoteId)` is guaranteed to exist
		$store.set(storeNoteId, new Map<string, AnimeNote>());

		/**
		 * Wait for specified amount of time
		 * @param ms Time to wait in milliseconds
		 * @returns
		 */
		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		function updateNoteStore(id: string, entry: AnimeNote) {
			const notes = $store.get(storeNoteId);
			$store.set(storeNoteId, new Map(notes).set(id, entry));
		}

		function formatNotes() {
			const data = $store
				.get("anilist-notes")
				.filter(([, value]: [string, AnimeNote]) => value.notes)
				.sort(([, a]: [any, AnimeNote], [, b]: [any, AnimeNote]) =>
					(a.title ?? "").localeCompare(b.title ?? "")
				)
				.map(([key, value]: [string, AnimeNote]) => {
					const buttonStyle = {
						wordBreak: "unset",
						width: "fit-content",
						fontSize: "12px",
					};

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
							tray.flex(
								[
									tray.button("Go to Page", {
										onClick: ctx.eventHandler(`note-navigate-${key}`, () => {
											ctx.screen.navigateTo("/entry", { id: key });
											tray.close();
										}),
										size: "xs",
										intent: "gray-subtle",
										style: buttonStyle,
									}),
									tray.button("Edit", {
										size: "xs",
										intent: "gray-subtle",
										style: buttonStyle,
										onClick: ctx.eventHandler(`note-edit-${key}`, async () => {
											// prettier-ignore
											editInvokedFromTray.set(true);
											const entry = await ctx.anime.getAnimeEntry(
												parseInt(key)
											);
											const media = entry?.media || null;
											if (media) {
												tray.update();
												updateTray(media);
											} else {
												ctx.toast.error("Unknown Error");
											}
										}),
									}),
								],
								{ direction: "row", gap: 1 }
							),
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
						updateNoteStore(entry.media.id.toString(), {
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
									"You need to be logged in to Anilist to use this plugin.",
									{
										style: {
											fontSize: "13px",
											color: "#e26f6fff",
											lineHeight: "normal",
											wordBreak: "unset",
											"user-select": "none",
										},
									}
								),
							],
							{ gap: 1 }
						),
					],
					{ direction: "row", gap: 3, style: { padding: "10px" } }
				);

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

			const cancelComponent = [];
			if (editInvokedFromTray.get()) {
				cancelComponent.push(
					tray.button("Go Back", {
						size: "md",
						style: { flex: "1" },
						onClick: ctx.eventHandler("note-edit-cancel", () => {
							currentMediaId.set(null);
							tray.update();
						}),
					})
				);
			}

			editInvokedFromTray.set(false);

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
									tray.text(String(titleFieldRef.current), {
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
					tray.flex(
						[
							...cancelComponent,
							tray.button("Save", {
								size: "md",
								intent: "primary",
								onClick: "save",
								loading: isSaving.get(),
								style: { flex: "1" },
							}),
						],
						{ direction: "row", style: { justifyContent: "end" } }
					),
				],
				{ gap: 5, style: { padding: "10px" } }
			);
		});

		// Reset Media Id everytime the tray is closed
		tray.onClose(() => currentMediaId.set(null));

		// Handle save function
		ctx.registerEventHandler("save", async function () {
			if (!currentMediaId.get()) return;

			// Disable the button to prevent multiple API Calls
			isSaving.set(true);

			// Notify user that you are saving...
			ctx.toast.info(`Saving note for ${titleFieldRef.current}...`);

			const requestBody = {
				// prettier-ignore
				query: "mutation SaveMediaListEntry($mediaId: Int!, $notes: String!) { SaveMediaListEntry(mediaId: $mediaId, notes: $notes) { notes media { id title { userPreferred } coverImage { medium } } updatedAt } }",
				variables: {
					mediaId: currentMediaId.get(),
					notes: noteFieldRef.current,
				},
			};

			const res: SaveNoteResponse | SaveNoteError = await $anilist.customQuery(
				requestBody,
				$database.anilist.getToken()
			);

			// Artificially delay the process by 2 seconds to give breather
			// for API calls
			await $_wait(2_000);

			if ("errors" in res) {
				ctx.toast.error(`Failed to save note: ${res.errors[0].message}`);
			} else {
				ctx.toast.success("Note saved successfully!");
				updateNoteStore(currentMediaId.get()!.toString(), {
					title: res.SaveMediaListEntry.media.title.userPreferred,
					coverImage: res.SaveMediaListEntry.media.coverImage?.medium,
					notes: res.SaveMediaListEntry.notes,
				});

				console.log();

				// Update buttons
				ctx.screen.loadCurrent();
			}

			isSaving.set(false);
			currentMediaId.set(null);
			tray.close();
		});

		// Register Button
		const animePageButton = ctx.action.newAnimePageButton({
			label: "Edit Note",
			intent: "gray-subtle",
		});
		animePageButton.onClick(handleButtonPress);

		// Register media context menu
		const mediaCardEntry = ctx.action.newMediaCardContextMenuItem({
			label: "Edit Note",
			for: "anime",
		});
		mediaCardEntry.onClick(handleButtonPress);

		ctx.screen.onNavigate((e) => {
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const id = parseInt(e.searchParams.id);

				const cache: [string, AnimeNote][] = $store.get(storeNoteId);
				const mappedCache = new Map(cache);
				const entry = mappedCache.get(id.toString());

				if (entry != null && entry.notes) {
					animePageButton.setLabel("Edit Note");
					mediaCardEntry.setLabel("Edit Note");
				} else {
					animePageButton.setLabel("Add Note");
					mediaCardEntry.setLabel("Add Note");
				}

				mediaCardEntry.mount();
				animePageButton.mount();
			}
		});

		ctx.screen.loadCurrent();
	});
}
