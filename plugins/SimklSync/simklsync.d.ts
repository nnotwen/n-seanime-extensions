/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/plugin.d.ts" />

declare namespace $simkl {
	interface AccessTokenExchangeCodeResponse {
		access_token: string;
		token_type: "bearer";
		scope: "public";
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
	}

	interface UpdatePayload {
		anime?: UpdateEntryBody[];
		shows?: UpdateEntryBody[];
		movies?: Omit<UpdateEntryBody, "episodes"> & { watched_at?: string }[];
	}

	interface UpdateResponseObjects {
		to: SimklStatus;
		ids: {
			mal?: number;
			simkl?: number;
		};
	}

	interface UpdateResponse {
		added: {
			episodes: number;
			movies: number;
			shows: number;
		};
		not_found: {
			movies: UpdateResponseObjects[];
			shows: UpdateResponseObjects[];
			episodes: UpdateResponseObjects[];
		};
	}

	interface DeleteResponse {
		deleted: {
			movies: number;
			shows: number;
			anime: number;
		};
		not_found: {
			movies: UpdateResponseObjects[];
			shows: UpdateResponseObjects[];
			anime: UpdateResponseObjects[];
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
}
