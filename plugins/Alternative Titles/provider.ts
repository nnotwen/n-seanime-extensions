/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		enum Order {
			NatRom = "1", // Native → Romaji
			NatEn = "2", // Native → English
			RomNat = "3", // Romaji → Native
			RomEn = "4", // Romaji → English
			EnNat = "5", // English → Native
			EnRom = "6", // English → Romaji
		}

		const orderMap: Record<Order, (keyof $app.AL_BaseAnime_Title)[]> = {
			[Order.NatRom]: ["native", "romaji", "english"],
			[Order.NatEn]: ["native", "english", "romaji"],
			[Order.RomNat]: ["romaji", "native", "english"],
			[Order.RomEn]: ["romaji", "english", "native"],
			[Order.EnNat]: ["english", "native", "romaji"],
			[Order.EnRom]: ["english", "romaji", "native"],
		};

		const order = $getUserPreference("order") as Order;
		const includeSynonyms = $getUserPreference("synonyms") === "true";

		ctx.dom.observe(
			"[data-anime-entry-page], [data-manga-entry-page]",
			async (els) => {
				const el = els[0];
				if (!el) return;

				const data: $app.AL_BaseAnime | $app.AL_BaseManga = JSON.parse((await el.getDataAttribute("media")) ?? "{}");
				const $ = LoadDoc(el.innerHTML ?? "");

				// Selector for title
				const titleIdMain = $("[data-media-page-header-entry-details-title-container] div").attr("id");
				const titleIdSub = $("[data-media-page-header-entry-details-title-container] p").attr("id");

				const sequence = orderMap[order] ?? ["romaji", "english", "native"];
				const picked = sequence.map((k) => data.title?.[k]).filter(Boolean);

				const titles = { first: picked[0] ?? "", second: picked[1] ?? "", third: picked[2] ?? "" };

				if (titleIdMain && titles.first) ctx.dom.asElement(titleIdMain).setInnerHTML(titles.first);
				if (titleIdSub && titles.second) ctx.dom.asElement(titleIdSub).setInnerHTML(titles.second);

				if (includeSynonyms) {
					const oid = await ctx.dom.query("[data-media-page-header-entry-details-title-container] .synonyms");
					oid.forEach((e) => e.remove());

					const el = await ctx.dom.createElement("p");
					const className = "synonyms text-sm italic text-[--muted] font-semibold line-clamp-2 text-center lg:text-left xl:max-w-[50vw]";
					el.setProperty("className", className.split(/\+/));
					el.setText([titles.third, ...(data.synonyms ?? [])].filter(Boolean).join(", "));

					ctx.dom.asElement(titleIdSub ?? titleIdMain!).after(el);
				}
			},
			{
				withInnerHTML: true,
				identifyChildren: true,
			},
		);
	});
}
