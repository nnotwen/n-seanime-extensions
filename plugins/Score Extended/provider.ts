/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./score-extended.d.ts" />

//@ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Score%20Extended/icon.png";
		const tray = ctx.newTray({ iconUrl, withContent: true });
		const currentMedia = ctx.state<{ type: $app.AL_MediaType; id: number } | null>(null);
		const fieldEditState = ctx.state<$score.FieldEntry | undefined>(undefined);
		const fieldWeightEditFieldRef = ctx.fieldRef<string>("");
		const fieldScoreEditFieldRef = ctx.fieldRef<string>("");
		const fieldLabel = ctx.fieldRef<string>("");
		const fieldWeight = ctx.fieldRef<string>("");
		const saving = ctx.state<boolean>(false);

		let currentlyEditedLabel: string | null = null;

		const scoreFields = {
			recommended: [
				{ label: "Animation/Art", weight: 1.2 },
				{ label: "Character Writing", weight: 1.4 },
				{ label: "Character Design", weight: 0.8 },
				{ label: "Story/Plot", weight: 1.5 },
				{ label: "World Building", weight: 1.0 },
				{ label: "Sound/Music", weight: 1.0 },
				{ label: "Pacing", weight: 1.0 },
				{ label: "Direction", weight: 0.7 },
				...Object.entries(parseScoreFields($getUserPreference("custom-fields") ?? "")).map(([label, weight]) => ({ label, weight })),
			].filter((item, index, self) => index === self.findIndex((t) => t.label.toLowerCase() === item.label.toLowerCase())) satisfies $score.FieldItem[],
			entries: {
				__id: "8cf6d048",
				get: (mediaId: number) => $storage.get<$score.FieldEntry[]>(`${scoreFields.entries.__id}-${mediaId}`) ?? [],
				add: (mediaId: number, label: string, weight: number, score: number) => {
					if (label.trim() === "") throw new Error("Field label cannot be empty.");
					if (isNaN(score) || score < 0 || score > 10) throw new Error("Field score must be between 0 and 10.");
					if (isNaN(weight) || weight < 0 || weight > 10) throw new Error("Field weight must be between 0 and 10.");

					$storage.set(`${scoreFields.entries.__id}-${mediaId}`, [
						...scoreFields.entries.get(mediaId).filter((entry) => entry.label !== label),
						{ label, weight, score },
					]);
				},
				update: (mediaId: number, update: Partial<$score.FieldEntry>) => {
					if (!update.label?.trim()) throw new Error("Field label cannot be empty.");

					const entries = scoreFields.entries.get(mediaId);
					const index = entries.findIndex((e) => e.label === update.label);
					if (index === -1) throw new Error("This field does not exist.");

					if (update.score !== undefined && (isNaN(update.score) || update.score < 0 || update.score > 10))
						throw new Error("Field score must be between 0 and 10.");

					if (update.weight !== undefined && (isNaN(update.weight) || update.weight < 0 || update.weight > 10))
						throw new Error("Field weight must be between 0 and 10.");

					entries.splice(index, 1, { ...entries[index], ...update });
					$storage.set(`${scoreFields.entries.__id}-${mediaId}`, entries);
				},
				remove: (mediaId: number, label: string) =>
					$storage.set(
						`${scoreFields.entries.__id}-${mediaId}`,
						scoreFields.entries.get(mediaId).filter((entry) => entry.label !== label),
					),
			},
		};

		const icons = {
			html: {
				check2all: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/>
						<path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
					</svg>`,
				delete: /*html*/ `
					<svg stroke="#fca5a5" fill="#fca5a5" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
						<path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
					</svg>`,
				plusCircleDotted: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
					</svg>`,
				questionCircle: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" class="bi bi-question-circle" viewBox="0 0 16 16">
						<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
						<path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
					</svg>`,
				starHalf: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" class="bi bi-star-half" viewBox="0 0 16 16">
						<path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z"/>
					</svg>`,
			},
			get(name: keyof typeof this.html, options?: { raw?: boolean; stroke?: string; fill?: string }) {
				let html = this.html[name];
				if (options?.stroke || options?.fill) {
					html = html
						.replace(/stroke="[^"]*"/g, options?.stroke ? `stroke="${options.stroke}"` : 'stroke="none"')
						.replace(/fill="[^"]*"/g, options?.fill ? `fill="${options.fill}"` : 'fill="none"');
				}
				if (options?.raw) return html;
				return `data:image/svg+xml;base64,${Buffer.from(html.trim(), "utf-8").toString("base64")}`;
			},
		};

		tray.render(function () {
			const currentMediaData = currentMedia.get();
			if ((currentMediaData?.id ?? Infinity) >= 2 ** 31) {
				return tray.flex(
					[
						tray.div([], {
							className: "w-10 h-10 bg-center bg-contain bg-no-repeat",
							style: { backgroundImage: `url(${iconUrl})` },
						}),
						tray.stack(
							[
								tray.text("Score Extended", { className: "text-lg font-bold" }),
								tray.text("Navigate to any supported anime or manga page to get started.", { className: "text-sm text-[--muted] break-normal" }),
							],
							{ gap: 0 },
						),
					],
					{ className: "p-2" },
				);
			} else {
				const media = $anilist[currentMediaData!.type === "ANIME" ? "getAnime" : "getManga"](currentMediaData!.id);
				const scoreData = scoreFields.entries.get(media.id);
				const scoreVal = scoreData.reduce((sum, item) => sum + item.score * item.weight, 0) / scoreData.reduce((sum, item) => sum + item.weight, 0);
				const recommended = scoreFields.recommended.filter((field) => !scoreData.some((s) => s.label === field.label));

				return tray.stack(
					[
						tray.css(/*css*/ `
							.group .group-hover\\:visible {
								visibility: hidden;
								opacity: 0;
								transition: visibility 0.2s, opacity 0.2s;
							}
							.group:hover .group-hover\\:visible {
								visibility: visible;
								opacity: 1;
						}`),
						tray.flex([
							tray.div([], {
								className: "w-10 h-10 bg-center bg-contain bg-no-repeat",
								style: { backgroundImage: `url(${iconUrl})` },
							}),
							tray.stack(
								[
									tray.text("Editing Extended Score for", { className: "text-lg font-bold" }),
									tray.text(`${media.title?.userPreferred ?? ""}`, { className: "text-sm text-[--muted] break-normal line-clamp-2" }),
								],
								{ gap: 0, className: "flex-1" },
							),
							tray.stack(
								[
									tray.span("SCORE", { className: "text-xs" }),
									tray.span(isNaN(scoreVal) ? "--" : scoreVal.toFixed(2), {
										className: "text-2xl font-bold",
										style: { color: getColorFromScore(scoreVal) },
									}),
								],
								{ className: "items-center", gap: 0 },
							),
						]),
						tray.stack(
							[
								tray.stack([
									tray.text("Recommended Fields", { className: "font-semibold ml-4" }),
									tray.div(
										[
											tray.span("Click on a field below to add them", {
												className: "absolute left-3 text-xs text-[--muted] bg-gray-950 px-1",
												style: { top: "-0.55rem" },
											}),
											tray.stack([
												tray.flex(
													[
														...recommended.map((f) =>
															tray.div([tray.span(f.label)], {
																className: "w-fit px-2 py-0 rounded-lg border cursor-pointer bg-gray-800 hover:bg-gray-600",
																onClick: ctx.eventHandler(`label-${f.label}`, () => {
																	scoreFields.entries.add(media.id, f.label, f.weight, 10);
																	tray.update();
																}),
															}),
														),
														tray.text("You have used all recommended fields.", {
															className: "text-sm font-normal text-[--muted] text-center",
															style: { display: recommended.length ? "none" : "block" },
														}),
													],
													{ className: "flex-wrap text-sm p-2 mt-2 font-semibold", style: { rowGap: "0.25rem" } },
												),
											]),
										],
										{ className: "relative border rounded-lg" },
									),
								]),
								tray.stack(
									[
										tray.stack(
											[
												tray.flex(
													[
														tray.text("Label", { className: "flex-1" }),
														tray.span("Weight", { className: "w-15" }),
														tray.span("Score", { className: "w-18" }),
														tray.tooltip(
															tray.div([], {
																className: "w-8 h-5 bg-center bg-no-repeat cursor-pointer",
																style: { backgroundImage: `url(${icons.get("questionCircle", { fill: "#ffffff66" })})`, backgroundSize: "1rem" },
															}),
															{ text: "Click on the score or weight to edit the values of each fields", side: "right" },
														),
													],
													{ className: "text-sm font-semibold text-[--muted] h-7 border-b" },
												),
												...scoreData.map((score) =>
													tray.flex(
														[
															tray.text(`${score.label}`, { className: "flex-1 break-normal line-clamp-1 cursor-default font-semibold" }),
															tray.div(
																[
																	tray.flex(
																		fieldEditState.get()?.label === score.label
																			? [
																					tray.input({
																						value: fieldEditState.get()?.weight.toString() ?? score.weight.toString(),
																						size: "sm",
																						style: { width: "2.5rem", borderRadius: "0.5rem" },
																						fieldRef: fieldWeightEditFieldRef,
																					}),
																					tray.input({
																						value: fieldEditState.get()?.score.toString() ?? score.score.toString(),
																						size: "sm",
																						style: { width: "2.5rem", borderRadius: "0.5rem" },
																						fieldRef: fieldScoreEditFieldRef,
																					}),
																				]
																			: [
																					tray.span(`${score.weight.toFixed(2).padEnd(2)}`, { className: "text-sm text-[--muted]" }),
																					tray.span(`${score.score.toFixed(2).padEnd(2)}`, {
																						className: "text-sm text-right font-semibold w-10",
																						style: { color: getColorFromScore(score.score) },
																					}),
																				],
																	),
																],
																{
																	onClick: ctx.eventHandler(`editfield-${score.label}`, (e) => {
																		if (currentlyEditedLabel === score.label) return;
																		currentlyEditedLabel = score.label;
																		fieldWeightEditFieldRef.setValue(score.weight.toFixed(2));
																		fieldScoreEditFieldRef.setValue(score.score.toFixed(2));
																		fieldEditState.set(score);
																	}),
																},
															),
															tray.button("\u200b", {
																className: "w-8 h-8 p-2 bg-center bg-no-repeat bg-contain bg-transparent group-hover:visible transition",
																...(fieldEditState.get()?.label === score.label
																	? {
																			intent: "success-subtle",
																			style: { backgroundImage: `url(${icons.get("check2all", { fill: "#a5fcbf" })})`, backgroundSize: "1.2rem" },
																			onClick: ctx.eventHandler(`updatefield-${score.label}`, (e) => {
																				try {
																					scoreFields.entries.update(media.id, {
																						label: score.label,
																						weight: parseFloat(fieldWeightEditFieldRef.current),
																						score: parseFloat(fieldScoreEditFieldRef.current),
																					});
																					fieldEditState.set(undefined);
																					currentlyEditedLabel = null;
																					ctx.toast.success(`Field "${score.label}" updated successfully.`);
																				} catch (error) {
																					ctx.toast.error((error as Error).message);
																				}
																			}),
																		}
																	: {
																			intent: "alert-subtle",
																			style: { backgroundImage: `url(${icons.get("delete", { fill: "#fca5a5" })})`, backgroundSize: "1.2rem" },
																			onClick: ctx.eventHandler(`deletefield-${media.id}-${score.label}`, (e) => {
																				scoreFields.entries.remove(media.id, score.label);
																				ctx.toast.success(`Field "${score.label}" removed successfully.`);
																				currentlyEditedLabel = null;
																				tray.update();
																			}),
																		}),
															}),
														],
														{
															className: "group items-center",
														},
													),
												),
												tray.text("No fields added yet. Use the input below to add a new field or choose one from the recommended fields above.", {
													className: "break-normal text-sm text-[--muted] text-center p-2 text-pretty",
													style: { display: scoreData.length ? "none" : "block" },
												}),
											],
											{ className: "flex-1" },
										),
										tray.flex([
											tray.input({ placeholder: "Field Label", className: "flex-1", fieldRef: fieldLabel, style: { borderRadius: "0.5rem" } }),
											tray.input({ placeholder: "Weight", className: "w-20", fieldRef: fieldWeight, style: { borderRadius: "0.5rem" } }),
											tray.tooltip(
												tray.button("\u200b", {
													intent: "success",
													className: "w-10 h-10 p-2 bg-center bg-no-repeat bg-contain",
													style: { backgroundImage: `url(${icons.get("plusCircleDotted", { fill: "#fff" })})`, backgroundSize: "1.2rem" },
													onClick: ctx.eventHandler("addField", (e) => {
														if (fieldLabel.current.trim() === "") {
															ctx.toast.error("Field label cannot be empty.");
															return;
														}

														if (scoreData.some((s) => s.label === fieldLabel.current.trim())) {
															ctx.toast.error("This field already exists");
															return;
														}

														const field: $score.FieldItem = {
															label: fieldLabel.current.trim(),
															weight: parseFloat(fieldWeight.current.trim()) || 1,
														};

														try {
															scoreFields.entries.add(media.id, field.label, field.weight, 10);
														} catch (error) {
															return ctx.toast.error((error as Error).message);
														}

														fieldLabel.setValue("");
														fieldWeight.setValue("");

														ctx.toast.success(`Field "${field.label}" added successfully.`);
														tray.update();
													}),
												}),
												{ text: "Add", side: "right" },
											),
										]),
									],
									{ className: "p-2 border rounded-lg space-y-3 flex-1" },
								),
								tray.div(
									[
										tray.button("Save to Anilist", {
											disabled: isNaN(scoreVal) || !$database.anilist.getToken(),
											intent: "success",
											size: "md",
											loading: saving.get(),
											className: "shrink-0",
											onClick: ctx.eventHandler(`saveToAnilist-${media.id}`, async () => {
												saving.set(true);
												try {
													const res = await ctx.fetch("https://graphql.anilist.co", {
														method: "POST",
														headers: {
															Authorization: "Bearer " + $database.anilist.getToken(),
															"Content-Type": "application/json",
															Accept: "application/json",
														},
														body: JSON.stringify({
															query: "mutation ($mediaId: Int!, $scoreRaw: Int!) { SaveMediaListEntry(mediaId: $mediaId, scoreRaw: $scoreRaw) { id score } }",
															variables: { scoreRaw: Math.round(scoreVal * 10), mediaId: media.id },
														}),
													});

													if ($getUserPreference("refresh-on-save") == "true") {
														$anilist[media.type === "ANIME" ? "refreshAnimeCollection" : "refreshMangaCollection"]();
														$sleep(5_000); // debounce
														// $app.invalidateClientQuery([media.type === "ANIME" ? "ANILIST-get-anime-collection" : "MANGA-get-manga-collection"]);
													}

													ctx.toast.success("Successfully saved score to AniList! It may take some time for the score to reflect on the page!");
												} catch (err) {
													ctx.toast.error((err as Error).message);
												} finally {
													saving.set(false);
												}
											}),
										}),
										tray.button("Copy to Clipboard", {
											disabled: isNaN(scoreVal),
											intent: "primary-subtle",
											size: "md",
											className: "shrink-0",
											onClick: ctx.eventHandler(`copyToClipboard-${media.id}`, () => {
												try {
													ctx.dom.clipboard.write(
														`Score: ${media.title?.userPreferred}\n\n${scoreData.map((s) => `- ${s.label} ${parseFloat(s.score.toFixed(2))}/10`).join("\n")}\n\nOVERALL: ${parseFloat(scoreVal.toFixed(2))}/10`,
													);
													ctx.toast.success("Successfully copied score to clipboard!");
												} catch (err) {
													ctx.toast.error((err as Error).message);
												}
											}),
										}),
									],
									{ className: "grid grid-cols-2 space-x-2" },
								),
							],
							{
								className: "overflow-y-auto space-y-2",
								style: { height: "28rem" },
							},
						),
					],
					{ gap: 3, className: "px-2" },
				);
			}
		});

		tray.onClose(() => {
			fieldEditState.set(undefined);
			currentlyEditedLabel = null;
		});

		const animeBtn = ctx.action.newAnimePageButton({ label: "\u200b" });
		const mangaBtn = ctx.action.newMangaPageButton({ label: "\u200b" });

		for (const btn of [animeBtn, mangaBtn]) {
			btn.setIntent("gray-subtle");
			btn.setTooltipText("Extended Score");
			btn.setStyle({
				backgroundImage: `url(${icons.get("starHalf")})`,
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				backgroundSize: "1.7rem",
				width: "40px",
			});
			btn.mount();
			btn.onClick(() => tray.open());
		}

		ctx.effect(() => {
			if ((currentMedia.get()?.id ?? Infinity) >= 2 ** 31) {
				animeBtn.unmount();
				mangaBtn.unmount();
			} else {
				animeBtn.mount();
				mangaBtn.mount();
			}
		}, [currentMedia]);

		ctx.screen.onNavigate(({ pathname, searchParams }) => {
			switch (pathname) {
				case "/entry":
					currentMedia.set({ type: "ANIME", id: Number(searchParams.id) });
					break;
				case "/manga/entry":
					currentMedia.set({ type: "MANGA", id: Number(searchParams.id) });
					break;
				default:
					currentMedia.set(null);
			}
		});

		ctx.screen.loadCurrent();

		function getColorFromScore(score: number) {
			if (isNaN(score)) return "inherit";

			const clamped = Math.max(1, Math.min(10, score));
			const ratio = (clamped - 1) / 9;

			// Color stops: [position, r, g, b]
			const stops = [
				{ pos: 0, r: 0xe4, g: 0x81, b: 0x81 }, // #e48181 - Score 1
				{ pos: 0.5, r: 0xf0, g: 0xd0, b: 0x80 }, // #f0d080 - Score 5.5 (yellowish)
				{ pos: 1, r: 0x8a, g: 0xda, b: 0xb0 }, // #8adab0 - Score 10
			];

			let i = 0;
			while (i < stops.length - 1 && stops[i + 1].pos < ratio) i++;

			const start = stops[i];
			const end = stops[Math.min(i + 1, stops.length - 1)];
			const t = end.pos === start.pos ? 0 : (ratio - start.pos) / (end.pos - start.pos);

			const red = Math.round(start.r + (end.r - start.r) * t);
			const green = Math.round(start.g + (end.g - start.g) * t);
			const blue = Math.round(start.b + (end.b - start.b) * t);

			return `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
		}

		function parseScoreFields(input: string) {
			const result: Record<string, number> = {},
				errors: string[] = [],
				regex = /(?:"([^"]+)"|(\S+))=([\d.]+)/g;

			let match;
			while ((match = regex.exec(input)) !== null) {
				const name = match[1] || match[2];
				const weight = parseFloat(match[3]);

				if (isNaN(weight) || weight < 0 || weight > 10) {
					errors.push(`Invalid weight "${match[3]}" for field "${name}". Must be between 0 and 10.`);
					continue;
				}

				result[name.trim()] = weight;
			}

			if (errors.length > 0) ctx.toast.warning(`Parse errors: ${errors.join(" ")}`);
			return result;
		}
	});
}
