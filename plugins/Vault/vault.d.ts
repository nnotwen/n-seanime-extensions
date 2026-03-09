/// <reference path="./app.d.ts" />

interface VaultItem {
	name: string;
	type: "ANIME" | "MANGA";
	entries: {
		id: number;
		title: {
			userPreferred: string;
			synonyms: string[];
		};
		coverImage: string;
		seasonYear: number | null;
		season: $app.AL_MediaSeason | null;
	}[];
}

interface Shelf {
	uuid: string;
	name: string;
	type: $app.AL_MediaType;
	entries: {
		id: number;
		title: {
			userPreferred: string;
			synonyms: string[];
		};
		coverImage: string;
		seasonYear: number | null;
		season: $app.AL_MediaSeason | null;
		addedAt: string;
	}[];
	createdAt: string;
	lastUpdateAt: string;
}

interface ImportData {
	name: string;
	type: $app.AL_MediaType;
	entries: number[];
}
