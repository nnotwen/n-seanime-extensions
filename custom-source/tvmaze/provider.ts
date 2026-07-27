/// <reference path="../../typings/custom-source.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="./tvmaze.d.ts" />

// @ts-ignore
class Provider implements CustomSource {
	BASE_URI = "https://api.tvmaze.com/";
	CACHE_KEY = "5204b3a8-9f51-421a-821e-4e5f98c21490";

	getSettings(): Settings {
		return {
			supportsAnime: true,
			supportsManga: false,
		};
	}

	private getHeaders() {
		return {
			"User-Agent": "TVMaze for Seanime/v1.0.0 (github.com/nnotwen/n-seanime-extensions)",
			Accept: "application/json",
		};
	}

	async getAnime(ids: number[]): Promise<$app.AL_BaseAnime[]> {
		const cache = $store.getOrSet<Record<number, $app.AL_BaseAnime>>(this.CACHE_KEY, () => ({}));
		return ids.map((id) => cache[id]).filter(Boolean);
	}

	async getAnimeDetails(id: number): Promise<$app.AL_AnimeDetailsById_Media | null> {
		const res = await fetch(`${this.BASE_URI}shows/${id}/cast`, { headers: this.getHeaders() });
		if (!res.ok) throw new Error(res.statusText);

		const characterData: $tvmaze.CastCreditsResponse = res.json();
		const characters: $app.AL_AnimeDetailsById_Media_Characters = {
			edges: characterData.map((c) => ({
				id: c.character.id,
				name: c.character.name,
				node: {
					id: c.character.id,
					isFavourite: false,
					name: {
						full: c.character.name,
					},
					siteUrl: c.character._links.self.href,
					image: {
						large: c.character.image?.original ?? c.character.image?.medium,
					},
				},
				role: c.voice ? "MAIN" : "SUPPORTING",
			})),
		};

		return { id, characters };
	}

	async getAnimeMetadata(id: number): Promise<$app.Metadata_AnimeMetadata | null> {
		const res = await fetch(`${this.BASE_URI}shows/${id}/episodes`, { headers: this.getHeaders() });
		if (!res.ok) throw new Error(res.statusText);

		const episodeData: $tvmaze.Episode[] = res.json();
		const episodeEntries = episodeData.map((e, i) => [
			(i + 1).toString(),
			{
				anidbId: e.id,
				tvdbId: e.id,
				title: `S${e.season}E${e.number?.toString().padStart(2, "0")} ${e.name}`,
				image: e.image?.original,
				airDate: e.airdate,
				length: e.runtime,
				summary: e.summary
					?.replace(/<\/p>\s*<p>/g, "\n\n")
					.replace(/<[^>]*>/g, "")
					.trim(),
				overview: e.summary
					?.replace(/<\/p>\s*<p>/g, "\n\n")
					.replace(/<[^>]*>/g, "")
					.trim(),
				episodeNumber: i + 1,
				episode: (i + 1).toString(),
				seasonNumber: e.season,
				absoluteEpisodeNumber: i + 1,
				anidbEid: e.id,
			},
		]);

		return { episodeCount: 1, specialCount: 0, episodes: Object.fromEntries(episodeEntries) };
	}

	async getAnimeWithRelations(id: number): Promise<$app.AL_CompleteAnime> {
		return { id };
	}

	async listAnime(search: string, page: number, perPage: number): Promise<ListResponse<$app.AL_BaseAnime>> {
		const endpoint = search.trim().length ? `search/shows?q=${encodeURIComponent(search)}` : `shows?page=${page}`;
		const res = await fetch(this.BASE_URI + endpoint, { headers: this.getHeaders() });
		if (!res.ok) throw new Error(res.statusText);

		const data: $tvmaze.Show[] = res.json().map(function (e: any) {
			if (search.trim().length) {
				const r: $tvmaze.SearchQueryResponseItem = e;
				return r.show;
			} else {
				const r: $tvmaze.ShowsResponse[number] = e;
				return r;
			}
		});

		const media: $app.AL_BaseAnime[] = data.map((entry) => ({
			id: entry.id,
			// idMal: NaN,
			siteUrl: entry.url,
			status: this.getMediaStatus(entry.status),
			// season?: AL_MediaSeason;
			type: "ANIME" as $app.AL_MediaType,
			format: "TV",
			seasonYear: entry.premiered ? Number(entry.premiered.split("-")[0]) : undefined,
			// bannerImage: "",
			// episodes: NaN,
			// synonyms?: Array<string>;
			// isAdult?: boolean;
			countryOfOrigin: entry.network?.country?.name,
			meanScore: entry.rating.average ? entry.rating.average * 10 : undefined,
			description: entry.summary
				?.replace(/<\/p>\s*<p>/g, "\n\n")
				.replace(/<[^>]*>/g, "")
				.trim(),
			genres: entry.genres,
			duration: entry.runtime ?? undefined,
			// trailer: "",
			title: {
				userPreferred: entry.name,
				english: entry.name,
			},
			coverImage: {
				extraLarge: entry.image?.original,
				medium: entry.image?.medium,
				large: entry.image?.original,
			},
			startDate: entry.premiered
				? (() => {
						const [year, month, day] = entry.premiered.split("-").map(Number);
						return { year, month, day };
					})()
				: undefined,
			endDate: entry.ended
				? (() => {
						const [year, month, day] = entry.ended?.split("-").map(Number);
						return { year, month, day };
					})()
				: undefined,
			// nextAiringEpisode: ""
		}));

		const prevcache = Object.entries($store.getOrSet<Record<number, $app.AL_BaseAnime>>(this.CACHE_KEY, () => ({})));
		$store.set(this.CACHE_KEY, Object.fromEntries([...prevcache, ...media.map((m) => [m.id, m])]));

		return { media, total: 0, page: page, totalPages: 0 };
	}

	async getManga(ids: number[]): Promise<$app.AL_BaseManga[]> {
		return [];
	}

	async getMangaDetails(id: number): Promise<$app.AL_MangaDetailsById_Media | null> {
		return null;
	}

	async listManga(search: string, page: number, perPage: number): Promise<ListResponse<$app.AL_BaseManga>> {
		return { media: [], total: 0, page, totalPages: 0 };
	}

	private getMediaStatus(status: $tvmaze.ShowStatus): $app.AL_MediaStatus {
		const stat: Record<$tvmaze.ShowStatus, $app.AL_MediaStatus> = {
			Running: "RELEASING",
			Ended: "FINISHED",
			"To Be Determined": "HIATUS",
			"In Development": "NOT_YET_RELEASED",
			Pilot: "RELEASING",
		};
		return stat[status];
	}
}
