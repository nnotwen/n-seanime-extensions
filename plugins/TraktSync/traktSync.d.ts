type RateLimitInfo = {
	limit: number;
	remaining: number;
	reset: number; // epoch seconds
};

type PostUpdateEntry =
	| $app.PostUpdateEntryEvent
	| $app.PostUpdateEntryProgressEvent
	| $app.PostUpdateEntryRepeatEvent
	| { mediaId?: number; isDeleted: true };

type PreUpdateData = $app.PreUpdateEntryEvent | $app.PreUpdateEntryProgressEvent | $app.PreUpdateEntryRepeatEvent;
