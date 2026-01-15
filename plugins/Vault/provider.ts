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

		const icons = {
			html: {
				addShelf: /*html*/ `
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M14 7V13M11 10H17M14 21C11 21 8 21 5 21C3.89543 21 3.00001 20.1069 3.00001 19.0023C3 16.2888 3 11.5934 3 10M9 17H19C20.1046 17 21 16.1046 21 15V5C21 3.89543 20.1046 3 19 3H9C7.89543 3 7 3.89543 7 5V15C7 16.1046 7.89543 17 9 17Z" stroke="#cacaca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>`,
				back: /*html*/ `
					<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 256 256" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a8 8 0 0 1-8 8h-60.69l18.35 18.34a8 8 0 0 1-11.32 11.32l-32-32a8 8 0 0 1 0-11.32l32-32a8 8 0 0 1 11.32 11.32L107.31 120H168a8 8 0 0 1 8 8" stroke="none"/>
					</svg>`,
				close: /*html*/ `
					<svg stroke="#d93e3e" fill="#d93e3e" stroke-width="0" viewBox="0 0 16 16" class="text-[0.95rem]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"></path>
					</svg>`,
				delete: /*html*/ `
					<svg stroke="#fca5a5" fill="#fca5a5" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
						<path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
					</svg>`,
				import: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" fill="#cacaca" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#cacaca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13h-6V7"/>
						<path fill="none" stroke="#cacaca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 3 11 13m10 0v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7"/>
					</svg>`,
				plus: /*html*/ `
					<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
					</svg>`,
				search: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" fill="#5a5a5a" height="512" width="512" viewBox="0 0 512 512">
						<path d="M495 466.2 377.2 348.4c29.2-35.6 46.8-81.2 46.8-130.9C424 103.5 331.5 11 217.5 11 103.4 11 11 103.5 11 217.5S103.4 424 217.5 424c49.7 0 95.2-17.5 130.8-46.7L466.1 495c8 8 20.9 8 28.9 0 8-7.9 8-20.9 0-28.8m-277.5-83.3C126.2 382.9 52 308.7 52 217.5S126.2 52 217.5 52C308.7 52 383 126.3 383 217.5s-74.3 165.4-165.5 165.4"/>
					</svg>`,
				settings: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/>
						<circle cx="12" cy="12" r="3"/>
					</svg>`,
				sort: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M3 6h18M7 12h10m-7 6h4"/>
					</svg>`,
			},
			get(name: keyof typeof this.html, raw: boolean = false) {
				if (raw) return this.html[name];
				return `data:image/svg+xml;base64,${Buffer.from(this.html[name].trim(), "utf-8").toString("base64")}`;
			},
		};

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
					? tray.div([tray.flex(overlay, { className: "w-full h-full justify-center items-center" })], {
							className: "fixed bg-black/80 z-[50] top-0 left-0 rounded-lg border",
							style: {
								width: "calc(100%)",
								height: "calc(100% - 1rem)",
							},
					  })
					: ([] as any[]);
			},
			header(primary: string, subtext?: string, additionalComponents?: any[]) {
				const icon = tray.div([], {
					className: "w-10 h-10 bg-contain bg-no-repeat bg-center shrink-0",
					style: { backgroundImage: `url(${iconUrl})` },
				});

				const text = tray.stack(
					[
						tray.span(`${primary}`, { className: " text-lg font-bold" }), //
						subtext ? tray.span(`${subtext}`, { className: "text-[--muted] text-sm line-clamp-1" }) : [],
					],
					{ gap: 0, className: "flex-1" }
				);

				return tray.flex([icon, text, tray.div(additionalComponents ?? [])], {
					gap: 3,
					className: "mb-4",
				});
			},
			customStyles() {
				return tray.css(/*css*/ `
					.grayscale {
						filter: grayscale(100%);
					}
					.grayscale-0 {
						filter: grayscale(0%);
					}
					.hover\\:grayscale:hover {
						filter: grayscale(100%);
					}
					.hover\\:grayscale-0:hover {
						filter: grayscale(0%);	
					}
				`);
			},
			addToOtherShelf(entry: Shelf["entries"][number], type: $app.AL_MediaType, uuid: string) {
				const headerText = tray.text("Add entry to other shelves", { className: "text-lg font-semibold flex-1" });
				const backButton = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center p-0 grayscale hover:grayscale-0 transition",
					style: { backgroundImage: `url(${icons.get("close")})` },
					onClick: ctx.eventHandler("add-to-shelf:back", () => this.currentOverlay.set(null)),
				});

				const header = tray.flex([headerText, backButton], { className: "justify-between items-center border-b pb-1" });

				const subtext = tray.text(`Add ${entry.title.userPreferred} to other shelves:`, {
					className: "text-sm text-[--muted] break-words",
				});

				const selection = tray.stack(
					Object.values(vault.storage)
						.filter((x) => x.type === type && !x.entries.some((y) => y.id === entry.id))
						.sort((A, B) => A.name.localeCompare(B.name))
						.map((shelf) =>
							tray.button(`${shelf.name}`, {
								size: "md",
								intent: "gray-subtle",
								className: "w-full flex-shrink-0 justify-start",
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
							})
						),
					{
						style: { overflowY: "scroll" },
					}
				);

				return tray.stack(
					[
						tabs.customStyles(),
						header,
						tray.stack([subtext, selection], {
							style: {
								overflowY: "scroll",
								maxHeight: "25rem",
								minHeight: "10rem",
							},
						}),
					],
					{
						className: "bg-gray-900 rounded-xl p-5",
						style: { boxShadow: "0 0 10px black", width: "25rem", margin: "1rem" },
					}
				);
			},
			sortShelf() {
				const headerText = tray.text("Sort shelf", { className: "text-lg font-semibold flex-1" });
				const backButton = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center p-0 grayscale hover:grayscale-0 transition",
					style: { backgroundImage: `url(${icons.get("close")})` },
					onClick: ctx.eventHandler("sort-shelf:back", () => this.currentOverlay.set(null)),
				});
				const header = tray.flex([headerText, backButton], { className: "justify-between items-center border-b pb-1" });

				const sort = tray.select("Sort Shelves", {
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
				});

				return tray.stack([tabs.customStyles(), header, sort], {
					className: "bg-gray-900 rounded-xl p-5",
					style: { boxShadow: "0 0 10px black", width: "25rem", margin: "1rem" },
				});
			},
			createShelf() {
				fieldRef.shelfCreate.reset();

				const headerText = tray.text("Create shelf", { className: "text-lg font-semibold flex-1" });
				const backButton = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center p-0 grayscale hover:grayscale-0 transition",
					style: { backgroundImage: `url(${icons.get("close")})` },
					onClick: ctx.eventHandler("create-shelf:back", () => this.currentOverlay.set(null)),
				});
				const header = tray.flex([headerText, backButton], { className: "justify-between items-center border-b pb-1" });

				const types = tray.flex(
					[
						tray.text("Type", {
							className: "w-fit text-sm h-8 px-2 bg-gray-800 border break-normal",
							style: { borderRadius: "0.5rem 0 0 0.5rem", alignContent: "center" },
						}),
						tray.select("", {
							value: "ANIME",
							size: "sm",
							fieldRef: fieldRef.shelfCreate.type,
							className: "h-8",
							options: [
								{ label: "Anime", value: "ANIME" },
								{ label: "Manga", value: "MANGA" },
							],
							style: {
								borderRadius: "0 0.5rem 0.5rem 0",
								marginLeft: "-1px",
							},
							onChange: ctx.eventHandler("create-shelf-type", ({ value }) => fieldRef.shelfCreate.type.setValue(value)),
						}),
					],
					{ gap: 0, className: "items-center" }
				);

				const action = tray.flex(
					[
						tray.button("Cancel", {
							intent: "gray-subtle",
							size: "md",
							className: "w-full rounded-lg",
							onClick: ctx.eventHandler("create-shelf-dismiss", () => this.currentOverlay.set(null)),
						}),
						tray.button("Create", {
							intent: "success-subtle",
							size: "md",
							className: "w-full rounded-lg",
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
					{ className: "mt-4" }
				);

				return tray.stack(
					[
						tabs.customStyles(),
						header,
						tray.text("Shelf Name", { className: "text-base font-semibold self-start w-fit" }),
						tray.input({ fieldRef: fieldRef.shelfCreate.name, className: "rounded-lg" }),
						types,
						action,
					],
					{
						className: "bg-gray-900 rounded-xl p-5",
						style: { boxShadow: "0 0 10px black", width: "25rem", margin: "1rem" },
					}
				);
			},
			importShelf() {
				fieldRef.shelfSettings.importString.setValue("");

				const headerText = tray.text("Import shelf", { className: "text-lg font-semibold flex-1" });
				const backButton = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center p-0 grayscale hover:grayscale-0 transition",
					style: { backgroundImage: `url(${icons.get("close")})` },
					onClick: ctx.eventHandler("import-shelf:back", () => this.currentOverlay.set(null)),
				});
				const header = tray.flex([headerText, backButton], { className: "justify-between items-center border-b pb-1" });

				const input = tray.input({
					placeholder: "Import string",
					fieldRef: fieldRef.shelfSettings.importString,
					style: { borderRadius: "0.5rem" },
				});

				const importBtn = tray.button("Import shelf", {
					intent: "primary-subtle",
					size: "md",
					className: "mt-2",
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
				});

				return tray.stack([tabs.customStyles(), header, input, importBtn], {
					className: "bg-gray-900 rounded-xl p-5",
					style: { boxShadow: "0 0 10px black", width: "25rem", margin: "1rem" },
				});
			},
			deleteItem(name: string, type: "shelf" | "media", uuid: string, id?: number) {
				const headerText = tray.text(type === "shelf" ? `Delete shelf?` : `Remove entry from this shelf?`, { className: "text-lg font-semibold flex-1" });
				const backButton = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center p-0 grayscale hover:grayscale-0 transition",
					style: { backgroundImage: `url(${icons.get("close")})` },
					onClick: ctx.eventHandler("delete-item:back", () => this.currentOverlay.set(null)),
				});
				const header = tray.flex([headerText, backButton], { className: "justify-between items-center border-b pb-1" });

				const body = tray.p([
					tray.span(`Are you sure you want to ${type === "shelf" ? "delete" : "remove"} `),
					tray.span(`${name}`, {
						className: "text-red-300 break-words font-semibold",
					}),
					tray.span(type === "shelf" ? "?" : " from this shelf?"),
				]);

				const action = tray.flex(
					[
						tray.button("Cancel", {
							intent: "gray-subtle",
							size: "md",
							className: "w-full rounded-lg",
							onClick: ctx.eventHandler("create-shelf-dismiss", () => this.currentOverlay.set(null)),
						}),
						tray.button("Delete", {
							intent: "alert-subtle",
							size: "md",
							className: "w-full rounded-lg",
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
					{ className: "mt-4" }
				);

				return tray.stack([tabs.customStyles(), header, body, tray.span("This action cannot be undone."), action], {
					className: "bg-gray-900 rounded-xl p-5",
					style: { boxShadow: "0 0 10px black", margin: "0 1rem", overflowY: "scroll", maxHeight: "90%" },
				});
			},
			shelfSettings(uuid: string) {
				const shelf = vault.storage[uuid];
				if (!shelf) {
					ctx.toast.error(`Unable to find shelf with uuid ${uuid}`);
					return tabs.current.set(Tabs.Shelf);
				}

				fieldRef.shelfSettings.name.setValue(shelf.name);
				fieldRef.shelfSettings.importString.setValue("");

				const headerText = tray.text(`Settings`, { className: "text-lg font-semibold flex-1" });
				const backButton = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center p-0 grayscale hover:grayscale-0 transition",
					style: { backgroundImage: `url(${icons.get("close")})` },
					onClick: ctx.eventHandler("shelf-settings:back", () => this.currentOverlay.set(null)),
				});
				const header = tray.flex([headerText, backButton], { className: "justify-between items-center border-b pb-1" });

				const sort = tray.select("Sort Entries", {
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
				});

				const renameInput = tray.flex(
					[
						tray.input({
							fieldRef: fieldRef.shelfSettings.name,
							style: { borderRadius: "0.5rem 0 0 0.5rem" },
						}),
						tray.button("Save", {
							intent: "success-subtle",
							className: "h-auto",
							style: { borderRadius: "0 0.5rem 0.5rem 0" },
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
					{ gap: 0, className: "w-full" }
				);

				const rename = tray.stack(
					[
						tray.text("Rename Shelf", { className: "font-semibold" }), //
						renameInput,
					],
					{
						gap: 1,
						className: "items-center",
					}
				);

				const importString = tray.input({
					placeholder: "Import string",
					fieldRef: fieldRef.shelfSettings.importString,
					style: { borderRadius: "0.5rem 0 0 0.5rem" },
				});

				const importBtn = tray.button("Import", {
					intent: "gray-subtle",
					className: "h-auto",
					style: { borderRadius: "0 0.5rem 0.5rem 0" },
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
				});

				const importItems = tray.stack(
					[
						tray.text("Import Items to shelf", { className: "font-semibold", style: { alignContent: "center" } }),
						tray.flex([importString, importBtn], { gap: 0 }),
					],
					{ gap: 1 }
				);

				const exportShelf = tray.button("Export shelf", {
					intent: "primary-subtle",
					size: "md",
					className: "mt-2",
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
				});

				return tray.stack([tabs.customStyles(), header, sort, rename, importItems, exportShelf], {
					className: "bg-gray-900 rounded-xl p-5 m-4",
					style: { boxShadow: "0 0 10px black", width: "25rem" },
				});
			},
			formatShelfItem(shelf: Shelf) {
				const covers = shelf.entries.map((x) => x.coverImage).filter(Boolean);

				const background = tray.flex(
					[
						tray.div([], {
							className: "w-full h-full bg-cover bg-no-repeat bg-center vault-shelf-entry-card-background",
							style: {
								maxWidth: "15rem",
								backgroundImage: `url(${covers[Math.floor(Math.random() * covers.length)]})`,
								maskImage: "linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)",
							},
						}),
					],
					{
						className: "w-full h-full pointer-events-none absolute left-0 right-0 justify-end",
					}
				);

				const name = tray.text(`${shelf.name}`, {
					className: "font-semibold line-clamp-2 overflow-hidden break-words",
					style: { maxWidth: "24rem" },
				});

				const details = tray.flex([
					tray.span(`${shelf.type}`, {
						className: "w-fit break-normal text-xs rounded-full py-0 px-2",
						style: { backgroundColor: `var(${shelf.type === "ANIME" ? "--indigo-800" : "--amber-700"})` },
					}),
					tray.span(`${shelf.entries.length > 0 ? `${shelf.entries.length} entries` : `${shelf.entries.length} entry`}`, {
						className: "w-fit break-normal text-xs text-[--muted]",
					}),
					tray.span("•", { className: "w-fit break-normal text-xs text-[--muted]" }),
					tray.span(`Last updated: ${formatDate(new Date(shelf.lastUpdateAt))}`, {
						className: "w-fit break-normal text-xs text-[--muted]",
					}),
				]);

				const content = tray.stack([name, details], { className: "justify-between p-3 h-24" });

				return tray.div([background, content], {
					className: "rounded-lg border overflow-hidden vault-shelf-entry-card-container bg-gray-900 cursor-pointer mr-1",
					style: { minHeight: "fit-content" },
					onClick: ctx.eventHandler(`vault-clicked:${shelf.uuid}`, () => {
						state.currentShelfId.set(shelf.uuid);
						tabs.current.set(Tabs.Shelf);
					}),
				});
			},
			formatShelfItemForSelection(shelf: Shelf) {
				const media = state.currentMedia.get();
				if (!media) return ctx.toast.error(`Could not find media to add to ${shelf.name}!`);
				const covers = shelf.entries.map((x) => x.coverImage).filter(Boolean);

				const background = tray.flex(
					[
						tray.div([], {
							className: "w-full h-full bg-cover bg-no-repeat bg-center vault-shelf-entry-card-background",
							style: {
								maxWidth: "15rem",
								backgroundImage: `url(${covers[Math.floor(Math.random() * covers.length)]})`,
								maskImage: "linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)",
							},
						}),
					],
					{
						className: "w-full h-full pointer-events-none absolute left-0 right-0 justify-end",
					}
				);

				const content = tray.stack(
					[
						tray.text(`Add ${media.title?.userPreferred ?? "media"}`, {
							className: "overflow-hidden line-clamp-1 text-sm text-[--muted]",
							style: { maxWidth: "24rem" },
						}),
						tray.p(
							[
								tray.span("to ", { className: "text-sm text-[--muted]" }), //
								tray.span(`${shelf.name}`, {
									className: "font-semibold",
									style: { maxWidth: "24rem" },
								}),
							],
							{ className: "overflow-hidden line-clamp-2 break-words" }
						),
					],
					{ gap: 0, className: "h-24 p-3" }
				);

				return tray.div([background, content], {
					className: "vault-shelf-entry-card-container rounded-lg border overflow-hidden bg-gray-900 cursor-pointer shrink-0",
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
			},
			formatMediaItem(entry: Shelf["entries"][number], type: $app.AL_MediaType, uuid: string) {
				const background = tray.div([], {
					className: "vault-shelf-entry-card-media-background h-full w-full bg-cover bg-no-repeat bg-center absolute",
					style: {
						backgroundImage: `url(${entry.coverImage})`,
						maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 100%)",
					},
				});

				const content = tray.stack(
					[
						tray.text(`${entry.title.userPreferred}`, {
							className: "overflow-hidden line-clamp-3 text-xs break-words leading-none",
						}),
					],
					{
						className: "h-full p-2 relative justify-end",
					}
				);

				const button = tray.button("\u200b", {
					className: "bg-transparent absolute top-0 right-0 w-full h-full",
					onClick: ctx.eventHandler(`entry-clicked:${entry.id}`, () => {
						tray.close();
						ctx.screen.navigateTo(type === "ANIME" ? "/entry" : "/entry/manga", { id: `${entry.id}` });
						tabs.current.set(Tabs.Vault);
					}),
				});

				const deleteBtn = tray.button("\u200b", {
					intent: "alert",
					className: "absolute w-7 h-7 p-0 top-1 right-1 z-[3] rounded-full bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.get("delete")})` },
					onClick: ctx.eventHandler(`entry-delete:${entry.id}`, () => {
						tabs.currentOverlay.set([this.deleteItem(entry.title.userPreferred, "media", uuid, entry.id)]);
					}),
				});

				const addToOtherShelfBtn = tray.button("\u200b", {
					intent: "primary",
					className: "absolute w-7 h-7 p-0 top-9 right-1 z-[3] rounded-full bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.get("plus")})` },
					onClick: ctx.eventHandler(`entry-addtoothershelf:${entry.id}`, () => {
						tabs.currentOverlay.set([this.addToOtherShelf(entry, type, uuid)]);
					}),
				});

				return tray.div([background, content, button, deleteBtn, addToOtherShelfBtn], {
					className: "vault-shelf-entry-card-media-container cursor-pointer rounded-lg border w-32 overflow-hidden relative",
					style: { height: "calc(0.25rem * 48)" },
				});
			},
			noEntries() {
				return tray.text("No entries", {
					className: "bg-gray-900 rounded-lg border w-full h-full text-center text-[--muted] text-lg",
					style: { alignContent: "center" },
				});
			},
			backButton() {
				const button = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center ",
					style: {
						backgroundImage: `url(${icons.get("back")})`,
						backgroundSize: "1.5rem",
					},
					onClick: ctx.eventHandler("goto:back", () => {
						// clear fieldrefs
						tabs.current.set(Tabs.Vault);
						state.shelfSearch.set("");
					}),
				});

				return tray.tooltip(button, { text: "Go Back" });
			},
			[Tabs.Vault]() {
				const create = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent",
					style: { backgroundImage: `url(${icons.get("plus")})`, backgroundSize: "1.5rem" },
					onClick: ctx.eventHandler("goto:create", () => tabs.currentOverlay.set([this.createShelf()])),
				});

				const importShelf = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent",
					style: { backgroundImage: `url(${icons.get("import")})`, backgroundSize: "1.3rem" },
					onClick: ctx.eventHandler("goto:import", () => {
						tabs.currentOverlay.set([this.importShelf()]);
					}),
				});

				const header = this.header("Vault", "Create, edit, and view your personal curated list", [
					tray.flex(
						[
							tray.tooltip(create, { text: "Create Shelf" }), //
							tray.tooltip(importShelf, { text: "Import Shelf" }),
						],
						{
							className: "items-center",
						}
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
								backgroundImage: `url(${icons.get("search")})`,
								backgroundSize: "1rem",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "calc(0% + 0.75rem) center",
							},
							onChange: ctx.eventHandler("search-query", (e) => state.vaultSearch.set(String(e.value))),
						}),
						tray.tooltip(
							tray.button("\u200b", {
								intent: "gray-subtle",
								className: "w-10 h-10 bg-no-repeat bg-center",
								style: {
									backgroundImage: `url(${icons.get("sort")})`,
									backgroundSize: "1.2rem",
									borderRadius: "0 0.5rem 0.5rem 0",
								},
								onClick: ctx.eventHandler("goto:sort", () => tabs.currentOverlay.set([this.sortShelf()])),
							}),
							{ text: "Sort" }
						),
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

				const settings = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent",
					style: { backgroundImage: `url(${icons.get("settings")})`, backgroundSize: "1.5rem" },
					onClick: ctx.eventHandler("goto:settings", () => tabs.currentOverlay.set([this.shelfSettings(shelf.uuid)])),
				});

				const deleteShelf = tray.button("\u200b", {
					intent: "alert-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent",
					style: { backgroundImage: `url(${icons.get("delete")})`, backgroundSize: "1.5rem" },
					onClick: ctx.eventHandler("action-delete", () => tabs.currentOverlay.set([this.deleteItem(shelf.name, "shelf", shelf.uuid)])),
				});

				const header = this.header("Vault", "Create, edit, and view your personal curated list", [
					tray.flex(
						[
							this.backButton(),
							tray.tooltip(settings, { text: "Settings" }), //
							tray.tooltip(deleteShelf, { text: "Delete" }),
						],
						{
							className: "items-center",
						}
					),
				]);

				const search = tray.input({
					placeholder: `Search ${shelf.name}...`,
					value: state.vaultSearch.get(),
					style: {
						borderRadius: "0.5rem",
						paddingInlineStart: "2.5rem",
						backgroundImage: `url(${icons.get("search")})`,
						backgroundSize: "1rem",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "calc(0% + 0.75rem) center",
					},
					onChange: ctx.eventHandler("search-query", (e) => state.shelfSearch.set(String(e.value))),
				});

				const entries = shelf.entries
					.filter((x) =>
						state.shelfSearch.get().length ? x.title.synonyms.join(" ").toLowerCase().includes(state.shelfSearch.get().toLowerCase()) : true
					)
					.sort(entrySort)
					.map((e) => this.formatMediaItem(e, shelf.type, shelf.uuid));

				const body = entries.length
					? tray.div(entries, {
							style: { height: "25rem", overflowY: "scroll", gap: "0.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(8rem, 1fr))" },
					  })
					: tray.div([this.noEntries()], { style: { height: "25rem " } });

				return tray.stack([this.overlay(), header, search, body], { style: { padding: "0.5rem" } });
			},
			[Tabs.AddToShelf]() {
				const media = state.currentMedia.get();
				if (!media) {
					ctx.toast.error("Unable to retrieve media");
					tray.close();
					return tabs.current.set(Tabs.Vault);
				}

				const create = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent",
					style: { backgroundImage: `url(${icons.get("plus")})`, backgroundSize: "1.5rem" },
					onClick: ctx.eventHandler("goto:create", () => tabs.currentOverlay.set([this.createShelf()])),
				});

				const header = this.header("Vault", "Create, edit, and view your personal curated list", [
					tray.flex(
						[
							tray.tooltip(create, { text: "Create Shelf" }), //
						],
						{
							className: "items-center",
						}
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
								backgroundImage: `url(${icons.get("search")})`,
								backgroundSize: "1rem",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "calc(0% + 0.75rem) center",
							},
							onChange: ctx.eventHandler("search-query", (e) => state.vaultSearch.set(String(e.value))),
						}),
					],
					{ gap: 0 }
				);

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

		const btnstyle = {
			backgroundImage: `url(${icons.get("addShelf")})`,
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
