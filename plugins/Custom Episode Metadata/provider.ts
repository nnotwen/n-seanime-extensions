/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./custom-episode-metadata.d.ts" />
// Add delay between searches

// @ts-ignore
function init(): void {
	$shared.define("database", () => {
		const key = "CUSTOM_EPISODE_METADATA_STORAGE_V2";
		const records = () => ($storage.get(key) ?? {}) as Record<number, CEM.CustomEpisodeEntry>;
		const get = (mediaId: number) => records()[mediaId] ?? { mediaId, data: {} };
		const has = (mediaId: number) => mediaId in records();
		const set = (mediaId: number, data: CEM.CustomEpisodeEntry) => {
			const obj = records();
			obj[mediaId] = data;
			$storage.set(key, obj);
		};

		return {
			records,
			get,
			has,
			save: (mediaId: number, data: Partial<Omit<CEM.CustomEpisodeMetadata, "episode">> & Pick<CEM.CustomEpisodeMetadata, "episode">) => {
				const entry = get(mediaId);
				entry.data[data.episode] = data;
				set(mediaId, entry);
				return entry;
			},
			delete: (mediaId: number, episode: string) => {
				const entry = get(mediaId);
				delete entry.data[episode];
				set(mediaId, entry);
				return !(episode in entry.data);
			},
		};
	});

	$ui.register((ctx) => {
		// constants
		const REPO_AUTHOR = "nnotwen";
		const REPO_NAME = "n-seanime-extensions";
		const REPO_BRANCH = "master";
		const REPO_PATH = encodeURIComponent("plugins/Custom Episode Metadata");

		const iconUrl = `https://raw.githubusercontent.com/${REPO_AUTHOR}/${REPO_NAME}/${REPO_BRANCH}/${REPO_PATH}/icon.png`;
		const tray = ctx.newTray({ iconUrl, withContent: true, width: "35rem" });

		const database = $shared.use<CEM.SharedDatabase>("database");
		const currentMedia = ctx.state<{ id: number; banner: string; title: string; type: "tv" | "movie" } | null>(null);
		const currEditedEp = ctx.state<CEM.CustomEpisodeMetadata | null>(null);

		const stillImageSize = $getUserPreference("image-size");

		const tmdb = {
			API_KEY: $getUserPreference("tmdb-api"),
			baseUri: "https://api.themoviedb.org/3",
			isFetching: ctx.state<boolean>(false),
			search: async (query: string, type: "tv" | "movie") =>
				tmdb.__fetch__<CEM.TMDBSearchResults>(`search/${type}/?query=${encodeURIComponent(query)}&include_adult=true&language=en-US&page=1`),
			getDetails: <T extends "tv" | "movie">(tmdbId: number, type: T) =>
				tmdb.__fetch__<T extends "tv" ? CEM.TMDBTVShowDetails : CEM.TMDBMovieDetails>(`${type}/${tmdbId}`),
			getSeason: async (tmdbId: number, season: number) => tmdb.__fetch__<CEM.TMDBSeasonResults>(`tv/${tmdbId}/season/${season}`),
			__fetch__: async <T>(endpoint: string) => {
				tmdb.isFetching.set(true);

				const url = new URL(`${tmdb.baseUri}/${endpoint}`);
				url.searchParams.set("api_key", `${tmdb.API_KEY}`);
				url.searchParams.set("language", "en-US");

				const res = await ctx.fetch(url.toString());
				tmdb.isFetching.set(false);

				if (!res.ok) {
					let err = null;
					try {
						err = res.json();
					} catch {
						err = null;
					}
					throw new Error(err?.message || err?.error || res.statusText);
				}

				return res.json() as T;
			},
			overrides: {
				__id__: "TMDB_OVERRIDES",
				records: () => $storage.get<Record<number, CEM.TMDBOverrides>>(tmdb.overrides.__id__) ?? {},
				get: (mediaId: number) => tmdb.overrides.records()[mediaId] ?? { mediaId, episodeOverrides: [] },
				set: (mediaId: number, override: Partial<Omit<CEM.TMDBOverrides, "mediaId">>, overwrite: boolean = false) => {
					const records = tmdb.overrides.records();
					const oldData = tmdb.overrides.get(mediaId);
					const episodeOverridesMap = new Map([...oldData.episodeOverrides, ...(override.episodeOverrides ?? [])].map((o) => [o.aniDBEpisode, o]));

					records[mediaId] = overwrite
						? { mediaId, episodeOverrides: [], ...override }
						: { ...oldData, ...override, episodeOverrides: Array.from(episodeOverridesMap.values()) };

					$storage.set(tmdb.overrides.__id__, records);
				},
				has: (mediaId: number) => mediaId in tmdb.overrides.records(),
				hasEpisode: (mediaId: number, aniDBEpisode: string) => tmdb.overrides.get(mediaId).episodeOverrides.some((e) => e.aniDBEpisode === aniDBEpisode),
				remove: (mediaId: number) => {
					const records = tmdb.overrides.records();
					delete records[mediaId];
					$storage.set(tmdb.overrides.__id__, records);
				},
				removeEpisodeOverride: (mediaId: number, aniDBEpisode: string) => {
					const data = tmdb.overrides.get(mediaId);
					const filtered = data.episodeOverrides.filter((x) => x.aniDBEpisode !== aniDBEpisode);

					if (filtered.length === data.episodeOverrides.length) return false;
					tmdb.overrides.set(mediaId, { ...data, episodeOverrides: filtered }, true);
					return true;
				},
				removeMediaOverride: (mediaId: number) => {
					const data = tmdb.overrides.get(mediaId);
					delete data.tmdbId;
					delete data.tmdbSeason;
					tmdb.overrides.set(mediaId, { ...data }, true);
					return !("tmdbId" in data) && !("tmdbSeason" in data);
				},
				episode: {
					fieldRefs: {
						tmdbId: ctx.fieldRef<string>(""),
						tmdbSeason: ctx.fieldRef<string>(""),
						tmdbEpisode: ctx.fieldRef<string>(""),
					},
					fill: (data: CEM.TMDBOverrides["episodeOverrides"][number]) => {
						tmdb.overrides.episode.fieldRefs.tmdbId.setValue(data.tmdbId?.toString() ?? "");
						tmdb.overrides.episode.fieldRefs.tmdbSeason.setValue(data.tmdbSeason?.toString() ?? "");
						tmdb.overrides.episode.fieldRefs.tmdbEpisode.setValue(data.tmdbEpisode?.toString() ?? "");
					},
					resetFieldRefs: () => Object.values(tmdb.overrides.episode.fieldRefs).forEach((fr) => fr.setValue("")),
					save: (mediaId: number, aniDBEpisode: string) => {
						const update: CEM.TMDBOverrides["episodeOverrides"][number] = {};
						const tmdbId = tmdb.overrides.episode.fieldRefs.tmdbId.current;
						const tmdbSeason = tmdb.overrides.episode.fieldRefs.tmdbSeason.current;
						const tmdbEpisode = tmdb.overrides.episode.fieldRefs.tmdbEpisode.current;

						if (tmdbId.length && !isNaN(Number(tmdbId))) update.tmdbId = Number(tmdbId);
						if (tmdbSeason.length && !isNaN(Number(tmdbSeason))) update.tmdbSeason = Number(tmdbSeason);
						if (tmdbEpisode.length && !isNaN(Number(tmdbEpisode))) update.tmdbEpisode = Number(tmdbEpisode);

						tmdb.overrides.set(mediaId, { episodeOverrides: [{ aniDBEpisode, ...update }] });
					},
				},
				media: {
					fieldRefs: {
						tmdbId: ctx.fieldRef<string>(""),
						tmdbSeason: ctx.fieldRef<string>(""),
					},
					fill: (data: Omit<CEM.TMDBOverrides, "mediaId" | "episodeOverrides">) => {
						tmdb.overrides.media.fieldRefs.tmdbId.setValue(data.tmdbId?.toString() ?? "");
						tmdb.overrides.media.fieldRefs.tmdbSeason.setValue(data.tmdbSeason?.toString() ?? "");
					},
					resetFieldRefs: () => Object.values(tmdb.overrides.media.fieldRefs).forEach((fr) => fr.setValue("")),
					save: (mediaId: number) => {
						const update: Omit<CEM.TMDBOverrides, "mediaId" | "episodeOverrides"> = {};
						const tmdbId = tmdb.overrides.media.fieldRefs.tmdbId.current;
						const tmdbSeason = tmdb.overrides.media.fieldRefs.tmdbSeason.current;

						if (tmdbId.length && !isNaN(Number(tmdbId))) update.tmdbId = Number(tmdbId);
						if (tmdbSeason.length && !isNaN(Number(tmdbSeason))) update.tmdbSeason = Number(tmdbSeason);

						tmdb.overrides.set(mediaId, { ...update });
					},
				},
			},
		};

		const fieldRefs = {
			data: {
				title: ctx.fieldRef<string>(""),
				length: ctx.fieldRef<string>(""),
				airDate: ctx.fieldRef<string>(""),
				overview: ctx.fieldRef<string>(""),
				image: ctx.fieldRef<string>(""),
			},
			reset: () => Object.values(fieldRefs.data).forEach((fieldRef) => fieldRef.setValue("")),
			fill: (data: CEM.CustomEpisodeMetadata) =>
				Object.entries(fieldRefs.data).forEach(([k, fieldRef]) => fieldRef.setValue((data[k as keyof typeof fieldRefs.data] ?? "").toString())),
			save: (mediaId: number, aniDBEp: string) => {
				const data = fieldRefs.data;
				const update: CEM.CustomEpisodeMetadata = { episode: aniDBEp };

				const title = data.title.current.trim();
				const length = data.length.current.trim();
				const airDate = data.airDate.current.trim();
				const overview = data.overview.current.trim();
				const image = data.image.current.trim();

				if (title.length) update.title = title;
				if (length.length) {
					if (isNaN(Number(length))) throw new Error(`Field length "${length}" is invalid. Length must be a valid number`);
					update.length = Number(length);
				}
				if (airDate.length) {
					if (!/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/.test(airDate))
						throw new Error(`Field airDate "${airDate}" is invalid. Please follow the format (yyyy-mm-dd)`);
					update.airDate = airDate;
				}
				if (overview.length) update.overview = overview;
				if (image.length) {
					if (!/^https?:\/\/[^\s]+\.(jpg|jpeg|png|gif)$/i.test(image)) throw new Error(`Field image is invalid. Please enter a valid image URL.`);
					update.image = image;
					update.hasImage = true;
				}

				update.hasImage = !!update.image?.length;
				database.save(mediaId, update);
			},
		};

		tray.render(function () {
			const currentMediaData = currentMedia.get();
			const currentEpisodeData = currEditedEp.get();
			if (!currentMediaData) {
				return tray.flex(
					[
						tray.div([], {
							className: "w-10 h-10 bg-center bg-contain bg-no-repeat",
							style: { backgroundImage: `url(${iconUrl})` },
						}),
						tray.stack(
							[
								tray.text("Custom Episode Metadata", { className: "text-lg font-bold" }),
								tray.text("Navigate to an anime page to edit their episode metadata.", { className: "text-sm text-[--muted] break-normal" }),
							],
							{ gap: 0 },
						),
					],
					{ className: "p-2" },
				);
			} else {
				const customEps = Object.values(database.get(currentMediaData.id)?.data ?? {});
				return withBanner(currentMediaData.banner, [
					tray.stack(
						[
							tray.div(
								[
									tray.text("Custom Episode Metadata for", { className: "text-sm" }),
									tray.text(`${currentMediaData.title}`, { className: "font-bold text-xl line-clamp-2 break-normal text-pretty leading-tight" }),
									tray.text(`Episode ${currentEpisodeData?.episode}`, { className: `text-sm`, style: { display: currentEpisodeData ? "block" : "none" } }),
								],
								{ className: "space-y-1 font-semibold h-28" },
							),
							currentEpisodeData
								? [
										tray.stack(
											[
												tray.stack([
													styledInput("Episode Title", {
														fieldRef: fieldRefs.data.title,
														disabled: tmdb.isFetching.get(),
													}),
												]),
												tray.stack([
													styledInput("Duration (minutes)", {
														fieldRef: fieldRefs.data.length,
														disabled: tmdb.isFetching.get(),
													}),
												]),
												tray.stack([
													styledInput("Airdate (yyyy-mm-dd)", {
														fieldRef: fieldRefs.data.airDate,
														disabled: tmdb.isFetching.get(),
													}),
												]),
												tray.stack([
													styledInput("Overview", {
														fieldRef: fieldRefs.data.overview,
														textarea: true,
														style: { resize: "none" },
														disabled: tmdb.isFetching.get(),
													}),
												]),
												tray.stack([
													styledInput("Image URL", {
														fieldRef: fieldRefs.data.image,
														disabled: tmdb.isFetching.get(),
													}),
												]),
											],
											{ className: "flex-1" },
										),
										tray.flex([
											tray.tooltip(
												tray.button("Fetch from TMDB", {
													intent: "white",
													size: "md",
													disabled: !$getUserPreference("tmdb-api")?.length,
													loading: tmdb.isFetching.get(),
													onClick: ctx.eventHandler(`tmdb-fetch-${currentMediaData.id}`, async () => {
														tmdb.isFetching.set(true);
														const override = tmdb.overrides.get(currentMediaData.id);
														// Ep level overrides
														let { tmdbId, tmdbSeason, tmdbEpisode } = override.episodeOverrides.find((e) => e.aniDBEpisode === currentEpisodeData.episode) ?? {};

														try {
															// Media level override
															if (!tmdbId && override.tmdbId) tmdbId = override.tmdbId;
															if (!tmdbSeason && typeof override.tmdbSeason === "number") tmdbSeason = override.tmdbSeason;

															if (!tmdbId) {
																const search = await tmdb.search(currentMediaData.title, currentMediaData.type);
																if (!search.results.length) throw new Error(`Automatic fetch did not find any metadata. Fill up the overrides and try again.`);
																tmdbId = search.results[0].id;
															}

															if (!tmdbSeason) {
																const details = await tmdb.getDetails(tmdbId, currentMediaData.type);
																if (currentMediaData.type === "movie") {
																	const movie = details as CEM.TMDBMovieDetails;

																	if (movie.title) fieldRefs.data.title.setValue(movie.title);
																	if (movie.runtime) fieldRefs.data.length.setValue(movie.runtime.toString());
																	if (movie.release_date) fieldRefs.data.airDate.setValue(movie.release_date);
																	if (movie.overview) fieldRefs.data.overview.setValue(movie.overview);
																	if (movie.backdrop_path) fieldRefs.data.image.setValue(movie.backdrop_path);

																	return;
																} else {
																	tmdbSeason = (details as CEM.TMDBTVShowDetails).seasons[0]?.season_number ?? 1;
																}
															}

															if (!tmdbEpisode) {
																const epstr = currentEpisodeData.episode.match(/\d+/);
																if (!epstr) throw new Error(`Automatic fetch was unable to retrieve the episode number [8001]. Fill up the override and try again.`);
																tmdbEpisode = parseInt(epstr[0], 10);
															}

															const season = await tmdb.getSeason(tmdbId, tmdbSeason);
															const episode = season.episodes.find((c) => c.episode_number == tmdbEpisode);

															if (!episode) throw new Error(`Automatic fetch was unable to retrieve the episode number [8002]. Fill up the override and try again.`);

															if (episode.name) fieldRefs.data.title.setValue(episode.name);
															if (episode.runtime) fieldRefs.data.length.setValue(episode.runtime.toString());
															if (episode.air_date) fieldRefs.data.airDate.setValue(episode.air_date);
															if (episode.overview) fieldRefs.data.overview.setValue(episode.overview);
															if (episode.still_path) fieldRefs.data.image.setValue(`https://image.tmdb.org/t/p/${stillImageSize}${episode.still_path}`);
														} catch (e) {
															ctx.toast.error((e as Error).message);
														} finally {
															tmdb.isFetching.set(false);
														}
													}),
												}),
												{ text: "TMDB API Key is required for this action." },
											),
											tray.modal({
												trigger: tray.button("Overrides", {
													intent: "white",
													size: "md",
													disabled: !$getUserPreference("tmdb-api")?.length || tmdb.isFetching.get(),
												}),
												title: "TMDB Overrides",
												description:
													"If the automatic fetching fails or uses the incorrect data, you can manually assign an override here. We will fetch the data based on the provided overrides.",
												items: [
													tray.tabs({
														defaultValue: "episode",
														items: [
															tray.tabsList({
																items: [
																	tray.tabsTrigger(tray.text("Episode"), { value: "episode" }),
																	tray.tabsTrigger(tray.text("Media"), { value: "media" }),
																	tray.tabsTrigger(tray.text("Bulk Update"), { value: "bulk-update" }),
																],
															}),
															tray.tabsContent({
																value: "episode",
																className: "space-y-3 mt-2 p-3 border rounded-xl",
																items: [
																	tray.text("This override takes precedence against media override and applies to the current episode only.", {
																		className: "text-sm text-[--muted] break-normal text-pretty",
																	}),
																	styledInput("TMDB ID", {
																		fieldRef: tmdb.overrides.episode.fieldRefs.tmdbId,
																	}),
																	styledInput("TMDB SEASON", {
																		fieldRef: tmdb.overrides.episode.fieldRefs.tmdbSeason,
																		disabled: currentMediaData.type === "movie",
																	}),
																	styledInput("TMDB Episode", {
																		fieldRef: tmdb.overrides.episode.fieldRefs.tmdbEpisode,
																		disabled: currentMediaData.type === "movie",
																	}),
																	tray.flex(
																		[
																			tray.button("Delete", {
																				intent: "alert",
																				size: "md",
																				style: { display: tmdb.overrides.hasEpisode(currentMediaData.id, currentEpisodeData.episode) ? "block" : "none" },
																				onClick: ctx.eventHandler(`modal-del-${currentMediaData.id}-${currentEpisodeData.episode}`, () => {
																					const isDeleted = tmdb.overrides.removeEpisodeOverride(currentMediaData.id, currentEpisodeData.episode);
																					tmdb.overrides.episode.resetFieldRefs();
																					if (isDeleted) {
																						ctx.toast.success("Successfully removed this episode's overrides!");
																					} else {
																						ctx.toast.error("Unable to delete this episode override!");
																					}
																					tray.update();
																				}),
																			}),
																			tray.button("Save", {
																				intent: "primary",
																				size: "md",
																				onClick: ctx.eventHandler(`modal-save-${currentMediaData.id}-${currentEpisodeData.episode}`, () => {
																					tmdb.overrides.episode.save(currentMediaData.id, currentEpisodeData.episode);
																					ctx.toast.success("Successfully saved this episode's overrides!");
																					tray.update();
																				}),
																			}),
																		],
																		{ className: "justify-end" },
																	),
																],
															}),
															tray.tabsContent({
																value: "media",
																className: "space-y-3 mt-2 p-3 border rounded-xl",
																items: [
																	[
																		tray.text("This override will apply to all episodes of the current media except for episodes with existing overrides.", {
																			className: "text-sm text-[--muted] break-normal text-pretty",
																		}),
																		styledInput("TMDB ID", {
																			fieldRef: tmdb.overrides.media.fieldRefs.tmdbId,
																		}),
																		styledInput("TMDB SEASON", {
																			fieldRef: tmdb.overrides.media.fieldRefs.tmdbSeason,
																			disabled: currentMediaData.type === "movie",
																		}),
																		tray.flex(
																			[
																				tray.tooltip(
																					tray.button("AnimeApi", {
																						intent: "white",
																						size: "md",
																						onClick: ctx.eventHandler(`modal-f-animeapi-${currentMediaData.id}`, () => {
																							ctx
																								.fetch(`https://animeapi.my.id/anilist/${currentMediaData.id}`)
																								.then((data) => {
																									const { themoviedb }: { themoviedb: number | undefined } = data.json();
																									if (!themoviedb) return ctx.toast.warning(`animeapi was unable to match the current media to tmdb.`);
																									tmdb.overrides.media.fieldRefs.tmdbId.setValue(themoviedb.toString());
																									ctx.toast.success(`animeapi successfully mapped this media to tmdb.`);
																								})
																								.catch((e) => ctx.toast.error((e as Error).message));
																						}),
																					}),
																					{ text: "Fetch the TMDB ID using animeapi" },
																				),
																				tray.div([], { className: "flex-1" }),
																				tray.button("Delete", {
																					intent: "alert",
																					size: "md",
																					style: {
																						display:
																							tmdb.overrides.get(currentMediaData.id)?.tmdbId || tmdb.overrides.get(currentMediaData.id)?.tmdbSeason ? "block" : "none",
																					},
																					onClick: ctx.eventHandler(`modal-del-${currentMediaData.id}`, () => {
																						const isDeleted = tmdb.overrides.removeMediaOverride(currentMediaData.id);
																						tmdb.overrides.media.resetFieldRefs();
																						if (isDeleted) {
																							ctx.toast.success("Successfully removed this media's overrides!");
																						} else {
																							ctx.toast.error("Unable to delete this media override!");
																						}
																						tray.update();
																					}),
																				}),
																				tray.button("Save", {
																					intent: "primary",
																					size: "md",
																					onClick: ctx.eventHandler(`modal-save-${currentMediaData.id}`, () => {
																						tmdb.overrides.media.save(currentMediaData.id);
																						ctx.toast.success("Successfully saved this episode's overrides!");
																						tray.update();
																					}),
																				}),
																			],
																			{ className: "justify-end" },
																		),
																	],
																],
															}),
															tray.tabsContent({
																value: "bulk-update",
																className: "space-y-3 mt-2 p-3 border rounded-xl",
																items: [
																	tray.text(
																		"Bulk updates all main episode metadata using the TMDB ID (and TMDB SEASON if appplicable) provided in the media override.",
																		{ className: "text-sm text-[--muted] text-pretty break-normal text-justify" },
																	),
																	tray.text(" Note that this may override previously saved custom metadata for this media.", {
																		className: "text-sm text-orange-400 bg-orange-800 border border-orange-500 rounded-xl p-2 bg-opacity-50",
																	}),
																	tray.button("Bulk Update", {
																		size: "md",
																		intent: "success-subtle",
																		className: "w-full",
																		disabled: !tmdb.API_KEY?.length,
																		onClick: ctx.eventHandler(`bulk-update-${currentMediaData.id}`, async () => {
																			const override = tmdb.overrides.get(currentMediaData.id);
																			if (!override.tmdbId) return ctx.toast.error("Missing TMDB ID Media Override!");

																			if (currentMediaData.type === "movie") {
																				try {
																					const details = await tmdb.getDetails(override.tmdbId, "movie");
																					const update: CEM.CustomEpisodeMetadata = { episode: "1" };

																					if (details.title?.length) update.title = details.title;
																					if (typeof details.runtime === "number") update.length = details.runtime;
																					if (details.release_date?.length) update.airDate = details.release_date;
																					if (details.overview?.length) update.overview = details.overview;
																					if (details.backdrop_path?.length) update.image = `https://image.tmdb.org/t/p/${stillImageSize}${details.backdrop_path}`;

																					database.save(currentMediaData.id, update);
																					ctx.toast.success("Successfully updated episode metadata!");
																				} catch (error) {
																					ctx.toast.error((error as Error).message);
																				}
																				return;
																			}

																			if (typeof override.tmdbSeason !== "number") return ctx.toast.error("Missing TMDB Season Media Override!");
																			const seasons = await tmdb.getSeason(override.tmdbId, override.tmdbSeason);

																			for (const episode of seasons.episodes) {
																				const update: CEM.CustomEpisodeMetadata = { episode: `${episode.episode_number}` };

																				if (episode.name?.length) update.title = episode.name;
																				if (typeof episode.runtime === "number") update.length = episode.runtime;
																				if (episode.air_date?.length) update.airDate = episode.air_date;
																				if (episode.overview?.length) update.overview = episode.overview;
																				if (episode.still_path?.length) update.image = `https://image.tmdb.org/t/p/${stillImageSize}${episode.still_path}`;

																				database.save(currentMediaData.id, update);
																			}

																			ctx.anime.clearEpisodeMetadataCache();
																			ctx.setTimeout(() => {
																				$app.invalidateClientQuery(["ANIME-ENTRIES-get-anime-entry", "ANIME-get-anime-episode-collection"]);
																				ctx.toast.success("Successfully saved episode metadata!");
																				tray.close();
																			}, 500);
																		}),
																	}),
																],
															}),
														],
													}),
												],
												footer: [
													tray.text("TMDB ID can be found on the tmdb link of the series in the format of: https://www.themoviedb.org/tv/{tmdbId}", {
														className: "break-normal text-[--muted] text-xs",
													}),
												],
												onOpenChange: ctx.eventHandler(`modal-open-${currentMediaData.id}-${currentEpisodeData.episode}`, ({ open }) => {
													if (!open) tmdb.overrides.episode.resetFieldRefs();
												}),
											}),
											tray.div([], { className: "flex-1" }),
											tray.button("Delete", {
												intent: "alert",
												size: "md",
												disabled: !(Object.values(currentEpisodeData).length - 1),
												onClick: ctx.eventHandler(`del-${currentMediaData.id}`, () => {
													database.delete(currentMediaData.id, currentEpisodeData.episode);
													ctx.anime.clearEpisodeMetadataCache();
													ctx.setTimeout(() => {
														$app.invalidateClientQuery(["ANIME-ENTRIES-get-anime-entry", "ANIME-get-anime-episode-collection"]);
														ctx.toast.success("Successfully removed episode metadata!");
														tray.close();
													}, 500);
												}),
											}),
											tray.button("Save", {
												intent: "primary",
												size: "md",
												onClick: ctx.eventHandler(`save-${currentMediaData.id}`, () => {
													try {
														fieldRefs.save(currentMediaData.id, currentEpisodeData.episode);
														ctx.anime.clearEpisodeMetadataCache();
														ctx.setTimeout(() => {
															$app.invalidateClientQuery(["ANIME-ENTRIES-get-anime-entry", "ANIME-get-anime-episode-collection"]);
															ctx.toast.success("Successfully saved episode metadata!");
															tray.close();
														}, 500);
													} catch (err) {
														ctx.toast.error((err as Error).message);
													}
												}),
											}),
										]),
									]
								: [
										tray.div(
											[
												tray.flex(
													[
														tray.text("Episode", { className: "text-sm font-bold w-16" }),
														tray.text("Custom Fields", { className: "text-sm font-bold flex-1" }),
														tray.modal({
															trigger: tray.button("Delete All", { intent: "alert", disabled: !customEps.length }),
															title: "Delete all custom metadata?",
															description: `Are you sure you want to delete all custom metadata for ${currentMediaData.title}?`,
															footer: [
																tray.button("Delete", {
																	className: "w-full",
																	intent: "alert",
																	size: "md",
																	onClick: ctx.eventHandler(`cem-del-${currentMediaData.id}`, () => {
																		Object.values(database.get(currentMediaData.id).data).forEach((cem) => database.delete(currentMediaData.id, cem.episode));
																		ctx.anime.clearEpisodeMetadataCache();
																		ctx.setTimeout(() => {
																			ctx.toast.success(`Removed all custom metadata for ${currentMediaData.title}!`);
																			$app.invalidateClientQuery(["ANIME-ENTRIES-get-anime-entry", "ANIME-get-anime-episode-collection"]);
																			tray.close();
																		}, 500);
																	}),
																}),
															],
														}),
													],
													{ className: "items-center" },
												),
												tray.div(
													[
														customEps
															.sort((a, b) => Number(a.episode) - Number(b.episode))
															.map((cem) =>
																tray.flex(
																	[
																		tray.text(`E${cem.episode}`, { className: "w-16 text-center font-semibold" }),
																		tray.text(
																			`${Object.keys(cem)
																				.filter((x) => x !== "episode")
																				.sort()
																				.join(", ")}`,
																			{ className: "flex-1 text-sm text-[--muted]" },
																		),
																		tray.button("Delete", {
																			intent: "alert",
																			onClick: ctx.eventHandler(`cem-${currentMediaData.id}-${cem.episode}`, () => {
																				database.delete(currentMediaData.id, cem.episode);
																				ctx.anime.clearEpisodeMetadataCache();
																				ctx.setTimeout(() => {
																					ctx.toast.success(`Removed custom metadata for episode "${cem.episode}"!`);
																					$app.invalidateClientQuery(["ANIME-ENTRIES-get-anime-entry", "ANIME-get-anime-episode-collection"]);
																					tray.close();
																				}, 500);
																			}),
																		}),
																	],
																	{ className: "justify-center items-center" },
																),
															),
													],
													{ className: "space-y-2" },
												),
												tray.text(`There are no custom episode metadata for this entry.`, {
													className: "font-semibold text-[--muted] text-center",
													style: { display: customEps.length ? "none" : "block" },
												}),
											],
											{ className: "space-y-2 p-2 border rounded-xl bg-gray-800 overflow-scroll", style: { height: "24rem" } },
										),
									],
						],
						{ className: "p-2 space-y-2 h-full" },
					),
				]);
			}
		});

		tray.onClose(() => currEditedEp.set(null));

		(["library", "torrentstream", "debridstream", "undownloaded", "medialinks", "mediastream"] as const).forEach((type) => {
			const gridItem = ctx.action.newEpisodeGridItemMenuItem({ type, label: "Edit Custom Metadata " });
			gridItem.mount();
			gridItem.onClick(({ episode, type }) => {
				tray.close();
				if (!isAnimeEpisode(episode, type)) return;
				if (!episode.baseAnime) return ctx.toast.error(`Unable to retrieve anime metadata.`);

				const aniDBEpisode = episode.aniDBEpisode ?? episode.fileMetadata?.aniDBEpisode;
				if (!aniDBEpisode) return ctx.toast.error("Unable to process aniDBEpisode.");

				const customEpisodeEntry = database.get(episode.baseAnime.id);
				const customEpisodeMetadata = customEpisodeEntry.data[aniDBEpisode] ?? { episode: aniDBEpisode };
				const mediaOverride = tmdb.overrides.get(episode.baseAnime.id);
				const episodeOverride = mediaOverride.episodeOverrides.find((e) => e.aniDBEpisode == aniDBEpisode);
				currEditedEp.set(customEpisodeMetadata);

				if (mediaOverride) tmdb.overrides.media.fill(mediaOverride);
				if (episodeOverride) tmdb.overrides.episode.fill(episodeOverride);
				ctx.setTimeout(() => tray.open(), 500);
			});
		});

		ctx.effect(() => {
			const currEditedEpData = currEditedEp.get();
			!currEditedEpData ? fieldRefs.reset() : fieldRefs.fill(currEditedEpData);
		}, [currEditedEp]);

		ctx.screen.onNavigate(async ({ pathname, searchParams }) => {
			if (pathname !== "/entry" && !searchParams.id) return currentMedia.set(null);
			const entry = await ctx.anime.getAnimeEntry(Number(searchParams.id));
			currentMedia.set({
				id: entry.mediaId,
				banner: entry.media?.bannerImage ?? "",
				title: entry.media?.title?.userPreferred ?? "",
				type: entry.media?.format?.valueOf() === "MOVIE" ? "movie" : "tv",
			});
		});

		ctx.screen.loadCurrent();

		function isAnimeEpisode(ep: $app.Anime_Episode | $app.Onlinestream_Episode, type: string): ep is $app.Anime_Episode {
			return type !== "onlinestream";
		}

		function withBanner(banner: string, container: any[]) {
			const bannerDiv = tray.div([], {
				className: "absolute h-40 rounded-t-xl bg-center bg-cover pointer-events-none",
				style: {
					top: "-0.75rem",
					left: "-0.75rem",
					width: "calc(100% + 1.5rem)",
					backgroundImage: `url(${banner})`,
					maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
				},
			});

			return tray.div([bannerDiv, tray.div(container, { style: { position: "relative", height: "100%" } })], {
				style: { position: "relative", height: "33.5rem" },
			});
		}

		function styledInput(label: string, params: Parameters<NonNullable<$ui.Tray["input"]>>[1]) {
			return tray.flex(
				[
					tray.text(label, {
						className: "flex items-center w-fit whitespace-nowrap px-3 bg-gray-800 rounded-l-xl border text-sm",
						style: { opacity: params?.disabled ? "0.5" : "1", marginRight: "-1px" },
					}),
					tray.input({
						...params,
						style: {
							borderRadius: "0 0.75rem 0.75rem 0",
							background: "rgb(var(--color-gray-900))",
							...params?.style,
						},
					}),
				],
				{ gap: 0 },
			);
		}
	});

	$app.onAnimeMetadata((e) => {
		if (!e.animeMetadata) return e.next();
		if (!e.animeMetadata.episodes) e.animeMetadata.episodes = {};

		const entry = $shared.use<CEM.SharedDatabase>("database").get(e.mediaId);
		for (const [key, customMetadata] of Object.entries(entry.data)) {
			const episodeMetadata = e.animeMetadata.episodes[key];
			if (customMetadata.image?.length) customMetadata.hasImage = true;
			if (customMetadata.overview?.length) customMetadata.summary = customMetadata.overview;
			e.animeMetadata.episodes[key] = { ...episodeMetadata, ...customMetadata };
		}
	});
}
