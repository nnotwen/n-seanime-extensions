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
				},
			},
		} as const;

		const kaomojis = ["(・・ )ゞ", "(・・;)ゞ", "(・_・;)", "(._.)", "(´･ω･`)", "(￣▽￣*)ゞ", "(ᵕ—ᴗ—)"];

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
						() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"[Math.floor(Math.random() * 66)]
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
							`https://kitsu.io/api/edge/mappings?filter[externalSite]=anilist/${type.toLowerCase()}&filter[externalId]=${mediaId}&include=item`
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
				return $store.getOrSet(this.id, () => ({} as Record<number, $notes.BaseNote>));
			},

			set(mediaId: number, note: $notes.BaseNote) {
				const record = this.getAll();
				record[mediaId] = note;
				return $store.set(this.id, record);
			},

			get(mediaId: number) {
				return ($store.get(this.id) as Record<number, $notes.BaseNote> | undefined)?.[mediaId];
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
							})
						);
				}
				return;
			},
		};

		const tabs = {
			current: ctx.state<Tabs>(Tabs.General),

			withBanner(container: any[]) {
				const banner = settings.appearance.hideBannerOnEdit.current
					? []
					: tray.div([], {
							style: {
								position: "absolute",
								top: "-0.75rem",
								left: "-0.75rem",
								width: "calc(100% + 1.5rem)",
								height: "10rem",
								borderRadius: "0.75rem 0.75rem 0 0",
								pointerEvents: "none",
								background: `url(${state.currentMedia.get()?.bannerImage})`,
								backgroundPosition: "center",
								backgroundSize: "cover",
								maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
							},
					  });
				return tray.div([banner, tray.div(container, { style: { position: "relative", height: "100%" } })], {
					style: { position: "relative", minHeight: "24.5rem" },
				});
			},

			[Tabs.General]() {
				const header = tray.flex(
					[
						tray.div([], {
							style: {
								width: "2.5rem",
								height: "2.5rem",
								backgroundImage: `url(${iconUrl})`,
								backgroundSize: "contain",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								flexGrow: "0",
								flexShrink: "0",
							},
						}),
						tray.stack(
							[
								tray.text("Notes", { style: { fontSize: "1.2em", fontWeight: "bold" } }),
								tray.text("Your thoughts, saved here!", { style: { fontSize: "0.8em", color: "#666" } }),
							],
							{
								style: {
									lineHeight: "1em",
									width: "100%",
								},
							}
						),
						tray.flex(
							[
								tray.button("\u200b", {
									intent: "gray-subtle",
									disabled: state.isSaving.get() || state.isDeleting.get(),
									loading: state.isFetching.get(),
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										// prettier-ignore
										backgroundImage: state.isFetching.get() ? "" : "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDNhNSA1IDAgMSAwIDQuNTQ2IDIuOTE0LjUuNSAwIDAgMSAuOTA4LS40MTdBNiA2IDAgMSAxIDggMnoiLz48cGF0aCBkPSJNOCA0LjQ2NlYuNTM0YS4yNS4yNSAwIDAgMSAuNDEtLjE5MmwyLjM2IDEuOTY2Yy4xMi4xLjEyLjI4NCAwIC4zODRMOC40MSA0LjY1OEEuMjUuMjUgMCAwIDEgOCA0LjQ2NiIvPjwvc3ZnPg==)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem 1rem",
										padding: "0",
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
												}, 2_000)
											);
									}),
								}),
								tray.button("\u200b", {
									intent: "gray-subtle",
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										// prettier-ignore
										backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOS40MDUgMS4wNWMtLjQxMy0xLjQtMi4zOTctMS40LTIuODEgMGwtLjEuMzRhMS40NjQgMS40NjQgMCAwIDEtMi4xMDUuODcybC0uMzEtLjE3Yy0xLjI4My0uNjk4LTIuNjg2LjcwNS0xLjk4NyAxLjk4N2wuMTY5LjMxMWMuNDQ2LjgyLjAyMyAxLjg0MS0uODcyIDIuMTA1bC0uMzQuMWMtMS40LjQxMy0xLjQgMi4zOTcgMCAyLjgxbC4zNC4xYTEuNDY0IDEuNDY0IDAgMCAxIC44NzIgMi4xMDVsLS4xNy4zMWMtLjY5OCAxLjI4My43MDUgMi42ODYgMS45ODcgMS45ODdsLjMxMS0uMTY5YTEuNDY0IDEuNDY0IDAgMCAxIDIuMTA1Ljg3MmwuMS4zNGMuNDEzIDEuNCAyLjM5NyAxLjQgMi44MSAwbC4xLS4zNGExLjQ2NCAxLjQ2NCAwIDAgMSAyLjEwNS0uODcybC4zMS4xN2MxLjI4My42OTggMi42ODYtLjcwNSAxLjk4Ny0xLjk4N2wtLjE2OS0uMzExYTEuNDY0IDEuNDY0IDAgMCAxIC44NzItMi4xMDVsLjM0LS4xYzEuNC0uNDEzIDEuNC0yLjM5NyAwLTIuODFsLS4zNC0uMWExLjQ2NCAxLjQ2NCAwIDAgMS0uODcyLTIuMTA1bC4xNy0uMzFjLjY5OC0xLjI4My0uNzA1LTIuNjg2LTEuOTg3LTEuOTg3bC0uMzExLjE2OWExLjQ2NCAxLjQ2NCAwIDAgMS0yLjEwNS0uODcyek04IDEwLjkzYTIuOTI5IDIuOTI5IDAgMSAxIDAtNS44NiAyLjkyOSAyLjkyOSAwIDAgMSAwIDUuODU4eiIvPjwvc3ZnPg==)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem 1rem",
									},
									onClick: ctx.eventHandler(`notes-settings`, () => {
										tabs.current.set(Tabs.Settings);
									}),
								}),
							],
							{
								style: {
									alignItems: "center",
								},
							}
						),
					],
					{
						gap: 3,
						style: {
							marginBottom: "1rem",
						},
					}
				);

				const entries = Object.values(notes.getAll())
					// Filter by search result
					.filter((a) => [a.mediaTitle, ...(a.synonyms || []), a.notes].join(" ").toLowerCase().includes(state.searchQuery.get().toLowerCase()))
					// Filter adult if enabled
					.filter((a) => (settings.preference.hideAdult.current ? !a.isAdult : true))
					// Filter by type
					.filter((a) => state.listMediaType.get() === "All" || state.listMediaType.get().toLowerCase() === a.type?.toLowerCase())
					.sort((A, B) => (A.mediaTitle ?? "").localeCompare(B.mediaTitle ?? ""))
					.map((entry) =>
						tray.div(
							[
								tray.div([], {
									className: "notes-tab-general-entry-card-background",
									style: {
										position: "absolute",
										top: "0",
										left: "0",
										width: "100%",
										height: "100%",
										backgroundColor: settings.appearance.hideBannerOnList.current ? "rgb(var(--color-gray-900))" : "",
										backgroundImage: settings.appearance.hideBannerOnList.current ? "" : `url(${entry.bannerImage ?? entry.coverImage})`,
										backgroundPosition: "center",
										backgroundSize: "cover",
										maskImage: settings.appearance.hideBannerOnList.current ? "" : "linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 100%)",
										pointerEvents: "none",
										borderRadius: "0.5rem",
									},
								}),
								tray.flex(
									[
										tray.stack(
											[
												tray.text(String(entry.mediaTitle ?? ""), {
													style: {
														color: "#fff",
														fontWeight: "bold",
														wordBreak: "break-word",
														overflow: "hidden",
														textOverflow: "ellipsis",
														display: "-webkit-box",
														"-webkit-line-clamp": "2",
														"-webkit-box-orient": "vertical",
													},
												}),
												tray.text(String(entry.notes), {
													style: {
														color: "#ccc",
														fontSize: "0.8rem",
														fontWeight: "bold",
														wordBreak: "break-word",
														overflow: "hidden",
														textOverflow: "ellipsis",
														display: "-webkit-box",
														"-webkit-line-clamp": "3",
														"-webkit-box-orient": "vertical",
													},
												}),
											],
											{
												style: {
													lineHeight: "1rem",
													width: "100%",
													textShadow: "0 0 4px black",
													pointerEvents: "none",
												},
											}
										),
										tray.button("\u200b", {
											onClick: ctx.eventHandler(`navigate-to:${entry.mediaId}`, () => {
												const path = String(entry.type) === "ANIME" ? "/entry" : "/manga/entry";
												ctx.screen.navigateTo(path, { id: entry.mediaId.toString() });
												tray.close();
											}),
											style: {
												width: "calc(100% + 1rem)",
												height: "calc(100% + 1rem)",
												position: "absolute",
												marginTop: "-1rem",
												marginLeft: "-1rem",
												zIndex: "1",
												background: "none",
											},
										}),
										tray.stack(
											[
												tray.button("\u200b", {
													// intent: "gray-subtle",
													disabled: state.isFetching.get() || state.isDeleting.get() || state.isSaving.get(),
													style: {
														width: "2.4rem",
														height: "2.4rem",
														borderRadius: "50%",
														// prettier-ignore
														backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTUuNTAyIDEuOTRhLjUuNSAwIDAgMSAwIC43MDZMMTQuNDU5IDMuNjlsLTItMkwxMy41MDIuNjQ2YS41LjUgMCAwIDEgLjcwNyAwbDEuMjkzIDEuMjkzem0tMS43NSAyLjQ1Ni0yLTJMNC45MzkgOS4yMWEuNS41IDAgMCAwLS4xMjEuMTk2bC0uODA1IDIuNDE0YS4yNS4yNSAwIDAgMCAuMzE2LjMxNmwyLjQxNC0uODA1YS41LjUgMCAwIDAgLjE5Ni0uMTJsNi44MTMtNi44MTR6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMSAxMy41QTEuNSAxLjUgMCAwIDAgMi41IDE1aDExYTEuNSAxLjUgMCAwIDAgMS41LTEuNXYtNmEuNS41IDAgMCAwLTEgMHY2YS41LjUgMCAwIDEtLjUuNWgtMTFhLjUuNSAwIDAgMS0uNS0uNXYtMTFhLjUuNSAwIDAgMSAuNS0uNUg5YS41LjUgMCAwIDAgMC0xSDIuNUExLjUgMS41IDAgMCAwIDEgMi41eiIvPjwvc3ZnPg==)",
														backgroundRepeat: "no-repeat",
														backgroundPosition: "center",
														backgroundSize: "1rem 1rem",
													},
													onClick: ctx.eventHandler(`edit-note:${entry.mediaId}`, () => {
														state.isEditInvokedFromTray.set(true);
														state.currentMedia.set(entry);
														fieldRefs.textArea.setValue(entry.notes);
														tabs.current.set(Tabs.Editor);
													}),
												}),
												tray.button("\u200b", {
													intent: "alert",
													disabled: state.isFetching.get() || state.isDeleting.get() || state.isSaving.get(),
													style: {
														width: "2.4rem",
														height: "2.4rem",
														borderRadius: "50%",
														// prettier-ignore
														backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTEgMS41djFoMy41YS41LjUgMCAwIDEgMCAxaC0uNTM4bC0uODUzIDEwLjY2QTIgMiAwIDAgMSAxMS4xMTUgMTZoLTYuMjNhMiAyIDAgMCAxLTEuOTk0LTEuODRMMi4wMzggMy41SDEuNWEuNS41IDAgMCAxIDAtMUg1di0xQTEuNSAxLjUgMCAwIDEgNi41IDBoM0ExLjUgMS41IDAgMCAxIDExIDEuNW0tNSAwdjFoNHYtMWEuNS41IDAgMCAwLS41LS41aC0zYS41LjUgMCAwIDAtLjUuNU00LjUgNS4wMjlsLjUgOC41YS41LjUgMCAxIDAgLjk5OC0uMDZsLS41LTguNWEuNS41IDAgMSAwLS45OTguMDZtNi41My0uNTI4YS41LjUgMCAwIDAtLjUyOC40N2wtLjUgOC41YS41LjUgMCAwIDAgLjk5OC4wNThsLjUtOC41YS41LjUgMCAwIDAtLjQ3LS41MjhNOCA0LjVhLjUuNSAwIDAgMC0uNS41djguNWEuNS41IDAgMCAwIDEgMFY1YS41LjUgMCAwIDAtLjUtLjUiLz48L3N2Zz4=)",
														backgroundRepeat: "no-repeat",
														backgroundPosition: "center",
														backgroundSize: "1rem 1rem",
													},
													onClick: ctx.eventHandler(`delete-note:${entry.mediaId}`, () => {
														state.isDeleting.set(true);
														notes
															.save(entry.mediaId, { ...entry, notes: "" })
															.then(() => ctx.setTimeout(() => ctx.toast.success(`Deleted notes for ${entry.mediaTitle}!`), 2_500))
															.catch((err) => ctx.toast.error(`An error occured while deleting your note: ${err.message}`))
															.finally(() => ctx.setTimeout(() => state.isDeleting.set(false), 2_500));
													}),
												}),
											],
											{
												style: {
													zIndex: "2",
												},
											}
										),
									],
									{
										style: {
											position: "relative",
											padding: "0.5rem",
										},
									}
								),
							],
							{
								className: "note-tab-general-container",
								style: {
									position: "relative",
									padding: "0.5rem",
									borderRadius: "0.5rem",
									border: "1px solid var(--border)",
								},
							}
						)
					);

				const body = tray.stack(
					[
						tray.flex(
							[
								tray.div([], {
									style: {
										width: "2.5rem",
										backgroundColor: "rgb(var(--color-gray-800))",
										backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNNi41IDEzYTYuNDcgNi40NyAwIDAgMCAzLjg0NS0xLjI1OGgtLjAwMXEuMDQ0LjA2LjA5OC4xMTVsMy44NSAzLjg1YTEgMSAwIDAgMCAxLjQxNS0xLjQxNGwtMy44NS0zLjg1YTEgMSAwIDAgMC0uMTE1LS4xQTYuNDcgNi40NyAwIDAgMCAxMyA2LjUgNi41IDYuNSAwIDAgMCA2LjUgMGE2LjUgNi41IDAgMSAwIDAgMTNtMC04LjUxOGMxLjY2NC0xLjY3MyA1LjgyNSAxLjI1NCAwIDUuMDE4LTUuODI1LTMuNzY0LTEuNjY0LTYuNjkgMC01LjAxOCIvPjwvc3ZnPg==)`,
										backgroundSize: "50%",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										flexGrow: "0",
										flexShrink: "0",
										borderRadius: "0.5rem 0 0 0.5rem",
									},
								}),
								tray.input({
									placeholder: "Search notes...",
									value: state.searchQuery.get(),
									style: {
										borderRadius: "0",
										marginLeft: "-1px",
									},
									onChange: ctx.eventHandler("search-notes", (e) => {
										state.searchQuery.set(String(e.value));
									}),
								}),
								tray.button(state.listMediaType.get(), {
									style: {
										height: "initial",
										width: "8rem",
										borderRadius: "0 0.5rem 0.5rem 0",
										marginLeft: "-1px",
										// prettier-ignore
										backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNNiAxMC41YS41LjUgMCAwIDEgLjUtLjVoM2EuNS41IDAgMCAxIDAgMWgtM2EuNS41IDAgMCAxLS41LS41bS0yLTNhLjUuNSAwIDAgMSAuNS0uNWg3YS41LjUgMCAwIDEgMCAxaC03YS41LjUgMCAwIDEtLjUtLjVtLTItM2EuNS41IDAgMCAxIC41LS41aDExYS41LjUgMCAwIDEgMCAxaC0xMWEuNS41IDAgMCAxLS41LS41Ii8+PC9zdmc+)",
										backgroundPosition: "calc(100% - 0.5rem) center",
										backgroundSize: "25%",
										backgroundRepeat: "no-repeat",
										paddingRight: "2.5rem",
										paddingLeft: "0.5rem",
									},
									onClick: ctx.eventHandler("mediatype-filter", function () {
										const mediaType = state.listMediaType.get();
										state.listMediaType.set(({ All: "Anime", Anime: "Manga", Manga: "All" } as const)[mediaType]);
									}),
								}),
							],
							{ gap: 0 }
						),
						tray.stack(
							entries.length
								? entries
								: [
										tray.stack(
											[
												tray.text("Nothing here yet", {
													style: {
														color: "#777",
														fontSize: "1.5rem",
													},
												}),
												tray.text(kaomojis[Math.floor(Math.random() * kaomojis.length)], {
													style: {
														color: "#777",
														fontSize: "1.2rem",
													},
												}),
											],
											{ style: { width: "100%", height: "100%", textAlign: "center", justifyContent: "center" } }
										),
								  ],
							{
								style: {
									height: "25rem",
									overflowY: "scroll",
									overflowX: "hidden",
								},
							}
						),
					],
					{}
				);

				return tray.stack([header, body], { style: { padding: "0.5rem" } });
			},

			[Tabs.Editor]() {
				const header = tray.flex(
					[
						tray.stack(
							[
								tray.text(`${fieldRefs.textArea.current.toString().length ? "Edit" : "Add"} Notes`, {
									style: { fontSize: "1.5em", fontWeight: "bold", color: "#fff" },
								}),
								tray.text(`${state.currentMedia.get()?.mediaTitle}`, {
									style: {
										fontSize: "1rem",
										color: "#fff",
										wordBreak: "break-word",
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "-webkit-box",
										"-webkit-line-clamp": "2",
										"-webkit-box-orient": "vertical",
									},
								}),
							],
							{
								style: {
									lineHeight: "1em",
									width: "100%",
									textShadow: "0 0 10px black",
								},
							}
						),
						tray.flex(
							state.isEditInvokedFromTray.get()
								? [
										tray.button("\u200b", {
											intent: "gray-subtle",
											style: {
												width: "2.5rem",
												height: "2.5rem",
												borderRadius: "50%",
												// prettier-ignore
												backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSA4YS41LjUgMCAwIDAtLjUtLjVIMi43MDdsMy4xNDctMy4xNDZhLjUuNSAwIDEgMC0uNzA4LS43MDhsLTQgNGEuNS41IDAgMCAwIDAgLjcwOGw0IDRhLjUuNSAwIDAgMCAuNzA4LS43MDhMMi43MDcgOC41SDE0LjVBLjUuNSAwIDAgMCAxNSA4Ii8+PC9zdmc+)",
												backgroundRepeat: "no-repeat",
												backgroundPosition: "center",
												backgroundSize: "1rem 1rem",
											},
											onClick: ctx.eventHandler(`notes-goback`, () => {
												tabs.current.set(Tabs.General);
											}),
										}),
								  ]
								: [],
							{
								style: {
									alignItems: "center",
								},
							}
						),
					],
					{
						style: {
							paddingTop: "0.75rem",
						},
					}
				);

				const body = tray.stack(
					[
						tray.input({
							textarea: true,
							fieldRef: fieldRefs.textArea,
							style: {
								height: "12rem",
								backgroundColor: "rgb(var(--color-gray-900))",
							},
						}),
						tray.text("Adding a note to a non-existent entry will always create a Planning entry.", {
							style: {
								color: "orange",
								fontSize: "0.7rem",
								wordBreak: "no-break",
							},
						}),
						tray.button({
							label: state.isSaving.get() ? "Saving" : "Save",
							loading: state.isSaving.get(),
							disabled: state.isDeleting.get() || state.isFetching.get(),
							size: "md",
							intent: "success",
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
								notes
									.save(state.currentMedia.get()?.mediaId!, {
										...currentMedia,
										notes: fieldRefs.textArea.current,
									})
									.then(() => ctx.toast.success(`Successfully saved notes!`))
									.catch((e) => ctx.toast.error(`Error saving notes: ${e.message}`))
									.finally(() => state.isSaving.set(false));
							}),
						}),
					],
					{}
				);

				return this.withBanner([tray.stack([header, body], { style: { padding: "0.5rem", height: "24.5rem", justifyContent: "space-between" } })]);
			},

			[Tabs.Settings]() {
				const stackStyles = {
					padding: "1rem",
					borderRadius: "0.5rem",
					border: "1px solid var(--border)",
					backgroundColor: "rgb(var(--color-gray-900))",
				};

				const header = tray.flex(
					[
						tray.div([], {
							style: {
								width: "2.5rem",
								height: "2.5rem",
								backgroundImage: `url(${iconUrl})`,
								backgroundSize: "contain",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								flexGrow: "0",
								flexShrink: "0",
							},
						}),
						tray.stack(
							[
								tray.text("Notes Settings", { style: { fontSize: "1.2em", fontWeight: "bold" } }),
								tray.text("Manage your preferences", { style: { fontSize: "0.8em", color: "#666" } }),
							],
							{
								style: {
									lineHeight: "1em",
									width: "100%",
								},
							}
						),
						tray.flex(
							[
								[
									tray.button("\u200b", {
										intent: "gray-subtle",
										style: {
											width: "2.5rem",
											height: "2.5rem",
											borderRadius: "50%",
											// prettier-ignore
											backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSA4YS41LjUgMCAwIDAtLjUtLjVIMi43MDdsMy4xNDctMy4xNDZhLjUuNSAwIDEgMC0uNzA4LS43MDhsLTQgNGEuNS41IDAgMCAwIDAgLjcwOGw0IDRhLjUuNSAwIDAgMCAuNzA4LS43MDhMMi43MDcgOC41SDE0LjVBLjUuNSAwIDAgMCAxNSA4Ii8+PC9zdmc+)",
											backgroundRepeat: "no-repeat",
											backgroundPosition: "center",
											backgroundSize: "1rem 1rem",
										},
										onClick: ctx.eventHandler(`notes-goback`, () => {
											tabs.current.set(Tabs.General);
										}),
									}),
								],
							],
							{
								style: {
									alignItems: "center",
								},
							}
						),
					],
					{
						gap: 3,
						style: {
							marginBottom: "1rem",
						},
					}
				);

				const malVerifier = tray.stack(
					!providers.mal.authorized.get()
						? [
								tray.text("Please authorize this application first", { style: { fontSize: "0.8rem", color: "var(--red-300)", lineHeight: "normal" } }),
								tray.input({
									placeholder: "Paste authorization code here",
									fieldRef: fieldRefs.malAuthCode,
								}),
								tray.flex(
									[
										tray.anchor("Authorize", {
											href: providers.mal.generateAuthUrl(),
											target: "_blank",
											className:
												"UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--brand] border bg-brand-50 border-transparent hover:bg-brand-100 active:bg-brand-200 dark:bg-opacity-10 dark:hover:bg-opacity-20 text-sm h-10 px-4 no-underline",
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
									{ gap: 0 }
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
					}
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
										onClick: ctx.eventHandler("mal:signed-out", () => {
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
					}
				);

				const body = tray.stack(
					[
						// General
						tray.stack(
							[
								tray.text("General", { style: { fontSize: "1.5rem", fontWeight: "bold" } }),
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
									{
										gap: 0,
										style: {
											paddingTop: "0.5rem",
											borderTop: "1px solid var(--border)",
										},
									}
								),
							],
							{ style: stackStyles, gap: 2 }
						),
						// Preferences
						tray.stack(
							[
								tray.text("Preferences", { style: { fontSize: "1.5rem", fontWeight: "bold" } }),
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
									{
										gap: 0,
										style: {
											paddingTop: "0.5rem",
											borderTop: "1px solid var(--border)",
										},
									}
								),
							],
							{ style: stackStyles, gap: 2 }
						),
						// // Appearance
						tray.stack(
							[
								tray.text("Appearance", { style: { fontSize: "1.5rem", fontWeight: "bold" } }),
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
									],
									{
										gap: 0,
										style: {
											paddingTop: "0.5rem",
											borderTop: "1px solid var(--border)",
										},
									}
								),
							],
							{ style: stackStyles, gap: 2 }
						),
						// MyAnimeList
						tray.stack(
							[
								tray.div([], {
									style: {
										height: "1.75rem",
										pointerEvents: "none",
										background: `url(https://nnotwen.github.io/n-seanime-extensions/plugins/MyAnimeListSync/logo.png)`,
										backgroundPosition: "left center",
										backgroundSize: "contain",
										backgroundRepeat: "no-repeat",
									},
								}),
								tray.switch("Update my notes to MAL when I save them.", {
									fieldRef: fieldRefs.syncToMAL,
									disabled: !providers.mal.authorized.get(),
									onChange: ctx.eventHandler("notes:mal-sync", (v) => {
										$storage.set(Keys.Settings.SyncToMAL, v.value);
										fieldRefs.syncToMAL.setValue(v.value);
										tray.update();
									}),
								}),
								malVerifier,
							],
							{
								gap: 0,
								style: stackStyles,
							}
						),
						// Kitsu
						tray.stack(
							[
								tray.div([], {
									style: {
										height: "1.75rem",
										pointerEvents: "none",
										background: `url(https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/KitsuSync/brand-logo.png)`,
										backgroundPosition: "left center",
										backgroundSize: "contain",
										backgroundRepeat: "no-repeat",
									},
								}),
								tray.switch("Update my notes to Kitsu when I save them.", {
									fieldRef: fieldRefs.syncToKitsu,
									disabled: !providers.kitsu.authorized.get(),
									onChange: ctx.eventHandler("notes:kitsu-sync", (v) => {
										$storage.set(Keys.Settings.SyncToKitsu, v.value);
										fieldRefs.syncToKitsu.setValue(v.value);
										tray.update();
									}),
								}),
								kitsuVerifier,
							],
							{
								gap: 0,
								style: stackStyles,
							}
						),
					],
					{
						gap: 4,
						style: {
							overflowY: "scroll",
							maxHeight: "28rem",
							paddingRight: "0.2rem",
						},
					}
				);

				return tray.stack([header, body], { style: { padding: "0.5rem", minHeight: "24.5rem" } });
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

				const header = tray.flex(
					[
						tray.stack(
							[
								tray.text(`${fieldRefs.textArea.current.toString().length ? "Edit" : "Add"} Notes`, {
									style: { fontSize: "1.5em", fontWeight: "bold", color: "#fff" },
								}),
								tray.text(`${state.currentMedia.get()?.mediaTitle}`, {
									style: {
										fontSize: "1rem",
										color: "#fff",
										wordBreak: "break-word",
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "-webkit-box",
										"-webkit-line-clamp": "2",
										"-webkit-box-orient": "vertical",
									},
								}),
							],
							{
								style: {
									lineHeight: "1em",
									width: "100%",
									textShadow: "0 0 10px black",
								},
							}
						),
						tray.flex(
							[
								tray.button("\u200b", {
									intent: "gray-subtle",
									style: {
										width: "2.5rem",
										height: "2.5rem",
										borderRadius: "50%",
										// prettier-ignore
										backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSA4YS41LjUgMCAwIDAtLjUtLjVIMi43MDdsMy4xNDctMy4xNDZhLjUuNSAwIDEgMC0uNzA4LS43MDhsLTQgNGEuNS41IDAgMCAwIDAgLjcwOGw0IDRhLjUuNSAwIDAgMCAuNzA4LS43MDhMMi43MDcgOC41SDE0LjVBLjUuNSAwIDAgMCAxNSA4Ii8+PC9zdmc+)",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										backgroundSize: "1rem 1rem",
									},
									onClick: ctx.eventHandler(`notes-goback`, () => {
										tabs.current.set(Tabs.General);
									}),
								}),
							],
							{
								style: {
									alignItems: "center",
								},
							}
						),
					],
					{
						style: {
							paddingTop: "0.75rem",
						},
					}
				);

				const body = tray.stack(
					[
						tray.flex(
							[
								tray.div([], {
									style: {
										height: "8rem",
										width: "8rem",
										background: `url(https://nnotwen.github.io/n-seanime-extensions/plugins/Notes/bruh.png)`,
										backgroundPosition: "left center",
										backgroundSize: "contain",
										backgroundRepeat: "no-repeat",
									},
								}),
							],
							{
								style: {
									justifyContent: "center",
								},
							}
						),
						tray.text(reason[reasonKey], {
							style: {
								wordBreak: "normal",
								textAlign: "center",
								width: "100%",
								padding: "1rem",
								color: "var(--red-300)",
								backgroundColor: "rgb(from var(--red-700) r g b / 0.3)",
								border: "1px solid var(--red-700)",
								borderRadius: "1rem",
								position: "relative",
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
					{ gap: 5 }
				);

				return this.withBanner([tray.stack([header, body], { style: { padding: "0.5rem", justifyContent: "space-between" } })]);
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

		function onEditBtnClicked({ media }: { media: $app.AL_BaseAnime | $app.AL_BaseManga }) {
			const mediaId = media.id;
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
		const btnstyle = {
			backgroundImage: `url(${noteIcn})`,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "calc(0% + 0.5rem) center",
			backgroundSize: "1.5rem",
			paddingInlineStart: "2.3rem",
		};
		const animeBtn = ctx.action.newAnimePageButton({
			label: "Add Note",
			intent: "gray-subtle",
			style: btnstyle,
		});
		const mangaBtn = ctx.action.newMangaPageButton({
			label: "Add Note",
			intent: "gray-subtle",
			style: btnstyle,
		});
		animeBtn.mount();
		mangaBtn.mount();
		animeBtn.onClick(onEditBtnClicked);
		mangaBtn.onClick(onEditBtnClicked);

		ctx.dom.onReady(async () => {
			const style = await ctx.dom.createElement("style");
			style.setText(
				".notes-tab-general-entry-card-background { transition: filter ease-in-out 0.2s; filter: blur(0px)  } .note-tab-general-container:hover .notes-tab-general-entry-card-background { mask-image: linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)!important; filter: blur(2px) }"
			);
		});

		ctx.screen.onNavigate((e) => {
			// Anime
			if (e.pathname === "/entry") {
				const mediaId = Number(e.searchParams.id);
				const note = notes.get(mediaId);
				animeBtn.setLabel(!!note ? "Edit Note" : "Add Note");
			}

			if (e.pathname === "/manga/entry") {
				const mediaId = Number(e.searchParams.id);
				const note = notes.get(mediaId);
				mangaBtn.setLabel(!!note ? "Edit Note" : "Add Note");
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
	});
}
