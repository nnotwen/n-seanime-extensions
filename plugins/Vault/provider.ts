/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./vault.d.ts" />

//@ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Vault/icon.png";
		const tray = ctx.newTray({ iconUrl, withContent: true });

		enum Tabs {
			Vault = 1,
			Shelf = 2,
			AddToShelf = 3,
		}

		enum ShelfSort {
			NameAscending = "nameasc",
			NameDescending = "namedesc",
			CreatedAtAscending = "createasc",
			CreatedAtDescending = "createdesc",
			lastUpdateAtAscending = "updateasc",
			lastUpdateAtDescending = "updatedesc",
		}

		enum EntrySort {
			MediaIdAscending = "idasc",
			MediaIdDescending = "iddesc",
			NameAscending = "nameasc",
			NameDescending = "namedesc",
			AddedAtAscending = "addedasc",
			AddedAtDescending = "addeddesc",
		}

		const fieldRef = {
			shelfCreate: {
				name: ctx.fieldRef<string>(""),
				type: ctx.fieldRef<$app.AL_MediaType>("ANIME"),
				reset() {
					this.name.setValue("");
					this.type.setValue("ANIME");
				},
			},
			shelfSettings: {
				name: ctx.fieldRef<string>(""),
				importString: ctx.fieldRef<string>(""),
			},
			shelfSort: ctx.fieldRef<ShelfSort>($storage.get("settings:shelf-sort") ?? ShelfSort.NameAscending),
			entrySort: ctx.fieldRef<EntrySort>($storage.get("settings:entry-sort") ?? EntrySort.NameAscending),
		};

		const state = {
			vaultSearch: ctx.state<string>(""),
			shelfSearch: ctx.state<string>(""),
			currentShelfId: ctx.state<string | null>(null),
			currentMedia: ctx.state<$app.AL_BaseAnime | $app.AL_BaseManga | null>(null),
		};

		const vault = {
			id: "fbefd050-7a20-469f-ade9-12ea803d7149",
			get storage() {
				return ($storage.get(this.id) || {}) as Record<string, Shelf>;
			},
			createShelf(name: string, type: $app.AL_MediaType) {
				const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
					const r = (Math.random() * 16) | 0;
					const v = c === "x" ? r : (r & 0x3) | 0x8;
					return v.toString(16);
				});

				const storage = this.storage;
				const date = new Date().toISOString();
				storage[uuid] = { uuid, name, type, entries: [], createdAt: date, lastUpdateAt: date };
				$storage.set(this.id, storage);
				return storage[uuid];
			},
			editShelfName(uuid: string, name: string) {
				const storage = this.storage;
				const shelf = storage[uuid];
				if (!shelf) throw new Error(`Could not find shelf with uuid ${uuid}`);

				shelf.name = name;
				storage[uuid] = { ...shelf, lastUpdateAt: new Date().toISOString() };
				$storage.set(this.id, storage);
				return shelf;
			},
			deleteShelf(uuid: string) {
				const storage = this.storage;
				const deleted = delete storage[uuid];
				$storage.set(this.id, storage);
				return deleted;
			},
			addToShelf(uuid: string, media: $app.AL_BaseAnime | $app.AL_BaseManga) {
				const storage = this.storage;
				const shelf = storage[uuid];
				if (!shelf) throw new Error(`Could not find shelf with uuid ${uuid}!`);
				if (shelf.type !== media.type) throw new Error(`Type mismatch: Cannot upsert media with type ${media.type} to shelf with type ${shelf.type}!`);

				const date = new Date().toISOString();
				const data: Shelf["entries"][number] = {
					id: media.id,
					title: {
						userPreferred: media.title?.userPreferred!,
						synonyms: [...(media.synonyms ?? []), ...Object.values(media.title ?? {}).filter(Boolean)],
					},
					coverImage: media.coverImage?.large ?? "",
					season: media.season ?? null,
					seasonYear: "seasonYear" in media ? media.seasonYear ?? null : null,
					addedAt: date,
				};

				shelf.entries = [...new Map(shelf.entries.map((e) => [e.id, e])).set(data.id, data).values()];
				storage[uuid] = { ...shelf, lastUpdateAt: date };
				$storage.set(this.id, storage);
				return shelf;
			},
			removeFromShelf(uuid: string, mediaId: number) {
				const storage = this.storage;
				const shelf = storage[uuid];
				if (!shelf) throw new Error(`Could not find shelf with uuid ${uuid}`);

				shelf.entries = shelf.entries.filter((x) => x.id !== mediaId);
				storage[uuid] = { ...shelf, lastUpdateAt: new Date().toISOString() };
				$storage.set(this.id, storage);
				return shelf.entries.some((x) => x.id === mediaId);
			},
			// Imports entries from old version if they exist
			import() {
				const array: Shelf[] | undefined = $storage.get("ee67ab39-47e3-4e19-be06-d55ccaf50f36");
				if (!array) return;

				for (const shelf of array) {
					const { uuid } = this.createShelf(shelf.name, shelf.type);
					for (const entry of shelf.entries) {
						this.addToShelf(uuid, {
							id: entry.id,
							title: {
								userPreferred: entry.title.userPreferred,
							},
							synonyms: entry.title.synonyms,
							coverImage: {
								large: entry.coverImage,
							},
							season: entry.season ?? undefined,
							seasonYear: entry.seasonYear ?? undefined,
							type: shelf.type,
						});
					}
				}

				$storage.remove("ee67ab39-47e3-4e19-be06-d55ccaf50f36");
			},
			// previous-update-support
			init() {
				for (const oldShelf of Object.values(this.storage)) {
					if (!oldShelf.createdAt) {
						const shelf = this.createShelf(oldShelf.name, oldShelf.type);
						for (const entry of oldShelf.entries) {
							this.addToShelf(shelf.uuid, {
								id: entry.id,
								title: {
									userPreferred: entry.title.userPreferred,
								},
								synonyms: entry.title.synonyms,
								coverImage: {
									large: entry.coverImage,
								},
								season: entry.season ?? undefined,
								seasonYear: entry.seasonYear ?? undefined,
								type: shelf.type,
							});
						}
						this.deleteShelf(oldShelf.uuid);
					}
				}
			},
		};

		const tabs = {
			current: ctx.state<Tabs>(Tabs.Vault),
			currentOverlay: ctx.state<any[] | null>(null),
			overlay() {
				const overlay = this.currentOverlay.get();
				return overlay
					? tray.div([tray.flex(overlay, { style: { justifyContent: "center", alignItems: "center", width: "100%", height: "100%" } })], {
							className: "fixed bg-black/80 z-[50]",
							style: {
								width: "calc(100%)",
								height: "calc(100% - 1rem)",
								top: "0%",
								left: "0%",
								borderRadius: "0.5rem",
								border: "1px solid var(--border)",
							},
					  })
					: ([] as any[]);
			},
			header(primary: string, subtext?: string, additionalComponents?: any[]) {
				return tray.flex(
					[
						tray.div([], {
							style: {
								width: "2.5rem",
								height: "2.5rem",
								marginTop: "-0.3rem",
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
								tray.text(`${primary}`, { style: { fontSize: "1.2em", fontWeight: "bold" } }),
								subtext
									? tray.text(`${subtext}`, {
											style: {
												fontSize: "0.8em",
												overflow: "hidden",
												textOverflow: "ellipsis",
												display: "-webkit-box",
												"-webkit-line-clamp": "1",
												"-webkit-box-orient": "vertical",
												wordBreak: "break-word",
											},
											className: "opacity-30",
									  })
									: [],
							],
							{
								style: {
									lineHeight: "1em",
									width: "100%",
								},
							}
						),
						tray.div(additionalComponents ?? []),
					],
					{
						gap: 3,
						style: {
							marginBottom: "1rem",
						},
					}
				);
			},
			addToOtherShelf(entry: Shelf["entries"][number], type: $app.AL_MediaType, uuid: string) {
				return tray.stack(
					[
						tray.flex(
							[
								tray.text("Add entry to other shelf", { className: "font-semibold", style: { alignContent: "center" } }),
								tray.button("\u200b", {
									intent: "alert-subtle",
									className: "bg-transparent",
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										backgroundImage:
											"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDE2IDE2IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTcuMTE2IDgtNC41NTggNC41NTguODg0Ljg4NEw4IDguODg0bDQuNTU4IDQuNTU4Ljg4NC0uODg0TDguODg0IDhsNC41NTgtNC41NTgtLjg4NC0uODg0TDggNy4xMTYgMy40NDIgMi41NThsLS44ODQuODg0eiIgc3Ryb2tlPSJub25lIi8+PC9zdmc+)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem",
									},
									onClick: ctx.eventHandler("add-to-shelf:back", () => this.currentOverlay.set(null)),
								}),
							],
							{ style: { justifyContent: "space-between", borderBottom: "1px solid var(--border)", fontSize: "1.25rem", paddingBottom: "0.25rem" } }
						),
						tray.stack(
							[
								tray.text(`Add ${entry.title.userPreferred} to other shelves:`, {
									style: {
										fontSize: "0.85rem",
										opacity: "0.7",
										wordBreak: "break-word",
									},
								}),
								tray.stack(
									Object.values(vault.storage)
										.filter((x) => x.type === type && !x.entries.some((y) => y.id === entry.id))
										.sort((A, B) => A.name.localeCompare(B.name))
										.map((shelf) =>
											tray.button(`${shelf.name}`, {
												size: "md",
												intent: "gray-subtle",
												className: "flex-shrink-0 line-clamp-1",
												onClick: ctx.eventHandler(`add-to-shelf:${shelf.uuid}`, () => {
													vault.addToShelf(shelf.uuid, {
														id: entry.id,
														title: {
															userPreferred: entry.title.userPreferred,
														},
														synonyms: entry.title.synonyms,
														coverImage: {
															large: entry.coverImage,
														},
														season: entry.season ?? undefined,
														seasonYear: entry.seasonYear ?? undefined,
														type: shelf.type,
													});
													ctx.toast.success(`Successfully added ${entry.title.userPreferred} to ${shelf.name}!`);
													tabs.currentOverlay.set([this.addToOtherShelf(entry, type, uuid)]);
												}),
												style: {
													textAlign: "left",
													width: "100%",
												},
											})
										),
									{
										style: { overflowY: "scroll" },
									}
								),
							],
							{
								style: {
									overflowY: "scroll",
									maxHeight: "25rem",
									minHeight: "10rem",
								},
							}
						),
					],
					{
						className: "bg-gray-900 rounded-xl p-5",
						style: { boxShadow: "0 0 10px black", width: "25rem", margin: "1rem" },
					}
				);
			},
			sortShelf() {
				return tray.stack(
					[
						tray.flex(
							[
								tray.text("Sort shelf", { className: "font-semibold", style: { alignContent: "center" } }),
								tray.button("\u200b", {
									intent: "alert-subtle",
									className: "bg-transparent",
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										backgroundImage:
											"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDE2IDE2IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTcuMTE2IDgtNC41NTggNC41NTguODg0Ljg4NEw4IDguODg0bDQuNTU4IDQuNTU4Ljg4NC0uODg0TDguODg0IDhsNC41NTgtNC41NTgtLjg4NC0uODg0TDggNy4xMTYgMy40NDIgMi41NThsLS44ODQuODg0eiIgc3Ryb2tlPSJub25lIi8+PC9zdmc+)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem",
									},
									onClick: ctx.eventHandler("import:back", () => this.currentOverlay.set(null)),
								}),
							],
							{ style: { justifyContent: "space-between", borderBottom: "1px solid var(--border)", fontSize: "1.25rem", paddingBottom: "0.25rem" } }
						),
						tray.select("Sort Shelves", {
							size: "md",
							fieldRef: fieldRef.shelfSort,
							options: [
								{
									label: "Name Ascending",
									value: ShelfSort.NameAscending,
								},
								{
									label: "Name Descending",
									value: ShelfSort.NameDescending,
								},
								{
									label: "Created Most Recent",
									value: ShelfSort.CreatedAtDescending,
								},
								{
									label: "Created Oldest",
									value: ShelfSort.CreatedAtAscending,
								},
								{
									label: "Updated Most Recent",
									value: ShelfSort.lastUpdateAtDescending,
								},
								{
									label: "Updated Oldest",
									value: ShelfSort.lastUpdateAtAscending,
								},
							] satisfies { label: string; value: ShelfSort }[],
							onChange: ctx.eventHandler("sort-changed", ({ value }) => {
								fieldRef.shelfSort.setValue(value);
								$storage.set("settings:shelf-sort", value);
								tabs.currentOverlay.set(null);
							}),
						}),
					],
					{
						className: "bg-gray-900 rounded-xl p-5",
						style: { boxShadow: "0 0 10px black", width: "25rem", margin: "1rem" },
					}
				);
			},
			createShelf() {
				fieldRef.shelfCreate.reset();
				return tray.stack(
					[
						tray.text("Create Shelf", {
							className: "font-semibold",
							style: { borderBottom: "1px solid var(--border)", fontSize: "1.25rem", paddingBottom: "0.25rem" },
						}),
						tray.text("Shelf Name", { className: "text-base font-semibold self-start w-fit" }),
						tray.input({
							fieldRef: fieldRef.shelfCreate.name,
							style: {
								borderRadius: "0.5rem",
							},
						}),
						tray.flex(
							[
								tray.text("Type", {
									className: "px-2 bg-gray-800 border",
									style: {
										width: "fit-content",
										wordBreak: "normal",
										borderRadius: "0.5rem 0 0 0.5rem",
										height: "2rem",
										alignContent: "center",
										fontSize: "0.8rem",
									},
								}),
								tray.select("", {
									value: "ANIME",
									fieldRef: fieldRef.shelfCreate.type,
									options: [
										{ label: "Anime", value: "ANIME" },
										{ label: "Manga", value: "MANGA" },
									],
									style: {
										height: "2rem",
										borderRadius: "0 0.5rem 0.5rem 0",
										marginLeft: "-1px",
									},
									onChange: ctx.eventHandler("create-shelf-type", ({ value }) => fieldRef.shelfCreate.type.setValue(value)),
								}),
							],
							{ gap: 0, style: { alignItems: "center" } }
						),
						tray.flex(
							[
								tray.button("Cancel", {
									intent: "gray-subtle",
									size: "md",
									style: { width: "100%", borderRadius: "0.5rem" },
									onClick: ctx.eventHandler("create-shelf-dismiss", () => this.currentOverlay.set(null)),
								}),
								tray.button("Create", {
									intent: "success-subtle",
									size: "md",
									style: { width: "100%", borderRadius: "0.5rem" },
									onClick: ctx.eventHandler("create-shelf-save", () => {
										const name = fieldRef.shelfCreate.name.current;
										const type = fieldRef.shelfCreate.type.current;

										if (!name.length) return ctx.toast.error(`The name field cannot be blank!`);

										vault.createShelf(name, type);
										this.currentOverlay.set(null);
										ctx.toast.success(`Successfully created shelf ${name}`);
									}),
								}),
							],
							{ style: { marginTop: "1rem" } }
						),
					],
					{
						className: "bg-gray-900 rounded-xl p-5",
						style: { boxShadow: "0 0 10px black", width: "25rem", margin: "1rem" },
					}
				);
			},
			importShelf() {
				fieldRef.shelfSettings.importString.setValue("");
				return tray.stack(
					[
						tray.flex(
							[
								tray.text("Import shelf", { className: "font-semibold", style: { alignContent: "center" } }),
								tray.button("\u200b", {
									intent: "alert-subtle",
									className: "bg-transparent",
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										backgroundImage:
											"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDE2IDE2IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTcuMTE2IDgtNC41NTggNC41NTguODg0Ljg4NEw4IDguODg0bDQuNTU4IDQuNTU4Ljg4NC0uODg0TDguODg0IDhsNC41NTgtNC41NTgtLjg4NC0uODg0TDggNy4xMTYgMy40NDIgMi41NThsLS44ODQuODg0eiIgc3Ryb2tlPSJub25lIi8+PC9zdmc+)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem",
									},
									onClick: ctx.eventHandler("import:back", () => this.currentOverlay.set(null)),
								}),
							],
							{ style: { justifyContent: "space-between", borderBottom: "1px solid var(--border)", fontSize: "1.25rem", paddingBottom: "0.25rem" } }
						),
						tray.input({
							placeholder: "Import string",
							fieldRef: fieldRef.shelfSettings.importString,
							style: {
								borderRadius: "0.5rem 0 0 0.5rem",
							},
						}),
						tray.button("Import shelf", {
							intent: "primary-subtle",
							size: "md",
							style: { marginTop: "0.5rem" },
							onClick: ctx.eventHandler("shelf-import-items", async () => {
								if (!fieldRef.shelfSettings.importString.current.trim().length) {
									return ctx.toast.error(`Import String is required!`);
								}

								const importStr = fieldRef.shelfSettings.importString.current.trim();
								try {
									const data: VaultItem = JSON.parse(Buffer.from(importStr, "base64").toString("utf8"));
									if (!data || !data.name || !data.type || !["ANIME", "MANGA"].includes(data.type) || !data.entries || !data.entries.length)
										throw new Error(`Invalid import string!`);

									for (const entry of data.entries) {
										if (!entry.id || !entry.title?.userPreferred) throw new Error(`Invalid entry found!`);
									}

									const shelf = vault.createShelf(data.name, data.type);

									for (const entry of data.entries) {
										vault.addToShelf(shelf.uuid, {
											id: entry.id,
											title: {
												userPreferred: entry.title.userPreferred,
											},
											synonyms: entry.title.synonyms,
											coverImage: {
												large: entry.coverImage,
											},
											seasonYear: entry.seasonYear ?? undefined,
											season: entry.season ?? undefined,
											type: data.type,
										});
									}

									ctx.toast.success(`Added ${data.entries.length} entries to ${shelf.name}!`);
									tabs.currentOverlay.set(null);
								} catch (e) {
									if (e instanceof SyntaxError) {
										ctx.toast.error("Invalid import string");
									} else {
										ctx.toast.error((e as Error).message);
									}
								}
							}),
						}),
					],
					{
						className: "bg-gray-900 rounded-xl p-5",
						style: { boxShadow: "0 0 10px black", width: "25rem", margin: "1rem" },
					}
				);
			},
			deleteItem(name: string, type: "shelf" | "media", uuid: string, id?: number) {
				const headerText = type === "shelf" ? `Delete shelf?` : `Remove entry from this shelf?`;

				const bodyTextProps = { className: "text-base self-start w-fit", style: { wordBreak: "break-word", display: "inline" } };
				const bodyText =
					type === "shelf"
						? [
								tray.text("Are you sure you want to delete ", bodyTextProps),
								tray.text(`${name}`, {
									className: `${bodyTextProps.className} font-semibold`,
									style: {
										...bodyTextProps.style,
										color: "#fca5a5",
									},
								}),
								tray.text("?", bodyTextProps),
						  ]
						: [
								tray.text("Are you sure you want to remove ", bodyTextProps),
								tray.text(`${name}`, {
									className: `${bodyTextProps.className} font-semibold`,
									style: {
										...bodyTextProps.style,
										color: "#fca5a5",
									},
								}),
								tray.text(" from this shelf?", bodyTextProps),
						  ];

				return tray.stack(
					[
						tray.text(headerText, {
							className: "font-semibold",
							style: { borderBottom: "1px solid var(--border)", fontSize: "1.25rem", paddingBottom: "0.25rem", wordBreak: "break-word" },
						}),
						tray.div(bodyText),
						tray.text("This action cannot be undone."),
						tray.flex(
							[
								tray.button("Cancel", {
									intent: "gray-subtle",
									size: "md",
									style: { width: "100%", borderRadius: "0.5rem" },
									onClick: ctx.eventHandler("create-shelf-dismiss", () => this.currentOverlay.set(null)),
								}),
								tray.button("Delete", {
									intent: "alert-subtle",
									size: "md",
									style: { width: "100%", borderRadius: "0.5rem" },
									onClick: ctx.eventHandler("action:delete:item", () => {
										try {
											if (type === "shelf") {
												vault.deleteShelf(uuid);
												tabs.current.set(Tabs.Vault);
												ctx.toast.success(`Successfully deleted shelf ${name}!`);
											} else {
												if (!id) return ctx.toast.error(`Cannot delete entry. Missing parameters: mediaId.`);
												vault.removeFromShelf(uuid, id);
												ctx.toast.success(`Successfully removed ${name} from current shelf!`);
											}
										} catch (e) {
											ctx.toast.error((e as Error).message);
										} finally {
											tabs.currentOverlay.set(null);
										}
									}),
								}),
							],
							{ style: { marginTop: "1rem" } }
						),
					],
					{
						className: "bg-gray-900 rounded-xl p-5",
						style: { boxShadow: "0 0 10px black", margin: "0 1rem", overflowY: "scroll", maxHeight: "90%" },
					}
				);
			},
			shelfSettings(uuid: string) {
				const shelf = vault.storage[uuid];
				if (!shelf) {
					ctx.toast.error(`Unable to find shelf with uuid ${uuid}`);
					return tabs.current.set(Tabs.Shelf);
				}

				fieldRef.shelfSettings.name.setValue(shelf.name);
				fieldRef.shelfSettings.importString.setValue("");

				return tray.stack(
					[
						tray.flex(
							[
								tray.text("Settings", { className: "font-semibold", style: { alignContent: "center" } }),
								tray.button("\u200b", {
									intent: "alert-subtle",
									className: "bg-transparent",
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										backgroundImage:
											"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDE2IDE2IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTcuMTE2IDgtNC41NTggNC41NTguODg0Ljg4NEw4IDguODg0bDQuNTU4IDQuNTU4Ljg4NC0uODg0TDguODg0IDhsNC41NTgtNC41NTgtLjg4NC0uODg0TDggNy4xMTYgMy40NDIgMi41NThsLS44ODQuODg0eiIgc3Ryb2tlPSJub25lIi8+PC9zdmc+)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem",
									},
									onClick: ctx.eventHandler("settings:back", () => this.currentOverlay.set(null)),
								}),
							],
							{ style: { justifyContent: "space-between", borderBottom: "1px solid var(--border)", fontSize: "1.25rem", paddingBottom: "0.25rem" } }
						),
						tray.select("Sort Entries", {
							size: "md",
							fieldRef: fieldRef.entrySort,
							options: [
								{
									label: "Name Ascending",
									value: EntrySort.NameAscending,
								},
								{
									label: "Name Descending",
									value: EntrySort.NameDescending,
								},
								{
									label: "Added Most Recent",
									value: EntrySort.AddedAtDescending,
								},
								{
									label: "Added Oldest",
									value: EntrySort.AddedAtAscending,
								},
								{
									label: "Media Id Ascending",
									value: EntrySort.MediaIdAscending,
								},
								{
									label: "Media Id Descending",
									value: EntrySort.MediaIdDescending,
								},
							] satisfies { label: string; value: EntrySort }[],
							onChange: ctx.eventHandler("sort-changed", ({ value }) => {
								fieldRef.entrySort.setValue(value);
								$storage.set("settings:entry-sort", value);
							}),
						}),
						tray.stack(
							[
								tray.text("Rename Shelf", { className: "font-semibold", style: { alignContent: "center" } }),
								tray.flex(
									[
										tray.input({
											fieldRef: fieldRef.shelfSettings.name,
											style: {
												borderRadius: "0.5rem 0 0 0.5rem",
											},
										}),
										tray.button("Save", {
											intent: "success-subtle",
											style: {
												borderRadius: "0 0.5rem 0.5rem 0",
												height: "auto",
											},
											onClick: ctx.eventHandler("shelf-rename", () => {
												if (!fieldRef.shelfSettings.name.current.trim().length) {
													return ctx.toast.error(`Shelf name is required!`);
												}
												try {
													const s = vault.editShelfName(shelf.uuid, fieldRef.shelfSettings.name.current);
													ctx.toast.success(`Successfully renamed shelf to ${s.name}`);
												} catch (e) {
													ctx.toast.error((e as Error).message);
												}
											}),
										}),
									],
									{ gap: 0 }
								),
							],
							{ gap: 1 }
						),
						tray.stack(
							[
								tray.text("Import Items to shelf", { className: "font-semibold", style: { alignContent: "center" } }),
								tray.flex(
									[
										tray.input({
											placeholder: "Import string",
											fieldRef: fieldRef.shelfSettings.importString,
											style: {
												borderRadius: "0.5rem 0 0 0.5rem",
											},
										}),
										tray.button("Import", {
											intent: "gray-subtle",
											style: {
												borderRadius: "0 0.5rem 0.5rem 0",
												height: "auto",
											},
											onClick: ctx.eventHandler("shelf-import-items", async () => {
												if (!fieldRef.shelfSettings.importString.current.trim().length) {
													return ctx.toast.error(`Import String is required!`);
												}

												const importStr = fieldRef.shelfSettings.importString.current.trim();
												try {
													const data: VaultItem = JSON.parse(Buffer.from(importStr, "base64").toString("utf8"));
													if (!data || !data.name || !data.type || !["ANIME", "MANGA"].includes(data.type) || !data.entries || !data.entries.length)
														throw new Error(`Invalid import string!`);

													if (data.type !== shelf.type) {
														throw new Error(`Cannot import ${data.type} entries to ${shelf.type}!`);
													}

													for (const entry of data.entries) {
														if (!entry.id || !entry.title?.userPreferred) throw new Error(`Invalid entry found!`);
													}

													for (const entry of data.entries) {
														vault.addToShelf(shelf.uuid, {
															id: entry.id,
															title: {
																userPreferred: entry.title.userPreferred,
															},
															synonyms: entry.title.synonyms,
															coverImage: {
																large: entry.coverImage,
															},
															seasonYear: entry.seasonYear ?? undefined,
															season: entry.season ?? undefined,
															type: data.type,
														});
													}

													ctx.toast.success(`Added ${data.entries.length} entries to ${shelf.name}!`);
													tabs.currentOverlay.set(null);
												} catch (e) {
													if (e instanceof SyntaxError) {
														ctx.toast.error("Invalid import string");
													} else {
														ctx.toast.error((e as Error).message);
													}
												}
											}),
										}),
									],
									{ gap: 0 }
								),
							],
							{ gap: 1 }
						),
						tray.button("Export shelf", {
							intent: "primary-subtle",
							size: "md",
							style: { marginTop: "0.5rem" },
							onClick: ctx.eventHandler("export", async () => {
								try {
									const data = Buffer.from(JSON.stringify(shelf), "utf8").toString("base64");
									const script = await ctx.dom.createElement("script");
									script.setText(`navigator.clipboard.writeText(${JSON.stringify(data).replace(/=+$/, "")})`);
									ctx.setTimeout(() => {
										script.remove();
										tabs.currentOverlay.set(null);
										ctx.toast.success("Copied the import string to clipboard!");
									}, 500);
								} catch (error) {
									ctx.toast.error((error as Error).message);
								}
							}),
						}),
					],
					{
						className: "bg-gray-900 rounded-xl p-5",
						style: { boxShadow: "0 0 10px black", width: "25rem", margin: "1rem" },
					}
				);
			},
			formatShelfItem(shelf: Shelf) {
				const covers = shelf.entries.map((x) => x.coverImage).filter(Boolean);

				const background = tray.flex(
					[
						tray.div([], {
							className: "vault-shelf-entry-card-background",
							style: {
								height: "100%",
								width: "100%",
								maxWidth: "15rem",
								backgroundImage: `url(${covers[Math.floor(Math.random() * covers.length)]})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								maskImage: "linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)",
							},
						}),
					],
					{
						style: {
							width: "100%",
							height: "100%",
							pointerEvents: "none",
							position: "absolute",
							left: "0",
							right: "0",
							justifyContent: "end",
						},
					}
				);

				const content = tray.stack(
					[
						tray.text(`${shelf.name}`, {
							className: "font-semibold",
							style: {
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								"-webkit-line-clamp": "2",
								"-webkit-box-orient": "vertical",
								wordBreak: "break-word",
								maxWidth: "24rem",
							},
						}),
						tray.flex([
							tray.text(`${shelf.type}`, {
								style: {
									width: "fit-content",
									wordBreak: "normal",
									fontSize: "0.7rem",
									borderRadius: "999px",
									padding: "0 0.75rem",
									backgroundColor: `var(${shelf.type === "ANIME" ? "--indigo-800" : "--amber-700"})`,
								},
							}),
							tray.text(`${shelf.entries.length > 0 ? `${shelf.entries.length} entries` : `${shelf.entries.length} entry`}`, {
								style: {
									width: "fit-content",
									wordBreak: "normal",
									fontSize: "0.7rem",
									opacity: "0.7",
								},
							}),
							tray.text("•", {
								style: {
									width: "fit-content",
									wordBreak: "normal",
									fontSize: "0.7rem",
									opacity: "0.7",
								},
							}),
							tray.text(`Last updated: ${formatDate(new Date(shelf.lastUpdateAt))}`, {
								style: {
									width: "fit-content",
									wordBreak: "normal",
									fontSize: "0.7rem",
									opacity: "0.7",
								},
							}),
						]),
					],
					{ style: { justifyContent: "space-between", padding: "0.75rem", minHeight: "6rem", position: "relative" } }
				);

				const button = tray.button("\u200b", {
					style: {
						background: "none",
						position: "absolute",
						width: "100%",
						height: "100%",
						top: "0",
						padding: "0",
					},
					onClick: ctx.eventHandler(`vault-clicked:${shelf.uuid}`, () => {
						state.currentShelfId.set(shelf.uuid);
						tabs.current.set(Tabs.Shelf);
					}),
				});

				return tray.div([background, content, button], {
					className: "vault-shelf-entry-card-container bg-gray-900",
					style: { position: "relative", borderRadius: "0.5rem", border: "1px solid var(--border)", minHeight: "fit-content", overflow: "hidden" },
				});
			},
			formatShelfItemForSelection(shelf: Shelf) {
				const media = state.currentMedia.get();
				if (!media) return ctx.toast.error(`Could not find media to add to ${shelf.name}!`);

				const covers = shelf.entries.map((x) => x.coverImage).filter(Boolean);

				const background = tray.flex(
					[
						tray.div([], {
							className: "vault-shelf-entry-card-background",
							style: {
								height: "100%",
								width: "100%",
								maxWidth: "15rem",
								backgroundImage: `url(${covers[Math.floor(Math.random() * covers.length)]})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								maskImage: "linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)",
							},
						}),
					],
					{
						style: {
							width: "100%",
							height: "100%",
							pointerEvents: "none",
							position: "absolute",
							left: "0",
							right: "0",
							justifyContent: "end",
						},
					}
				);

				const content = tray.stack(
					[
						tray.text(`Add ${media.title?.userPreferred ?? "media"}`, {
							style: {
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								"-webkit-line-clamp": "1",
								"-webkit-box-orient": "vertical",
								wordBreak: "break-word",
								maxWidth: "24rem",
								fontSize: "0.85rem",
								color: "rgb(var(--color-gray-400))",
							},
						}),
						tray.text(`to ${shelf.name}`, {
							className: "font-semibold",
							style: {
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								"-webkit-line-clamp": "2",
								"-webkit-box-orient": "vertical",
								wordBreak: "break-word",
								maxWidth: "24rem",
							},
						}),
					],
					{ gap: 0, style: { padding: "0.75rem", minHeight: "6rem", position: "relative" } }
				);

				const button = tray.button("\u200b", {
					style: {
						background: "none",
						position: "absolute",
						width: "100%",
						height: "100%",
						top: "0",
						padding: "0",
					},
					onClick: ctx.eventHandler(`shelf-clicked:${shelf.uuid}`, () => {
						try {
							vault.addToShelf(shelf.uuid, media);
							ctx.toast.success(`Added ${media.title?.userPreferred ?? "current media"} to ${shelf.name}!`);
							state.currentMedia.set(null);
							tabs.current.set(Tabs.Vault);
							tray.close();
						} catch (e) {
							ctx.toast.error((e as Error).message);
						}
					}),
				});

				return tray.div([background, content, button], {
					className: "vault-shelf-entry-card-container bg-gray-900",
					style: { position: "relative", borderRadius: "0.5rem", border: "1px solid var(--border)", minHeight: "fit-content", overflow: "hidden" },
				});
			},
			formatMediaItem(entry: Shelf["entries"][number], type: $app.AL_MediaType, uuid: string) {
				const background = tray.div([], {
					className: "vault-shelf-entry-card-media-background",
					style: {
						height: "100%",
						width: "100%",
						backgroundImage: `url(${entry.coverImage})`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
						maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 100%)",
						position: "absolute",
					},
				});

				const content = tray.stack(
					[
						tray.text(`${entry.title.userPreferred}`, {
							style: {
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								"-webkit-line-clamp": "3",
								"-webkit-box-orient": "vertical",
								fontSize: "0.8rem",
								wordBreak: "break-word",
								lineHeight: "normal",
							},
						}),
					],
					{
						style: {
							justifyContent: "end",
							height: "100%",
							padding: "0.5rem",
							position: "relative",
						},
					}
				);

				const button = tray.button("\u200b", {
					style: {
						background: "none",
						position: "absolute",
						width: "100%",
						height: "100%",
						top: "0",
						padding: "0",
					},
					onClick: ctx.eventHandler(`entry-clicked:${entry.id}`, () => {
						tray.close();
						ctx.screen.navigateTo(type === "ANIME" ? "/entry" : "/entry/manga", { id: `${entry.id}` });
						tabs.current.set(Tabs.Vault);
					}),
				});

				const deleteBtn = tray.button("\u200b", {
					intent: "alert",
					style: {
						position: "absolute",
						width: "1.75rem",
						height: "1.75rem",
						padding: "0",
						top: "0.25rem",
						right: "0.25rem",
						zIndex: "3",
						borderRadius: "50%",
						backgroundImage:
							"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSAyMGEyIDIgMCAwIDAgMiAyaDEwYTIgMiAwIDAgMCAyLTJWOGgyVjZoLTRWNGEyIDIgMCAwIDAtMi0ySDlhMiAyIDAgMCAwLTIgMnYySDN2Mmgyek05IDRoNnYySDl6TTggOGg5djEySDdWOHoiPjwvcGF0aD48cGF0aCBkPSJNOSAxMGgydjhIOXptNCAwaDJ2OGgtMnoiPjwvcGF0aD48L3N2Zz4=)",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
						backgroundSize: "1rem",
					},
					onClick: ctx.eventHandler(`entry-delete:${entry.id}`, () => {
						tabs.currentOverlay.set([this.deleteItem(entry.title.userPreferred, "media", uuid, entry.id)]);
					}),
				});

				const addToOtherShelfBtn = tray.button("\u200b", {
					intent: "primary",
					style: {
						position: "absolute",
						width: "1.75rem",
						height: "1.75rem",
						padding: "0",
						top: "2.25rem",
						right: "0.25rem",
						zIndex: "3",
						borderRadius: "50%",
						backgroundImage:
							"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgMTFoLTZWNWgtMnY2SDV2Mmg2djZoMnYtNmg2eiI+PC9wYXRoPjwvc3ZnPg==)",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
						backgroundSize: "1rem",
					},
					onClick: ctx.eventHandler(`entry-addtoothershelf:${entry.id}`, () => {
						tabs.currentOverlay.set([this.addToOtherShelf(entry, type, uuid)]);
					}),
				});

				return tray.div([background, content, button, deleteBtn, addToOtherShelfBtn], {
					className: "vault-shelf-entry-card-media-container",
					style: { position: "relative", borderRadius: "0.5rem", border: "1px solid var(--border)", width: "8rem", height: "12rem", overflow: "hidden" },
				});
			},
			noEntries() {
				return tray.text("No entries", {
					style: {
						backgroundColor: "rgb(var(--color-gray-900))",
						borderRadius: "0.5rem",
						border: "1px solid var(--border)",
						width: "100%",
						height: "100%",
						textAlign: "center",
						alignContent: "center",
						opacity: "0.7",
						fontSize: "1.2rem",
					},
				});
			},
			backButton() {
				return tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent",
					style: {
						width: "2.5rem",
						height: "2.5rem",
						borderRadius: "50%",
						backgroundImage:
							"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMjggMjRhMTA0IDEwNCAwIDEgMCAxMDQgMTA0QTEwNC4xMSAxMDQuMTEgMCAwIDAgMTI4IDI0bTAgMTkyYTg4IDg4IDAgMSAxIDg4LTg4IDg4LjEgODguMSAwIDAgMS04OCA4OG00OC04OGE4IDggMCAwIDEtOCA4aC02MC42OWwxOC4zNSAxOC4zNGE4IDggMCAwIDEtMTEuMzIgMTEuMzJsLTMyLTMyYTggOCAwIDAgMSAwLTExLjMybDMyLTMyYTggOCAwIDAgMSAxMS4zMiAxMS4zMkwxMDcuMzEgMTIwSDE2OGE4IDggMCAwIDEgOCA4IiBzdHJva2U9Im5vbmUiLz48L3N2Zz4=)",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
						backgroundSize: "1.5rem",
					},
					onClick: ctx.eventHandler("goto:back", () => {
						// clear fieldrefs
						tabs.current.set(Tabs.Vault);
						state.shelfSearch.set("");
					}),
				});
			},
			[Tabs.Vault]() {
				const header = this.header("Vault", "Create, edit, and view your personal curated list", [
					tray.flex(
						[
							tray.button("\u200b", {
								intent: "gray-subtle",
								className: "bg-transparent",
								style: {
									width: "2.5rem",
									height: "2.5rem",
									borderRadius: "50%",
									backgroundImage:
										"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgMTFoLTZWNWgtMnY2SDV2Mmg2djZoMnYtNmg2eiI+PC9wYXRoPjwvc3ZnPg==)",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									backgroundSize: "1.5rem",
								},
								onClick: ctx.eventHandler("goto:create", () => {
									tabs.currentOverlay.set([this.createShelf()]);
								}),
							}),
							tray.button("\u200b", {
								intent: "gray-subtle",
								className: "bg-transparent",
								style: {
									width: "2.5rem",
									height: "2.5rem",
									borderRadius: "50%",
									backgroundImage:
										"url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNjYWNhY2EiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNjYWNhY2EiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMTcgMTNoLTZWNyIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NhY2FjYSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0yMSAzIDExIDEzbTEwIDB2N2ExIDEgMCAwIDEtMSAxSDRhMSAxIDAgMCAxLTEtMVY0YTEgMSAwIDAgMSAxLTFoNyIvPjwvc3ZnPg==)",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									backgroundSize: "1.2rem",
								},
								onClick: ctx.eventHandler("goto:import", () => {
									tabs.currentOverlay.set([this.importShelf()]);
								}),
							}),
						],
						{ gap: 0 }
					),
				]);

				const search = tray.flex(
					[
						tray.input({
							placeholder: `Search...`,
							value: state.vaultSearch.get(),
							style: {
								borderRadius: "0.5rem 0 0 0.5rem",
								paddingInlineStart: "2.5rem",
								backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM1YTVhNWEiIGhlaWdodD0iNTEyIiB3aWR0aD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTQ5NSA0NjYuMiAzNzcuMiAzNDguNGMyOS4yLTM1LjYgNDYuOC04MS4yIDQ2LjgtMTMwLjlDNDI0IDEwMy41IDMzMS41IDExIDIxNy41IDExIDEwMy40IDExIDExIDEwMy41IDExIDIxNy41UzEwMy40IDQyNCAyMTcuNSA0MjRjNDkuNyAwIDk1LjItMTcuNSAxMzAuOC00Ni43TDQ2Ni4xIDQ5NWM4IDggMjAuOSA4IDI4LjkgMCA4LTcuOSA4LTIwLjkgMC0yOC44bS0yNzcuNS04My4zQzEyNi4yIDM4Mi45IDUyIDMwOC43IDUyIDIxNy41UzEyNi4yIDUyIDIxNy41IDUyQzMwOC43IDUyIDM4MyAxMjYuMyAzODMgMjE3LjVzLTc0LjMgMTY1LjQtMTY1LjUgMTY1LjQiLz48L3N2Zz4=)`,
								backgroundSize: "1rem",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "calc(0% + 0.75rem) center",
							},
							onChange: ctx.eventHandler("search-query", (e) => {
								state.vaultSearch.set(String(e.value));
							}),
						}),
						tray.button("\u200b", {
							intent: "gray-subtle",
							style: {
								width: "2.5rem",
								height: "2.5rem",
								backgroundImage:
									"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0zIDZoMThNNyAxMmgxMG0tNyA2aDQiLz48L3N2Zz4=)",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								backgroundSize: "1.2rem",
								borderRadius: "0 0.5rem 0.5rem 0",
							},
							onClick: ctx.eventHandler("goto:sort", () => {
								tabs.currentOverlay.set([this.sortShelf()]);
							}),
						}),
					],
					{ gap: 0 }
				);

				const entries = Object.values(vault.storage)
					.filter((x) =>
						state.vaultSearch.get().length
							? `${x.name} ${x.entries.map((e) => e.title.synonyms).flat()}`.toLowerCase().includes(state.vaultSearch.get().toLowerCase())
							: true
					)
					.sort(shelfSort)
					.map(this.formatShelfItem);

				const body = tray.stack(entries.length ? entries : [this.noEntries()], { style: { height: "25rem", overflowY: "scroll" } });

				return tray.stack([this.overlay(), header, search, body], { style: { padding: "0.5rem" } });
			},
			[Tabs.Shelf]() {
				const uuid = state.currentShelfId.get();
				if (!uuid) {
					tabs.current.set(Tabs.Vault);
					return ctx.toast.error(`Could not get shelf information: uiid is ${uuid}`);
				}
				const shelf = vault.storage[uuid];
				if (!shelf) {
					tabs.current.set(Tabs.Vault);
					return ctx.toast.error(`Shelf with uuid (${uuid}) could not be retrieved.`);
				}

				const header = this.header("Vault", `Viewing: ${shelf.name}`, [
					tray.flex([
						this.backButton(),
						tray.button("\u200b", {
							intent: "gray-subtle",
							className: "bg-transparent",
							style: {
								width: "2.5rem",
								height: "2.5rem",
								borderRadius: "50%",
								backgroundImage:
									"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMi4yMiAyaC0uNDRhMiAyIDAgMCAwLTIgMnYuMThhMiAyIDAgMCAxLTEgMS43M2wtLjQzLjI1YTIgMiAwIDAgMS0yIDBsLS4xNS0uMDhhMiAyIDAgMCAwLTIuNzMuNzNsLS4yMi4zOGEyIDIgMCAwIDAgLjczIDIuNzNsLjE1LjFhMiAyIDAgMCAxIDEgMS43MnYuNTFhMiAyIDAgMCAxLTEgMS43NGwtLjE1LjA5YTIgMiAwIDAgMC0uNzMgMi43M2wuMjIuMzhhMiAyIDAgMCAwIDIuNzMuNzNsLjE1LS4wOGEyIDIgMCAwIDEgMiAwbC40My4yNWEyIDIgMCAwIDEgMSAxLjczVjIwYTIgMiAwIDAgMCAyIDJoLjQ0YTIgMiAwIDAgMCAyLTJ2LS4xOGEyIDIgMCAwIDEgMS0xLjczbC40My0uMjVhMiAyIDAgMCAxIDIgMGwuMTUuMDhhMiAyIDAgMCAwIDIuNzMtLjczbC4yMi0uMzlhMiAyIDAgMCAwLS43My0yLjczbC0uMTUtLjA4YTIgMiAwIDAgMS0xLTEuNzR2LS41YTIgMiAwIDAgMSAxLTEuNzRsLjE1LS4wOWEyIDIgMCAwIDAgLjczLTIuNzNsLS4yMi0uMzhhMiAyIDAgMCAwLTIuNzMtLjczbC0uMTUuMDhhMiAyIDAgMCAxLTIgMGwtLjQzLS4yNWEyIDIgMCAwIDEtMS0xLjczVjRhMiAyIDAgMCAwLTItMiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiLz48L3N2Zz4=)",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								backgroundSize: "1.5rem",
								padding: "0",
								paddingInlineStart: "0.5rem",
							},
							onClick: ctx.eventHandler("goto:settings", () => {
								tabs.currentOverlay.set([this.shelfSettings(shelf.uuid)]);
							}),
						}),
						tray.button("\u200b", {
							intent: "alert-subtle",
							className: "bg-transparent",
							style: {
								width: "2.5rem",
								height: "2.5rem",
								borderRadius: "50%",
								backgroundImage:
									"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNmY2E1YTUiIGZpbGw9IiNmY2E1YTUiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSAyMGEyIDIgMCAwIDAgMiAyaDEwYTIgMiAwIDAgMCAyLTJWOGgyVjZoLTRWNGEyIDIgMCAwIDAtMi0ySDlhMiAyIDAgMCAwLTIgMnYySDN2Mmgyek05IDRoNnYySDl6TTggOGg5djEySDdWOHoiPjwvcGF0aD48cGF0aCBkPSJNOSAxMGgydjhIOXptNCAwaDJ2OGgtMnoiPjwvcGF0aD48L3N2Zz4=)",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								backgroundSize: "1.5rem",
								padding: "0",
								paddingInlineStart: "0.5rem",
							},
							onClick: ctx.eventHandler("action-delete", () => {
								tabs.currentOverlay.set([this.deleteItem(shelf.name, "shelf", shelf.uuid)]);
							}),
						}),
					]),
				]);

				const search = tray.input({
					placeholder: `Search ${shelf.name}...`,
					value: state.shelfSearch.get(),
					style: {
						borderRadius: "0.5rem",
						paddingInlineStart: "2.5rem",
						backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM1YTVhNWEiIGhlaWdodD0iNTEyIiB3aWR0aD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTQ5NSA0NjYuMiAzNzcuMiAzNDguNGMyOS4yLTM1LjYgNDYuOC04MS4yIDQ2LjgtMTMwLjlDNDI0IDEwMy41IDMzMS41IDExIDIxNy41IDExIDEwMy40IDExIDExIDEwMy41IDExIDIxNy41UzEwMy40IDQyNCAyMTcuNSA0MjRjNDkuNyAwIDk1LjItMTcuNSAxMzAuOC00Ni43TDQ2Ni4xIDQ5NWM4IDggMjAuOSA4IDI4LjkgMCA4LTcuOSA4LTIwLjkgMC0yOC44bS0yNzcuNS04My4zQzEyNi4yIDM4Mi45IDUyIDMwOC43IDUyIDIxNy41UzEyNi4yIDUyIDIxNy41IDUyQzMwOC43IDUyIDM4MyAxMjYuMyAzODMgMjE3LjVzLTc0LjMgMTY1LjQtMTY1LjUgMTY1LjQiLz48L3N2Zz4=)`,
						backgroundSize: "1rem",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "calc(0% + 0.75rem) center",
					},
					onChange: ctx.eventHandler("search-query", (e) => {
						state.shelfSearch.set(String(e.value));
					}),
				});

				const entries = shelf.entries
					.filter((x) =>
						state.shelfSearch.get().length ? x.title.synonyms.join(" ").toLowerCase().includes(state.shelfSearch.get().toLowerCase()) : true
					)
					.sort(entrySort)
					.map((e) => this.formatMediaItem(e, shelf.type, shelf.uuid));

				const body = tray.div(entries.length ? entries : [this.noEntries()], {
					style: { height: "25rem", overflowY: "scroll", gap: "0.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))" },
				});

				return tray.stack([this.overlay(), header, search, body], { style: { padding: "0.5rem" } });
			},
			[Tabs.AddToShelf]() {
				const media = state.currentMedia.get();
				if (!media) {
					ctx.toast.error("Unable to retrieve media");
					tray.close();
					return tabs.current.set(Tabs.Vault);
				}

				const header = this.header("Add to Shelf", `Adding ${media.title?.userPreferred} to a shelf `, [
					tray.button("\u200b", {
						intent: "gray-subtle",
						className: "bg-transparent",
						style: {
							width: "2.5rem",
							height: "2.5rem",
							borderRadius: "50%",
							backgroundImage:
								"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgMTFoLTZWNWgtMnY2SDV2Mmg2djZoMnYtNmg2eiI+PC9wYXRoPjwvc3ZnPg==)",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
							backgroundSize: "1.5rem",
							padding: "0",
							paddingInlineStart: "0.5rem",
						},
						onClick: ctx.eventHandler("goto:create", () => {
							tabs.currentOverlay.set([this.createShelf()]);
						}),
					}),
				]);

				const search = tray.input({
					placeholder: `Search...`,
					value: state.vaultSearch.get(),
					style: {
						borderRadius: "0.5rem",
						paddingInlineStart: "2.5rem",
						backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM1YTVhNWEiIGhlaWdodD0iNTEyIiB3aWR0aD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTQ5NSA0NjYuMiAzNzcuMiAzNDguNGMyOS4yLTM1LjYgNDYuOC04MS4yIDQ2LjgtMTMwLjlDNDI0IDEwMy41IDMzMS41IDExIDIxNy41IDExIDEwMy40IDExIDExIDEwMy41IDExIDIxNy41UzEwMy40IDQyNCAyMTcuNSA0MjRjNDkuNyAwIDk1LjItMTcuNSAxMzAuOC00Ni43TDQ2Ni4xIDQ5NWM4IDggMjAuOSA4IDI4LjkgMCA4LTcuOSA4LTIwLjkgMC0yOC44bS0yNzcuNS04My4zQzEyNi4yIDM4Mi45IDUyIDMwOC43IDUyIDIxNy41UzEyNi4yIDUyIDIxNy41IDUyQzMwOC43IDUyIDM4MyAxMjYuMyAzODMgMjE3LjVzLTc0LjMgMTY1LjQtMTY1LjUgMTY1LjQiLz48L3N2Zz4=)`,
						backgroundSize: "1rem",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "calc(0% + 0.75rem) center",
					},
					onChange: ctx.eventHandler("search-query", (e) => {
						state.vaultSearch.set(String(e.value));
					}),
				});

				const entries = Object.values(vault.storage)
					.filter((x) => x.type === media.type)
					.filter((x) => (state.vaultSearch.get().length ? x.name.toLowerCase().includes(state.vaultSearch.get().toLowerCase()) : true))
					.sort((A, B) => A.name.localeCompare(B.name))
					.map((x) => this.formatShelfItemForSelection(x));

				const body = tray.stack(entries.length ? entries : [this.noEntries()], { style: { height: "25rem", overflowY: "scroll" } });

				return tray.stack([this.overlay(), header, search, body], { style: { padding: "0.5rem" } });
			},
			get() {
				return this[tabs.current.get()]();
			},
		};

		function shelfSort(A: Shelf, B: Shelf) {
			const sort = fieldRef.shelfSort.current;

			if (sort === ShelfSort.NameDescending) {
				return B.name.localeCompare(A.name);
			}

			if (sort === ShelfSort.CreatedAtAscending) {
				return new Date(A.createdAt).getTime() - new Date(B.createdAt).getTime();
			}

			if (sort === ShelfSort.CreatedAtDescending) {
				return new Date(B.createdAt).getTime() - new Date(A.createdAt).getTime();
			}

			if (sort === ShelfSort.lastUpdateAtAscending) {
				return new Date(A.lastUpdateAt).getTime() - new Date(B.lastUpdateAt).getTime();
			}

			if (sort === ShelfSort.lastUpdateAtDescending) {
				return new Date(B.lastUpdateAt).getTime() - new Date(A.lastUpdateAt).getTime();
			}
			// Default: ShelfSort.NameAscending
			return A.name.localeCompare(B.name);
		}

		function entrySort(A: Shelf["entries"][number], B: Shelf["entries"][number]) {
			const sort = fieldRef.entrySort.current;

			if (sort === EntrySort.NameDescending) {
				return B.title.userPreferred.localeCompare(A.title.userPreferred);
			}

			if (sort === EntrySort.AddedAtAscending) {
				return new Date(A.addedAt).getTime() - new Date(B.addedAt).getTime();
			}

			if (sort === EntrySort.AddedAtDescending) {
				return new Date(B.addedAt).getTime() - new Date(A.addedAt).getTime();
			}

			if (sort === EntrySort.MediaIdAscending) {
				return A.id - B.id;
			}

			if (sort === EntrySort.MediaIdDescending) {
				return B.id - A.id;
			}
			// Default: EntrySort.NameAscending
			return A.title.userPreferred.localeCompare(B.title.userPreferred);
		}

		function formatDate(date: Date): string {
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const year = String(date.getFullYear()).slice(-2);

			let hours = date.getHours();
			const minutes = String(date.getMinutes()).padStart(2, "0");
			const ampm = hours >= 12 ? "PM" : "AM";

			hours = hours % 12;
			if (hours === 0) hours = 12; // convert 0 → 12 for 12-hour format

			return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
		}

		const icon =
			"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0IDdWMTNNMTEgMTBIMTdNMTQgMjFDMTEgMjEgOCAyMSA1IDIxQzMuODk1NDMgMjEgMy4wMDAwMSAyMC4xMDY5IDMuMDAwMDEgMTkuMDAyM0MzIDE2LjI4ODggMyAxMS41OTM0IDMgMTBNOSAxN0gxOUMyMC4xMDQ2IDE3IDIxIDE2LjEwNDYgMjEgMTVWNUMyMSAzLjg5NTQzIDIwLjEwNDYgMyAxOSAzSDlDNy44OTU0MyAzIDcgMy44OTU0MyA3IDVWMTVDNyAxNi4xMDQ2IDcuODk1NDMgMTcgOSAxN1oiIHN0cm9rZT0iI2NhY2FjYSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+";
		const btnstyle = {
			backgroundImage: `url(${icon})`,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "calc(0% + 0.5rem) center",
			backgroundSize: "1.5rem",
			paddingInlineStart: "2.3rem",
		};

		const animePageButton = ctx.action.newAnimePageButton({
			label: "Add to shelf",
			intent: "gray-subtle",
			style: btnstyle,
		});

		const mangaPageButton = ctx.action.newMangaPageButton({
			label: "Add to shelf",
			intent: "gray-subtle",
			style: btnstyle,
		});

		for (const button of [animePageButton, mangaPageButton]) {
			button.mount();
			//@ts-ignore
			button.onClick((e) => {
				state.currentMedia.set(e.media);
				tabs.current.set(Tabs.AddToShelf);
				tray.open();
			});
		}

		ctx.dom.onReady(async () => {
			const style = await ctx.dom.createElement("style");
			style.setText(
				".vault-shelf-entry-card-background, .vault-shelf-entry-card-media-background { transition: transform ease-in-out 0.2s;  } .vault-shelf-entry-card-container:hover .vault-shelf-entry-card-background { transform: scale(1.1); mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, transparent 100%)!important } .vault-shelf-entry-card-media-container:hover .vault-shelf-entry-card-media-background { transform: scale(1.1); }"
			);
		});

		tray.render(() => tabs.get());
		tray.onClose(() => {
			tabs.currentOverlay.set(null);
			if (state.currentMedia.get()) {
				state.currentMedia.set(null);
				state.vaultSearch.set("");
				tabs.current.set(Tabs.Vault);
			}
		});

		// For older versions
		vault.import();
		vault.init();
	});
}
