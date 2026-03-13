declare namespace $malsync {
	interface RequestAccessTokenBody {
		client_id: string;
		client_secret?: string;
		grant_type: string;
		code: string;
		redirect_uri?: string;
		code_verifier: string;
	}

	interface RefreshAccessTokenBody {
		client_id: string;
		grant_type: "refresh_token";
		refresh_token: string;
	}

	interface RequestAccessTokenResponse {
		token_type: "Bearer";
		expires_in: number;
		access_token: string;
		refresh_token: string;
	}

	interface User {
		id: number;
		name: string;
		picture?: string;

		// Optional fields (only present if requested via ?fields=)
		gender?: string | null;
		birthday?: string | null; // "YYYY-MM-DD"
		location?: string | null;
		joined_at?: string; // ISO date
		time_zone?: string | null;
		is_supporter?: boolean;

		anime_statistics?: AnimeStatistics;
		manga_statistics?: MangaStatistics;
	}

	interface AnimeStatistics {
		num_items_watching: number;
		num_items_completed: number;
		num_items_on_hold: number;
		num_items_dropped: number;
		num_items_plan_to_watch: number;
		num_items: number;

		num_days_watched: number;
		num_days_watching: number;
		num_days_completed: number;
		num_days_on_hold: number;
		num_days_dropped: number;
		num_days_plan_to_watch: number;

		num_episodes: number;
		num_times_rewatched: number;
		mean_score: number;
	}

	interface MangaStatistics {
		num_items_reading: number;
		num_items_completed: number;
		num_items_on_hold: number;
		num_items_dropped: number;
		num_items_plan_to_read: number;
		num_items: number;

		num_chapters: number;
		num_volumes: number;
		num_days_read: number;

		mean_score: number;
	}

	type ListStatusBase = "completed" | "on_hold" | "dropped";
	type ListStatusAnime = "watching" | "plan_to_watch" | ListStatusBase;
	type ListStatusManga = "reading" | "plan_to_read" | ListStatusBase;

	interface ListUpdateBodyBase {
		priority?: number; // 0–2
		tags?: string; // comma-separated
		score?: number; // 0–10
		comments?: string | null;
		start_date?: string;
		finish_date?: string;
	}

	interface ListUpdateAnimeBody extends ListUpdateBodyBase {
		status?: ListStatusAnime;
		num_watched_episodes?: number;
		is_rewatching?: boolean;
		num_times_rewatched?: number;
		rewatch_value?: number; // 0–5
	}

	interface ListUpdateMangaBody extends ListUpdateBodyBase {
		status?: ListStatusManga;
		num_volumes_read?: number;
		num_chapters_read?: number;
		is_rereading?: boolean;
		num_times_reread?: number;
		reread_value?: number; // 0–5
	}

	interface ListEntryBase {
		score: number;
		updated_at: string; // ISO timestamp
		start_date?: string | null;
		finish_date?: string | null;
		priority?: number;
		tags?: string[] | null;
		comments?: string | null;
	}

	interface AnimeListEntry extends ListEntryBase {
		status: ListStatusAnime;
		num_episodes_watched: number;
		is_rewatching: boolean;
		num_times_rewatched?: number;
		rewatch_value?: number;
	}

	interface MangaListEntry extends ListEntryBase {
		status: ListStatusManga;
		num_volumes_read: number;
		num_chapters_read: number;
		is_rereading: boolean;
		num_times_reread?: number;
		reread_value?: number;
	}

	interface MalNode {
		id: number;
		title: string;
		media_type: string;
		main_picture?: {
			medium?: string;
			large?: string;
		};
	}

	interface AnimeListEntryWrapper {
		node: MalNode & { num_episodes: number };
		list_status: AnimeListEntry;
	}

	interface MangaListEntryWrapper {
		node: MalNode & { num_volumes: number; num_chapters: number };
		list_status: MangaListEntry;
	}

	type AllListEntry = AnimeListEntryWrapper | MangaListEntryWrapper;

	interface AnilistSaveMediaListEntryVariables {
		mediaId: number;
		status?: $app.AL_MediaListStatus;
		progress?: number;
		progressVolumes?: number;
		score?: number;
		repeat?: number;
		notes?: string;
		startedAt?: $app.AL_FuzzyDateInput;
		completedAt?: $app.AL_FuzzyDateInput;
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
					type: "update" | "progress" | "repeat" | "delete";
					status: "success" | "error";
					mediaId: number;
					payload: ListUpdateAnimeBody | ListUpdateMangaBody;
					metadata: { image?: string };
			  }
			| { entries: number; errors: number; skips: number; updates: number; remarks: string; job_type: string; media_type: string; sync_type: string };
		timestamp: number;
	}
}
