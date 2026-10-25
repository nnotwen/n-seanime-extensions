// shikimori.d.ts

declare namespace $shikigpql {
	// ---------------------------------------------------------------------------
	// Scalars
	// ---------------------------------------------------------------------------

	/** An ISO 8601-encoded date */
	type ISO8601Date = string;

	/** An ISO 8601-encoded datetime */
	type ISO8601DateTime = string;

	/** A positive integer (>= 1) */
	type PositiveInt = number;

	/**
	 * List of values separated by comma.
	 * Add `!` before value to apply negative filter.
	 *
	 * - `movie` - Movies
	 * - `music` - Music
	 * - `ona` - ONA
	 * - `ova/ona` - OVA/ONA
	 * - `ova` - OVA
	 * - `special` - Specials
	 * - `tv` - TV Series
	 * - `tv_13` - Short TV Series
	 * - `tv_24` - Average TV Series
	 * - `tv_48` - Long TV Series
	 * - `tv_special` - TV Specials
	 * - `pv` - Promotional Videos
	 * - `cm` - Commercial Messages
	 */
	type AnimeKindString = string;

	/**
	 * List of values separated by comma.
	 * Add `!` before value to apply negative filter.
	 *
	 * - `anons` - Planned
	 * - `ongoing` - Airing
	 * - `released` - Released
	 */
	type AnimeStatusString = string;

	/**
	 * List of values separated by comma.
	 * Add `!` before value to apply negative filter.
	 *
	 * - `S` - Less than 10 minutes
	 * - `D` - Less than 30 minutes
	 * - `F` - More than 30 minutes
	 */
	type DurationString = string;

	/**
	 * List of values separated by comma.
	 * Add `!` before value to apply negative filter.
	 *
	 * - `doujin` - Doujin
	 * - `manga` - Manga
	 * - `manhua` - Manhua
	 * - `manhwa` - Manhwa
	 * - `light_novel` - Light Novels
	 * - `novel` - Novels
	 * - `one_shot` - One Shots
	 */
	type MangaKindString = string;

	/**
	 * List of values separated by comma.
	 * Add `!` before value to apply negative filter.
	 *
	 * - `anons` - Planned
	 * - `ongoing` - Publishing
	 * - `released` - Published
	 * - `paused` - Paused
	 * - `discontinued` - Discontinued
	 */
	type MangaStatusString = string;

	/**
	 * List of values separated by comma.
	 * Add `!` before value to apply negative filter.
	 *
	 * - `planned` - Planned to Watch
	 * - `watching` - Watching
	 * - `rewatching` - Rewatching
	 * - `completed` - Completed
	 * - `on_hold` - On Hold
	 * - `dropped` - Dropped
	 */
	type MylistString = string;

	/**
	 * List of values separated by comma.
	 * Add `!` before value to apply negative filter.
	 *
	 * - `card_game` - Card game
	 * - `novel` - Novel
	 * - `radio` - Radio
	 * - `game` - Game
	 * - `unknown` - Unknown
	 * - `book` - Book
	 * - `light_novel` - Light novel
	 * - `web_novel` - Web novel
	 * - `original` - Original
	 * - `picture_book` - Picture book
	 * - `music` - Music
	 * - `manga` - Manga
	 * - `visual_novel` - Visual novel
	 * - `other` - Other
	 * - `web_manga` - Web manga
	 * - `four_koma_manga` - 4-koma manga
	 * - `mixed_media` - Mixed media
	 */
	type OriginString = string;

	/**
	 * List of values separated by comma.
	 * Add `!` before value to apply negative filter.
	 *
	 * - `none` - No rating
	 * - `g` - G - All ages
	 * - `pg` - PG - Children
	 * - `pg_13` - PG-13 - Teens 13 or older
	 * - `r` - R - 17+ recommended (violence & profanity)
	 * - `r_plus` - R+ - Mild Nudity (may also contain violence & profanity)
	 * - `rx` - Rx - Hentai (extreme sexual content/nudity)
	 */
	type RatingString = string;

	/**
	 * List of values separated by comma.
	 * Add `!` before value to apply negative filter.
	 *
	 * **Examples:**
	 * - `summer_2017`
	 * - `2016`
	 * - `2014_2016`
	 * - `199x`
	 */
	type SeasonString = string;

	// ---------------------------------------------------------------------------
	// Enums
	// ---------------------------------------------------------------------------

