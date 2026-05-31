/// <reference path="../../typings/manga-provider.d.ts" />
/// <reference path="../../typings/core.d.ts" />

// @ts-ignore
class Provider {
	private version = "1.0.0";
	private api = "https://toonily.com/";

	getSettings(): Settings {
		return {
			supportsMultiLanguage: false,
			supportsMultiScanlator: false,
		};
	}

	private getHeaders() {
		return {
			"User-Agent": `Toonily for Seanime/v${this.version} (github.com/nnotwen/n-seanime-extensions)`,
			"Content-Type": "text/html",
			Cookie: "toonily-mature=1;",
			Referer: this.api,
		};
	}

	// Returns the search results based on the query.
	async search(opts: QueryOptions): Promise<SearchResult[]> {
		const res = await fetch(`${this.api}search/${opts.query.trim().replace(/ +/g, "-")}?author&artist&adult`, { headers: this.getHeaders() });
		if (!res.ok) throw new Error(res.statusText);

		const $ = LoadDoc(res.text());

		return $("div.page-item-detail.manga").map((_, $el) => ({
			id: $el.find(".post-title a").attr("href")!,
			title: $el.find(".post-title a").text().trim(),
			image: $el.find(".item-thumb a img").attr("src"),
		}));
	}

	// Returns the chapters based on the manga ID.
	// The chapters should be sorted in ascending order (0, 1, ...).
	async findChapters(mangaId: string): Promise<ChapterDetails[]> {
		const res = await fetch(mangaId);
		if (!res.ok) throw new Error(res.statusText);

		const $ = LoadDoc(res.text());
		return $(".wp-manga-chapter")
			.map((_, $el) => ({
				id: $el.find("a").attr("href")!,
				url: $el.find("a").attr("href")!,
				title: $el.find("a").text()!,
				chapter: $el
					.find("a")
					.text()
					.trim()
					.match(/\d+(?:\.\d+)?/)?.[0]!,
			}))
			.reverse()
			.map((e, index) => ({ ...e, index }));
	}

	// Returns the chapter pages based on the chapter ID.
	// The pages should be sorted in ascending order (0, 1, ...).
	async findChapterPages(chapterId: string): Promise<ChapterPage[]> {
		const res = await fetch(chapterId);
		if (!res.ok) throw new Error(res.statusText);

		const $ = LoadDoc(res.text());
		return (
			$(".reading-content .page-break.no-gaps").map((index, $el) => ({
				index,
				url: $el.find("img").attr("src")!,
				headers: this.getHeaders(),
			})) ?? []
		);
	}
}
