interface AnilistData {
	data: {
		SaveMediaListEntry: {
			private: boolean;
			media: {
				id: number;
				title: {
					userPreferred: string;
				};
				updatedAt: number;
			};
		};
	};
}

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

type PrivateEntryResponse = { data: AnilistData["data"]; error: undefined } | { data: null; error: string };

interface IconButtonStyles {
	[key: string]: string;
	backgroundImage: string;
	backgroundRepeat: string;
	backgroundPosition: string;
	backgroundSize: string;
	width: string;
	//@ts-ignore
	opacity?: string;
	//@ts-ignore
	pointerEvents?: string;
}