	enum AnimeKindEnum {
		/** TV Series */
		tv = "tv",
		/** Movie */
		movie = "movie",
		/** OVA */
		ova = "ova",
		/** ONA */
		ona = "ona",
		/** Special */
		special = "special",
		/** TV Special */
		tv_special = "tv_special",
		/** Music */
		music = "music",
		/** PV */
		pv = "pv",
		/** CM */
		cm = "cm",
	}

	enum AnimeOriginEnum {
		/** Original */
		original = "original",
		/** Manga */
		manga = "manga",
		/** Web manga */
		web_manga = "web_manga",
		/** 4-koma manga */
		four_koma_manga = "four_koma_manga",
		/** Novel */
		novel = "novel",
		/** Web novel */
		web_novel = "web_novel",
		/** Visual novel */
		visual_novel = "visual_novel",
		/** Light novel */
		light_novel = "light_novel",
		/** Game */
		game = "game",
		/** Card game */
		card_game = "card_game",
		/** Music */
		music = "music",
		/** Radio */
		radio = "radio",
		/** Book */
		book = "book",
		/** Picture book */
		picture_book = "picture_book",
		/** Mixed media */
		mixed_media = "mixed_media",
		/** Other */
		other = "other",
		/** Unknown */
		unknown = "unknown",
	}

	enum AnimeRatingEnum {
		/** None */
		none = "none",
		/** G */
		g = "g",
		/** PG */
		pg = "pg",
		/** PG-13 */
		pg_13 = "pg_13",
		/** R-17 */
		r = "r",
		/** R+ */
		r_plus = "r_plus",
		/** Rx */
		rx = "rx",
	}

	enum AnimeStatusEnum {
		/** Planned */
		anons = "anons",
		/** Airing */
		ongoing = "ongoing",
		/** Released */
		released = "released",
	}

	enum ContestMatchStateEnum {
		created = "created",
		started = "started",
		freezed = "freezed",
		finished = "finished",
	}

	enum ContestMemberTypeEnum {
		/** Anime */
		anime = "anime",
		/** Characters */
		character = "character",
	}

	enum ContestRoundStateEnum {
		created = "created",
		started = "started",
		finished = "finished",
	}

	enum ContestStateEnum {
		created = "created",
		proposing = "proposing",
		started = "started",
		finished = "finished",
	}

	enum ContestStrategyTypeEnum {
		/** Double elimination */
		double_elimination = "double_elimination",
		/** Olympic system */
		play_off = "play_off",
		/** Swiss system */
		swiss = "swiss",
	}

	enum ExternalLinkKindEnum {
		/** Official Site */
		official_site = "official_site",
		/** Wikipedia */
		wikipedia = "wikipedia",
		/** Anime News Network */
		anime_news_network = "anime_news_network",
		/** MyAnimeList */
		myanimelist = "myanimelist",
		/** AniDB */
		anime_db = "anime_db",
		/** World Art */
		world_art = "world_art",
		/** KinoPoisk */
		kinopoisk = "kinopoisk",
		/** Kage Project */
		kage_project = "kage_project",
		/** Twitter/X */
		twitter = "twitter",
		/** Anime 365 */
		smotret_anime = "smotret_anime",
		/** Shikimori */
		shiki = "shiki",
		/** Amediateka */
		amediateka = "amediateka",
		/** Crunchyroll */
		crunchyroll = "crunchyroll",
		/** Amazon */
		amazon = "amazon",
		/** Hidive */
		hidive = "hidive",
		/** Hulu */
		hulu = "hulu",
		/** Ivi */
		ivi = "ivi",
		/** DEEP */
		deep = "deep",
		/** KinoPoisk HD */
		kinopoisk_hd = "kinopoisk_hd",
		/** Wink */
		wink = "wink",
		/** Netflix */
		netflix = "netflix",
		/** Okko */
		okko = "okko",
		/** Youtube */
		youtube = "youtube",
		/** ReManga */
		remanga = "remanga",
		/** Senkuro */
		senkuro = "senkuro",
		/** MangaLib */
		mangalib = "mangalib",
		/** Baka-Updates */
		mangaupdates = "mangaupdates",
		/** ReadManga */
		readmanga = "readmanga",
		/** MangaDex */
		mangadex = "mangadex",
		/** MangaFox */
		mangafox = "mangafox",
		/** Mangachan */
		mangachan = "mangachan",
		/** Mangahub */
		mangahub = "mangahub",
		/** Novel.tl */
		novel_tl = "novel_tl",
		/** RuRanobe */
		ruranobe = "ruranobe",
		/** RanobeLib */
		ranobelib = "ranobelib",
		/** Novel Updates */
		novelupdates = "novelupdates",
	}

