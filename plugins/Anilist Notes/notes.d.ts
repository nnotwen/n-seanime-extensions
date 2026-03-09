declare namespace $notes {
	interface SaveNoteResponse {
		SaveMediaListEntry: {
			notes: string;
			media: {
				id: number;
				title: {
					userPreferred?: string;
				};
				coverImage?: {
					medium?: string;
				};
			};
			updatedAt: number;
		};
	}

	interface SaveNoteError {
		errors: { message: string }[];
	}

	interface AnimeNote {
		coverImage: string | undefined;
		title: string | undefined;
		notes: string;
	}
}
