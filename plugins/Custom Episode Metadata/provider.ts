/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./provider.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Custom%20Episode%20Metadata/icon.png";

		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
			width: "35rem",
		});

		enum Tab {
			Library = "1",
			AnimePage = "2",
			EpisodeEditor = "3",
		}

		const fieldRefs = {
			sharedState: {
				mediaId: ctx.state<number | null>(null),
				episodeNumber: ctx.state<number | null>(null),
				type: ctx.state<$app.Anime_LocalFileType | null>(null),
			},
			custom: {
				displayTitle: ctx.fieldRef<string>(),
				episodeTitle: ctx.fieldRef<string>(),
				length: ctx.fieldRef<string>(),
				airDateYear: ctx.fieldRef<string>(),
				airDateMonth: ctx.fieldRef<string>(),
				airDateDay: ctx.fieldRef<string>(),
				overview: ctx.fieldRef<string>(),
				image: ctx.fieldRef<string>(),
			},
			base: {
				displayTitle: ctx.fieldRef<string | undefined>(),
				episodeTitle: ctx.fieldRef<string | undefined>(),
				length: ctx.fieldRef<string | undefined>(),
				airDateYear: ctx.fieldRef<string | undefined>(),
				airDateMonth: ctx.fieldRef<string | undefined>(),
				airDateDay: ctx.fieldRef<string | undefined>(),
				overview: ctx.fieldRef<string | undefined>(),
				image: ctx.fieldRef<string | undefined>(),
			},
			set(base: Partial<CEM.CustomEpisodeMetadata>, custom: CEM.CustomEpisodeMetadata, media: $app.AL_BaseAnime) {
				const types = [
					{ name: "base" as const, ...base },
					{ name: "custom" as const, ...custom },
				];

				this.sharedState.mediaId.set(custom.mediaId);
				this.sharedState.type.set(custom.type);
				this.sharedState.episodeNumber.set(custom.episodeNumber);

				state.currentMediaTitle.set(media.title?.userPreferred ?? "");
				state.currentMediaBg.set(media.bannerImage ?? media.coverImage?.large ?? "");

				for (const type of types) {
					for (const prop of Object.keys(type) as Array<keyof typeof type>) {
						if (!(prop in this[type.name]) && prop !== "airDate") continue;

						if (prop === "airDate") {
							this[type.name].airDateYear.setValue(type.airDate?.year?.toString() ?? "");
							this[type.name].airDateMonth.setValue(type.airDate?.month?.toString() ?? "");
							this[type.name].airDateDay.setValue(type.airDate?.day?.toString() ?? "");
							continue;
						}

						const key = prop as Array<Exclude<keyof typeof type, "mediaId" | "type" | "episodeNumber" | "aniDBEpisode" | "airDate" | "name">>[number];
						this[type.name][key].setValue(type[key]?.toString() ?? "");
					}
				}
			},
			reset() {
				for (const key of Object.keys(this.sharedState) as Array<keyof typeof this.sharedState>) {
					(this.sharedState[key] as $ui.State<any>).set(null);
				}

				for (const type of ["custom", "base"] as const) {
					for (const prop of Object.keys(this[type]) as Array<keyof (typeof this)[typeof type]>) {
						this[type][prop].setValue("");
					}
				}
			},

			resetCustom() {
				for (const prop of Object.keys(this.custom) as Array<keyof typeof this.custom>) {
					this.custom[prop].setValue("");
				}
			},
		};

		const state = {
			saving: ctx.state<boolean>(false),
			deleting: ctx.state<boolean>(false),
			currentMediaId: ctx.state<number | null>(null),
			currentMediaBg: ctx.state<string>(""),
			currentMediaTitle: ctx.state<string>(""),
		};

		const storage = {
			key: "CUSTOM_EPISODE_METADATA_STORAGE",
			getAll() {
				return Object.values(($storage.get(this.key) ?? {}) as Record<number, CEM.Entry>);
			},
			get(mediaId: number, mediaTitle?: string) {
				return (
					(($storage.get(this.key) ?? {}) as Record<number, CEM.Entry>)[mediaId] ?? {
						mediaId,
						mediaTitle,
						main: {},
						special: {},
						nc: {},
					}
				);
			},
			_set(mediaId: number, data: CEM.Entry) {
				const obj = $storage.get(this.key) ?? {};
				obj[mediaId] = data;
				try {
					$storage.set(this.key, obj);
					return data;
				} catch (e) {
					return null;
				}
			},
			has(mediaId: number) {
				return mediaId in ($storage.get(this.key) ?? {});
			},
			save(data: CEM.CustomEpisodeMetadata) {
				const entry = this.get(data.mediaId);
				entry[data.type][data.episodeNumber] = data;
				this._set(data.mediaId, entry);
				return this.get(data.mediaId);
			},
			delete(mediaId: number, type: $app.Anime_LocalFileType, episodeNumber: number) {
				const entry = this.get(mediaId);
				delete entry[type][episodeNumber];
				this._set(mediaId, entry);
				return this.get(mediaId);
			},
		};

		const tabs = {
			current: ctx.state<Tab>(Tab.Library),
			withBanner(container: any[]) {
				const banner = tray.div([], {
					style: {
						position: "absolute",
						top: "-0.75rem",
						left: "-0.75rem",
						width: "calc(100% + 1.5rem)",
						height: "10rem",
						borderRadius: "0.75rem 0.75rem 0 0",
						pointerEvents: "none",
						background: `url(${state.currentMediaBg.get()})`,
						backgroundPosition: "center",
						backgroundSize: "cover",
						maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
					},
				});

				return tray.div([banner, tray.div(container, { style: { position: "relative", height: "100%" } })], {
					style: { position: "relative", height: "33.5rem" },
				});
			},

			[Tab.Library]() {
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
								tray.text("Custom Episode Metadata", { style: { fontSize: "1.2rem", fontWeight: "bold" } }),
								tray.text("Navigate to an anime page to edit their episode metadata", { style: { fontSize: "0.8rem", color: "#818181" } }),
							],
							{
								style: {
									lineHeight: "1rem",
								},
							}
						),
					],
					{ gap: 4, style: { padding: "0.5rem 0" } }
				);
			},

			[Tab.AnimePage]() {
				if (!state.currentMediaId.get()) return tabs.current.set(Tab.Library);

				const header = tray.div(
					[
						tray.text("Custom Episode Metadata for", { style: { fontSize: "13px" } }),
						tray.text(String(state.currentMediaTitle.get() ?? ""), {
							style: {
								fontWeight: "bold",
								fontSize: "1.2em",
								wordBreak: "break-word",
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								"-webkit-line-clamp": "3",
								"-webkit-box-orient": "vertical",
							},
						}),
					],
					{
						style: {
							maxWidth: "80%",
							color: "#fff",
							textShadow: "0 0 10px black",
						},
					}
				);

				const entries = (["main", "special"] as const)
					.map((type) => Object.values(storage.get(state.currentMediaId.get()!)[type]).sort((A, B) => A!.episodeNumber - B!.episodeNumber))
					.flat()
					.map((e, i, arr) =>
						tray.flex(
							[
								tray.stack(
									[
										tray.text(`Episode ${e?.episodeNumber?.toString().padStart(2, "0")}`, { style: { fontSize: "0.8rem" } }),
										tray.text(String(e?.type.toUpperCase()), { style: { fontSize: "0.6rem" } }),
									],
									{
										gap: 0,
										style: { justifyContent: "center", textAlign: "center", padding: "1rem", textWrap: "nowrap" },
									}
								),
								tray.stack(
									[
										tray.text(`Title: ${e?.episodeTitle || "<Unchanged>"}`, {
											style: {
												flex: "1",
												minWidth: "0",
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",
											},
										}),
										tray.text(`Duration: ${e?.length ? `${e.length} minutes` : "<Unchanged>"}`),
										tray.text(
											`Air Date: ${
												e?.airDate
													? `${e.airDate.day?.toString().padStart(2, "0")}-${e.airDate.month?.toString().padStart(2, "0")}-${e.airDate.year}`
													: "<Unchanged>"
											}`
										),
										tray.text(`Overview: ${e?.overview || "<Unchanged>"}`, {
											style: { flex: "1", minWidth: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
										}),
										tray.text(`Image Url: ${e?.image || "<Unchanged>"}`, {
											style: { flex: "1", minWidth: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
										}),
									],
									{
										gap: 0,
										style: { alignItems: "center", padding: "1rem", overflow: "hidden", fontSize: "0.8rem", width: "100%" },
									}
								),
								tray.flex(
									[
										tray.button("\u200b", {
											intent: "alert",
											disabled: state.deleting.get(),
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
											onClick: ctx.eventHandler(`delete-entry:${e?.type}:${e?.episodeNumber}`, () => {
												state.deleting.set(true);
												storage.delete(state.currentMediaId.get()!, "main", e?.episodeNumber!);
												ctx.anime.clearEpisodeMetadataCache();
												ctx.setTimeout(() => {
													tray.update();
													$app.invalidateClientQuery(["ANIME-ENTRIES-get-anime-entry", "ANIME-get-anime-episode-collection"]);
													ctx.toast.success(`Deleted custom metadata for [${e?.mediaId}] episode ${e?.episodeNumber}!`);
													state.deleting.set(false);
												}, 1_500);
											}),
										}),
									],
									{
										style: {
											alignItems: "center",
											padding: "1rem",
										},
									}
								),
							],
							{
								gap: 0,
								style: {
									width: "100%",
									lineHeight: "1rem",
									background: `rgb(${i % 2 === 0 ? "var(--color-gray-900)" : "var(--color-gray-800)"})`,
									paddingTop: i === 0 ? "1.5rem" : "",
									paddingBottom: i === arr.length - 1 ? "1.5rem" : "",
								},
							}
						)
					);

				if (!entries.length) {
					entries.push(
						tray.text("You have no custom episode metadata for this entry.", {
							style: {
								height: "100%",
								width: "100%",
								alignContent: "center",
								textAlign: "center",
							},
						})
					);
				} else {
					entries.push(
						tray.div([], {
							style: {
								height: "100%",
								width: "100%",
								background: `rgb(var(--color-gray-${entries.length % 2 === 0 ? "800" : "900"}))`,
							},
						})
					);
				}

				const content = tray.stack(entries, {
					gap: 0,
					style: {
						background: "rgb(var(--color-gray-900))",
						alignItems: "center",
						borderRadius: "1em",
						minHeight: "25rem",
						border: "1px solid var(--border)",
						overflowY: "scroll",
					},
				});

				return this.withBanner([
					tray.stack([header, content], { gap: 2, style: { padding: "0.75rem", height: "33.5rem", justifyContent: "space-between" } }),
				]);
			},

			[Tab.EpisodeEditor]() {
				const mediaId = fieldRefs.sharedState.mediaId.get();
				const type = fieldRefs.sharedState.type.get();
				const episodeNumber = fieldRefs.sharedState.episodeNumber.get();

				const labelStyle = {
					display: "flex",
					alignItems: "center",
					width: "fit-content",
					whiteSpace: "nowrap",
					padding: "0 0.75rem",
					background: "rgb(var(--color-gray-800))",
					borderRadius: "0.75rem 0 0 0.75rem",
					borderStyle: "solid",
					borderWidth: "1px",
					marginRight: "-1px",
					fontSize: "14px",
					opacity: state.saving.get() || state.deleting.get() ? "0.5" : "1",
				};

				const inputStyle = {
					borderRadius: "0 0.75rem 0.75rem 0",
					background: "rgb(var(--color-gray-900))",
				};

				const header = tray.div(
					[
						tray.text("Edit Episode Metadata for", { style: { fontSize: "13px" } }),
						tray.text(state.currentMediaTitle.get() ?? "", { style: { fontWeight: "bold", fontSize: "1.2em", wordBreak: "break-word" } }),
						tray.text(`Episode ${fieldRefs.sharedState.episodeNumber.get()}`, { style: { fontSize: "13px" } }),
					],
					{
						style: {
							maxWidth: "80%",
							color: "#fff",
							textShadow: "0 0 10px black",
						},
					}
				);

				const buttonStyles = {
					width: "2.5rem",
					height: "2.5rem",
					borderRadius: "50%",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					backgroundSize: "1rem 1rem",
					padding: "0",
					paddingInlineStart: "0.5rem",
				};

				const hasEntry = mediaId && type && episodeNumber ? !!storage.get(mediaId)[type][episodeNumber] : false;
				const headerGroup = tray.flex(
					[
						header,
						tray.flex([
							tray.button({
								label: "\u200b",
								size: "md",
								intent: "alert",
								disabled: state.saving.get() || !hasEntry,
								loading: state.deleting.get(),
								style: {
									...buttonStyles,
									// prettier-ignore
									backgroundImage: state.deleting.get() ? "" : "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgMS41djFoMy41YS41LjUgMCAwIDEgMCAxaC0uNTM4bC0uODUzIDEwLjY2QTIgMiAwIDAgMSAxMS4xMTUgMTZoLTYuMjNhMiAyIDAgMCAxLTEuOTk0LTEuODRMMi4wMzggMy41SDEuNWEuNS41IDAgMCAxIDAtMUg1di0xQTEuNSAxLjUgMCAwIDEgNi41IDBoM0ExLjUgMS41IDAgMCAxIDExIDEuNW0tNSAwdjFoNHYtMWEuNS41IDAgMCAwLS41LS41aC0zYS41LjUgMCAwIDAtLjUuNU00LjUgNS4wMjlsLjUgOC41YS41LjUgMCAxIDAgLjk5OC0uMDZsLS41LTguNWEuNS41IDAgMSAwLS45OTguMDZtNi41My0uNTI4YS41LjUgMCAwIDAtLjUyOC40N2wtLjUgOC41YS41LjUgMCAwIDAgLjk5OC4wNThsLjUtOC41YS41LjUgMCAwIDAtLjQ3LS41MjhNOCA0LjVhLjUuNSAwIDAgMC0uNS41djguNWEuNS41IDAgMCAwIDEgMFY1YS41LjUgMCAwIDAtLjUtLjUiLz48L3N2Zz4=)",
								},
								onClick: ctx.eventHandler("CEM:delete", (e) => {
									state.deleting.set(true);
									try {
										storage.delete(mediaId!, type!, episodeNumber!);
										ctx.anime.clearEpisodeMetadataCache();
										ctx.setTimeout(() => {
											$app.invalidateClientQuery(["ANIME-ENTRIES-get-anime-entry", "ANIME-get-anime-episode-collection"]);
											ctx.toast.success(`Deleted custom metadata for [${mediaId}] episode ${episodeNumber}!`);
											state.deleting.set(false);
											ctx.screen.loadCurrent();
											tray.close();
										}, 1_500);
									} catch (error) {
										ctx.setTimeout(() => {
											ctx.toast.error((error as Error).message);
											state.deleting.set(false);
										}, 1_500);
									}
								}),
							}),
							tray.button({
								label: "\u200b",
								size: "md",
								intent: "success",
								disabled: state.deleting.get(),
								loading: state.saving.get(),
								style: {
									...buttonStyles,
									// prettier-ignore
									backgroundImage: state.saving.get() ? "" : "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTIgMmgtMnYzaDJ6Ii8+PHBhdGggZD0iTTEuNSAwQTEuNSAxLjUgMCAwIDAgMCAxLjV2MTNBMS41IDEuNSAwIDAgMCAxLjUgMTZoMTNhMS41IDEuNSAwIDAgMCAxLjUtMS41VjIuOTE0YTEuNSAxLjUgMCAwIDAtLjQ0LTEuMDZMMTQuMTQ3LjQzOUExLjUgMS41IDAgMCAwIDEzLjA4NiAwek00IDZhMSAxIDAgMCAxLTEtMVYxaDEwdjRhMSAxIDAgMCAxLTEgMXpNMyA5aDEwYTEgMSAwIDAgMSAxIDF2NUgydi01YTEgMSAwIDAgMSAxLTEiLz48L3N2Zz4=)",
								},
								onClick: ctx.eventHandler("CEM:save", (e) => {
									state.saving.set(true);

									// Fields
									const length = fieldRefs.custom.length.current.length ? Number(fieldRefs.custom.length.current) : undefined;
									const year = fieldRefs.custom.airDateYear.current;
									const month = fieldRefs.custom.airDateMonth.current;
									const day = fieldRefs.custom.airDateDay.current;

									const hasDate = year || month || day;

									if (hasDate) {
										const y = Number(year);
										const m = Number(month);
										const d = Number(day);

										if (isNaN(new Date(`${y}-${m}-${d}`).getTime())) {
											state.saving.set(false);
											return ctx.toast.error("Invalid Date Input");
										}
										if (isNaN(m) || m < 1 || m > 12) {
											state.saving.set(false);
											return ctx.toast.error("Invalid Month Input: Must be 1-12 only.");
										}
										if (isNaN(y) || y < 1) {
											state.saving.set(false);
											return ctx.toast.error("Invalid Year Input!");
										}
									}

									if (length && length <= 0) {
										state.saving.set(false);
										return ctx.toast.error("Invalid Episode Duration!");
									}

									const data: CEM.CustomEpisodeMetadata = {
										mediaId: mediaId!,
										type: type!,
										episodeNumber: episodeNumber!,
										displayTitle: fieldRefs.custom.displayTitle.current,
										episodeTitle: fieldRefs.custom.episodeTitle.current,
										overview: fieldRefs.custom.overview.current,
										image: fieldRefs.custom.image.current,
									};

									if (length) data.length = length;

									if (hasDate) {
										data.airDate = {
											year: Number(year),
											month: Number(month),
											day: Number(day),
										};
									}

									try {
										storage.save(data);
										ctx.anime.clearEpisodeMetadataCache();
										ctx.setTimeout(() => {
											$app.invalidateClientQuery(["ANIME-ENTRIES-get-anime-entry", "ANIME-get-anime-episode-collection"]);
											ctx.toast.success(`Saved custom metadata for [${mediaId}] episode ${episodeNumber}!`);
											state.saving.set(false);
											ctx.screen.loadCurrent();
											tray.close();
										}, 1_500);
									} catch (error) {
										ctx.setTimeout(() => {
											ctx.toast.error((error as Error).message);
											state.saving.set(false);
										}, 1_500);
									}
								}),
							}),
						]),
					],
					{
						style: {
							justifyContent: "space-between",
						},
					}
				);

				const airDate = tray.flex(
					[
						tray.flex(
							[
								tray.text("Airdate Day", { style: labelStyle }),
								tray.input({
									placeholder: fieldRefs.base.airDateDay.current,
									fieldRef: fieldRefs.custom.airDateDay,
									disabled: state.saving.get() || state.deleting.get(),
									style: { ...inputStyle, borderRadius: "0" },
								}),
							],
							{ gap: 0 }
						),
						tray.flex(
							[
								tray.text("Month", { style: { ...labelStyle, borderRadius: "0", marginLeft: "-1px" } }),
								tray.input({
									placeholder: fieldRefs.base.airDateMonth.current,
									fieldRef: fieldRefs.custom.airDateMonth,
									disabled: state.saving.get() || state.deleting.get(),
									style: { ...inputStyle, borderRadius: "0" },
								}),
							],
							{ gap: 0 }
						),
						tray.flex(
							[
								tray.text("Year", { style: { ...labelStyle, borderRadius: "0", marginLeft: "-1px" } }),
								tray.input({
									placeholder: fieldRefs.base.airDateYear.current,
									fieldRef: fieldRefs.custom.airDateYear,
									disabled: state.saving.get() || state.deleting.get(),
									style: inputStyle,
								}),
							],
							{ gap: 0 }
						),
					],
					{ gap: 0 }
				);

				const form = tray.stack(
					[
						// tray.flex(
						// 	[
						// 		tray.text("Display Title", { style: labelStyle }),
						// 		tray.input({
						// 			placeholder: fieldRefs.base.displayTitle.current,
						// 			fieldRef: fieldRefs.custom.displayTitle,
						// 			disabled: state.saving.get() || state.deleting.get(),
						// 			style: inputStyle,
						// 		}),
						// 	],
						// 	{ gap: 0 }
						// ),
						tray.flex(
							[
								tray.text("Episode Title", { style: labelStyle }),
								tray.input({
									placeholder: fieldRefs.base.episodeTitle.current,
									fieldRef: fieldRefs.custom.episodeTitle,
									disabled: state.saving.get() || state.deleting.get(),
									style: inputStyle,
								}),
							],
							{ gap: 0 }
						),
						tray.flex(
							[
								tray.text("Duration (minutes)", { style: labelStyle }),
								tray.input({
									placeholder: fieldRefs.base.length.current,
									fieldRef: fieldRefs.custom.length,
									disabled: state.saving.get() || state.deleting.get(),
									style: inputStyle,
								}),
							],
							{ gap: 0 }
						),
						airDate,
						tray.flex(
							[
								tray.text("Overview", { style: labelStyle }),
								tray.input({
									placeholder: fieldRefs.base.overview.current,
									fieldRef: fieldRefs.custom.overview,
									disabled: state.saving.get() || state.deleting.get(),
									textarea: true,
									style: inputStyle,
								}),
							],
							{ gap: 0 }
						),
						tray.flex(
							[
								tray.text("Image URL", { style: labelStyle }),
								tray.input({
									placeholder: fieldRefs.base.image.current,
									fieldRef: fieldRefs.custom.image,
									disabled: state.saving.get() || state.deleting.get(),
									style: inputStyle,
								}),
							],
							{ gap: 0 }
						),
					],
					{
						style: {
							minHeight: "25rem",
							overflowY: "scroll",
						},
					}
				);

				return this.withBanner([
					tray.stack([headerGroup, form], { gap: 2, style: { padding: "0.75rem", height: "100%", justifyContent: "space-between" } }),
				]);
			},
			get() {
				return this[this.current.get()]();
			},
		};

		for (const type of ["library", "torrentstream", "debridstream", "undownloaded", "medialinks", "mediastream"] as const) {
			const episodeGridMenuItem = ctx.action.newEpisodeGridItemMenuItem({
				type,
				label: "Edit Custom Metadata",
				style: {},
			});

			// Mount the item
			episodeGridMenuItem.mount();

			// Event handler
			episodeGridMenuItem.onClick(onEpisodeGridMenuItemClicked);
		}

		function isAnimeEpisode(ep: $app.Anime_Episode | $app.Onlinestream_Episode, type: string): ep is $app.Anime_Episode {
			return type !== "onlinestream";
		}

		function onEpisodeGridMenuItemClicked(e: ReturnType<typeof ctx.action.newEpisodeGridItemMenuItem> extends $ui.ActionObject<infer T> ? T : never) {
			fieldRefs.reset();
			if (!isAnimeEpisode(e.episode, e.type)) return;

			if (!e.episode.baseAnime) return ctx.toast.error(`Unable to retrieve anime metadata.`);

			const mediaId = e.episode.baseAnime.id;
			const type = e.episode.type;
			const episodeNumber = e.episode.episodeNumber;

			if (type === "nc") return ctx.toast.warning("This episode is not supported!");

			// specials dont seem to get loaded so imma put a guard here
			if (type === "special") return ctx.toast.warning("This episode is not supported!");

			const entry = storage.get(e.episode.baseAnime.id, e.episode.baseAnime?.title?.userPreferred);
			const customEpisode = entry[type][episodeNumber] ?? { mediaId, type, episodeNumber };
			const baseAirDate = e.episode.episodeMetadata?.airDate ? new Date(e.episode.episodeMetadata?.airDate) : undefined;
			const baseEpisode: Partial<CEM.CustomEpisodeMetadata> = {
				displayTitle: e.episode.displayTitle,
				length: e.episode.episodeMetadata?.length,
				episodeTitle: e.episode.episodeTitle,
				overview: e.episode.episodeMetadata?.overview,
				image: e.episode.episodeMetadata?.image,
				airDate: baseAirDate
					? {
							year: baseAirDate.getFullYear(),
							month: baseAirDate.getMonth() + 1,
							day: baseAirDate.getDate(),
					  }
					: undefined,
			};

			fieldRefs.set(baseEpisode, customEpisode, e.episode.baseAnime);
			tabs.current.set(Tab.EpisodeEditor);
			ctx.setTimeout(() => tray.open(), 500);
		}

		ctx.screen.onNavigate(async (e) => {
			if (e.pathname === "/entry") {
				const media = (await ctx.anime.getAnimeEntry(Number(e.searchParams.id))).media;
				state.currentMediaId.set(Number(e.searchParams.id));
				state.currentMediaBg.set(media?.bannerImage ?? media?.coverImage?.large ?? "");
				state.currentMediaTitle.set(media?.title?.userPreferred ?? "");
				tabs.current.set(Tab.AnimePage);
			} else {
				state.currentMediaId.set(null);
				state.currentMediaBg.set("");
				state.currentMediaTitle.set("");
				tabs.current.set(Tab.Library);
			}
		});

		tray.render(() => tabs.get());

		tray.onClose(() => {
			fieldRefs.reset();
			tabs.current.set(Tab.AnimePage);
		});

		ctx.screen.loadCurrent();
	});

	$app.onAnimeMetadata((e) => {
		if (!e.animeMetadata) return e.next();
		if (!e.animeMetadata?.episodes) e.animeMetadata.episodes = {};

		const entry = $storage.get("CUSTOM_EPISODE_METADATA_STORAGE")[e.mediaId] as CEM.Entry;
		if (!entry) return e.next();
		for (const type of ["main", "special"] as const) {
			for (const episode of Object.values(entry[type])) {
				if (!episode) continue;

				const key = type === "main" ? episode.episodeNumber : "S" + episode.episodeNumber;
				if (!e.animeMetadata.episodes[key]) e.animeMetadata.episodes[key] = {} as any;

				if (episode.episodeTitle?.length) e.animeMetadata.episodes[key].title = episode.episodeTitle;
				if (episode.length) e.animeMetadata.episodes[key].length = episode.length;
				if (episode.airDate)
					e.animeMetadata.episodes[key].airDate = `${episode.airDate.year}-${String(episode.airDate.month).padStart(2, "0")}-${String(
						episode.airDate.day
					).padStart(2, "0")}`;
				if (episode.overview?.length) {
					e.animeMetadata.episodes[key].overview = episode.overview;
					e.animeMetadata.episodes[key].summary = episode.overview;
				}
				if (episode.image) {
					e.animeMetadata.episodes[key].image = episode.image;
					e.animeMetadata.episodes[key].hasImage = true;
				}

				if (!e.animeMetadata.episodes[key].episode)
					e.animeMetadata.episodes[key].episode = type === "main" ? `${episode.episodeNumber}` : `S${episode.episodeNumber}`;
				if (!e.animeMetadata.episodes[key].episodeNumber) e.animeMetadata.episodes[key].episodeNumber = episode.episodeNumber;
			}
		}

		if (e.animeMetadata.episodeCount === 0) e.animeMetadata.episodeCount = Object.keys(entry.main).length;
		if (e.animeMetadata.specialCount === 0) e.animeMetadata.specialCount = Object.keys(entry.special).length;

		e.next();
	});
}
