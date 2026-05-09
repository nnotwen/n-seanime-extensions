/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/plugin.d.ts" />

declare namespace $traktsync {
	interface RequestAccessTokenBody {
		code: string;
		client_id: string;
		redirect_uri: string;
		grant_type: "authorization_code";
		code_verifier: string;
	}

	interface RefreshAccessTokenBody {
		refresh_token: string;
		client_id: string;
		grant_type: "refresh_token";
	}

	interface RequestAccessTokenResponse {
		token_type: "Bearer";
		expires_in: number;
		access_token: string;
		refresh_token: string;
	}

	interface StandardMediaObjectUser {
		username: string;
		private: boolean;
		name: string;
		vip: boolean;
		vip_ep: boolean;
		ids: {
			slug: string;
		};
	}

	interface ExtendedMediaObjectUser extends StandardMediaObjectUser {
		images: {
			avatar: {
				full?: string;
			};
		};
	}

	interface StandardMediaObjectMovie {
		title: string;
		year?: number;
		ids: {
			trakt: number;
			slug: string;
			imdb?: string;
			tmdb?: number;
		};
	}

	interface ExtendedMediaObjectMovie extends StandardMediaObjectMovie {
		tagline?: string;
		overview?: string;
		released?: string;
		runtime?: number;
		country?: string;
		trailer?: string;
		homepage?: string;
		status?: string;
		rating?: number;
		votes?: number;
		comment_count?: number;
		updated_at?: string;
		language?: string;
		available_translations?: string[];
		genres: string[];
		certification?: string;
	}

	interface StandardMediaObjectShow {
		title: string;
		year?: number;
		ids: {
			trakt: number;
			slug: string;
			tvdb?: number;
			imdb?: string;
			tmdb?: number;
		};
	}

	interface ExtendedMediaObjectShow extends StandardMediaObjectShow {
		tagline?: string;
		overview?: string;
		first_aired?: string;
		airs?: {
			day: string;
			time: string;
			timezone: string;
		};
		runtime?: number;
		certification?: string;
		network?: string;
		country?: string;
		trailer?: string;
		homepage?: string;
		status?: string;
		rating?: number;
		votes?: number;
		comment_count?: number;
		updated_at?: string;
		language?: string;
		available_translations?: string[];
		genres: string[];
		aired_episodes?: number;
	}

	interface StandardMediaObjectSeason {
		number: number;
		ids: {
			trakt: number;
			tvdb?: number;
			tmdb?: number;
		};
	}

	interface StandardMediaObjectEpisode {
		season: number;
		number: number;
		title: string;
		ids: {
			trakt: number;
			tvdb?: number;
			imdb?: string;
			tmdb?: number;
		};
	}

	interface WatchlistMovieItem {
		listed_at: string;
		type: "movie";
		movie: ExtendedMediaObjectMovie;
	}

	interface WatchlistShowItem {
		listed_at: string;
		type: "show";
		show: ExtendedMediaObjectShow;
	}

	type WatchlistResponse<T> = T extends "movies" ? WatchlistMovieItem : WatchlistShowItem;

	interface WatchedMovieResponse {
		plays: number; // Times watched | repeat_num
		last_watched_at: string;
		movie: ExtendedMediaObjectMovie;
	}

	interface WatchedShowResponse {
		plays: number;
		last_watched_at: string;
		watched_episodes: number; // progress
		show: ExtendedMediaObjectShow & {
			seasons?: {
				number: number;
				episodes: {
					number: number;
					played: boolean;
					last_watched_at?: string;
				}[];
			}[];
		};
	}

	type WatchedResponse<T extends "movies" | "shows"> = T extends "movies" ? WatchedMovieResponse : WatchedShowResponse;

