/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./traktSync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		// prettier-ignore
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/TraktSync/icon.png";
		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
			width: "fit-content",
		});

		enum Tab {
			logon = "1",
			landing = "2",
			logs = "3",
			loading = "4",
			manageList = "5",
		}

		enum ManageListSyncType {
			// Patch = "patch",
			Post = "post",
			// FullSync = "fullsync"
		}

		enum ConnectionState {
			Disconnected = "Disconnected",
			Connected = "Connected",
		}

		const fieldRefs = {
			traktAuthCode: ctx.fieldRef<string>(""),
			disableSyncing: ctx.fieldRef<boolean>($storage.get("trakt:options-disableSync")?.valueOf() ?? false),
		};

		const state = {
			loggingIn: ctx.state<boolean>(false),
			loginError: ctx.state<string | null>(null),
			loginLabel: ctx.state<string>("Login"),
			loggingOut: ctx.state<boolean>(false),
			manageListSyncTypeDesc: ctx.state<string>("Replace data for items found in both trackers. Items missing in either list are ignored."),
			syncing: ctx.state<boolean>(false),
			cancellingSync: ctx.state<boolean>(false),
			syncProgressCurrent: ctx.state<number>(0),
			syncProgressTotal: ctx.state<number>(0),
			syncProgressPercent: ctx.state<number>(0),
			syncDetail: ctx.state<string>("Waiting..."),
		};

		// logger
		const log = {
			id: "trakt:c6d44b38-f7b6-4785-92fd-a30a8fef71b3",
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
				console.error(`[TraktSync:Error] ${message}`);
			},

			sendInfo(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Info"]);
				console.info(`[TraktSync:Info] ${message}`);
			},

			sendWarning(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Warning"]);
				console.warn(`[TraktSync:Warning] ${message}`);
			},

			sendSuccess(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Success"]);
				console.log(`[TraktSync:Success] ${message}`);
			},

			send(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Log"]);
				console.log(`[TraktSync:Log] ${message}`);
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

		const traktProfile = {
			// prettier-ignore
			defaultAvatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGQ9Ik0xMSA2YTMgMyAwIDEgMS02IDAgMyAzIDAgMCAxIDYgMCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTAgOGE4IDggMCAxIDEgMTYgMEE4IDggMCAwIDEgMCA4bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxIi8+PC9zdmc+",
			displayAvatar: ctx.state<string | null>(null),
			userId: ctx.state<string | null>(null),
			username: ctx.state<string | null>(null),
			isVip: ctx.state<boolean>(false),
			status: ctx.state<ConnectionState | null>(ConnectionState.Disconnected),
			reset() {
				this.displayAvatar.set(null);
				this.userId.set(null);
				this.username.set(null);
				this.status.set(ConnectionState.Disconnected);
			},
		};

		const traktTokenManager = {
			token: {
				accessToken: ctx.state<string | null>($storage.get("traktsync.accessToken") ?? null),
				refreshToken: ctx.state<string | null>($storage.get("traktsync.refreshToken") ?? null),
				expiresAt: ctx.state<number | null>($storage.get("traktsync.expiresAt") ?? null),
			},

			clientId: "f95f217507a1b866da27d4e7ea5197fb9199b6033c79b5627968a2a13353ba4a",
			redirectUri: "https://nnotwen.github.io/n-seanime-extensions/plugins/TraktSync/callback.html",
			baseUri: "https://api.trakt.tv/oauth/token",
			userAgent: "Trakt for Seanime",

			rateLimit: ctx.state<RateLimitInfo | null>(null),
			currentAuthUrl: ctx.state<string | null>(null),

			getAccessToken() {
				const token = this.token.accessToken.get();
				const expiry = this.token.expiresAt.get();
				if (!token || !expiry) return null;
				if (Date.now() > expiry) return null;
				return token;
			},

			generateAuthUrl() {
				const { verifier, challenge } = PKCE.generatePair();
				$store.set("trakt:auth.verifier", verifier);

				const url = new URL("https://trakt.tv/oauth/authorize");
				url.searchParams.set("response_type", "code");
				url.searchParams.set("client_id", this.clientId);
				url.searchParams.set("redirect_uri", this.redirectUri);
				url.searchParams.set("code_challenge", challenge);
				url.searchParams.set("code_challenge_method", "S256");
				this.currentAuthUrl.set(url.toString());
			},

			async exchangeCode(code: string) {
				const codeVerifier = $store.get("trakt:auth.verifier");
				if (!codeVerifier) throw new Error("No verifier was set!");

				const res = await ctx.fetch(this.baseUri, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						code,
						client_id: this.clientId,
						redirect_uri: this.redirectUri,
						grant_type: "authorization_code",
						code_verifier: codeVerifier,
					}),
				});

				if (!res.ok) throw new Error(res.statusText);
				$store.set("trakt:auth.verifier", undefined);
				this.currentAuthUrl.set(null);

				const data = await res.json();
				const expiresAt = Date.now() + data.expires_in * 1000;

				$storage.set("traktsync.accessToken", data.access_token);
				$storage.set("traktsync.refreshToken", data.refresh_token);
				$storage.set("traktsync.expiresAt", expiresAt);

				this.token.accessToken.set(data.access_token);
				this.token.refreshToken.set(data.refresh_token);
				this.token.expiresAt.set(expiresAt);
			},

			async refresh() {
				if (!this.token.refreshToken.get()) throw new Error("No refresh token available");

				const res = await ctx.fetch(this.baseUri, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						refresh_token: this.token.refreshToken.get()!,
						client_id: this.clientId,
						grant_type: "refresh_token",
					}),
				});
				if (!res.ok) throw new Error(res.statusText);

				const data = await res.json();
				const expiresAt = Date.now() + data.expires_in * 1000;

				$storage.set("traktsync.accessToken", data.access_token);
				$storage.set("traktsync.refreshToken", data.refresh_token);
				$storage.set("traktsync.expiresAt", expiresAt);

				this.token.accessToken.set(data.access_token);
				this.token.refreshToken.set(data.refresh_token);
				this.token.expiresAt.set(expiresAt);
				fieldRefs.disableSyncing.setValue(false);
			},

			async withAuthHeaders(): Promise<Record<string, string>> {
				if (!this.getAccessToken()) {
					await this.refresh();
				}
				return {
					Authorization: `Bearer ${this.token.accessToken.get()}`,
					"Content-Type": "application/json",
					"User-Agent": this.userAgent,
					"trakt-api-version": "2",
					"trakt-api-key": this.clientId,
				};
			},

			async traktFetch(path: string, init: RequestInit = {}) {
				const res = await ctx.fetch(`https://api.trakt.tv${path}`, {
					...init,
					headers: {
						...(await this.withAuthHeaders()),
						...(init.headers as Record<string, string>),
					},
				});

				// Capture rate-limit headers if present
				const limit = parseInt(res.headers["X-RateLimit-Limit"] ?? "0", 10);
				const remaining = parseInt(res.headers["X-RateLimit-Remaining"] ?? "0", 10);
				const reset = parseInt(res.headers["X-RateLimit-Reset"] ?? "0", 10);

				if (limit && remaining && reset) {
					this.rateLimit.set({ limit, remaining, reset });
				}

				return res;
			},

			async getUserInfo() {
				const res = await this.traktFetch("/users/me?extended=full", { method: "GET" });
				if (!res.ok) {
					throw new Error(`Failed to fetch user info: ${res.statusText}`);
				}
				const data = await res.json();

				traktProfile.userId.set(data.ids.slug);
				traktProfile.username.set(data.name ?? data.username);
				traktProfile.displayAvatar.set(data.images.avatar.full ?? null);
				traktProfile.isVip.set(data.vip);
				traktProfile.status.set(ConnectionState.Connected);

				// if user is available, do not send into the login page
				tabs.current.set(Tab.landing);

				return data;
			},

			async reset() {
				try {
					const token = this.token.accessToken.get() || this.token.refreshToken.get();
					if (token) {
						await ctx.fetch("https://api.trakt.tv/oauth/revoke", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								token,
								client_id: this.clientId,
							}),
						});
					}
				} catch (err) {
					console.error("Failed to revoke Trakt token:", err);
				}

				// Clear local storage and state
				$storage.set("traktsync.accessToken", null);
				$storage.set("traktsync.refreshToken", null);
				$storage.set("traktsync.expiresAt", null);
				$storage.set("trakt:options-disableSync", false);
				this.token.accessToken.set(null);
				this.token.refreshToken.set(null);
				this.token.expiresAt.set(null);
				this.rateLimit.set(null);
				fieldRefs.disableSyncing.setValue(false);
			},
		};

		const tabs = {
			current: ctx.state<Tab>(Tab.logon),
			config: {
				// prettier-ignore
				logo: "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/TraktSync/icon.png",
				width: "25rem",
				height: "30rem",
			},

			logo() {
				return tray.flex(
					[
						tray.flex(
							[
								tray.div([], {
									style: {
										width: "2.5em",
										backgroundImage: `url(${this.config.logo})`,
										backgroundSize: "contain",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										flexGrow: "0",
										flexShrink: "0",
									},
								}),
								tray.text("trakt", {
									style: { fontSize: "2.5em", width: "fit-content", lineHeight: "1.1", fontWeight: "bolder" },
								}),
							],
							{
								style: {
									justifyContent: "center",
									width: "100%",
									height: "2.5em",
								},
							}
						),
						tray.text("for Seanime", {
							style: { fontSize: "14px", textAlign: "center" },
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
						background: "linear-gradient(to bottom, #612879 0%, transparent 100%)",
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
					onClick: ctx.eventHandler("trakt:navigate-landing", () => {
						tabs.current.set(Tab.landing);
					}),
				});
			},

			// Tray tab used for logging in
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

				if (!traktTokenManager.currentAuthUrl.get()) {
					traktTokenManager.generateAuthUrl();
				}

				const authButton = tray.anchor({
					text: "Authorize",
					// prettier-ignore
					href: traktTokenManager.currentAuthUrl.get() ?? "",
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
					fieldRef: fieldRefs.traktAuthCode,
					disabled: state.loggingIn.get(),
					style: {
						// "-webkit-text-security": "disc",
						textAlign: "center",
					},
				});

				const login = tray.button({
					label: "Login",
					intent: "gray-subtle",
					size: "md",
					loading: state.loggingIn.get(),
					style: {
						width: "100%",
					},
					onClick: ctx.eventHandler("traktsync:login", async () => {
						if (!fieldRefs.traktAuthCode.current.length) {
							state.loginError.set("Error: Please enter your Auth code");
							return;
						} else {
							state.loginError.set(null);
						}

						// start logging in
						state.loggingIn.set(true);
						try {
							await traktTokenManager.exchangeCode(fieldRefs.traktAuthCode.current);
							await $_wait(5_000);
							await traktTokenManager.getUserInfo();
							log.sendSuccess("Successfully logged in!");
							fieldRefs.traktAuthCode.setValue("");
						} catch (e) {
							await $_wait(2_000);
							state.loginError.set(`Error: ${(e as Error).message}`);
							log.sendError("Login failed: " + (e as Error).message);
						} finally {
							state.loggingIn.set(false);
						}
					}),
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

				return this.stack([this.logo(), form], 2);
			},
			// Tray tab after successful login (landing page, also default page)
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
						onClick: ctx.eventHandler("trakt:log-out", () => {
							log.sendInfo("Logging out...");
							state.loggingOut.set(true);

							// clear data
							traktTokenManager.reset();
							traktProfile.reset();
							state.syncing.set(false);

							// Back to login screen
							ctx.setTimeout(() => {
								ctx.toast.success("Logged out of Trakt.tv!");
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

				const statusbg = traktProfile.status.get() === ConnectionState.Connected ? "#35ff5098" : "#ff353598";

				const status = tray.flex(
					[
						tray.text(traktProfile.status.get() ?? "<???>", {
							style: {
								padding: "0 0.75em",
								borderRadius: "0.875em",
								background: statusbg,
								fontSize: "0.875em",
								width: "fit-content",
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
								backgroundImage: `url(${traktProfile.displayAvatar.get() ?? traktProfile.defaultAvatar})`,
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
										fontSize: "0.875em",
										fontWeight: "600",
									},
								}),
								tray.stack(
									[
										tray.text(traktProfile.username.get() ?? "<traktUserName>", {
											style: { fontWeight: "bolder" },
										}),
										tray.text(`ID: ${traktProfile.userId.get() ?? "<traktUserId>"}`, {
											style: {
												fontSize: "0.875em",
												color: "#6b656b",
												fontWeight: "600",
											},
										}),
									],
									{ gap: 0 }
								),
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
					onChange: ctx.eventHandler("trakt:temp-disable", (e) => {
						$storage.set("trakt:options-disableSync", e.value);
					}),
				});

				const manageList = tray.button("Manage List", {
					...buttonOpts,
					loading: state.loggingOut.get(),
					onClick: ctx.eventHandler("trakt:list-settings", () => {
						tabs.current.set(Tab.manageList);
					}),
				});

				const logs = tray.button("View Logs", {
					...buttonOpts,
					onClick: ctx.eventHandler("trakt:view-logs", () => {
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
			// Tray tab for checking logs
			[Tab.logs]() {
				const header = tray.flex(
					[
						tray.text("trakt Logs", {
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
							onClick: ctx.eventHandler("trakt:clear-logs", () => {
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

			[Tab.loading]() {
				return this.stack([this.logo()], 2);
			},

			[Tab.manageList]() {
				const jobType = tray.select("Job type", {
					size: "md",
					placeholder: "Select...",
					value: "import",
					disabled: state.syncing.get() || state.cancellingSync.get(),
					style: {
						borderRadius: "1em 1em 0 0",
					},
					options: [
						{
							label: "Import from Anilist",
							value: "import",
						},
					],
				});

				const jobTypeSubText = tray.text("Bring your AniList library into Trakt to sync progress.", {
					className: "border",
					style: {
						fontSize: "12px",
						color: "#ffc107",
						padding: "0.5em 0.5em 0.5em 1em",
						borderRadius: "0 0 1em 1em",
						marginTop: "-0.75em",
						background: "var(--neutral-900)",
						wordBreak: "normal",
						lineHeight: "normal",
						opacity: state.syncing.get() || state.cancellingSync.get() ? "0.5" : "1",
					},
				});

				const mediaType = tray.select("Media Type", {
					size: "md",
					placeholder: "Select...",
					value: "Anime",
					disabled: state.syncing.get() || state.cancellingSync.get(),
					options: [
						{
							label: "Anime",
							value: "Anime",
						},
					],
				});

				const syncType = tray.select("Sync Type", {
					size: "md",
					placeholder: "Select...",
					value: ManageListSyncType.Post,
					disabled: state.syncing.get() || state.cancellingSync.get(),
					style: {
						borderRadius: "1em 1em 0 0",
					},
					options: [
						{
							label: "Update Shared Entries",
							value: ManageListSyncType.Post,
						},
					] satisfies { label: string; value: ManageListSyncType }[],
					onChange: ctx.eventHandler("trakt:manage-list-sync-type", (e) => {
						const value = e.value as ManageListSyncType;
						const subtext: Record<ManageListSyncType, string> = {
							post: "Replace data for items found in both trackers. Items missing in either list are ignored.",
						};
						state.manageListSyncTypeDesc.set(subtext[value]);
					}),
				});

				const syncTypeSubText = tray.text(state.manageListSyncTypeDesc.get() || "\u200b", {
					className: "border",
					style: {
						fontSize: "12px",
						color: "#ffc107",
						padding: "0.5em 0.5em 0.5em 1em",
						borderRadius: "0 0 1em 1em",
						marginTop: "-0.75em",
						background: "var(--neutral-900)",
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
					onClick: ctx.eventHandler("trakt:manage-list-start-job", () => {
						if (state.syncing.get()) {
							state.syncing.set(false);
							state.cancellingSync.set(true);
							ctx.setTimeout(() => {
								state.cancellingSync.set(false);
							}, 5_000);
						} else {
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
								width: `${(state.syncProgressPercent.get() * 100).toString()}%`,
								height: "100%",
								background: "linear-gradient(to right, #f40613, #9f41c4)",
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
							background: "#2c2f36",
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
						tray.text(`[${state.syncProgressCurrent.get()}/${state.syncProgressTotal.get()}]`, {
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
			// Wrapper to retrieve the current tab
			get() {
				return this[this.current.get()]();
			},
		};

		function $_wait(ms: number, relyOnRateLimit: boolean = false): Promise<void> {
			return new Promise((resolve) => {
				// If not rate-limit aware, just wait normally
				if (!relyOnRateLimit) {
					return ctx.setTimeout(resolve, ms);
				}

				// Rate-limit aware wait
				const info = traktTokenManager.rateLimit.get();

				// No rate-limit info yet → fallback to normal wait
				if (!info) {
					return ctx.setTimeout(resolve, ms);
				}

				let extraDelay = 0;

				// Hard throttle: remaining == 0 or 1
				if (info.remaining <= 1) {
					extraDelay = info.reset * 1000; // reset is in seconds
				}
				// Soft throttle: remaining < 10% of limit
				else if (info.remaining < info.limit * 0.1) {
					extraDelay = 500; // gentle slowdown
				}

				// Final wait time
				const total = ms + extraDelay;
				log.sendInfo(`[WAIT] Throttling for ${(total / 1000).toFixed(2)} seconds...`);
				ctx.setTimeout(resolve, total);
			});
		}

		function unwrap<T>(value: T | null | undefined): T | undefined {
			if (value == null) return undefined;
			if (typeof value === "object") {
				const v = (value as any).valueOf?.();
				return v == null ? undefined : v;
			}
			return value;
		}

		function toISODate(startedAt?: { year?: number; month?: number; day?: number }): string | undefined {
			if (!startedAt?.year) return undefined; // year is required

			const year = startedAt.year;
			const month = startedAt.month ?? 1; // default to January if missing
			const day = startedAt.day ?? 1; // default to 1st if missing

			const date = new Date(year, month - 1, day);

			return date.toISOString();
		}

		function getAnilistEntries(mediaType: "Anime" | "Manga") {
			return ($anilist[`get${mediaType}Collection`](false).MediaListCollection?.lists ?? [])
				.flatMap((list) => list.entries)
				.filter((entry): entry is $app.AL_AnimeCollection_MediaListCollection_Lists_Entries => Boolean(entry))
				.map((entry) => {
					const { media, ...rest } = entry;
					return { ...rest, title: media?.title?.userPreferred, mediaId: media?.id };
				});
		}

		async function resolveTraktIdFromAnilistId(mediaId: number) {
			const res = await ctx.fetch("https://animeapi.my.id/anilist/" + mediaId);
			if (!res.ok) throw new Error(res.statusText);

			const data = await res.json();
			return {
				// Trakt ID, can be used for movie or show, website: https://trakt.tv/
				id: data.trakt as number | null,
				// Whether the entry is actually a split cour, which both Trakt and TMDB merge it into one
				mayInvalid: data.trakt_may_invalid as number | null,
				// Trakt season number, only available for shows
				season: data.trakt_season as number | null,
				// Trakt season ID
				seasonId: data.trakt_season_id as number | null,
				// Trakt slug
				slug: data.trakt_slug as string | null,
				// Trakt media type, can be movie or show
				type: data.trakt_type as "movies" | "shows" | null,
			};
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

		async function addTraktWatchlistEntry(traktId: number, type: "movies" | "shows", season?: number) {
			let body;

			if (type === "movies") {
				body = { movies: [{ ids: { trakt: traktId } }] };
			} else if (season != null) {
				body = {
					shows: [
						{
							ids: { trakt: traktId },
							seasons: [{ number: season }],
						},
					],
				};
			} else {
				body = { shows: [{ ids: { trakt: traktId } }] };
			}

			const res = await traktTokenManager.traktFetch("/sync/watchlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error(res.statusText);
			return res.json();
		}

		async function removeTraktWatchlistEntry(traktId: number, type: "movies" | "shows", season?: number) {
			let body;

			if (type === "movies") {
				body = { movies: [{ ids: { trakt: traktId } }] };
			} else if (season != null) {
				body = {
					shows: [
						{
							ids: { trakt: traktId },
							seasons: [{ number: season }],
						},
					],
				};
			} else {
				body = { shows: [{ ids: { trakt: traktId } }] };
			}

			const res = await traktTokenManager.traktFetch("/sync/watchlist/remove", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error(res.statusText);
			return await res.json();
		}

		async function removeTraktHistoryEntry(traktId: number, seasonId: number) {
			const histRes = await traktTokenManager.traktFetch(`/users/me/history/seasons/${seasonId}?extended=full`);
			if (!histRes.ok) throw new Error(`Unable to fetch history for season ${seasonId}: ${histRes.statusText}`);

			const ids = (await histRes.json()).map((h: any) => h.id);

			const res = await traktTokenManager.traktFetch("/sync/history/remove", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ids }),
			});

			if (!res.ok) throw new Error(res.statusText);
			return await res.json();
		}

		async function updateTraktSeasonProgress(traktId: number, seasonNumber: number, seasonId: number, progress: number) {
			const histRes = await traktTokenManager.traktFetch(`/users/me/history/seasons/${seasonId}?extended=full`);
			if (!histRes.ok) throw new Error(`Unable to fetch history for season ${seasonId}: ${histRes.statusText}`);

			const watchedHistory = await histRes.json();
			await $_wait(1500, true);

			// Build map: episodeNumber → watched_at
			const watchedMap = new Map<number, string>();

			for (const item of watchedHistory) {
				const ep = item.episode;
				if (ep?.number != null && item.watched_at) {
					watchedMap.set(ep.number, item.watched_at);
				}
			}

			// Build payload for episodes 1 → progress
			const now = new Date().toISOString();
			const episodesToSync = [];

			for (let epNumber = 1; epNumber <= progress; epNumber++) {
				const watched_at = epNumber === progress ? now : watchedMap.get(epNumber) ?? now;

				episodesToSync.push({
					ids: {
						number: epNumber,
						season: seasonNumber,
						show: traktId,
					},
					watched_at,
				});
			}

			const res = await traktTokenManager.traktFetch("/sync/history", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ episodes: episodesToSync }),
			});

			if (!res.ok) throw new Error(res.statusText);
			return await res.json();
		}

		async function updateTraktMovieProgress(traktId: number, date?: string) {
			const res = await traktTokenManager.traktFetch("/sync/history", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					movies: [{ ids: { trakt: traktId }, watched_at: date ?? new Date().toISOString() }],
				}),
			});

			if (!res.ok) throw new Error(res.statusText);
			return await res.json();
		}

		async function updateTraktRating(traktId: number, type: "movies" | "shows", rating: number) {
			const res = await traktTokenManager.traktFetch("/sync/ratings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					[type]: [{ ids: { trakt: traktId }, rating }],
				}),
			});

			if (!res.ok) throw new Error(res.statusText);
			return await res.json();
		}

		async function syncEntries() {
			log.sendInfo("[SYNCLIST] Starting sync job... (Anilist ➔ Trakt)");
			const entries = getAnilistEntries("Anime");

			if (!entries.length) {
				log.sendWarning("[SYNCLIST] No entries found.");
				log.sendWarning("[SYNCLIST] Sync job terminated.");
				return state.syncing.set(false);
			} else {
				log.sendInfo(`[SYNCLIST] Found ${entries.length} entries!`);
				state.syncProgressTotal.set(entries.length);
				state.syncProgressCurrent.set(0);
				state.syncProgressPercent.set(0 / entries.length);
			}

			while (state.syncing.get() && entries.length) {
				const entry = entries.pop();
				if (!entry) continue;

				state.syncProgressCurrent.set(state.syncProgressCurrent.get() + 1);
				state.syncProgressPercent.set(state.syncProgressCurrent.get() / state.syncProgressTotal.get());
				state.syncDetail.set(`Syncing ${entry.title ?? entry.mediaId}`);
				if (!entry.mediaId) continue;

				const trakt = await resolveTraktIdFromAnilistId(entry.mediaId).catch((e) => (e as Error).message);
				if (typeof trakt === "string") {
					log.sendError(`[SYNCLIST] Error on ${entry.title} (${entry.mediaId}): ${trakt}`);
					await $_wait(1_500, true);
					continue;
				} else if (!trakt.id || !trakt.type) {
					log.sendWarning(`[SYNCLIST] No matching records found for ${entry.title} (${entry.mediaId})`);
					await $_wait(1_500, true);
					continue;
				} else if (trakt.mayInvalid) {
					log.sendWarning(`[SYNCLIST] Part of a multi-cour series. Please manually add this entry to trakt: ${JSON.stringify(entry, null, 2)}`);
					await $_wait(1_500, true);
					continue;
				} else {
					await $_wait(1_500, true);
				}

				const status = unwrap(entry.status);
				if (status === "PLANNING") {
					await addTraktWatchlistEntry(trakt.id, trakt.type, trakt.season ?? undefined)
						.then((data) => {
							if (data.added[trakt.type!]) {
								log.sendSuccess(`[SYNCLIST] Added ${entry.title} to trakt.tv watchlist!`);
							} else {
								log.send(`[SYNCLIST] Skipped ${entry.title} to trakt.tv watchlist! (already exists)`);
							}
						})
						.catch((e) => log.sendError(`[SYNCLIST] Failed to add ${entry.title} to trakt.tv watchlist! ${(e as Error).message}`));
					await $_wait(1_500, true);
				} else {
					// Remove from traklist watchlist entry if not planning
					await removeTraktWatchlistEntry(trakt.id, trakt.type, trakt.season ?? undefined)
						.then((data) => {
							if (data.deleted[trakt.type!]) {
								log.sendSuccess(`[SYNCLIST] Removed ${entry.title} from watchlist (status not PLANNED)`);
							} else {
								log.send(`[SYNCLIST] Skipped removing ${entry.title} from watchlist (not found)`);
							}
						})
						.catch((e) => log.sendError(`[SYNCLIST] Failed to remove ${entry.title} from watchlist (status not PLANNED): ${(e as Error).message}`));
					await $_wait(1_500, true);

					// update score
					const score = unwrap(entry.score);
					// Use the score for season 1 only
					if (score && (trakt.season === 1 || trakt.season === null)) {
						await updateTraktRating(trakt.id, trakt.type, score / 10)
							.then(() => log.sendSuccess(`[SYNCLIST] Rated ${entry.title} (${entry.mediaId}) = ${score}`))
							.catch((e) => log.sendError(`[SYNCLIST] Failed to update score for ${entry.mediaId}: ${(e as Error).message}`));
						await $_wait(1_500, true);
					}

					// update progress for shows
					const progress = unwrap(entry.progress);
					if (progress && trakt.type === "shows") {
						// TV-SHOWS
						if (trakt.season && trakt.seasonId) {
							await updateTraktSeasonProgress(trakt.id, trakt.season, trakt.seasonId, progress)
								.then(() => log.sendSuccess(`[SYNCLIST] Marked episode ${progress} as watched for ${entry.title} (${entry.mediaId})`))
								.catch((e) => log.sendError(`[SYNCLIST] Error on updating progress for ${entry.title} (${entry.mediaId}): ${(e as Error).message}`));
							await $_wait(1_500, true);
						} else {
							log.sendWarning(`[SYNCLIST] Missing trakt-ids for ${entry.title} (${entry.mediaId}): ${{ trakt }}`);
						}
					} else {
						// MOVIES
						await updateTraktMovieProgress(trakt.id, toISODate(entry.completedAt))
							.then(() => log.sendSuccess(`[SYNCLIST] Marked movie ${entry.title}(${entry.mediaId}) as watched via progress!`))
							.catch((e) => log.sendError(`[SYNCLIST] Error on updating progress for ${entry.title}(${entry.mediaId}): ${(e as Error).message}`));
					}

					await $_wait(1_500, true);
				}
			}

			if (!state.syncing.get()) {
				// sync was cancelled
				log.sendWarning("[SYNCLIST] Syncing was terminated by user");
			} else {
				log.sendInfo("[SYNCLIST] Finished syncing entries!");
				state.syncing.set(false);
			}

			state.syncDetail.set(`Waiting...`);
			state.syncProgressTotal.set(0);
			state.syncProgressCurrent.set(0);
			state.syncProgressPercent.set(0);
		}

		$store.watch("POST_UPDATE_ENTRY", async (e: $app.PostUpdateEntryEvent) => {
			if (!e.mediaId) {
				log.sendWarning("postUpdate hook was triggered but it contained no mediaId");
				return $store.set("PRE_UPDATE_ENTRY_DATA", null);
			}

			const entry = await getMedia(e.mediaId);
			const title = entry?.media?.title?.userPreferred;
			if (!entry || entry.type === "Manga") {
				log.send("[Trakt.UpdateEntry] Manga detected. Aborting...");
				return $store.set("PRE_UPDATE_ENTRY_DATA", null);
			}

			const data: $app.PreUpdateEntryEvent = $store.get("PRE_UPDATE_ENTRY_DATA");
			if (!data) return log.sendWarning("No update data was emitted from the pre update hooks!");

			// consume the data
			$store.set("PRE_UPDATE_ENTRY_DATA", null);

			if (data.mediaId !== e.mediaId) {
				return log.sendWarning("preUpdate data was invalid!");
			}

			const trakt = await resolveTraktIdFromAnilistId(e.mediaId).catch((e) => (e as Error).message);
			if (typeof trakt === "string") {
				return log.sendError(`[Trakt.UpdateEntry] ${trakt}`);
			}

			if (!trakt.id || !trakt.type || trakt.mayInvalid) {
				return log.sendWarning(`[Trakt.UpdateEntry] No Trakt mapping for AniList ${e.mediaId}`);
			}

			const status = unwrap(data.status);
			if (status === "PLANNING") {
				await addTraktWatchlistEntry(trakt.id, trakt.type, trakt.season ?? undefined)
					.then((data) => {
						if (data.added[trakt.type!]) {
							log.sendSuccess(`[Trakt.UpdateEntry] Added ${title} to trakt.tv watchlist!`);
						} else {
							log.send(`[Trakt.UpdateEntry] Skipped ${title} to trakt.tv watchlist! (already exists)`);
						}
					})
					.catch((e) => log.sendError(`[Trakt.UpdateEntry] Failed to add ${title} to trakt.tv watchlist! ${(e as Error).message}`));
				return;
			} else {
				await removeTraktWatchlistEntry(trakt.id, trakt.type, trakt.season ?? undefined)
					.then((data) => {
						if (data.deleted[trakt.type!]) {
							log.sendSuccess(`[Trakt.UpdateEntry] Removed ${title ?? e.mediaId} from watchlist (status not PLANNED)`);
						}
					})
					.catch((e) => log.sendError(`[Trakt.UpdateEntry] Failed to remove ${title} from watchlist (status not PLANNED): ${(e as Error).message}`));
				await $_wait(1_500, true);
			}

			// scoring
			const score = unwrap(data.scoreRaw);
			// only rate season 1 and movies
			if (score && (trakt.type === "shows" ? trakt.season === 1 : true)) {
				await updateTraktRating(trakt.id, trakt.type, score / 10)
					.then(() => log.sendSuccess(`[Trakt.UpdateEntry] Rated ${title} (${e.mediaId}) = ${(score / 10).toFixed(2)}`))
					.catch((e) => log.sendError(`[Trakt.UpdateEntry] Failed to update score for ${title} (${e.mediaId}): ${(e as Error).message}`));
				await $_wait(2_000);
			}

			const progress = unwrap(data.progress);
			if (!progress) return;

			if (trakt.type === "shows") {
				if (trakt.season && trakt.seasonId) {
					await updateTraktSeasonProgress(trakt.id, trakt.season, trakt.seasonId, progress)
						.then(() => log.sendSuccess(`[Trakt.UpdateEntry] Marked episode ${progress} as watched for ${title} (${e.mediaId})`))
						.catch((e) => log.sendError(`[Trakt.UpdateEntry] Error on updating progress for ${title} (${e.mediaId}): ${(e as Error).message}`));
				} else {
					log.sendWarning("[Trakt.UpdateEntry] Season not found!");
				}
			} else {
				await updateTraktMovieProgress(trakt.id, toISODate(data.completedAt))
					.then(() => log.sendSuccess(`[Trakt.UpdateEntry] Marked movie ${title} (${e.mediaId}) as watched via progress!`))
					.catch((e) => log.sendError(`[Trakt.UpdateEntry] Error on updating progress for ${title} (${e.mediaId}): ${(e as Error).message}`));
			}

			return;
		});

		$store.watch("POST_UPDATE_ENTRY_PROGRESS", async (e: $app.PostUpdateEntryProgressEvent) => {
			if (!e.mediaId) {
				log.sendWarning("postUpdate hook was triggered but it contained no mediaId");
				return $store.set("PRE_UPDATE_ENTRY_PROGRESS_DATA", null);
			}

			const entry = await getMedia(e.mediaId);
			const title = entry?.media?.title?.userPreferred;
			if (!entry || entry.type === "Manga") {
				log.send("[Trakt.UpdateEntryProgress] Manga detected. Aborting...");
				return $store.set("PRE_UPDATE_ENTRY_PROGRESS_DATA", null);
			}

			const data: $app.PreUpdateEntryProgressEvent = $store.get("PRE_UPDATE_ENTRY_PROGRESS_DATA");
			if (!data) return log.sendWarning("No update data was emitted from the pre update hooks!");

			// consume the data
			$store.set("PRE_UPDATE_ENTRY_PROGRESS_DATA", null);

			if (data.mediaId !== e.mediaId) {
				return log.sendWarning("preUpdate data was invalid!");
			}

			if (!("progress" in data) || data.progress === undefined || data.progress === null) {
				return log.sendWarning("No progress data was emitted from the pre update hooks!");
			}

			const trakt = await resolveTraktIdFromAnilistId(e.mediaId).catch((e) => (e as Error).message);
			if (typeof trakt === "string") {
				return log.sendError(`[Trakt.UpdateProgress] ${trakt}`);
			}

			if (!trakt.id || !trakt.type || trakt.mayInvalid) {
				return log.sendWarning(`[Trakt.UpdateProgress] No Trakt mapping for AniList ${e.mediaId}`);
			}

			await removeTraktWatchlistEntry(trakt.id, trakt.type, trakt.season ?? undefined)
				.then((data) => {
					if (data.deleted[trakt.type!]) {
						log.sendSuccess(`[Trakt.UpdateProgress] Removed ${title ?? e.mediaId} from watchlist (status not PLANNED)`);
					}
				})
				.catch((e) => log.sendError(`[Trakt.UpdateProgress] Failed to remove ${title} from watchlist (status not PLANNED): ${(e as Error).message}`));
			await $_wait(1_500, true);

			if (trakt.type === "shows") {
				if (trakt.season && trakt.seasonId) {
					await updateTraktSeasonProgress(trakt.id, trakt.season, trakt.seasonId, data.progress)
						.then(() => log.sendSuccess(`[Trakt.UpdateEntry] Marked episode ${data.progress} as watched for ${title} (${e.mediaId})`))
						.catch((e) => log.sendError(`[Trakt.UpdateEntry] Error on updating progress for ${title} (${e.mediaId}): ${(e as Error).message}`));
					await $_wait(1_500, true);
				} else {
					log.sendWarning("[Trakt.UpdateProgress] Season not found!");
				}
			} else {
				await updateTraktMovieProgress(trakt.id)
					.then(() => log.sendSuccess(`[Trakt.UpdateProgress] Marked movie ${title} (${e.mediaId}) as watched via progress!`))
					.catch((e) => log.sendError(`[Trakt.UpdateProgress] Error on updating progress for ${title} (${e.mediaId}): ${(e as Error).message}`));
			}
		});

		$store.watch("POST_DELETE_ENTRY", async (e: $app.PostDeleteEntryEvent) => {
			if (!e.mediaId) return log.sendWarning("postDelete hook was triggered but it contained no mediaId");

			const entry = await getMedia(e.mediaId);
			const title = entry?.media?.title?.userPreferred;
			if (!entry || entry.type === "Manga") {
				return log.send("[Trakt.DeleteEntry] Manga detected. Aborting...");
			}

			const trakt = await resolveTraktIdFromAnilistId(e.mediaId).catch((e) => (e as Error).message);
			if (typeof trakt === "string") {
				return log.sendError(`[Trakt.DeleteEntry] ${trakt}`);
			}

			if (!trakt.id || !trakt.type || trakt.mayInvalid) {
				return log.sendWarning(`[Trakt.DeleteEntry] No Trakt mapping for AniList ${e.mediaId}`);
			}

			await removeTraktWatchlistEntry(trakt.id, trakt.type, trakt.season ?? undefined)
				.then((data) => {
					if (data.deleted[trakt.type!]) {
						log.sendSuccess(`[Trakt.DeleteEntry] Removed ${title ?? e.mediaId} from watchlist`);
					}
				})
				.catch((e) => log.sendError(`[Trakt.DeleteEntry] Failed to remove ${title} from watchlist: ${(e as Error).message}`));
			await $_wait(1_500, true);

			if (trakt.seasonId) {
				await removeTraktHistoryEntry(trakt.id, trakt.seasonId)
					.then((data) => {
						if (data[trakt.type!]) {
							log.sendSuccess(`[Trakt.DeleteEntry] Removed ${title ?? e.mediaId} from history`);
						}
					})
					.catch((e) => log.sendError(`[Trakt.DeleteEntry] Failed to remove ${title} from history: ${(e as Error).message}`));
			} else {
				log.sendWarning(`[Trakt.DeleteEntry] ${title} does not have a trakt season id (history not deleted)`);
			}
		});

		tray.render(() => tabs.get());

		// Hopefuly this will fix the panic error on $store.watch
		// whenever the extension is initialized
		ctx.setTimeout(() => {
			$store.watch(log.id, () => {
				if (tabs.current.get() === Tab.logs) tray.update();
			});
		}, 5_000);

		// initialization starts here
		log.send("Initializing extension...");
		log.send("Checking availability of access tokens...");
		if (traktTokenManager.getAccessToken() === null) {
			log.sendWarning("No access token found!");
			if (traktTokenManager.token.refreshToken.get()) {
				log.send("Checking availability of refresh token...");
				traktTokenManager
					.refresh()
					.then(() => {
						log.sendSuccess("Successfully refreshed access token!");
						return traktTokenManager.getUserInfo();
					})
					.catch((err) => {
						log.sendError(`Refresh failed: ${(err as Error).message}`);
						log.sendError("Login required. Please login again.");
						state.loginError.set("Session Expired. Please login again.");
						tabs.current.set(Tab.logon);
					});
			}

			log.sendWarning("No refresh token found!");
			log.sendWarning("Login required. Please login.");
		} else {
			log.sendSuccess("Access token found!");
			log.sendInfo("Logging in...");
			traktTokenManager.getUserInfo();
		}
	});

	// HOOKS
	$app.onPostUpdateEntry((e) => {
		$store.set("POST_UPDATE_ENTRY", $clone(e));
		e.next();
	});

	$app.onPostUpdateEntryProgress((e) => {
		$store.set("POST_UPDATE_ENTRY_PROGRESS", $clone(e));
		e.next();
	});

	$app.onPostDeleteEntry((e) => {
		$store.set("POST_DELETE_ENTRY", { mediaId: e.mediaId, isDeleted: true });
		e.next();
	});

	$app.onPreUpdateEntry((e) => {
		$store.set("PRE_UPDATE_ENTRY_DATA", $clone(e));
		e.next();
	});

	$app.onPreUpdateEntryProgress((e) => {
		$store.set("PRE_UPDATE_ENTRY_PROGRESS_DATA", $clone(e));
		e.next();
	});
}
