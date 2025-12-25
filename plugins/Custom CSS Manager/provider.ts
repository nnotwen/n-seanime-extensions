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
					this.storage.filter((x) => x.uuid !== uuid)
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
					"https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Custom%20CSS%20Manager/community-styles.json"
				);

				if (!res.ok) throw new Error(res.statusText);
				const data: $cssm.Storage = res.json();
				$store.set(`marketplace:${this.id}`, data);
				return data;
			},
			async validateCSS(css: string) {
				const res = await ctx.fetch(`https://jigsaw.w3.org/css-validator/validator?text=${encodeURIComponent(css)}&lang=en&output=json`);
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
								subtext ? tray.text(`${subtext}`, { style: { fontSize: "0.8em" }, className: "opacity-30" }) : [],
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
						tabs.current.set(Tabs.Manager);
					}),
				});
			},
			saveButton(style?: $cssm.Style) {
				return tray.button("\u200b", {
					intent: "success",
					style: {
						width: "2.5rem",
						height: "2.5rem",
						borderRadius: "50%",
						// prettier-ignore
						backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTIgMmgtMnYzaDJ6Ii8+PHBhdGggZD0iTTEuNSAwQTEuNSAxLjUgMCAwIDAgMCAxLjV2MTNBMS41IDEuNSAwIDAgMCAxLjUgMTZoMTNhMS41IDEuNSAwIDAgMCAxLjUtMS41VjIuOTE0YTEuNSAxLjUgMCAwIDAtLjQ0LTEuMDZMMTQuMTQ3LjQzOUExLjUgMS41IDAgMCAwIDEzLjA4NiAwek00IDZhMSAxIDAgMCAxLTEtMVYxaDEwdjRhMSAxIDAgMCAxLTEgMXpNMyA5aDEwYTEgMSAwIDAgMSAxIDF2NUgydi01YTEgMSAwIDAgMSAxLTEiLz48L3N2Zz4=)",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
						backgroundSize: "1rem 1rem",
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
			},
			deleteButton(style: $cssm.Style) {
				return tray.button("\u200b", {
					intent: "alert",
					style: {
						width: "2.5rem",
						height: "2.5rem",
						borderRadius: "50%",
						// prettier-ignore
						backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgMS41djFoMy41YS41LjUgMCAwIDEgMCAxaC0uNTM4bC0uODUzIDEwLjY2QTIgMiAwIDAgMSAxMS4xMTUgMTZoLTYuMjNhMiAyIDAgMCAxLTEuOTk0LTEuODRMMi4wMzggMy41SDEuNWEuNS41IDAgMCAxIDAtMUg1di0xQTEuNSAxLjUgMCAwIDEgNi41IDBoM0ExLjUgMS41IDAgMCAxIDExIDEuNW0tNSAwdjFoNHYtMWEuNS41IDAgMCAwLS41LS41aC0zYS41LjUgMCAwIDAtLjUuNU00LjUgNS4wMjlsLjUgOC41YS41LjUgMCAxIDAgLjk5OC0uMDZsLS41LTguNWEuNS41IDAgMSAwLS45OTguMDZtNi41My0uNTI4YS41LjUgMCAwIDAtLjUyOC40N2wtLjUgOC41YS41LjUgMCAwIDAgLjk5OC4wNThsLjUtOC41YS41LjUgMCAwIDAtLjQ3LS41MjhNOCA0LjVhLjUuNSAwIDAgMC0uNS41djguNWEuNS41IDAgMCAwIDEgMFY1YS41LjUgMCAwIDAtLjUtLjUiLz48L3N2Zz4=)",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
						backgroundSize: "1rem 1rem",
					},
					onClick: ctx.eventHandler(`delete-entry:${style.uuid}`, () => {
						manager.remove(style.uuid);
						ctx.toast.success(`Removed ${style.name} from styles!`);
						tabs.current.set(Tabs.Manager);
					}),
				});
			},
			formatManagerItem(item: $cssm.Style, index?: number, array?: $cssm.Style[]) {
				const buttonStyles = {
					width: "2rem",
					height: "2rem",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					backgroundSize: "1.5rem",
				};
				return tray.flex(
					[
						tray.stack(
							[
								tray.text(`${item.name}`, {
									style: {
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "-webkit-box",
										"-webkit-line-clamp": "2",
										"-webkit-box-orient": "vertical",
										fontWeight: "600",
										wordBreak: "break-word",
									},
								}),
								tray.text(`${item.author}`, {
									style: {
										fontSize: "0.7rem",
										opacity: "0.7rem",
										fontWeight: "bold",
										width: "fit-content",
										border: "1px solid var(--border)",
										borderRadius: "0.4rem",
										padding: "0 0.5rem",
									},
								}),
							],
							{
								style: {
									justifyContent: "space-around",
								},
							}
						),
						tray.flex([
							tray.stack(
								[
									tray.button("\u200b", {
										intent: "gray-subtle",
										className: "bg-transparent",
										style: {
											...buttonStyles,
											backgroundImage: item.enabled
												? "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNyAxMyAzIDMgNy03IiBzdHJva2U9IiMyMzgwNTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+)"
												: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE2Ljk1IDguNDY0YTEgMSAwIDEgMC0xLjQxNC0xLjQxNEwxMiAxMC41ODYgOC40NjUgNy4wNUExIDEgMCAwIDAgNy4wNSA4LjQ2NEwxMC41ODYgMTIgNy4wNSAxNS41MzZhMSAxIDAgMSAwIDEuNDE1IDEuNDE0TDEyIDEzLjQxNGwzLjUzNiAzLjUzNmExIDEgMCAxIDAgMS40MTQtMS40MTRMMTMuNDE0IDEyeiIgZmlsbD0iI2VmNDQ0NGQ5Ii8+PC9zdmc+)",
										},
										onClick: ctx.eventHandler(`toggle-${item.uuid}`, () => {
											manager.toggle(item.uuid);
											tray.update();
										}),
									}),
									tray.button("\u200b", {
										intent: "gray-subtle",
										className: "bg-transparent",
										style: {
											...buttonStyles,
											backgroundSize: "1.2rem",
											backgroundImage:
												"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjZmMyZmYiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik03IDdINmEyIDIgMCAwIDAtMiAydjlhMiAyIDAgMCAwIDIgMmg5YTIgMiAwIDAgMCAyLTJ2LTEiLz48cGF0aCBkPSJNMjAuMzg1IDYuNTg1YTIuMSAyLjEgMCAwIDAtMi45Ny0yLjk3TDkgMTJ2M2gzek0xNiA1bDMgMyIvPjwvc3ZnPg==)",
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
									}),
								],
								{
									gap: 0,
								}
							),
							tray.stack(
								[
									tray.button("\u200b", {
										intent: "gray-subtle",
										className: "bg-transparent",
										disabled: index === 0,
										style: {
											...buttonStyles,
											backgroundSize: "1.2rem",
											backgroundImage:
												"url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSJub25lIj48cGF0aCBzdHJva2U9IiNjYWNhY2EiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJtMTYgMTMtNi02LTYgNiIvPjwvc3ZnPg==)",
										},
										onClick: ctx.eventHandler(`moveup:${item.uuid}`, () => {
											manager.moveUp(item.uuid);
											tray.update();
										}),
									}),
									tray.button("\u200b", {
										intent: "gray-subtle",
										className: "bg-transparent",
										disabled: index && array?.length ? index >= array?.length - 1 : false,
										style: {
											...buttonStyles,
											backgroundSize: "1.2rem",
											backgroundImage:
												"url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSJub25lIj48cGF0aCBzdHJva2U9IiNjYWNhY2EiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJtNCA3IDYgNiA2LTYiLz48L3N2Zz4=)",
										},
										onClick: ctx.eventHandler(`movedown:${item.uuid}`, () => {
											manager.moveDown(item.uuid);
											tray.update();
										}),
									}),
								],
								{
									gap: 0,
								}
							),
						]),
						// tray.button("\u200b", {
						// 	intent: "alert",
						// 	style: {
						// 		width: "1rem",
						// 		height: "1rem",
						// 		position: "absolute",
						// 		top: "calc(0px - 0.25rem)",
						// 		right: "calc(0px - 0.25rem)",
						// 		padding: "0",
						// 		borderRadius: "50%",
						// 		backgroundImage:
						// 			"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNmZmYiIGZpbGw9IiNmZmYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDE2IDE2IiBjbGFzcz0idGV4dC1bMC45NXJlbV0iIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNy4xMTYgOC00LjU1OCA0LjU1OC44ODQuODg0TDggOC44ODRsNC41NTggNC41NTguODg0LS44ODRMOC44ODQgOGw0LjU1OC00LjU1OC0uODg0LS44ODRMOCA3LjExNiAzLjQ0MiAyLjU1OGwtLjg4NC44ODR6IiBzdHJva2U9Im5vbmUiLz48L3N2Zz4=)",
						// 		backgroundSize: "0.65rem",
						// 		backgroundRepeat: "no-repeat",
						// 		backgroundPosition: "center",
						// 	},
						// 	onClick: ctx.eventHandler(`delete:${item.uuid}`, () => {
						// 		manager.remove(item.uuid);
						// 		tray.update();
						// 	}),
						// }),
					],
					{
						style: {
							borderRadius: "0.5rem",
							border: "1px solid var(--border)",
							backgroundColor: "rgb(var(--color-gray-900))",
							justifyContent: "space-between",
							padding: "0.75rem",
							position: "relative",
						},
					}
				);
			},
			formatMarketplaceItem(item: $cssm.Style) {
				const alreadyDownloaded = manager.has(item.uuid);
				return tray.flex(
					[
						tray.stack(
							[
								tray.text(`${item.name}`, {
									style: {
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "-webkit-box",
										"-webkit-line-clamp": "2",
										"-webkit-box-orient": "vertical",
										fontWeight: "600",
										wordBreak: "break-word",
									},
								}),
								tray.text(`${item.author}`, {
									style: {
										fontSize: "0.7rem",
										opacity: "0.7rem",
										fontWeight: "600",
										width: "fit-content",
										border: "1px solid var(--border)",
										borderRadius: "0.4rem",
										padding: "0 0.5rem",
									},
								}),
							],
							{
								style: {
									justifyContent: "space-around",
								},
							}
						),
						tray.stack([
							tray.button("\u200b", {
								intent: "gray-subtle",
								// className: alreadyDownloaded ? "" : "bg-transparent",
								disabled: alreadyDownloaded,
								style: {
									width: "2rem",
									height: "2rem",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									backgroundSize: "1.2rem",
									backgroundImage: alreadyDownloaded
										? "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNyAxMyAzIDMgNy03IiBzdHJva2U9IiMyMzgwNTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+)"
										: "url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNiY2I3ZjAiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00bTQtNSA1IDUgNS01bS01IDVWMyIvPjwvc3ZnPg==)",
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
							}),
							item.link
								? tray.anchor("\u200b", {
										className: "bg-gray-300 hover:bg-gray-200 dark:bg-opacity-10 dark:hover:bg-opacity-20",
										href: item.link,
										style: {
											width: "2rem",
											height: "2rem",
											borderRadius: "0.5rem",
											backgroundRepeat: "no-repeat",
											backgroundPosition: "center",
											backgroundSize: "1rem",
											backgroundImage:
												"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0zMjYuNjEyIDE4NS4zOTFjNTkuNzQ3IDU5LjgwOSA1OC45MjcgMTU1LjY5OC4zNiAyMTQuNTktLjExLjEyLS4yNC4yNS0uMzYuMzdsLTY3LjIgNjcuMmMtNTkuMjcgNTkuMjctMTU1LjY5OSA1OS4yNjItMjE0Ljk2IDAtNTkuMjctNTkuMjYtNTkuMjctMTU1LjcgMC0yMTQuOTZsMzcuMTA2LTM3LjEwNmM5Ljg0LTkuODQgMjYuNzg2LTMuMyAyNy4yOTQgMTAuNjA2LjY0OCAxNy43MjIgMy44MjYgMzUuNTI3IDkuNjkgNTIuNzIxIDEuOTg2IDUuODIyLjU2NyAxMi4yNjItMy43ODMgMTYuNjEybC0xMy4wODcgMTMuMDg3Yy0yOC4wMjYgMjguMDI2LTI4LjkwNSA3My42Ni0xLjE1NSAxMDEuOTYgMjguMDI0IDI4LjU3OSA3NC4wODYgMjguNzQ5IDEwMi4zMjUuNTFsNjcuMi02Ny4xOWMyOC4xOTEtMjguMTkxIDI4LjA3My03My43NTcgMC0xMDEuODMtMy43MDEtMy42OTQtNy40MjktNi41NjQtMTAuMzQxLTguNTY5YTE2LjA0IDE2LjA0IDAgMCAxLTYuOTQ3LTEyLjYwNmMtLjM5Ni0xMC41NjcgMy4zNDgtMjEuNDU2IDExLjY5OC0yOS44MDZsMjEuMDU0LTIxLjA1NWM1LjUyMS01LjUyMSAxNC4xODItNi4xOTkgMjAuNTg0LTEuNzMxYTE1Mi41IDE1Mi41IDAgMCAxIDIwLjUyMiAxNy4xOTdNNDY3LjU0NyA0NC40NDljLTU5LjI2MS01OS4yNjItMTU1LjY5LTU5LjI3LTIxNC45NiAwbC02Ny4yIDY3LjJjLS4xMi4xMi0uMjUuMjUtLjM2LjM3LTU4LjU2NiA1OC44OTItNTkuMzg3IDE1NC43ODEuMzYgMjE0LjU5YTE1Mi41IDE1Mi41IDAgMCAwIDIwLjUyMSAxNy4xOTZjNi40MDIgNC40NjggMTUuMDY0IDMuNzg5IDIwLjU4NC0xLjczMWwyMS4wNTQtMjEuMDU1YzguMzUtOC4zNSAxMi4wOTQtMTkuMjM5IDExLjY5OC0yOS44MDZhMTYuMDQgMTYuMDQgMCAwIDAtNi45NDctMTIuNjA2Yy0yLjkxMi0yLjAwNS02LjY0LTQuODc1LTEwLjM0MS04LjU2OS0yOC4wNzMtMjguMDczLTI4LjE5MS03My42MzkgMC0xMDEuODNsNjcuMi02Ny4xOWMyOC4yMzktMjguMjM5IDc0LjMtMjguMDY5IDEwMi4zMjUuNTEgMjcuNzUgMjguMyAyNi44NzIgNzMuOTM0LTEuMTU1IDEwMS45NmwtMTMuMDg3IDEzLjA4N2MtNC4zNSA0LjM1LTUuNzY5IDEwLjc5LTMuNzgzIDE2LjYxMiA1Ljg2NCAxNy4xOTQgOS4wNDIgMzQuOTk5IDkuNjkgNTIuNzIxLjUwOSAxMy45MDYgMTcuNDU0IDIwLjQ0NiAyNy4yOTQgMTAuNjA2bDM3LjEwNi0zNy4xMDZjNTkuMjcxLTU5LjI1OSA1OS4yNzEtMTU1LjY5OS4wMDEtMjE0Ljk1OSIgc3Ryb2tlPSJub25lIi8+PC9zdmc+)",
										},
								  })
								: [],
						]),
					],
					{
						style: {
							borderRadius: "0.5rem",
							border: "1px solid var(--border)",
							backgroundColor: "rgb(var(--color-gray-900))",
							justifyContent: "space-between",
							padding: "0.75rem",
						},
					}
				);
			},
			loadingItem() {
				return tray.div([], {
					className: "animate-pulse",
					style: {
						width: "100%",
						height: "5rem",
						borderRadius: "0.5rem",
						backgroundColor: "rgb(var(--color-gray-800))",
					},
				});
			},
			[Tabs.Manager]() {
				const header = this.header("Custom CSS Manager", "Manage styles more effeciently", [
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
									padding: "0",
									paddingInlineStart: "0.5rem",
								},
								onClick: ctx.eventHandler("goto:create", () => {
									tabs.current.set(Tabs.Editor);
									fieldRef.editor.controller.setValue("");
									fieldRef.editor.desktop.setValue("");
									fieldRef.editor.mobile.setValue("");
									fieldRef.editor.name.setValue("");
									state.currentStyle.set(null);
								}),
							}),
							tray.button("\u200b", {
								intent: "gray-subtle",
								className: "bg-transparent",
								style: {
									width: "2.5rem",
									height: "2.5rem",
									borderRadius: "50%",
									// prettier-ignore
									backgroundImage:"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJVSS1TdGF0aWNUYWJzX19pY29uIC1tbC0wLjUgbXItMiBoLTQgdy00IiBhcmlhLWhpZGRlbj0idHJ1ZSIgZGF0YS1jdXJyZW50PSJ0cnVlIiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTUgMTEtMSA5bTUtOS00LTdNMiAxMWgyME0zLjUgMTFsMS42IDcuNGEyIDIgMCAwIDAgMiAxLjZoOS44YTIgMiAwIDAgMCAyLTEuNmwxLjctNy40TTQuNSAxNS41aDE1TTUgMTFsNC03bTAgNyAxIDkiLz48L3N2Zz4=)",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									backgroundSize: "1.5rem",
									padding: "0",
									paddingInlineStart: "0.5rem",
								},
								onClick: ctx.eventHandler("goto:marketplace", () => {
									// clear fieldrefs
									tabs.current.set(Tabs.Marketplace);
								}),
							}),
						],
						{
							style: {
								alignItems: "center",
							},
						}
					),
				]);

				const storage = manager.storage;

				const body = tray.div(
					[
						storage.length
							? tray.stack(storage.map(this.formatManagerItem), { style: { marginRight: "0.25rem", marginTop: "0.25rem" } })
							: tray.text("No styles yet!", {
									style: {
										alignContent: "center",
										textAlign: "center",
										height: "100%",
										backgroundColor: "rgb(var(--color-gray-900))",
										border: "0.25rem dashed var(--border)",
										borderRadius: "0.5rem",
										fontSize: "1.5rem",
										fontWeight: "bold",
										color: "rgb(var(--color-gray-500))",
									},
							  }),
					],
					{
						style: { height: "28rem", overflowY: "scroll" },
					}
				);

				return tray.stack([header, body], { style: { padding: "0.5rem" } });
			},
			[Tabs.Editor]() {
				const currentStyle = state.currentStyle.get();

				const header = this.header(currentStyle ? "Edit Style" : "Create Style", currentStyle ? "Edit current style" : "Create new style", [
					tray.flex([this.backButton()], {
						style: {
							alignItems: "center",
						},
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

				const body = tray.stack(
					[
						tray.flex(
							[
								tray.text("Name", {
									style: {
										width: "fit-content",
										height: "100%",
										wordBreak: "normal",
										alignContent: "center",
										padding: "0 0.75rem",
										backgroundColor: "rgb(var(--color-gray-900))",
										border: "1px solid var(--border)",
										borderRadius: "0.5rem 0 0 0.5rem",
									},
								}),
								tray.input({
									fieldRef: fieldRef.editor.name,
									placeholder: "Name for your custom style",
									style: {
										borderRadius: "0 0.5rem 0.5rem 0",
										marginLeft: "-1px",
									},
								}),
							],
							{
								gap: 0,
								style: {
									alignItems: "center",
								},
							}
						),
						tray.stack(
							[
								tray.flex(
									[
										tray.button("Desktop", {
											className: `bg-transparent ${state.editorSelectedScreen.get() === "desktop" ? "" : "hover:bg-gray-600"}`,
											disabled: state.tabBtnDisabled.get(),
											style: {
												width: "100%",
												borderRadius: "0.5rem 0.5rem 0 0",
												// if selected
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
										}),
										tray.button("Mobile", {
											className: `bg-transparent ${state.editorSelectedScreen.get() === "mobile" ? "" : "hover:bg-gray-600"}`,
											disabled: state.tabBtnDisabled.get(),
											style: {
												width: "100%",
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
										}),
									],
									{ gap: 0 }
								),
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
									onChange: ctx.eventHandler("screen-controller", ({ value }) => {
										fieldRef.editor[state.editorSelectedScreen.get()].setValue(value);
									}),
								}),
							],
							{
								gap: 0,
							}
						),
						tray.flex([currentStyle ? this.deleteButton(currentStyle) : [], this.saveButton(currentStyle ?? undefined)], {
							style: {
								justifyContent: "end",
							},
						}),
					],
					{
						gap: 5,
						style: { height: "28rem" },
					}
				);

				return tray.stack([header, body], { style: { padding: "0.5rem" } });
			},
			[Tabs.Marketplace]() {
				const header = this.header("Community made styles", "Download community made css snippets", [
					tray.flex(
						[
							this.backButton(),
							tray.button("\u200b", {
								intent: "gray-subtle",
								loading: state.isFetching.get(),
								className: "bg-transparent",
								style: {
									width: "2.5rem",
									height: "2.5rem",
									borderRadius: "50%",
									// prettier-ignore
									backgroundImage: state.isFetching.get() ? "" : "url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDAtOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4Ii8+PHBhdGggZD0iTTMgM3Y1aDVtLTUgNGE5IDkgMCAwIDAgOSA5IDkuNzUgOS43NSAwIDAgMCA2Ljc0LTIuNzRMMjEgMTYiLz48cGF0aCBkPSJNMTYgMTZoNXY1Ii8+PC9zdmc+",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									backgroundSize: "1.3rem",
									padding: "0",
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
							}),
						],
						{
							style: {
								alignItems: "center",
							},
						}
					),
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
					}
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
