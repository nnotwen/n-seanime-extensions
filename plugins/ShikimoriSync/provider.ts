/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./shikimorisync.d.ts" />

// @ts-ignore
function init() {
	$ui.register(async (ctx) => {
		const iconUrl = "https://shikimori.one/favicons/favicon-96x96.png";
		const BASE_URI_V2 = "https://shikimori.one/api/v2";
		const AUTH_CODE = $getUserPreference("authToken");
		const tokenInitializationFailed = ctx.state<boolean>(false);

		const tokenManager = {
			token: {
				accessToken: ($storage.get("shikimorisync.accessToken") as string | undefined) ?? null,
				refreshToken: ($storage.get("shikimorisync.refreshToken") as string | undefined) ?? null,
				expiresAt: ($storage.get("shikimorisync.expiresAt") as number | undefined) ?? null,
			},

			userAgent: "Shikimori Seanime Sync",
			clientId: "93Vlloacsr3lOZzD8Ttx3F7E4Pv9wUlLqaAuE9XcOhQ",
			clientSecret: "x49dnkFMduxIseuDSQE4g2mDjo9Nc8qCGMpIVe7mtKs",

			redirectUri: "urn:ietf:wg:oauth:2.0:oob",
			baseUri: "https://shikimori.one/oauth/token",

			getAccessToken() {
				// no token
				if (!this.token.accessToken || !this.token.refreshToken || !this.token.expiresAt) {
					return null;
				}

				// expired
				if (Date.now() > this.token.expiresAt) {
					return null;
				}

				return this.token.accessToken;
			},

			async exchangeCode(code: string) {
				const res = await ctx.fetch(this.baseUri, {
					method: "POST",
					headers: { "User-Agent": this.userAgent, "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						grant_type: "authorization_code",
						client_id: this.clientId,
						client_secret: this.clientSecret,
						code,
						redirect_uri: this.redirectUri,
					}),
				});

				if (!res.ok) throw new Error(res.statusText);

				const data = await res.json();

				$storage.set("shikimorisync.accessToken", data.access_token);
				$storage.set("shikimorisync.refreshToken", data.refresh_token);
				$storage.set("shikimorisync.expiresAt", Date.now() + data.expires_in * 1000);

				this.token = {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					expiresAt: Date.now() + data.expires_in * 1000,
				};
			},

			async refresh() {
				if (!this.token.refreshToken) throw new Error("No refresh token available");

				const res = await fetch(this.baseUri, {
					method: "POST",
					headers: { "User-Agent": this.userAgent, "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						grant_type: "refresh_token",
						client_id: this.clientId,
						client_secret: this.clientSecret,
						refresh_token: this.token.refreshToken,
					}),
				});

				if (!res.ok) throw new Error(res.statusText);

				const data = await res.json();

				$storage.set("shikimorisync.accessToken", data.access_token);
				$storage.set("shikimorisync.refreshToken", data.refresh_token);
				$storage.set("shikimorisync.expiresAt", Date.now() + data.expires_in * 1000);

				this.token = {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					expiresAt: Date.now() + data.expires_in * 1000,
				};
			},

			async withAuthHeaders(): Promise<Record<string, string>> {
				if (!this.getAccessToken()) {
					await this.refresh();
				}
				return {
					Authorization: `Bearer ${this.token!.accessToken}`,
					"Content-Type": "application/json",
					"User-Agent": this.userAgent,
				};
			},
		};

		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		// Create entry
		async function post(body: UserRateCreate): Promise<ErrorResponse | UserRateResponse> {
			const res = await ctx.fetch(`${BASE_URI_V2}/user_rates`, {
				method: "POST",
				headers: await tokenManager.withAuthHeaders(),
				body: JSON.stringify(body),
			});

			if (!res.ok) return { error: res.text() };

			return (await res.json()) as UserRateResponse;
		}

		// Update existing entry by user_rate.id
		async function patch(userRateId: number, body: UserRatePatch): Promise<ErrorResponse | UserRateResponse> {
			const res = await ctx.fetch(`${BASE_URI_V2}/user_rates/${userRateId}`, {
				method: "PATCH",
				headers: await tokenManager.withAuthHeaders(),
				body: JSON.stringify(body),
			});

			if (!res.ok) return { error: res.text() };
			return (await res.json()) as UserRateResponse;
		}

		// Replace existing entry by user_rate.id
		async function put(userRateId: number, body: UserRatePut): Promise<ErrorResponse | UserRateResponse> {
			const res = await ctx.fetch(`${BASE_URI_V2}/user_rates/${userRateId}`, {
				method: "PUT",
				headers: await tokenManager.withAuthHeaders(),
				body: JSON.stringify(body),
			});

			if (!res.ok) return { error: res.statusText };
			return (await res.json()) as UserRateResponse;
		}

		async function del(userRateId: number): Promise<void> {
			const res = await ctx.fetch(`${BASE_URI_V2}/user_rates/${userRateId}`, {
				method: "DELETE",
				headers: await tokenManager.withAuthHeaders(),
			});

			if (!res.ok) throw new Error(res.statusText);
		}

		async function getUserRate(
			idMal: number,
			target: "Anime" | "Manga",
			userId: number
		): Promise<UserRateResponse | null> {
			const res = await ctx.fetch(`${BASE_URI_V2}/user_rates?target_id=${idMal}&target_type=${target}&user_id=${userId}`, {
				headers: await tokenManager.withAuthHeaders(),
			});

			if (!res.ok) {
				console.log(`[Shikimori Error] Failed to get user rate: ${res.status} ${res.statusText}`);
				return null;
			}

			const data = await res.json();
			return Array.isArray(data) && data.length > 0 ? data[0] : null;
		}

		async function whoAmI(): Promise<any> {
			const res = await ctx.fetch("https://shikimori.one/api/users/whoami", {
				method: "GET",
				headers: await tokenManager.withAuthHeaders(),
			});

			if (!res.ok) {
				throw new Error(`Failed to fetch whoAmI: ${res.status} ${res.statusText}`);
			}

			const data = await res.json();
			return data;
		}

		function normalizeStatus(statusAL: $app.AL_MediaListStatus): UserRatePatch["user_rate"]["status"] {
			const map: Record<$app.AL_MediaListStatus, UserRatePatch["user_rate"]["status"]> = {
				COMPLETED: "completed",
				CURRENT: "watching",
				DROPPED: "dropped",
				PAUSED: "on_hold",
				PLANNING: "planned",
				REPEATING: "watching",
			};
			return map[statusAL];
		}

		function getMedia(
			mediaId: number
		): { type: "Anime"; media: $app.AL_BaseAnime } | { type: "Manga"; media: $app.AL_BaseManga } | null {
			try {
				const anime = $anilist.getAnime(mediaId);
				if (anime) return { type: "Anime", media: anime };
			} catch (err) {
				console.log(`[AniList] getAnime failed for id ${mediaId}:`, (err as Error).message);
			}

			try {
				const manga = $anilist.getManga(mediaId);
				if (manga) return { type: "Manga", media: manga };
			} catch (err) {
				console.log(`[AniList] getManga failed for id ${mediaId}:`, (err as Error).message);
			}

			console.log(`[AniList] No media found for id ${mediaId}`);
			return null;
		}

		const tray = ctx.newTray({ iconUrl, withContent: true, width: "fit-content" });
		tray.render(() =>
			tokenInitializationFailed.get()
				? tray.flex(
						[
							tray.text("Missing/Invalid Auth Code."),
							tray.anchor({
								text: "Get Auth Code",
								// prettier-ignore
								href:`https://shikimori.one/oauth/authorize?client_id=${tokenManager.clientId}&redirect_uri=${encodeURIComponent(tokenManager.redirectUri)}&response_type=code&scope=user_rates`,
								target: "_blank",
								className:
									"bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium px-3 py-1.5 rounded-md transition-colors no-underline",
							}),
						],
						{ direction: "column" }
				  )
				: tray.flex([tray.text("Shikimori is syncing!")])
		);

		const accessToken = tokenManager.getAccessToken();

		// If auth code changed, force re‑exchange regardless of current token
		if (AUTH_CODE && AUTH_CODE !== $storage.get("shikimorisync.authToken")) {
			try {
				await tokenManager.exchangeCode(AUTH_CODE);
				$storage.set("shikimorisync.authToken", AUTH_CODE);
				return;
			} catch (e) {
				tray.updateBadge({ number: 1, intent: "alert" });
				tokenInitializationFailed.set(true);
				console.log(`[Error] Exchange failed: ${(e as Error).message}`);
				return;
			}
		}

		if (!accessToken) {
			// Case 1: refresh
			if (tokenManager.token.refreshToken) {
				try {
					await tokenManager.refresh();
				} catch (e) {
					tray.updateBadge({ number: 1, intent: "alert" });
					tokenInitializationFailed.set(true);
					console.log(`[Error] Refresh failed: ${(e as Error).message}`);
					return;
				}
			}
			// Case 2: exchange with auth code
			else if (AUTH_CODE) {
				try {
					await tokenManager.exchangeCode(AUTH_CODE);
					$storage.set("shikimorisync.authToken", AUTH_CODE);
				} catch (e) {
					tray.updateBadge({ number: 1, intent: "alert" });
					tokenInitializationFailed.set(true);
					console.log(`[Error] Exchange failed: ${(e as Error).message}`);
					return;
				}
			}
			// Case 3: nothing
			else {
				tray.updateBadge({ number: 1, intent: "alert" });
				tokenInitializationFailed.set(true);
				console.log("[Error] No access token, no refresh token, and no auth code");
				return;
			}
		} else {
			console.log("token is valid!");
		}

		async function getMangaFromId(mediaId: number) {
			const collection = await ctx.manga.getCollection();
			if (!collection.lists) return null;
			return collection.lists.flatMap((list) => list.entries).find((entry) => entry?.mediaId === mediaId) ?? null;
		}

		// Anime tracking only - Sorry!
		async function handlePostUpdateEntry(
			e: $app.PostUpdateEntryEvent | $app.PostUpdateEntryProgressEvent | $app.PostUpdateEntryRepeatEvent
		) {
			if (tokenInitializationFailed.get()) return;
			if (!e.mediaId) return;

			const { type, media } = getMedia(e.mediaId) ?? {};
			if (!type || !media || !media.idMal) return;

			const list: $app.Anime_EntryListData | $app.Manga_EntryListData | undefined =
				type === "Anime"
					? (await ctx.anime.getAnimeEntry(e.mediaId)).listData
					: (await getMangaFromId(e.mediaId))?.listData;

			try {
				if (!$store.get("shikimori-current-user-id")) {
					const me = await whoAmI();
					$store.set("shikimori-current-user-id", me.id);
					await $_wait(1_500);
				}
				const existingRate = await getUserRate(media.idMal, type, $store.get("shikimori-current-user-id"));
				await $_wait(1_500);

				// user has entry on shikimori
				if (existingRate) {
					// user has no entry on anilist but has an entry on shikimori
					if (!list) {
						return del(existingRate.id);
					}

					// update the exisiting entry
					const user_id = $store.get("shikimori-current-user-id");
					const body: UserRatePatch = { user_rate: { user_id } };
					if (list.progress) body.user_rate[type === "Anime" ? "episodes" : "chapters"] = list.progress;
					if (list.score) body.user_rate.score = list.score > 10 ? list.score / 10 : list.score;
					if (list.repeat) body.user_rate.rewatches = list.repeat;
					if (list.status && normalizeStatus(list.status)) body.user_rate.status = normalizeStatus(list.status);

					const res = await patch(existingRate.id, body); // use user_rate.id here
					if ("error" in res) return console.log("[Shikimori Error]: " + res.error);

					console.log(`Successfully synced entry [${media.idMal}] to shikimori (PATCH)`);
				}
				// user has no entry on shikimori
				else {
					// no entry on anilist as well
					if (!list) return;

					const body: UserRateCreate = {
						user_rate: {
							user_id: $store.get("shikimori-current-user-id"),
							target_id: media.idMal,
							target_type: type,
						},
					};

					if (list.progress) body.user_rate[type === "Anime" ? "episodes" : "chapters"] = list.progress;
					if (list.score) body.user_rate.score = list.score > 10 ? list.score / 10 : list.score;
					if (list.repeat) body.user_rate.rewatches = list.repeat;
					if (list.status && normalizeStatus(list.status)) body.user_rate.status = normalizeStatus(list.status);

					const res = await post(body);
					if ("error" in res) return console.log("[Shikimori Error]: " + res.error);

					console.log(`Successfully synced entry [${media.idMal}] to shikimori (CREATE)`);
				}
			} catch (err) {
				console.log("[Shikimori Error]: " + (err as Error).message);
			}
		}

		$store.watch("POST_UPDATE_ENTRY", handlePostUpdateEntry);
		$store.watch("POST_UPDATE_ENTRY_PROGRESS", handlePostUpdateEntry);
		$store.watch("POST_UPDATE_ENTRY_REPEAT", handlePostUpdateEntry);
	});

	// HOOKS //
	$app.onPostUpdateEntry((e) => {
		$store.set("POST_UPDATE_ENTRY", $clone(e));
		e.next();
	});

	$app.onPostUpdateEntryProgress((e) => {
		$store.set("POST_UPDATE_ENTRY_PROGRESS", $clone(e));
		e.next();
	});

	$app.onPostUpdateEntryRepeat((e) => {
		$store.set("POST_UPDATE_ENTRY_REPEAT", $clone(e));
		e.next();
	});
}
