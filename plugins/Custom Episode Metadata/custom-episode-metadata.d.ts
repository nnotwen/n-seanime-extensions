/// <reference path="../../typings/app.d.ts" />

declare namespace CEM {
	interface SharedDatabase {
		records: () => Record<number, CustomEpisodeEntry>;
		get: (mediaId: number) => CustomEpisodeEntry;
		has: (mediaId: number) => boolean;
		save: (mediaId: number, data: CustomEpisodeMetadata) => CustomEpisodeEntry;
		delete: (mediaId: number, aniDBEpisode: string) => boolean;
	}

	type CustomEpisodeMetadata = Partial<
		Omit<$app.Metadata_EpisodeMetadata, "anidbId" | "tvdbId" | "episodeNumber" | "seasonNumber" | "absoluteEpisodeNumber" | "anidbEid">
	> &
		Pick<$app.Metadata_EpisodeMetadata, "episode">;

	interface CustomEpisodeEntry {
		mediaId: number;
		mediaTitle?: string;
		data: Record<string, CustomEpisodeMetadata>;
	}

	interface TMDBSearchResults {
		page: number;
		results: {
			adult: boolean;
			backdrop_path: string;
			genre_ids: number[];
			id: number;
			origin_country: string[];
			original_language: string;
			original_name: string;
			overview: string;
			popularity: number;
			poster_path: string;
			first_air_date: string;
			softcore: boolean;
			name: string;
			vote_average: number;
			vote_count: number;
		}[];
		total_pages: number;
		total_results: number;
	}

	interface BaseMedia {
		adult: boolean;
		backdrop_path: string | null;
		genres: {
			id: number;
			name: string;
		}[];
		homepage: string;
		id: number;
		origin_country: string[];
		original_language: string;
		overview: string;
		popularity: number;
		poster_path: string | null;
		production_companies: {
			id: number;
			logo_path: string | null;
			name: string;
			origin_country: string;
		}[];
		production_countries: {
			iso_3166_1: string;
			name: string;
		}[];
		softcore: boolean;
		spoken_languages: {
			english_name: string;
			iso_639_1: string;
			name: string;
		}[];
		status: string;
		tagline: string;
		vote_average: number;
		vote_count: number;
	}

	interface TMDBTVShowDetails extends BaseMedia {
		created_by: any[];
		episode_run_time: number[];
		first_air_date: string;
		in_production: boolean;
		languages: string[];
		last_air_date: string;
		last_episode_to_air: {
			id: number;
			name: string;
			overview: string;
			vote_average: number;
			vote_count: number;
			air_date: string;
			episode_number: number;
			episode_type: string;
			production_code: string;
			runtime: number | null;
			season_number: number;
			show_id: number;
			still_path: string | null;
		};
		name: string;
		next_episode_to_air: {
			id: number;
			name: string;
			overview: string;
			vote_average: number;
			vote_count: number;
			air_date: string;
			episode_number: number;
			episode_type: string;
			production_code: string;
			runtime: number | null;
			season_number: number;
			show_id: number;
			still_path: string | null;
		};
		networks: {
			id: number;
			logo_path: string | null;
			name: string;
			origin_country: string;
		}[];
		number_of_episodes: number;
		number_of_seasons: number;
		original_name: string;
		seasons: {
			air_date: string;
			episode_count: number;
			id: number;
			name: string;
			overview: string;
			poster_path: string | null;
			season_number: number;
			vote_average: number;
		}[];
		type: string;
	}

	interface TMDBMovieDetails extends BaseMedia {
		belongs_to_collection: {
			id: number;
			name: string;
			poster_path: string | null;
			backdrop_path: string | null;
		} | null;
		budget: number;
		imdb_id: string | null;
		original_title: string;
		release_date: string;
		revenue: number;
		runtime: number | null;
		title: string;
		video: boolean;
	}

	interface TMDBSeasonResults {
		_id: string;
		air_date: string;
		episodes: {
			air_date: string;
			episode_number: number;
			episode_type: string;
			id: number;
			name: string;
			overview: string;
			production_code: string;
			runtime: number;
			season_number: number;
			show_id: number;
			still_path: string;
			vote_average: number;
			vote_count: number;
			crew: {
				department: string;
				job: string;
				credit_id: string;
				adult: boolean;
				gender: number;
				id: number;
				known_for_department: string;
				name: string;
				original_name: string;
				popularity: number;
				profile_path: string;
			}[];
			guest_stars: {
				character: string;
				credit_id: string;
				order: number;
				adult: boolean;
				gender: number;
				id: number;
				known_for_department: string;
				name: string;
				original_name: string;
				popularity: number;
				profile_path: string;
			}[];
		}[];
		name: string;
		networks: {
			id: number;
			logo_path: string;
			name: string;
			origin_country: string;
		}[];
		overview: string;
		id: number;
		poster_path: string;
		season_number: number;
		vote_average: number;
	}

	interface TMDBOverrides {
		mediaId: number;
		tmdbId?: number;
		tmdbSeason?: number;
		episodeOverrides: {
			aniDBEpisode?: string;
			tmdbId?: number;
			tmdbSeason?: number;
			tmdbEpisode?: number;
		}[];
	}

	interface V1Entry {
		mediaId: number;
		mediaTitle?: string;
		// can exist in local library and torrent streaming
		main: Partial<Record<number, V1CustomEpisodeMetadata>>;
		// can only exist in local library
		special: Partial<Record<number, V1CustomEpisodeMetadata>>;
		nc: Partial<Record<number, V1CustomEpisodeMetadata>>;
	}

	interface V1CustomEpisodeMetadata {
		// For tracking
		mediaId: number;
		type: $app.Anime_LocalFileType;
		episodeNumber: number;
		// For partial tracking
		aniDBEpisode?: string;
		// For display
		displayTitle?: string;
		episodeTitle?: string;
		length?: number;
		airDate?: $app.AL_FuzzyDateInput;
		overview?: string;
		image?: string;
	}
}
