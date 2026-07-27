declare namespace $tvmaze {
	type SearchQueryResponse = SearchQueryResponseItem[];

	type ShowType = "Animation" | "Scripted" | "Reality" | "Documentary" | "TalkShow" | "GameShow" | "Variety" | "News" | "Sports";
	type ShowStatus = "Running" | "Ended" | "To Be Determined" | "In Development" | "Pilot";
	type Genre =
		| "Action"
		| "Comedy"
		| "Drama"
		| "Romance"
		| "Travel"
		| "Adventure"
		| "Animation"
		| "Crime"
		| "Documentary"
		| "Fantasy"
		| "Horror"
		| "Mystery"
		| "Sci-Fi"
		| "Thriller"
		| "Family"
		| "Medical"
		| "Nature"
		| "Food"
		| "Sports"
		| "History"
		| "Supernatural"
		| "Western"
		| "Music"
		| "Espionage"
		| "Science-Fiction"
		| "War"
		| "Legal";
	type CountryCode = "JP" | "BR" | "US" | "GB" | "CA" | "AU" | "MX" | "FR" | "DE";
	type Timezone =
		| "Asia/Tokyo"
		| "America/Noronha"
		| "America/New_York"
		| "America/Los_Angeles"
		| "Europe/London"
		| "Europe/Paris"
		| "America/Monterrey"
		| "America/Toronto"
		| "Europe/Busingen";
	type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
	type EpisodeType = "regular" | "insignificant_special";
	type Gender = "Male" | "Female" | "Non-binary" | "Unknown";

	interface Schedule {
		time: string;
		days: DayOfWeek[];
	}

	interface Rating {
		average: number | null;
	}

	interface Country {
		name: string;
		code: CountryCode;
		timezone: Timezone;
	}

	interface Network {
		id: number;
		name: string;
		country: Country | null;
		officialSite: string | null;
	}

	interface WebChannel {
		id: number;
		name: string;
		country: Country | null;
		officialSite: string | null;
	}

	interface Externals {
		tvrage: number | null;
		thetvdb: number | null;
		imdb: string | null;
	}

	interface Image {
		medium: string;
		original: string;
	}

	interface ShowLinks {
		self: {
			href: string;
		};
		previousepisode?: {
			href: string;
			name: string;
		};
		nextepisode?: {
			href: string;
			name: string;
		};
	}

	interface EpisodeLinks {
		self: {
			href: string;
		};
		show: {
			href: string;
			name: string;
		};
	}

	interface PersonLinks {
		self: {
			href: string;
		};
	}

	interface CharacterLinks {
		self: {
			href: string;
		};
	}

	interface Person {
		id: number;
		url: string;
		name: string;
		country: Country | null;
		birthday: string | null;
		deathday: string | null;
		gender: Gender | null;
		image: Image | null;
		updated: number;
		_links: PersonLinks;
	}

	interface Character {
		id: number;
		url: string;
		name: string;
		image: Image | null;
		_links: CharacterLinks;
	}

	interface CastCreditsEntry {
		person: Person;
		character: Character;
		self: boolean;
		voice: boolean;
	}

	interface Show {
		id: number;
		url: string;
		name: string;
		type: ShowType;
		language: string | null;
		genres: Genre[];
		status: ShowStatus;
		runtime: number | null;
		averageRuntime: number | null;
		premiered: string | null;
		ended: string | null;
		officialSite: string | null;
		schedule: Schedule;
		rating: Rating;
		weight: number;
		network: Network | null;
		webChannel: WebChannel | null;
		dvdCountry: Country | null;
		externals: Externals;
		image: Image | null;
		summary: string | null;
		updated: number;
		_links: ShowLinks;
	}

	interface Episode {
		id: number;
		url: string;
		name: string;
		season: number;
		number: number | null;
		type: EpisodeType;
		airdate: string | null;
		airtime: string | null;
		airstamp: string | null;
		runtime: number | null;
		rating: Rating;
		image: Image | null;
		summary: string | null;
		show: Show;
		_links: EpisodeLinks;
	}

	interface SearchQueryResponseItem {
		score: number;
		show: Show;
	}

	type ScheduleResponse = Episode[];
	type ShowsResponse = Show[];
	type CastCreditsResponse = CastCreditsEntry[];
}