	interface TraktIds {
		trakt: number;
		slug?: string;
		imdb?: string;
		tmdb?: number;
	}
	interface SyncPayload {
		movies?: { ids: TraktIds }[];
		shows?: {
			ids: TraktIds;
			seasons?: {
				number: number;
				episodes?: {
					number: number;
				}[];
			}[];
		}[];
		seasons?: {
			ids: TraktIds;
			number: number;
		}[];
		episodes?: {
			ids: TraktIds;
			season: number;
			number: number;
		}[];
	}

	interface RatingAddPayload {
		movies?: { ids: TraktIds; rating: number }[];
		shows?: { ids: TraktIds; rating: number }[];
		seasons?: { ids: TraktIds; rating: number }[];
	}

	interface RatingRemovePayload {
		movies?: { ids: TraktIds }[];
		shows?: { ids: TraktIds }[];
		seasons?: { ids: TraktIds }[];
	}

	interface TraktSyncResponse {
		added: TraktSyncResponseItems;
		deleted: TraktSyncResponseItems;
		updated: TraktSyncResponseItems;
		not_found: NotFoundObjects;
	}

	interface TraktSyncResponseItems {
		movies: number;
		shows: number;
		seasons: number;
		episodes: number;
	}

	interface NotFoundObjects {
		movies: NotFoundObject[];
		shows: NotFoundObject[];
		seasons: NotFoundObject[];
		episodes: NotFoundObject[];
	}

	interface NotFoundObject {
		ids: {
			trakt: number;
		};
	}

	type ScrobbleRequestBody = {
		progress: number;
		movie?: { ids: TraktIds };
		show?: { ids: TraktIds };
		episode?: { season: number; number: number };
	};

	interface ScrobbleResponseBody {
		id: number;
		action: "scrobble" | "checkin" | "watch"; // always scrobble
		type: "movie" | "show" | "episode";
		score: "number";
		episode?: EpisodeDetails;
		movie?: MovieDetails;
		show?: ShowDetails;
		episode_season?: number;
		episode_number?: number;
		progress?: number;
		played_at?: string;
		media_trakt?: number;
		media_imdb?: string;
		media_tmdb?: string;
		media_tvdb?: string;
		title?: string;
		year?: number;
		show_title?: string;
	}

	interface EpisodeDetails {
		season: number;
		number: number;
		title: string;
		ids: TraktIds;
	}

	interface MovieDetails {
		title: string;
		year: number;
		ids: TraktIds;
	}

	interface ShowDetails {
		title: string;
		year: number;
		ids: TraktIds;
	}

	interface ApplicationPlaybackState {
		traktId: number | null;
		type: "show" | "movie";
		season?: number;
		episode?: number;
		progress: number;
		title: string;
		paused: boolean;
		coverImage?: string;
	}

	interface NotificationManager {
		id: string;
		unreads: $ui.State<number>; // Updated when notification is added or a notification is clicked (unread -> read)
		entries?: Notification[];
		formattedEntry: void[];
		modalOpened: $ui.State<boolean>;
		push: (entry: Omit<Notification, "unread" | "timestamp">) => void;
		formatEntry: (entry: Notification, idx: number) => void;
	}

	interface Notification {
		unread: boolean;
		title: string;
		body:
			| {
					type: "update" | "progress" | "delete";
					status: "success" | "error";
					payload: {
						score?: number;
						progress?: number;
						added_in?: "history" | "watchlist";
						removed_from?: "history" | "watchlist";
					};
					metadata: { image?: string };
			  }
			| { entries: number; errors: number; skips: number; updates: number; remarks: string; job_type: string; media_type: string; sync_type: string };
		timestamp: number;
	}
}

type RateLimitInfo = {
	limit: number;
	remaining: number;
	reset: number; // epoch seconds
};

type PostUpdateEntry =
	| $app.PostUpdateEntryEvent
	| $app.PostUpdateEntryProgressEvent
	| $app.PostUpdateEntryRepeatEvent
	| { mediaId?: number; isDeleted: true };

type PreUpdateData = $app.PreUpdateEntryEvent | $app.PreUpdateEntryProgressEvent | $app.PreUpdateEntryRepeatEvent;

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
