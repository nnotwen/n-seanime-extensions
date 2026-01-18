/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./custom-css-manager.d.ts" />

//@ts-ignore;
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Custom%20CSS%20Manager/icon.png";
		const tray = ctx.newTray({ iconUrl, withContent: true });

		const icons = {
			html: {
				back: /*html*/ `
					<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 256 256" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a8 8 0 0 1-8 8h-60.69l18.35 18.34a8 8 0 0 1-11.32 11.32l-32-32a8 8 0 0 1 0-11.32l32-32a8 8 0 0 1 11.32 11.32L107.31 120H168a8 8 0 0 1 8 8" stroke="none"/>
					</svg>`,
				checkmark: /*html*/ `
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="m7 13 3 3 7-7" stroke="#238059" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>`,
				chevydown: /*html*/ `
					<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
						<path stroke="#cacaca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 7 6 6 6-6"/>
					</svg>`,
				chevyup: /*html*/ `
					<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
						<path stroke="#cacaca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 13-6-6-6 6"/>
					</svg>`,
				close: /*html*/ `
					<svg stroke="#d93e3e" fill="#d93e3e" stroke-width="0" viewBox="0 0 16 16" class="text-[0.95rem]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"></path>
					</svg>`,
				crossmark: /*html*/ `
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M16.95 8.464a1 1 0 1 0-1.414-1.414L12 10.586 8.465 7.05A1 1 0 0 0 7.05 8.464L10.586 12 7.05 15.536a1 1 0 1 0 1.415 1.414L12 13.414l3.536 3.536a1 1 0 1 0 1.414-1.414L13.414 12z" fill="#ef4444d9"/>
					</svg>`,
				delete: /*html*/ `
					<svg stroke="#fca5a5" fill="#fca5a5" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
						<path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
					</svg>`,
				download: /*html*/ `
					<svg stroke="#bcb7f0" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/>
					</svg>`,
				edit: /*html*/ `
					<svg stroke="#cfc2ff" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"/>
					</svg>`,
				link: /*html*/ `
					<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.04 16.04 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.5 152.5 0 0 1 20.522 17.197M467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.5 152.5 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.04 16.04 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959" stroke="none"/>
					</svg>`,
				marketplace: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="m15 11-1 9m5-9-4-7M2 11h20M3.5 11l1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4M4.5 15.5h15M5 11l4-7m0 7 1 9"/>
					</svg>`,
				plus: /*html*/ `
					<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
					</svg>`,
				refresh: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
						<path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
						<path d="M16 16h5v5"/>
					</svg>`,
				save: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#68b695" viewBox="0 0 16 16">
						<path d="M12 2h-2v3h2z"/>
						<path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1"/>
					</svg>`,
				settings: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/>
						<circle cx="12" cy="12" r="3"/>
					</svg>`,
				share: /*html*/ `
					<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M16 11.875c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2M4 18c-1.103 0-2-.897-2-2s.897-2 2-2c2.643 0 2.644 4 0 4M4 6c-1.103 0-2-.897-2-2s.897-2 2-2c2.643 0 2.644 4 0 4m12-.125c-1.221 0-2.3.559-3.034 1.421L7.959 4.405C8.212 1.919 6.269 0 4 0a4 4 0 0 0 0 8 3.99 3.99 0 0 0 3.257-1.691l4.822 2.784a3.9 3.9 0 0 0 .009 1.611l-4.947 2.847A3.98 3.98 0 0 0 4 12a4 4 0 0 0 0 8c2.362 0 4.324-2.072 3.939-4.601l5.056-2.909A3.97 3.97 0 0 0 16 13.875a4 4 0 0 0 0-8" fill="#cacaca" fill-rule="evenodd"/>
					</svg>`,
			},
			get(name: keyof typeof this.html, raw: boolean = false) {
				if (raw) return this.html[name];
				return `data:image/svg+xml;base64,${Buffer.from(this.html[name].trim(), "utf-8").toString("base64")}`;
			},
		};

		enum Tabs {
			Manager = 1,
			Editor = 2,
			Marketplace = 3,
		}

		const fieldRef = {
			editor: {
				controller: ctx.fieldRef<string>(""),
				desktop: ctx.fieldRef<string>(""),
				mobile: ctx.fieldRef<string>(""),
				name: ctx.fieldRef<string>(""),
			},
			disableCSSValidation: ctx.fieldRef<boolean>($storage.get("options.css.validate-disabled") ?? false),
		};

		const state = {
			editorSelectedScreen: ctx.state<"desktop" | "mobile">("desktop"),
			isFetching: ctx.state<boolean>(false),
			currentStyle: ctx.state<$cssm.Style | null>(),
			currentEditor: {
				name: ctx.state<string>(""),
				desktop: ctx.state<string>(""),
				mobile: ctx.state<string>(""),
			},
			tabBtnDisabled: ctx.state<boolean>(false),
		};

		const manager = {
			id: "7316e540-84b4-4b08-89e4-0e0a8dcafcb8",
			get storage(): $cssm.Storage {
				return $storage.get(this.id) ?? [];
			},
			get marketplace(): $cssm.Storage {
				return $store.get(`marketplace:${this.id}`);
			},
			has(uuid: string) {
				return this.storage.some((x) => x.uuid.toString() === uuid.toString());
			},
			async add(style: Omit<$cssm.Style, "uuid" | "enabled">) {
				const errors = await this.validateCSS(`${style.style.desktop ?? ""} ${style.style.mobile ?? ""}`);
				if (errors.length) throw new Error(errors.join("\n"));

				const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
					const r = (Math.random() * 16) | 0;
					const v = c === "x" ? r : (r & 0x3) | 0x8;
					return v.toString(16);
				});

				$storage.set(this.id, [...this.storage, { ...style, uuid, enabled: true }]);
				this.updateCSS();
				return this.storage;
			},
			addFromMarketplace(style: $cssm.Style) {
				$storage.set(this.id, [...this.storage, style]);
				this.updateCSS();
				return this.storage;
			},
			async edit(uuid: string, { name, mobile, desktop }: { name?: string; mobile?: string; desktop?: string }) {
				const arr = [...this.storage];
				const index = arr.findIndex((x) => x.uuid.toString() === uuid.toString());
				if (index === -1) throw new Error("Could not find style with uuid " + uuid);

				const style = arr[index];

				if (name !== undefined) style.name = name;
				if (mobile !== undefined) style.style.mobile = mobile;
				if (desktop !== undefined) style.style.desktop = desktop;

				const errors = await this.validateCSS(`${desktop ?? ""} ${mobile ?? ""}`);
				if (errors.length) throw new Error(errors.join("\n"));

				arr[index] = style;

				$storage.set(this.id, arr);
				this.updateCSS();
			},
			remove(uuid: string) {
				$storage.set(
					this.id,
					this.storage.filter((x) => x.uuid !== uuid),
				);
				this.updateCSS();
			},
			moveUp(uuid: string) {
				const arr = [...this.storage];
				const index = arr.findIndex((x) => x.uuid === uuid);
				if (index > 0) {
					[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
					$storage.set(this.id, arr);
				}
				this.updateCSS();
				return arr;
			},
			moveDown(uuid: string) {
				const arr = [...this.storage];
				const index = arr.findIndex((x) => x.uuid === uuid);
				if (index !== -1 && index < arr.length - 1) {
					[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
					$storage.set(this.id, arr);
				}
				this.updateCSS();
				return arr;
			},
			toggle(uuid: string) {
				const arr = [...this.storage];
				const index = arr.findIndex((x) => x.uuid.toString() === uuid.toString());
				if (index === -1) throw new Error("Could not find style with uuid " + uuid);

				arr[index].enabled = !arr[index].enabled;

				$storage.set(this.id, arr);
				this.updateCSS();
			},
			async fetchMarketplace() {
				const res = await ctx.fetch(
					"https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Custom%20CSS%20Manager/community-styles.json",
				);

				if (!res.ok) throw new Error(res.statusText);
				const data: $cssm.Storage = res.json();
				$store.set(`marketplace:${this.id}`, data);
				return data;
			},
			async validateCSS(css: string) {
				if (fieldRef.disableCSSValidation.current) return [];

				const res = await ctx.fetch(`https://jigsaw.w3.org/css-validator/validator?text=${encodeURIComponent(css)}&profile=latest&lang=en&output=json`);
				if (!res.ok) return [];

				const json = res.json();
				if (json.cssvalidation.errors) {
					return json.cssvalidation.errors.map((x: any) => `Error at line ${x.line}: ${x.message}`);
				}

				return [];
			},
			async updateCSS() {
				const style = (await ctx.dom.queryOne(`[data-ccssm="${this.id}"]`)) || (await ctx.dom.createElement("style"));
				style.setAttribute("data-ccssm", this.id);
				const desktop = this.storage.filter((s) => s.enabled).map((s) => s.style.desktop);
				const mobile = this.storage.filter((s) => s.enabled).map((s) => s.style.mobile);

				function minifyCSS(css: string) {
					return css
						.replace(/\/\*[\s\S]*?\*\//g, "")
						.replace(/\s+/g, " ")
						.replace(/\s*{\s*/g, "{")
						.replace(/\s*}\s*/g, "}")
						.replace(/\s*;\s*/g, ";")
						.replace(/\s*:\s*/g, ":")
						.replace(/;\}/g, "}")
						.trim();
				}

				style.setText(`@media(min-width: 1024px){${minifyCSS(desktop.join(" "))}} @media(max-width: 1024px){ ${minifyCSS(mobile.join(" "))} }`);
			},
		};

		const tabs = {
			current: ctx.state<Tabs>(Tabs.Manager),
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
				const icon = tray.div([], {
					className: "w-10 h-10 bg-contain bg-no-repeat bg-center shrink-0",
					style: { backgroundImage: `url(${iconUrl})` },
				});

				const text = tray.stack(
					[
						tray.span(`${primary}`, { className: " text-lg font-bold" }), //
						subtext ? tray.span(`${subtext}`, { className: "text-[--muted] text-sm" }) : [],
					],
					{ gap: 0, className: "flex-1" },
				);

				return tray.flex([icon, text, tray.div(additionalComponents ?? [])], {
					gap: 3,
					className: "mb-4",
				});
			},
			backButton() {
				const button = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center",
					style: {
						backgroundImage: `url(${icons.get("back")})`,
						backgroundSize: "1.5rem",
					},
					onClick: ctx.eventHandler("goto:back", () => tabs.current.set(Tabs.Manager)),
				});

				return tray.tooltip(button, { text: "Go Back" });
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
			saveButton(style?: $cssm.Style) {
				const button = tray.button("\u200b", {
					intent: "success-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center",
					style: {
						backgroundImage: `url(${icons.get("save")})`,
						backgroundSize: "1rem",
					},
					onClick: ctx.eventHandler("save-entry", async () => {
						if (!fieldRef.editor.name.current.length) {
							return ctx.toast.error("Name is required!");
						}

						if (!fieldRef.editor.desktop.current.length && !fieldRef.editor.mobile.current.length) {
							return ctx.toast.error("Stylesheet for desktop or mobile is required!");
						}

						if (style) {
							const desktop = fieldRef.editor.desktop.current;
							const mobile = fieldRef.editor.mobile.current;

							try {
								await manager.edit(style.uuid, { desktop, mobile, name: fieldRef.editor.name.current });
								ctx.toast.success(`Successfully saved styles for ${style.name}`);
								tabs.current.set(Tabs.Manager);
							} catch (error) {
								return ctx.toast.error((error as Error).message);
							}
						} else {
							try {
								await manager.add({
									name: fieldRef.editor.name.current,
									author: "You",
									style: {
										desktop: fieldRef.editor.desktop.current,
										mobile: fieldRef.editor.mobile.current,
									},
								});
								tabs.current.set(Tabs.Manager);
								return ctx.toast.success(`Successfully saved styles for ${fieldRef.editor.name.current}`);
							} catch (error) {
								ctx.toast.error((error as Error).message);
							}
						}
					}),
				});

				return tray.tooltip(button, { text: "Save" });
			},
			deleteButton(style: $cssm.Style) {
				const button = tray.button("\u200b", {
					intent: "alert-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center",
					style: {
						backgroundImage: `url(${icons.get("delete")})`,
						backgroundSize: "1.5rem",
					},
					onClick: ctx.eventHandler(`delete-entry:${style.uuid}`, () => {
						manager.remove(style.uuid);
						ctx.toast.success(`Removed ${style.name} from styles!`);
						tabs.current.set(Tabs.Manager);
					}),
				});

				return tray.tooltip(button, { text: "Delete" });
			},
			shareButton(style: $cssm.Style) {
				const params = new URLSearchParams({
					title: `[Custom Style]: ${style.name}`,
					body: `**Style**:\n\`\`\`css\n/*Desktop*/\n${style.style.desktop}\n\n/*Mobile*/\n${style.style.mobile}\n\`\`\`\n\n**Data**:\n\`\`\`json\n${JSON.stringify(style, null, 2)}\n\`\`\`\n\n**Additional info:**\n`,
				});

				const button = tray.button("\u200b", {
					intent: "primary-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.get("share")})`, backgroundSize: "1.3rem" },
				});

				const anchor = tray.a([button], { href: `https://github.com/nnotwen/n-seanime-extensions/issues/new?${params.toString()}`.substring(0, 8190) });

				return tray.tooltip(anchor, { text: "Share" });
			},
			formatManagerItem(item: $cssm.Style, index?: number, array?: $cssm.Style[]) {
				const name = tray.text(`${item.name}`, {
					className: "break-words overflow-hidden overflow-ellipsis line-clamp-2 text-md font-semibold",
				});

				const author = tray.span(`${item.author}`, {
					className: "inline-flex w-fit text-xs px-2 h-6 font-semibold border rounded-md tracking-wide items-center",
				});

				const left = tray.stack([name, author], { className: "justify-around" });

				const toggle = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-8 h-8 bg-no-repeat bg-center",
					style: {
						backgroundSize: "1.5rem",
						backgroundImage: `url(${icons.get(item.enabled ? "checkmark" : "crossmark")})`,
					},
					onClick: ctx.eventHandler(`toggle-${item.uuid}`, () => {
						manager.toggle(item.uuid);
						tray.update();
					}),
				});

				const edit = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-8 h-8 bg-no-repeat bg-center",
					style: {
						backgroundSize: "1.2rem",
						backgroundImage: `url(${icons.get("edit")})`,
					},
					onClick: ctx.eventHandler(`edit-${item.uuid}`, () => {
						state.currentStyle.set(item);
						fieldRef.editor.name.setValue(item.name);
						fieldRef.editor.controller.setValue(item.style.desktop);
						fieldRef.editor.desktop.setValue(item.style.desktop);
						fieldRef.editor.mobile.setValue(item.style.mobile);
						state.editorSelectedScreen.set("desktop");
						tabs.current.set(Tabs.Editor);
					}),
				});

				const moveup = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-8 h-8 bg-no-repeat bg-center",
					disabled: index === 0,
					style: {
						backgroundSize: "1.2rem",
						backgroundImage: `url(${icons.get("chevyup")})`,
					},
					onClick: ctx.eventHandler(`moveup:${item.uuid}`, () => {
						manager.moveUp(item.uuid);
						tray.update();
					}),
				});

				const movedown = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-8 h-8 bg-no-repeat bg-center",
					disabled: index && array?.length ? index >= array?.length - 1 : false,
					style: {
						backgroundSize: "1.2rem",
						backgroundImage: `url(${icons.get("chevydown")})`,
					},
					onClick: ctx.eventHandler(`movedown:${item.uuid}`, () => {
						manager.moveDown(item.uuid);
						tray.update();
					}),
				});

				const btnGroupLeft = tray.stack(
					[
						tray.tooltip(toggle, { text: item.enabled ? "Disable" : "Enable" }), //
						tray.tooltip(edit, { text: "Edit" }),
					],
					{ gap: 0 },
				);

				const btnGroupRight = tray.stack(
					[
						index === 0 ? moveup : tray.tooltip(moveup, { text: "Move up" }),
						(index && array?.length ? index >= array?.length - 1 : false) ? movedown : tray.tooltip(movedown, { text: "Move down" }),
					],
					{ gap: 0 },
				);

				return tray.flex([left, tray.flex([btnGroupLeft, btnGroupRight])], {
					className: "rounded-lg border bg-gray-900 justify-between p-3 relative",
				});
			},
			formatMarketplaceItem(item: $cssm.Style) {
				const alreadyDownloaded = manager.has(item.uuid);

				// components
				const name = tray.text(`${item.name}`, {
					className: "break-words overflow-hidden overflow-ellipsis line-clamp-2 text-md font-semibold",
				});

				const author = tray.span(`${item.author}`, {
					className: "inline-flex w-fit text-xs px-2 h-6 font-semibold border rounded-md tracking-wide items-center",
				});

				const left = tray.stack([name, author], { className: "justify-around" });

				const download = tray.button("\u200b", {
					intent: "gray-subtle",
					disabled: alreadyDownloaded,
					className: "w-8 h-8 bg-no-repeat bg-center",
					style: {
						backgroundSize: "1.2rem",
						backgroundImage: `url(${icons.get(alreadyDownloaded ? "checkmark" : "download")})`,
					},
					onClick: ctx.eventHandler(`download-${item.uuid}`, () => {
						try {
							manager.addFromMarketplace(item);
							ctx.toast.success(`Added ${item.name} to styles!`);
							tray.update();
						} catch (error) {
							ctx.toast.error((error as Error).message);
						}
					}),
				});

				const link = item.link
					? tray.tooltip(
							tray.anchor("\u200b", {
								className: "block w-8 h-8 rounded-lg bg-no-repeat bg-center bg-gray-300 hover:bg-gray-200 dark:bg-opacity-10 dark:hover:bg-opacity-20",
								href: item.link,
								style: {
									backgroundSize: "1rem",
									backgroundImage: `url(${icons.get("link")})`,
								},
							}),
							{ text: "Reference URL" },
						)
					: [];

				const downloadWithTooltip = alreadyDownloaded ? download : tray.tooltip(download, { text: "Apply Styles" });

				const right = tray.stack([downloadWithTooltip, link]);

				return tray.flex([left, right], { className: "p-3 rounded-lg border bg-gray-900 justify-between" });
			},
			loadingItem() {
				return tray.div([], { className: "animate-pulse w-full h-20 rounded-lg bg-gray-800" });
			},
			settings() {
				const headerText = tray.span("Settings", { className: "text-lg font-semibold flex-1" });
				const backbtn = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center p-0 grayscale hover:grayscale-0 transition",
					style: { backgroundImage: `url(${icons.get("close")})` },
					onClick: ctx.eventHandler("settings:back", () => this.currentOverlay.set(null)),
				});

				const header = tray.flex([headerText, backbtn], { className: "justify-between items-center border-b pb-1" });

				// settings
				const disableCSSValidation = tray.switch("Disable CSS Validation", {
					fieldRef: fieldRef.disableCSSValidation,
					onChange: ctx.eventHandler("options.css.validate:switch", ({ value }) => {
						fieldRef.disableCSSValidation.setValue(value);
						$storage.set("options.css.validate", value);
						this.currentOverlay.set([this.settings()]);
					}),
				});

				const disableCSSValidationWarning = tray.text(
					"Saving styles without validation may cause unexpected behavior inside your application. Invalid or unsupported rules may break layout inheritance. It is strongly recommended to validate your CSS before saving changes.",
					{
						className: "p-2 text-sm break-words leading-none border rounded-lg bg-red-950 text-red-400 mt-1",
					},
				);

				return tray.stack([header, disableCSSValidation, fieldRef.disableCSSValidation.current ? disableCSSValidationWarning : []], {
					className: "bg-gray-900 rounded-xl p-5 m-4 border",
					style: { boxShadow: "0 0 10px black", width: "25rem" },
				});
			},
			[Tabs.Manager]() {
				const create = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center p-0",
					style: {
						backgroundImage: `url(${icons.get("plus")})`,
						backgroundSize: "1.5rem",
					},
					onClick: ctx.eventHandler("goto:create", () => {
						tabs.current.set(Tabs.Editor);
						fieldRef.editor.controller.setValue("");
						fieldRef.editor.desktop.setValue("");
						fieldRef.editor.mobile.setValue("");
						fieldRef.editor.name.setValue("");
						state.currentStyle.set(null);
					}),
				});

				const marketplace = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center p-0",
					style: {
						backgroundImage: `url(${icons.get("marketplace")})`,
						backgroundSize: "1.5rem",
					},
					onClick: ctx.eventHandler("goto:marketplace", () => tabs.current.set(Tabs.Marketplace)),
				});

				const header = this.header("Custom CSS Manager", "Manage styles more effeciently", [
					tray.flex(
						[
							tray.tooltip(create, { text: "Create Style" }), //
							tray.tooltip(marketplace, { text: "Marketplace" }),
						],
						{
							className: "items-center",
						},
					),
				]);

				const storage = manager.storage;
				const body = tray.div(
					[
						storage.length
							? tray.stack(storage.map(this.formatManagerItem), { className: " mr-1 mt-1" })
							: tray.text("No styles yet!", {
									className: "flex-1 h-full text-center bg-gray-900 rounded-lg text-lg font-bold text-[--muted]",
									style: {
										alignContent: "center",
										border: "0.25rem dashed var(--border)",
									},
								}),
					],
					{
						className: "overflow-scroll",
						style: { height: "28rem" },
					},
				);

				return tray.stack([header, body], { style: { padding: "0.5rem" } });
			},
			[Tabs.Editor]() {
				const currentStyle = state.currentStyle.get();
				const settings = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent",
					style: {
						backgroundImage: `url(${icons.get("settings")})`,
						backgroundSize: "1.5rem",
					},
					onClick: ctx.eventHandler("goto:settings", () => tabs.currentOverlay.set([this.settings()])),
				});

				const header = this.header(currentStyle ? "Edit Style" : "Create Style", currentStyle ? "Edit current style" : "Create new style", [
					tray.flex([this.backButton(), tray.tooltip(settings, { text: "Settings" })], {
						className: "items-center",
					}),
				]);

				function switchTab(target: "desktop" | "mobile") {
					const current = state.editorSelectedScreen.get();
					if (current === target) return;
					state.tabBtnDisabled.set(true);
					fieldRef.editor[current].setValue(fieldRef.editor.controller.current);
					state.editorSelectedScreen.set(target);
					fieldRef.editor.controller.setValue(fieldRef.editor[target].current);
					tray.update();
					ctx.setTimeout(() => state.tabBtnDisabled.set(false), 500);
				}

				const nameInput = tray.flex(
					[
						tray.text("Name", {
							className: "w-fit h-full break-normal bg-gray-900 border py-0 px-3",
							style: { alignContent: "center", borderRadius: "0.5rem 0 0 0.5rem" },
						}),
						tray.input({
							fieldRef: fieldRef.editor.name,
							placeholder: "Name for your custom style",
							style: { borderRadius: "0 0.5rem 0.5rem 0", marginLeft: "-1px" },
						}),
					],
					{
						gap: 0,
						className: "items-center",
					},
				);

				const desktop = tray.button("Desktop", {
					className: `bg-transparent ${state.editorSelectedScreen.get() === "desktop" ? "" : "hover:bg-gray-600"}`,
					disabled: state.tabBtnDisabled.get(),
					style: {
						width: "100%",
						borderRadius: "0.5rem 0.5rem 0 0",
						...(state.editorSelectedScreen.get() === "desktop"
							? {
									border: "1px solid var(--border)",
									borderBottom: "1px solid transparent",
								}
							: {
									borderBottom: "1px solid var(--border)",
								}),
					},
					onClick: ctx.eventHandler("screen-desktop", () => switchTab("desktop")),
				});

				const mobile = tray.button("Mobile", {
					className: `w-full bg-transparent ${state.editorSelectedScreen.get() === "mobile" ? "" : "hover:bg-gray-600"}`,
					disabled: state.tabBtnDisabled.get(),
					style: {
						borderRadius: "0.5rem 0.5rem 0 0",
						...(state.editorSelectedScreen.get() === "mobile"
							? {
									border: "1px solid var(--border)",
									borderBottom: "1px solid transparent",
								}
							: {
									borderBottom: "1px solid var(--border)",
								}),
					},
					onClick: ctx.eventHandler("screen-mobile", () => switchTab("mobile")),
				});

				const panel = tray.stack(
					[
						tray.flex([desktop, mobile], { gap: 0 }),
						tray.input({
							textarea: true,
							fieldRef: fieldRef.editor.controller,
							placeholder: "...your custom style",
							style: {
								borderRadius: "0 0 0.5rem 0.5rem",
								height: "300px",
								overflow: "scroll",
								whiteSpace: "nowrap",
								fontFamily: "monospace",
								borderTop: "none",
								borderColor: "var(--border)",
								"--tw-ring-opcaity": "0",
								"--tw-ring-color": "transparent",
							},
							onChange: ctx.eventHandler("screen-controller", ({ value }) => fieldRef.editor[state.editorSelectedScreen.get()].setValue(value)),
						}),
					],
					{ gap: 0 },
				);

				const actionGroup = tray.flex(
					[
						currentStyle?.author === "You" ? this.shareButton(currentStyle) : [],
						currentStyle ? this.deleteButton(currentStyle) : [],
						this.saveButton(currentStyle ?? undefined),
					],
					{
						className: "justify-end",
					},
				);

				const body = tray.stack([nameInput, panel, actionGroup], {
					gap: 5,
					style: { height: "28rem" },
				});

				return tray.stack([this.customStyles(), this.overlay(), header, body], { style: { padding: "0.5rem" } });
			},
			[Tabs.Marketplace]() {
				const refresh = tray.button("\u200b", {
					intent: "gray-subtle",
					loading: state.isFetching.get(),
					className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center p-0",
					style: {
						...(state.isFetching.get() ? {} : { backgroundImage: `url(${icons.get("refresh")})` }),
						backgroundSize: "1.3rem",
						paddingInlineStart: "0.5rem",
					},
					onClick: ctx.eventHandler(`refresh-favorites`, () => {
						state.isFetching.set(true);
						manager
							.fetchMarketplace()
							.then(() => ctx.toast.success("Successfully refreshed community styles!"))
							.catch((err) => ctx.toast.error(`An error occured while fetching favorites: ${err.message}`))
							.finally(() => ctx.setTimeout(() => state.isFetching.set(false), 1000));
					}),
				});

				const header = this.header("Community made styles", "Download community made css snippets", [
					tray.flex([this.backButton(), tray.tooltip(refresh, { text: "Refresh" })], {
						className: "items-center",
					}),
				]);

				const marketplace = manager.marketplace;

				if (!marketplace) {
					manager
						.fetchMarketplace()
						.then(() => tray.update())
						.catch((e) => ctx.toast.error(e.message));
				}

				const body = tray.div(
					[
						marketplace
							? tray.stack(marketplace.sort((A, B) => A.name.localeCompare(B.name)).map(this.formatMarketplaceItem), { style: { marginRight: "0.25rem" } })
							: tray.stack(Array.from({ length: 5 }).map(() => this.loadingItem())),
					],
					{
						style: { height: "28rem", overflow: "scroll" },
					},
				);

				return tray.stack([header, body], { style: { padding: "0.5rem" } });
			},
			get() {
				return this[this.current.get()]();
			},
		};

		tray.render(() => tabs.get());
		ctx.dom.onReady(() => manager.updateCSS());
	});
}