	enum GenreEntryTypeEnum {
		/** Anime */
		Anime = "Anime",
		/** Manga */
		Manga = "Manga",
	}

	enum GenreKindEnum {
		/** Demographic */
		demographic = "demographic",
		/** Genre */
		genre = "genre",
		/** Theme */
		theme = "theme",
	}

	enum MangaKindEnum {
		/** Manga */
		manga = "manga",
		/** Manhwa */
		manhwa = "manhwa",
		/** Manhua */
		manhua = "manhua",
		/** Light Novel */
		light_novel = "light_novel",
		/** Novel */
		novel = "novel",
		/** One Shot */
		one_shot = "one_shot",
		/** Doujin */
		doujin = "doujin",
	}

	enum MangaStatusEnum {
		/** Planned */
		anons = "anons",
		/** Publishing */
		ongoing = "ongoing",
		/** Published */
		released = "released",
		/** Paused */
		paused = "paused",
		/** Discontinued */
		discontinued = "discontinued",
	}

	enum OrderEnum {
		/** By ID */
		id = "id",
		id_desc = "id_desc",
		/** By rank */
		ranked = "ranked",
		/** By type */
		kind = "kind",
		/** By popularity */
		popularity = "popularity",
		/** In alphabetical order */
		name = "name",
		/** By release date */
		aired_on = "aired_on",
		/** By number of episodes */
		episodes = "episodes",
		/** By status */
		status = "status",
		/** By random */
		random = "random",
		/** By random */
		ranked_random = "ranked_random",
		/** By Shikimori ranking */
		ranked_shiki = "ranked_shiki",
		created_at = "created_at",
		created_at_desc = "created_at_desc",
		/** By field updated_at on entity */
		updated_at = "updated_at",
		updated_at_desc = "updated_at_desc",
	}

	enum RelationKindEnum {
		/** Adaptation */
		adaptation = "adaptation",
		/** Alternative Setting */
		alternative_setting = "alternative_setting",
		/** Alternative Version */
		alternative_version = "alternative_version",
		/** Character */
		character = "character",
		/** Full Story */
		full_story = "full_story",
		/** Other */
		other = "other",
		/** Parent Story */
		parent_story = "parent_story",
		/** Prequel */
		prequel = "prequel",
		/** Sequel */
		sequel = "sequel",
		/** Side Story */
		side_story = "side_story",
		/** Spin-off */
		spin_off = "spin_off",
		/** Summary */
		summary = "summary",
	}

	enum SortOrderEnum {
		/** Sort in ascending order */
		asc = "asc",
		/** Sort in descending order */
		desc = "desc",
	}

	enum UserRateOrderFieldEnum {
		/** By id */
		id = "id",
		/** By updated_at */
		updated_at = "updated_at",
	}

	enum UserRateStatusEnum {
		/** Planned to Watch */
		planned = "planned",
		/** Watching */
		watching = "watching",
		/** Rewatching */
		rewatching = "rewatching",
		/** Completed */
		completed = "completed",
		/** On Hold */
		on_hold = "on_hold",
		/** Dropped */
		dropped = "dropped",
	}

	enum UserRateTargetTypeEnum {
		/** Anime */
		Anime = "Anime",
		/** Manga */
		Manga = "Manga",
	}

	enum VideoKindEnum {
		/** PV */
		pv = "pv",
		/** Character trailer */
		character_trailer = "character_trailer",
		/** CM */
		cm = "cm",
		/** OP */
		op = "op",
		/** ED */
		ed = "ed",
		/** Music */
		op_ed_clip = "op_ed_clip",
		/** Clip */
		clip = "clip",
		/** Other */
		other = "other",
		/** Episode preview */
		episode_preview = "episode_preview",
	}

	// ---------------------------------------------------------------------------
	// Input Types
	// ---------------------------------------------------------------------------

	interface UserRateOrderInputType {
		field: UserRateOrderFieldEnum;
		order: SortOrderEnum;
	}

	// ---------------------------------------------------------------------------
	// Object Types
	// ---------------------------------------------------------------------------

	interface IncompleteDate {
		date?: ISO8601Date | null;
		day?: number | null;
		month?: number | null;
		year?: number | null;
	}

