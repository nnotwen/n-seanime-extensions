/// <reference path="../../typings/app.d.ts" />

declare namespace $drp {
	type PathNames =
		| "/" // Homepage
		| "/entry" // Anime Media Page
		| "/manga" // Manga Homepage
		| "/manga/entry" // Manga Media Page
		| "/search" // Search tab
		| "/custom-sources" // Search tab (custom sources)
		| "/lists" // Local list
		| "/extensions" // Extension Page
		| "/settings" // Settings Page
		| "/sync" // Offline Page
		| "/discover" // Discover Page
		| "/torrent-list" // Torrent Page
		| "/scan-summaries" // Scan summaries Page
		| "/schedule";

	interface DiscordRPC_CustomActivity {
		type?: number;
		details: string;
		state?: string;
		largeImageKey?: string;
		largeImageText?: string;
		smallImageKey?: string;
		smallImageText?: string;
		buttons?: Array<$app.DiscordRPC_Button>;
		startTimestamp?: number;
		endTimestamp?: number;
	}
}
