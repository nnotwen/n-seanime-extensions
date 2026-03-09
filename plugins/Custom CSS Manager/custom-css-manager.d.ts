declare namespace $cssm {
	type Storage = Style[];

	interface Style {
		name: string;
		author: "You" | string;
		uuid: string;
		enabled: boolean;
		style: {
			desktop: string;
			mobile: string;
		};
		link?: string;
	}
}
