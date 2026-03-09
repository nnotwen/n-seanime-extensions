declare namespace $forums {
	interface AnilistError {
		data: null;
		errors: {
			message: string;
			status: number;
			locations: {
				line: number;
				column: number;
			}[];
		}[];
	}

	interface ThreadOverview {
		id: number;
		title: string;
		body: string; //markdown
		likeCount: number;
		isLiked: boolean;
		replyCount: number;
		viewCount: number;
		isSubscribed: boolean;
		isLocked: boolean;
		createdAt: number;
		repliedAt: number;
		user: {
			id: number;
			name: string;
			avatar: {
				large: string;
			};
			moderatorRoles?: string[];
		};
		replyUser: {
			id: number;
			name: string;
			avatar: {
				large: string;
			};
		} | null;
		categories: {
			id: number;
			name: string;
		}[];
		mediaCategories: {
			id: number;
			type: "ANIME" | "MANGA";
			title: {
				userPreferred: string;
			};
		}[];
	}

	interface ThreadComment {
		id: number;
		threadId: number;
		comment: string;
		createdAt: number;
		updatedAt: number;
		user?: {
			id: number;
			name: string;
			avatar: {
				large: string;
			};
			moderatorRoles?: string[];
		};
		likeCount: number;
		isLiked: boolean;
		isLocked: boolean;
		childComments?: ThreadComment[];
	}

	interface ThreadCommentsPage {
		threadComments: ThreadComment[];
		pageInfo: {
			lastPage: number;
			currentPage: number;
			hasNextPage: boolean;
		};
	}

	interface ThreadListOverview {
		data: {
			pinnedThreads: {
				threads: ThreadOverview[];
			};
			recentlyActive: {
				threads: ThreadOverview[];
			};
			releaseDiscussions: {
				threads: ThreadOverview[];
			};
			newlyCreated: {
				threads: ThreadOverview[];
			};
		};
		errors: undefined;
	}

	interface HTMLParsedNode {
		type: "element" | "text";
		tag?: string;
		attributes?: Record<string, string>;
		children?: HTMLParsedNode[];
		content?: string;
	}

	type MarkdownNode =
		| { type: "text"; content: string }
		| { type: "bold"; children: MarkdownNode[] }
		| { type: "italic"; children: MarkdownNode[] }
		| { type: "strikethrough"; children: MarkdownNode[] }
		| { type: "heading"; level: number; children: MarkdownNode[] }
		| { type: "align"; align: string; children: MarkdownNode[] }
		| { type: "spoiler"; children: MarkdownNode[]; uid: string }
		| { type: "code"; content: string }
		| { type: "codeblock"; content: string }
		| { type: "link"; children: MarkdownNode[]; href: string }
		| { type: "highlight"; children: MarkdownNode[] }
		| { type: "image"; width?: string; src: string }
		| { type: "youtube"; src: string; id: string | null; thumbnail: string | null }
		| { type: "webm"; src: string }
		| { type: "newline" }
		| { type: "hr" }
		| { type: "quote"; children: MarkdownNode[] }
		| { type: "list"; ordered: boolean; items: MarkdownNode[] }
		| { type: "listitem"; children: MarkdownNode[] }
		| { type: "paragraph"; children: MarkdownNode[] };

	type LikeableType = "THREAD" | "THREAD_COMMENT" | "ACTIVITY" | "ACTIVITY_REPLY";
}
