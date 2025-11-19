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
		const tray = ctx.newTray({ iconUrl, withContent: true });

		/**
		 * Wait for specified amount of time
		 * @param ms Time to wait in milliseconds
		 * @returns
		 */
		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		function updateNoteStore(id: string, entry: AnimeNote) {
			// prettier-ignore
			// getOrSet ensures storeNoteId exists on $store
			const notes = $store.getOrSet(storeNoteId, () => new Map<string, AnimeNote>());
			$store.set(storeNoteId, new Map(notes).set(id, entry));
		}

		function formatNotes() {
			// prettier-ignore
			const noteMediaEntries: [string, AnimeNote][] = $store.getOrSet(storeNoteId, () => []);

			const noEntries = tray.text("No Entries", {
				// prettier-ignore
				className: "bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl text-center",
				style: {
					padding: "25px 0",
					fontSize: "1.5em",
					fontWeight: "500",
					color: "#666",
				},
			});

			if (!noteMediaEntries.length) return [noEntries];

			const withNote = noteMediaEntries.filter(([, v]) => v.notes);
			if (!withNote.length) return [noEntries];

			// sort by title
			const sortedNote = [...withNote].sort(([, a], [, b]) =>
				(a.title ?? "").localeCompare(b.title ?? "")
			);

			return sortedNote.map(([id, media]) => {
				const buttonStyle = {
					wordBreak: "unset",
					width: "fit-content",
					fontSize: "12px",
				};

				const coverImage = tray.div([], {
					style: {
						width: "50px",
						flexShrink: "0",
						flexGrow: "0",
						backgroundImage: `url(${media.coverImage})`,
						backgroundSize: "contain",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
					},
				});

				const title = tray.text(String(media.title) || "\u200b", {
					style: {
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						"user-select": "none",
					},
				});

				const notes = tray.text(String(media.notes) || "\u200b", {
					style: {
						fontSize: "14px",
						color: "#666",
						wordBreak: "unset",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						"user-select": "none",
					},
				});

				const goToPageBtn = tray.button("Go to Page", {
					onClick: ctx.eventHandler(`note-navigate-${id}`, () => {
						ctx.screen.navigateTo("/entry", { id });
						tray.close();
					}),
					size: "xs",
					intent: "gray-subtle",
					style: buttonStyle,
				});

				const editBtn = tray.button("Edit", {
					size: "xs",
					intent: "gray-subtle",
					style: buttonStyle,
					onClick: ctx.eventHandler(`note-edit-${id}`, async () => {
						// prettier-ignore
						editInvokedFromTray.set(true);
						const entry = await ctx.anime.getAnimeEntry(parseInt(id));

						if (entry?.media) {
							updateTray(entry.media);
							tray.update();
						} else {
							ctx.toast.error("Unknown Error");
						}
					}),
				});

				const content = tray.stack(
					[
						tray.div([title, notes], { style: { lineHeight: "normal" } }),
						tray.flex([goToPageBtn, editBtn], { direction: "row", gap: 1 }),
					],
					{ style: { justifyContent: "space-between" } }
				);

				return tray.flex([coverImage, content], {
					gap: 3,
					direction: "row",
					className:
						"bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl",
					style: { padding: "10px", margin: "10px 0" },
				});
			});
		}

		function cacheNotesFromCollection(bypassCache: boolean) {
			const MLC = $anilist.getAnimeCollection(bypassCache).MediaListCollection;
			if (!MLC || !MLC.lists) return;

			for (const list of MLC.lists) {
				const entries = list.entries;
				if (!entries?.length) continue;

				for (const entry of entries) {
					const media = entry.media;
					const notes = entry.notes;

					if (!media || !notes) continue;
					const coverImage = media.coverImage?.medium ?? "";
					const title = media.title?.userPreferred ?? "";

					updateNoteStore(media.id.toString(), { coverImage, title, notes });
				}
			}
		}

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
			const pluginIcon = tray.div([], {
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
			});

			const header_general = tray.text("AniList Notes", {
				style: {
					fontSize: "1.2em",
					"font-weight": "700",
					"user-select": "none",
				},
			});

			const header_specific = tray.text("Edit Note", {
				style: {
					fontSize: "1.5em",
					"font-weight": "700",
					"user-select": "none",
				},
			});

			const text_notSignedIn = tray.text(
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
			);

			const text_helper = tray.text(
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
			);

			const text_MyNotes = tray.text("My Notes", {
				style: {
					textAlign: "center",
					fontWeight: "700",
					paddingBottom: "10px",
					"user-select": "none",
				},
			});

			const formattedNotes = tray.div(formatNotes(), {
				style: {
					"overflow-y": "auto",
					"overflow-x": "hidden",
					maxHeight: "24.5rem" /*Based on parent max height*/,
				},
			});

			const saveBtn = tray.button("Save", {
				size: "md",
				intent: "primary",
				onClick: "save",
				loading: isSaving.get(),
				style: { flex: "1" },
			});

			const backBtn = tray.button("Go Back", {
				size: "md",
				style: { flex: "1" },
				onClick: ctx.eventHandler("note-edit-cancel", () => {
					currentMediaId.set(null);
					tray.update();
				}),
			});

			if (!$database.anilist.getToken()) {
				return tray.flex(
					[
						pluginIcon,
						tray.stack([header_general, text_notSignedIn], { gap: 1 }),
					],
					{ direction: "row", gap: 3, style: { padding: "10px" } }
				);
			}

			if (!currentMediaId.get()) {
				const header = tray.flex(
					[pluginIcon, tray.stack([header_general, text_helper], { gap: 1 })],
					{ direction: "row", gap: 3, style: { padding: "10px" } }
				);

				return tray.stack([header, tray.div([text_MyNotes, formattedNotes])], {
					gap: 1,
				});
			}

			const titleField = tray.text(String(titleFieldRef.current), {
				style: {
					fontSize: "14px",
					color: "#666",
					"user-select": "none",
				},
			});

			const noteField = tray.input({
				fieldRef: noteFieldRef,
				textarea: true,
			});

			const subtext = tray.text(
				"Note will be automatically saved to Anilist when you click save.",
				{
					style: {
						color: "#666",
						fontSize: "13px",
						"user-select": "none",
					},
				}
			);

			const mainHeader = tray.flex(
				[pluginIcon, tray.stack([header_specific, titleField], { gap: 1 })],
				{ direction: "row", gap: 3 }
			);

			const mainBody = tray.stack([noteField, subtext]);

			const mainFooter = tray.flex(
				[...(editInvokedFromTray.get() ? [backBtn] : []), saveBtn],
				{ direction: "row", style: { justifyContent: "end" } }
			);

			editInvokedFromTray.set(false);
			return tray.stack([mainHeader, mainBody, mainFooter], {
				gap: 5,
				style: { padding: "10px" },
			});
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
			// Media Id is already reset everytime the tray is closed
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
			if (e.pathname !== "/entry" || !e.searchParams.id) return;

			// Process only if user is connected to Anilist
			if (!$database.anilist.getToken()) return;

			const id = e.searchParams.id;
			const cache: [string, AnimeNote][] = $store.get(storeNoteId) ?? [];
			const entry = new Map(cache).get(id);

			const label = entry?.notes ? "Edit Note" : "Add Note";

			[animePageButton, mediaCardEntry].forEach((btn) => {
				btn.setLabel(label);
				btn.mount();
			});
		});

		// Cache the notes from the anime collection (only f user is connected to anilist)
		if ($database.anilist.getToken()) {
			cacheNotesFromCollection(false);
			ctx.screen.loadCurrent();
		}
	});
}
