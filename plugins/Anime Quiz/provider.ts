/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./aniquiz.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const QUIZ_STATE = generateRandomUUID();
		const VALID_GENRES: $aniquiz.genre[] = [
			"Action",
			"Adventure",
			"Comedy",
			"Drama",
			"Ecchi",
			"Fantasy",
			"Horror",
			"Mahou Shoujo",
			"Mecha",
			"Music",
			"Mystery",
			"Psychological",
			"Romance",
			"Sci-Fi",
			"Slice of Life",
			"Sports",
			"Supernatural",
			"Thriller",
		];

		const iconUrl = "";
		const tray = ctx.newTray({ iconUrl, withContent: true });

		tray.render(() => {
			const state = $store.get<$aniquiz.State | undefined>(QUIZ_STATE);
			return tray.stack([
				tray.text("Anime Quiz", { className: "text-center font-bold text-2xl" }),
				tray.text("Test your knowledge on all anime/manga you have on your list", { className: "text-center break-normal text-pretty" }),
				tray.div(
					[
						(
							[
								{
									title: "Casual",
									description: "10 questions. No timer. Play at your own pace.",
									modal: () => generateModal("Casual"),
								},
								{
									title: "Time Attack",
									description: "Timed questions. The faster you answer, the more you earn points.",
									modal: () => generateModal("Time Attack"),
								},
								{
									title: "Time Crunch",
									description: "2 minutes. Answer as many as you can.",
									modal: () => generateModal("Time Crunch"),
								},
							] as const
						).map((mode) =>
							tray.modal({
								trigger: tray.div(
									[
										tray.stack([
											tray.text(mode.title, { className: "text-center font-semibold" }),
											tray.text(mode.description, { className: "text-xs text-[--muted] flex-1 break-normal text-pretty text-center" }),
										]),
									],
									{
										className: `h-full p-2 rounded-lg border bg-gray-900 hover:bg-gray-800 transition cursor-pointer ${state?.active ? "pointer-events-none opacity-50" : ""}`,
									},
								),
								onOpenChange: ctx.eventHandler(generateRandomUUID(), ({ open }: { open: boolean }) => {
									if (!open) {
										tray.close();
									}
								}),
							}),
						),
					],
					{ className: "grid grid-cols-3 gap-2" },
				),
				state?.active === true
					? tray.stack(
							[
								tray.text("You have a pending session", { className: "text-center" }),
								tray.text(`Game mode: ${state.type}`, { className: "text-sm text-[--muted] text-center" }),
								tray.flex([
									tray.modal({
										trigger: tray.button("Resume", { intent: "success-subtle", size: "md" }),
										onOpenChange: ctx.eventHandler(generateRandomUUID(), ({ open }: { open: boolean }) => {
											if (!open) {
												tray.close();
											}
										}),
									}),
									tray.modal({
										trigger: tray.button("Quit", { intent: "alert-subtle", size: "md" }),
										onOpenChange: ctx.eventHandler(generateRandomUUID(), ({ open }: { open: boolean }) => {
											if (open) {
												$store.set(QUIZ_STATE, undefined);
											} else {
												tray.close();
											}
										}),
									}),
								]),
							],
							{ className: "p-2 border rounded-lg items-center" },
						)
					: [],
				tray.text("To play the game, you need to have at least a combined 100 entries from your Media List.", {
					className: "text-[--muted] text-xs text-center break-normal text-pretty",
				}),
			]);
		});

		function generateModal(type: $aniquiz.State["type"]) {
			const state = $store.getOrSet<$aniquiz.State | undefined>(QUIZ_STATE, () => ({ active: true, type, quiz: null }));
			return tray.stack([]);
		}

		function generateRandomUUID() {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
				((((Math.random() * 16) | 0) & (c == "x" ? 15 : 3)) | (c == "x" ? 0 : 8)).toString(16),
			);
		}

		function shuffle(entries: any[]) {
			for (let i = entries.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[entries[i], entries[j]] = [entries[j], entries[i]];
			}
		}

		function distractorNumbers(cy: number, minOffset: number = 1, maxOffset: number = 5) {
			return Array.from(
				{ length: 10 },
				() => cy + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset),
			)
				.filter((y) => y !== cy)
				.filter((y, i, a) => a.indexOf(y) === i)
				.slice(0, 3);
		}

		// May return references and not the actual values
		function getAnilistEntries<T extends "Anime" | "Manga">(mediaType: T) {
			type MediaEntry = T extends "Anime"
				? $app.AL_AnimeCollection_MediaListCollection_Lists_Entries
				: $app.AL_MangaCollection_MediaListCollection_Lists_Entries;
			type Media = T extends "Anime" ? $app.AL_BaseAnime : $app.AL_BaseManga;

			return ($anilist[`get${mediaType}Collection`](false).MediaListCollection?.lists ?? [])
				.flatMap((list) => list.entries)
				.filter((entry): entry is MediaEntry => !!entry && !((entry.id ?? 0) >= 2 ** 31))
				.map((entry) => entry.media)
				.filter((media): media is Media => !!media);
		}

		function getAllEntries(shuffle: boolean = false) {
			const entries = (["Anime", "Manga"] as const).flatMap((t) => getAnilistEntries(t).map((e) => ({ ...e, type: t })));
			if (shuffle) {
				for (let i = entries.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[entries[i], entries[j]] = [entries[j], entries[i]];
				}
			}
			return entries;
		}

		function generateLocalQuestion(type: $aniquiz.Type): $aniquiz.BaseQuizObject | undefined {
			const entries = getAllEntries(true);
			if (entries.length < 50) throw new Error(`Insuffecient entries: Could not generate Quiz. Please add more entries to your MediaList`);

			switch (type) {
				case "titleBasedOnSynopsis": {
					const [correct, ...invalidChoices] = entries.slice(0, 4);
					const choices = [correct, ...invalidChoices].map((x) => x.title?.userPreferred ?? "");
					shuffle(choices);
					return {
						heading: "Guess the title based off of the given synopsis",
						question: (correct.description ?? "[no synopsis]").replace(/<[^>]*>/g, ""),
						choices,
						answer: correct.title?.userPreferred ?? "",
					};
				}
				case "titleBasedOnCoverimage": {
					const [correct, ...invalidChoices] = entries.slice(0, 4);
					const choices = [correct, ...invalidChoices].map((x) => x.title?.userPreferred ?? "");
					shuffle(choices);
					return {
						heading: "Guess the title based off of the given cover",
						question: "Please select from one of the choices below",
						imgUrl: correct.coverImage?.large,
						choices,
						answer: correct.title?.userPreferred ?? "",
					};
				}
				case "releaseYear": {
					const correct = entries.filter((e) => !!e.startDate?.year)[0];
					const choices = [correct.startDate!.year, ...distractorNumbers(correct.startDate!.year!)];
					shuffle(choices);
					return {
						heading: `Release year of this ${correct.type}:`,
						question: correct.title?.userPreferred ?? "",
						imgUrl: correct.coverImage?.large,
						choices: choices.map((x) => x?.toString() ?? ""),
						answer: correct.startDate!.year!.toString(),
					};
				}
				case "releaseYearSeason": {
					const correct = entries.filter((e) => e.status !== "NOT_YET_RELEASED" && !!e.startDate?.year)[0];
					const CA = `${correct.startDate?.year} - ${correct.season}`;
					const choices = [
						CA,
						...distractorNumbers(correct.startDate!.year!).map((y) => `${y} - ${["WINTER", "SPRING", "SUMMER", "FALL"][Math.floor(Math.random() * 4)]}`),
					];
					shuffle(choices);
					return {
						heading: `When was the following ${correct.type} released?`,
						question: correct.title?.userPreferred ?? "",
						imgUrl: correct.coverImage?.large,
						choices: choices.map((x) => x?.toString() ?? ""),
						answer: CA,
					};
				}
				case "totalProgress": {
					const correct = entries.filter((e) => ("episodes" in e && e.episodes) || ("chapters" in e && e.chapters))[0];
					const CA = ("episodes" in correct ? correct.episodes : undefined) || ("chapters" in correct ? correct.chapters : undefined)!;
					const choices = [CA, ...(correct.type === "Anime" ? [10, 11, 12, 24].filter((x) => x != CA).slice(0, 3) : distractorNumbers(CA))];
					shuffle(choices);
					return {
						heading: `How many ${correct.type === "Anime" ? "episodes" : "chapters"} does the following ${correct.type} have?`,
						question: correct.title?.userPreferred ?? "",
						imgUrl: correct.coverImage?.large,
						choices: choices.map((x) => x?.toString() ?? ""),
						answer: CA.toString(),
					};
				}
				case "genreIn": {
					const correct = entries.filter((e) => e.genres?.length)[0];
					const answer = correct.genres!.sort(() => Math.random() - 0.5)[0];
					const choices = [
						answer,
						...VALID_GENRES.filter((g) => !correct.genres?.includes(g))
							.sort(() => Math.random() - 0.5)
							.slice(0, 3),
					];
					shuffle(choices);
					return {
						heading: `Which of the following genres does this ${correct.type} belong in?`,
						question: correct.title?.userPreferred ?? "",
						imgUrl: correct.coverImage?.large,
						choices,
						answer,
					};
				}
				case "genreNotIn": {
					const correct = entries.filter((e) => (e.genres?.length ?? 0) >= 3)[0];
					const answer = VALID_GENRES.filter((g) => !correct.genres?.includes(g)).sort(() => Math.random() - 0.5)[0];
					const choices = [answer, ...correct.genres!.sort(() => Math.random() - 0.5).slice(0, 3)];
					shuffle(choices);
					return {
						heading: `Which of the following genres is NOT in this ${correct.type}?`,
						question: correct.title?.userPreferred ?? "",
						imgUrl: correct.coverImage?.large,
						choices,
						answer,
					};
				}
				case "format": {
					const correct = entries[0];
					const answer = correct.format!;
					const choices = [
						answer,
						...(correct.type === "Anime" ? ["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"] : ["MANGA", "NOVEL", "ONE_SHOT", "UNKNOWN"])
							.filter((g) => g !== answer)
							.slice(0, 3),
					];
					shuffle(choices);
					return {
						heading: `The following ${correct.type}'s format is?`,
						question: correct.title?.userPreferred ?? "",
						imgUrl: correct.coverImage?.large,
						choices,
						answer,
					};
				}
			}
		}
	});
}
