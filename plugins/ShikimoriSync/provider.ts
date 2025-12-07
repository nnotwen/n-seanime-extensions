/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./shikimorisync.d.ts" />

// @ts-ignore
function init() {
	$ui.register(async (ctx) => {
		// CONSTANTS
		const iconUrl = "https://shikimori.one/favicons/favicon-96x96.png";
		const BASE_URI_V2 = "https://shikimori.one/api/v2";

		// Field Refs/States
		const authCode = ctx.fieldRef<string>("");
		const state = {
			loggingIn: ctx.state<boolean>(false),
			loginError: ctx.state<string | null>(null),
			loginLabel: ctx.state<string>("Login"),
			loggingOut: ctx.state<boolean>(false),
		};

		// Token Manager
		const tokenManager = {
			token: {
				accessToken: ctx.state<string | null>(($storage.get("shikimorisync.accessToken") as string | undefined) ?? null),
				refreshToken: ctx.state<string | null>(($storage.get("shikimorisync.refreshToken") as string | undefined) ?? null),
				expiresAt: ctx.state<number | null>(($storage.get("shikimorisync.expiresAt") as number | undefined) ?? null),
			},

			userAgent: "Shikimori Seanime Sync",
			clientId: "93Vlloacsr3lOZzD8Ttx3F7E4Pv9wUlLqaAuE9XcOhQ",
			clientSecret: "x49dnkFMduxIseuDSQE4g2mDjo9Nc8qCGMpIVe7mtKs",

			redirectUri: "urn:ietf:wg:oauth:2.0:oob",
			baseUri: "https://shikimori.one/oauth/token",

			getAccessToken() {
				if (!this.token.accessToken.get() || !this.token.refreshToken.get() || !this.token.expiresAt.get()) {
					return null;
				}
				if (Date.now() > this.token.expiresAt.get()!) {
					return null;
				}
				return this.token.accessToken.get();
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
				const expiresAt = Date.now() + data.expires_in * 1000;

				$storage.set("shikimorisync.accessToken", data.access_token);
				$storage.set("shikimorisync.refreshToken", data.refresh_token);
				$storage.set("shikimorisync.expiresAt", expiresAt);

				this.token.accessToken.set(data.access_token);
				this.token.refreshToken.set(data.refresh_token);
				this.token.expiresAt.set(expiresAt);
			},

			async refresh() {
				if (!this.token.refreshToken.get()) throw new Error("No refresh token available");

				const res = await fetch(this.baseUri, {
					method: "POST",
					headers: { "User-Agent": this.userAgent, "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						grant_type: "refresh_token",
						client_id: this.clientId,
						client_secret: this.clientSecret,
						refresh_token: this.token.refreshToken.get()!,
					}),
				});

				if (!res.ok) throw new Error(res.statusText);

				const data = await res.json();
				const expiresAt = Date.now() + data.expires_in * 1000;

				$storage.set("shikimorisync.accessToken", data.access_token);
				$storage.set("shikimorisync.refreshToken", data.refresh_token);
				$storage.set("shikimorisync.expiresAt", expiresAt);

				this.token.accessToken.set(data.access_token);
				this.token.refreshToken.set(data.refresh_token);
				this.token.expiresAt.set(expiresAt);
			},

			async withAuthHeaders(): Promise<Record<string, string>> {
				if (!this.getAccessToken()) {
					await this.refresh();
				}
				return {
					Authorization: `Bearer ${this.token!.accessToken.get()}`,
					"Content-Type": "application/json",
					"User-Agent": this.userAgent,
				};
			},

			async getUserInfo() {
				const res = await ctx.fetch("https://shikimori.one/api/users/whoami", {
					method: "GET",
					headers: await this.withAuthHeaders(),
				});

				if (!res.ok) {
					throw new Error(`Failed to fetch whoAmI: ${res.statusText}`);
				}

				const data: ShikimoriWhoami = await res.json();

				// populate profile
				shikimoriProfile.userId.set(data.id);
				shikimoriProfile.status.set(ConnectionState.Connected);
				if (data.avatar) shikimoriProfile.displayAvatar.set(data.avatar);
				if (data.name || data.nickname) shikimoriProfile.username.set(data.name ?? data.nickname!);

				// if user is available, do not send into the login page
				tabs.current.set(Tab.landing);

				return data;
			},

			reset() {
				$storage.set("shikimorisync.accessToken", null);
				$storage.set("shikimorisync.refreshToken", null);
				$storage.set("shikimorisync.expiresAt", null);
				this.token.accessToken.set(null);
				this.token.refreshToken.set(null);
				this.token.expiresAt.set(null);
			},
		};

		enum ConnectionState {
			Disconnected = "Отключено",
			Connected = "Подключено",
		}

		const shikimoriProfile = {
			// prettier-ignore
			defaultAvatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGQ9Ik0xMSA2YTMgMyAwIDEgMS02IDAgMyAzIDAgMCAxIDYgMCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTAgOGE4IDggMCAxIDEgMTYgMEE4IDggMCAwIDEgMCA4bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxIi8+PC9zdmc+",
			displayAvatar: ctx.state<string | null>(null),
			userId: ctx.state<number | null>(null),
			username: ctx.state<string | null>(null),
			status: ctx.state<ConnectionState | null>(ConnectionState.Disconnected),
			reset() {
				this.displayAvatar.set(null);
				this.userId.set(null);
				this.username.set(null);
				this.status.set(ConnectionState.Disconnected);
			},
		};

		// logger
		const log = {
			id: "shikimori:f9e08ae1-6a98-4ad8-b832-5cde59c7e94c",
			record(message: [string, "Info" | "Warning" | "Error" | "Log" | "Success"]) {
				$store.set(this.id, [...($store.get(this.id) ?? []), message]);
			},

			getEntries(): [string, "Info" | "Warning" | "Error" | "Log" | "Success"][] {
				return $store.get(this.id) ?? [];
			},

			dateFormat() {
				return new Date().toISOString().slice(0, 19);
			},

			sendError(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Error"]);
				console.error(`[ShikimoriSync:Error] ${message}`);
			},

			sendInfo(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Info"]);
				console.info(`[ShikimoriSync:Info] ${message}`);
			},

			sendWarning(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Warning"]);
				console.warn(`[ShikimoriSync:Warning] ${message}`);
			},

			sendSuccess(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Success"]);
				console.log(`[ShikimoriSync:Success] ${message}`);
			},

			send(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Log"]);
				console.log(`[ShikimoriSync:Log] ${message}`);
			},
		};

		// Tab controller
		enum Tab {
			logon = "1",
			landing = "2",
			logs = "3",
		}

		// Tab manager
		const tabs = {
			current: ctx.state<Tab>(Tab.logon),
			config: {
				logo: "https://shikimori.one/assets/layouts/l-top_menu-v2/logo.svg",
				glyph: "https://shikimori.one/assets/layouts/l-top_menu-v2/glyph.svg",
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
										backgroundImage: `url(${this.config.glyph})`,
										backgroundSize: "contain",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										flexGrow: "0",
										flexShrink: "0",
									},
								}),
								tray.div([], {
									style: {
										width: "10em",
										backgroundImage: `url(${this.config.logo})`,
										backgroundSize: "contain",
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center",
										flexGrow: "0",
										flexShrink: "0",
									},
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
						tray.text("Для Сианиме", {
							style: { fontSize: "14px", textAlign: "center", marginTop: "-0.75em" },
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
						background: "linear-gradient(to bottom, #324143ff 0%, transparent 100%)",
						padding: "0.75rem",
					},
				});

				return tray.div([container, stack]);
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
					"Нажмите кнопку ниже, чтобы авторизовать приложение, затем скопируйте токен с сайта и вставьте его в поле ниже.",
					{
						style: {
							textAlign: "justify",
							textAlignLast: "center",
							wordBreak: "normal",
						},
					}
				);

				const authButton = tray.anchor({
					text: "Авторизовать",
					// prettier-ignore
					href:`https://shikimori.one/oauth/authorize?client_id=${tokenManager.clientId}&redirect_uri=${encodeURIComponent(tokenManager.redirectUri)}&response_type=code&scope=user_rates`,
					target: "_blank",
					// prettier-ignore
					className: "UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border bg-gray-100 border-transparent hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 h-10 px-4 no-underline",
					style: {
						pointerEvents: state.loggingIn.get() ? "none" : "auto",
						opacity: state.loggingIn.get() ? "0.5" : "1",
					},
				});

				const authToken = tray.input({
					label: "\u200b",
					placeholder: "Токен авторизации",
					fieldRef: authCode,
					disabled: state.loggingIn.get(),
					style: {
						"-webkit-text-security": "disc",
					},
				});

				const login = tray.button({
					label: "Войти",
					intent: "gray-subtle",
					size: "md",
					loading: state.loggingIn.get(),
					style: {
						width: "100%",
					},
					onClick: ctx.eventHandler("shikimorisync:login", async () => {
						if (!authCode.current.length) {
							state.loginError.set("Ошибка: токен не введён.");
							return;
						} else {
							state.loginError.set(null);
						}

						// start logging in
						state.loggingIn.set(true);
						try {
							await tokenManager.exchangeCode(authCode.current);
							$storage.set("shikimorisync.authToken", authCode.current);
							await $_wait(5_000);
							await tokenManager.getUserInfo();
							log.sendSuccess("Successfully logged in!");
						} catch (e) {
							await $_wait(2_000);
							state.loginError.set(`Ошибка: ${(e as Error).message}`);
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

			[Tab.landing]() {
				const logOut = tray.flex([
					tray.div([], { style: { flex: "1" } }),
					tray.button("Выйти", {
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
						onClick: ctx.eventHandler("shikimori:log-out", () => {
							log.sendInfo("Logging out...");
							state.loggingOut.set(true);

							// clear data
							tokenManager.reset();
							shikimoriProfile.reset();

							// Back to login screen
							ctx.setTimeout(() => {
								ctx.toast.success("Logged out of shikimori!");
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

				const statusbg = shikimoriProfile.status.get() === ConnectionState.Connected ? "#35ff5098" : "#ff353598";

				const status = tray.flex(
					[
						tray.text(shikimoriProfile.status.get() ?? "<???>", {
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
								backgroundImage: `url(${shikimoriProfile.displayAvatar.get() ?? shikimoriProfile.defaultAvatar})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								borderRadius: "50%",
								width: "5rem",
								height: "5rem",
							},
						}),
						tray.flex(
							[
								tray.text("Вход выполнен как", {
									style: {
										fontStyle: "Italic",
										fontSize: "0.875em",
										fontWeight: "600",
									},
								}),
								tray.stack(
									[
										tray.text(shikimoriProfile.username.get() ?? "<ShikimoriUserName>", {
											style: { fontWeight: "bolder" },
										}),
										tray.text(`ID: ${shikimoriProfile.userId.get() ?? "<ShikimoriUserId>"}`, {
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

				// These are disabled as backend for them are not ready yet
				const importBtn = tray.button("Импортировать из AniList", {
					...buttonOpts,
					disabled: true,
				});
				const importBtnChk = tray.checkbox("Перезаписать записи", {
					size: "sm",
					disabled: true,
				});
				const exportBtn = tray.button("Экспортировать в AniList", {
					...buttonOpts,
					disabled: true,
				});
				const exportBtnChk = tray.checkbox("Перезаписать записи", {
					size: "sm",
					disabled: true,
				});
				const Logs = tray.button("Просмотреть логи", {
					...buttonOpts,
					onClick: ctx.eventHandler("shikimori:view-logs", () => {
						tabs.current.set(Tab.logs);
					}),
					loading: state.loggingOut.get(),
				});

				const importExport = tray.stack(
					[tray.stack([importBtn, importBtnChk], { gap: 0.5 }), tray.stack([exportBtn, exportBtnChk], { gap: 0.5 })],
					{ gap: 1 }
				);

				const stack = tray.flex([status, userInfo, importExport, Logs], {
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
						tray.text("Логи Shikimori", {
							style: {
								alignSelf: "end",
								fontSize: "1.2em",
								fontWeight: "bolder",
							},
						}),
						tray.button("Назад", {
							size: "sm",
							intent: "gray-subtle",
							style: {
								width: "fit-content",
							},
							onClick: ctx.eventHandler("shikimori:navigate-landing", () => {
								tabs.current.set(Tab.landing);
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
			// Wrapper to retrieve the current tab
			get() {
				return this[this.current.get()]();
			},
		};

		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
			width: "fit-content",
		});

		tray.render(() => tabs.get());

		$store.watch(log.id, () => {
			try {
				if (tabs.current.get() === Tab.logs) {
					tray.update();
				}
			} catch (e) {
				// do nothing
			}
		});

		// initialization starts here
		log.send("Initializing extension...");
		log.send("Checking availability of access tokens...");
		if (tokenManager.getAccessToken() === null) {
			log.sendWarning("No access token found!");
			if (tokenManager.token.refreshToken.get()) {
				log.send("Checking availability of refresh token...");
				try {
					await tokenManager.refresh();
					log.sendSuccess("Successfully refreshed access token!");
					return tokenManager.getUserInfo();
				} catch (err) {
					log.sendError(`Refresh failed: ${(err as Error).message}`);
					log.sendError("Login required. Please login again.");
					state.loginError.set("Session Expired. Please login again.");
					tabs.current.set(Tab.logon);
					return;
				}
			}

			log.sendWarning("No refresh token found!");
			log.sendWarning("Login required. Please login.");
		} else {
			log.sendSuccess("Access token found!");
			log.sendInfo("Logging in...");
			tokenManager.getUserInfo();
		}

		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		// Backend
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

		function normalizeUserRateBase(
			list: $app.Anime_EntryListData | $app.Manga_EntryListData | null,
			update: PreUpdateData | null,
			type: "Anime" | "Manga"
		) {
			const body: Partial<UserRateBase> = {};

			// old data
			if (list) {
				if (list.progress) body[type === "Anime" ? "episodes" : "chapters"] = list.progress;
				if (list.repeat) body.rewatches = list.repeat;
				if (list.score) body.score = list.score / 10;
				if (list.status) body.status = normalizeStatus(list.status);
			}

			// overwrite body with new data
			if (update) {
				if ("status" in update && update.status) body.status = normalizeStatus(update.status);
				if ("scoreRaw" in update && update.scoreRaw) body.score = update.scoreRaw / 10;
				if ("progress" in update && update.progress) body[type === "Anime" ? "episodes" : "chapters"] = update.progress;
				if ("repeat" in update && update.repeat) body.rewatches = update.repeat;
			}

			log.send("Update body: " + JSON.stringify(body));

			return body;
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

		async function handlePostUpdateEntry(e: PostUpdateEntry) {
			// Early return for nonexistent media
			if (!e.mediaId) {
				// prettier-ignore
				log.sendWarning("postUpdate hook was triggered but it contained no mediaId")
				return;
			}

			// Early return for nonexsistent media
			const mediaData = await getMedia(e.mediaId);
			if (!mediaData) {
				log.sendWarning(`mediaData not found for media [${e.mediaId}]`);
				return;
			}

			if (!mediaData.media?.idMal) {
				log.sendWarning(`No equivalent Shikimori entry found for [${e.mediaId}]`);
				return;
			}

			try {
				const existingRate = await getUserRate(mediaData.media.idMal, mediaData.type, shikimoriProfile.userId.get()!);
				const updateData: PreUpdateData | null = $store.get("PRE_UPDATE_DATA");
				await $_wait(1_500);

				if (!updateData && !("isDeleted" in e)) {
					// prettier-ignore
					log.sendWarning("No update data was emitted from the pre update hooks!")
				} else {
					// consume the data
					$store.set("PRE_UPDATE_DATA", null);
				}

				// !!ExistingRate -> User has entry on shikimori
				if (existingRate) {
					// DELETE (Entry on Shikimori + No entry on AniList = remove Shikimori entry)
					if ("isDeleted" in e && e.isDeleted) {
						// prettier-ignore
						log.sendInfo("[ShikimoriLibrary.DELETE] preparing to remove entry from shikimori");
						const res = await del(existingRate.id).catch((e) => (e as Error).message);
						if (typeof res === "string") {
							log.sendError(`[ShikimoriLibrary.DELETE] ${res}`);
						} else {
							// prettier-ignore
							log.sendSuccess(`[ShikimoriLibrary.DELETE] removed [${e.mediaId} as ${mediaData.media.idMal}] from Shikimori`);
						}
						return;
					}

					// PATCH (Entry on Shikimori + Entry on Anilist = update entry)
					const patchBody: UserRatePatch = {
						user_rate: {
							user_id: shikimoriProfile.userId.get()!,
							...normalizeUserRateBase(mediaData.listData ?? null, updateData, mediaData.type),
						},
					};

					const res = await patch(existingRate.id, patchBody).catch((e) => (e as Error).message);

					if (typeof res === "string") {
						log.sendError(`[ShikimoriLibrary.PATCH] ${res}`);
					} else {
						// prettier-ignore
						log.sendSuccess(`[ShikimoriLibrary.PATCH] synced [${e.mediaId} as ${mediaData.media.idMal}] to Shikimori`);
					}
				} else {
					// !ExistingRate -> User has no entry on shikimori

					// No entry on shikimori + no entry on anilist
					if ("isDeleted" in e && e.isDeleted) {
						// prettier-ignore
						log.sendInfo(`[ShikimoriLibrary] Already synced (no entry on shikimori and anilist)`);
						return;
					}

					// POST (No entry on Shikimori + entry on anilist = create entry)
					const postBody: UserRateCreate = {
						user_rate: {
							target_id: mediaData.media.idMal,
							target_type: mediaData.type,
							user_id: shikimoriProfile.userId.get()!,
							...normalizeUserRateBase(mediaData.listData ?? null, updateData, mediaData.type),
						},
					};

					const res = await post(postBody).catch((e) => (e as Error).message);

					if (typeof res === "string") {
						log.sendError(`[ShikimoriLibrary.POST] ${res}`);
					} else {
						// prettier-ignore
						log.sendSuccess(`[ShikimoriLibrary.POST] synced [${e.mediaId} as ${mediaData.media.idMal}] to Shikimori`);
					}
				}
			} catch (e) {
				log.sendError((e as Error).message);
			}
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
