/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./traktSync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl =
			"https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/TraktSync/icon.png";
		const traktPin = ctx.fieldRef<string>("");
		const disableSyncing = ctx.fieldRef<boolean>($storage.get("trakt:options-disableSync")?.valueOf() ?? false);
		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
			width: "fit-content",
		});

		const state = {
			loggingIn: ctx.state<boolean>(false),
			loginError: ctx.state<string | null>(null),
			loginLabel: ctx.state<string>("Login"),
			loggingOut: ctx.state<boolean>(false),
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

		enum Tab {
			logon = "1",
			landing = "2",
			logs = "3",
			loading = "4",
		}

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
					0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
					0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
					0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
					0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
					0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
					0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
					0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
					0xc67178f2,
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

		// Token manager
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
				disableSyncing.setValue(false);
			},
		};

		enum ConnectionState {
			Disconnected = "Disconnected",
			Connected = "Connected",
		}

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
					fieldRef: traktPin,
					disabled: state.loggingIn.get(),
					style: {
						"-webkit-text-security": "disc",
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
						if (!traktPin.current.length) {
							state.loginError.set("Error: Please enter your PIN");
							return;
						} else {
							state.loginError.set(null);
						}

						// start logging in
						state.loggingIn.set(true);
						try {
							await traktTokenManager.exchangeCode(traktPin.current);
							await $_wait(5_000);
							await traktTokenManager.getUserInfo();
							log.sendSuccess("Successfully logged in!");
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
					fieldRef: disableSyncing,
					onChange: ctx.eventHandler("trakt:temp-disable", (e) => {
						$storage.set("trakt:options-disableSync", e.value);
					}),
				});

				const Logs = tray.button("View Logs", {
					...buttonOpts,
					onClick: ctx.eventHandler("trakt:view-logs", () => {
						tabs.current.set(Tab.logs);
					}),
					loading: state.loggingOut.get(),
				});

				const stack = tray.flex([status, userInfo, tempDisable, Logs], {
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
						tray.flex([
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
							tray.button("Go Back", {
								size: "sm",
								intent: "gray-subtle",
								style: {
									width: "fit-content",
								},
								onClick: ctx.eventHandler("trakt:navigate-landing", () => {
									tabs.current.set(Tab.landing);
								}),
							}),
						]),
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
							fontSize: "14px",
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

				return this.stack([this.logo(), header, terminal], 2);
			},

			[Tab.loading]() {
				return this.stack([this.logo()], 2);
			},
			// Wrapper to retrieve the current tab
			get() {
				return this[this.current.get()]();
			},
		};

		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
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

		// Add to Trakt watchlist
		async function addTraktEntry(traktId: number, type: "movies" | "shows") {
			const body = {
				[type]: [{ ids: { trakt: traktId } }],
			};

			const res = await traktTokenManager.traktFetch("/sync/watchlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error(res.statusText);
			return res.json();
		}

		// Remove from Trakt watchlist
		async function removeTraktEntry(traktId: number, type: "movies" | "shows") {
			const body = {
				[type]: [{ ids: { trakt: traktId } }],
			};

			const res = await traktTokenManager.traktFetch("/sync/watchlist/remove", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error(res.statusText);
		}

		async function handlePostUpdateEntry(e: PostUpdateEntry) {
			// Early return for nonexistent media
			if (!e.mediaId) {
				// prettier-ignore
				log.sendWarning("postUpdate hook was triggered but it contained no mediaId")
				return $store.set("PRE_UPDATE_DATA", null);
			}

			if (disableSyncing.current.valueOf()) {
				log.sendInfo(`Syncing was disabled. Will not sync entry [${e.mediaId}]`);
				return $store.set("PRE_UPDATE_DATA", null);
			}

			// Early return for nonexsistent media
			const mediaData = await getMedia(e.mediaId);
			if (!mediaData) {
				log.sendWarning(`mediaData not found for media [${e.mediaId}]`);
				return $store.set("PRE_UPDATE_DATA", null);
			}

			if (mediaData.type !== "Anime") {
				log.sendWarning(`type=manga, skipping...`);
				return $store.set("PRE_UPDATE_DATA", null);
			}

			const trakt = await resolveTraktIdFromAnilistId(e.mediaId);
			if (!trakt.id || !trakt.type) {
				log.sendWarning(`No Trakt mapping for AniList ${e.mediaId}`);
				return $store.set("PRE_UPDATE_DATA", null);
			}

			// Handle deletion
			if ("isDeleted" in e && e.isDeleted) {
				log.sendInfo(`[TraktSync.DELETE] Removing ${e.mediaId} → Trakt ${trakt.id}`);
				await removeTraktEntry(trakt.id, trakt.type)
					.then(() => log.sendInfo(`[TraktSync.DELETE] Removed ${e.mediaId} from Trakt`))
					.catch((e) => log.sendError(e.message));
				return $store.set("PRE_UPDATE_DATA", null);
			}

			const updateData: PreUpdateData | null = $store.get("PRE_UPDATE_DATA");
			if (!updateData) {
				log.sendWarning("No update data was emitted from the pre update hooks!");
				log.send("Cancelling syncing of media " + e.mediaId);
				return;
			} else {
				$store.set("PRE_UPDATE_DATA", null); // consume it
			}

			// handle rating
			if ("scoreRaw" in updateData && updateData.scoreRaw) {
				const rating = Math.round(updateData.scoreRaw / 10);
				await traktTokenManager
					.traktFetch("/sync/ratings", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							[trakt.type]: [{ ids: { trakt: trakt.id }, rating }],
						}),
					})
					.then(async (res) => {
						log.sendInfo(`[TraktSync.RATING] Rated ${e.mediaId} → Trakt ${trakt.id} = ${rating}`);
					})
					.catch((err) => log.sendError(err.message));
			}

			// Progress for shows
			if ("progress" in updateData && updateData.progress && trakt.type === "shows") {
				const progress = updateData.progress;
				const season = trakt.season ?? 1;
				// fetch episodes from Trakt
				const epRes = await traktTokenManager.traktFetch(`/shows/${trakt.id}/seasons/${season}`);

				if (epRes.ok) {
					const episodes = await epRes.json();
					const watched = episodes.slice(0, progress).map((ep: any) => ({
						ids: { trakt: ep.ids.trakt },
						watched_at: new Date().toISOString(),
					}));
					const payload = { episodes: watched };
					await traktTokenManager.traktFetch("/sync/history", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					});
					log.sendInfo(`[TraktSync.HISTORY] Synced ${progress} episodes for ${e.mediaId}`);
				} else {
					log.sendWarning(`[TraktSync.HISTORY] Unable to get [/shows/${trakt.id}/seasons/${season}]`);
				}
			}

			// progress for movies
			if ("progress" in updateData && updateData.progress && trakt.type === "movies") {
				await traktTokenManager.traktFetch("/sync/history", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						movies: [{ ids: { trakt: trakt.id }, watched_at: new Date().toISOString() }],
					}),
				});
				log.sendInfo(`[TraktSync.HISTORY] Marked movie ${e.mediaId} as watched via progress`);
			}

			// Handle status → watchlist
			const status = "status" in updateData && updateData.status ? updateData.status.toUpperCase() : null;

			if (status === "PLANNING") {
				await addTraktEntry(trakt.id, trakt.type)
					.then(() => log.sendSuccess(`[TraktSync.WATCHLIST] Added ${e.mediaId} to Trakt watchlist`))
					.catch((err) => log.sendError(err.message));
			} else if (status === "COMPLETED" || status === "DROPPED") {
				await removeTraktEntry(trakt.id, trakt.type)
					.then(() => log.sendSuccess(`[TraktSync.WATCHLIST] Removed ${e.mediaId} from Trakt watchlist`))
					.catch((err) => log.sendError(err.message));

				// For movies, also mark them watched in history when COMPLETED
				if (trakt.type === "movies" && status === "COMPLETED") {
					await traktTokenManager
						.traktFetch("/sync/history", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								movies: [
									{
										ids: { trakt: trakt.id },
										watched_at: new Date().toISOString(),
									},
								],
							}),
						})
						.catch((err) => log.sendError(err.message));
					log.sendInfo(`[TraktSync.HISTORY] Marked movie ${e.mediaId} as watched`);
				}
			} else if (status === "CURRENT" || status === "REPEATING") {
				// For shows, handled via episode history above
				// For movies, you can also mark them watched once here if desired
				if (trakt.type === "movies") {
					await traktTokenManager
						.traktFetch("/sync/history", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								movies: [
									{
										ids: { trakt: trakt.id },
										watched_at: new Date().toISOString(),
									},
								],
							}),
						})
						.catch((err) => log.sendError(err.message));
					log.sendInfo(`[TraktSync.HISTORY] Marked movie ${e.mediaId} as watched (CURRENT/REPEATING)`);
				}
			}
		}

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

		$store.watch("POST_UPDATE_ENTRY", handlePostUpdateEntry);
		$store.watch("POST_UPDATE_ENTRY_PROGRESS", handlePostUpdateEntry);
		$store.watch("POST_UPDATE_ENTRY_REPEAT", handlePostUpdateEntry);
		$store.watch("POST_DELETE_ENTRY", handlePostUpdateEntry);
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

	$app.onPostUpdateEntryRepeat((e) => {
		$store.set("POST_UPDATE_ENTRY_REPEAT", $clone(e));
		e.next();
	});

	$app.onPostDeleteEntry((e) => {
		$store.set("POST_DELETE_ENTRY", { mediaId: e.mediaId, isDeleted: true });
		e.next();
	});

	$app.onPreUpdateEntry((e) => {
		$store.set("PRE_UPDATE_DATA", $clone(e));
		e.next();
	});

	$app.onPreUpdateEntryProgress((e) => {
		$store.set("PRE_UPDATE_DATA", $clone(e));
		e.next();
	});

	$app.onPreUpdateEntryRepeat((e) => {
		$store.set("PRE_UPDATE_DATA", $clone(e));
		e.next();
	});
}
