declare namespace $nhentai {
	interface ValidationError {
		detail: {
			loc: [string, number];
			msg: string;
			type: string;
			input: string;
			ctx: {};
		};
	}

	interface RatelimitError {
		error: string;
	}

	interface Galleries {
		result: {
			id: number;
			media_id: string;
			english_title: string;
			japanese_title: string | null;
			thumbnail: string;
			thumbnail_width: number;
			thumbnail_height: number;
			num_pages: number;
			num_favorites: number;
			tag_ids: number[];
			blacklisted: boolean;
		}[];
		num_pages: number;
		per_page: number;
		total: number;
	}

	interface Gallery {
		id: number;
		media_id: string;
		title: {
			english: string | null;
			japanese: string | null;
			pretty: string;
		};
		cover: {
			path: string;
			width: number;
			height: number;
		};
		thumbnail: {
			path: string;
			width: number;
			height: number;
		};
		scanlator: string | null;
		upload_date: number;
		tags: Array<{
			id: number;
			type: string;
			name: string;
			slug: string;
			url: string;
			count: number;
			description: string | null;
			is_community: boolean;
			pending_describe_id: string | null;
		}>;
		num_pages: number;
		num_favorites: number;
		pages: Array<{
			number: 1;
			path: string;
			width: number;
			height: number;
			thumbnail: string;
			thumbnail_width: number;
			thumbnail_height: number;
		}>;
		// extra fields
		comments: Array<{
			id: number;
			gallery_id: number;
			poster: {
				id: number;
				username: string;
				slug: string;
				avatar_url: string;
				is_superuser: boolean;
				is_staff: boolean;
			};
			post_date: number;
			body: string;
		}>;
		comment_count: number;
		related: Array<{
			id: number;
			media_id: string;
			english_title: string | null;
			japanese_title: string | null;
			thumbnail: string;
			thumbnail_width: number;
			thumbnail_height: number;
			num_pages: number;
			num_favorites: number;
			tag_ids: number[];
			blacklisted: boolean;
		}>;
		is_favorited: boolean;
		suggestions: {
			trending: Array<Suggestion>;
			active: Array<Suggestion>;
			mine: Suggestion[];
			counts: {
				trending: number;
				active: number;
				declined: number;
				hidden: number;
			};
		};
	}

	interface Suggestion {
		id: string;
		gallery_id: number;
		tag: {
			id: number;
			type: string;
			name: string;
			slug: string;
			url: string;
			description: string | null;
		};
		action: "add" | "remove"; // assuming these are the possible actions
		status: "pending" | "approved" | "declined" | "resolved"; // based on context
		score: number;
		voter_count: number;
		proposer: {
			id: number;
			username: string;
			slug: string;
			avatar_url: string;
		};
		created_at: string; // ISO date string
		resolved_at: string | null;
		resolver: {
			id: number;
			username: string;
			slug: string;
			avatar_url: string;
		} | null;
		resolution_note: string | null;
		reverted_at: string | null;
		reverter: {
			id: number;
			username: string;
			slug: string;
			avatar_url: string;
		} | null;
		my_vote: number | null;
		tier: "trending" | "active" | "declined" | "hidden";
	}
}