	interface Poster {
		id: string;
		main2xUrl: string;
		mainAlt2xUrl: string;
		mainAltUrl: string;
		mainUrl: string;
		mini2xUrl: string;
		miniAlt2xUrl: string;
		miniAltUrl: string;
		miniUrl: string;
		originalUrl: string;
		preview2xUrl: string;
		previewAlt2xUrl: string;
		previewAltUrl: string;
		previewUrl: string;
	}

	interface Screenshot {
		id: string;
		originalUrl: string;
		x166Url: string;
		x332Url: string;
	}

	interface ExternalLink {
		createdAt?: ISO8601DateTime | null;
		id?: string | null;
		kind: ExternalLinkKindEnum;
		updatedAt?: ISO8601DateTime | null;
		url: string;
	}

	interface Genre {
		entryType: GenreEntryTypeEnum;
		id: string;
		kind: GenreKindEnum;
		name: string;
		russian: string;
	}

	interface Studio {
		id: string;
		imageUrl?: string | null;
		name: string;
	}

	interface Topic {
		body: string;
		commentsCount: number;
		createdAt: ISO8601DateTime;
		htmlBody: string;
		id?: string | null;
		tags: string[];
		title: string;
		type: string;
		updatedAt: ISO8601DateTime;
		url: string;
	}

	interface ScoreStat {
		count: number;
		score: number;
	}

	interface StatusStat {
		count: number;
		status: UserRateStatusEnum;
	}

	interface Video {
		id: string;
		imageUrl: string;
		kind: VideoKindEnum;
		name?: string | null;
		playerUrl: string;
		url: string;
	}

	interface Character {
		createdAt: ISO8601DateTime;
		description?: string | null;
		descriptionHtml?: string | null;
		descriptionSource?: string | null;
		id: string;
		isAnime: boolean;
		isManga: boolean;
		isRanobe: boolean;
		japanese?: string | null;
		malId?: string | null;
		name: string;
		poster?: Poster | null;
		russian?: string | null;
		synonyms: string[];
		topic?: Topic | null;
		updatedAt: ISO8601DateTime;
		url: string;
	}

	interface CharacterRole {
		character: Character;
		id: string;
		rolesEn: string[];
		rolesRu: string[];
	}

	interface Person {
		birthOn?: IncompleteDate | null;
		createdAt: ISO8601DateTime;
		deceasedOn?: IncompleteDate | null;
		id: string;
		isMangaka: boolean;
		isProducer: boolean;
		isSeyu: boolean;
		japanese?: string | null;
		malId?: string | null;
		name: string;
		poster?: Poster | null;
		russian?: string | null;
		synonyms: string[];
		topic?: Topic | null;
		updatedAt: ISO8601DateTime;
		url: string;
		website?: string | null;
	}

	interface PersonRole {
		id: string;
		person: Person;
		rolesEn: string[];
		rolesRu: string[];
	}

	interface Related {
		anime?: Anime | null;
		id: string;
		manga?: Manga | null;
		/** @deprecated use relationKind/relationText instead. This field will be deleted after 2025-01-01 */
		relationEn: string;
		relationKind: RelationKindEnum;
		/** @deprecated use relationKind/relationText instead. This field will be deleted after 2025-01-01 */
		relationRu: string;
		relationText: string;
	}

	interface Publisher {
		id: string;
		name: string;
	}

	interface User {
		avatarUrl: string;
		id: string;
		lastOnlineAt: ISO8601DateTime;
		nickname: string;
		url: string;
	}

	interface UserRate {
		anime?: Anime | null;
		chapters: number;
		createdAt: ISO8601DateTime;
		episodes: number;
		id: string;
		manga?: Manga | null;
		rewatches: number;
		score: number;
		status: UserRateStatusEnum;
		text?: string | null;
		updatedAt: ISO8601DateTime;
		volumes: number;
	}

