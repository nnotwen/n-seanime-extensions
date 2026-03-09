/// <reference path="./app.d.ts" />

declare namespace $awo {
	type RateLimit =
		| {
				ready: false;
				limit: null;
				remaining: null;
				resetAt: null;
		  }
		| {
				ready: true;
				limit: number;
				remaining: number;
				resetAt: number;
		  };

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

	interface AnilistSuccess {
		data: any;
		errors: undefined;
	}

	interface QueryResponse {
		data: {
			Page: {
				media: MediaNode[];
			};
		};
	}

	interface MediaNode {
		id: number;
		title: { userPreferred: string };
		startDate?: { year?: number } | null;
		type?: $app.AL_MediaType | null;
		format?: $app.AL_MediaFormat | null;
		status?: $app.AL_MediaStatus | null;
		relations?: MediaRelations;
	}

	interface MediaEdge {
		relationType?: $app.AL_MediaRelation;
		node: MediaNode;
	}

	interface MediaRelations {
		edges?: MediaEdge[] | null;
	}

	interface RelationsTreeNode {
		id: number;
		label: string;
		shape: string;
		color: {
			background: string;
			border: string;
		};
	}

	interface RelationsTreeEdge {
		from: number;
		to?: number;
		label: string;
		arrows: string;
	}

	interface BaseRelationsCache {
		family: number[];
		nodes: RelationsTreeNode[];
		edges: RelationsTreeEdge[];
	}

	interface CompleteRelationsCache extends BaseRelationsCache {
		isComplete: true;
	}

	interface IncompleteRelationsCache extends BaseRelationsCache {
		isComplete: false;
		fetched: number[];
		queued: number[];
		seen: number[];
	}

	type RelationsCache = CompleteRelationsCache | IncompleteRelationsCache;
}

interface QueryResponse {
	data: {
		Media: MediaQueryResponse;
	};
}

// AniList Media Types
type AL_MediaRelation = $app.AL_MediaRelation;
type AL_MediaFormat = $app.AL_MediaFormat;
type AL_MediaStatus = $app.AL_MediaStatus;
type AL_MediaType = $app.AL_MediaType;

interface MediaNode {
	id: number;
	title: { userPreferred: string };
	startDate?: { year?: number } | null;
	type?: AL_MediaType | null;
	format?: AL_MediaFormat | null;
	status?: AL_MediaStatus | null;
	relations?: MediaRelations;
}

interface MediaEdge {
	relationType?: AL_MediaRelation;
	node: MediaNode;
}

interface MediaRelations {
	edges?: MediaEdge[] | null;
}

interface MediaQueryResponse extends MediaNode {
	// Root Media has the same shape as MediaNode
}

interface RelationsTreeNode {
	id: number;
	label: string;
	shape: string;
	color: {
		background: string;
		border: string;
	};
}

interface RelationsTreeEdge {
	from: number;
	to?: number;
	label: string;
	arrows: string;
}

interface RelationsCache {
	family: number[];
	nodes: RelationsTreeNode[];
	edges: RelationsTreeEdge[];
}
