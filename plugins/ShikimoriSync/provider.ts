/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./shikimorisync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const BASE_URI_V2 = "https://shikimori.one/api/v2";
		const iconUrl = "https://shikimori.one/favicons/favicon-96x96.png";
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
			Disconnected = "Отключено",
			Connected = "Подключено",
		}

		const manageListJobTypeDesc: Record<ManageListJobType, string> = {
			[ManageListJobType.Import]: "Импортируйте свою библиотеку AniList в Shikimori, чтобы синхронизировать прогресс.",
			[ManageListJobType.Export]: "Обновите AniList с учётом ваших текущих записей на Shikimori.",
		};

		const manageListSyncTypeDesc: Record<ManageListSyncType, string> = {
			[ManageListSyncType.Patch]: "Импортирует только те тайтлы, которых нет в вашем списке. Существующие записи не изменяются.",
			[ManageListSyncType.Post]: "Заменяет данные для тайтлов, которые есть в обоих трекерах. Отсутствующие в одном из списков игнорируются.",
			[ManageListSyncType.FullSync]: "Делает оба трекера идентичными. Общие записи обновляются, а отсутствующие в одном из списков удаляются.",
		};

		const fieldRefs = {
			authCode: ctx.fieldRef<string>(""),
			disableSyncing: ctx.fieldRef<boolean>($storage.get("shikimori:options-disableSync")?.valueOf() ?? false),
			manageListJobType: ctx.fieldRef<ManageListJobType>(ManageListJobType.Import),
			manageListMediaType: ctx.fieldRef<"Anime" | "Manga">("Anime"),
			manageListSyncType: ctx.fieldRef<ManageListSyncType>(ManageListSyncType.Patch),
		};

		const state = {
			loggingIn: ctx.state<boolean>(false),
			loginError: ctx.state<string | null>(null),
			loginLabel: ctx.state<string>("Войти"),
			loggingOut: ctx.state<boolean>(false),
			manageListJobTypeDesc: ctx.state<string>(manageListJobTypeDesc[ManageListJobType.Import]),
			manageListSyncTypeDesc: ctx.state<string>(manageListSyncTypeDesc[ManageListSyncType.Patch]),
			syncing: ctx.state<boolean>(false),
			cancellingSync: ctx.state<boolean>(false),
			syncProgressCurrent: ctx.state<number>(0),
			syncProgressTotal: ctx.state<number>(0),
			syncProgressPercent: ctx.state<number>(0),
			syncDetail: ctx.state<string>("Ожидание..."),
		};

		const log = {
			id: "shikimori:f9e08ae1-6a98-4ad8-b832-5cde59c7e94c",
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
				const token = this.token.accessToken.get();
				const expiry = this.token.expiresAt.get();
				if (!token || !expiry) return null;
				if (Date.now() > expiry) return null;
				return token;
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
				if (!this.getAccessToken()) await this.refresh();
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

				if (!res.ok) throw new Error(`Failed to fetch whoAmI: ${res.statusText}`);
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
				fieldRefs.disableSyncing.setValue(false);
			},
		};

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
					onClick: ctx.eventHandler("shikimori:navigate-landing", () => {
						tabs.current.set(Tab.landing);
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

				const info = tray.text("Нажмите кнопку ниже, чтобы авторизовать приложение, затем скопируйте токен с сайта и вставьте его в поле ниже.", {
					style: {
						textAlign: "justify",
						textAlignLast: "center",
						wordBreak: "normal",
					},
				});

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
					fieldRef: fieldRefs.authCode,
					disabled: state.loggingIn.get(),
					style: {
						// "-webkit-text-security": "disc",
					},
				});

				const login = tray.button({
					label: state.loginLabel.get(),
					intent: "gray-subtle",
					size: "md",
					loading: state.loggingIn.get(),
					style: {
						width: "100%",
					},
					onClick: ctx.eventHandler("shikimorisync:login", async () => {
						if (!fieldRefs.authCode.current.length) {
							state.loginError.set("Ошибка: токен не введён.");
							return;
						} else {
							state.loginError.set(null);
						}

						// start logging in
						state.loggingIn.set(true);
						state.loginLabel.set("«Вход…»");
						log.sendInfo("Logging in...");

						try {
							await tokenManager.exchangeCode(fieldRefs.authCode.current);
							$storage.set("shikimorisync.authToken", fieldRefs.authCode.current);
							await $_wait(5_000);
							await tokenManager.getUserInfo();
							log.sendSuccess("Successfully logged in!");
						} catch (e) {
							await $_wait(2_000);
							state.loginError.set(`Ошибка: ${(e as Error).message}`);
							log.sendError("Login failed: " + (e as Error).message);
						} finally {
							state.loggingIn.set(false);
							state.loginLabel.set("Войти");
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

				const tempDisable = tray.switch("Временно отключить синхронизацию прогресса", {
					size: "sm",
					fieldRef: fieldRefs.disableSyncing,
					disabled: state.loggingOut.get(),
					onChange: ctx.eventHandler("shikimori:temp-disable", (e) => {
						$storage.set("shikimori:options-disableSync", e.value);
					}),
				});

				const manageList = tray.button("Управлять списком", {
					...buttonOpts,
					loading: state.loggingOut.get(),
					onClick: ctx.eventHandler("shikimori:list-settings", () => {
						tabs.current.set(Tab.manageList);
					}),
				});

				const logs = tray.button("Просмотреть логи", {
					...buttonOpts,
					onClick: ctx.eventHandler("shikimori:view-logs", () => {
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
						tray.text("Логи Shikimori", {
							style: {
								alignSelf: "end",
								fontSize: "1.2em",
								fontWeight: "bolder",
							},
						}),
						tray.button("Очистить", {
							size: "sm",
							intent: "alert-subtle",
							style: {
								width: "fit-content",
							},
							onClick: ctx.eventHandler("shikimori:clear-logs", () => {
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
				const jobType = tray.select("Тип задачи", {
					size: "md",
					value: ManageListJobType.Import,
					fieldRef: fieldRefs.manageListJobType,
					disabled: state.syncing.get() || state.cancellingSync.get(),
					style: {
						borderRadius: "1em 1em 0 0",
					},
					options: [
						{
							label: "Импорт из AniList",
							value: ManageListJobType.Import,
						},
						{
							label: "Экспорт в AniList",
							value: ManageListJobType.Export,
						},
					] satisfies { label: string; value: ManageListJobType }[],
					onChange: ctx.eventHandler("shikimori:manage-list-job-type", (e) => {
						const value = e.value as ManageListJobType;
						fieldRefs.manageListJobType.setValue(value);
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
						background: "var(--neutral-900)",
						wordBreak: "normal",
						lineHeight: "normal",
						opacity: state.syncing.get() || state.cancellingSync.get() ? "0.5" : "1",
					},
				});

				const mediaType = tray.select("Тип медиа", {
					size: "md",
					placeholder: "Select...",
					value: "Anime",
					disabled: state.syncing.get() || state.cancellingSync.get(),
					options: [
						{
							label: "Аниме",
							value: "Anime",
						},
						{
							label: "Манга",
							value: "Manga",
						},
					],
				});

				const syncType = tray.select("Тип синхронизации", {
					size: "md",
					fieldRef: fieldRefs.manageListSyncType,
					disabled: state.syncing.get() || state.cancellingSync.get(),
					style: {
						borderRadius: "1em 1em 0 0",
					},
					options: [
						{
							label: "Добавить отсутствующие записи",
							value: ManageListSyncType.Patch,
						},
						{
							label: "Обновить общие записи",
							value: ManageListSyncType.Post,
						},
						{
							label: "Зеркалировать списки",
							value: ManageListSyncType.FullSync,
						},
					] satisfies { label: string; value: ManageListSyncType }[],
					onChange: ctx.eventHandler("trakt:manage-list-sync-type", (e) => {
						const value = e.value as ManageListSyncType;
						state.manageListSyncTypeDesc.set(manageListSyncTypeDesc[value]);
					}),
				});

				const syncTypeSubText = tray.text(state.manageListSyncTypeDesc.get() || "\u200b", {
					className: "border",
					style: {
						fontSize: "12px",
						color: {
							[ManageListSyncType.Patch]: "#17a2b8",
							[ManageListSyncType.Post]: "#ffc107",
							[ManageListSyncType.FullSync]: "#ef5765",
						}[fieldRefs.manageListSyncType.current],
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
					label: state.syncing.get() || state.cancellingSync.get() ? "Отмена" : "Синхронизировать!",
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
								width: `${(state.syncProgressPercent.get() * 100).toString()}%`,
								height: "100%",
								background: "#35ff5098",
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

			[Tab.manageListDanger]() {
				const container = tray.stack(
					[
						tray.text(
							"Продолжение этой операции приведёт к полной перезаписи вашего списка. Все записи, которых нет в списке‑источнике, будут безвозвратно удалены. Нажимая кнопку ниже, вы подтверждаете, что осознаёте риск, понимаете последствия и согласны продолжить несмотря на возможную потерю данных.",
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
						tray.button({
							label: "Продолжить",
							intent: "alert",
							size: "md",
							onClick: ctx.eventHandler("shikimori:sync-danger-accepted", () => {
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

		function popByProperty<T, K extends keyof T>(entries: T[], prop: K, value: T[K]): T | undefined {
			const index = entries.findIndex((e) => unwrap(e[prop]) === value);
			if (index === -1) return undefined;

			const [removed] = entries.splice(index, 1);
			return removed;
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

			if (!res.ok) throw new Error(res.statusText);

			return await res.json();
		}

		async function fetchAllRates(userId: number, type: "Anime" | "Manga"): Promise<ShikimoriUserRate[]> {
			const limit = 500;
			let page = 1;
			let results = [];

			while (true) {
				const res = await fetch(`${BASE_URI_V2}/user_rates/?userId=${userId}&target_type=${type}limit=${limit}&page=${page}`, {
					headers: await tokenManager.withAuthHeaders(),
				});

				const chunk = await res.json();
				results.push(...chunk);

				if (chunk.length < limit) break;
				page++;
				await $_wait(1_500);
			}

			return results;
		}

		async function patch(userRateId: number, body: UserRatePatch) {
			const res = await ctx.fetch(`${BASE_URI_V2}/user_rates/${userRateId}`, {
				method: "PATCH",
				headers: await tokenManager.withAuthHeaders(),
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error(res.statusText);
			return (await res.json()) as UserRateResponse;
		}

		async function post(body: UserRateCreate) {
			const res = await ctx.fetch(`${BASE_URI_V2}/user_rates`, {
				method: "POST",
				headers: await tokenManager.withAuthHeaders(),
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error(res.statusText);
			return (await res.json()) as UserRateResponse;
		}

		async function del(userRateId: number): Promise<void> {
			const res = await ctx.fetch(`${BASE_URI_V2}/user_rates/${userRateId}`, {
				method: "DELETE",
				headers: await tokenManager.withAuthHeaders(),
			});

			if (!res.ok) throw new Error(res.statusText);
		}

		async function getUserRate(idMal: number, target: "Anime" | "Manga", userId: number): Promise<UserRateResponse | null> {
			const res = await ctx.fetch(`${BASE_URI_V2}/user_rates?target_id=${idMal}&target_type=${target}&user_id=${userId}`, {
				headers: await tokenManager.withAuthHeaders(),
			});

			if (!res.ok) throw new Error(res.statusText);

			const data = await res.json();
			return Array.isArray(data) && data.length > 0 ? data[0] : null;
		}

		function normalizeStatus(statusAL: $app.AL_MediaListStatus) {
			const map: Record<$app.AL_MediaListStatus, UserRateBase["status"]> = {
				COMPLETED: "completed",
				CURRENT: "watching",
				DROPPED: "dropped",
				PAUSED: "on_hold",
				PLANNING: "planned",
				REPEATING: "rewatching",
			};
			return map[statusAL];
		}

		function normalizeShikomoriStatus(status: Exclude<UserRateBase["status"], undefined>) {
			const map: Record<Exclude<UserRateBase["status"], undefined>, $app.AL_MediaListStatus> = {
				completed: "COMPLETED",
				watching: "CURRENT",
				dropped: "DROPPED",
				on_hold: "PAUSED",
				planned: "PLANNING",
				rewatching: "REPEATING",
			};
			return map[status];
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

		async function filterExistingMalIds(malIds: number[]) {
			const endpoint = "https://graphql.anilist.co";
			const chunkSize = 50;
			const existing: { id: number; idMal: number; title: string }[] = [];

			// Split MAL IDs into chunks of 50
			const chunks: number[][] = [];
			for (let i = 0; i < malIds.length; i += chunkSize) {
				chunks.push(malIds.slice(i, i + chunkSize));
			}

			// Query AniList sequentially to avoid rate limits
			for (const chunk of chunks) {
				let page = 1;

				while (true) {
					// prettier-ignore
					const query = "query ($page: Int, $perPage: Int, $malIds: [Int]) { Page(page: $page, perPage: $perPage) { media(idMal_in: $malIds) { id idMal title { userPreferred }} } }";
					const variables = { page, perPage: 50, malIds: chunk };

					const res = await fetch(endpoint, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ query, variables }),
					});

					await $_wait(1_500);

					const json = await res.json();
					const media = json.data.Page.media;

					for (const m of media) {
						if (m.idMal != null) {
							existing.push({ id: m.id, idMal: m.idMal, title: m.title.userPreferred });
						}
					}

					if (media.length < 50) break;
					page++;
				}
			}

			return existing;
		}

		async function syncEntries() {
			const jobType = fieldRefs.manageListJobType.current;
			const mediaType = fieldRefs.manageListMediaType.current;
			const syncType = fieldRefs.manageListSyncType.current;
			const shikimoriUserId = shikimoriProfile.userId.get()!;

			// Anilist ➔ Shikimori
			if (jobType === ManageListJobType.Import) {
				log.sendInfo("[SYNCLIST] Starting sync job... (Anilist ➔ Shikimori)");
				const entries = getAnilistEntries(mediaType);

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

				const shikimoriEntries =
					syncType === ManageListSyncType.FullSync ? await fetchAllRates(shikimoriUserId, mediaType).catch((e) => (e as Error).message) : [];

				if (typeof shikimoriEntries === "string") {
					log.sendError(`[SYNCLIST] Error encountered (fall back to method POST): ${shikimoriEntries}`);
				}

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop()!;
					state.syncProgressCurrent.set(state.syncProgressCurrent.get() + 1);
					state.syncProgressPercent.set(state.syncProgressCurrent.get() / state.syncProgressTotal.get());

					state.syncDetail.set(`Синхронизация ${entry?.title ?? entry?.mediaId}`);

					if (!entry.mediaId) continue;

					// RETRIEVE ID_MAL
					const media = await getMedia(entry.mediaId);
					if (!media) {
						log.sendError("[SYNCLIST] Could not retrieve media object for " + entry.mediaId);
						continue;
					}

					if (!media.media?.idMal) {
						log.sendError(`[SYNCLIST] ${entry.title} has no equivalent malId`);
						continue;
					}

					if (unwrap(entry.private)) {
						log.sendWarning(`[SYNCLIST] Skipping ${entry.title} (private)...`);
						continue;
					}

					// RETRIEVE SHIKIMORI-RATE-ID
					const idMal = media.media.idMal;
					const rate = await getUserRate(idMal, mediaType, shikimoriProfile.userId.get()!).catch((e) => (e as Error).message);
					await $_wait(1_500);
					if (typeof rate === "string") {
						log.sendError(`[SYNCLIST] ${rate}`);
						state.syncDetail.set(`Ожидание...`);
						state.syncProgressTotal.set(0);
						state.syncProgressCurrent.set(0);
						state.syncProgressPercent.set(0);
						state.syncing.set(false);
						return;
					}

					const rateBase: UserRateBase = {
						user_id: shikimoriProfile.userId.get()!,
					};

					// status
					const status = unwrap(entry.status);
					if (status) rateBase.status = normalizeStatus(status);
					// score
					const score = unwrap(entry.score);
					if (score !== undefined && score !== null) rateBase.score = score / 10;
					// progress
					const progress = unwrap(entry.progress);
					if (progress) {
						if (mediaType === "Anime") rateBase.episodes = progress;
						if (mediaType === "Manga") rateBase.chapters = progress;
					}
					// repeat
					const repeat = unwrap(entry.repeat);
					if (repeat !== undefined && mediaType === "Anime") rateBase.rewatches = repeat;
					// text
					const notes = unwrap(entry.notes);
					if (notes) rateBase.text = notes;

					if (rate && syncType === ManageListSyncType.FullSync && typeof shikimoriEntries !== "string") {
						// remove from shikimoriEntries (array of entries pending deletion)
						popByProperty(shikimoriEntries, "id", rate.id);
					}

					// Add missing entries (Omit if rate exists)
					if (rate && syncType === ManageListSyncType.Patch) {
						log.sendWarning(`[SYNCLIST] Skipped ${entry.title} (already exists)`);
						continue;
					}

					// Update shared entries (both post and patch)
					if (rate) {
						await patch(rate.id, { user_rate: { ...rateBase } })
							.then(() => log.sendSuccess(`[SYNCLIST] Updated ${entry.title} on Shikimori.`))
							.catch((e) => log.sendError(`[SYNCLIST] Failed to update ${entry.title} on Shikimori ${(e as Error).message} ${JSON.stringify(rateBase)}`));
					} else {
						await post({ user_rate: { target_id: idMal, target_type: mediaType, ...rateBase } })
							.then(() => log.sendSuccess(`[SYNCLIST] Added ${entry.title} to Shikimori.`))
							.catch((e) => log.sendError(`[SYNCLIST] Failed to add ${entry.title} to Shikimori ${(e as Error).message} ${JSON.stringify(rateBase)}`));
					}
					await $_wait(1_500);
				}

				if (syncType === ManageListSyncType.FullSync && typeof shikimoriEntries !== "string" && state.syncing.get()) {
					log.sendInfo(`[SYNCLIST] Found ${shikimoriEntries.length} remaining entries. Purging...`);
					state.syncDetail.set(`«Очищаю ${shikimoriEntries.length} записей…»`);

					state.syncProgressTotal.set(shikimoriEntries.length);
					state.syncProgressCurrent.set(0);
					state.syncProgressPercent.set(0 / shikimoriEntries.length);

					const validMalIds = await filterExistingMalIds(shikimoriEntries.map((x) => x.target_id)).catch((e) => (e as Error).message);

					if (typeof validMalIds === "string") {
						log.sendError(`[SYNCLIST] ${validMalIds}`);
					} else {
						while (state.syncing.get() && shikimoriEntries.length) {
							const shikimoriEntry = shikimoriEntries.pop()!;
							const userRateId = shikimoriEntry.id;
							const mediaTitle = validMalIds.find((x) => x.idMal === shikimoriEntry.target_id)?.title;

							state.syncProgressCurrent.set(state.syncProgressCurrent.get() + 1);
							state.syncProgressPercent.set(state.syncProgressCurrent.get() / state.syncProgressTotal.get());
							state.syncDetail.set(`«Очищаю ${mediaTitle ?? "тайтл"}…»`);

							// Only delete entries if it exists in Anilist Database
							if (!validMalIds.some((x) => x.idMal === shikimoriEntry.target_id)) {
								log.sendWarning(`[SYNCLIST] Entry malId/${mediaTitle ?? shikimoriEntry.target_id} does not exist in Anilist. Skipping...`);
								continue;
							}

							del(userRateId)
								.then(() => log.sendSuccess(`[SYNCLIST] Removed ${mediaTitle ?? "media"} from Shikimori!`))
								.catch((e) => log.sendError(`[SYNCLIST] Failed to remove ${mediaTitle ?? "media"} from Shikimori: ${(e as Error).message}`));

							await $_wait(1_500);
						}
					}
				}
			}

			// Shikimori ➔ Anilist
			if (jobType === ManageListJobType.Export) {
				log.sendInfo("[SYNCLIST] Starting sync job... (Shikimori ➔ Anilist)");
				const entries = await fetchAllRates(shikimoriUserId, mediaType)
					.then((data) =>
						data.map((e) => ({
							idMal: e.target_id,
							score: e.score,
							progress: e.target_type === "Anime" ? e.episodes : e.chapters,
							progressVolumes: e.volumes,
							status: normalizeShikomoriStatus(e.status),
							notes: e.text,
							repeat: e.rewatches,
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
					state.syncProgressTotal.set(entries.length);
					state.syncProgressCurrent.set(0);
					state.syncProgressPercent.set(0 / entries.length);
				}

				// prettier-ignore
				const query = "mutation ( $mediaId: Int!, $status: MediaListStatus, $progress: Int, $progressVolumes: Int, $score: Float, $repeat: Int, $notes: String ) { SaveMediaListEntry( mediaId: $mediaId, status: $status, progress: $progress, progressVolumes: $progressVolumes, score: $score, repeat: $repeat,  notes: $notes) { id status progress progressVolumes score repeat notes startedAt { year month day } completedAt { year month day } } }";
				const anilistGlobalEntries = await filterExistingMalIds(entries.map((e) => e.idMal)).catch((e) => (e as Error).message);
				const anilistEntries = syncType === ManageListSyncType.FullSync ? getAnilistEntries(mediaType).filter((x) => !unwrap(x.private)) : [];

				if (typeof anilistGlobalEntries === "string") {
					log.sendError(`[SYNCLIST] ${anilistGlobalEntries}`);
					log.send("Terminating sync...");
					state.syncing.set(false);
					state.syncDetail.set(`Ожидание...`);
					state.syncProgressTotal.set(0);
					state.syncProgressCurrent.set(0);
					state.syncProgressPercent.set(0);
					return;
				}

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop()!;
					const listEntry = popByProperty(anilistEntries, "idMal", entry.idMal);
					const { id, title } = anilistGlobalEntries.find((x) => x.idMal === entry.idMal) ?? {};
					state.syncProgressCurrent.set(state.syncProgressCurrent.get() + 1);
					state.syncProgressPercent.set(state.syncProgressCurrent.get() / state.syncProgressTotal.get());
					state.syncDetail.set(`Синхронизация ${title ?? "shikimori-id/" + entry.idMal}`);

					if (!id) {
						log.sendWarning(`[SYNCLIST] Skipped shikomori-id/${entry.idMal}. No matching media found on Anilist.`);
						continue;
					}

					const body: any = {};
					if (listEntry) {
						body.id = listEntry.id;
					} else {
						body.mediaId = id;
					}
					if (entry.status) body.status = entry.status;
					if (entry.progress) body.progress = entry.progress;
					if (entry.progressVolumes) body.progressVolumes = entry.progressVolumes;
					if (entry.score) body.score = entry.score * 10;
					if (entry.repeat) body.repeat = entry.repeat;
					if (entry.notes) body.notes = entry.notes;

					// Add missing entries (Omit if already exists)
					if (syncType === ManageListSyncType.Patch && listEntry) {
						log.sendWarning(`[SYNCLIST] Skipped ${title ?? "shikomori-id/" + entry.idMal} (already exists)`);
						continue;
					}

					await anilistQuery(query, body)
						.then(() => log.sendSuccess(`[SYNCLIST] Added ${title ?? "shikomori-id/" + entry.idMal} to Anilist.`))
						.catch((e) => log.sendError(`[SYNCLIST] Failed to add ${title ?? "shikomori-id/" + entry.idMal} to Anilist ${(e as Error).message} ${body}`));
					await $_wait(1_500);
				}

				if (syncType === ManageListSyncType.FullSync && state.syncing.get()) {
					log.sendInfo(`[SYNCLIST] Found ${anilistEntries.length} remaining entries. Purging...`);
					state.syncDetail.set(`«Очищаю ${anilistEntries.length} записей…»`);

					state.syncProgressTotal.set(anilistEntries.length);
					state.syncProgressCurrent.set(0);
					state.syncProgressPercent.set(0 / anilistEntries.length);
					const query = "mutation ($id: Int!) { DeleteMediaListEntry(id: $id) { deleted } }";

					while (state.syncing.get() && anilistEntries.length) {
						const anilistEntry = anilistEntries.pop()!;
						const mediaTitle = anilistEntry.title;

						state.syncProgressCurrent.set(state.syncProgressCurrent.get() + 1);
						state.syncProgressPercent.set(state.syncProgressCurrent.get() / state.syncProgressTotal.get());
						state.syncDetail.set(`«Очищаю ${mediaTitle ?? "тайтл"}…»`);

						// Check if entry exists in shikomori/mal
						if (!unwrap(anilistEntry.idMal)) {
							log.sendWarning(`[SYNCLIST] Entry ${mediaTitle} does not exist in shikomori. Skipping...`);
							continue;
						}

						anilistQuery(query, { id: anilistEntry.id })
							.then(() => log.sendSuccess(`[SYNCLIST] Removed ${mediaTitle ?? "media"} from Anilist!`))
							.catch((e) => log.sendError(`[SYNCLIST] Failed to remove ${mediaTitle ?? "media"} from Anilist: ${(e as Error).message}`));

						await $_wait(1_500);
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

			state.syncDetail.set(`Ожидание...`);
			state.syncProgressTotal.set(0);
			state.syncProgressCurrent.set(0);
			state.syncProgressPercent.set(0);
		}

		$store.watch("POST_UPDATE_ENTRY", async (e: $app.PostUpdateEntryEvent) => {
			if (!e.mediaId) {
				log.sendWarning("[Shikimori.UpdateEntry] postUpdate hook was triggered but it contained no mediaId");
				return $store.set("PRE_UPDATE_ENTRY_DATA", null);
			}

			const data: $app.PreUpdateEntryEvent = $store.get("PRE_UPDATE_ENTRY_DATA");
			if (!data) return log.sendWarning("[Shikimori.UpdateEntry] No update data was emitted from the pre update hooks!");
			$store.set("PRE_UPDATE_ENTRY_DATA", null); // consume the data

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`[Shikimori.UpdateEntry] Syncing was disabled. Will not sync entry [${e.mediaId}]`);
			}

			const entry = await getMedia(e.mediaId);
			if (!entry) return log.sendWarning(`[Shikimori.UpdateEntry] Media not found (${e.mediaId})`);

			if (!entry.media?.idMal) {
				return log.sendWarning(`[Shikimori.UpdateEntry] No equivalent Shikimori entry found for [${e.mediaId}]`);
			}

			if (data.mediaId !== e.mediaId) {
				return log.sendWarning("[Shikimori.UpdateEntry] preUpdate data was invalid!");
			}

			if (unwrap(getAnilistEntries(entry.type).find((x) => x.mediaId === e.mediaId)?.private)) {
				return log.sendWarning(`[Shikimori.UpdateEntry] ${entry.media.title?.userPreferred ?? "anilist-id/" + e.mediaId} is private. Skipping...`);
			}

			const rateBase: UserRateBase = {
				user_id: shikimoriProfile.userId.get()!,
			};

			// status
			if (data.status) rateBase.status = normalizeStatus(data.status);
			// score
			if (data.scoreRaw !== undefined && data.scoreRaw !== null) rateBase.score = data.scoreRaw / 10;
			// progress
			if (data.progress) {
				if (entry.type === "Anime") rateBase.episodes = data.progress;
				if (entry.type === "Manga") rateBase.chapters = data.progress;
			}

			const rate = await getUserRate(entry.media.idMal, entry.type, shikimoriProfile.userId.get()!).catch((e) => (e as Error).message);
			await $_wait(1_500);
			if (typeof rate === "string") {
				return log.sendError(`[Shikimori.UpdateEntry] ${rate}`);
			}

			const title = entry.media.title?.userPreferred;
			if (rate) {
				await patch(rate.id, { user_rate: { ...rateBase } })
					.then(() => log.sendSuccess(`[Shikimori.UpdateEntry] [PATCH] Synced ${title} to Shikimori. ${JSON.stringify(rateBase)}`))
					.catch((e) => log.sendError(`[Shikimori.UpdateEntry] [PATCH] ${(e as Error).message}`));
			} else {
				await post({ user_rate: { target_id: entry.media.idMal, target_type: entry.type, ...rateBase } })
					.then(() => log.sendSuccess(`[Shikimori.UpdateEntry] [POST] Synced ${title} to Shikimori. ${JSON.stringify(rateBase)}`))
					.catch((e) => log.sendError(`[Shikimori.UpdateEntry] [POST] ${(e as Error).message}`));
			}
		});

		$store.watch("POST_UPDATE_ENTRY_PROGRESS", async (e: $app.PostUpdateEntryProgressEvent) => {
			if (!e.mediaId) {
				log.sendWarning("[Shikimori.UpdateProgress] postUpdate hook was triggered but it contained no mediaId");
				return $store.set("PRE_UPDATE_ENTRY_PROGRESS_DATA", null);
			}

			const data: $app.PreUpdateEntryProgressEvent = $store.get("PRE_UPDATE_ENTRY_PROGRESS_DATA");
			if (!data) return log.sendWarning("[Shikimori.UpdateProgress] No update data was emitted from the pre update hooks!");
			$store.set("PRE_UPDATE_ENTRY_PROGRESS_DATA", null); // consume the data

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`[Shikimori.UpdateEntry] Syncing was disabled. Will not sync entry [${e.mediaId}]`);
			}

			const entry = await getMedia(e.mediaId);
			if (!entry) return log.sendWarning(`[Shikimori.UpdateProgress] Media not found (${e.mediaId})`);

			if (!entry.media?.idMal) {
				return log.sendWarning(`[Shikimori.UpdateProgress] No equivalent Shikimori entry found for [${e.mediaId}]`);
			}

			if (data.mediaId !== e.mediaId) {
				return log.sendWarning("[Shikimori.UpdateProgress] preUpdate data was invalid!");
			}

			if (unwrap(getAnilistEntries(entry.type).find((x) => x.mediaId === e.mediaId)?.private)) {
				return log.sendWarning(`[Shikimori.UpdateProgress] ${entry.media.title?.userPreferred ?? "anilist-id/" + e.mediaId} is private. Skipping...`);
			}

			const rateBase: UserRateBase = {
				user_id: shikimoriProfile.userId.get()!,
			};

			// status
			if (data.status) rateBase.status = normalizeStatus(data.status);
			if (data.progress === data.totalCount) rateBase.status = "completed";

			// progress
			if (data.progress) {
				if (entry.type === "Anime") rateBase.episodes = data.progress;
				if (entry.type === "Manga") rateBase.chapters = data.progress;
			}

			const rate = await getUserRate(entry.media.idMal, entry.type, shikimoriProfile.userId.get()!).catch((e) => (e as Error).message);
			if (typeof rate === "string") {
				return log.sendError(`[Shikimori.UpdateEntry] ${rate}`);
			}

			const title = entry.media.title?.userPreferred;
			if (rate) {
				await patch(rate.id, { user_rate: { ...rateBase } })
					.then(() => log.sendSuccess(`[Shikimori.UpdateEntry] [PATCH] Synced ${title} to Shikimori. ${JSON.stringify(rateBase)}`))
					.catch((e) => log.sendError(`[Shikimori.UpdateEntry] [PATCH] ${(e as Error).message}`));
			} else {
				await post({ user_rate: { target_id: entry.media.idMal, target_type: entry.type, ...rateBase } })
					.then(() => log.sendSuccess(`[Shikimori.UpdateEntry] [POST] Synced ${title} to Shikimori. ${JSON.stringify(rateBase)}`))
					.catch((e) => log.sendError(`[Shikimori.UpdateEntry] [POST] ${(e as Error).message}`));
			}
		});

		$store.watch("POST_UPDATE_ENTRY_REPEAT", async (e: $app.PostUpdateEntryRepeatEvent) => {
			if (!e.mediaId) {
				log.sendWarning("[Shikimori.UpdateRepeat] postUpdate hook was triggered but it contained no mediaId");
				return $store.set("PRE_UPDATE_ENTRY_REPEAT_DATA", null);
			}

			const data: $app.PreUpdateEntryRepeatEvent = $store.get("PRE_UPDATE_ENTRY_REPEAT_DATA");
			if (!data) return log.sendWarning("[Shikimori.UpdateRepeat] No update data was emitted from the pre update hooks!");
			$store.set("PRE_UPDATE_ENTRY_REPEAT_DATA", null); // consume the data

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`[Shikimori.UpdateEntry] Syncing was disabled. Will not sync entry [${e.mediaId}]`);
			}

			const entry = await getMedia(e.mediaId);
			if (!entry) return log.sendWarning(`[Shikimori.UpdateRepeat] Media not found (${e.mediaId})`);

			if (!entry.media?.idMal) {
				return log.sendWarning(`[Shikimori.UpdateRepeat] No equivalent Shikimori entry found for [${e.mediaId}]`);
			}

			if (data.mediaId !== e.mediaId) {
				return log.sendWarning("[Shikimori.UpdateRepeat] preUpdate data was invalid!");
			}

			if (unwrap(getAnilistEntries(entry.type).find((x) => x.mediaId === e.mediaId)?.private)) {
				return log.sendWarning(`[Shikimori.UpdateRepeat] ${entry.media.title?.userPreferred ?? "anilist-id/" + e.mediaId} is private. Skipping...`);
			}

			const rateBase: UserRateBase = {
				user_id: shikimoriProfile.userId.get()!,
			};

			// status
			if (data.repeat) rateBase.rewatches = data.repeat;
			if (!rateBase.rewatches) {
				return log.sendWarning("[Shikimori.UpdateRepeat] Insuffecient data. Aborting...");
			}

			const rate = await getUserRate(entry.media.idMal, entry.type, shikimoriProfile.userId.get()!).catch((e) => (e as Error).message);
			if (typeof rate === "string") {
				return log.sendError(`[Shikimori.UpdateRepeat] ${rate}`);
			}

			const title = entry.media.title?.userPreferred;
			if (rate) {
				await patch(rate.id, { user_rate: { ...rateBase } })
					.then(() => log.sendSuccess(`[Shikimori.UpdateRepeat] [PATCH] Synced ${title} to Shikimori. ${JSON.stringify(rateBase)}`))
					.catch((e) => log.sendError(`[Shikimori.UpdateRepeat] [PATCH] ${(e as Error).message}`));
			} else {
				await post({ user_rate: { target_id: entry.media.idMal, target_type: entry.type, ...rateBase } })
					.then(() => log.sendSuccess(`[Shikimori.UpdateRepeat] [POST] Synced ${title} to Shikimori. ${JSON.stringify(rateBase)}`))
					.catch((e) => log.sendError(`[Shikimori.UpdateRepeat] [POST] ${(e as Error).message}`));
			}
		});

		$store.watch("POST_DELETE_ENTRY", async (e: $app.PostDeleteEntryEvent) => {
			if (!e.mediaId) {
				return log.sendWarning("[Shikimori.DeleteEntry] postUpdate hook was triggered but it contained no mediaId");
			}

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`[Shikimori.UpdateEntry] Syncing was disabled. Will not sync entry [${e.mediaId}]`);
			}

			const entry = await getMedia(e.mediaId);
			if (!entry) return log.sendWarning(`[Shikimori.DeleteEntry] Media not found (${e.mediaId})`);

			if (!entry.media?.idMal) {
				return log.sendWarning(`[Shikimori.DeleteEntry] No equivalent Shikimori entry found for [${e.mediaId}]`);
			}

			if (unwrap(getAnilistEntries(entry.type).find((x) => x.mediaId === e.mediaId)?.private)) {
				return log.sendWarning(`[Shikimori.DeleteEntry] ${entry.media.title?.userPreferred ?? "anilist-id/" + e.mediaId} is private. Skipping...`);
			}

			const rate = await getUserRate(entry.media.idMal, entry.type, shikimoriProfile.userId.get()!).catch((e) => (e as Error).message);
			if (typeof rate === "string") {
				return log.sendError(`[Shikimori.DeleteEntry] ${rate}`);
			}

			const title = entry.media.title?.userPreferred;
			if (rate) {
				await del(rate.id)
					.then(() => log.sendSuccess(`[Shikimori.DeleteEntry] [DELETE] Synced ${title} to Shikimori.`))
					.catch((e) => log.sendError(`[Shikimori.DeleteEntry] [DELETE] ${(e as Error).message}`));
			} else {
				log.sendWarning(`[Shikimori.DeleteEntry] No entry to delete in shikimori (already synced)`);
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

		if (tokenManager.getAccessToken() === null) {
			log.sendWarning("No access token found!");
			if (tokenManager.token.refreshToken.get()) {
				log.send("Checking availability of refresh token...");
				try {
					tokenManager.refresh().then(() => log.sendSuccess("Successfully refreshed access token!"));
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

		log.send("Initializing extension...");
		log.send("Checking availability of access tokens...");
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
		$store.set("POST_DELETE_ENTRY", $clone(e));
		e.next();
	});
}