	interface Anime {
		airedOn?: IncompleteDate | null;
		characterRoles?: CharacterRole[] | null;
		chronology?: Anime[] | null;
		createdAt: ISO8601DateTime;
		description?: string | null;
		descriptionHtml?: string | null;
		descriptionSource?: string | null;
		/** Duration in minutes */
		duration?: number | null;
		english?: string | null;
		episodes: number;
		episodesAired: number;
		externalLinks?: ExternalLink[] | null;
		fandubbers: string[];
		fansubbers: string[];
		/** Franchise name */
		franchise?: string | null;
		genres?: Genre[] | null;
		id: string;
		isCensored?: boolean | null;
		japanese?: string | null;
		kind?: AnimeKindEnum | null;
		licenseNameRu?: string | null;
		licensors?: string[] | null;
		malId?: string | null;
		name: string;
		nextEpisodeAt?: ISO8601DateTime | null;
		opengraphImageUrl?: string | null;
		origin?: AnimeOriginEnum | null;
		personRoles?: PersonRole[] | null;
		poster?: Poster | null;
		rating?: AnimeRatingEnum | null;
		related?: Related[] | null;
		releasedOn?: IncompleteDate | null;
		russian?: string | null;
		score?: number | null;
		scoresStats?: ScoreStat[] | null;
		screenshots: Screenshot[];
		season?: string | null;
		status?: AnimeStatusEnum | null;
		statusesStats?: StatusStat[] | null;
		studios: Studio[];
		synonyms: string[];
		topic?: Topic | null;
		updatedAt: ISO8601DateTime;
		url: string;
		userRate?: UserRate | null;
		videos: Video[];
	}

	interface Manga {
		airedOn?: IncompleteDate | null;
		chapters: number;
		characterRoles?: CharacterRole[] | null;
		chronology?: Manga[] | null;
		createdAt: ISO8601DateTime;
		description?: string | null;
		descriptionHtml?: string | null;
		descriptionSource?: string | null;
		english?: string | null;
		externalLinks?: ExternalLink[] | null;
		/** Franchise name */
		franchise?: string | null;
		genres?: Genre[] | null;
		id: string;
		isCensored?: boolean | null;
		japanese?: string | null;
		kind?: MangaKindEnum | null;
		licenseNameRu?: string | null;
		licensors?: string[] | null;
		malId?: string | null;
		name: string;
		opengraphImageUrl?: string | null;
		personRoles?: PersonRole[] | null;
		poster?: Poster | null;
		publishers: Publisher[];
		related?: Related[] | null;
		releasedOn?: IncompleteDate | null;
		russian?: string | null;
		score?: number | null;
		scoresStats?: ScoreStat[] | null;
		status?: MangaStatusEnum | null;
		statusesStats?: StatusStat[] | null;
		synonyms: string[];
		topic?: Topic | null;
		updatedAt: ISO8601DateTime;
		url: string;
		userRate?: UserRate | null;
		volumes: number;
	}

	interface ContestMatch {
		id: string;
		leftAnime?: Anime | null;
		leftCharacter?: Character | null;
		leftId?: number | null;
		leftVotes?: number | null;
		rightAnime?: Anime | null;
		rightCharacter?: Character | null;
		rightId?: number | null;
		rightVotes?: number | null;
		state: ContestMatchStateEnum;
		winnerId?: number | null;
	}

	interface ContestRound {
		id: string;
		isAdditional: boolean;
		matches: ContestMatch[];
		name: string;
		number: number;
		state: ContestRoundStateEnum;
	}

	interface Contest {
		description?: string | null;
		descriptionHtml?: string | null;
		descriptionSource?: string | null;
		finishedOn?: ISO8601Date | null;
		id: string;
		matchDuration?: number | null;
		matchesInterval?: number | null;
		matchesPerRound?: number | null;
		memberType: ContestMemberTypeEnum;
		name: string;
		rounds: ContestRound[];
		startedOn?: ISO8601Date | null;
		state: ContestStateEnum;
		strategyType: ContestStrategyTypeEnum;
	}

	// ---------------------------------------------------------------------------
	// Root Types
	// ---------------------------------------------------------------------------

	interface QueryAnimesArgs {
		page?: PositiveInt | null;
		/** Maximum 50 */
		limit?: PositiveInt | null;
		order?: OrderEnum | null;
		kind?: AnimeKindString | null;
		status?: AnimeStatusString | null;
		season?: SeasonString | null;
		/** Minimal anime score */
		score?: number | null;
		duration?: DurationString | null;
		rating?: RatingString | null;
		origin?: OriginString | null;
		/** List of comma separated genre ids */
		genre?: string | null;
		/** List of comma separated studio ids */
		studio?: string | null;
		/** List of comma separated franchises */
		franchise?: string | null;
		/** Set to `false` to allow hentai, yaoi and yuri */
		censored?: boolean | null;
		mylist?: MylistString | null;
		/** List of comma separated ids */
		ids?: string | null;
		/** List of comma separated ids */
		excludeIds?: string | null;
		search?: string | null;
	}

