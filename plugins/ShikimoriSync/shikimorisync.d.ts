interface UserRateBase {
	user_id: number;
	status?: "watching" | "completed" | "on_hold" | "dropped" | "planned" | "rewatching";
	score?: number;
	episodes?: number;
	chapters?: number;
	volumes?: number;
	rewatches?: number;
	text?: string;
}

interface UserRatePatch {
	user_rate: UserRateBase;
}

interface UserRateCreate {
	user_rate: UserRateBase & {
		target_id: number;
		target_type: "Anime" | "Manga";
	};
}

// Request body for full replacement (PUT)
interface UserRatePut {
	user_rate: {
		status: "watching" | "completed" | "on_hold" | "dropped" | "planned" | "rewatching";
		score: number;
		episodes: number;
		chapters: number;
		volumes: number;
		rewatches: number;
		text: string;
	};
}

interface UserRateResponse {
	id: number;
	user_id: number;
	target_id: number; // anime or manga ID
	target_type: "Anime" | "Manga"; // type of media
	score: number; // 1–10
	status: "watching" | "completed" | "on_hold" | "dropped" | "planned" | "rewatching";
	rewatches: number;
	episodes: number;
	volumes: number;
	chapters: number;
	text: string | null; // user comment
	text_html: string | null; // comment rendered as HTML
	created_at: string; // ISO timestamp
	updated_at: string; // ISO timestamp
}

interface ErrorResponse {
	error: string;
}

interface ShikimoriWhoami {
	avatar?: string;
	birth_on: string | null;
	full_years: number | null;
	id: number;
	image: ShikimoriImages;
	last_online_at: string; // ISO 8601 timestamp
	locale: string;
	name: string | null;
	nickname?: string;
	sex: string | null;
	url?: string;
	website: string | null;
}

interface ShikimoriImages {
	x16?: string;
	x32?: string;
	x48?: string;
	x64?: string;
	x80?: string;
	x148?: string;
	x160?: string;
	[key: string]: string | undefined;
}

type PostUpdateEntry =
	| $app.PostUpdateEntryEvent
	| $app.PostUpdateEntryProgressEvent
	| $app.PostUpdateEntryRepeatEvent
	| { mediaId?: number; isDeleted: true };

type PreUpdateData = $app.PreUpdateEntryEvent | $app.PreUpdateEntryProgressEvent | $app.PreUpdateEntryRepeatEvent;

interface ShikimoriUserRate {
	id: number;
	user_id: number;
	target_id: number; // idMal
	target_type: "Anime" | "Manga";
	score: number;
	status: "planned" | "watching" | "rewatching" | "completed" | "on_hold" | "dropped";
	rewatches: number;
	episodes: number;
	volumes: number;
	chapters: number;
	text: string | null;
	text_html: string;
	created_at: string;
	updated_at: string;
}
