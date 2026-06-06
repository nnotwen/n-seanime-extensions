/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const text = Object.fromEntries(Array.from({ length: 10 }, (_, idx) => [idx + 1, $getUserPreference(`rating-${idx + 1}`) as string]));
		const fmt = $getUserPreference("format") ?? "";

		ctx.dom.observe(
			"[data-anime-entry-page], [data-manga-entry-page]",
			async (els) => {
				const el = els[0];
				if (!el) return;

				const data: $app.AL_BaseAnime | $app.AL_BaseManga = JSON.parse((await el.getDataAttribute("media")) ?? "{}");
				const rawListData = await el.getDataAttribute(`${data.type?.toLowerCase()}EntryListData`);
				const listdata: $app.Anime_EntryListData | $app.Manga_EntryListData = JSON.parse(rawListData ?? "{}");

				const $ = LoadDoc(el.innerHTML ?? "");
				const scoreId = $("[data-media-page-header-score-badge]").attr("id") ?? "";
				const scoreIdx = Math.round((listdata.score ?? 0) / 10).toString();
				const starIcon = $("[data-media-page-header-score-badge] span").html();

				const innerText = fmt.replace("{{SCORE}}", `${(listdata.score ?? 0) / 10}`).replace("{{RATE}}", text[scoreIdx]);

				ctx.dom.asElement(scoreId).setInnerHTML(`${starIcon} ${innerText}`);
			},
			{
				withInnerHTML: true,
				identifyChildren: true,
			},
		);
	});
}
