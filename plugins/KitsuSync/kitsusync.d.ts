/// <reference path="../../typings/app.d.ts" />

declare namespace $kitsusync {
	interface RequestAccessTokenResponse {
		token_type: "Bearer";
		expires_in: number;
		access_token: string;
		refresh_token: string;
	}

	interface KitsuUserResponse {
		data: KitsuUser[];
	}

	interface KitsuUser {
		id: string;
		type: "users";
		attributes: KitsuUserAttributes;
		relationships?: KitsuUserRelationships;
	}

	interface KitsuUserAttributes {
		name: string;
		slug: string;
		about?: string | null;
		location?: string | null;
		waifuOrHusbando?: string | null;
		followersCount?: number;
		followingCount?: number;
		createdAt: string;
		updatedAt: string;
		avatar?: KitsuImageSet | null;
		coverImage?: KitsuImageSet | null;
	}

	interface KitsuUserRelationships {
		favorites?: {
			links?: { related: string };
		};
		libraryEntries?: {
			links?: { related: string };
		};
	}

	interface KitsuLibraryEntryResponse {
		data: KitsuLibraryEntry[];
	}

	interface KitsuLibraryEntriesResponse {
		data: KitsuLibraryEntry[];
		included?: (KitsuMedia | KitsuMappings)[];
		links?: {
			first?: string;
			next?: string;
			prev?: string;
			last?: string;
		};
	}

	interface KitsuLibraryEntry {
		id: string;
		type: "libraryEntries";
		attributes: KitsuLibraryEntryAttributes;
		relationships?: {
			user?: {
				links?: { related?: string };
			};
			media?: {
				links?: { related?: string };
				data?: {
					id: string;
					type: "anime" | "manga";
				} | null;
			};
		};
	}

	interface KitsuLibraryEntryAttributes {
		status?: ListStatus;
		progress?: number; // episode/chapter count
		reconsuming?: boolean;
		reconsumeCount?: number;
		notes?: string | null;
		rating?: number | null; // 1–10
		ratingTwenty?: number | null; // 2–20 scale
		startedAt?: string | null;
		finishedAt?: string | null;
		private?: boolean;
		createdAt: string;
		updatedAt: string;
	}

	type KitsuLibraryEntryWriteAttributes = Omit<KitsuLibraryEntryAttributes, "createdAt" | "updatedAt">;

	interface KitsuMedia {
		id: string;
		type: "anime" | "manga";
		attributes: KitsuMediaAttributes;
		relationships: {
			mappings: {
				data: { id: string; type: "mappings" }[];
			};
		};
	}

	interface KitsuMediaAttributes {
		canonicalTitle?: string;
		titles?: Record<string, string>;
		posterImage?: KitsuImageSet | null;
	}

	interface KitsuImageSet {
		tiny?: string;
		small?: string;
		medium?: string;
		large?: string;
	}

	interface KitsuMappings {
		id: string;
		type: "mappings";
		attributes: {
			externalId: string;
			externalSite: string;
		};
	}

	type ListStatus = "completed" | "on_hold" | "dropped" | "current" | "planned";

	interface KitsuLibraryEntryPostResponse {
		data: {
			id: string;
			type: "libraryEntries";
			attributes: Omit<$kitsusync.KitsuLibraryEntryAttributes, "status" | "progress" | "reconsuming" | "notes" | "rating"> & {
				status: ListStatus;
				progress: number;
				reconsumeCount: number;
				ratingTwenty: number | null;
				startedAt: string | null;
				finishedAt: string | null;
				createdAt: string;
				updatedAt: string;
			};
			relationships: {
				media: {
					data: {
						type: "anime" | "manga";
						id: string;
					};
				};
				user: {
					data: {
						type: "users";
						id: string;
					};
				};
			};
		};
		included?: any[];
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
					payload: KitsuLibraryEntryWriteAttributes;
					metadata: { image?: string };
			  }
			| { entries: number; errors: number; skips: number; updates: number; remarks: string; job_type: string; media_type: string; sync_type: string };
		timestamp: number;
	}
}

