/// <reference path="../../typings/custom-source.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="./nhentai.d.ts" />

class Provider implements CustomSource {
	BASE_URI = "https://nhentai.net/api/v2";
	CACHE_KEY = "2f95b63e-85f3-4e8a-8687-a3f27ee09f73";
	api_key = "{{api-key}}";

	getSettings(): Settings {
		return {
			supportsAnime: false,
			supportsManga: true,
		};
	}

	private getHeaders() {
		return {
			Authorization: `Key ${this.api_key}`,
			"User-Agent": "nHentai for Seanime/v1.0.0 (github.com/nnotwen/n-seanime-extensions)",
			"Content-Type": "application/json",
		};
	}

	async getAnime(ids: number[]): Promise<$app.AL_BaseAnime[]> {
		return [];
	}

	async getAnimeDetails(id: number): Promise<$app.AL_AnimeDetailsById_Media | null> {
		return null;
	}

	async getAnimeMetadata(id: number): Promise<$app.Metadata_AnimeMetadata | null> {
		return null;
	}

	async getAnimeWithRelations(id: number): Promise<$app.AL_CompleteAnime> {
		return { id };
	}

	async listAnime(search: string, page: number, perPage: number): Promise<ListResponse<$app.AL_BaseAnime>> {
		return { media: [], total: 0, page: page, totalPages: 0 };
	}

	async getManga(ids: number[]): Promise<$app.AL_BaseManga[]> {
		const cache = $store.getOrSet<Record<number, $app.AL_BaseManga>>(this.CACHE_KEY, () => ({}));
		return ids.map((id) => cache[id]).filter(Boolean);
	}

	async getMangaDetails(id: number): Promise<$app.AL_MangaDetailsById_Media | null> {
		return null;
	}

	/**
	 * https://nhentai.net/api/v2/docs#/galleries/get_all_galleries_api_v2_galleries_get
	 * @param search
	 * @param page default=1 minimum=1
	 * @param perPage default=25 maximum=100 | search has no per page
	 * @returns
	 */
	async listManga(search: string, page: number, perPage: number): Promise<ListResponse<$app.AL_BaseManga>> {
		const endpoint = search.trim().length
			? `search?query=${encodeURIComponent(search)}&sort=date&page=${page}`
			: `galleries?page=${page}&per_page=${perPage}`;
		const res = await fetch(`${this.BASE_URI}/${endpoint}`, { headers: this.getHeaders() });

		if (!res.ok) throw new Error(res.statusText);
		const data: $nhentaics.Galleries = res.json();
		const media: $app.AL_BaseManga[] = data.result.map((entry) => ({
			id: entry.id,
			idMal: undefined,
			siteUrl: `https://nhentai.net/g/${entry.id}`,
			status: "FINISHED",
			// season: "",
			type: "MANGA",
			format: "MANGA",
			// bannerImage: "";
			chapters: 1,
			// volumes: 0;
			synonyms: [],
			isAdult: true,
			// countryOfOrigin: "";
			// meanScore?: 0;
			// description: "";
			// genres: [];
			title: {
				userPreferred: `${entry.english_title} (#${entry.id})`,
				english: `${entry.english_title} (#${entry.id})`,
				romaji: `#${entry.id}`,
				native: entry.japanese_title ?? undefined,
			},
			coverImage: {
				extraLarge: `https://t.nhentai.net/${entry.thumbnail}`,
				large: `https://t.nhentai.net/${entry.thumbnail}`,
				medium: `https://t.nhentai.net/${entry.thumbnail}`,
				color: "",
			},
		}));

		const prevcache = Object.entries($store.getOrSet<Record<number, $app.AL_BaseManga>>(this.CACHE_KEY, () => ({})));
		$store.set(this.CACHE_KEY, Object.fromEntries([...prevcache, ...media.map((m) => [m.id, m])]));

		return { media, total: media.length, page, totalPages: Math.ceil(data.total / (search.trim().length ? 25 : perPage)) };
	}
}
