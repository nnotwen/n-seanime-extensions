/// <reference path="../../typings/plugin.d.ts" />

declare namespace $shikimorisync {
	type UserRateStatus = "planned" | "watching" | "rewatching" | "completed" | "on_hold" | "dropped";

	interface RequestAccessTokenResponse {
		token_type: "Bearer";
		expires_in: number;
		access_token: string;
		refresh_token: string;
	}

	interface WhoAmI {
		id: number;
		nickname: string;
		avatar?: string;
		image: {
			x160?: string;
			x148?: string;
			x80?: string;
			x64?: string;
			x48?: string;
			x32?: string;
			x16?: string;
		};
		last_online_at: string;
		url: string;
		name: string | null;
		sex: string | null;
		website: string | null;
		birth_on: string | null;
		full_years: string | null;
		locale: string;
	}

	interface UserRateBase {
		user_id: number;
		status?: UserRateStatus;
		score?: number;
		episodes?: number;
		chapters?: number;
		volumes?: number;
		rewatches?: number;
		text?: string;
	}

	// PATCH /api/v2/user_rates/:id (modify)
	// PUT   /api/v2/user_rates/:id (overwrite)
	interface UserRatePatchOrPutBody {
		user_rate: Omit<UserRateBase, "user_id">;
	}

	// POST /api/v2/user_rates
	interface UserRateCreateBody {
		user_rate: Omit<UserRateBase, "user_id"> & {
			target_id: number;
			target_type: "Anime" | "Manga";
		};
	}

	interface UserRateListBody {
		user_id: number;
		target_id: number;
	}

	interface UserRateResponse extends UserRateBase {
		id: number;
		target_id: number; // anime or manga ID
		target_type: "Anime" | "Manga"; // type of media
		text_html: string | null; // comment rendered as HTML
		created_at: string; // ISO timestamp
		updated_at: string; // ISO timestamp
	}

	interface ErrorResponse {
		error: string;
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
					payload?: Omit<UserRateBase, "user_id">;
					metadata: { image?: string };
			  }
			| { entries: number; errors: number; skips: number; updates: number; remarks: string; job_type: string; media_type: string; sync_type: string };
		timestamp: number;
	}

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
}
