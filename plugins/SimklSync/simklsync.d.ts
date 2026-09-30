/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/plugin.d.ts" />

declare namespace $simkl {
	interface AccessTokenExchangeCodeResponse {
		access_token: string;
		token_type: "Bearer";
		expires_in: number;
		refresh_token: string;
		scope: "media:read" | "media:read media:write";
	}

	interface SimklUserInfo {
		account: {
			id: number;
			timezone: string;
			type: string; // e.g. "free", "premium"
		};
		connections: {
			facebook: boolean;
			// add other social connections if needed
		};
		user: {
			age: string; // empty string if not provided
			avatar: string; // URL to avatar image
			bio: string;
			gender: string;
			joined_at: string; // ISO date string
			loc: string | null; // location can be null
			name: string;
		};
	}

	type SimklStatus = "watching" | "completed" | "plantowatch" | "hold" | "dropped";

	interface WatchlistPostBody {
		movies?: {
			to: SimklStatus;
			ids: { anilist: number };
		}[];
		shows?: {
			to: SimklStatus;
			ids: { anilist: number };
		}[];
		anime?: {
			to: SimklStatus;
			ids: { anilist: number };
		}[];
	}

	interface UpdateEntryBody {
		ids: { anilist: number };
		to?: SimklStatus;
		status?: SimklStatus;
		episodes?: {
			number: number;
			watched_at?: string;
		}[];
		rating?: number;
		watched_at?: string;
		added_at?: string;
		is_rewatch?: boolean;
		memo?: { text: string; private?: boolean };
	}

	interface UpdatePayload {
		anime?: UpdateEntryBody[];
		shows?: UpdateEntryBody[];
		movies?: Omit<UpdateEntryBody, "episodes"> & { watched_at?: string }[];
	}

	interface UpdateResponseObjects {
		to: SimklStatus;
		ids: {
			simkl?: number;
			slug: string;
			imdb?: string;
			tvdb?: string;
			tmdb?: string;
			mal?: string;
			anidb?: string;
			anilist?: string;
		};
		anime_type?: "movie" | "show";
	}

	interface UpdateResponse {
		added: {
			episodes?: UpdateResponseObjects[];
			movies: UpdateResponseObjects[];
			shows: UpdateResponseObjects[];
		};
		not_found: {
			episodes?: UpdateResponseObjects[];
			movies: UpdateResponseObjects[];
			shows: UpdateResponseObjects[];
		};
	}

	interface StatusEntry {
		request: {
			ids: { anilist: number };
			rating?: number;
			status: SimklStatus;
			type: "show" | "movie";
			watched_at?: string;
			memo?: { text: string };
		};
		response: {
			anime_type: "tv" | "movie" | "ova" | "ona" | "special";
			simkl_type: "anime";
			status: string;
		};
	}

	interface HistoryUpdateResponse {
		added: {
			episodes: number;
			movies: number;
			shows: number;
			statuses: StatusEntry[];
		};
		not_found: {
			episodes: UpdateResponseObjects[];
			movies: UpdateResponseObjects[];
			shows: UpdateResponseObjects[];
		};
	}

	interface DeleteResponse {
		deleted: {
			movies: number;
			shows: number;
			episodes: number;
		};
		not_found: {
			movies: UpdateResponseObjects[];
			shows: UpdateResponseObjects[];
		};
	}

	interface AnimeSearchResponse {
		type: "anime";
		title: string;
		poster: string;
		year: number;
		status: "released" | "upcoming" | "ended" | "aired" | "tba";
		ids: {
			simkl: number;
			slug: string;
		};
		total_episodes?: number;
		anime_type: "tv" | "movie" | "special" | "ova" | "ona" | "music video";
	}

	interface NotificationManagerV2 {
		id: string;
		unreads: $ui.State<number>;
		modalOpened: $ui.State<boolean>;
		entries: NotificationV2[];
	}

	interface NotificationV2 {
		timestamp: number;
		unread: boolean;
		title: string;
		thumbnail?: string;
		description?: string;
		accentColor?: string;
		fields?: {
			name: string;
			value: string;
		}[];

		// Helpful in collapsing multiple progress notifications
		custom_data?: {
			mediaId: number;
			episode: number;
			type: $app.AL_MediaType;
		};
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
						progress?: string;
						added_in?: "history" | "watchlist";
						removed_from?: "history" | "watchlist";
					};
					metadata: { image?: string };
			  }
			| { entries: number; errors: number; skips: number; updates: number; remarks: string; job_type: string; media_type: string; sync_type: string };
		timestamp: number;
	}

	interface ApplicationPlaybackState {
		anilistId: number;
		season?: number | undefined;
		episode?: number | undefined;
		progress: number;
		title: string;
		paused: boolean;
		coverImage?: string | undefined;
	}

	interface ScrobbleRequestBody {
		progress: number;
		anime: {
			ids: {
				anilist: number;
			};
		};
		episode: {
			number: number;
		};
	}

	interface MediaListCollection {
		last_sync: Activities | null;
		anime: {
			added_to_watchlist_at: string | null;
			last_watched_at: string | null;
			user_rated_at: string | null;
			user_rating: number | null;
			status: SimklStatus;
			last_watched: string | null;
			next_to_watch: string | null;
			watched_episodes_count: number;
			total_episodes_count: number;
			not_aired_episodes_count: number;
			show: {
				title: string;
				poster: string;
				year: number;
				ids: {
					simkl: number;
					slug: string;
					imdb?: string;
					tvdb?: string;
					tmdb?: string;
					mal?: string;
					anidb?: string;
					anilist?: string;
				};
			};
			anime_type?: "tv" | "movie" | "ova" | "ona" | "special" | "music video" | null;
			memo?: { text?: string; isPrivate?: boolean };
		}[];
	}

	interface Activities {
		anime: {
			all: string;
			removed_from_list: string;
		};
	}

	interface ScrobleResponseShape {
		action: "start" | "pause" | "stop" | "scrobble";
		progress: number;
		id: number;
	}

	interface OverrideData {
		mediaId: number; // Custom ID,
		simklId: number;
		type: "show" | "movie";
		seasons: {
			number: number;
			episodes: [];
		}[];
	}
}