	interface QueryCharactersArgs {
		page?: PositiveInt | null;
		/** Maximum 50 */
		limit?: PositiveInt | null;
		ids?: string | null;
		search?: string | null;
	}

	interface QueryContestsArgs {
		page?: PositiveInt | null;
		/** Maximum 10 */
		limit?: PositiveInt | null;
		ids?: string[] | null;
	}

	interface QueryGenresArgs {
		entryType: GenreEntryTypeEnum;
	}

	interface QueryMangasArgs {
		page?: PositiveInt | null;
		/** Maximum 50 */
		limit?: PositiveInt | null;
		order?: OrderEnum | null;
		kind?: MangaKindString | null;
		status?: MangaStatusString | null;
		season?: SeasonString | null;
		/** Minimal manga score */
		score?: number | null;
		/** List of comma separated genre ids */
		genre?: string | null;
		/** List of comma separated publisher ids */
		publisher?: string | null;
		/** List of comma separated franchises */
		franchise?: string | null;
		/** Set to `false` to allow hentai, yaoi and yuri */
		censored?: boolean | null;
		mylist?: MylistString | null;
		/** List of comma separated ids */
		ids?: string | null;
		/** List of comma separated ids */
		excludeIds?: string | null;
		search?: string | null;
	}

	interface QueryPeopleArgs {
		page?: PositiveInt | null;
		/** Maximum 50 */
		limit?: PositiveInt | null;
		ids?: string[] | null;
		search?: string | null;
		isSeyu?: boolean | null;
		isProducer?: boolean | null;
		isMangaka?: boolean | null;
	}

	interface QueryUserRatesArgs {
		page?: PositiveInt | null;
		/** Maximum 50 */
		limit?: PositiveInt | null;
		/** ID of current user is used by default */
		userId?: string | null;
		targetType?: UserRateTargetTypeEnum | null;
		status?: UserRateStatusEnum | null;
		order?: UserRateOrderInputType | null;
	}

	interface QueryUsersArgs {
		page?: PositiveInt | null;
		/** Maximum 50 */
		limit?: PositiveInt | null;
		ids?: string[] | null;
		search?: string | null;
	}

	interface Query {
		animes: Anime[];
		characters: Character[];
		contests: Contest[];
		currentUser?: User | null;
		genres: Genre[];
		mangas: Manga[];
		people: Person[];
		userRates: UserRate[];
		users: User[];
	}

	interface Mutation {
		/** An example field added by the generator */
		testField: string;
	}

	// ---------------------------------------------------------------------------
	// GraphQL Client Helpers
	// ---------------------------------------------------------------------------

	/** All available query field names */
	type QueryField = keyof Query;

	/** All available mutation field names */
	type MutationField = keyof Mutation;

	/** Union of all GraphQL object types in the schema */
	type ShikimoriObject =
		| Anime
		| Character
		| CharacterRole
		| Contest
		| ContestMatch
		| ContestRound
		| ExternalLink
		| Genre
		| IncompleteDate
		| Manga
		| Person
		| PersonRole
		| Poster
		| Publisher
		| Related
		| ScoreStat
		| Screenshot
		| StatusStat
		| Studio
		| Topic
		| User
		| UserRate
		| Video;

	interface GraphQLErrorLocation {
		line: number;
		column: number;
	}

	interface GraphQLErrorExtensions {
		/** Machine-readable error code, e.g. "undefinedField", "invalid", etc. */
		code: string;
		/** Name of the type the error occurred on (present for `undefinedField`) */
		typeName?: string;
		/** Name of the field that caused the error (present for `undefinedField`) */
		fieldName?: string;
		/** Any additional extension data */
		[key: string]: unknown;
	}

	interface GraphQLError {
		message: string;
		locations?: GraphQLErrorLocation[];
		path?: (string | number)[];
		extensions?: GraphQLErrorExtensions;
	}

	/** Successful response: `data` present, no `errors` field. */
	interface GraphQLSuccessResponse<TData> {
		data: TData;
		errors?: undefined;
	}

	/** Failed response: `data` is `null`, `errors` present. */
	interface GraphQLErrorResponse {
		data: null;
		errors: [GraphQLError, ...GraphQLError[]];
	}

	/**
	 * GraphQL response — mutually exclusive union:
	 * - success: `data` is present and `errors` is absent
	 * - failure: `data` is `null` and `errors` is present
	 */
	type GraphQLResponse<TData = unknown> = GraphQLSuccessResponse<TData> | GraphQLErrorResponse;
}
