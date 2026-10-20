/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./vault.d.ts" />

//@ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Vault/icon.png";

		const icons = (() => {
			const htms = {
				addShelf: /*html*/ ` <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14 7V13M11 10H17M14 21C11 21 8 21 5 21C3.89543 21 3.00001 20.1069 3.00001 19.0023C3 16.2888 3 11.5934 3 10M9 17H19C20.1046 17 21 16.1046 21 15V5C21 3.89543 20.1046 3 19 3H9C7.89543 3 7 3.89543 7 5V15C7 16.1046 7.89543 17 9 17Z" stroke="#cacaca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
				back: /*html*/ ` <svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 256 256" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"> <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a8 8 0 0 1-8 8h-60.69l18.35 18.34a8 8 0 0 1-11.32 11.32l-32-32a8 8 0 0 1 0-11.32l32-32a8 8 0 0 1 11.32 11.32L107.31 120H168a8 8 0 0 1 8 8" stroke="none"/> </svg>`,
				calendar: /*html*/ `<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7v2H5a2 2 0 0 0-2 2zm16 14H5V8h14z"></path></svg>	`,
				check: /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M20 6 9 17l-5-5"/> </svg>`,
				chevronDown:  /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#cacaca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="m6 9 6 6 6-6"/> </svg>`,
				close: /*html*/ ` <svg stroke="#d93e3e" fill="#d93e3e" stroke-width="0" viewBox="0 0 16 16" class="text-[0.95rem]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"></path> </svg>`,
				copy: /*html*/ ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>`,
				delete: /*html*/ ` <svg stroke="#fca5a5" fill="#fca5a5" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"> <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path> <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path> </svg>`,
				grid: /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#cacaca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="3" y="3" width="7" height="7" rx="1"/> <rect x="14" y="3" width="7" height="7" rx="1"/> <rect x="3" y="14" width="7" height="7" rx="1"/> <rect x="14" y="14" width="7" height="7" rx="1"/> </svg>`,
				import: /*html*/ ` <svg xmlns="http://www.w3.org/2000/svg" fill="#cacaca" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#cacaca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13h-6V7"/> <path fill="none" stroke="#cacaca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 3 11 13m10 0v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7"/> </svg>`,
				list: /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#cacaca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/> </svg>`,
				plus: /*html*/ ` <svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"> <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path> </svg>`,
				search: /*html*/ ` <svg xmlns="http://www.w3.org/2000/svg" fill="#5a5a5a" height="512" width="512" viewBox="0 0 512 512"> <path d="M495 466.2 377.2 348.4c29.2-35.6 46.8-81.2 46.8-130.9C424 103.5 331.5 11 217.5 11 103.4 11 11 103.5 11 217.5S103.4 424 217.5 424c49.7 0 95.2-17.5 130.8-46.7L466.1 495c8 8 20.9 8 28.9 0 8-7.9 8-20.9 0-28.8m-277.5-83.3C126.2 382.9 52 308.7 52 217.5S126.2 52 217.5 52C308.7 52 383 126.3 383 217.5s-74.3 165.4-165.5 165.4"/> </svg>`,
				settings: /*html*/ ` <svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"> <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/> <circle cx="12" cy="12" r="3"/> </svg>`,
				sort: /*html*/ ` <svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"> <path d="M3 6h18M7 12h10m-7 6h4"/> </svg>`,
				vault: /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#cacaca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="3" y="4" width="18" height="16" rx="2"/> <circle cx="12" cy="12" r="3"/> <path d="M12 9v6M9 12h6"/> </svg>`,
			};
			return {
				get: function (name: keyof typeof htms, options?: { raw?: boolean; stroke?: string; fill?: string }) {
					let htm = htms[name];
					// Apply color modifications if provided
					if (!!options?.stroke) htm = htm.replace(/stroke="[^"]*"/g, `stroke="${options.stroke}"`);
					if (!!options?.fill) htm = htm.replace(/fill="[^"]*"/g, `fill="${options.fill}"`);

					// Return raw HTML if requested
					if (options?.raw === true) return htm;

					// Return as base64 data URL
					return `data:image/svg+xml;base64,${Buffer.from(htm.trim(), "utf-8").toString("base64")}`;
				},
			};
		})(); // prettier-ignore

		const utils = (() => {
			const longCard = (tree: $ui.Tray | $ui.Modal, o: {
				coverImage?: string;
				coverLargeText?: string;
				coverSmallText?: string;
				coverSmallTextColor?: string;
				title: string;
				description?: string;
				disabled?: boolean;
				tags?: {
					icon?: string;
					text?: string;
					textColor?: string;
				}[];
				onClick?: string;
			}) => tree.div([
				tree.div([
					!o.coverImage ? [] : tree.img({ 
						src: o.coverImage ?? "",
						className: "object-cover object-center absolute w-full h-full group-hover:blur-0 transition-opacity opacity-25 group-hover:opacity-60 z-[0] select-none pointer-events-none"
					}),
					tree.div([], { className: "transition-colors absolute w-full h-full -right-2 bg-gradient-to-l from-[--background] via-[--background] via-30% hover:from-[var(--hover-from-background-color)] to-transparent z-[1] select-none pointer-events-none" })
				], { className: "absolute left-0 top-0 w-full h-full max-w-[200px] overflow-hidden" }),
				tree.flex([
					tree.div([
						!o.coverLargeText ? [] : tree.p([
							tree.span(o.coverLargeText, { className: "truncate" }),
						], { className: "z-[1] font-medium truncate flex items-center max-w-full w-fit px-0 py-1 rounded-[--radius-md] text-[.9rem] border-transparent bg-transparent" }),
						!o.coverSmallText ? [] : tree.span(o.coverSmallText, {
							className: "flex-none w-fit overflow-hidden justify-center items-center gap-2 group/badge text-indigo border border-opacity-40 dark:text-indigo-300 dark:bg-opacity-10 h-6 py-1 font-semibold tracking-wide rounded-[--radius-md] border-transparent bg-gray-900/50 px-1 text-md",
							...(o.coverSmallTextColor && { style: { color: o.coverSmallTextColor }}),
						}),
					], { className: "h-24 w-24 lg:w-28 flex-none rounded-[--radius-md] object-cover object-center relative overflow-hidden flex flex-col items-center justify-center text-xs" }),
					tree.div([
						tree.span(o.title, { className: "font-normal text-[1rem] transition line-clamp-1 tracking-wide flex gap-2 items-center max-w-[35rem] lg:max-w-[35rem] 3xl:max-w-[35rem]" }),
						!o.description ? [] : tree.text(o.description, { className: "text-[.8rem] tracking-wide group-hover:opacity-60 line-clamp-2 break-all opacity-30" }),
						tree.flex([
							tree.flex([
								!o.tags?.length ? [] : o.tags.map(t => tree.div([
									!t.icon ? [] : tree.div([], {
										className: "w-4 h-4 inline-flex self-center flex-shrink-0 bg-center bg-no-repeat bg-cover",
										style: { backgroundImage: `url(${t.icon})` }
									}),
									!t.text ? [] : tree.span(t.text, {
										className: "text-gray-300 text-xs font-semibold flex items-center gap-1",
										...(t.textColor && { style: { color: t.textColor }}),
									}),
								], { className: "inline-flex flex-none w-fit overflow-hidden justify-center items-center group/badge text-gray-800 border border-opacity-40 dark:text-gray-300 dark:bg-opacity-10 h-6 text-xs tracking-wide rounded-[--radius-md] border-transparent bg-transparent px-0 gap-1 font-normal opacity-80" })),
							], { className: "flex-wrap gap-2 items-center lg:absolute bottom-0 left-0 right-0" })
						], { className: "flex-col gap-2" }),
					], { className: "relative overflow-hidden space-y-1 w-full" }),
				],{ className: "gap-4 relative z-[2] cursor-pointer" })
			], {
				onClick: o.onClick,
				className: `border p-3 pr-12 rounded-lg relative transition group overflow-hidden max-w-full bg-[--background] hover:border-gray-500 ${o.disabled == true ? "pointer-events-none opacity-50" : ""}`.trim()
			}); // prettier-ignore

			const generateRandomUUID = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
				const r = (Math.random() * 16) | 0;
				const v = c === "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});

			function formatTimestamp(t: number) {
				let d = new Date(t),
					n = new Date().setHours(0, 0, 0, 0),
					c = new Date(d).setHours(0, 0, 0, 0),
					p = (h: number, m: string) => {
						let a = h >= 12 ? "PM" : "AM";
						return `${h % 12 || 12}:${m} ${a}`;
					},
					time = p(d.getHours(), d.getMinutes().toString().padStart(2, "0"));
				return c === n
					? `Today at ${time}`
					: c === n - 864e5
						? `Yesterday at ${time}`
						: `${d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })} ${time}`;
			};

			const isCustom = (mediaId?: number) => (mediaId ?? 0) >= 2 ** 31;

			return { generateRandomUUID, formatTimestamp, isCustom, components: { longCard } };
		})(); // prettier-ignore

		const vault = (() => {
			const id = "fbefd050-7a20-469f-ade9-12ea803d7149";
			let cache = $storage.get<Record<string, Shelf>>(id) ?? {}, lastCached = Date.now();
			const ttl = 60_000, currentMedia = ctx.state<$app.AL_BaseAnime | $app.AL_BaseManga | null>(null);
			const query = ctx.state<string>("");
			
			const create = (() => {
				const name = ctx.fieldRef<string>("");
				const type = ctx.fieldRef<$app.AL_MediaType | "">("");
				const tag = ctx.fieldRef<string>("");
				const reset = () => [name, type, tag].forEach((e) => e.setValue(""))
				return { name, type, tag, reset };
			})();

			const filter = (c: Record<string, Shelf>, q?: string) => {
				const needle = q?.trim().toLowerCase();
				if (!needle) return c;
				return Object.fromEntries(Object.entries(c).filter(([, shelf]) => shelf.name.toLowerCase().includes(needle)));
			};

			const storage = (q?: string): Record<string, Shelf> => {
				if (!cache || (lastCached + ttl) <= Date.now()) {
					cache = $storage.get<Record<string, Shelf>>(id) ?? {};
					lastCached = Date.now();
				}
				return filter({ ...cache }, q);
			};

			const get = (uuid: string) => ({ ...storage() })[uuid];

			const set = (data: Record<string, Shelf>) => {
				$storage.set(id, data);
				cache = data;
				lastCached = Date.now();
			};

			const createShelf = (name: string, type: $app.AL_MediaType, tag?: string) => {
				const uuid = utils.generateRandomUUID();
				const store = storage();
				const date = new Date().toISOString();
				store[uuid] = { uuid, name, tag, type, entries: [], createdAt: date, lastUpdateAt: date };
				set(store);
				return { ...store[uuid] } as Shelf;
			}

			const editShelf = (uuid: string, edit: Omit<Partial<Shelf>, "uuid" | "type" | "entries" | "createdAt" | "lastUpdateAt" >) => {
				const store = storage();
				const shelf = store[uuid];
				if (!shelf) throw new Error(`Could not find shelf with uuid ${uuid}`);
				if (!edit.name) edit.name = shelf.name;

				store[uuid] = { ...shelf, ...edit, lastUpdateAt: new Date().toISOString() };
				set(store);
				return shelf;
			}

			const deleteShelf = (uuid: string) => {
				const store = storage();
				const deleted = delete store[uuid];
				set(store);
				return deleted;
			}

			const addToShelf = (uuid: string, media: $app.AL_BaseAnime | $app.AL_BaseManga) => {
				const store = storage();
				const date = new Date().toISOString();
				const shelf = store[uuid];
				if (!shelf) throw new Error(`Could not find shelf with uuid ${uuid}`);
				if (shelf.type !== media.type) throw new Error(`Type mismatch: Cannot upsert media with type ${media.type} to shelf with type ${shelf.type}!`);

				const data: Shelf["entries"][number] = {
					id: media.id,
					title: {
						userPreferred: media.title?.userPreferred!,
						synonyms: [...(media.synonyms ?? []), ...Object.values(media.title ?? {}).filter(Boolean)],
					},
					coverImage: media.coverImage?.large ?? "",
					season: media.season ?? null,
					seasonYear: "seasonYear" in media ? (media.seasonYear ?? null) : null,
					addedAt: date,
				};

				shelf.entries = [...new Map(shelf.entries.map((e) => [e.id, e])).set(data.id, data).values()];
				store[uuid] = { ...shelf, lastUpdateAt: date };
				set(store);
				return shelf;
			}

			const removeFromShelf = (uuid: string, mediaId: number) => {
				const store = storage();
				const shelf = store[uuid];
				if (!shelf) throw new Error(`Could not find shelf with uuid ${uuid}`);

				shelf.entries = shelf.entries.filter((x) => x.id !== mediaId);
				store[uuid] = { ...shelf, lastUpdateAt: new Date().toISOString() };
				set(store);
			}

			const data = ctx.state<Record<string, Shelf>>(storage());
			return { data, query, create, storage, get, set, createShelf, editShelf, deleteShelf, addToShelf, removeFromShelf, currentMedia }
		})(); // prettier-ignore

		const modal = ctx.newModal({
			title: "Add to shelf",
			description: "Select a shelf below to add this entry",
			className: "max-w-3xl",
		});

		modal.render(() => {
			const media = vault.currentMedia.get();
			if (!media) throw new Error("Missing media!");
			const storage = vault.storage(vault.query.get());

			return modal.div([
				modal.input("", {
					className: "flex-1",
					placeholder: "Search shelves",
					value: vault.query.get(),
					onChange: ctx.eventHandler(`modal:search`, ({ value }: { value: string}) => vault.query.set(value)),
				}),
				modal.div([...Object.entries(storage).filter(([, shelf]) => shelf.type === media.type).sort(([, a] ,[, b]) => Date.parse(b.lastUpdateAt) - Date.parse(a.lastUpdateAt)).map(([uuid, shelf]) => utils.components.longCard(modal, {
					title: shelf.name,
					description: `Add ${media.title?.userPreferred}`,
					coverLargeText: shelf.type,
					coverImage: shelf.entries[Math.floor(Math.random() * shelf.entries.length)]?.coverImage,
					coverSmallText: shelf.tag,
					disabled: !!shelf.entries.find(x => x.id === media.id),
					tags: [
						{ text: `${shelf.entries.length} entries` },
						{ icon: icons.get("calendar"), text: utils.formatTimestamp(Date.parse(shelf.lastUpdateAt)) },
					],
					onClick: ctx.eventHandler(`sel:${uuid}`, () => {
						vault.addToShelf(uuid, media);
						vault.data.set({ ...vault.storage() });
						modal.close();
						ctx.toast.success(`Added ${media.title?.userPreferred} to ${shelf.name}`);
					}),
				})),
				modal.flex([
					modal.span("No Shelves", { className: "text-2xl font-semibold text-[--muted] my-10" }),
				],{
					...(Object.values(storage).filter(shelf => shelf.type === media.type).length && { style: { display: "none" }}),
					className: "justify-center items-center"
				})], { className: "space-y-2 overflow-scroll", style: { maxHeight: "60vh" }}),
				modal.div([], { className: "border-b", style: { marginTop: "1rem", marginBottom: "1rem" } }),
				modal.div([
					modal.text("Create New Shelf", { className: "font-semibold text-green-300" }),
					modal.flex([
						modal.div([
							modal.input("Shelf Name", {
								fieldRef: vault.create.name,
								value: vault.create.name.current,
							}),
							modal.select("Type", { value: media.type, disabled: true, options: ["Anime", "Manga"].map(x => ({ label: x, value: x.toUpperCase() })) }),
							modal.input("Shelf Tag", {
								fieldRef: vault.create.tag,
								value: vault.create.tag.current,
							}),
						], { className: "grid grid-cols-3 gap-2 w-full" }),
						modal.tooltip(modal.button("\u200b", {
							intent: "success",
							className: "w-10 h-10 bg-cover bg-center bg-no-repeat",
							style: { backgroundImage: `url(${icons.get("addShelf")})`, backgroundSize: "1.6rem" },
							onClick: ctx.eventHandler("add-shelf", () => {
								const name = vault.create.name.current;
								const tag = vault.create.tag.current;
								const type = media.type;
								if (!type) return ctx.toast.error(`Unable to create shelf: Unknown media type`);
								if (!name.trim()) return ctx.toast.error(`Shelf Name must not be empty!`);

								vault.createShelf(name, type, tag);
								vault.create.reset();
								vault.data.set({ ...vault.storage() });
								modal.update();
								ctx.toast.success(`Successfully created Shelf | name="${name}" type="${type}" tag="${tag ?? "unset"}"`)
							}),
						}), { text: "Add Shelf" }),
					], { className: "justify-between items-end" })
				], { className: "border rounded-lg p-2"}),
				
			], { className: "space-y-2 p-4 border rounded-lg" }); // prettier-ignore
		});

		/**
		 * System for assigning media to btn clicks
		 */
		(() => {
			const animePB = ctx.action.newAnimePageButton({ label: "\u200b" });
			const mangaPB = ctx.action.newMangaPageButton({ label: "\u200b" });
			const mediaCM = ctx.action.newMediaCardContextMenuItem({
				label: "Add to Shelf",
				for: "both",
				style: {
					backgroundImage: `url(${icons.get("addShelf")})`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "1.2rem",
					backgroundPosition: "0.45em center",
					textIndent: "1.8em",
				},
			});

			mediaCM.mount();
			mediaCM.onClick(({ media }) => {
				vault.currentMedia.set(media);
				modal.open();
			});

			for (const btn of [animePB, mangaPB]) {
				btn.setStyle({
					backgroundImage: `url(${icons.get("addShelf")})`,
					backgroundRepeat: "no-repeat",
					backgroundPosition: " center",
					backgroundSize: "1.5rem",
					width: "40px",
				});

				btn.setTooltipText("Add to Shelf");

				btn.onClick(({ media }) => {
					vault.currentMedia.set(media);
					modal.open();
				});

				btn.mount();
			}

			ctx.screen.onNavigate(({ pathname, searchParams }) => {
				if (pathname === "/entry" || pathname === "/entry/manga") {
					const mediaId = Number(searchParams.id);
					if (!mediaId) return;
					(pathname === "/entry" ? animePB : mangaPB)[utils.isCustom(mediaId) ? "unmount" : "mount"]();
				}
			});
		})();

		const webview = ctx.newWebview({
			slot: "screen",
			width: "100%",
			height: "100vh",
			sidebar: { label: "Vault", icon: icons.get("addShelf", { raw: true, stroke: "currentColor" }) },
		});

		(() => {
			webview.channel.on("vault:navigateEntry", ({ id, type }: { id: number; type: $app.AL_MediaType }) => {
				const route = type === "ANIME" ? "/entry" : "/entry/manga";
				ctx.screen.navigateTo(route, { id: id.toString() });
			});

			webview.channel.on("vault:rename", ({ uuid, name }: { uuid: string; name: string }) => {
				const trimmed = (name ?? "").trim();
				if (!uuid || !trimmed) return;
				try {
					vault.editShelf(uuid, { name: trimmed });
					vault.data.set({ ...vault.storage() });
				} catch (e) {
					ctx.toast.error(`Failed to rename shelf: ${(e as Error).message}`);
				}
			});

			webview.channel.on("vault:setTag", ({ uuid, tag }: { uuid: string; tag: string }) => {
				if (!uuid) return;
				const trimmed = (tag ?? "").trim();
				try {
					vault.editShelf(uuid, trimmed ? { tag: trimmed } : { tag: undefined });
					vault.data.set({ ...vault.storage() });
				} catch (e) {
					ctx.toast.error(`Failed to update tag: ${(e as Error).message}`);
				}
			});

			webview.channel.on("vault:deleteEntry", ({ uuid, mediaId }: { uuid: string; mediaId: number }) => {
				if (!uuid || typeof mediaId !== "number") return;
				try {
					vault.removeFromShelf(uuid, mediaId);
					vault.data.set({ ...vault.storage() });
				} catch (e) {
					ctx.toast.error(`Failed to remove entry: ${(e as Error).message}`);
				}
			});

			webview.channel.on("vault:addEntry", (media: $app.AL_BaseAnime | $app.AL_BaseManga) => {
				vault.currentMedia.set(media);
				modal.open();
			});

			webview.channel.on("vault:deleteShelf", ({ uuid }: { uuid: string }) => {
				if (!uuid) return;
				try {
					vault.deleteShelf(uuid);
					vault.data.set({ ...vault.storage() });
				} catch (e) {
					ctx.toast.error(`Failed to delete shelf: ${(e as Error).message}`);
				}
			});

			webview.channel.on("vault:shelfEntryImport", ({ uuid, importStr }: { uuid: string; importStr: string }) => {
				try {
					const data: VaultItem = JSON.parse(Buffer.from(importStr, "base64").toString("utf8"));
					if (!data || !data.name || !data.type || !["ANIME", "MANGA"].includes(data.type) || !data.entries || !data.entries.length)
						throw new Error(`Invalid import string!`);

					for (const entry of data.entries) {
						if (!entry.id || !entry.title?.userPreferred) throw new Error(`Invalid entry found!`);
					}

					const shelf = vault.get(uuid);
					if (!shelf) throw new Error(`Shelf with current uuid could not be found!`);

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
					vault.data.set({ ...vault.storage() });
				} catch (error) {
					ctx.toast.error(`Import Error: ${(error as Error).message}`);
				}
			});

			webview.channel.on("vault:shelfExportCopyStr", (uuid) => {
				const shelf = vault.get(uuid);
				if (!shelf) return ctx.toast.error(`Unable to get shelf with the provided uuid`);
				const { uuid: _uuid, createdAt, lastUpdateAt, tag, ...rest } = shelf;
				const importstr = Buffer.from(JSON.stringify(rest), "utf8").toString("base64");
				try {
					ctx.dom.clipboard.write(importstr);
					ctx.toast.success("Copied shelf import string to clipboard!");
				} catch (error) {
					ctx.toast.error(`Unable to copy import string: ${(error as Error).message}`);
				}
			});

			webview.channel.on("vault:createShelf", ({ name, type, tag }: { name: string; type: $app.AL_MediaType; tag?: string }) => {
				const trimmedName = (name ?? "").trim();
				const trimmedTag = (tag ?? "").trim();
				if (!trimmedName) return ctx.toast.error("Shelf name must not be empty.");
				if (type !== "ANIME" && type !== "MANGA") return ctx.toast.error("Invalid media type.");

				try {
					vault.createShelf(trimmedName, type, trimmedTag || undefined);
					vault.data.set({ ...vault.storage() });
					ctx.toast.success(`Created shelf "${trimmedName}"`);
				} catch (e) {
					ctx.toast.error(`Failed to create shelf: ${(e as Error).message}`);
				}
			});

			webview.channel.sync("vaultData", vault.data);
		})();

		webview.setContent(
			() => /*html*/ `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<style>
						:root {
							--bg-body: #070707;
							--bg-surface: #101010;
							--bg-input: #0b0b0b;
							--bg-input-hover: #131313;
							--bg-hover: #101010;
							--bg-active: #141414;
							--bg-popover: #0b0b0b;
							--bg-badge: #141414;
							--bg-cover: #0b0b0b;
							--bg-brand: #6152dfb3;
							--bg-brand-hover: #7a6cf0b3;

							--text-primary: #d1d1d1;
							--text-heading: #e1e1e1;
							--text-secondary: #cacaca;
							--text-muted: #8f8f8f;
							--text-faint: #5a5a5a;
							--text-disabled: #484848;
							--tag-color: #a5b4fc;

							--border-default: #2a2a2a;
							--border-hover: #2a2a2a;
							--border-focus: #484848;
							--border-active: #484848;

							--accent: #312887;
							--accent-soft: #d4d0ff;

							--scrollbar-thumb: #282828;
							--scrollbar-track: #0b0b0b;

							--shadow-surface: 0 8px 20px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3);
							--shadow-card: 0 4px 10px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.4);
							--shadow-popover: 0 /*0 12px 28px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0, 0, 0, 0.4)*/;

							--radius-sidebar: 1.25rem;
							--radius-input: 0.75rem;
							--radius-pill: 0.75rem;
							--radius-item: 0.25rem;
							--radius-popover: 0.75rem;
							--radius-option: 0.4rem;
							--radius-cover: 12px;
							--radius-badge: 20px;

							--sidebar-width: 280px;
						}

						* { margin: 0; padding: 0; box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
						*::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
						html { color-scheme: dark; overflow-x: hidden; overflow-y: auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
						body { background: var(--bg-body); color: var(--text-primary); display: flex; justify-content: center; padding: 2rem 1.5rem; }
						.vault-container { width: 100%; min-width: 0; }
						.page-header { margin-bottom: 2rem; }
						.page-header h1 { font-size: 2.6rem; font-weight: 600; letter-spacing: -0.02em; color: var(--text-heading); display: flex; align-items: center; gap: 0.5rem; }
						.page-header h1 i { color: var(--accent); font-size: 2.2rem; }
						.page-description { color: var(--text-muted); font-size: 1.05rem; margin-top: 0.3rem; margin-left: 0.2rem; font-weight: 400; max-width: 70%; line-height: 1.5; }
						.layout { display: flex; gap: 2rem; align-items: flex-start; min-width: 0; }
						.sidebar { flex: 0 0 var(--sidebar-width); flex-shrink: 0; width: var(--sidebar-width); background: var(--bg-surface); border-radius: var(--radius-sidebar); box-shadow: var(--shadow-surface); padding: 1.5rem 0.75rem 1.5rem 0.75rem; border: 1px solid var(--border-default); position: sticky; top: 2rem; align-self: flex-start; min-width: 0; }
						.sidebar-header { padding: 0 0.75rem 0.75rem 0.75rem; display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-weight: 500; border-bottom: 1px solid var(--border-default); margin-bottom: 0.75rem; }
						.sidebar-header i { font-size: 1.1rem; color: var(--accent); }
						.sidebar-header .shelf-create-btn { margin-left: auto; display: inline-flex; align-items: center; justify-content: center; width: 1.6rem; height: 1.6rem; border: 1px solid var(--border-default); border-radius: 0.4rem; background: transparent; color: var(--text-muted); cursor: pointer; padding: 0; flex-shrink: 0; transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease; font-family: inherit; } 
						.sidebar-header .shelf-create-btn:hover { background: var(--bg-brand); border-color: var(--bg-brand); color: var(--accent-soft); } 
						.sidebar-header .shelf-create-btn:focus-visible { outline: none; border-color: var(--bg-brand); } 
						.sidebar-header .shelf-create-btn .icon-plus svg { width: 0.9rem; height: 0.9rem; }
						.shelf-search { padding: 0 0.75rem; margin-bottom: 0.75rem; }
						.search-wrapper { display: flex; align-items: center; background: var(--bg-input); border: 1px solid var(--border-default); border-radius: var(--radius-pill); padding: 0.5rem 1rem; transition: background 0.15s ease, border-color 0.15s ease; min-width: 0; }
						.search-wrapper:hover { background: var(--bg-input-hover); border-color: var(--border-default); }
						.search-wrapper:focus-within { background: var(--bg-input); border-color: var(--border-focus); box-shadow: none; outline: none; }
						.search-wrapper i { color: var(--text-faint); font-size: 0.9rem; margin-right: 8px; flex-shrink: 0; }
						.search-wrapper input { border: none; background: transparent; outline: none; box-shadow: none; -webkit-appearance: none; appearance: none; font-size: 0.9rem; width: 100%; color: var(--text-primary); min-width: 0; }
						.search-wrapper input:focus, .search-wrapper input:focus-visible { outline: none; box-shadow: none; }
						.search-wrapper input::placeholder { color: var(--text-faint); }
						.shelf-sort { padding: 0 0.75rem; margin-bottom: 0.75rem; }
						.sort-dropdown { position: relative; width: 100%; }
						.sort-trigger { display: flex; align-items: stretch; width: 100%; background: var(--bg-input); border: 1px solid var(--border-default); border-radius: var(--radius-pill); padding: 0; font-size: 0.9rem; color: var(--text-primary); cursor: pointer; transition: border-color 0.15s ease; text-align: left; outline: none; box-shadow: none; font-family: inherit; min-width: 0; overflow: hidden; }
						.sort-trigger .trigger-text { display: flex; align-items: center; flex: 1; min-width: 0; padding: 0.5rem 1rem 0.5rem 0.5rem; background: transparent; transition: background 0.15s ease; }
						.sort-trigger:hover .trigger-text { background: var(--bg-input-hover); }
						.sort-trigger:focus-visible, .sort-dropdown.open .sort-trigger { background: var(--bg-input); border-color: var(--border-focus); box-shadow: none; outline: none; }
						.sort-trigger:focus-visible .trigger-text, .sort-dropdown.open .sort-trigger .trigger-text { background: transparent; }
						.sort-trigger .trigger-icon { display: flex; align-items: center; justify-content: center; padding: 0 0.5rem 0 1rem; color: var(--text-faint); font-size: 0.9rem; flex-shrink: 0; background: transparent; transition: none; }
						.sort-trigger .trigger-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
						.sort-trigger .trigger-caret { color: var(--text-faint); font-size: 0.65rem; margin-left: 8px; flex-shrink: 0; transition: transform 0.15s ease; }
						.sort-dropdown.open .sort-trigger .trigger-caret { transform: rotate(180deg); }
						.sort-popover { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: var(--bg-popover); border: 1px solid var(--border-default); border-radius: var(--radius-popover); padding: 0.5rem; margin-top: 2px; box-shadow: var(--shadow-popover); z-index: 50; max-height: 320px; overflow-y: auto; display: none; scrollbar-width: thin; scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track); }
						.sort-dropdown.open .sort-popover { display: block; }
						.sort-popover::-webkit-scrollbar { width: 5px; }
						.sort-popover::-webkit-scrollbar-track { background: var(--scrollbar-track); border-radius: 10px; }
						.sort-popover::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 10px; }
						.sort-option { display: flex; align-items: center; gap: 8px; width: 100%; background: transparent; border: none; border-radius: var(--radius-option); padding: 0.5rem 0.6rem; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer; text-align: left; font-family: inherit; transition: background 0.12s ease, color 0.12s ease; outline: none; box-shadow: none; }
						.sort-option:focus-visible { outline: none; box-shadow: none; background: var(--bg-hover); }
						.sort-option:hover { background: var(--bg-hover); color: var(--text-heading); }
						.sort-option .check { width: 1rem; font-size: 0.7rem; color: var(--accent-soft); flex-shrink: 0; visibility: hidden; }
						.sort-option[aria-selected="true"] { background: var(--bg-active); color: var(--text-heading); font-weight: 500; }
						.sort-option[aria-selected="true"] .check { visibility: visible; }
						.vault-list { list-style: none; display: flex; flex-direction: column; gap: 2px; min-height: 100px; max-height: 55vh; overflow-y: auto; padding: 0 0.75rem; scrollbar-width: thin; scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track); }
						.vault-list::-webkit-scrollbar { width: 5px; }
						.vault-list::-webkit-scrollbar-track { background: var(--scrollbar-track); border-radius: 10px; }
						.vault-list::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 10px; }
						.vault-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0.9rem; border-radius: var(--radius-item); font-size: 0.95rem; transition: all 0.15s ease; cursor: pointer; background: transparent; border-left: 3px solid transparent; color: var(--text-secondary); min-width: 0; }
						.vault-item:hover { background: var(--bg-hover); border-left-color: var(--border-active); }
						.vault-item.active { background: var(--bg-active); border-left-color: var(--accent); font-weight: 500; color: var(--text-heading); }
						.vault-item .item-info { display: flex; flex-direction: column; min-width: 0; flex-shrink: 1; overflow: hidden; }
						.vault-item .item-name { max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
						.vault-item .item-type { font-size: 0.65rem; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-badge); background: var(--bg-badge); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.02em; flex-shrink: 0; white-space: nowrap; }
						.vault-item .item-count { font-size: 0.8rem; color: var(--text-muted); background: var(--bg-badge); padding: 2px 8px; border-radius: var(--radius-badge); margin-left: 8px; font-weight: 500; flex-shrink: 0; white-space: nowrap; }
						.vault-item.active .item-type, .vault-item.active .item-count { background: var(--bg-brand); color: var(--accent-soft); }
						.item-tag { color: var(--tag-color); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.6rem; }
						.item-tag-row { display: flex; align-items: center; gap: 4px; min-width: 0; font-size: 0.72rem; line-height: 1.2; }
						.media-grid { flex: 1 1 0; min-width: 0; width: 100%; background: var(--bg-surface); border-radius: var(--radius-sidebar); padding: 1.75rem 1.75rem 2rem 1.75rem; box-shadow: var(--shadow-surface); border: 1px solid var(--border-default); display: flex; flex-direction: column; }
						.grid-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-default); gap: 1rem; flex-wrap: wrap; min-width: 0; }
						.grid-header h2 { font-size: 1.3rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1 1 auto; }
						.grid-header h2 span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
						.grid-header h2 i { color: var(--accent); font-size: 1.2rem; flex-shrink: 0; }
						.grid-header-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1 1 auto; }
						.grid-title-row { display: flex; align-items: center; gap: 10px; min-width: 0; }
						.grid-title-row > i { color: var(--accent); font-size: 1.2rem; flex-shrink: 0; }
						.grid-shelf-name { font-size: 1.3rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; cursor: text; border-radius: 4px; padding: 2px 4px; margin: -2px -4px; transition: background 0.12s ease; }
						.grid-shelf-name:hover { background: rgba(255,255,255,0.04); }
						.grid-delete-btn { display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border: 1px solid var(--border-default); border-radius: 0.4rem; background: transparent; color: var(--text-muted); cursor: pointer; padding: 0; flex-shrink: 0; transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease; font-family: inherit; } 
						.grid-delete-btn:hover { background: var(--bg-input-hover); border-color: #8a2e2e; color: #e48181; } 
						.grid-delete-btn:focus-visible { outline: none; border-color: #8a2e2e; } 
						.grid-delete-btn .icon-trash svg { width: 1.2rem; height: 1.2rem; }
						.grid-add-btn { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border: 1px solid var(--border-default); border-radius: 0.4rem; background: transparent; color: var(--text-muted); cursor: pointer; padding: 0; flex-shrink: 0; transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease; font-family: inherit; } 
						.grid-add-btn:hover { background: var(--bg-brand); border-color: var(--bg-brand); color: var(--accent-soft); } 
						.grid-add-btn:focus-visible { outline: none; border-color: var(--bg-brand); } 
						.grid-add-btn .icon-plus svg { width: 1.2rem; height: 1.2rem; }
						#gridShelfTagContainer { margin-bottom: 0.25rem }
						.grid-shelf-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; line-height: 1.2; color: var(--tag-color); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; width: fit-content; cursor: text; border-radius: 4px; padding: 2px 4px; margin: -2px -4px; transition: background 0.12s ease; }
						.grid-shelf-tag:hover { background: rgba(125,211,252,0.1); }
						.grid-shelf-tag.empty { color: var(--text-faint); font-weight: 400; }
						.grid-shelf-tag.empty i { font-size: 0.7rem; }
						.grid-shelf-tag.empty:hover { color: var(--text-muted); background: rgba(255,255,255,0.04); }
						.grid-shelf-dates { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 0.72rem; line-height: 1.2; color: var(--text-faint); margin-top: 2px; } 
						.grid-shelf-dates .date-item { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; } 
						.grid-shelf-dates .date-item .icon-calendar svg { width: 0.75rem; height: 0.75rem; vertical-align: -0.1em; } 
						.grid-shelf-dates .date-item .date-label { color: var(--text-faint); } 
						.grid-shelf-dates .date-item .date-value { color: var(--text-muted); }
						.grid-inline-input { background: var(--bg-input); border: 1px solid var(--border-focus); border-radius: 4px; outline: none; box-shadow: none; color: var(--text-primary); font-family: inherit; padding: 2px 6px; margin: -3px -7px; min-width: 80px; max-width: 400px; width: 100%; }
						.grid-inline-input.name-input { font-size: 1.3rem; font-weight: 600; }
						.grid-inline-input.tag-input { font-size: 0.8rem; color: var(--tag-color); font-weight: 500; max-width: 240px; padding: 1px 5px; margin: -2px -6px; }
						.entry-badge { background: var(--bg-badge); padding: 4px 12px; border-radius: 30px; font-size: 0.8rem; color: var(--text-muted); font-weight: 500; flex-shrink: 0; white-space: nowrap; }
						.grid-controls { display: flex; gap: 0.75rem; align-items: stretch; margin-bottom: 1.5rem; flex-wrap: wrap; min-width: 0; }
						.grid-search { flex: 1 1 220px; min-width: 0; }
						.grid-search .search-wrapper { border-radius: var(--radius-input); padding: 0.55rem 1rem; height: 100%; }
						.grid-sort { flex: 1 1 220px; min-width: 0; }
						.grid-sort .sort-trigger { border-radius: var(--radius-input); height: 100%; }
						.grid-sort .sort-trigger .trigger-icon { padding: 0 0.5rem 0 1rem; }
						.grid-sort .sort-trigger .trigger-text { padding: 0.55rem 1rem 0.55rem 0.5rem; }
						.grid-items { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1.5rem; min-width: 0; width: 100%; }
						.media-card { display: flex; flex-direction: column; gap: 10px; transition: transform 0.15s ease; min-width: 0; width: 100%; max-width: 100%; position: relative; cursor: pointer; }
						.media-card:hover { transform: translateY(-3px); }
						.cover-wrapper { aspect-ratio: 2 / 3; border-radius: var(--radius-cover); overflow: hidden; background: var(--bg-cover); box-shadow: var(--shadow-card); border: 1px solid var(--border-default); width: 100%; max-width: 100%; min-width: 0; position: relative; }
						.cover-wrapper img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.2s ease; max-width: 100%; }
						.media-card:hover .cover-wrapper img { transform: scale(1.05); }
						.card-actions { position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; opacity: 0; pointer-events: none; transition: opacity 0.15s ease; z-index: 2; }
						.media-card:hover .card-actions { opacity: 1; pointer-events: auto; }
						.card-action-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: 1px solid var(--border-default); border-radius: 0.4rem; background: rgba(11, 11, 11, 0.85); color: var(--text-primary); font-size: 0.75rem; cursor: pointer; transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease; backdrop-filter: blur(4px); }
						.card-action-btn:hover { background: var(--bg-input-hover); border-color: var(--border-focus); color: var(--text-heading); }
						.card-action-btn.delete:hover { color: #e48181; border-color: #8a2e2e; }
						.card-action-btn.add:hover { color: var(--accent); border-color: var(--accent); }
						.card-action-btn:focus-visible { outline: none; border-color: var(--border-focus); }
						.media-title { font-size: 0.9rem; font-weight: 500; line-height: 1.4; color: var(--text-primary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.6em; word-break: break-word; }
						.media-meta { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; min-width: 0; }
						.media-season { background: var(--bg-badge); padding: 2px 8px; border-radius: var(--radius-badge); font-weight: 500; font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.02em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
						.empty-state { grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-faint); font-size: 1rem; }
						.empty-state i { font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-disabled); display: block; }
						.icon-vault-img { width: 2.2rem; height: 2.2rem; object-fit: contain; display: inline-block; vertical-align: -0.25em; }
						.icon-list svg, .icon-grid svg, .icon-search svg, .icon-sort svg, .icon-chevronDown svg, .icon-check svg, .icon-trash svg, .icon-plus svg { width: 1em; height: 1em; display: inline-block; vertical-align: -0.125em;}
						#shelfCreateBtn i svg { vertical-align: unset; }
						.page-header h1 i, .sidebar-header i, .grid-header h2 i { font-size: 1.2rem; }
						.page-header h1 i { font-size: 2.2rem; }
						.confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 1000;}
						.confirm-box { background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-popover); box-shadow: var(--shadow-popover); padding: 1.25rem; max-width: 360px; width: calc(100% - 2rem); }
						.confirm-message { color: var(--text-primary); font-size: 0.95rem; margin-bottom: 1rem; line-height: 1.5; }
						.confirm-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
						.confirm-btn { background: var(--bg-input); border: 1px solid var(--border-default); color: var(--text-secondary); border-radius: var(--radius-input); padding: 0.45rem 0.9rem; font-size: 0.85rem; cursor: pointer; font-family: inherit; transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease; }
						.confirm-btn:hover { background: var(--bg-input-hover); border-color: var(--border-focus); color: var(--text-heading); }
						.confirm-btn.danger:hover { color: #e48181; border-color: #8a2e2e; }
						.confirm-title { color: var(--text-heading); font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; } 
						.confirm-input { width: 100%; background: var(--bg-input); border: 1px solid var(--border-focus); border-radius: var(--radius-input); padding: 0.55rem 0.75rem; font-size: 0.9rem; color: var(--text-primary); font-family: inherit; outline: none; box-shadow: none; margin-bottom: 1rem; } 
						.confirm-input:focus { border-color: var(--border-focus); } 
						.confirm-btn.primary { color: var(--text-heading); border: 1px solid transparent; background-color: var(--bg-brand); } 
						.confirm-btn.primary:hover { background-color: var(--bg-brand-hover); }
						.confirm-select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238f8f8f' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>"); background-repeat: no-repeat; background-position: right 0.6rem center; padding-right: 1.8rem; cursor: pointer; } 
						.confirm-select option { background: var(--bg-input); color: var(--text-primary); }
						@media (max-width: 1000px) { :root { --sidebar-width: 240px; } .vault-item .item-name { max-width: 110px; } }
						@media (max-width: 800px) { body { padding: 1rem; } .layout { flex-direction: column; gap: 1.5rem; } .sidebar { flex: none; width: 100%; position: static; } .page-description { max-width: 100%; } .vault-item .item-name { max-width: 100%; } .vault-list { max-height: 40vh; } .grid-controls { flex-direction: column; align-items: stretch; } .grid-search, .grid-sort { flex: 1 1 auto; width: 100%; } .media-grid { width: 100%; max-width: 100%; } .grid-items { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; } .sort-popover { position: fixed; left: 1rem; right: 1rem; width: auto; top: auto; max-height: 60vh; } .sort-dropdown.open .sort-popover { display: block; } }
						@media (max-width: 500px) { .page-header h1 { font-size: 2rem; } .page-header h1 i { font-size: 1.8rem; } .page-description { font-size: 0.95rem; } .media-grid { padding: 1.25rem 1rem 1.5rem 1rem; } .grid-header h2 { font-size: 1.1rem; } .grid-items { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem; } .media-card { min-width: 0; } .cover-wrapper { width: 100%; max-width: 100%; } }
					</style>
				</head>
				<body>
					<div class="vault-container">
						<header class="page-header">
							<h2><img class="icon-vault-img" src="${iconUrl}" alt="" /> Vault</h2>
							<p class="page-description"> Your personal media archive: browse, organize, and rediscover your anime &amp; manga collections.</p>
						</header>
						<div class="layout">
							<aside class="sidebar">
								<div class="sidebar-header">
									<i class="icon-list">${icons.get("list", { raw: true })}</i><span>Your Shelves</span>
									<button type="button" id="shelfCreateBtn" class="shelf-create-btn" title="Create shelf" aria-label="Create shelf">
										<i class="icon-plus" style="color: var(--muted)">${icons.get("plus", { raw: true, fill: "currentColor" })}</i>
									</button>
								</div>
								<div class="shelf-search">
									<div class="search-wrapper">
										<i class="icon-search">${icons.get("search", { raw: true })}</i>
										<input type="text" id="shelfSearchInput" placeholder="Search shelves..." aria-label="Search shelves" />
									</div>
								</div>
								<div class="shelf-sort">
									<div class="sort-dropdown" id="shelfSortDropdown">
										<button type="button" class="sort-trigger" aria-haspopup="listbox" aria-expanded="false">
											<span class="trigger-icon"><i class="icon-sort">${icons.get("sort", { raw: true })}</i></span>
											<span class="trigger-text">
												<span class="trigger-label">Recently Updated</span>
												<i class="icon-chevronDown trigger-caret">${icons.get("chevronDown", { raw: true })}</i>
											</span>
										</button>
										<div class="sort-popover" role="listbox" aria-label="Sort shelves">
											<button class="sort-option" data-value="nameasc"  aria-selected="false">
												<i class="icon-check check">${icons.get("check", { raw: true })}</i>Alphabetical
											</button>
											<button class="sort-option" data-value="namedesc" aria-selected="false">
												<i class="icon-check check">${icons.get("check", { raw: true })}</i>Reverse Alphabetical
											</button>
											<button class="sort-option" data-value="createasc"  aria-selected="false">
												<i class="icon-check check">${icons.get("check", { raw: true })}</i>Least Recently Created
											</button>
											<button class="sort-option" data-value="createdesc" aria-selected="false">
												<i class="icon-check check">${icons.get("check", { raw: true })}</i>Recently Created
											</button>
											<button class="sort-option" data-value="updateasc"  aria-selected="false">
												<i class="icon-check check">${icons.get("check", { raw: true })}</i>Least Recently Updated
											</button>
											<button class="sort-option" data-value="updatedesc" aria-selected="true">
												<i class="icon-check check">${icons.get("check", { raw: true })}</i>Recently Updated
											</button>
										</div>
									</div>
								</div>
								<ul class="vault-list" id="vaultList"></ul>
							</aside>
							<main class="media-grid" id="mediaGrid">
								<div class="grid-header">
									<div class="grid-header-info">
										<div class="grid-title-row">
											<i class="icon-grid">${icons.get("grid", { raw: true })}</i>
											<div id="gridShelfNameContainer" style="min-width:0;flex:1;"></div>
										</div>
										<div id="gridShelfTagContainer"></div>
										<div id="gridShelfDates" class="grid-shelf-dates" style="display:none;"></div>
									</div>
									<span class="entry-badge" id="entryCount">0 entries</span>
									<button type="button" id="gridDeleteShelfBtn" class="grid-delete-btn" title="Delete shelf" aria-label="Delete shelf" style="display:none;"></button>
								</div>
								<div class="grid-controls">
									<div class="grid-search">
										<div class="search-wrapper">
											<i class="icon-search">${icons.get("search", { raw: true })}</i>
											<input type="text" id="mediaSearchInput" placeholder="Search media..." aria-label="Search media entries" />
										</div>
									</div>
									<div class="grid-sort" style="width: 15rem; flex: none;">
										<div class="sort-dropdown" id="mediaSortDropdown">
											<button type="button" class="sort-trigger" aria-haspopup="listbox" aria-expanded="false">
												<span class="trigger-icon"><i class="icon-sort">${icons.get("sort", { raw: true })}</i></span>
												<span class="trigger-text">
													<span class="trigger-label">Recently Added</span>
													<i class="icon-chevronDown trigger-caret">${icons.get("chevronDown", { raw: true })}</i>
												</span>
											</button>
											<div class="sort-popover" role="listbox" aria-label="Sort media">
												<button class="sort-option" data-value="nameasc"  aria-selected="false">
													<i class="icon-check check">${icons.get("check", { raw: true })}</i>Title (A-Z)
												</button>
												<button class="sort-option" data-value="namedesc" aria-selected="false">
													<i class="icon-check check">${icons.get("check", { raw: true })}</i>Title (Z-A)
												</button>
												<button class="sort-option" data-value="idasc"    aria-selected="false">
													<i class="icon-check check">${icons.get("check", { raw: true })}</i>ID (ascending)
												</button>
												<button class="sort-option" data-value="iddesc"   aria-selected="false">
													<i class="icon-check check">${icons.get("check", { raw: true })}</i>ID
												</button>
												<button class="sort-option" data-value="addedasc"  aria-selected="false">
													<i class="icon-check check">${icons.get("check", { raw: true })}</i>Least Recently Added
												</button>
												<button class="sort-option" data-value="addeddesc" aria-selected="true">
													<i class="icon-check check">${icons.get("check", { raw: true })}</i>Recently Added
												</button>
											</div>
										</div>
									</div>
									<button type="button" id="gridExportShelfBTn" class="grid-add-btn" title="Copy shelf export string" aria-label="Copy shelf export string" style="">
										<i class="icon-plus">${icons.get("copy", { raw: true, fill: "currentColor" })}</i>
									</button>
									<button type="button" id="gridAddEntryToShelfBtn" class="grid-add-btn" title="Add media to shelf" aria-label="Add media to shelf" style="">
										<i class="icon-plus">${icons.get("plus", { raw: true, fill: "currentColor" })}</i>
									</button>
								</div>
								<div class="grid-items" id="gridItemsContainer"></div>
							</main>
						</div>
					</div>
				</body>
				<script>
					(() => {
						// ---------- state ----------
						let data = {}; 
						let shelfSort = getActiveSort(document.getElementById("shelfSortDropdown")) || "updatedesc";  // $vault.ShelfSort
						let entrySort = getActiveSort(document.getElementById("mediaSortDropdown")) || "nameasc";  // $vault.EntrySort
						let activeUuid = null;
						let shelfQuery = "";
						let mediaQuery = "";
						let pendingNextUuid = null;
						let pendingAfterUuid = null;

						// ---------- DOM ----------
						const vaultListEl = document.getElementById("vaultList");
						const gridItemsContainer = document.getElementById("gridItemsContainer");
						const entryCountEl = document.getElementById("entryCount");
						const shelfSearchInput = document.getElementById("shelfSearchInput");
						const mediaSearchInput = document.getElementById("mediaSearchInput");
						const shelfNameContainer = document.getElementById("gridShelfNameContainer");
						const shelfTagContainer = document.getElementById("gridShelfTagContainer");
						const shelfCreateBtn = document.getElementById("shelfCreateBtn");

						function getActiveSort(dropdownEl) {
							if (!dropdownEl) return null;
							const selected = dropdownEl.querySelector('.sort-option[aria-selected="true"]');
							const label = dropdownEl.querySelector('.trigger-label');
							if (selected && label) { label.textContent = selected.textContent.trim();}
							return selected ? selected.dataset.value : null;
						}

						function computeNextUuid(deletedUuid) {
							const shelves = sortShelves(Object.values(data), shelfSort);
							const idx = shelves.findIndex(s => s.uuid === deletedUuid);
							if (idx === -1) return null;
							const next = shelves[idx + 1] ?? shelves[idx - 1] ?? null;
							return next ? next.uuid : null;
						}

						function sortShelves(arr, key) {
							const a = [...arr];
							switch (key) {
								case "nameasc":   a.sort((x, y) => x.name.localeCompare(y.name)); break;
								case "namedesc":  a.sort((x, y) => y.name.localeCompare(x.name)); break;
								case "createasc": a.sort((x, y) => Date.parse(x.createdAt) - Date.parse(y.createdAt)); break;
								case "createdesc":a.sort((x, y) => Date.parse(y.createdAt) - Date.parse(x.createdAt)); break;
								case "updateasc": a.sort((x, y) => Date.parse(x.lastUpdateAt) - Date.parse(y.lastUpdateAt)); break;
								case "updatedesc":a.sort((x, y) => Date.parse(y.lastUpdateAt) - Date.parse(x.lastUpdateAt)); break;
							}
							return a;
						}

						function sortEntries(arr, key) {
							const a = [...arr];
							switch (key) {
								case "nameasc":   a.sort((x, y) => x.title.userPreferred.localeCompare(y.title.userPreferred)); break;
								case "namedesc":  a.sort((x, y) => y.title.userPreferred.localeCompare(x.title.userPreferred)); break;
								case "idasc":     a.sort((x, y) => x.id - y.id); break;
								case "iddesc":    a.sort((x, y) => y.id - x.id); break;
								case "addedasc":  a.sort((x, y) => Date.parse(x.addedAt) - Date.parse(y.addedAt)); break;
								case "addeddesc": a.sort((x, y) => Date.parse(y.addedAt) - Date.parse(x.addedAt)); break;
							}
							return a;
						}

						function normalizePayload(payload) {
							if (!payload) return {};
							let p = payload;
							
							if (p && typeof p === "object" && !Array.isArray(p)) {
								if (p.value !== undefined && p.uuid === undefined) p = p.value;
								else if (p.data !== undefined && p.uuid === undefined) p = p.data;
							}
							
							if (Array.isArray(p)) {
								const rec = {};
								for (const s of p) if (s && s.uuid) rec[s.uuid] = s;
								return rec;
							}
							
							if (p && typeof p === "object") return p;
							return {};
						}

						function formatTimestamp(iso) {
							if (!iso) return "—";
							const d = new Date(iso);
							if (isNaN(d.getTime())) return "—";
							const now = new Date();
							const sameDay = d.toDateString() === now.toDateString();
							const yesterday = new Date(now);
							yesterday.setDate(now.getDate() - 1);
							const isYesterday = d.toDateString() === yesterday.toDateString();

							const time = d.toLocaleTimeString(undefined, {
								hour: "numeric",
								minute: "2-digit",
							});

							if (sameDay) return "Today at " + time;
							if (isYesterday) return "Yesterday at " + time;

							return d.toLocaleDateString(undefined, {
								year: "numeric",
								month: "short",
								day: "numeric",
							}) + " at " + time;
						}

						
						function sendRename(uuid, name) {
							if (!window.webview) return;
							window.webview.send("vault:rename", { uuid, name });
						}
						function sendSetTag(uuid, tag) {
							if (!window.webview) return;
							window.webview.send("vault:setTag", { uuid, tag });
						}
						function sendDeleteEntry(uuid, mediaId) {
							if (!window.webview) return;
							window.webview.send("vault:deleteEntry", { uuid, mediaId });
						}
						function sendAddEntry(media) {
							if (!window.webview) return;
							window.webview.send("vault:addEntry", media);
						}
						function sendDeleteShelf(uuid) {
							if (!window.webview) return;
							window.webview.send("vault:deleteShelf", { uuid });
						}
						function sendNavigateTo(id, type) {
							if (!window.webview) return;
							window.webview.send("vault:navigateEntry", { id, type });
						}
						function sendShelfEntryImport(uuid, importStr){
							if (!window.webview) return;
							window.webview.send("vault:shelfEntryImport", { uuid, importStr });
						}
						function sendCopyExportString(uuid) {
							if (!window.webview) return;
							window.webview.send("vault:shelfExportCopyStr", uuid);
						}
						function sendCreateShelf(name, type, tag) {
							if (!window.webview) return;
							window.webview.send("vault:createShelf", { name, type, tag });
						}

						function startInlineEdit(container, currentValue, onSave, onCancel, opts) {
							opts = opts || {};
							const input = document.createElement("input");
							input.type = "text";
							input.className = "grid-inline-input " + (opts.className || "");
							input.value = currentValue || "";
							input.placeholder = opts.placeholder || "";
							container.innerHTML = "";
							container.appendChild(input);
							input.focus();
							input.select();

							let done = false;
							function finish(save) {
								if (done) return;
								done = true;
								if (save) onSave(input.value.trim());
								else onCancel();
							}
							input.addEventListener("blur", () => finish(true));
							input.addEventListener("keydown", (e) => {
								if (e.key === "Enter") { e.preventDefault(); input.blur(); }
								else if (e.key === "Escape") { e.preventDefault(); finish(false); }
							});
						}

						function confirmDialog(message, onConfirm) {
							const overlay = document.createElement("div");
							overlay.className = "confirm-overlay";
							const box = document.createElement("div");
							box.className = "confirm-box";
							const msg = document.createElement("div");
							msg.className = "confirm-message";
							msg.textContent = message;
							const row = document.createElement("div");
							row.className = "confirm-actions";
							const cancel = document.createElement("button");
							cancel.className = "confirm-btn";
							cancel.textContent = "Cancel";
							const ok = document.createElement("button");
							ok.className = "confirm-btn danger";
							ok.textContent = "Remove";
							cancel.addEventListener("click", () => document.body.removeChild(overlay));
							ok.addEventListener("click", () => { document.body.removeChild(overlay); onConfirm(); });
							row.appendChild(cancel);
							row.appendChild(ok);
							box.appendChild(msg);
							box.appendChild(row);
							overlay.appendChild(box);
							document.body.appendChild(overlay);
						}

						function promptDialog(opts, onConfirm) {
							// opts: { title, message, placeholder, confirmText, cancelText }
							const overlay = document.createElement("div");
							overlay.className = "confirm-overlay";

							const box = document.createElement("div");
							box.className = "confirm-box";

							if (opts.title) {
								const title = document.createElement("div");
								title.className = "confirm-title";
								title.textContent = opts.title;
								box.appendChild(title);
							}

							if (opts.message) {
								const msg = document.createElement("div");
								msg.className = "confirm-message";
								msg.textContent = opts.message;
								box.appendChild(msg);
							}

							const input = document.createElement("input");
							input.type = "text";
							input.className = "confirm-input";
							input.placeholder = opts.placeholder || "";
							box.appendChild(input);

							const row = document.createElement("div");
							row.className = "confirm-actions";

							const cancel = document.createElement("button");
							cancel.type = "button";
							cancel.className = "confirm-btn";
							cancel.textContent = opts.cancelText || "Cancel";

							const ok = document.createElement("button");
							ok.type = "button";
							ok.className = "confirm-btn primary";
							ok.textContent = opts.confirmText || "Confirm";

							const close = () => {
								if (overlay.parentNode) document.body.removeChild(overlay);
							};

							cancel.addEventListener("click", close);
							ok.addEventListener("click", () => {
								const value = input.value.trim();
								close();
								onConfirm(value);
							});

							input.addEventListener("keydown", (e) => {
								if (e.key === "Enter") { e.preventDefault(); ok.click(); }
								else if (e.key === "Escape") { e.preventDefault(); close(); }
							});

							row.appendChild(cancel);
							row.appendChild(ok);
							box.appendChild(row);
							overlay.appendChild(box);
							document.body.appendChild(overlay);

							input.focus();
						}

						function createShelfDialog(onConfirm) {
							const overlay = document.createElement("div");
							overlay.className = "confirm-overlay";

							const box = document.createElement("div");
							box.className = "confirm-box";

							const title = document.createElement("div");
							title.className = "confirm-title";
							title.textContent = "Create new shelf";
							box.appendChild(title);

							// name field
							const nameInput = document.createElement("input");
							nameInput.type = "text";
							nameInput.className = "confirm-input";
							nameInput.placeholder = "Shelf name";
							box.appendChild(nameInput);

							// type select
							const typeSelect = document.createElement("select");
							typeSelect.className = "confirm-input confirm-select";
							const optAnime = document.createElement("option");
							optAnime.value = "ANIME";
							optAnime.textContent = "Anime";
							const optManga = document.createElement("option");
							optManga.value = "MANGA";
							optManga.textContent = "Manga";
							typeSelect.appendChild(optAnime);
							typeSelect.appendChild(optManga);
							box.appendChild(typeSelect);

							// tag field (optional)
							const tagInput = document.createElement("input");
							tagInput.type = "text";
							tagInput.className = "confirm-input";
							tagInput.placeholder = "Tag (optional)";
							box.appendChild(tagInput);

							// actions
							const row = document.createElement("div");
							row.className = "confirm-actions";

							const cancel = document.createElement("button");
							cancel.type = "button";
							cancel.className = "confirm-btn";
							cancel.textContent = "Cancel";

							const ok = document.createElement("button");
							ok.type = "button";
							ok.className = "confirm-btn primary";
							ok.textContent = "Create";

							const close = () => {
								if (overlay.parentNode) document.body.removeChild(overlay);
							};

							const submit = () => {
								const name = nameInput.value.trim();
								const type = typeSelect.value;
								const tag = tagInput.value.trim();

								if (!name) {
									// highlight the field; no toast infra in the webview, so focus + red border
									nameInput.focus();
									nameInput.style.borderColor = "#8a2e2e";
									return;
								}
								if (type !== "ANIME" && type !== "MANGA") {
									typeSelect.focus();
									return;
								}

								close();
								onConfirm({ name, type, tag });
							};

							cancel.addEventListener("click", close);
							ok.addEventListener("click", submit);

							nameInput.addEventListener("input", () => {
								nameInput.style.borderColor = "";
							});

							// Enter submits from name/tag; from the select, Enter also submits
							[nameInput, tagInput].forEach((el) => {
								el.addEventListener("keydown", (e) => {
									if (e.key === "Enter") { e.preventDefault(); submit(); }
									else if (e.key === "Escape") { e.preventDefault(); close(); }
								});
							});
							typeSelect.addEventListener("keydown", (e) => {
								if (e.key === "Enter") { e.preventDefault(); submit(); }
								else if (e.key === "Escape") { e.preventDefault(); close(); }
							});

							row.appendChild(cancel);
							row.appendChild(ok);
							box.appendChild(row);
							overlay.appendChild(box);
							document.body.appendChild(overlay);

							nameInput.focus();
						}

						function renderGridHeader(shelf) {
							const deleteBtn = document.getElementById("gridDeleteShelfBtn");
							if (!deleteBtn) return;

							if (!shelf) {
								deleteBtn.style.display = "none";
								deleteBtn.onclick = null;
								shelfNameContainer.textContent = "No shelf selected";
								shelfTagContainer.innerHTML = "";
								return;
							}

							deleteBtn.style.display = "";
							deleteBtn.innerHTML = '<i class="icon-trash">${icons.get("delete", { raw: true })}</i>';
							deleteBtn.title = 'Delete shelf';
							deleteBtn.onclick = (ev) => {
								ev.stopPropagation();
								confirmDialog('Delete shelf "' + shelf.name + '"? This cannot be undone.', () => {
									pendingAfterUuid = shelf.uuid;
									pendingNextUuid = computeNextUuid(shelf.uuid);
									sendDeleteShelf(shelf.uuid);
								});
							};

							const copyBtn = document.getElementById("gridExportShelfBTn");
							if (!copyBtn) return;
							copyBtn.onclick = (ev) => {
								ev.stopPropagation();
								sendCopyExportString(shelf.uuid);
							}
 
							const importBtn = document.getElementById("gridAddEntryToShelfBtn");
							if (!importBtn) return;
							importBtn.onclick = (ev) => {
								ev.stopPropagation();
								promptDialog({
									title: "Import entries to this shelf",
									message: "Paste the import string below.",
									placeholder: "Paste import string…",
									confirmText: "Import",
								},
								(value) => {
									if (!value) return;
									sendShelfEntryImport(shelf.uuid, value);
								});
							};

							shelfNameContainer.innerHTML = "";
							const nameEl = document.createElement("span");
							nameEl.className = "grid-shelf-name";
							nameEl.textContent = shelf.name;
							nameEl.title = shelf.name;
							nameEl.addEventListener("click", () => {
								startInlineEdit(
									shelfNameContainer,
									shelf.name,
									(v) => { if (v && v !== shelf.name) sendRename(shelf.uuid, v); renderGridHeader(shelf); },
									() => renderGridHeader(shelf),
									{ placeholder: "Shelf name...", className: "name-input" }
								);
							});
							shelfNameContainer.appendChild(nameEl);

							shelfTagContainer.innerHTML = "";
							const hasTag = typeof shelf.tag === "string" && shelf.tag.trim().length > 0;
							const tagEl = document.createElement("span");
							tagEl.className = "grid-shelf-tag" + (hasTag ? "" : " empty");
							if (hasTag) {
								tagEl.textContent = shelf.tag;
								tagEl.title = shelf.tag;
							} else {
								tagEl.innerHTML = '<i class="icon-plus">${icons.get("plus", { raw: true, fill: "currentColor" })}</i><span>Add tag</span>';
							}
							tagEl.addEventListener("click", () => {
								startInlineEdit(
									shelfTagContainer,
									hasTag ? shelf.tag : "",
									(v) => { sendSetTag(shelf.uuid, v); renderGridHeader(shelf); },
									() => renderGridHeader(shelf),
									{ placeholder: "Add tag...", className: "tag-input" }
								);
							});
							shelfTagContainer.appendChild(tagEl);

							const datesEl = document.getElementById("gridShelfDates");
							if (datesEl) {
								if (!shelf) {
									datesEl.style.display = "none";
									datesEl.innerHTML = "";
								} else {
									datesEl.style.display = "";
									datesEl.innerHTML =
										'<span class="date-item">' +
											'<i class="icon-calendar">${icons.get("calendar", { raw: true })}</i>' +
											'<span class="date-label">Created</span>' +
											'<span class="date-value">' + formatTimestamp(shelf.createdAt) + '</span>' +
										'</span>' +
										'<span class="date-item">' +
											'<i class="icon-calendar">${icons.get("calendar", { raw: true })}</i>' +
											'<span class="date-label">Updated</span>' +
											'<span class="date-value">' + formatTimestamp(shelf.lastUpdateAt) + '</span>' +
										'</span>';
								}
							}
						}

						function renderSidebar() {
							const shelves = sortShelves(
								Object.values(data).filter(s =>
									s.name.toLowerCase().includes(shelfQuery.toLowerCase()) ||
									s.entries.some(x => x.title.userPreferred.toLowerCase().includes(shelfQuery.toLowerCase()))
								),
								shelfSort
							);
							vaultListEl.innerHTML = "";
							if (!shelves.length) {
								const li = document.createElement("li");
								li.className = "vault-item";
								li.style.justifyContent = "center";
								li.style.color = "var(--text-faint)";
								li.style.fontSize = "0.85rem";
								li.textContent = "No shelves found";
								vaultListEl.appendChild(li);
								return;
							}
							shelves.forEach(s => {
								const li = document.createElement("li");
								li.className = "vault-item" + (s.uuid === activeUuid ? " active" : "");
								const info = document.createElement("div");
								info.className = "item-info";
								const nameEl = document.createElement("span");
								nameEl.className = "item-name";
								nameEl.textContent = s.name;
								nameEl.title = s.name;
								info.appendChild(nameEl);
								if (typeof s.tag === "string" && s.tag.trim().length > 0) {
									const tagRow = document.createElement("div");
									tagRow.className = "item-tag-row";
									const tagEl = document.createElement("span");
									tagEl.className = "item-tag";
									tagEl.textContent = s.tag;
									tagEl.title = s.tag;
									tagRow.appendChild(tagEl);
									info.appendChild(tagRow);
								}
								const meta = document.createElement("div");
								meta.className = "item-meta";
								const typeEl = document.createElement("span");
								typeEl.className = "item-type";
								typeEl.textContent = s.type;
								const countEl = document.createElement("span");
								countEl.className = "item-count";
								countEl.textContent = s.entries.length;
								meta.appendChild(typeEl);
								meta.appendChild(countEl);
								li.appendChild(info);
								li.appendChild(meta);
								li.addEventListener("click", () => {
									activeUuid = s.uuid;
									renderAll();
								});
								vaultListEl.appendChild(li);
							});
						}

						function renderGrid() {
							const shelf = activeUuid ? data[activeUuid] : null;
							renderGridHeader(shelf);

							if (!shelf) {
								gridItemsContainer.innerHTML = "";
								entryCountEl.textContent = "0 entries";
								return;
							}

							const q = mediaQuery.toLowerCase();
							let entries = shelf.entries.filter(e => {
								const p = (e.title.userPreferred || "").toLowerCase();
								const syn = (e.title.synonyms || []).map(x => x.toLowerCase()).join(" ");
								return !q || p.includes(q) || syn.includes(q);
							});
							entries = sortEntries(entries, entrySort);

							entryCountEl.textContent = entries.length + (entries.length === 1 ? " entry" : " entries");
							gridItemsContainer.innerHTML = "";
							if (!entries.length) {
								const empty = document.createElement("div");
								empty.className = "empty-state";
								empty.innerHTML = '<img src="/luffy-01.png" alt="" style="display:block;width:80px;height:80px;object-fit:contain;margin:0 auto 1rem;" />No entries found';
								gridItemsContainer.appendChild(empty);
								return;
							}

							entries.forEach(e => {
								const card = document.createElement("div");
								card.className = "media-card";

								const cover = document.createElement("div");
								cover.className = "cover-wrapper";
								const img = document.createElement("img");
								img.src = e.coverImage;
								img.alt = e.title.userPreferred;
								img.loading = "lazy";
								cover.appendChild(img);

								const actions = document.createElement("div");
								actions.className = "card-actions";

								const delBtn = document.createElement("button");
								delBtn.type = "button";
								delBtn.className = "card-action-btn delete";
								delBtn.title = "Remove from shelf";
								delBtn.innerHTML = '<i class="icon-trash">${icons.get("delete", { raw: true })}</i>';
								delBtn.addEventListener("click", (ev) => {
									ev.stopPropagation();
									confirmDialog('Remove "' + e.title.userPreferred + '" from this shelf?', () => {
										sendDeleteEntry(shelf.uuid, e.id);
									});
								});

								const addBtn = document.createElement("button");
								addBtn.type = "button";
								addBtn.className = "card-action-btn add";
								addBtn.title = "Add to another shelf";
								addBtn.innerHTML = '<i class="icon-plus">${icons.get("plus", { raw: true })}</i>';
								addBtn.addEventListener("click", (ev) => {
									ev.stopPropagation();
									sendAddEntry({
										id: e.id,
										type: shelf.type,
										title: { userPreferred: e.title.userPreferred },
										synonyms: e.title.synonyms,
										coverImage: {
											large: e.coverImage,
											extraLarge: e.coverImage,
											medium: e.coverImage,
											color: null,
										},
										season: e.season,
										seasonYear: e.seasonYear,
									});
								});

								actions.appendChild(delBtn);
								actions.appendChild(addBtn);
								cover.appendChild(actions);

								const title = document.createElement("div");
								title.className = "media-title";
								title.textContent = e.title.userPreferred;
								title.title = e.title.userPreferred;

								const meta = document.createElement("div");
								meta.className = "media-meta";
								const season = document.createElement("span");
								season.className = "media-season";
								const seasonDisplay = e.season ? e.season : "—";
								const yearDisplay = e.seasonYear ?? "";
								season.textContent = seasonDisplay + (yearDisplay ? " · " + yearDisplay : "");
								meta.appendChild(season);

								card.appendChild(cover);
								card.appendChild(title);
								card.appendChild(meta);
								gridItemsContainer.appendChild(card);

								card.addEventListener("click", (ev) => {
									ev.stopPropagation();
									sendNavigateTo(e.id, shelf.type);
								})
							});
						}

						function renderAll() {
							renderSidebar();
							renderGrid();
						}

						function positionFixedPopover(dropdownEl) {
							if (window.innerWidth > 800) return;
							const trigger = dropdownEl.querySelector(".sort-trigger");
							const popover = dropdownEl.querySelector(".sort-popover");
							if (!trigger || !popover) return;
							const rect = trigger.getBoundingClientRect();
							const margin = 16, gap = 8;
							let top = rect.bottom + gap;
							const maxHeight = window.innerHeight * 0.6;
							if (top + maxHeight > window.innerHeight - margin) {
								top = Math.max(margin, rect.top - gap - Math.min(maxHeight, popover.scrollHeight));
							}
							popover.style.top = top + "px";
							popover.style.left = margin + "px";
							popover.style.right = margin + "px";
						}

						function setupSortDropdown(dropdownEl, onChange) {
							const trigger = dropdownEl.querySelector(".sort-trigger");
							const label = dropdownEl.querySelector(".trigger-label");
							const options = dropdownEl.querySelectorAll(".sort-option");

							function close() {
								dropdownEl.classList.remove("open");
								trigger.setAttribute("aria-expanded", "false");
								const p = dropdownEl.querySelector(".sort-popover");
								p.style.top = ""; p.style.left = ""; p.style.right = "";
							}
							function open() {
								document.querySelectorAll(".sort-dropdown.open").forEach(el => {
									if (el !== dropdownEl) {
										el.classList.remove("open");
										const t = el.querySelector(".sort-trigger");
										if (t) t.setAttribute("aria-expanded", "false");
										const p = el.querySelector(".sort-popover");
										if (p) { p.style.top = ""; p.style.left = ""; p.style.right = ""; }
									}
								});
								dropdownEl.classList.add("open");
								trigger.setAttribute("aria-expanded", "true");
								positionFixedPopover(dropdownEl);
							}

							trigger.addEventListener("click", (e) => {
								e.stopPropagation();
								if (dropdownEl.classList.contains("open")) close(); else open();
							});
							options.forEach(opt => {
								opt.addEventListener("click", (e) => {
									e.stopPropagation();
									options.forEach(o => o.setAttribute("aria-selected", "false"));
									opt.setAttribute("aria-selected", "true");
									label.textContent = opt.textContent.trim();
									close();
									onChange(opt.dataset.value);
								});
							});
							document.addEventListener("click", (e) => {
								if (!dropdownEl.contains(e.target)) close();
							});
							document.addEventListener("keydown", (e) => {
								if (e.key === "Escape") close();
							});
							window.addEventListener("resize", () => {
								if (dropdownEl.classList.contains("open")) positionFixedPopover(dropdownEl);
							});
							window.addEventListener("scroll", () => {
								if (dropdownEl.classList.contains("open")) positionFixedPopover(dropdownEl);
							}, true);
						}

						setupSortDropdown(document.getElementById("shelfSortDropdown"), (v) => { shelfSort = v; renderSidebar(); });
						setupSortDropdown(document.getElementById("mediaSortDropdown"), (v) => { entrySort = v; renderGrid(); });

						shelfSearchInput.addEventListener("input", () => {
							shelfQuery = shelfSearchInput.value;
							renderSidebar();
						});
						mediaSearchInput.addEventListener("input", () => {
							mediaQuery = mediaSearchInput.value;
							renderGrid();
						});
						shelfCreateBtn.addEventListener("click", () => {
							createShelfDialog(({ name, type, tag }) => {
								sendCreateShelf(name, type, tag);
							});
						});

						window.webview.on("vaultData", (payload) => {
							data = normalizePayload(payload);

							if (pendingAfterUuid) {
								const deletedGone = !data[pendingAfterUuid];
								pendingAfterUuid = null;
								if (deletedGone) {
									const candidate = pendingNextUuid && data[pendingNextUuid] ? pendingNextUuid : null;
									activeUuid = candidate ?? (sortShelves(Object.values(data), shelfSort)[0]?.uuid ?? null);
									pendingNextUuid = null;
									renderAll();
									return;
								}
								pendingNextUuid = null;
							}

							if (!activeUuid || !data[activeUuid]) {
								const first = sortShelves(Object.values(data), shelfSort)[0];
								activeUuid = first ? first.uuid : null;
							}
							renderAll();
						});

						renderAll();
					})();
				</script>
			</html>`,
		); // prettier-ignore
	});
}
