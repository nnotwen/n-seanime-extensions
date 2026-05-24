/// <reference path="../../typings/manga-provider.d.ts" />
/// <reference path="./nhentai.d.ts" />

// @ts-ignore
class Provider {
	private api = "https://nhentai.net/api/v2";
	private CACHE_KEY = "f67a9156-6ff7-47e4-a49e-de44ad4749a2";
	api_key = "{{api-key}}";

	getSettings(): Settings {
		return {
			supportsMultiLanguage: false,
			supportsMultiScanlator: false,
		};
	}

	private getHeaders() {
		return {
			Authorization: `Key ${this.api_key}`,
			"User-Agent": "nHentai for Seanime/v1.0.0 (github.com/nnotwen/n-seanime-extensions)",
			"Content-Type": "application/json",
		};
	}

	// Returns the search results based on the query.
	async search(opts: QueryOptions): Promise<SearchResult[]> {
		// TODO
		const [_, id] = opts.query.match(/.*\(#(\d+)\)/) ?? [];
		if (!id) return [];

		return [{ id, title: opts.query }];
	}

	// Returns the chapters based on the manga ID.
	// The chapters should be sorted in ascending order (0, 1, ...).
	async findChapters(mangaId: string): Promise<ChapterDetails[]> {
		// TODO
		return [
			{
				id: `nhentai-galleryId:${mangaId}`,
				url: `https://nhentai.net/g/${mangaId}`,
				title: "Chapter 1",
				chapter: "1",
				index: 0,
			},
		];
	}

	// Returns the chapter pages based on the chapter ID.
	// The pages should be sorted in ascending order (0, 1, ...).
	async findChapterPages(chapterId: string): Promise<ChapterPage[]> {
		// TODO
		const res = await fetch(`${this.api}/galleries/${chapterId.split(":").pop()}`, { headers: this.getHeaders() });
		if (!res.ok) throw new Error(res.statusText);
		const data: $nhentai.Gallery = await res.json();
		return data.pages
			.sort((a, b) => a.number - b.number)
			.map((page, index) => ({
				url: `https://i.nhentai.net/${page.path}`,
				index,
				headers: { ...this.getHeaders(), Referer: "https://nhentai.net" },
			}));
	}
}
