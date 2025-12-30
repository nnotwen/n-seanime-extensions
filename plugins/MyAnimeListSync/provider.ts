/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./myanimelistsync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/MyAnimeListSync/icon.png";
		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
			width: "fit-content",
		});

		enum Tab {
			logon = "1",
			landing = "2",
			logs = "3",
			manageList = "4",
			manageListDanger = "5",
		}

		enum ManageListJobType {
			Import = "import",
			Export = "export",
		}

		enum ManageListSyncType {
			Patch = "patch",
			Post = "post",
			FullSync = "fullsync",
		}

		enum ConnectionState {
			Disconnected = "Disconnected",
			Connected = "Connected",
		}

		const manageListJobTypeDesc: Record<ManageListJobType, string> = {
			import: "Bring your AniList library into MAL to sync progress.",
			export: "Update AniList with your current MAL entries.",
		};

		const manageListSyncTypeDesc: Record<ManageListSyncType, string> = {
			patch: "Import only items not already in your list. Existing entries remain unchanged.",
			post: "Replace data for items found in both trackers. Items missing in either list are ignored.",
			fullsync: "Make both trackers identical. Shared entries are updated, and items missing in one are deleted.",
		};

		const fieldRefs = {
			authCode: ctx.fieldRef<string>(""),
			disableSyncing: ctx.fieldRef<boolean>($storage.get("mal:options-disableSync")?.valueOf() ?? false),
			manageListJobtype: ctx.fieldRef<ManageListJobType>(ManageListJobType.Import),
			manageListMediaType: ctx.fieldRef<"Anime" | "Manga">("Anime"),
			manageListSyncType: ctx.fieldRef<ManageListSyncType>(ManageListSyncType.Patch),
			deletePrivateEntries: ctx.fieldRef<boolean>(false),
		};

		const state = {
			loggingIn: ctx.state<boolean>(false),
			loginError: ctx.state<string | null>(null),
			loginLabel: ctx.state<string>("Login"),
			loggingOut: ctx.state<boolean>(false),
			manageListJobTypeDesc: ctx.state<string>(manageListJobTypeDesc[fieldRefs.manageListJobtype.current]),
			manageListSyncTypeDesc: ctx.state<string>(manageListSyncTypeDesc[fieldRefs.manageListSyncType.current]),
			syncing: ctx.state<boolean>(false),
			cancellingSync: ctx.state<boolean>(false),
			syncDetail: ctx.state<string>("Waiting..."),
		};

		const syncProgress = {
			current: ctx.state<number>(0),
			total: ctx.state<number>(0),
			percent() {
				const total = this.total.get();
				return total > 0 ? this.current.get() / total : 0;
			},
			refresh(max: number) {
				this.total.set(max);
				this.current.set(0);
			},
			tick() {
				this.current.set(this.current.get() + 1);
			},
		};

		const log = {
			id: "mal:c6d44b38-f7b6-4785-92fd-a30a8fef71b3",
			record(message: [string, "Info" | "Warning" | "Error" | "Log" | "Success"]) {
				$store.set(this.id, [...($store.get(this.id) ?? []), message]);
			},

			getEntries(): [string, "Info" | "Warning" | "Error" | "Log" | "Success"][] {
				return $store.get(this.id) ?? [];
			},

			clearEntries() {
				$store.set(this.id, []);
				this.sendInfo("Log cleared!");
			},

			dateFormat() {
				return new Date().toISOString().slice(0, 19);
			},

			sendError(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Error"]);
				console.error(`[MALSync:Error] ${message}`);
			},

			sendInfo(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Info"]);
				console.info(`[MALSync:Info] ${message}`);
			},

			sendWarning(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Warning"]);
				console.warn(`[MALSync:Warning] ${message}`);
			},

			sendSuccess(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Success"]);
				console.log(`[MALSync:Success] ${message}`);
			},

			send(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Log"]);
				console.log(`[MALSync:Log] ${message}`);
			},
		};

		const PKCE = {
			base64urlEncode(bytes: Uint8Array): string {
				// Directly base64-encode the raw bytes; do NOT pass through a string
				return Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
			},

			generateCodeVerifier(): string {
				const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
				let result = "";
				for (let i = 0; i < 86; i++) {
					result += charset.charAt(Math.floor(Math.random() * charset.length));
				}
				return result;
			},

			sha256(message: string): Uint8Array {
				const data = new Uint8Array(message.length);
				for (let i = 0; i < message.length; i++) data[i] = message.charCodeAt(i);

				const K = [
					0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
					0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
					0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
					0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
					0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
					0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
				];
				function rotr(x: number, n: number) {
					return (x >>> n) | (x << (32 - n));
				}

				const bitLen = data.length * 8;
				const withOne = new Uint8Array(((data.length + 9 + 63) >> 6) << 6);
				withOne.set(data);
				withOne[data.length] = 0x80;
				const dv = new DataView(withOne.buffer);
				const hi = Math.floor(bitLen / 0x100000000);
				const lo = bitLen >>> 0;
				dv.setUint32(withOne.length - 8, hi, false);
				dv.setUint32(withOne.length - 4, lo, false);

				let H0 = 0x6a09e667,
					H1 = 0xbb67ae85,
					H2 = 0x3c6ef372,
					H3 = 0xa54ff53a,
					H4 = 0x510e527f,
					H5 = 0x9b05688c,
					H6 = 0x1f83d9ab,
					H7 = 0x5be0cd19;

				const W = new Uint32Array(64);
				for (let i = 0; i < withOne.length; i += 64) {
					for (let t = 0; t < 16; t++) W[t] = dv.getUint32(i + t * 4, false);
					for (let t = 16; t < 64; t++) {
						const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
						const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
						W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
					}
					let a = H0,
						b = H1,
						c = H2,
						d = H3,
						e = H4,
						f = H5,
						g = H6,
						h = H7;
					for (let t = 0; t < 64; t++) {
						const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
						const ch = (e & f) ^ (~e & g);
						const temp1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
						const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
						const maj = (a & b) ^ (a & c) ^ (b & c);
						const temp2 = (S0 + maj) >>> 0;
						h = g;
						g = f;
						f = e;
						e = (d + temp1) >>> 0;
						d = c;
						c = b;
						b = a;
						a = (temp1 + temp2) >>> 0;
					}
					H0 = (H0 + a) >>> 0;
					H1 = (H1 + b) >>> 0;
					H2 = (H2 + c) >>> 0;
					H3 = (H3 + d) >>> 0;
					H4 = (H4 + e) >>> 0;
					H5 = (H5 + f) >>> 0;
					H6 = (H6 + g) >>> 0;
					H7 = (H7 + h) >>> 0;
				}

				const out = new Uint8Array(32);
				const H = [H0, H1, H2, H3, H4, H5, H6, H7];
				for (let i = 0; i < 8; i++) {
					out[i * 4] = H[i] >>> 24;
					out[i * 4 + 1] = (H[i] >>> 16) & 0xff;
					out[i * 4 + 2] = (H[i] >>> 8) & 0xff;
					out[i * 4 + 3] = H[i] & 0xff;
				}
				return out;
			},

			generatePair(): { verifier: string; challenge: string } {
				const verifier = this.generateCodeVerifier();
				const hashBytes = this.sha256(verifier);
				const challenge = this.base64urlEncode(hashBytes);
				return { verifier, challenge };
			},
		};

		const application = {
			clientId: "204cc9247a57a5750a93787a6fbef485",
			userAgent: "MyAnimeList for Seanime",
			redirectUri: "https://nnotwen.github.io/n-seanime-extensions/plugins/MyAnimeListSync/callback.html",
			baseUri: "https://api.myanimelist.net/v2/",
			currentAuthUrl: ctx.state<string | null>(null),
			token: {
				accessToken: ctx.state<string | null>($storage.get("mal.accessToken") ?? null),
				refreshToken: ctx.state<string | null>($storage.get("mal.refreshToken") ?? null),
				expiresAt: ctx.state<number | null>($storage.get("mal.expiresAt") ?? null),
				tokenType: ctx.state<string | null>($storage.get("mal.tokenType") ?? null),
				set(data: $malsync.RequestAccessTokenResponse | null) {
					const expiresAt = data ? Date.now() + data.expires_in * 1000 : null;

					$storage.set("mal.accessToken", data?.access_token ?? null);
					$storage.set("mal.refreshToken", data?.refresh_token ?? null);
					$storage.set("mal.expiresAt", expiresAt);
					$storage.set("mal.tokenType", data?.token_type ?? null);

					this.accessToken.set(data?.access_token ?? null);
					this.refreshToken.set(data?.refresh_token ?? null);
					this.expiresAt.set(expiresAt);
					this.tokenType.set(data?.token_type ?? null);
				},

				getAccessToken() {
					const token = this.accessToken.get();
					const expiry = this.expiresAt.get();
					if (!token || !expiry) return null;
					if (Date.now() > expiry) return null;
					return token;
				},

				generateAuthUrl() {
					const { verifier, challenge } = PKCE.generatePair();
					$store.set("mal:auth.verifier", challenge);

					const url = new URL("https://myanimelist.net/v1/oauth2/authorize");
					url.searchParams.set("response_type", "code");
					url.searchParams.set("client_id", application.clientId);
					url.searchParams.set("redirect_uri", application.redirectUri);
					url.searchParams.set("code_challenge", challenge);
					url.searchParams.set("code_challenge_method", "plain"); // MAL does not support S256
					application.currentAuthUrl.set(url.toString());
				},

				async exchangeCode(code: string) {
					const codeVerifier = $store.get("mal:auth.verifier");
					if (!codeVerifier) throw new Error("No verifier was set!");

					const res = await ctx.fetch("https://myanimelist.net/v1/oauth2/token", {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							code,
							client_id: application.clientId,
							redirect_uri: application.redirectUri,
							grant_type: "authorization_code",
							code_verifier: codeVerifier,
						} satisfies $malsync.RequestAccessTokenBody),
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

					$store.set("mal:auth.verifier", undefined);
					application.currentAuthUrl.set(null);

					const data: $malsync.RequestAccessTokenResponse = await res.json();
					this.set(data);
					return data;
				},

				async refresh() {
					if (!this.refreshToken.get()) throw new Error("No refresh token available");

					const res = await ctx.fetch("https://myanimelist.net/v1/oauth2/token", {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							refresh_token: this.refreshToken.get()!,
							client_id: application.clientId,
							grant_type: "refresh_token",
						} satisfies $malsync.RefreshAccessTokenBody),
					});

					if (!res.ok) {
						this.set(null);
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					const data: $malsync.RequestAccessTokenResponse = await res.json();
					this.set(data);
				},
			},

			userInfo: {
				id: ctx.state<number | null>(null),
				name: ctx.state<string | null>(null),
				picture: ctx.state<string | null>(null),
				isSupporter: ctx.state<boolean | null>(null),
				connectionState: ctx.state<ConnectionState>(ConnectionState.Disconnected),
				// prettier-ignore
				defaultAvatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGQ9Ik0xMSA2YTMgMyAwIDEgMS02IDAgMyAzIDAgMCAxIDYgMCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTAgOGE4IDggMCAxIDEgMTYgMEE4IDggMCAwIDEgMCA4bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxIi8+PC9zdmc+",
				async fetch() {
					const res = await application.fetch("users/@me?fields=is_supporter", { method: "GET" });
					if (!res.ok) {
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					const data: $malsync.User = await res.json();
					this.id.set(data.id);
					this.name.set(data.name);
					this.picture.set(data.picture ?? this.defaultAvatar);
					this.isSupporter.set(data.is_supporter ?? null);
					this.connectionState.set(ConnectionState.Connected);

					return data;
				},

				reset() {
					this.id.set(null);
					this.name.set(null);
					this.picture.set(null);
					this.isSupporter.set(null);
					this.connectionState.set(ConnectionState.Disconnected);
				},
			},

			list: {
				async patch<T extends "Anime" | "Manga">(
					type: T,
					malId: number,
					body: T extends "Anime" ? $malsync.ListUpdateAnimeBody : $malsync.ListUpdateMangaBody
				) {
					const normalized = type.toLowerCase() as "anime" | "manga";

					const res = await application.fetch(`${normalized}/${malId}/my_list_status`, {
						method: "PATCH",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)])),
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

					return res.json() as T extends "Anime" ? $malsync.AnimeListEntry : $malsync.MangaListEntry;
				},

				async delete(type: "Anime" | "Manga", malId: number): Promise<boolean> {
					const normalized = type.toLowerCase() as "anime" | "manga";

					const res = await application.fetch(`${normalized}/${malId}/my_list_status`, {
						method: "DELETE",
					});

					if (res.ok) return true;
					if (res.status === 404) return false;

					let err = null;
					try {
						err = res.json();
					} catch {
						err = null;
					}
					throw new Error(err?.message || err?.error || res.statusText);
				},

				async fetchAll<T extends "Anime" | "Manga">(
					type: T
				): Promise<Array<(T extends "Anime" ? $malsync.AnimeListEntryWrapper : $malsync.MangaListEntryWrapper) & { idMal: number }>> {
					let path: string | null = `users/@me/${type.toLowerCase()}list?fields=list_status{comments,num_times_rewatched,num_times_reread}&limit=1000`;
					const all = [];

					while (path) {
						const res = await application.fetch(path, { method: "GET" });
						if (!res.ok) throw new Error(`Request failed with status ${res.statusText}`);

						const json: {
							data?: $malsync.AllListEntry[] | null;
							paging?: { next?: string };
						} | null = res.json();

						if (!json || !json.data) throw new Error("Invalid MAL response: missing data");

						all.push(...json.data.map((e) => ({ idMal: e.node.id, ...e })));
						path = json.paging?.next?.replace(application.baseUri, "") ?? null;
						await $_wait(2000);
					}

					return all as any;
				},
			},

			async withAuthHeaders(): Promise<Record<string, string>> {
				if (!this.token.getAccessToken()) {
					await this.token.refresh();
				}
				return {
					Authorization: `${this.token.tokenType.get()} ${this.token.accessToken.get()}`,
					"Content-Type": "application/json",
				};
			},

			async fetch(path: string, init: RequestInit = {}) {
				const res = await ctx.fetch(this.baseUri + path.replace(/^\/+/, ""), {
					...init,
					headers: {
						...(await this.withAuthHeaders()),
						...(init.headers as Record<string, string>),
					},
				});

				return res;
			},
		};

		const tabs = {
			current: ctx.state<Tab>(Tab.logon),
			config: {
				logo: "https://nnotwen.github.io/n-seanime-extensions/plugins/MyAnimeListSync/logo.png",
				width: "25rem",
				height: "30rem",
			},

			logo() {
				return tray.flex(
					[
						tray.div([], {
							style: {
								width: "100%",
								height: "2.5em",
								backgroundImage: `url(${this.config.logo})`,
								backgroundSize: "contain",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								flexGrow: "0",
								flexShrink: "0",
							},
						}),
						tray.text("for Seanime", {
							style: { fontSize: "14px", textAlign: "center", marginTop: "-10px", color: "#fff" },
						}),
					],
					{
						gap: 0,
						direction: "column",
						style: {
							"justify-content": "center",
						},
					}
				);
			},

			stack(content: any[], gap: number = 2) {
				const container = tray.div([], {
					style: {
						maxWidth: this.config.width,
						height: this.config.height,
						boxSizing: "border-box",
						width: `clamp(10rem, 40vw, ${this.config.width})`,
					},
				});

				const stack = tray.stack(content, {
					gap,
					style: {
						position: "absolute",
						top: "-0.75rem",
						left: "-0.75rem",
						width: "calc(100% + 1.5rem)",
						height: "calc(100% + 1.5rem)",
						borderRadius: "0.75rem",
						background: "linear-gradient(to bottom, #2e51a2 0%, #182a55 100%)",
						padding: "0.75rem",
					},
				});

				return tray.div([container, stack]);
			},

			backBtn() {
				return tray.button("←", {
					size: "md",
					intent: "gray-subtle",
					style: {
						width: "2.9em",
						borderRadius: "50%",
						position: "fixed",
						top: "1em",
						left: "1em",
					},
					onClick: ctx.eventHandler("mal:navigate-landing", () => {
						if (application.userInfo.connectionState.get() === ConnectionState.Disconnected) {
							tabs.current.set(Tab.logon);
						} else {
							tabs.current.set(Tab.landing);
						}
					}),
				});
			},

			[Tab.logon]() {
				// login details
				const error = state.loginError.get()
					? tray.text(state.loginError.get() ?? "", {
							style: {
								padding: "0.5em",
								border: "1px solid #ff3535",
								background: "#ff353598",
								borderRadius: "0.75em",
								marginBottom: "1em",
							},
					  })
					: [];

				const info = tray.text(
					"Click the button below to authorize the application, then copy the token from the website and paste it into the field below.",
					{
						style: {
							textAlign: "center",
							wordBreak: "normal",
						},
					}
				);

				if (!application.currentAuthUrl.get()) {
					application.token.generateAuthUrl();
				}

				const authButton = tray.anchor({
					text: "Authorize",
					href: application.currentAuthUrl.get() ?? "",
					target: "_blank",
					// prettier-ignore
					className: "UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border bg-gray-100 border-transparent hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 h-10 px-4 no-underline",
					style: {
						pointerEvents: state.loggingIn.get() ? "none" : "auto",
						opacity: state.loggingIn.get() ? "0.5" : "1",
						width: "100%",
					},
				});

				const authToken = tray.input({
					label: "\u200b",
					placeholder: "Auth Code",
					fieldRef: fieldRefs.authCode,
					disabled: state.loggingIn.get(),
					style: {
						color: "var(--background)",
						background: "var(--foreground)",
					},
				});

				const login = tray.button({
					label: "Login",
					intent: "primary",
					size: "md",
					loading: state.loggingIn.get(),
					style: {
						width: "100%",
					},
					onClick: ctx.eventHandler("mal:login", async () => {
						if (!fieldRefs.authCode.current.length) {
							state.loginError.set("Error: Please enter your Auth code");
							return;
						} else {
							state.loginError.set(null);
						}

						// start logging in
						state.loggingIn.set(true);
						try {
							await application.token.exchangeCode(fieldRefs.authCode.current);

							log.sendSuccess("Successfully logged in!");
							log.send("Fetching user info");

							await $_wait(5000);

							const data = await application.userInfo.fetch();

							log.sendSuccess("Successfully fetched user info!");
							log.send(`Welcome ${data.name}!`);
							tabs.current.set(Tab.landing);
							fieldRefs.authCode.setValue("");
						} catch (e) {
							await $_wait(2_000);
							state.loginError.set(`Error: ${(e as Error).message}`);
							log.sendError("Login failed: " + (e as Error).message);
						} finally {
							state.loggingIn.set(false);
						}
					}),
				});

				const logs = tray.button("View Logs", {
					size: "md",
					intent: "gray-subtle",
					className: "h-10",
					style: { margin: "0 1em 0.75em", padding: "1em 0.5em" },
					onClick: ctx.eventHandler("mal:view-logs", () => {
						tabs.current.set(Tab.logs);
					}),
					loading: state.loggingIn.get(),
				});

				const form = tray.flex([error, info, authButton, authToken, login], {
					direction: "column",
					style: {
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
						padding: "0.75em",
					},
				});

				return this.stack([this.logo(), form, logs], 2);
			},

			[Tab.landing]() {
				const logOut = tray.flex([
					tray.div([], { style: { flex: "1" } }),
					tray.button("Log-out", {
						size: "md",
						intent: "alert-subtle",
						disabled: state.loggingOut.get(),
						style: {
							// prettier-ignore
							backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iI2YwOWU5ZiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOCAxYS43NS43NSAwIDAgMSAuNzUuNzV2Ni41YS43NS43NSAwIDAgMS0xLjUgMHYtNi41QS43NS43NSAwIDAgMSA4IDFNNC4xMSAzLjA1YS43NS43NSAwIDAgMSAwIDEuMDYgNS41IDUuNSAwIDEgMCA3Ljc4IDAgLjc1Ljc1IDAgMCAxIDEuMDYtMS4wNiA3IDcgMCAxIDEtOS45IDAgLjc1Ljc1IDAgMCAxIDEuMDYgMCIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+)",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "0.85em center",
							textIndent: "2em",
							backgroundSize: "21.5px 21.5px",
							width: "fit-content",
						},
						onClick: ctx.eventHandler("mal:log-out", () => {
							log.sendInfo("Logging out...");
							state.loggingOut.set(true);

							// clear data
							application.token.set(null);
							application.userInfo.reset();
							state.syncing.set(false);

							// Back to login screen
							ctx.setTimeout(() => {
								ctx.toast.success("Logged out of MAL!");
								log.sendInfo("Logged out of MAL!");
								tabs.current.set(Tab.logon);
								state.loggingOut.set(false);
							}, 5_000);
						}),
					}),
				]);

				const buttonOpts = {
					size: "md" as "xs" | "sm" | "md" | "lg",
					intent: "gray-subtle" as $ui.Intent,
					style: {
						width: "100%",
					},
				};

				const statusbg = application.userInfo.connectionState.get() === ConnectionState.Connected ? "#35ff5098" : "#ff353598";

				const status = tray.flex(
					[
						tray.text(application.userInfo.connectionState.get() ?? "<???>", {
							style: {
								padding: "0 0.75em",
								borderRadius: "0.875em",
								background: statusbg,
								fontSize: "0.875em",
								width: "fit-content",
								color: "#fff",
							},
						}),
					],
					{
						style: {
							justifyContent: "center",
						},
					}
				);

				const userInfo = tray.flex(
					[
						tray.div([], {
							style: {
								// prettier-ignore
								backgroundImage: `url(${application.userInfo.picture.get() ?? application.userInfo.defaultAvatar})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								borderRadius: "50%",
								width: "5rem",
								height: "5rem",
							},
						}),
						tray.flex(
							[
								tray.text("Logged in as", {
									style: {
										fontStyle: "Italic",
										fontSize: "0.75em",
										fontWeight: "600",
									},
								}),
								tray.text(application.userInfo.name.get() ?? "<MALUserName>", {
									style: { fontWeight: "bolder", color: "#fff" },
								}),
								tray.text(`ID: ${application.userInfo.id.get() ?? "<MALId>"}`, {
									style: {
										marginTop: "-5px",
										fontSize: "0.75em",
										color: "#cacaca",
										fontWeight: "600",
									},
								}),
								tray.flex([
									tray.anchor({
										text: "AnimeList",
										target: "_blank",
										href: `https://myanimelist.net/animelist/${application.userInfo.name.get()}`,
										// prettier-ignore
										className: "whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border bg-gray-100 border-transparent hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 px-2 no-underline cursor-pointer",
										style: {
											fontSize: "12px",
											borderRadius: "999px",
											pointerEvents: state.loggingOut.get() ? "none" : "auto",
											opacity: state.loggingOut.get() ? "0.5" : "1",
											width: "100%",
										},
									}),
									tray.anchor({
										text: "MangaList",
										target: "_blank",
										href: `https://myanimelist.net/mangalist/${application.userInfo.name.get()}`,
										// prettier-ignore
										className: "whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border bg-gray-100 border-transparent hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 px-2 no-underline cursor-pointer",
										style: {
											fontSize: "12px",
											borderRadius: "999px",
											pointerEvents: state.loggingOut.get() ? "none" : "auto",
											opacity: state.loggingOut.get() ? "0.5" : "1",
											width: "100%",
										},
									}),
								]),
							],
							{
								gap: 0.5,
								direction: "column",
							}
						),
					],
					{
						gap: 3,
						direction: "row",
						style: {
							width: "100%",
						},
					}
				);

				const tempDisable = tray.switch("Temporarily disable syncing progress", {
					size: "sm",
					fieldRef: fieldRefs.disableSyncing,
					disabled: state.loggingOut.get(),
					onChange: ctx.eventHandler("mal:temp-disable", (e) => {
						$storage.set("mal:options-disableSync", e.value);
					}),
					style: {
						"--color-gray-900": "24 42 85",
						"--color-gray-800": "26 46 94",
						"--color-brand-500": "255 95 95",
					},
				});

				const manageList = tray.button("Manage List", {
					...buttonOpts,
					loading: state.loggingOut.get(),
					onClick: ctx.eventHandler("mal:list-settings", () => {
						tabs.current.set(Tab.manageList);
					}),
				});

				const logs = tray.button("View Logs", {
					...buttonOpts,
					onClick: ctx.eventHandler("mal:view-logs", () => {
						tabs.current.set(Tab.logs);
					}),
					loading: state.loggingOut.get(),
				});

				const btnGroup = tray.stack([manageList, logs], { gap: 3 });

				const stack = tray.flex([status, userInfo, tempDisable, btnGroup], {
					direction: "column",
					gap: 5,
				});

				const container = tray.flex([stack, logOut], {
					direction: "column",
					gap: 5,
					style: {
						justifyContent: "space-between",
						padding: "0 0.75em",
						height: "100%",
					},
				});

				return this.stack([this.logo(), container], 2);
			},

			[Tab.logs]() {
				const header = tray.flex(
					[
						tray.text("MAL Logs", {
							style: {
								alignSelf: "end",
								fontSize: "1.2em",
								fontWeight: "bolder",
							},
						}),
						tray.button("Clear logs", {
							size: "sm",
							intent: "alert-subtle",
							style: {
								width: "fit-content",
							},
							onClick: ctx.eventHandler("mal:clear-logs", () => {
								log.clearEntries();
							}),
						}),
					],
					{
						direction: "row",
						style: {
							justifyContent: "space-around",
							width: "100%",
						},
					}
				);

				const entries = log.getEntries().map(([message, type]) => {
					const color: Record<"Info" | "Warning" | "Error" | "Log" | "Success", string> = {
						Info: "#00afff",
						Warning: "#ffff5f",
						Error: "#ff5f5f",
						Log: "#bcbcbc",
						Success: "#5fff5f",
					};

					return tray.text(message, {
						style: {
							fontFamily: "monospace",
							fontSize: "12px",
							color: color[type],
							lineHeight: "1",
						},
					});
				});

				const terminal = tray.div([...entries], {
					style: {
						height: "100%",
						background: "var(--background)",
						border: "1px solid var(--border)",
						borderRadius: "0.875rem",
						padding: "0.75em 0.25em",
						overflow: "scroll",
					},
				});

				return this.stack([this.logo(), header, terminal, this.backBtn()], 2);
			},

			[Tab.manageList]() {
				const inputStyle = {
					color: "#182a56",
					background: "#f8faff",
					borderColor: "#ffffff",
					fontWeight: "bold",
					"--tw-ring-color": "#ffffff",
				};

				const jobType = tray.select("Job type", {
					size: "md",
					placeholder: "Select...",
					disabled: state.syncing.get() || state.cancellingSync.get(),
					fieldRef: fieldRefs.manageListJobtype,
					style: {
						borderRadius: "1em 1em 0 0",
						...inputStyle,
					},
					options: [
						{
							label: "Import from Anilist",
							value: ManageListJobType.Import,
						},
						{
							label: "Export to Anilist",
							value: ManageListJobType.Export,
						},
					] satisfies { label: string; value: ManageListJobType }[],
					onChange: ctx.eventHandler("mal:manage-list-job-type", (e) => {
						const value = e.value as ManageListJobType;
						fieldRefs.manageListJobtype.setValue(value);
						state.manageListJobTypeDesc.set(manageListJobTypeDesc[value]);
					}),
				});

				const jobTypeSubText = tray.text(state.manageListJobTypeDesc.get() || "\u200b", {
					className: "border",
					style: {
						fontSize: "12px",
						color: "#ffc107",
						padding: "0.5em 0.5em 0.5em 1em",
						borderRadius: "0 0 1em 1em",
						marginTop: "-0.75em",
						background: "#00000033",
						wordBreak: "normal",
						lineHeight: "normal",
						opacity: state.syncing.get() || state.cancellingSync.get() ? "0.5" : "1",
					},
				});

				const mediaType = tray.select("Media Type", {
					size: "md",
					placeholder: "Select...",
					fieldRef: fieldRefs.manageListMediaType,
					disabled: state.syncing.get() || state.cancellingSync.get(),
					options: [
						{
							label: "Anime",
							value: "Anime",
						},
						{
							label: "Manga",
							value: "Manga",
						},
					],
					onChange: ctx.eventHandler("mal:manage-list-media-type", (e) => {
						fieldRefs.manageListMediaType.setValue(e.value);
					}),
					style: inputStyle,
				});

				const syncType = tray.select("Sync Type", {
					size: "md",
					placeholder: "Select...",
					fieldRef: fieldRefs.manageListSyncType,
					disabled: state.syncing.get() || state.cancellingSync.get(),
					style: {
						borderRadius: "1em 1em 0 0",
						...inputStyle,
					},
					options: [
						{
							label: "Add Missing Entries",
							value: ManageListSyncType.Patch,
						},
						{
							label: "Update Shared Entries",
							value: ManageListSyncType.Post,
						},
						{
							label: "Mirror Lists",
							value: ManageListSyncType.FullSync,
						},
					] satisfies { label: string; value: ManageListSyncType }[],
					onChange: ctx.eventHandler("mal:manage-list-sync-type", (e) => {
						const value = e.value as ManageListSyncType;
						fieldRefs.manageListSyncType.setValue(value);
						state.manageListSyncTypeDesc.set(manageListSyncTypeDesc[value]);
					}),
				});

				const syncTypeSubText = tray.text(state.manageListSyncTypeDesc.get() || "\u200b", {
					className: "border",
					style: {
						fontSize: "12px",
						color: {
							[ManageListSyncType.Patch]: "#52d6eb",
							[ManageListSyncType.Post]: "#ffc107",
							[ManageListSyncType.FullSync]: "#ef7b85",
						}[fieldRefs.manageListSyncType.current],
						padding: "0.5em 0.5em 0.5em 1em",
						borderRadius: "0 0 1em 1em",
						marginTop: "-0.75em",
						background: "#00000033",
						wordBreak: "normal",
						lineHeight: "normal",
						opacity: state.syncing.get() || state.cancellingSync.get() ? "0.5" : "1",
					},
				});

				const startJob = tray.button({
					label: state.syncing.get() || state.cancellingSync.get() ? "Cancel" : "Sync!",
					size: "md",
					loading: state.cancellingSync.get(),
					intent: state.syncing.get() || state.cancellingSync.get() ? "alert" : "success",
					style: {
						width: "100%",
						marginTop: "1.5em",
					},
					onClick: ctx.eventHandler("mal:manage-list-start-job", () => {
						if (state.syncing.get()) {
							state.syncing.set(false);
							state.cancellingSync.set(true);
							ctx.setTimeout(() => {
								state.cancellingSync.set(false);
							}, 5_000);
						} else {
							if (fieldRefs.manageListSyncType.current === ManageListSyncType.FullSync) {
								tabs.current.set(Tab.manageListDanger);
								return;
							}
							state.syncing.set(true);
							ctx.setTimeout(() => syncEntries(), 1000);
						}
					}),
				});

				const progressBar = tray.div(
					[
						tray.div([], {
							style: {
								position: "absolute",
								left: "0",
								width: `${(syncProgress.percent() * 100).toString()}%`,
								height: "100%",
								background: "#2e51a2",
								animation: "slide 1.2 ease-in-out infinite",
							},
						}),
					],
					{
						style: {
							position: "relative",
							marginTop: "1em",
							width: "100%",
							height: "8px",
							background: "#00000044",
							borderRadius: "999px",
							overflow: "hidden",
						},
					}
				);

				const progressDetails = tray.flex(
					[
						tray.text(state.syncDetail.get(), {
							style: {
								overflowX: "hidden",
								textOverflow: "ellipsis",
							},
						}),
						tray.text(`[${syncProgress.current.get()}/${syncProgress.total.get()}]`, {
							style: {
								width: "fit-content",
								color: "#6de745",
							},
						}),
					],
					{
						style: {
							justifyContent: "space-around",
							fontSize: "12px",
							textWrap: "nowrap",
							marginTop: "-0.5em",
						},
					}
				);

				const container = tray.stack([jobType, jobTypeSubText, mediaType, syncType, syncTypeSubText], { gap: 2 });

				return this.stack([this.logo(), container, startJob, progressBar, progressDetails, this.backBtn()], 2);
			},

			[Tab.manageListDanger]() {
				const container = tray.stack(
					[
						tray.text(
							"Continuing this operation will completely overwrite your list. Any entries that are not present in the source list will be permanently deleted. It is strongly recommended that you create a backup first by exporting your list on the respective tracker's website. By clicking the button below, you confirm that you understand the risk, acknowledge the consequences, and agree to proceed despite the potential loss of data.",
							{
								style: {
									textAlign: "justify",
									wordBreak: "normal",
									padding: "1em",
									borderRadius: "0.875em",
									background: "#a1181888",
									border: "1px solid #bb5f5f",
									color: "#e39e9e",
								},
							}
						),
						fieldRefs.manageListJobtype.current === ManageListJobType.Import
							? tray.switch("Delete private entries", {
									fieldRef: fieldRefs.deletePrivateEntries,
									onChange: ctx.eventHandler("delete-private", ({ value }: { value: boolean }) => fieldRefs.deletePrivateEntries.setValue(value)),
									style: {
										"--color-gray-900": "24 42 85",
										"--color-gray-800": "26 46 94",
										"--color-brand-500": "255 95 95",
									},
							  })
							: [],
						tray.button({
							label: "Proceed",
							intent: "alert",
							size: "md",
							onClick: ctx.eventHandler("mal:sync-danger-accepted", () => {
								state.syncing.set(true);
								tabs.current.set(Tab.manageList);
								ctx.setTimeout(() => syncEntries(), 1000);
							}),
						}),
					],
					{
						gap: 5,
						style: {
							justifyContent: "center",
							height: "100%",
						},
					}
				);

				return this.stack([this.logo(), container, this.backBtn()]);
			},
			// Wrapper to retrieve the current tab
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

		function popByProperty<T extends Record<string, any>, K extends keyof T>(entries: T[], prop: K, value: T[K]): T | undefined {
			const index = entries.findIndex((e) => unwrap(e[prop]) === value);
			if (index === -1) return undefined;

			const [removed] = entries.splice(index, 1);
			return removed;
		}

		function toISODate(date?: $app.AL_FuzzyDateInput): string | undefined {
			if (!date || !unwrap(date)) return undefined;
			const year = unwrap(date?.year);

			if (!year) return undefined;
			const month = date.month ?? 1; // default to January if missing
			const day = date.day ?? 1; // default to 1st if missing

			return new Date(Date.UTC(year, month - 1, day)).toISOString().substring(0, 10);
		}

		function toFuzzyDate(date?: string): $app.AL_FuzzyDateInput | undefined {
			if (!date) return undefined;

			const dateObject = new Date(date);
			const day = dateObject.getDate();
			const month = dateObject.getMonth() + 1;
			const year = dateObject.getFullYear();

			if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined;
			return { day, month, year };
		}

		function normalizeString(str: string | null | undefined): string | undefined {
			return LoadDoc(`<p>${str ?? ""}</p>`)("p").text();
		}

		function normalizeAnimeStatusToMal(status?: $app.AL_MediaListStatus) {
			if (status === undefined || status === null) return undefined;
			const map: Record<typeof status, $malsync.ListStatusAnime> = {
				COMPLETED: "completed",
				CURRENT: "watching",
				DROPPED: "dropped",
				PAUSED: "on_hold",
				PLANNING: "plan_to_watch",
				REPEATING: "watching",
			};
			return map[status];
		}

		function normalizeMangaStatusToMal(status?: $app.AL_MediaListStatus) {
			if (status === undefined || status === null) return undefined;
			const map: Record<typeof status, $malsync.ListStatusManga> = {
				COMPLETED: "completed",
				CURRENT: "reading",
				DROPPED: "dropped",
				PAUSED: "on_hold",
				PLANNING: "plan_to_read",
				REPEATING: "reading",
			};
			return map[status];
		}

		function normalizeStatusToAnilist(status: $malsync.ListStatusAnime | $malsync.ListStatusManga) {
			if (status === undefined || status === null) return undefined;
			const map: Record<typeof status, $app.AL_MediaListStatus> = {
				completed: "COMPLETED",
				dropped: "DROPPED",
				on_hold: "PAUSED",
				plan_to_read: "PLANNING",
				plan_to_watch: "PLANNING",
				reading: "CURRENT",
				watching: "CURRENT",
			};
			return map[status];
		}

		function getAnilistEntries(mediaType: "Anime" | "Manga") {
			return ($anilist[`get${mediaType}Collection`](false).MediaListCollection?.lists ?? [])
				.flatMap((list) => list.entries)
				.filter((entry): entry is $app.AL_AnimeCollection_MediaListCollection_Lists_Entries => Boolean(entry))
				.map((entry) => {
					const { media, ...rest } = entry;
					return { ...rest, title: media?.title?.userPreferred, mediaId: media?.id, idMal: media?.idMal };
				});
		}

		async function getMedia(mediaId: number) {
			const [animeRes, mangaRes] = await Promise.allSettled([ctx.anime.getAnimeEntry(mediaId), ctx.manga.getCollection()]);

			if (animeRes.status === "fulfilled" && animeRes.value) {
				return { type: "Anime" as const, media: animeRes.value.media, listData: animeRes.value.listData };
			}

			if (mangaRes.status === "fulfilled" && mangaRes.value) {
				const entries = mangaRes.value.lists?.flatMap((l) => l.entries ?? []) ?? [];
				const mangaEntry = entries.find((e) => e?.mediaId === mediaId) ?? null;
				if (mangaEntry) {
					return { type: "Manga" as const, media: mangaEntry.media, listData: mangaEntry.listData };
				}
			}

			return null;
		}

		async function anilistQuery(query: string, variables: any) {
			const res = await ctx.fetch("https://graphql.anilist.co", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + $database.anilist.getToken(),
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ query, variables }),
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

			return await res.json();
		}

		async function filterExistingMalIds(malIds: number[]) {
			const endpoint = "https://graphql.anilist.co";
			const existing: { id: number; idMal: number; title: string }[] = [];

			let page = 1;
			const perPage = 50;

			while (true) {
				const query =
					"query ($page: Int, $perPage: Int, $malIds: [Int]) { Page(page: $page, perPage: $perPage) { media(idMal_in: $malIds) { id idMal title { userPreferred } } } }";

				const variables = { page, perPage, malIds };

				const res = await fetch(endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ query, variables }),
				});

				await $_wait(2000);
				if (!res.ok) {
					let err = null;
					try {
						err = res.json();
					} catch {
						err = null;
					}
					throw new Error(err?.errors?.map((m: any) => m.message).join(" ") ?? res.statusText);
				}

				const json = await res.json();
				if (!json.data) throw new Error(json.errors?.join("\n"));

				const media = json.data.Page.media;
				for (const m of media) {
					if (m.idMal != null) {
						existing.push({
							id: m.id,
							idMal: m.idMal,
							title: m.title.userPreferred,
						});
					}
				}

				if (media.length < perPage) break;
				page++;
			}

			return existing;
		}

		async function syncEntries() {
			const jobType = fieldRefs.manageListJobtype.current;
			const mediaType = fieldRefs.manageListMediaType.current;
			const syncType = fieldRefs.manageListSyncType.current;

			// Anilist ➔ MyAnimeList
			if (jobType === ManageListJobType.Import) {
				log.sendInfo("[SYNCLIST] Starting sync job... (Anilist ➔ MyAnimeList)");
				const entries = getAnilistEntries(mediaType);
				if (!entries.length) {
					log.sendWarning("[SYNCLIST] No entries found.");
					log.sendWarning("[SYNCLIST] Sync job terminated.");
					return state.syncing.set(false);
				} else {
					log.sendInfo(`[SYNCLIST] Found ${entries.length} entries in AniList!`);
					syncProgress.refresh(entries.length);
				}

				log.send("[SYNCLIST] Querying Myanimelist entries...");
				const malEntries = await application.list.fetchAll(mediaType).catch((e) => (e as Error).message);
				if (typeof malEntries === "string") return log.sendError(`[SYNCLIST] Terminating syncjob: ${malEntries}`);
				log.sendInfo(`[SYNCLIST] Found ${malEntries.length} entries in MAL!`);

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop();
					syncProgress.tick();

					if (!entry?.mediaId) continue;

					const title = entry?.title;
					state.syncDetail.set(`Syncing ${title}`);

					if (!entry.idMal) {
						log.sendWarning(`[SYNCLIST] Skipping ${title} (no equivalent MAL entry)...`);
						continue;
					}

					if (unwrap(entry.private)) {
						log.sendWarning(`[SYNCLIST] Skipping ${title} (private)...`);
						if (!fieldRefs.deletePrivateEntries.current) {
							popByProperty(malEntries, "idMal", unwrap(entry.idMal) ?? 0);
						}
						continue;
					}

					const malEntry = popByProperty(malEntries, "idMal", unwrap(entry.idMal)!);
					if (!!malEntry && syncType === ManageListSyncType.Patch) {
						log.sendWarning(`[SYNCLIST] Skipping ${title} (already-exists)...`);
						continue;
					}

					const start = toISODate(entry.startedAt);
					const finish = toISODate(entry.completedAt);
					const notes = unwrap(entry.notes);
					const score = Math.round((unwrap(entry.score) ?? NaN) / 10);
					const status = unwrap(entry.status);

					const shared: $malsync.ListUpdateBodyBase = {};
					if (!!start && start !== malEntry?.list_status?.start_date) shared.start_date = start;
					if (!!finish && finish !== malEntry?.list_status?.finish_date) shared.finish_date = finish;
					if ((notes ?? "") !== (normalizeString(malEntry?.list_status?.comments) ?? "")) shared.comments = notes;
					if (!!score && score !== malEntry?.list_status?.score) shared.score = score;

					const body =
						mediaType === "Anime"
							? (() => {
									const b: $malsync.ListUpdateAnimeBody = { ...shared };
									const malAnime = malEntry?.list_status as $malsync.AnimeListEntry | undefined;
									const malStatus = normalizeAnimeStatusToMal(status);
									const malRewatching = unwrap(status) === "REPEATING";
									if (malStatus !== malAnime?.status) b.status = malStatus;
									if (malRewatching !== malAnime?.is_rewatching) b.is_rewatching = malRewatching;
									if ((unwrap(entry.progress) ?? 0) !== (malAnime?.num_episodes_watched ?? 0) && malAnime?.status !== "completed")
										b.num_watched_episodes = entry.progress;
									if ((unwrap(entry.repeat) ?? 0) !== (malAnime?.num_times_rewatched ?? 0)) b.num_times_rewatched = entry.repeat;
									return b;
							  })()
							: (() => {
									const b: $malsync.ListUpdateMangaBody = { ...shared };
									const malManga = malEntry?.list_status as $malsync.MangaListEntry | undefined;
									const malStatus = normalizeMangaStatusToMal(status);
									const malRereading = status === "REPEATING";
									if (malStatus !== malManga?.status) b.status = malStatus;
									if (malRereading !== malManga?.is_rereading) b.is_rereading = malRereading;
									if ((unwrap(entry.progress) ?? 0) !== (malManga?.num_chapters_read ?? 0) && malManga?.status !== "completed")
										b.num_chapters_read = entry.progress;
									if ((unwrap(entry.repeat) ?? 0) !== (malManga?.num_times_reread ?? 0)) b.num_times_reread = entry.repeat;
									return b;
							  })();

					if (!Object.keys(body).length) {
						log.sendWarning(`[SYNCLIST] Skipping ${title}. (no-new-update)...`);
						continue;
					}

					await application.list
						.patch(mediaType, entry.idMal, body)
						.then(() => log.sendSuccess(`[SYNCLIST] Updated ${entry.title} on MyAnimeList.`))
						.catch((e) => log.sendError(`[SYNCLIST] Failed to update ${entry.title} on MyAnimeList ${(e as Error).message} ${JSON.stringify(body)}`));

					await $_wait(500);
				}

				if (syncType === ManageListSyncType.FullSync && typeof malEntries !== "string" && state.syncing.get()) {
					log.sendInfo(`[SYNCLIST] Found ${malEntries.length} remaining entries. Purging...`);
					state.syncDetail.set(`Purging ${malEntries.length} entries...`);

					const validEntries = await filterExistingMalIds(malEntries.map((x) => x.node.id)).catch((e) => (e as Error).message);
					if (typeof validEntries === "string") {
						log.sendError(`[SYNCLIST] ${validEntries}`);
					} else {
						const validIds = new Set(validEntries.map((x) => x.idMal));
						const invalidMalEntries = malEntries.filter((c) => !validIds.has(c.node.id));
						const validMalEntries = malEntries.filter((c) => validIds.has(c.node.id));

						if (invalidMalEntries.length) {
							log.sendInfo(`[SYNCLIST] Found ${invalidMalEntries.length} invalid entries queued for deletion...`);
							while (invalidMalEntries.length) {
								const invalidEntry = invalidMalEntries.pop()!;
								log.send(`[SYNCLIST] Unqueued ${invalidEntry.node.title} from deletion <no matching records found on AniList>`);
							}
						}

						log.sendInfo(`[SYNCLIST] Preparing to delete ${validMalEntries.length} entries...`);
						while (state.syncing.get() && validMalEntries.length) {
							const entry = validMalEntries.pop()!;
							await application.list
								.delete(mediaType, entry.node.id)
								.then((data) => {
									if (data) {
										log.sendSuccess(`[SYNCLIST] Deleted ${entry.node.title} from MyAnimeList`);
									} else {
										log.sendInfo(`[SYNCLIST] ${entry.node.title} does not exist in user's list. No further action required.`);
									}
								})
								.catch((e) => log.sendError(`[SYNCLIST] ${(e as Error).message}`));
							await $_wait(1_500);
						}
					}
				}
			}

			// MyAnimeList ➔ Anilist
			if (jobType === ManageListJobType.Export) {
				log.sendInfo("[SYNCLIST] Starting sync job... (MyAnimeList ➔ Anilist)");
				const entries = await application.list
					.fetchAll(mediaType)
					.then((data) =>
						data.map((e) => ({
							idMal: e.node.id,
							title: e.node.title,
							score: e.list_status.score,
							progress:
								mediaType === "Anime"
									? (e as $malsync.AnimeListEntryWrapper).list_status.num_episodes_watched
									: (e as $malsync.MangaListEntryWrapper).list_status.num_chapters_read,
							progressVolumes: mediaType === "Anime" ? undefined : (e as $malsync.MangaListEntryWrapper).list_status.num_volumes_read,
							repeat:
								mediaType === "Anime"
									? (e as $malsync.AnimeListEntryWrapper).list_status.num_times_rewatched
									: (e as $malsync.MangaListEntryWrapper).list_status.num_times_reread,
							status: normalizeStatusToAnilist(e.list_status.status),
							notes: e.list_status.comments,
							// private: e.list_status.is_private,
							startedAt: e.list_status.start_date ?? undefined,
							completedAt: e.list_status.finish_date ?? undefined,
						}))
					)
					.catch((e) => (e as Error).message);

				if (typeof entries === "string") {
					log.sendError(`[SYNCLIST] ${entries}`);
					log.sendWarning("[SYNCLIST] Sync job terminated.");
					return state.syncing.set(false);
				} else if (!entries.length) {
					log.sendWarning("[SYNCLIST] No entries found.");
					log.sendWarning("[SYNCLIST] Sync job terminated.");
					return state.syncing.set(false);
				} else {
					log.sendInfo(`[SYNCLIST] Found ${entries.length} entries!`);
					syncProgress.refresh(entries.length);
				}

				// prettier-ignore
				const query = "const query = ` mutation ( $mediaId: Int!, $status: MediaListStatus, $progress: Int, $progressVolumes: Int, $score: Float, $repeat: Int, $notes: String, $startedAt: FuzzyDateInput, $completedAt: FuzzyDateInput ) { SaveMediaListEntry( mediaId: $mediaId, status: $status, progress: $progress, progressVolumes: $progressVolumes, score: $score, repeat: $repeat, notes: $notes, startedAt: $startedAt, completedAt: $completedAt ) { id status progress progressVolumes score repeat notes startedAt { year month day } completedAt { year month day } } }";
				const anilistGlobalEntries = await filterExistingMalIds(entries.map((e) => e.idMal)).catch((e) => (e as Error).message);
				const anilistEntries = getAnilistEntries(mediaType).filter((x) => !unwrap(x.private));

				if (typeof anilistGlobalEntries === "string") {
					log.sendError(`[SYNCLIST] ${anilistGlobalEntries}`);
					log.send("[SYNCLIST] Terminating sync...");
					state.syncing.set(false);
					state.syncDetail.set(`Waiting...`);
					syncProgress.refresh(0);
					return;
				}

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop()!;
					const listEntry = popByProperty(anilistEntries, "idMal", entry.idMal);
					const { id, title } = anilistGlobalEntries.find((x) => x.idMal === entry.idMal) ?? {};
					syncProgress.tick();
					state.syncDetail.set(`Syncing ${title ?? entry.title}`);

					if (!id) {
						log.sendWarning(`[SYNCLIST] Skipped ${entry.title}. No matching media found on Anilist.`);
						continue;
					}

					if (!!listEntry && syncType === ManageListSyncType.Patch) {
						log.sendWarning(`[SYNCLIST] Skipping ${title} (already-exists)...`);
						continue;
					}

					const body: $malsync.AnilistSaveMediaListEntryVariables = { mediaId: id };
					const startedAt = toFuzzyDate(entry.startedAt);
					const completedAt = toFuzzyDate(entry.completedAt);

					if (entry.status !== unwrap(listEntry?.status)) body.status = entry.status;
					if (entry.progress !== (unwrap(listEntry?.progress) ?? 0)) body.progress = entry.progress;
					// Seanime's Anilist ListEntry for Manga does not support progressVolumes atm
					// if (entry.progressVolumes) body.progressVolumes = entry.progressVolumes;
					if (entry.score !== Math.round((unwrap(listEntry?.score) ?? NaN) / 10)) body.score = entry.score * 10;
					if ((entry.repeat ?? 0) !== unwrap(listEntry?.repeat)) body.repeat = entry.repeat ?? 0;
					if (entry.notes !== normalizeString(unwrap(listEntry?.notes))) body.notes = entry.notes ?? "";

					if (toISODate(startedAt) !== toISODate(listEntry?.startedAt)) body.startedAt = startedAt;
					if (toISODate(completedAt) !== toISODate(listEntry?.completedAt)) body.completedAt = completedAt;

					// check if there are update in the entry
					if (Object.keys(body).length === 1) {
						log.sendWarning(`[SYNCLIST] Skipping ${title ?? entry.title} (no-update-body)...`);
						continue;
					} else {
						console.log("Combined:", body);
					}

					await anilistQuery(query, body)
						.then(() => log.sendSuccess(`[SYNCLIST] Added ${title ?? entry.title} to Anilist.`))
						.catch((e) =>
							log.sendError(`[SYNCLIST] Failed to add ${title ?? entry.title} to Anilist ${(e as Error).message} ${JSON.stringify(body, null, 2)}`)
						);
					await $_wait(2_000);
				}

				if (syncType === ManageListSyncType.FullSync && state.syncing.get()) {
					log.sendInfo(`[SYNCLIST] Found ${anilistEntries.length} remaining entries. Purging...`);
					state.syncDetail.set(`Purging ${anilistEntries.length} entries...`);

					syncProgress.refresh(anilistEntries.length);
					const query = "mutation ($id: Int!) { DeleteMediaListEntry(id: $id) { deleted } }";

					while (state.syncing.get() && anilistEntries.length) {
						const anilistEntry = anilistEntries.pop()!;
						const mediaTitle = anilistEntry.title;

						syncProgress.tick();
						state.syncDetail.set(`Purging ${mediaTitle ?? "anilist-id/" + anilistEntry.id}`);

						// Check if entry exists in shikomori/mal
						if (!unwrap(anilistEntry.idMal)) {
							log.sendWarning(`[SYNCLIST] Skipping ${mediaTitle} (no equivalent MAL entry)...`);
							continue;
						}

						// Check if entry is private
						if (unwrap(anilistEntry.private)) {
							log.sendWarning(`[SYNCLIST] Skipping ${mediaTitle} (private in AL)...`);
							continue;
						}

						anilistQuery(query, { id: anilistEntry.id })
							.then(() => log.sendSuccess(`[SYNCLIST] Removed ${mediaTitle ?? "anilist-id/" + anilistEntry.id} from Anilist!`))
							.catch((e) =>
								log.sendError(`[SYNCLIST] Failed to remove ${mediaTitle ?? "anilist-id/" + anilistEntry.id} from Anilist: ${(e as Error).message}`)
							);

						await $_wait(2_000);
					}
				}
			}

			if (!state.syncing.get()) {
				// sync was cancelled
				log.sendWarning("[SYNCLIST] Syncing was terminated by user");
			} else {
				log.sendInfo("[SYNCLIST] Finished syncing entries!");
				state.syncing.set(false);
			}

			fieldRefs.deletePrivateEntries.setValue(false);
			state.syncDetail.set(`Waiting...`);
			syncProgress.refresh(0);
		}

		async function liveSync<TData>({
			event,
			preDataKey,
			actionLabel,
			buildBody,
			requireRepeat = false,
		}: {
			event: { mediaId?: number };
			preDataKey: string;
			actionLabel: string;
			buildBody: (data: TData, entry: any) => $malsync.ListUpdateAnimeBody | $malsync.ListUpdateMangaBody;
			requireRepeat?: boolean;
		}) {
			const { mediaId } = event;

			if (!mediaId) {
				log.sendWarning(`[${actionLabel}] postUpdate hook was triggered but it contained no mediaId`);
				return $store.set(preDataKey, null);
			}

			const data = $store.get(preDataKey) as TData | null;
			if (!data) return log.sendWarning(`[${actionLabel}] No update data was emitted from the pre update hooks!`);
			$store.set(preDataKey, null);

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`[${actionLabel}] Syncing was disabled. Will not sync entry [${mediaId}]`);
			}

			const entry = await getMedia(mediaId);
			if (!entry) return log.sendWarning(`[${actionLabel}] Media not found (${mediaId})`);

			if (!entry.media?.idMal) {
				return log.sendWarning(`[${actionLabel}] No equivalent MyAnimeList entry found for [${mediaId}]`);
			}

			if ((data as any).mediaId !== mediaId) {
				return log.sendWarning(`[${actionLabel}] preUpdate data was invalid!`);
			}

			if (requireRepeat && typeof (data as any).repeat !== "number") {
				return log.sendWarning(`[${actionLabel}] preUpdate data was of invalid type!`);
			}

			if (unwrap(getAnilistEntries(entry.type).find((x) => x.mediaId === mediaId)?.private)) {
				return log.sendWarning(`[${actionLabel}] ${entry.media.title?.userPreferred ?? "anilist-id/" + mediaId} is private. Skipping...`);
			}

			const title = entry.media.title?.userPreferred ?? `anilist-id/${mediaId}`;
			const body = buildBody(data, entry);

			application.list
				.patch(entry.type, entry.media.idMal, body)
				.then(() => log.sendSuccess(`[${actionLabel}] [PATCH] Synced ${title} to MyAnimeList. ${JSON.stringify(body)}`))
				.catch((e) => log.sendError(`[${actionLabel}] [PATCH] ${(e as Error).message} ${JSON.stringify(body)}`));
		}

		$store.watch("POST_UPDATE_ENTRY", async (e) => {
			liveSync<$app.PreUpdateEntryEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_DATA",
				actionLabel: "MAL.UpdateEntry",
				buildBody: (data, entry) => {
					const body: $malsync.ListUpdateBodyBase = {};

					const start = toISODate(data.startedAt);
					if (start) body.start_date = start;

					const finish = toISODate(data.completedAt);
					if (finish) body.finish_date = finish;

					if (typeof data.scoreRaw === "number" && data.scoreRaw > 0) {
						body.score = Math.round(data.scoreRaw / 10);
					}

					if (entry.type === "Anime") {
						return {
							...body,
							status: data.status ? normalizeAnimeStatusToMal(data.status) : undefined,
							is_rewatching: data.status ? data.status === "REPEATING" : undefined,
							num_watched_episodes: data.progress,
						};
					}

					return {
						...body,
						status: data.status ? normalizeMangaStatusToMal(data.status) : undefined,
						is_rereading: data.status ? data.status === "REPEATING" : undefined,
						num_chapters_read: data.progress,
					};
				},
			});
		});

		$store.watch("POST_UPDATE_ENTRY_PROGRESS", async (e) => {
			liveSync<$app.PreUpdateEntryProgressEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_PROGRESS_DATA",
				actionLabel: "MAL.UpdateProgress",
				buildBody: (data, entry) => {
					const body: $malsync.ListUpdateBodyBase = {};
					if (data.progress && data.progress === data.totalCount) data.status = "COMPLETED";
					if (data.status === "COMPLETED") body.finish_date = new Date().toISOString().substring(0, 10);

					if (entry.type === "Anime") {
						return {
							...body,
							status: normalizeAnimeStatusToMal(data.status),
							is_rewatching: data.status === "REPEATING",
							num_watched_episodes: data.progress,
						};
					}

					return {
						...body,
						status: normalizeMangaStatusToMal(data.status),
						is_rereading: data.status === "REPEATING",
						num_chapters_read: data.progress,
					};
				},
			});
		});

		$store.watch("POST_UPDATE_ENTRY_REPEAT", async (e) => {
			liveSync<$app.PreUpdateEntryRepeatEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_REPEAT_DATA",
				actionLabel: "MAL.UpdateRepeat",
				requireRepeat: true,
				buildBody: (data, entry) => {
					return entry.type === "Anime" ? { num_times_rewatched: data.repeat } : { num_times_reread: data.repeat };
				},
			});
		});

		$store.watch("POST_UPDATE_DELETE", async (e: $app.PostDeleteEntryEvent) => {
			if (!e.mediaId) {
				return log.sendWarning("[MAL.DeleteEntry] postUpdate hook was triggered but it contained no mediaId");
			}

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`[MAL.DeleteEntry] Syncing was disabled. Will not sync entry [${e.mediaId}]`);
			}

			const entry = await getMedia(e.mediaId);
			if (!entry) return log.sendWarning(`[MAL.DeleteEntry] Media not found (${e.mediaId})`);

			if (!entry.media?.idMal) {
				return log.sendWarning(`[MAL.DeleteEntry] No equivalent MyAnimeList entry found for [${e.mediaId}]`);
			}

			if (unwrap(getAnilistEntries(entry.type).find((x) => x.mediaId === e.mediaId)?.private)) {
				return log.sendWarning(`[MAL.DeleteEntry] ${entry.media.title?.userPreferred ?? "anilist-id/" + e.mediaId} is private. Skipping...`);
			}

			const title = entry.media.title?.userPreferred ?? "anilist-id/" + e.mediaId;
			application.list
				.delete(entry.type, entry.media.idMal)
				.then((data) => {
					if (data) {
						log.sendSuccess(`[MAL.DeleteEntry] [DELETE] Synced ${title} to MyAnimeList`);
					} else {
						log.sendInfo(`[MAL.DeleteEntry] [DELETE] ${title} does not exist in user's list. No further action required.`);
					}
				})
				.catch((e) => log.sendError(`[MAL.DeleteEntry] [DELETE] ${(e as Error).message}`));
		});

		tray.render(() => tabs.get());

		ctx.setInterval(() => {
			if (tabs.current.get() === Tab.logs) tray.update();
		}, 1_500);

		// Authenticate
		log.send("Initializing extension...");
		log.send("Checking availability of access tokens...");
		if (application.token.getAccessToken() !== null) {
			log.sendSuccess("Access token found!");
			log.sendInfo("Fetching user info...");
			return application.userInfo
				.fetch()
				.then((data) => {
					log.sendSuccess("Successfully fetched user info!");
					log.send(`Signed in as: ${data.name}!`);
					if (!data.picture) log.sendWarning("No user avatar detected! Reverting to default...");
					tabs.current.set(Tab.landing);
				})
				.catch((err: Error) => {
					log.sendError(`Fetch failed: ${err.message}`);
					log.sendInfo("Invalidating cached token...");
					application.token.set(null);
					log.send("Session invalid. Please log in again.");
					tabs.current.set(Tab.logon);
				});
		}

		log.sendWarning("Access token not found!");
		log.sendInfo("Checking availability of refresh token...");
		if (application.token.refreshToken.get()) {
			log.sendSuccess("Refresh token found!");
			log.sendInfo("Refreshing access token...");
			return application.token
				.refresh()
				.then(() => {
					log.sendSuccess("Successfully refreshed access token!");
					log.sendInfo("Fetching user info...");
					return application.userInfo.fetch();
				})
				.then((data) => {
					log.sendSuccess("Successfully fetched the user info!");
					log.send(`Signed in as: ${data.name}!`);
					if (!data.picture) log.sendWarning("No user avatar detected! Reverting to default...");
					tabs.current.set(Tab.landing);
				})
				.catch((err: Error) => {
					log.sendError(`[Token Refresh Failed] ${err.message}`);
					log.send("Session Expired. Please login again.");
					state.loginError.set("Session Expired. Please login again.");
					tabs.current.set(Tab.logon);
				});
		}

		log.sendWarning("Refresh token not found!");
		log.sendWarning("User authentication required.");
		tabs.current.set(Tab.logon);

		// END OF CODE //
	});

	// HOOKS
	$app.onPreUpdateEntry((e) => {
		$store.set("PRE_UPDATE_ENTRY_DATA", $clone(e));
		e.next();
	});

	$app.onPostUpdateEntry((e) => {
		$store.set("POST_UPDATE_ENTRY", $clone(e));
		e.next();
	});

	$app.onPreUpdateEntryProgress((e) => {
		$store.set("PRE_UPDATE_ENTRY_PROGRESS_DATA", $clone(e));
		e.next();
	});

	$app.onPostUpdateEntryProgress((e) => {
		$store.set("POST_UPDATE_ENTRY_PROGRESS", $clone(e));
		e.next();
	});

	$app.onPreUpdateEntryRepeat((e) => {
		$store.set("PRE_UPDATE_ENTRY_REPEAT_DATA", $clone(e));
		e.next();
	});

	$app.onPostUpdateEntryRepeat((e) => {
		$store.set("POST_UPDATE_ENTRY_REPEAT", $clone(e));
		e.next();
	});

	$app.onPostDeleteEntry((e) => {
		$store.set("POST_UPDATE_DELETE", $clone(e));
		e.next();
	});
}
