/// <reference path="../../typings/app.d.ts" />

declare namespace $vault {
	type ShelfSort = "nameasc" | "namedesc" | "createasc" | "createdesc" | "updateasc" | "updatedesc";
	type EntrySort = "nameasc" | "namedesc" | "idasc" | "iddesc" | "addedasc" | "addeddesc";
}

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
