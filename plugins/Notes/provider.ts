/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./notes.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/Notes/icon.png";
		const tray = ctx.newTray({ iconUrl, withContent: true });

		enum Tabs {
			General = 1,
			Editor = 2,
			Settings = 3,
			WarnBeforeSaving = 4,
		}

		const Keys = {
			Settings: {
				SyncToMAL: "notes:settings-synctomal",
				SyncToKitsu: "notes:settings-synctokitsu",
				General: {
					PeriodicFetch: "notes:settings-general-periodicfetch",
				},
				Preference: {
					HideAdult: "notes:settings-preference-hideadult",
					WarnMissing: "notes:settings-preference-warnmissing",
					WarnAdult: "notes:settings-preference-warnadult",
				},
				Appearance: {
					HideBannerOnList: "notes:settings-appearance-hidebanneronlist",
					HideBannerOnEdit: "notes:settings-appearance-hidebanneronedit",
					ListDensity: "notes:settings-appearance-listdensity",
				},
			},
		} as const;

		const kaomojis = ["(・・ )ゞ", "(・・;)ゞ", "(・_・;)", "(._.)", "(´･ω･`)", "(￣▽￣*)ゞ", "(ᵕ—ᴗ—)"];

		const icons = {
			html: {
				back: /*html*/ `
					<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 256 256" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a8 8 0 0 1-8 8h-60.69l18.35 18.34a8 8 0 0 1-11.32 11.32l-32-32a8 8 0 0 1 0-11.32l32-32a8 8 0 0 1 11.32 11.32L107.31 120H168a8 8 0 0 1 8 8" stroke="none"/>
					</svg>`,
				chevyleft: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path stroke="#cacaca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 6-6-6-6"/>
					</svg>`,
				close: /*html*/ `
					<svg stroke="#d93e3e" fill="#d93e3e" stroke-width="0" viewBox="0 0 16 16" class="text-[0.95rem]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"></path>
					</svg>`,
				delete: /*html*/ `
					<svg stroke="#fca5a5" fill="#fca5a5" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
						<path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
					</svg>`,
				edit: /*html*/ `
					<svg stroke="#cfc2ff" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"/>
					</svg>`,
				refresh: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
						<path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
						<path d="M16 16h5v5"/>
					</svg>`,
				search: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" fill="#5a5a5a" height="512" width="512" viewBox="0 0 512 512">
						<path d="M495 466.2 377.2 348.4c29.2-35.6 46.8-81.2 46.8-130.9C424 103.5 331.5 11 217.5 11 103.4 11 11 103.5 11 217.5S103.4 424 217.5 424c49.7 0 95.2-17.5 130.8-46.7L466.1 495c8 8 20.9 8 28.9 0 8-7.9 8-20.9 0-28.8m-277.5-83.3C126.2 382.9 52 308.7 52 217.5S126.2 52 217.5 52C308.7 52 383 126.3 383 217.5s-74.3 165.4-165.5 165.4"/>
					</svg>`,
				settings: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/>
						<circle cx="12" cy="12" r="3"/>
					</svg>`,
				sort: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M3 6h18M7 12h10m-7 6h4"/>
					</svg>`,
			},
			get(name: keyof typeof this.html, raw: boolean = false) {
				if (raw) return this.html[name];
				return `data:image/svg+xml;base64,${Buffer.from(this.html[name].trim(), "utf-8").toString("base64")}`;
			},
		};

		const fieldRefs = {
			textArea: ctx.fieldRef<string>(""),
			malAuthCode: ctx.fieldRef<string>(""),
			syncToMAL: ctx.fieldRef<boolean>($storage.get(Keys.Settings.SyncToMAL) ?? false),
			kitsuUsername: ctx.fieldRef<string>(""),
			kitsuPassword: ctx.fieldRef<string>(""),
			syncToKitsu: ctx.fieldRef<boolean>($storage.get(Keys.Settings.SyncToKitsu) ?? false),
		};

		const state = {
			currentMedia: ctx.state<$notes.BaseNote | null>(null),
			searchQuery: ctx.state<string>(""),
			listMediaType: ctx.state<"Anime" | "Manga" | "All">("All"),
			isSaving: ctx.state<boolean>(false),
			isDeleting: ctx.state<boolean>(false),
			isFetching: ctx.state<boolean>(false),
			isEditInvokedFromTray: ctx.state<boolean>(false),
			warnReason: ctx.state<"isAdult" | "isMissing" | null>(null),
			isMalLoggingIn: ctx.state<boolean>(false),
			isKitsuLoggingIn: ctx.state<boolean>(false),
		};

		const settings = {
			general: {
				periodicFetch: ctx.state<string>($storage.get(Keys.Settings.General.PeriodicFetch) ?? "0"),
				periodicFetchRef: ctx.state<Function>(() => {}),
			},
			preference: {
				hideAdult: ctx.fieldRef<boolean>(Boolean($storage.get(Keys.Settings.Preference.HideAdult))),
				warnMissing: ctx.fieldRef<boolean>(Boolean($storage.get(Keys.Settings.Preference.WarnMissing) ?? true)),
				warnAdult: ctx.fieldRef<boolean>(Boolean($storage.get(Keys.Settings.Preference.WarnAdult) ?? true)),
			},
			appearance: {
				hideBannerOnList: ctx.fieldRef<boolean>(Boolean($storage.get(Keys.Settings.Appearance.HideBannerOnList))),
				hideBannerOnEdit: ctx.fieldRef<boolean>(Boolean($storage.get(Keys.Settings.Appearance.HideBannerOnEdit))),
				listDensity: ctx.fieldRef<string>($storage.get(Keys.Settings.Appearance.ListDensity) ?? "default"),
			},
		};

		const providers = {
			mal: {
				authorized: ctx.state<boolean>(false),
				inputToken: ctx.fieldRef<string>(""),
				authUrl: ctx.state<string | null>(null),
				authUrlExpiresAt: ctx.state<number>(0),
				application: {
					clientId: "1430e1148979b475ef513e45f80d2708",
					redirectUri: "https://nnotwen.github.io/n-seanime-extensions/plugins/Notes/callback.html",
				},
				token: {
					access: ctx.state<string | null>($storage.get("notes:mal:token:access") ?? null),
					refresh: ctx.state<string | null>($storage.get("notes:mal:token:refresh") ?? null),
					expiresAt: ctx.state<number | null>($storage.get("notes:mal:token:expiresAt") ?? null),
					type: ctx.state<string | null>($storage.get("notes:mal:token:type") ?? null),
					set(data: any) {
						const expiresAt = data ? Date.now() + data.expires_in * 1000 : null;

						$storage.set("notes:mal:token:access", data?.access_token ?? null);
						$storage.set("notes:mal:token:refresh", data?.refresh_token ?? null);
						$storage.set("notes:mal:token:expiresAt", expiresAt);
						$storage.set("notes:mal:token:type", data?.token_type ?? null);

						this.access.set(data?.access_token ?? null);
						this.refresh.set(data?.refresh_token ?? null);
						this.expiresAt.set(expiresAt);
						this.type.set(data?.token_type ?? null);
					},
				},
				async withAuthHeaders(): Promise<Record<string, string>> {
					if (!this.getAccessToken()) {
						await this.refreshToken();
					}
					return {
						Authorization: `${this.token.type.get()} ${this.token.access.get()}`,
						"Content-Type": "application/json",
					};
				},
				getAccessToken() {
					const token = this.token.access.get();
					const expiry = this.token.expiresAt.get();
					if (!token || !expiry) return null;
					if (Date.now() > expiry) return null;
					return token;
				},
				generateAuthUrl() {
					const currentAuthUrl = this.authUrl.get();
					if (currentAuthUrl && Date.now() < this.authUrlExpiresAt.get()) {
						return this.authUrl.get()!;
					}

					const verifier = Array.from(
						{ length: 86 },
						() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"[Math.floor(Math.random() * 66)],
					).join("");
					$store.set("notes:mal:auth:verifier", verifier);
					const url = new URL("https://myanimelist.net/v1/oauth2/authorize");
					url.searchParams.set("response_type", "code");
					url.searchParams.set("client_id", this.application.clientId);
					url.searchParams.set("redirect_uri", this.application.redirectUri);
					url.searchParams.set("code_challenge", verifier);
					url.searchParams.set("code_challenge_method", "plain"); // MAL does not support S256

					this.authUrlExpiresAt.set(Date.now() + 10 * 60 * 1000);

					return url.toString();
				},
				async exchangeCode(code: string) {
					const verifier = $store.get("notes:mal:auth:verifier");
					if (!verifier) throw new Error("No verifier was set!");

					const res = await ctx.fetch("https://myanimelist.net/v1/oauth2/token", {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							code,
							client_id: this.application.clientId,
							redirect_uri: this.application.redirectUri,
							grant_type: "authorization_code",
							code_verifier: verifier,
						}),
					});

					if (!res.ok) {
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					$store.set("notes:mal:auth:verifier", undefined);
					const data = res.json();
					this.token.set(data);
					this.authorized.set(true);
					return data;
				},
				async refreshToken() {
					if (!this.token.refresh.get()) throw new Error("No refresh token available");

					const res = await ctx.fetch("https://myanimelist.net/v1/oauth2/token", {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							refresh_token: this.token.refresh.get()!,
							client_id: this.application.clientId,
							grant_type: "refresh_token",
						}),
					});

					if (!res.ok) {
						this.token.set(null);
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					const data = res.json();
					this.token.set(data);
				},
				async saveNote(malId: number, type: "ANIME" | "MANGA", note: string) {
					const res = await ctx.fetch(`https://api.myanimelist.net/v2/${type.toLowerCase()}/${malId}/my_list_status`, {
						method: "PATCH",
						headers: {
							...(await this.withAuthHeaders()),
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: new URLSearchParams({ comments: note }),
					});

					if (!res.ok) {
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					return res.json();
				},
				logOut() {
					this.authorized.set(false);
					this.token.set(null);
				},
				init() {
					if (this.getAccessToken() !== null) {
						this.authorized.set(true);
					}

					if (this.token.refresh.get()) {
						this.refreshToken()
							.then(() => this.authorized.set(true))
							.catch(console.log);
					}
				},
			},
			kitsu: {
				authorized: ctx.state<boolean>(false),
				userId: ctx.state<string | null>(null),
				application: {
					userAgent: "Seanime-Notes-for-Kitsu",
				},
				token: {
					access: ctx.state<string | null>($storage.get("notes:kitsu:token:access") ?? null),
					refresh: ctx.state<string | null>($storage.get("notes:kitsu:token:refresh") ?? null),
					expiresAt: ctx.state<number | null>($storage.get("notes:kitsu:token:expiresAt") ?? null),
					type: ctx.state<string | null>($storage.get("notes:kitsu:token:type") ?? null),
					set(data: any) {
						const expiresAt = data ? Date.now() + data.expires_in * 1000 : null;

						$storage.set("notes:kitsu:token:access", data?.access_token ?? null);
						$storage.set("notes:kitsu:token:refresh", data?.refresh_token ?? null);
						$storage.set("notes:kitsu:token:expiresAt", expiresAt);
						$storage.set("notes:kitsu:token:type", data?.token_type ?? null);

						this.access.set(data?.access_token ?? null);
						this.refresh.set(data?.refresh_token ?? null);
						this.expiresAt.set(expiresAt);
						this.type.set(data?.token_type ?? null);
					},
				},

				async withAuthHeaders(): Promise<Record<string, string>> {
					if (!this.getAccessToken()) {
						await this.refreshToken();
					}
					return {
						Authorization: `${this.token!.type.get() ?? "Bearer"} ${this.token!.access.get()}`,
						"Content-Type": "application/json",
						"User-Agent": this.application.userAgent,
					};
				},
				getAccessToken() {
					const token = this.token.access.get();
					const expiry = this.token.expiresAt.get();
					if (!token || !expiry) return null;
					if (Date.now() > expiry) return null;
					return token;
				},
				async refreshToken() {
					if (!this.token.refresh.get()) throw new Error("No refresh token available");

					const res = await ctx.fetch("https://kitsu.io/api/oauth/token", {
						method: "POST",
						headers: {
							"User-Agent": this.application.userAgent,
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: new URLSearchParams({
							grant_type: "refresh_token",
							refresh_token: this.token.refresh.get()!,
						}),
					});

					if (!res.ok) {
						this.token.set(null);
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					const data = res.json();
					this.token.set(data);
				},
				async login(username: string, password: string) {
					const res = await ctx.fetch("https://kitsu.io/api/oauth/token", {
						method: "POST",
						headers: {
							"User-Agent": this.application.userAgent,
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: new URLSearchParams({
							grant_type: "password",
							username,
							password,
						}),
					});

					if (!res.ok) {
						this.token.set(null);
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					const data = res.json();
					this.authorized.set(true);
					this.token.set(data);
				},
				async saveNote(mediaId: number, type: "ANIME" | "MANGA", notes: string) {
					// get user Id if reference to userId doesn't exist yet
					if (!this.userId.get()) {
						const res = await ctx.fetch("https://kitsu.io/api/edge/users?filter[self]=true", { headers: await this.withAuthHeaders() });
						if (!res.ok) {
							this.token.set(null);
							let err = null;
							try {
								err = res.json();
							} catch {
								err = null;
							}
							throw new Error(err?.message || err?.error || res.statusText);
						}

						this.userId.set(res.json().data?.[0]?.id ?? null);
						if (!this.userId.get()) throw new Error("Could not fetch userId");
						await $_wait(1_000);
					}

					const userId = this.userId.get();

					// resolve mediaId to kitsuID
					const kitsuMediaId = await (async () => {
						// self‑contained logic here
						const res = await ctx.fetch(
							`https://kitsu.io/api/edge/mappings?filter[externalSite]=anilist/${type.toLowerCase()}&filter[externalId]=${mediaId}&include=item`,
						);

						if (!res.ok) {
							this.token.set(null);
							let err = null;
							try {
								err = res.json();
							} catch {
								err = null;
							}
							throw new Error(err?.message || err?.error || res.statusText);
						}

						await $_wait(1_000);
						const item = res.json().included?.find((i: any) => i.type === type.toLowerCase());
						return item?.id ? Number(item.id) : null;
					})();

					if (!kitsuMediaId) throw new Error(`Could not find matching media id for anilist/${type.toLowerCase()}: ${mediaId}`);

					// get kitsuMediaLibraryId and patch if exists, post if not
					const mediaLibraryId = await (async () => {
						const res = await ctx.fetch(`https://kitsu.io/api/edge/library-entries?filter[userId]=${userId}&filter[mediaId]=${kitsuMediaId}`, {
							headers: await this.withAuthHeaders(),
						});

						if (!res.ok) {
							this.token.set(null);
							let err = null;
							try {
								err = res.json();
							} catch {
								err = null;
							}
							throw new Error(err?.message || err?.error || res.statusText);
						}

						await $_wait(1_000);
						const data = await res.json();
						return Array.isArray(data.data) && data.data.length > 0 ? data.data[0].id : null;
					})();

					const body: any = {
						data: {
							type: "libraryEntries",
							attributes: { notes },
						},
					};

					const method = !!mediaLibraryId ? "PATCH" : "POST";
					const headers = { ...(await this.withAuthHeaders()), "Content-Type": "application/vnd.api+json" };

					// post or patch
					if (!mediaLibraryId) {
						// POST
						body.data.relationships = {
							media: {
								data: { type: type.toLowerCase(), id: kitsuMediaId },
							},
							user: {
								data: {
									type: "users",
									id: userId,
								},
							},
						};
					} else {
						// PATCH
						body.data.id = mediaLibraryId;
					}

					const res = await ctx.fetch(`https://kitsu.io/api/edge/library-entries/${mediaLibraryId ?? ""}`, {
						method,
						headers,
						body: JSON.stringify(body),
					});

					if (!res.ok) {
						this.token.set(null);
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					return res.json();
				},
				logOut() {
					this.authorized.set(false);
					this.token.set(null);
					this.userId.set(null);
				},
				init() {
					if (this.getAccessToken() !== null) {
						this.authorized.set(true);
					}

					if (this.token.refresh.get()) {
						this.refreshToken()
							.then(() => this.authorized.set(true))
							.catch(console.log);
					}
				},
			},
		};

		const notes = {
			id: "3f5d8ce4-d15f-453d-8616-c030ca4d6f68",
			getAll() {
				return $store.getOrSet<Record<number, $notes.BaseNote>>(this.id, () => ({}));
			},

			set(mediaId: number, note: $notes.BaseNote) {
				const record = this.getAll();
				record[mediaId] = note;
				return $store.set(this.id, record);
			},

			get(mediaId: number) {
				return $store.get<Record<number, $notes.BaseNote> | undefined>(this.id)?.[mediaId];
			},

			delete(mediaId: number) {
				const record = this.getAll();
				const deleted = delete record[mediaId];
				$store.set(this.id, record);
				return deleted;
			},

			async fetch(bypassCache: boolean = true, refreshCache: boolean = true) {
				if (!bypassCache) return Object.values(this.getAll());

				const entries = [];

				for (const type of ["ANIME", "MANGA" as const]) {
					// prettier-ignore
					const query = "query GetUserNotes($username: String, $type: MediaType) { MediaListCollection(userName: $username, type: $type) { lists { entries { id notes media { id title { userPreferred romaji english native } synonyms coverImage { medium } bannerImage type isAdult } } } } }";
					const res = await ctx.fetch("https://graphql.anilist.co", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${$database.anilist.getToken()}`,
						},
						body: JSON.stringify({ query, variables: { username: $database.anilist.getUsername(), type } }),
					});

					if (!res.ok) {
						const json = res.json();
						throw new Error(json.errors?.[0]?.message || res.statusText);
					}

					const json: $notes.AnilistNotesFetchResponse = res.json();
					const notes: $notes.BaseNote[] = json.data.MediaListCollection.lists
						.flatMap((l) => l.entries)
						.filter((entry) => Boolean(entry.notes))
						.map((entry) => ({
							mediaId: entry.media.id,
							mediaTitle: entry.media.title?.userPreferred,
							synonyms: [...entry.media.synonyms, ...new Set([...Object.values(entry.media.title).filter((e): e is string => typeof e === "string")])],
							coverImage: entry.media.coverImage.medium,
							bannerImage: entry.media.bannerImage,
							type: entry.media.type,
							notes: entry.notes!,
						}));

					if (refreshCache) {
						for (const note of notes) {
							this.set(note.mediaId, note);
						}
					}

					entries.push(...notes);
					await $_wait(1_000);
				}

				return entries;
			},

			async save(mediaId: number, note: $notes.BaseNote) {
				// prettier-ignore
				const query = "mutation SaveMediaListEntry($mediaId: Int!, $notes: String!) { SaveMediaListEntry(mediaId: $mediaId, notes: $notes) { notes media { id title { userPreferred, english, native, romaji } synonyms coverImage { medium } bannerImage type isAdult } updatedAt } }";
				const { notes } = note;
				const res = await ctx.fetch("https://graphql.anilist.co", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${$database.anilist.getToken()}`,
					},
					body: JSON.stringify({ query, variables: { mediaId, notes } }),
				});

				if (!res.ok) throw new Error(res.statusText);
				const json: $notes.AnilistNotesSaveResponse = res.json();

				const savedNote: $notes.BaseNote = {
					mediaId: json.data.SaveMediaListEntry.media.id,
					notes: json.data.SaveMediaListEntry.notes ?? "",
					mediaTitle: json.data.SaveMediaListEntry.media.title.userPreferred,
					synonyms: [
						...new Set([
							...(json.data.SaveMediaListEntry.media.synonyms ?? []),
							...Object.values(json.data.SaveMediaListEntry.media.title).filter(Boolean),
						]),
					],
					bannerImage: json.data.SaveMediaListEntry.media.bannerImage,
					coverImage: json.data.SaveMediaListEntry.media.coverImage.medium,
					type: json.data.SaveMediaListEntry.media.type,
					isAdult: json.data.SaveMediaListEntry.media.isAdult,
				};

				if (providers.mal.authorized.get() && fieldRefs.syncToMAL.current.valueOf()) {
					(savedNote.type === "ANIME" ? ctx.anime.getAnimeEntry(mediaId) : ctx.manga.getMangaEntry(mediaId))
						.then((media) => {
							if (!media.media?.idMal) return Promise.reject(new Error("Media does not exist in MyAnimeList"));
							return providers.mal.saveNote(media.media?.idMal, savedNote.type, savedNote.notes);
						})
						.then((e) => console.log(`Notes saved in MyAnimeList: ${JSON.stringify(e, null, 0)}`))
						.catch((e) => console.log(`Failed to save entry in MyAnimeList: ${e.message}`));
				}

				if (providers.kitsu.authorized.get() && fieldRefs.syncToKitsu.current.valueOf()) {
					providers.kitsu
						.saveNote(mediaId, savedNote.type, savedNote.notes)
						.then((e) => console.log(`Notes saved in Kitsu: ${JSON.stringify(e?.data?.attributes, null, 0)}`))
						.catch((e) => console.log(`Failed to save entry in Kitsu: ${e.message}`));
				}

				if (!json.data.SaveMediaListEntry.notes) {
					this.delete(mediaId);
					return note;
				}

				this.set(mediaId, savedNote);

				return savedNote;
			},

			init() {
				for (const type of ["Anime", "Manga"] as const) {
					($anilist[`get${type}Collection`](false).MediaListCollection?.lists ?? [])
						.flatMap((list) => list.entries)
						.filter((entry) => Boolean(unwrap(entry?.notes)))
						.forEach((entry) =>
							this.set(entry!.media!.id, {
								mediaId: entry!.media!.id,
								notes: entry!.notes!,
								mediaTitle: entry!.media!.title?.userPreferred,
								synonyms: [...Object.values(entry!.media!.title ?? {}), ...(entry!.media!.synonyms ?? [])].filter((e) => typeof unwrap(e) === "string"),
								bannerImage: entry!.media!.bannerImage,
								coverImage: entry!.media!.coverImage?.medium,
								type: entry!.media?.type!,
								isAdult: entry!.media?.isAdult?.valueOf(),
							}),
						);
				}
				return;
			},
		};

		const tabs = {
			current: ctx.state<Tabs>(Tabs.General),
			currentOverlay: ctx.state<any[] | null>(null),
			overlay() {
				const overlay = this.currentOverlay.get();
				return overlay
					? tray.div([tray.flex(overlay, { className: "w-full h-full justify-center items-center" })], {
							className: "fixed z-[50] border rounded-lg top-0 left-0",
							style: { width: "calc(100%)", height: "calc(100% - 1rem)", backdropFilter: "blur(4px) brightness(0.4)" },
						})
					: ([] as any[]);
			},

			withBanner(container: any[]) {
				const banner = settings.appearance.hideBannerOnEdit.current
					? []
					: tray.div([], {
							className: "absolute h-40 pointer-events-none bg-center bg-cover rounded-tl-xl rounded-tr-xl border",
							style: {
								top: "-0.75rem",
								left: "-0.75rem",
								width: "calc(100% + 1.5rem)",
								backgroundImage: `url(${state.currentMedia.get()?.bannerImage ?? state.currentMedia.get()?.coverImage})`,
								maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
								filter: !!state.currentMedia.get()?.bannerImage ? "" : "blur(4px)",
							},
						});

				return tray.div([banner, tray.div(container, { className: "relative h-full" })], {
					className: "relative shrink-0",
					style: { height: "24.5rem" },
				});
			},

			header(primary: string, subtext?: string, additionalComponents?: any[]) {
				const icon = tray.div([], {
					className: "w-10 h-10 bg-contain bg-no-repeat bg-center shrink-0",
					style: { backgroundImage: `url(${iconUrl})` },
				});

				const text = tray.stack(
					[
						tray.span(`${primary}`, { className: " text-lg font-bold" }), //
						subtext ? tray.span(`${subtext}`, { className: "text-[--muted] text-sm" }) : [],
					],
					{ gap: 0, className: "flex-1" },
				);

				return tray.flex([icon, text, tray.div(additionalComponents ?? [])], {
					gap: 3,
					className: "mb-4",
				});
			},

			deleteModal(entry: $notes.BaseNote) {
				const header = tray.flex(
					[
						tray.text("Delete Note?", { className: "text-lg pb-2 border-b font-bold" }),
						tray.button("\u200b", {
							intent: "gray-subtle",
							className: "w-10 h-10 rounded-full bg-transparent bg-center bg-no-repeat",
							style: { backgroundImage: `url(${icons.get("close")})`, backgroundSize: "1.2rem" },
							onClick: ctx.eventHandler("close-modal", () => tabs.currentOverlay.set(null)),
						}),
					],
					{ className: "justify-between items-center" },
				);

				const prompt = tray.p(
					[
						tray.span("Are you sure you want to delete the notes for "),
						tray.span(`${entry.mediaTitle}`, { className: "text-lg text-red-400 font-semibold leading-tight" }),
						tray.span("?"),
					],
					{ className: "break-words" },
				);
				const subtext = tray.text("🛈 This action cannot be undone", { className: "text-sm text-[--muted]" });
				const actionBtns = tray.flex([
					tray.button("Cancel", {
						intent: "gray-subtle",
						size: "md",
						className: "w-full",
						onClick: ctx.eventHandler("close-modal-2", () => tabs.currentOverlay.set(null)),
					}),
					tray.button("Delete", {
						intent: "alert-subtle",
						size: "md",
						className: "w-full",
						onClick: ctx.eventHandler("perform-modal-action", () => {
							tabs.currentOverlay.set(null);
							state.isDeleting.set(true);
							ctx.setTimeout(() => {
								const currentMedia = state.currentMedia.get();
								notes
									.save(entry.mediaId, { ...entry, notes: "" })
									.then(() => {
										ctx.toast.success(`Deleted notes for ${entry.mediaTitle}!`);
										if (currentMedia?.mediaId === entry.mediaId) {
											state.currentMedia.set({ ...entry, notes: "" });
											ctx.screen.loadCurrent();
										}
									})
									.catch((err) => ctx.toast.error(`An error occured while deleting your note: ${err.message}`))
									.finally(() => state.isDeleting.set(false));
							}, 1_500);
						}),
					}),
				]);

				const body = tray.stack([prompt, subtext]);

				this.currentOverlay.set([tray.stack([header, body, actionBtns], { className: "p-5 m-2 bg-gray-900 border rounded-lg" })]);
			},

			formatEntryDefault(entry: $notes.BaseNote) {
				const background = tray.div([], {
					className: "notes-tab-general-entry-card-background absolute top-0 left-0 w-full h-full bg-gray-900 bg-center bg-cover pointer-events-none",
					style: {
						backgroundImage: settings.appearance.hideBannerOnList.current ? "" : `url(${entry.bannerImage ?? entry.coverImage})`,
						maskImage: settings.appearance.hideBannerOnList.current ? "" : "linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 100%)",
						filter: !!entry.bannerImage ? "" : "blur(2px)",
					},
				});

				const info = tray.stack(
					[
						tray.text(String(entry.mediaTitle ?? ""), {
							className: "font-semibold break-words overflow-hidden line-clamp-2",
						}),
						tray.text(`\u201c${entry.notes}\u201d`, {
							className: "text-sm break-words overflow-hidden italic line-clamp-3 text-[--muted] leading-tight",
						}),
					],
					{ className: "w-full leading-tight pointer-events-none" },
				);

				const actionGroup = tray.stack(
					[
						tray.button("\u200b", {
							intent: "primary-subtle",
							disabled: state.isFetching.get() || state.isDeleting.get() || state.isSaving.get(),
							loading: state.isFetching.get(),
							className: "w-10 h-10 rounded-full bg-no-repeat bg-center p-0",
							style: {
								backgroundImage: state.isFetching.get() || state.isDeleting.get() ? "" : `url(${icons.get("edit")})`,
								paddingInlineStart: "0.5rem",
								backdropFilter: "blur(4px)",
							},
							onClick: ctx.eventHandler(`edit-note:${entry.mediaId}`, () => {
								state.isEditInvokedFromTray.set(true);
								state.currentMedia.set(entry);
								fieldRefs.textArea.setValue(entry.notes);
								tabs.current.set(Tabs.Editor);
							}),
						}),
						tray.button("\u200b", {
							intent: "alert-subtle",
							disabled: state.isFetching.get() || state.isDeleting.get() || state.isSaving.get(),
							loading: state.isFetching.get() || state.isDeleting.get(),
							className: "w-10 h-10 rounded-full bg-no-repeat bg-center p-0",
							style: {
								backgroundImage: state.isFetching.get() || state.isDeleting.get() ? "" : `url(${icons.get("delete")})`,
								paddingInlineStart: "0.5rem",
								backdropFilter: "blur(4px)",
								backgroundSize: "1.3rem",
							},
							onClick: ctx.eventHandler(`delete-note:${entry.mediaId}`, () => tabs.deleteModal(entry)),
						}),
					],
					{ className: "z-[2]" },
				);

				return tray.div(
					[
						background,
						tray.flex([info, actionGroup], { className: "relative p-2" }),
						tray.button("\u200b", {
							className: "absolute top-0 left-0 w-full h-full bg-transparent",
							onClick: ctx.eventHandler(`navigate-to:${entry.mediaId}`, () => {
								const path = String(entry.type) === "ANIME" ? "/entry" : "/manga/entry";
								ctx.screen.navigateTo(path, { id: entry.mediaId.toString() });
								tray.close();
							}),
						}),
					],
					{
						className: "note-tab-general-container relative p-2 rounded-lg border overflow-hidden h-fit cursor-pointer shrink-0",
					},
				);
			},

			formatEntryCompact(entry: $notes.BaseNote) {
				const background = tray.div([], {
					className: "notes-tab-general-entry-card-background absolute top-0 left-0 w-full h-full bg-gray-900 bg-center bg-cover pointer-events-none",
					style: {
						backgroundImage: settings.appearance.hideBannerOnList.current ? "" : `url(${entry.bannerImage ?? entry.coverImage})`,
						maskImage: settings.appearance.hideBannerOnList.current ? "" : "linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 100%)",
						filter: !!entry.bannerImage ? "" : "blur(2px)",
					},
				});

				const actionGroup = tray.flex(
					[
						tray.button("\u200b", {
							intent: "primary-subtle",
							disabled: state.isFetching.get() || state.isDeleting.get() || state.isSaving.get(),
							loading: state.isFetching.get(),
							className: "w-8 h-full rounded-none bg-no-repeat bg-center p-0",
							style: {
								backgroundImage: state.isFetching.get() || state.isDeleting.get() ? "" : `url(${icons.get("edit")})`,
								paddingInlineStart: "0.5rem",
							},
							onClick: ctx.eventHandler(`edit-note:${entry.mediaId}`, () => {
								state.isEditInvokedFromTray.set(true);
								state.currentMedia.set(entry);
								fieldRefs.textArea.setValue(entry.notes);
								tabs.current.set(Tabs.Editor);
							}),
						}),
						tray.button("\u200b", {
							intent: "alert-subtle",
							disabled: state.isFetching.get() || state.isDeleting.get() || state.isSaving.get(),
							loading: state.isFetching.get() || state.isDeleting.get(),
							className: "w-8 h-full rounded-none bg-no-repeat bg-center p-0",
							style: {
								backgroundImage: state.isFetching.get() || state.isDeleting.get() ? "" : `url(${icons.get("delete")})`,
								paddingInlineStart: "0.5rem",
								backgroundSize: "1.3rem",
							},
							onClick: ctx.eventHandler(`delete-note:${entry.mediaId}`, () => tabs.deleteModal(entry)),
						}),
					],
					{ gap: 0, className: "pr-3", style: { backdropFilter: "blur(4px)" } },
				);

				return tray.flex(
					[
						background,
						tray.div([tray.text(`${entry.mediaTitle}`, { className: "w-full py-1 px-2 line-clamp-1 font-semibold cursor-pointer" })], {
							className: "flex-1",
							onClick: ctx.eventHandler(`navigate-to:${entry.mediaId}`, () => {
								const path = String(entry.type) === "ANIME" ? "/entry" : "/manga/entry";
								ctx.screen.navigateTo(path, { id: entry.mediaId.toString() });
								tray.close();
							}),
						}),
						actionGroup,
					],
					{ className: "note-tab-general-container w-full border rounded-full relative overflow-hidden shrink-0", gap: 0 },
				);
			},

			[Tabs.General]() {
				const refresh = tray.button("\u200b", {
					intent: "gray-subtle",
					disabled: state.isSaving.get() || state.isDeleting.get(),
					loading: state.isFetching.get(),
					className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center p-0",
					style: {
						...(state.isFetching.get() ? {} : { backgroundImage: `url(${icons.get("refresh")})` }),
						backgroundSize: "1.2rem",
						paddingInlineStart: "0.5rem",
					},
					onClick: ctx.eventHandler(`refresh-notes`, () => {
						state.isFetching.set(true);
						notes
							.fetch()
							.then(() => ctx.setTimeout(() => ctx.toast.success("Successfully fetched all notes from AniList!"), 2_000))
							.catch((err) => ctx.toast.error(`An error occured while fetching notes: ${err.message}`))
							.finally(() =>
								ctx.setTimeout(() => {
									state.isFetching.set(false);
									tray.update();
								}, 2_000),
							);
					}),
				});

				const cog = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.get("settings")})`, backgroundSize: "1.2rem" },
					onClick: ctx.eventHandler(`notes-settings`, () => tabs.current.set(Tabs.Settings)),
				});

				const header = this.header("Notes", "Your thoughts, saved here!", [
					tray.flex([tray.tooltip(refresh, { text: "Refresh" }), tray.tooltip(cog, { text: "Settings" })], {
						className: "items-center",
					}),
				]);

				const entries = Object.values(notes.getAll())
					// Filter by search result
					.filter((a) => [a.mediaTitle, ...(a.synonyms || []), a.notes].join(" ").toLowerCase().includes(state.searchQuery.get().toLowerCase()))
					// Filter adult if enabled
					.filter((a) => (settings.preference.hideAdult.current ? !a.isAdult : true))
					// Filter by type
					.filter((a) => state.listMediaType.get() === "All" || state.listMediaType.get().toLowerCase() === a.type?.toLowerCase())
					.sort((A, B) => (A.mediaTitle ?? "").localeCompare(B.mediaTitle ?? ""))
					.map(settings.appearance.listDensity.current === "default" ? tabs.formatEntryDefault : tabs.formatEntryCompact);

				const body = tray.stack(
					[
						tray.flex(
							[
								tray.input({
									placeholder: "Search notes...",
									value: state.searchQuery.get(),
									style: {
										borderRadius: "0.5rem 0 0 0.5rem",
										paddingInlineStart: "2.5rem",
										backgroundImage: `url(${icons.get("search")})`,
										backgroundSize: "1rem",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "calc(0% + 0.75rem) center",
									},
									onChange: ctx.eventHandler("search-notes", (e) => state.searchQuery.set(String(e.value))),
								}),
								tray.tooltip(
									tray.button(state.listMediaType.get(), {
										intent: "gray-subtle",
										className: "w-28 rounded-tl-none rounded-bl-none bg-no-repeat pr-8 pl-3 justify-start",
										style: {
											height: "-webkit-fill-available",
											marginLeft: "-1px",
											backgroundImage: `url(${icons.get("sort")})`,
											backgroundPosition: "calc(100% - 0.25rem * 3) center",
										},
										onClick: ctx.eventHandler("mediatype-filter", function () {
											const mediaType = state.listMediaType.get();
											state.listMediaType.set(({ All: "Anime", Anime: "Manga", Manga: "All" } as const)[mediaType]);
										}),
									}),
									{ text: "Filter by media" },
								),
							],
							{ gap: 0 },
						),
						tray.stack(
							entries.length
								? entries
								: [
										tray.stack(
											[
												tray.text("Nothing here yet", { className: "text-xl font-bold text-[--muted]" }),
												tray.text(kaomojis[Math.floor(Math.random() * kaomojis.length)], {
													className: "text-xl text-[--muted]",
												}),
											],
											{ className: "w-full h-full text-center justify-center" },
										),
									],
							{
								style: {
									height: "25rem",
									overflowY: "scroll",
									overflowX: "hidden",
								},
							},
						),
					],
					{},
				);

				return tray.stack([this.overlay(), header, body], { className: "p-2" });
			},

			[Tabs.Editor]() {
				const back = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent",
					style: { backgroundImage: `url(${icons.get("back")})`, backgroundSize: "1.5rem" },
					onClick: ctx.eventHandler(`notes-goback`, () => tabs.current.set(Tabs.General)),
				});

				const header = tray.flex(
					[
						tray.stack(
							[
								tray.text(`${state.currentMedia.get()?.notes.toString().length ? "Edit" : "Add"} Notes`, {
									className: "text-xl font-bold text-white",
								}),
								tray.text(`${state.currentMedia.get()?.mediaTitle}`, {
									className: "text-white overflow-hidden line-clamp-2 break-words leading-tight",
								}),
							],
							{
								className: "w-full",
							},
						),
						tray.flex(state.isEditInvokedFromTray.get() ? [tray.tooltip(back, { text: "Go Back" })] : [], {
							className: "items-start",
						}),
					],
					{ className: "pt-3" },
				);

				const body = tray.stack(
					[
						tray.input({
							textarea: true,
							fieldRef: fieldRefs.textArea,
							className: "bg-gray-900",
							style: { height: "12rem" },
						}),

						tray.text("Adding a note to a non-existent entry will always create a Planning entry.", {
							className: "text-xs text-[--muted] break-words",
						}),

						tray.flex(
							[
								tray.button({
									label: state.isSaving.get() ? "Saving" : "Save",
									loading: state.isSaving.get(),
									disabled: state.isDeleting.get() || state.isFetching.get(),
									size: "md",
									intent: "success-subtle",
									className: "w-full",
									onClick: ctx.eventHandler("save-note", () => {
										const currentMedia = state.currentMedia.get();
										if (!currentMedia) return ctx.toast.error(`Error saving notes: Unable to get current media information.`);

										if (currentMedia.isAdult && settings.preference.warnAdult.current) {
											state.warnReason.set("isAdult");
											return tabs.current.set(Tabs.WarnBeforeSaving);
										}

										if (settings.preference.warnMissing.current && !isMediaInUserCollection(currentMedia.mediaId, currentMedia.type)) {
											state.warnReason.set("isMissing");
											return tabs.current.set(Tabs.WarnBeforeSaving);
										}
										state.isSaving.set(true);
										const updateMedia = { ...currentMedia, notes: fieldRefs.textArea.current };
										ctx.setTimeout(() => {
											notes
												.save(currentMedia.mediaId, updateMedia)
												.then(() => {
													ctx.toast.success(`Successfully saved notes!`);
													state.currentMedia.set(updateMedia);
													ctx.screen.loadCurrent();
												})
												.catch((e) => ctx.toast.error(`Error saving notes: ${e.message}`))
												.finally(() => state.isSaving.set(false));
										}, 1_500);
									}),
								}),
								tray.button("\u200b", {
									intent: "alert-subtle",
									disabled: state.isFetching.get() || state.isSaving.get() || !state.currentMedia.get()?.notes.toString().length,
									loading: state.isDeleting.get(),
									className: "w-11 h-full rounded-lg bg-no-repeat bg-center p-0",
									style: {
										backgroundImage: state.isDeleting.get() ? "" : `url(${icons.get("delete")})`,
										backgroundSize: "1.2rem",
										paddingInlineStart: "0.5rem",
									},
									onClick: ctx.eventHandler(`delete-current-note`, () => {
										const entry = state.currentMedia.get();
										if (!entry) return ctx.toast.error("Note GET error: Could not retrieve the current note!");
										tabs.deleteModal(entry);
									}),
								}),
							],
							{},
						),
					],
					{},
				);

				return this.withBanner([
					tray.stack([this.overlay(), header, body], { style: { padding: "0.5rem", height: "24.5rem", justifyContent: "space-between" } }),
				]);
			},

			[Tabs.Settings]() {
				const back = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.get("back")})`, backgroundSize: "1.5rem" },
					onClick: ctx.eventHandler(`notes-goback`, () => tabs.current.set(Tabs.General)),
				});

				const header = this.header("Notes Settings", "Manage your preferences", [
					tray.flex([tray.tooltip(back, { text: "Refresh" })], {
						className: "items-center",
					}),
				]);

				const malVerifier = tray.stack(
					!providers.mal.authorized.get()
						? [
								tray.text("Please authorize this application first", { className: "text-sm text-red-300 leading-none" }),
								tray.input({
									placeholder: "Paste authorization code here",
									fieldRef: fieldRefs.malAuthCode,
								}),
								tray.flex(
									[
										tray.anchor("Authorize", {
											href: providers.mal.generateAuthUrl(),
											className:
												"whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--brand] border bg-brand-50 border-transparent hover:bg-brand-100 active:bg-brand-200 dark:bg-opacity-10 dark:hover:bg-opacity-20 text-sm h-10 px-4 no-underline",
											style: { fontSize: "0.95rem", borderRadius: "0.5rem 0 0 0.5rem", flex: "1" },
										}),
										tray.button("Verify Code", {
											intent: "success-subtle",
											size: "md",
											loading: state.isMalLoggingIn.get(),
											style: { width: "100%", borderRadius: "0 0.5rem 0.5rem 0", flex: "1" },
											onClick: ctx.eventHandler("verify-auth-code", () => {
												const authcode = fieldRefs.malAuthCode.current;
												if (!authcode.length) return ctx.toast.error("Please enter the authorization code!");
												state.isMalLoggingIn.set(true);
												providers.mal
													.exchangeCode(authcode)
													.then(() => ctx.toast.success("Successfully authorized application: MAL"))
													.catch((err) => ctx.toast.error(`Auth Code Exchange failed: ${err.message}`))
													.finally(() => {
														fieldRefs.malAuthCode.setValue("");
														state.isMalLoggingIn.set(false);
													});
											}),
										}),
									],
									{ gap: 0 },
								),
							]
						: [
								tray.text("Application authorized", { style: { fontSize: "0.8rem", color: "var(--green-200)", lineHeight: "normal" } }),
								tray.button("Log-out", {
									intent: "alert-subtle",
									size: "md",
									loading: state.isMalLoggingIn.get(),
									style: { width: "100%" },
									onClick: ctx.eventHandler("mal:signed-out", () => {
										state.isMalLoggingIn.set(true);
										ctx.setTimeout(() => {
											providers.mal.logOut();
											state.isMalLoggingIn.set(false);
											fieldRefs.syncToMAL.setValue(false);
										}, 2_500);
									}),
								}),
							],
					{
						style: {
							paddingTop: "0.5rem",
							marginTop: "-1px",
							borderTop: "1px solid var(--border)",
						},
					},
				);

				const kitsuVerifier = tray.stack(
					[
						!providers.kitsu.authorized.get()
							? [
									tray.text("Please authorize this application first", { style: { fontSize: "0.8rem", color: "var(--red-300)", lineHeight: "normal" } }),
									tray.input({
										placeholder: "Email",
										fieldRef: fieldRefs.kitsuUsername,
									}),
									tray.input({
										placeholder: "Password",
										fieldRef: fieldRefs.kitsuPassword,
										style: {
											"-webkit-text-security": "disc",
										},
									}),

									tray.button("Log-in", {
										intent: "primary-subtle",
										size: "md",
										style: { width: "100%" },
										loading: state.isKitsuLoggingIn.get(),
										onClick: ctx.eventHandler("notes:kitsu-login", () => {
											const username = fieldRefs.kitsuUsername.current;
											const password = fieldRefs.kitsuPassword.current;

											if (!username.length || !password.length) return ctx.toast.error("Username and password fields cannot be blank!");

											state.isKitsuLoggingIn.set(true);
											providers.kitsu
												.login(username, password)
												.then(() => ctx.toast.success("Successfully authorized application: Kitsu"))
												.catch((err) => ctx.toast.error(`Login failed: ${err.message}`))
												.finally(() => state.isKitsuLoggingIn.set(false));
										}),
									}),
								]
							: [
									tray.text("Application authorized", { style: { fontSize: "0.8rem", color: "var(--green-200)", lineHeight: "normal" } }),
									tray.button("Log-out", {
										intent: "alert-subtle",
										size: "md",
										loading: state.isKitsuLoggingIn.get(),
										style: { width: "100%" },
										onClick: ctx.eventHandler("kitsu:signed-out", () => {
											state.isKitsuLoggingIn.set(true);
											ctx.setTimeout(() => {
												providers.kitsu.logOut();
												state.isKitsuLoggingIn.set(false);
												fieldRefs.syncToKitsu.setValue(false);
											}, 2_500);
										}),
									}),
								],
					],
					{
						style: {
							paddingTop: "0.5rem",
							marginTop: "-1px",
							borderTop: "1px solid var(--border)",
						},
					},
				);

				const body = tray.stack(
					[
						// General
						tray.stack(
							[
								tray.text("General", { className: "text-xl font-bold" }),
								tray.stack(
									[
										tray.select({
											label: "Perform a periodic fetch every",
											value: settings.general.periodicFetch.get(),
											onChange: ctx.eventHandler("note:settings:periodicfetch", (v) => {
												$storage.set(Keys.Settings.General.PeriodicFetch, v.value);
												settings.general.periodicFetch.set(v.value);
												settings.general.periodicFetchRef.get()?.();

												const delay = Number(v.value);
												if (delay === 0) return;
												settings.general.periodicFetchRef.set(() => ctx.setInterval(() => notes.fetch(), delay));
											}),
											options: [
												{
													label: "1 hour",
													value: "3.6e6",
												},
												{
													label: "3 hours",
													value: "1.08e7",
												},
												{
													label: "6 hours",
													value: "2.16e7",
												},
												{
													label: "12 hours",
													value: "4.32e7",
												},
												{
													label: "24 hours",
													value: "8.64e7",
												},
												{
													label: "Never",
													value: "0",
												},
											],
										}),
									],
									{ gap: 0, className: "p-2 border-t" },
								),
							],
							{ className: "p-4 rounded-lg border bg-gray-900", gap: 2 },
						),
						// Preferences
						tray.stack(
							[
								tray.text("Preferences", { className: "text-xl font-bold" }),
								tray.stack(
									[
										tray.switch("Hide adult-only entries from the list", {
											fieldRef: settings.preference.hideAdult,
											onChange: ctx.eventHandler("note:settings:hideadult", (v) => {
												$storage.set(Keys.Settings.Preference.HideAdult, v.value);
												settings.preference.hideAdult.setValue(v.value);
											}),
										}),
										tray.switch("Warn me when I try to save a note whose entry isn't in my collection", {
											fieldRef: settings.preference.warnMissing,
											onChange: ctx.eventHandler("note:settings-warnmissing", (v) => {
												$storage.set(Keys.Settings.Preference.WarnMissing, v.value);
												settings.preference.warnMissing.setValue(v.value);
											}),
										}),
										tray.switch("Warn me when I try to save a note whose entry is an adult-only", {
											fieldRef: settings.preference.warnAdult,
											onChange: ctx.eventHandler("notes:settings-warnadult", (v) => {
												$storage.set(Keys.Settings.Preference.WarnAdult, v.value);
												settings.preference.warnAdult.setValue(v.value);
											}),
										}),
									],
									{ className: "p-2 border-t", gap: 2 },
								),
							],
							{ className: "p-4 rounded-lg border bg-gray-900", gap: 2 },
						),
						// Appearance
						tray.stack(
							[
								tray.text("Appearance", { className: "text-xl font-bold" }),
								tray.stack(
									[
										tray.switch("Do not show banner on list", {
											fieldRef: settings.appearance.hideBannerOnList,
											onChange: ctx.eventHandler("note:settings:hidebanneronlist", (v) => {
												$storage.set(Keys.Settings.Appearance.HideBannerOnList, v.value);
												settings.appearance.hideBannerOnList.setValue(v.value);
											}),
										}),
										tray.switch("Do not show banner on editor", {
											fieldRef: settings.appearance.hideBannerOnEdit,
											onChange: ctx.eventHandler("note:settings:hidebanneronedit", (v) => {
												$storage.set(Keys.Settings.Appearance.HideBannerOnEdit, v.value);
												settings.appearance.hideBannerOnEdit.setValue(v.value);
											}),
										}),
										tray.flex(
											[
												tray.span("List density", { className: "mr-2 font-semibold whitespace-nowrap" }),
												tray.select("", {
													fieldRef: settings.appearance.listDensity,
													size: "sm",
													onChange: ctx.eventHandler("note:settings:listdensity", (v) => {
														$storage.set(Keys.Settings.Appearance.ListDensity, v.value);
														settings.appearance.listDensity.setValue(v.value);
													}),
													options: [
														{
															label: "Default",
															value: "default",
														},
														{
															label: "Compact",
															value: "compact",
														},
													],
												}),
											],
											{ className: "items-center" },
										),
									],
									{ gap: 0, className: "p-2 border-t" },
								),
							],
							{ className: "p-4 rounded-lg border bg-gray-900", gap: 2 },
						),
						// MyAnimeList
						tray.stack(
							[
								tray.div([], {
									className: "h-7 pointer-events-none bg-contain bg-no-repeat",
									style: {
										backgroundImage: `url(https://nnotwen.github.io/n-seanime-extensions/plugins/MyAnimeListSync/logo.png)`,
										backgroundPosition: "left center",
									},
								}),
								tray.switch("Update my notes to MAL when I save them.", {
									fieldRef: fieldRefs.syncToMAL,
									disabled: !providers.mal.authorized.get(),
									style: { "--color-brand-500": "47 82 161" },
									onChange: ctx.eventHandler("notes:mal-sync", (v) => {
										$storage.set(Keys.Settings.SyncToMAL, v.value);
										fieldRefs.syncToMAL.setValue(v.value);
										tray.update();
									}),
								}),
								malVerifier,
							],
							{ className: "p-4 rounded-lg border bg-gray-900", gap: 0 },
						),
						// Kitsu
						tray.stack(
							[
								tray.div([], {
									className: "h-7 pointer-events-none bg-contain bg-no-repeat",
									style: {
										backgroundImage: `url(https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/KitsuSync/brand-logo.png)`,
										backgroundPosition: "left center",
									},
								}),
								tray.switch("Update my notes to Kitsu when I save them.", {
									fieldRef: fieldRefs.syncToKitsu,
									disabled: !providers.kitsu.authorized.get(),
									style: { "--color-brand-500": "231 94 69" },
									onChange: ctx.eventHandler("notes:kitsu-sync", (v) => {
										$storage.set(Keys.Settings.SyncToKitsu, v.value);
										fieldRefs.syncToKitsu.setValue(v.value);
										tray.update();
									}),
								}),
								kitsuVerifier,
							],
							{ className: "p-4 rounded-lg border bg-gray-900", gap: 0 },
						),
					],
					{
						gap: 4,
						style: {
							overflowY: "scroll",
							maxHeight: "28rem",
							paddingRight: "0.2rem",
							"--color-brand-500": "0 155 187",
						},
					},
				);

				return tray.stack([header, body], { className: "p-2", style: { minHeight: "24.5rem" } });
			},

			[Tabs.WarnBeforeSaving]() {
				const reason: Record<Exclude<ReturnType<typeof state.warnReason.get>, null>, string> = {
					isAdult:
						'This entry contains adult content. If this entry is not on your list yet, it will show up on your profile under the "Planning" status. Are you sure you want to continue?',
					isMissing:
						'This entry is not yet in your collection. If you save this note, this entry will show up on your profile under the "Planning" status. Are you sure you want to continue?',
				};

				const reasonKey = state.warnReason.get();

				if (!reasonKey) {
					tray.close();
					return ctx.toast.error("Could not fetch reasonKey for this operation.");
				}

				const hasNote = notes.get(state.currentMedia.get()?.mediaId ?? 0);

				const back = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.get("back")})`, backgroundSize: "1.2rem" },
					onClick: ctx.eventHandler(`notes-goback`, () => tabs.current.set(Tabs.General)),
				});

				const header = tray.flex(
					[
						tray.stack(
							[
								tray.text(`${hasNote?.notes?.length ? "Edit" : "Add"} Notes`, {
									className: "text-xl font-bold text-white",
								}),
								tray.text(`${state.currentMedia.get()?.mediaTitle}`, {
									className: "text-white overflow-hidden line-clamp-2 break-words",
								}),
							],
							{
								className: "w-full",
								style: { lineHeight: "1em", textShadow: "0 0 10px black" },
							},
						),
						tray.flex([tray.tooltip(back, { text: "Go Back" })], {
							className: "items-center",
						}),
					],
					{ className: "pt-3" },
				);

				const body = tray.stack(
					[
						tray.flex(
							[
								tray.div([], {
									className: "w-32 h-32 bg-contain bg-no-repeat",
									style: {
										background: `url(https://nnotwen.github.io/n-seanime-extensions/plugins/Notes/bruh.png)`,
										backgroundPosition: "left center",
									},
								}),
							],
							{ className: "justify-center" },
						),
						tray.text(reason[reasonKey], {
							className: "break-normal text-center w-full p-4 text-red-300 rounded-xl relative",
							style: {
								backgroundColor: "rgb(from var(--red-700) r g b / 0.3)",
								border: "1px solid var(--red-700)",
							},
						}),
						tray.button("Save", {
							intent: "alert",
							size: "md",
							loading: state.isSaving.get(),
							disabled: state.isDeleting.get() || state.isFetching.get(),
							onClick: ctx.eventHandler("save:bypass-warning", () => {
								const currentMedia = state.currentMedia.get();
								if (!currentMedia) return ctx.toast.error(`Error saving notes: Unable to get current media information.`);

								state.isSaving.set(true);
								notes
									.save(state.currentMedia.get()?.mediaId!, {
										...currentMedia,
										notes: fieldRefs.textArea.current,
									})
									.then(() => ctx.toast.success(`Successfully saved notes!`))
									.catch((e) => ctx.toast.error(`Error saving notes: ${e.message}`))
									.finally(() => state.isSaving.set(false));

								tabs.current.set(Tabs.Editor);
							}),
						}),
					],
					{ gap: 5 },
				);

				return this.withBanner([tray.stack([header, body], { className: "p-2 justify-between" })]);
			},

			get() {
				return this[this.current.get()]();
			},
		};

		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		function unwrap<T>(value: T | null | undefined): T | undefined {
			if (value == null) return undefined;
			if (typeof value === "object") {
				const v = (value as any).valueOf?.();
				return v == null ? undefined : v;
			}
			return value;
		}

		function isMediaInUserCollection(mediaId: number, type: $app.AL_MediaType) {
			const kind = (String(type)[0].toUpperCase() + type.slice(1).toLowerCase()) as Capitalize<Lowercase<$app.AL_MediaType>>;
			return ($anilist[`get${kind}Collection`](false).MediaListCollection?.lists ?? [])
				.flatMap((list) => list.entries)
				.some((entry) => unwrap(entry?.media?.id) === mediaId);
		}

		function isCustomSource(mediaId?: number) {
			return (mediaId ?? 0) >= 2 ** 31;
		}

		function onEditBtnClicked({ media }: { media: $app.AL_BaseAnime | $app.AL_BaseManga }) {
			const mediaId = media.id;

			if (isCustomSource(mediaId)) {
				return ctx.toast.warning("Custom sources are not supported!");
			}

			const currentMedia = notes.get(mediaId) ?? {
				mediaId,
				mediaTitle: media.title?.userPreferred,
				synonyms: [...(media.synonyms ?? []), ...new Set([...Object.values(media.title ?? {}).filter((e): e is string => typeof e === "string")])],
				bannerImage: media.bannerImage,
				coverImage: media.coverImage?.medium,
				type: media.type!,
				notes: "",
				isAdult: media.isAdult,
			};

			state.isEditInvokedFromTray.set(false);
			state.currentMedia.set(currentMedia);
			fieldRefs.textArea.setValue(currentMedia.notes);
			tabs.current.set(Tabs.Editor);
			tray.open();
		}

		// prettier-ignore
		const noteIcn = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cmVjdCB4PSI2IiB5PSI0IiB3aWR0aD0iMTMiIGhlaWdodD0iMTciIHJ4PSIyIiBzdHJva2U9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0xNSAxMFY4TTQgOWg0bS00IDRoNG0tNCA0aDQiIHN0cm9rZT0iI2NhY2FjYSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=";
		const animeBtn = ctx.action.newAnimePageButton({ label: "\u200b" });
		const mangaBtn = ctx.action.newMangaPageButton({ label: "\u200b" });

		for (const btn of [animeBtn, mangaBtn]) {
			btn.setIntent("gray-subtle");
			btn.setStyle({
				backgroundImage: `url(${noteIcn})`,
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				backgroundSize: "1.7rem",
				width: "40px",
			});
			btn.mount();
			btn.onClick(onEditBtnClicked);
		}

		ctx.dom.onReady(async () => {
			const style = await ctx.dom.createElement("style");
			style.setText(
				".notes-tab-general-entry-card-background { transition: transform ease-in-out 0.3s;  } .note-tab-general-container:hover .notes-tab-general-entry-card-background { mask-image: linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)!important; transform: scale(1.2) }",
			);
		});

		ctx.screen.onNavigate((e) => {
			// Anime
			if (e.pathname === "/entry") {
				const mediaId = Number(e.searchParams.id);
				if (isCustomSource(mediaId)) {
					return animeBtn.unmount();
				} else {
					animeBtn.mount();
				}
				const note = notes.get(mediaId);
				animeBtn.setTooltipText(!!note ? "Edit Notes" : "Add Notes");
			}

			if (e.pathname === "/manga/entry") {
				const mediaId = Number(e.searchParams.id);
				if (isCustomSource(mediaId)) {
					return mangaBtn.unmount();
				} else {
					mangaBtn.mount();
				}
				const note = notes.get(mediaId);
				mangaBtn.setTooltipText(!!note ? "Edit Notes" : "Add Notes");
			}
		});

		tray.render(() => tabs.get());
		tray.onClose(() => tabs.current.set(Tabs.General));

		if (Number(settings.general.periodicFetch.get())) {
			const delay = Number(settings.general.periodicFetch.get());
			if (delay === 0) return;
			settings.general.periodicFetchRef.set(() => ctx.setInterval(() => notes.fetch(), delay));
		}

		notes.init();
		providers.mal.init();
		providers.kitsu.init();

		ctx.screen.loadCurrent();
	});
}
