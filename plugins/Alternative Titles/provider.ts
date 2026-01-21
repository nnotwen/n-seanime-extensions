/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />

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
			[Order.NatRom]: ["native", "romaji"],
			[Order.NatEn]: ["native", "english"],
			[Order.RomNat]: ["romaji", "native"],
			[Order.RomEn]: ["romaji", "english"],
			[Order.EnNat]: ["english", "native"],
			[Order.EnRom]: ["english", "romaji"],
		};

		const order = $getUserPreference("order") as Order;
		const includeSynonyms = $getUserPreference("synonyms") === "true";

		ctx.dom.observe(
			"[data-anime-entry-page], [data-manga-entry-page]",
			async (els) => {
				const el = els[0];
				if (!el) return;

				const data = JSON.parse((await el.getDataAttribute("media")) ?? "{}");
				const $ = LoadDoc(el.innerHTML ?? "");

				const titleIdMain = $("[data-media-page-header-entry-details-title-container] div").attr("id");
				const titleIdSub = $("[data-media-page-header-entry-details-title-container] h4").attr("id");

				const sequence = orderMap[order] ?? ["romaji", "english", "native"];
				const picked = sequence.map((k) => data.title[k]).filter(Boolean);

				const titles = { first: picked[0] ?? "", second: picked[1] ?? "", third: picked[2] ?? "" };

				if (titleIdMain && titles.first) ctx.dom.asElement(titleIdMain).setInnerHTML(titles.first);
				if (titleIdSub && titles.second) ctx.dom.asElement(titleIdSub).setInnerHTML(titles.second);

				if (includeSynonyms) {
					let titleIdSyn = $("[data-media-page-header-entry-details-title-container] .synonyms").attr("id");
					if (!titleIdSyn) {
						const el = await ctx.dom.createElement("p");
						const className = "synonyms text-sm text-gray-200 font-semibold line-clamp-2 text-center lg:text-left xl:max-w-[50vw]";
						el.setProperty("className", className.split(/\+/));
						el.setText(data.synonyms.join(", "));

						ctx.dom.asElement(titleIdSub ?? titleIdSyn!).after(el);
					} else {
						ctx.dom.asElement(titleIdSyn).setInnerHTML(data.synonyms.join(", "));
					}
				}
			},
			{
				withInnerHTML: true,
				identifyChildren: true,
			},
		);
	});
}
