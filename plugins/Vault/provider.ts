/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./vault.d.ts" />

// @ts-ignore
function init() {
	$ui.register(async (ctx) => {
		// states
		const currentTrayPage = ctx.state<number>(1);
		// prettier-ignore
		const currentMedia = ctx.state<$app.AL_BaseAnime|$app.AL_BaseManga | null>(null);
		const currentShelf = ctx.state<string | null>(null);

		// Field Refs
		const newShelfName = ctx.fieldRef<string>("");
		// prettier-ignore
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Vault/icon.png";
		// prettier-ignore
		const shelfIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2NhY2FjYSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMiAyYTIgMiAwIDAgMSAyLTJoOGEyIDIgMCAwIDEgMiAydjEzLjVhLjUuNSAwIDAgMS0uNzc3LjQxNkw4IDEzLjEwMWwtNS4yMjMgMi44MTVBLjUuNSAwIDAgMSAyIDE1LjV6bTItMWExIDEgMCAwIDAtMSAxdjEyLjU2Nmw0LjcyMy0yLjQ4MmEuNS41IDAgMCAxIC41NTQgMEwxMyAxNC41NjZWMmExIDEgMCAwIDAtMS0xeiIvPjxwYXRoIGQ9Ik04IDRhLjUuNSAwIDAgMSAuNS41VjZIMTBhLjUuNSAwIDAgMSAwIDFIOC41djEuNWEuNS41IDAgMCAxLTEgMFY3SDZhLjUuNSAwIDAgMSAwLTFoMS41VjQuNUEuNS41IDAgMCAxIDggNCIvPjwvc3ZnPg==";
		// prettier-ignore
		const deleteIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2NhY2FjYSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMi41IDFhMSAxIDAgMCAwLTEgMXYxYTEgMSAwIDAgMCAxIDFIM3Y5YTIgMiAwIDAgMCAyIDJoNmEyIDIgMCAwIDAgMi0yVjRoLjVhMSAxIDAgMCAwIDEtMVYyYTEgMSAwIDAgMC0xLTFIMTBhMSAxIDAgMCAwLTEtMUg3YTEgMSAwIDAgMC0xIDF6bTMgNGEuNS41IDAgMCAxIC41LjV2N2EuNS41IDAgMCAxLTEgMHYtN2EuNS41IDAgMCAxIC41LS41TTggNWEuNS41IDAgMCAxIC41LjV2N2EuNS41IDAgMCAxLTEgMHYtN0EuNS41IDAgMCAxIDggNW0zIC41djdhLjUuNSAwIDAgMS0xIDB2LTdhLjUuNSAwIDAgMSAxIDAiLz48L3N2Zz4=";
		const iconStyles = {
			backgroundRepeat: "no-repeat",
			backgroundPosition: "0.65em center",
			textIndent: "1.8em",
		};

		const Vault = {
			storageId: "ee67ab39-47e3-4e19-be06-d55ccaf50f36",

			init() {
				if (!$storage.get(this.storageId)) {
					$storage.set(this.storageId, []);
				}
			},

			getCollection(): Map<string, VaultItem> {
				this.init();
				const items: VaultItem[] = $storage.get(this.storageId)!;
				return new Map(items.map((e) => [e.name, e]));
			},

			persist(collection: Map<string, VaultItem>) {
				$storage.set(this.storageId, Array.from(collection.values()));
			},

			getOrCreateShelf(shelfName: string, type: "ANIME" | "MANGA") {
				const collection = this.getCollection();
				if (!collection.has(shelfName)) {
					collection.set(shelfName, { name: shelfName, type, entries: [] });
					this.persist(collection);
				}
				return collection.get(shelfName)!;
			},

			removeShelf(shelfName: string) {
				const collection = this.getCollection();
				collection.delete(shelfName);
				this.persist(collection);
			},

			// prettier-ignore
			addToShelf(shelfName: string, data: VaultItem["entries"][number], type: "ANIME" | "MANGA") {
				const collection = this.getCollection();
				const shelf = this.getOrCreateShelf(shelfName, type);
				shelf.entries = Array.from(new Map(shelf.entries.map(s => [s.id,s])).set(data.id, data).values());
				collection.set(shelfName, shelf);
				this.persist(collection);
			},

			removeFromShelf(
				shelfName: string,
				mediaId: number,
				type: "ANIME" | "MANGA"
			) {
				const collection = this.getCollection();
				const shelf = this.getOrCreateShelf(shelfName, type);
				shelf.entries = shelf.entries.filter((e) => e.id !== mediaId);
				collection.set(shelfName, shelf);
				this.persist(collection);
			},

			// prettier-ignore
			normalizeMediaToVaultItem(media: $app.AL_BaseAnime | $app.AL_BaseManga): VaultItem["entries"][number]{
				return {
					id: media.id,
					title: {
						userPreferred: media.title?.userPreferred ?? "",
						synonyms: [
							media.title?.english ?? "",
							media.title?.romaji ?? "",
							media.title?.native ?? "",
							...(media.synonyms ?? []),
						].filter(Boolean),
					},
					coverImage: media.coverImage?.large ?? "",
					season: media.season ?? null,
					seasonYear: "seasonYear" in media ? media.seasonYear ?? null : null,
				};
			},
		};

		const dropdownItem = ctx.action.newAnimePageDropdownItem({
			label: "Add to shelf",
			style: { ...iconStyles, backgroundImage: `url(${shelfIcon})` },
		});

		const animeButton = ctx.action.newAnimePageButton({
			label: "Add to shelf",
		});

		animeButton.mount();
		animeButton.onClick(handleClick);

		dropdownItem.mount();
		dropdownItem.onClick(handleClick);

		function handleClick(e: { media: $app.AL_BaseAnime }) {
			currentMedia.set(e.media);
			currentTrayPage.set(0);
			ctx.setTimeout(() => tray.open(), 500);
		}

		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
			width: "45rem",
		});

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

			const header_text = tray.text("Vault", {
				style: {
					fontSize: "1.2em",
					"font-weight": "700",
					"user-select": "none",
				},
			});

			const header_subtext = tray.text(
				"Create, Edit, and View your personal curated lists!",
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

			if (currentTrayPage.get() === 0 && currentMedia.get() !== null) {
				const media = currentMedia.get()!;

				const header = tray.flex(
					[
						pluginIcon,
						tray.flex([header_text, header_subtext], {
							direction: "column",
							gap: 1,
						}),
					],
					{ direction: "row", gap: 3 }
				);

				const body = tray.stack(
					[
						tray.text(`Add ${media.title?.userPreferred} to a shelf:`),
						tray.flex([formatShelves()], {
							gap: 1,
							direction: "row",
							style: {
								flexWrap: "wrap",
							},
						}),
						tray.flex([
							tray.div([], { style: { flex: "1" } }),
							tray.button("New shelf", {
								intent: "gray-subtle",
								size: "md",
								onClick: ctx.eventHandler("create-new-shelf", () => {
									currentTrayPage.set(3);
									tray.update();
								}),
							}),
						]),
					],
					{ style: { padding: "10px" }, gap: 5 }
				);

				return tray.stack([header, body], { gap: 1 });
			}

			// Page when user clicks on the tray icon
			if (currentTrayPage.get() === 1) {
				const header = tray.flex(
					[
						pluginIcon,
						tray.flex([header_text, header_subtext], {
							direction: "column",
							gap: 1,
						}),
					],
					{ direction: "row", gap: 3 }
				);
				const body = tray.stack(
					[
						tray.text(`Explore your vault`),
						tray.flex([formatShelves()], {
							gap: 1,
							direction: "row",
							style: {
								flexWrap: "wrap",
							},
						}),
						tray.flex([
							tray.div([], { style: { flex: "1" } }),
							tray.button("New shelf", {
								intent: "gray-subtle",
								size: "md",
								onClick: ctx.eventHandler("create-new-shelf", () => {
									currentTrayPage.set(3);
									tray.update();
								}),
							}),
						]),
					],
					{ style: { padding: "10px" }, gap: 5 }
				);

				return tray.stack([header, body], { gap: 1 });
			}

			// Page when user clicks a shelf
			if (currentTrayPage.get() === 2) {
				const header = tray.flex(
					[
						pluginIcon,
						tray.flex([header_text, header_subtext], {
							direction: "column",
							gap: 1,
						}),
					],
					{ direction: "row", gap: 3 }
				);
				const body = tray.stack(
					[
						tray.text(currentShelf.get() ?? "", {
							style: {
								fontSize: "1.2em",
							},
						}),
						tray.flex([formatEntries()], {
							gap: 1,
							direction: "row",
							style: {
								flexWrap: "wrap",
							},
						}),
						tray.flex([
							tray.div([], { style: { flex: "1" } }),
							tray.button("Go Back", {
								intent: "gray-subtle",
								size: "md",
								onClick: ctx.eventHandler("go-back", () => {
									currentMedia.set(null);
									currentTrayPage.set(1);
									currentShelf.set(null);
									tray.update();
								}),
							}),
							tray.button("Delete Shelf", {
								intent: "alert",
								size: "md",
								onClick: ctx.eventHandler("delete-shelf", () => {
									Vault.removeShelf(currentShelf.get() ?? "");
									currentMedia.set(null);
									currentTrayPage.set(1);
									currentShelf.set(null);
									tray.update();
								}),
							}),
						]),
					],
					{ style: { padding: "10px" }, gap: 5 }
				);

				return tray.stack([header, body], { gap: 1 });
			}

			// Page for when creating a new shelf
			if (currentTrayPage.get() === 3) {
				const header = tray.flex(
					[
						pluginIcon,
						tray.flex([header_text, header_subtext], {
							direction: "column",
							gap: 1,
						}),
					],
					{ direction: "row", gap: 3 }
				);

				const body = tray.stack(
					[
						tray.input({
							placeholder: "Shelf name",
							size: "md",
							fieldRef: newShelfName,
						}),
						tray.flex([
							tray.div([], { style: { flex: "1" } }),
							tray.button("Go Back", {
								intent: "gray-subtle",
								size: "md",
								onClick: ctx.eventHandler("go-back", () => {
									currentMedia.set(null);
									currentTrayPage.set(1);
									currentShelf.set(null);
									tray.update();
								}),
							}),
							tray.button("Create new shelf", {
								intent: "gray-subtle",
								size: "md",
								onClick: ctx.eventHandler("saveNewShelf", () => {
									const shelfName = newShelfName.current;
									if (!shelfName.length) {
										ctx.toast.error("Please input a shelf name");
										return;
									}

									if (Vault.getCollection().has(shelfName)) {
										ctx.toast.error(`Shelf [${shelfName}] already exists!`);
										return;
									}

									const newShelf = Vault.getOrCreateShelf(shelfName, "ANIME");
									const media = currentMedia.get();
									if (media !== null) {
										Vault.addToShelf(
											newShelf.name,
											Vault.normalizeMediaToVaultItem(media),
											"ANIME"
										);
										ctx.toast.success(
											`Added [${media.title?.userPreferred}] to [${newShelf.name}]`
										);
									} else {
										ctx.toast.success(
											`Successfully created new shelf: [${newShelf.name}]`
										);
									}
									currentMedia.set(null);
									currentTrayPage.set(1);
									currentShelf.set(null);
									newShelfName.setValue("");
									tray.update();
								}),
							}),
						]),
					],
					{ style: { padding: "10px" } }
				);

				return tray.stack([header, body], { gap: 1 });
			}

			return tray.text("something");
		});

		tray.onClose(() => {
			currentMedia.set(null);
			currentTrayPage.set(1);
			currentShelf.set(null);
		});

		function formatShelves() {
			const shelves = Array.from(Vault.getCollection().values());
			const noShelves = tray.text("No Shelves", {
				// prettier-ignore
				className: "bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl text-center",
				style: {
					padding: "25px 0",
					fontSize: "1.5em",
					fontWeight: "500",
					color: "#666",
				},
			});
			if (!shelves.length) return [noShelves];

			return Array.from(shelves)
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((shelf) => {
					// prettier-ignore
					const coverImage = shelf.entries.length ? shelf.entries[Math.floor(Math.random() * shelf.entries.length)].coverImage : ""

					const cover = tray.div([], {
						className: "coverImage",
						style: {
							width: "100%",
							height: "6em",
							flexShrink: "0",
							flexGrow: "0",
							backgroundImage: `url(${coverImage})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						},
					});

					const backdrop = tray.div([], {
						className: "backdrop",
						style: {
							background:
								"linear-gradient( to right, rgb(var(--color-gray-900)) 10%, rgba(16,16,16,0.8) 50%, rgba(16,16,16,0.5) 100% )",
							width: "100%",
							height: "100%",
							position: "absolute",
							top: "0",
							left: "0",
						},
					});

					const image = tray.flex([cover, backdrop], {
						style: { position: "relative", width: "15em", overflow: "hidden" },
					});

					const text = tray.flex(
						[
							tray.text(shelf.name, {
								style: {
									fontWeight: "600",
									fontSize: "1.2em",
									zIndex: "1",
									overflow: "hidden",
									display: "-webkit-box",
									WebkitBoxOrient: "vertical",
									WebkitLineClamp: "2",
									wordBreak: "break-word",
									lineHeight: "normal",
								},
							}),
							tray.div([], { style: { flex: "1" } }),
							tray.text(
								`${shelf.entries.length} ${
									shelf.entries.length > 1 ? "entries" : "entry"
								}`,
								{
									style: { fontSize: "14px", color: "#666", zIndex: "1" },
								}
							),
						],
						{
							gap: 1,
							direction: "column",
							style: { padding: "0.75em", height: "6em", width: "100%" },
						}
					);

					const background = tray.flex(
						[tray.div([], { style: { flex: "1" } }), image],
						{
							direction: "row",
							className: "bg-gray-900 rounded-xl",
							style: {
								overflow: "hidden",
								position: "absolute",
								width: "100%",
								left: "0",
								top: "0",
							},
						}
					);

					const button = tray.button("", {
						onClick: ctx.eventHandler(`shelf-navigate-${shelf.name}`, () => {
							if (currentMedia.get() !== null) {
								const media = currentMedia.get()!;
								Vault.addToShelf(
									shelf.name,
									Vault.normalizeMediaToVaultItem(media),
									media.type ?? "ANIME"
								);
								currentTrayPage.set(1);
								currentShelf.set(null);
								currentMedia.set(null);
								tray.close();
								ctx.toast.success(
									`Added ${media.title?.userPreferred} to ${shelf.name}!`
								);
								return;
							} else {
								currentTrayPage.set(2);
								currentShelf.set(shelf.name);
								tray.update();
							}
							// tray.close();
						}),
						style: {
							background: "transparent",
							border: "none",
							color: "transparent",
							cursor: "pointer",
							height: "100%",
							left: "0px",
							position: "absolute",
							top: "0px",
							width: "100%",
							zIndex: "2",
						},
					});

					return tray.flex([background, text, button], {
						direction: "row",
						className: "bg-gray-900 rounded-xl vault-shelf-btn",
						style: {
							overflow: "hidden",
							position: "relative",
							flex: "0.5",
							minWidth: "18em",
						},
					});
				});
		}

		function formatEntries() {
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

			const collection = Vault.getCollection();
			const shelfName = currentShelf.get();

			if (!shelfName || !collection.has(shelfName)) return [noEntries];
			const entries = collection.get(shelfName)?.entries ?? [];

			if (!entries.length) return [noEntries];

			return entries
				.sort((a, b) =>
					a.title.userPreferred.localeCompare(b.title.userPreferred)
				)
				.map((media) => {
					const buttonStyle = {
						background: "transparent",
						border: "none",
						color: "transparent",
						cursor: "pointer",
						height: "100%",
						left: "0px",
						position: "absolute",
						top: "0px",
						width: "100%",
					};

					const coverImage = tray.div([], {
						className: "coverImage",
						style: {
							width: "100%",
							height: "15rem",
							flexShrink: "0",
							flexGrow: "0",
							backgroundImage: `url(${media.coverImage})`,
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
						},
					});

					const backdrop = tray.div([], {
						className: "backdrop",
						style: {
							background:
								"linear-gradient(to top, rgba(0,0,0,1)0%, rgba(0,0,0,1)15%, rgba(0,0,0,0)100%)",
							width: "100%",
							height: "100%",
							position: "absolute",
							top: "0",
							left: "0",
						},
					});

					const title = tray.text(
						String(media.title.userPreferred) || "\u200b",
						{
							style: {
								userSelect: "none",
								padding: "0 10px",
								lineHeight: "1.2",
								fontWeight: "600",
								fontSize: "14px",
								whiteSpace: "normal",
								wordBreak: "break-word",

								display: "-webkit-box",
								WebkitBoxOrient: "vertical",
								WebkitLineClamp: "3",
								overflow: "hidden",

								maxHeight: "calc(1.2em * 3)",
								position: "absolute",
								bottom: "10px",
								left: "0",
								width: "100%",
							},
						}
					);

					const goToPageBtn = tray.button("", {
						onClick: ctx.eventHandler(`note-navigate-${media.id}`, () => {
							ctx.screen.navigateTo("/entry", { id: media.id.toString() });
							currentTrayPage.set(1);
							currentShelf.set(null);
							currentMedia.set(null);
							tray.close();
						}),
						intent: "gray-subtle",
						style: { ...buttonStyle },
					});

					const deleteButton = tray.button("\u200b\u2000\u200b", {
						onClick: ctx.eventHandler(`remove-from-shelf-${media.id}`, () => {
							Vault.removeFromShelf(shelfName, media.id, "ANIME");
							tray.update();
						}),
						intent: "alert",
						style: {
							position: "absolute",
							top: "5px",
							right: "5px",
							backgroundImage: `url(${deleteIcon})`,
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
							opacity: "1",
						},
					});

					return tray.flex(
						[coverImage, backdrop, title, goToPageBtn, deleteButton],
						{
							className:
								"bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl vault-entries",
							direction: "column",
							style: {
								overflow: "hidden",
								position: "relative",
								width: "10rem",
								borderRadius: "0.75em",
							},
						}
					);
				});
		}

		ctx.dom.onReady(() =>
			ctx.dom
				.createElement("style")
				.then((e) =>
					e.setInnerHTML(
						`.vault-shelf-btn:hover .coverImage { transform: scale(1.1); transition: transform 0.3s ease; } .vault-shelf-btn:hover .backdrop { background: linear-gradient(to right, rgba(16,16,16,1)10%, rgba(16,16,16,0.5)50%, rgba(0,0,0,0)90%)!important; } .vault-entries:hover .coverImage { transform: scale(1.05); transition: transform 0.3s ease; } .vault-entries:hover .backdrop { background: linear-gradient(to top, rgba(0,0,0,1)0%, rgba(0,0,0,0.8)15%, rgba(0,0,0,0)50%)!important; }`
					)
				)
		);
	});
}