// Common attributes shared by POST and PATCH
interface KitsuLibraryEntryAttributes {
	status?: "current" | "planned" | "completed" | "on_hold" | "dropped";
	progress?: number;
	reconsuming?: boolean;
	reconsumeCount?: number; // AniList "repeat"
	ratingTwenty?: number; // AniList score mapped to 20-point scale
	startedAt?: string; // ISO date string
	finishedAt?: string; // ISO date string
	notes?: string;
	private?: boolean;
}

// POST body (create new entry)
interface KitsuLibraryEntryPostBody {
	data: {
		type: "libraryEntries";
		attributes: KitsuLibraryEntryAttributes;
		relationships: {
			media: {
				data: {
					type: "anime" | "manga";
					id: string; // Kitsu media ID
				};
			};
			user: {
				data: {
					type: "users";
					id: string;
				};
			};
		};
	};
}

// PATCH body (update existing entry)
interface KitsuLibraryEntryPatchBody {
	data: {
		id: string; // existing library entry ID
		type: "libraryEntries";
		attributes: KitsuLibraryEntryAttributes;
	};
}

// DELETE request (remove existing entry)
// Kitsu DELETE calls don’t require a body, but you can model it for clarity.
interface KitsuLibraryEntryDeleteRequest {
	id: string; // existing library entry ID
}

// Common shape of a library entry returned by Kitsu
interface KitsuLibraryEntryResponseData {
	id: string;
	type: "libraryEntries";
	attributes: {
		status: "current" | "planned" | "completed" | "on_hold" | "dropped";
		progress: number;
		reconsumeCount: number;
		ratingTwenty: number | null;
		startedAt: string | null;
		finishedAt: string | null;
		createdAt: string;
		updatedAt: string;
	};
	relationships: {
		media: {
			data: {
				type: "anime" | "manga";
				id: string;
			};
		};
		user: {
			data: {
				type: "users";
				id: string;
			};
		};
	};
}

// Response wrapper for POST (create)
interface KitsuLibraryEntryPostResponse {
	data: KitsuLibraryEntryResponseData;
	included?: any[]; // optional related resources (e.g., media, user)
}

// Response wrapper for PATCH (update)
interface KitsuLibraryEntryPatchResponse {
	data: KitsuLibraryEntryResponseData;
	included?: any[];
}

type PostUpdateEntry =
	| $app.PostUpdateEntryEvent
	| $app.PostUpdateEntryProgressEvent
	| $app.PostUpdateEntryRepeatEvent
	| { mediaId?: number; isDeleted: true };

type PreUpdateData = $app.PreUpdateEntryEvent | $app.PreUpdateEntryProgressEvent | $app.PreUpdateEntryRepeatEvent;

interface KitsuLibraryEntry {
	libraryId: string;
	mediaId: string;
	mediaType: "anime" | "manga" | "drama";
	mediaTitle: string;
	attributes: {
		createdAt: string; // ISO date string
		finishedAt: string | null; // ISO date string or null
		notes: string | null;
		private: boolean;
		progress: number;
		progressedAt: string | null; // ISO date string or null
		rating: string | null; // e.g. "4.0"
		ratingTwenty: number | null; // 2–20 scale
		reactionSkipped: "unskipped" | "skipped";
		reconsumeCount: number;
		reconsuming: boolean;
		startedAt: string | null; // ISO date string or null
		status: "current" | "planned" | "completed" | "on_hold" | "dropped";
		updatedAt: string; // ISO date string
		volumesOwned: number;
	};
}

interface AniListSaveMediaListEntryInput {
	mediaId?: number;
	status?: $app.AL_MediaListStatus;
	score?: number;
	progress?: number;
	repeat?: number;
	private?: boolean;
	notes?: string;
	startedAt?: $app.AL_AnimeCollection_MediaListCollection_Lists_Entries_StartedAt;
	completedAt?: $app.AL_AnimeCollection_MediaListCollection_Lists_Entries_CompletedAt;
}
