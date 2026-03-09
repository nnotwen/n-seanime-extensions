/// <reference path="../../typings/app.d.ts" />

declare namespace $favorite {
	interface ToggleFavouriteAnime {
		ToggleFavourite: {
			anime: Omit<FavoriteAnimeFetchResponse["Viewer"]["favourites"]["anime"] & { nodes: { isFavourite: boolean }[] }, "pageInfo">;
			manga: undefined;
		};
	}

	interface ToggleFavouriteManga {
		ToggleFavourite: {
			anime: undefined;
			manga: Omit<FavoriteMangaFetchResponse["Viewer"]["favourites"]["manga"] & { nodes: { isFavourite: boolean }[] }, "pageInfo">;
		};
	}

	type ToggleFavouriteMedia = ToggleFavouriteAnime;
	interface FavoriteAnimeFetchResponse {
		Viewer: {
			favourites: {
				anime: {
					pageInfo: Required<Omit<$app.AL_ListAnime_Page_PageInfo, "total" | "perPage" | "lastPage">>;
					nodes: {
						id: number;
						title: $app.AL_BaseAnime_Title;
						synonyms: string[];
						coverImage: {
							large: string | null;
						};
						format: $app.AL_MediaFormat;
						seasonYear: number | null;
						type: $app.AL_MediaType;
					}[];
				};
			};
		};
	}

	interface FavoriteMangaFetchResponse {
		Viewer: {
			favourites: {
				manga: {
					pageInfo: Required<Omit<$app.AL_ListManga_Page_PageInfo, "total" | "perPage" | "lastPage">>;
					nodes: {
						id: number;
						title: $app.AL_BaseManga_Title;
						synonyms: string[];
						coverImage: {
							large: string | null;
						};
						format: $app.AL_MediaFormat;
						seasonYear: number | null;
						type: $app.AL_MediaType;
					}[];
				};
			};
		};
	}

	interface FavoriteCharactersFetchResponse {
		Viewer: {
			favourites: {
				characters: {
					pageInfo: {
						hasNextPage: boolean;
						currentPage: number;
					};
					nodes: {
						id: number;
						name: $app.AL_BaseCharacter_Name;
						image: {
							large: string | null;
						};
						description: string | null;
						gender: string | null;
						dateOfBirth: UndefinedToNull<$app.AL_FuzzyDateInput>;
						age: string | null;
						bloodType: string | null;
						media: {
							pageInfo: Required<Omit<$app.AL_ListAnime_Page_PageInfo, "total" | "perPage" | "lastPage">>;
							edges: {
								node: {
									id: number;
									type: $app.AL_MediaType;
									title: {
										userPreferred: string;
									};
									synonyms: string[];
									coverImage: {
										large: string | null;
									};
									format: $app.AL_MediaFormat;
									seasonYear: number | null;
								};
								voiceActors: {
									id: number;
									name: {
										full: string | null;
										native: string | null;
									};
									languageV2: string;
									image: {
										large: string | null;
									};
								}[];
							}[];
						};
					}[];
				};
			};
		};
	}

	interface FavoriteStaffFetchResponse {
		Viewer: {
			favourites: {
				staff: {
					pageInfo: {
						hasNextPage: boolean;
						currentPage: number;
					};
					nodes: {
						id: number;
						name: {
							full: string;
							native: string | null;
							alternative: string[];
						};
						image: {
							large: string | null;
						};
						description: string | null;
						gender: string | null;
						dateOfBirth: UndefinedToNull<$app.AL_FuzzyDateInput>;
						age: string | null;
						bloodType: string | null;
						languageV2: string | null;
						staffMedia: {
							pageInfo: Required<Omit<$app.AL_ListAnime_Page_PageInfo, "total" | "perPage" | "lastPage">>;
							edges: {
								node: {
									id: number;
									type: $app.AL_MediaType;
									title: {
										userPreferred: string;
									};
									synonyms: string[];
									coverImage: {
										large: string | null;
									};
									format: $app.AL_MediaFormat;
									seasonYear: number | null;
								};
								staffRole: string;
							}[];
						};
					}[];
				};
			};
		};
	}

	interface FavoriteStudiosFetchResponse {
		Viewer: {
			favourites: {
				studios: {
					pageInfo: {
						hasNextPage: boolean;
						currentPage: number;
					};
					nodes: {
						id: number;
						name: string;
						siteUrl: string | null;
					}[];
				};
			};
		};
	}

	interface InitFetchResponse {
		Viewer: {
			favourites: {
				anime: $favorite.FavoriteAnimeFetchResponse["Viewer"]["favourites"]["anime"];
				manga: $favorite.FavoriteMangaFetchResponse["Viewer"]["favourites"]["manga"];
				characters: $favorite.FavoriteCharactersFetchResponse["Viewer"]["favourites"]["characters"];
				staff: $favorite.FavoriteStaffFetchResponse["Viewer"]["favourites"]["staff"];
				studios: $favorite.FavoriteStudiosFetchResponse["Viewer"]["favourites"]["studios"];
			};
		};
	}

	type UndefinedToNull<T> = {
		[K in keyof T]-?: Exclude<T[K], undefined> | null;
	};
}

interface AnilistViewer {
	data: {
		Viewer: {
			favourites: {
				anime: {
					nodes: {
						id: number;
						title: { userPreferred: string; romaji: string | null; english: string | null; native: string | null };
						synonyms: string[];
						coverImage: { large: string | null };
					}[];
					pageInfo: { currentPage: number; hasNextPage: boolean };
				};
			};
		};
	};
}

interface AnilistError {
	data: null;
	errors: { message: string; status: number }[];
}

interface AnilistFavoriteData {
	data: {
		anime: {
			nodes: {
				id: number;
				title: { userPreferred: string };
				coverImage: { large: string | null };
				isFavourite: boolean;
			}[];
		};
	};
}

interface AnilistFavoiteCheckingResponse {
	data: {
		Media: {
			id: number;
			isFavourite: boolean;
			title: {
				userPreferred: string;
				english: string | null;
				romaji: string | null;
				native: string | null;
			};
			synonyms: string[]; // always an array, may be empty
			coverImage: {
				large: string | null;
			};
		};
	};
}

type StoreEntry = [string, { title: string; coverImage: string | null; alternativeTitles?: string[] }];

type FetchedFavorites =
	| {
			data: { mediaId: number; title: string; coverImage: string | null; alternativeTitles?: string[] }[];
			error: undefined;
	  }
	| { data: null; error: string };

interface IconButtonStyles {
	backgroundImage: string;
	backgroundRepeat: string;
	backgroundPosition: string;
	backgroundSize: string;
	width: string;
}
