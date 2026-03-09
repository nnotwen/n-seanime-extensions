/// <reference path="../../typings/app.d.ts" />

declare namespace CEM {
	interface Entry {
		mediaId: number;
		mediaTitle?: string;
		// can exist in local library and torrent streaming
		main: Partial<Record<number, CustomEpisodeMetadata>>;
		// can only exist in local library
		special: Partial<Record<number, CustomEpisodeMetadata>>;
		nc: Partial<Record<number, CustomEpisodeMetadata>>;
	}

	interface CustomEpisodeMetadata {
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
