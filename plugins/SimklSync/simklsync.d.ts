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

	interface UpdateEntryBody {
		ids?: {
			simkl?: number;
			anidb?: number;
		};
		to?: SimklStatus;
		status?: SimklStatus;
		episodes?: {
			number: number;
			watched_at?: string;
		}[];
		rating?: number;
	}

	interface UpdatePayload {
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
			movies: UpdateResponseObjects[];
			shows: UpdateResponseObjects[];
			anime: UpdateResponseObjects[];
		};
		not_found: {
			movies: UpdateResponseObjects[];
			shows: UpdateResponseObjects[];
			anime: UpdateResponseObjects[];
		};
	}
}
