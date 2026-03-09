declare namespace $notes {
	interface BaseNote {
		mediaId: number;
		mediaTitle?: string;
		synonyms?: string[];
		bannerImage?: string;
		coverImage?: string;
		isAdult?: boolean;
		type: "ANIME" | "MANGA";
		notes: string;
	}

	interface AnilistNotesFetchResponse {
		data: {
			MediaListCollection: {
				lists: {
					entries: {
						id: number;
						notes: string | null;
						media: {
							id: number;
							title: {
								english?: string | null;
								native?: string | null;
								romaji?: string | null;
								userPreferred: string;
							};
							synonyms: string[];
							coverImage: {
								medium?: string;
							};
							bannerImage?: string;
							type: "ANIME" | "MANGA";
							isAdult: boolean;
						};
					}[];
				}[];
			};
		};
	}

	interface AnilistNotesSaveResponse {
		data: {
			SaveMediaListEntry: {
				notes: string | null;
				updatedAt: number;
				media: {
					id: number;
					title: {
						english?: string;
						native?: string;
						romaji?: string;
						userPreferred: string;
					};
					synonyms: string[];
					coverImage: {
						medium?: string;
					};
					bannerImage?: string;
					type: "ANIME" | "MANGA";
					isAdult: boolean;
				};
			};
		};
	}
}
