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
			[Order.NatRom]: ["native", "romaji", "english"],
			[Order.NatEn]: ["native", "english", "romaji"],
			[Order.RomNat]: ["romaji", "native", "english"],
			[Order.RomEn]: ["romaji", "english", "native"],
			[Order.EnNat]: ["english", "native", "romaji"],
			[Order.EnRom]: ["english", "romaji", "native"],
		};

		const order = $getUserPreference("order") as Order;
		const includeSynonyms = $getUserPreference("synonyms") === "true";
		const showMALQuickBtn = $getUserPreference("malbtn") === "true";

		ctx.dom.observe(
			"[data-anime-entry-page], [data-manga-entry-page]",
			async (els) => {
				const el = els[0];
				if (!el) return;

				const data: $app.AL_BaseAnime | $app.AL_BaseManga = JSON.parse((await el.getDataAttribute("media")) ?? "{}");
				const $ = LoadDoc(el.innerHTML ?? "");

				// Selector for title
				const titleIdMain = $("[data-media-page-header-entry-details-title-container] div").attr("id");
				const titleIdSub = $("[data-media-page-header-entry-details-title-container] h4").attr("id");

				const sequence = orderMap[order] ?? ["romaji", "english", "native"];
				const picked = sequence.map((k) => data.title?.[k]).filter(Boolean);

				const titles = { first: picked[0] ?? "", second: picked[1] ?? "", third: picked[2] ?? "" };

				if (titleIdMain && titles.first) ctx.dom.asElement(titleIdMain).setInnerHTML(titles.first);
				if (titleIdSub && titles.second) ctx.dom.asElement(titleIdSub).setInnerHTML(titles.second);

				if (includeSynonyms) {
					let titleIdSyn = $("[data-media-page-header-entry-details-title-container] .synonyms").attr("id");
					if (!titleIdSyn) {
						const el = await ctx.dom.createElement("p");
						const className = "synonyms text-sm text-gray-200 font-semibold line-clamp-2 text-center lg:text-left xl:max-w-[50vw]";
						el.setProperty("className", className.split(/\+/));
						el.setText([titles.third, ...(data.synonyms ?? [])].filter(Boolean).join(", "));

						ctx.dom.asElement(titleIdSub ?? titleIdSyn!).after(el);
					} else {
						ctx.dom.asElement(titleIdSyn).setInnerHTML([titles.third, ...(data.synonyms ?? [])].filter(Boolean).join(", "));
					}
				}

				if (showMALQuickBtn) {
					const btnAlId = $(`[data-${data.type?.toLowerCase()}-meta-section-buttons-container] a`).attr("id");
					const btnMalId = $(`[data-${data.type?.toLowerCase()}-meta-section-buttons-container] [data-at-malbtn]`).attr("id");
					const href = `https://myanimelist.net/${data.type?.toLowerCase()}/${data.idMal}`;

					if (!btnMalId) {
						const el = await ctx.dom.createElement("a");
						el.setAttribute("href", href);
						el.setAttribute("target", "_blank");
						el.setAttribute("data-at-malbtn", "true");
						el.setProperty("className", ["cursor-pointer"]);
						el.setInnerHTML(
							/*html*/ `
								<button type="button" class="UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border border-transparent bg-transparent hover:underline active:text-gray-700 dark:text-gray-300 dark:active:text-gray-200 UI-IconButton_root p-0 flex-none text-xl h-8 w-8 px-0">
									<span class="md:inline-block">
										<svg stroke="currentcolor" height="1.5em" width="1.5em" fill="currentcolor" viewBox="0 -2 24 24" xmlns="http://www.w3.org/2000/svg">
											<path d="M8.273 7.247v8.423l-2.103-.003v-5.216l-2.03 2.404-1.989-2.458-.02 5.285H.001L0 7.247h2.203l1.865 2.545 2.015-2.546zm8.628 2.069.025 6.335h-2.365l-.008-2.871h-2.8c.07.499.21 1.266.417 1.779.155.381.298.751.583 1.128l-1.705 1.125c-.349-.636-.622-1.337-.878-2.082a9.3 9.3 0 0 1-.507-2.179c-.085-.75-.097-1.471.107-2.212a3.9 3.9 0 0 1 1.161-1.866c.313-.293.749-.5 1.1-.687s.743-.264 1.107-.359a7.4 7.4 0 0 1 1.191-.183c.398-.034 1.107-.066 2.39-.028l.545 1.749H14.51c-.593.008-.878.001-1.341.209a2.24 2.24 0 0 0-1.278 1.92l2.663.033.038-1.81zm3.992-2.099v6.627l3.107.032-.43 1.775h-4.807V7.187z"></path>
										</svg>
									</span>
								</button>
						`.trim(),
						);
						ctx.dom.asElement(btnAlId!).after(el);
					} else {
						ctx.dom.asElement(btnMalId).setAttribute("href", href);
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
