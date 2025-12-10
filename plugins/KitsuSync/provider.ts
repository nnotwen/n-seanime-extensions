/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./kitsusync.d.ts" />

// resume at line 444, that is where i stopped

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		// prettier-ignore
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/KitsuSync/icon.png";
		const fieldRefs = {
			email: ctx.fieldRef<string>($storage.get("kitsu.email") ?? ""),
			password: ctx.fieldRef<string>($storage.get("kitsu.password") ?? ""),
			rememberLoginDetails: ctx.fieldRef<boolean>(
				!!$storage.get("kitsu.email")?.length &&
					!!$storage.get("kitsu.password")?.length
			),
		};

		const state = {
			loggingIn: ctx.state<boolean>(false),
			loginError: ctx.state<string | null>(null),
			loginLabel: ctx.state<string>("Login"),
			loggingOut: ctx.state<boolean>(false),
		};

		enum Tab {
			logon = "1",
			landing = "2",
			logs = "3",
			loading = "4",
		}

		const kitsuTokenManager = {
			token: {
				accessToken: ctx.state<string | null>(
					($storage.get("kitsu.accessToken") as string | undefined) ?? null
				),
				refreshToken: ctx.state<string | null>(
					($storage.get("kitsu.refreshToken") as string | undefined) ?? null
				),
				expiresAt: ctx.state<number | null>(
					($storage.get("kitsu.expiresAt") as number | undefined) ?? null
				),
				tokenType: ctx.state<string | null>(
					($storage.get("kitsu.tokenType") as string | undefined) ?? null
				),
			},

			userAgent: "Kitsu for Seanime Client",
			baseUri: "https://kitsu.io/api/oauth/token",

			getAccessToken() {
				if (
					!this.token.accessToken.get() ||
					!this.token.refreshToken.get() ||
					!this.token.expiresAt.get()
				) {
					return null;
				}
				if (Date.now() > this.token.expiresAt.get()!) {
					return null;
				}
				return this.token.accessToken.get();
			},

			async login(username: string, password: string) {
				const res = await ctx.fetch(this.baseUri, {
					method: "POST",
					headers: {
						"User-Agent": this.userAgent,
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams({
						grant_type: "password",
						username,
						password,
					}),
				});

				if (!res.ok) throw new Error(res.statusText);

				const data = await res.json();
				const expiresAt = Date.now() + data.expires_in * 1000;

				$storage.set("kitsu.accessToken", data.access_token);
				$storage.set("kitsu.refreshToken", data.refresh_token);
				$storage.set("kitsu.expiresAt", expiresAt);
				$storage.set("kitsu.tokenType", data.token_type);

				this.token.accessToken.set(data.access_token);
				this.token.refreshToken.set(data.refresh_token);
				this.token.expiresAt.set(expiresAt);
				this.token.tokenType.set(data.token_type);
			},

			async refresh() {
				if (!this.token.refreshToken.get())
					throw new Error("No refresh token available");

				const res = await ctx.fetch(this.baseUri, {
					method: "POST",
					headers: {
						"User-Agent": this.userAgent,
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams({
						grant_type: "refresh_token",
						refresh_token: this.token.refreshToken.get()!,
					}),
				});

				if (!res.ok) throw new Error(res.statusText);

				const data = await res.json();
				const expiresAt = Date.now() + data.expires_in * 1000;

				$storage.set("kitsu.accessToken", data.access_token);
				$storage.set("kitsu.refreshToken", data.refresh_token);
				$storage.set("kitsu.expiresAt", expiresAt);
				$storage.set("kitsu.tokenType", data.token_type);

				this.token.accessToken.set(data.access_token);
				this.token.refreshToken.set(data.refresh_token);
				this.token.expiresAt.set(expiresAt);
				this.token.tokenType.set(data.token_type);
			},

			async withAuthHeaders(): Promise<Record<string, string>> {
				if (!this.getAccessToken()) {
					await this.refresh();
				}
				return {
					Authorization: `${
						this.token!.tokenType.get() ?? "Bearer"
					} ${this.token!.accessToken.get()}`,
					"Content-Type": "application/json",
					"User-Agent": this.userAgent,
				};
			},

			reset() {
				$storage.set("kitsu.accessToken", null);
				$storage.set("kitsu.refreshToken", null);
				$storage.set("kitsu.expiresAt", null);
				$storage.set("kitsu.tokenType", null);
				this.token.accessToken.set(null);
				this.token.refreshToken.set(null);
				this.token.expiresAt.set(null);
				this.token.tokenType.set(null);
			},
		};

		enum ConnectionState {
			Disconnected = "Disconnected",
			Connected = "Connected",
		}

		const kitsuProfile = {
			// prettier-ignore
			defaultAvatar: "https://kitsu.app/images/default_avatar-2ec3a4e2fc39a0de55bf42bf4822272a.png",
			displayAvatar: ctx.state<string | null>(null),
			userId: ctx.state<string | null>(null),
			username: ctx.state<string | null>(null),
			status: ctx.state<ConnectionState | null>(ConnectionState.Disconnected),
			reset() {
				this.displayAvatar.set(null);
				this.userId.set(null);
				this.username.set(null);
				this.status.set(ConnectionState.Disconnected);
			},
		};

		const log = {
			id: "kitsu:38a42e01-8e10-4330-b0b7-922321edffa3",
			record(
				message: [string, "Info" | "Warning" | "Error" | "Log" | "Success"]
			) {
				$store.set(this.id, [...($store.get(this.id) ?? []), message]);
			},

			getEntries(): [
				string,
				"Info" | "Warning" | "Error" | "Log" | "Success"
			][] {
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
				console.error(`[KitsuSync:Error] ${message}`);
			},

			sendInfo(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Info"]);
				console.info(`[KitsuSync:Info] ${message}`);
			},

			sendWarning(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Warning"]);
				console.warn(`[KitsuSync:Warning] ${message}`);
			},

			sendSuccess(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Success"]);
				console.log(`[KitsuSync:Success] ${message}`);
			},

			send(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Log"]);
				console.log(`[KitsuSync:Log] ${message}`);
			},
		};

		const tabs = {
			current: ctx.state<Tab>(Tab.logon),
			config: {
				// prettier-ignore
				logo: "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/KitsuSync/brand-logo.png",
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
						tray.text("For Seanime", {
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
						background:
							"linear-gradient(to bottom, #433242 0%, transparent 100%)",
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

				const email = tray.input({
					label: "Email",
					fieldRef: fieldRefs.email,
					disabled: state.loggingIn.get(),
				});

				const password = tray.input({
					label: "Password",
					fieldRef: fieldRefs.password,
					disabled: state.loggingIn.get(),
					style: {
						"-webkit-text-security": "disc",
					},
				});

				const checkbox = tray.checkbox({
					label: "Remember me",
					size: "sm",
					disabled: state.loggingIn.get(),
					fieldRef: fieldRefs.rememberLoginDetails,
					style: {
						display: "inline",
					},
				});

				const passwordReset = tray.anchor({
					text: "Forgot password",
					href: "https://kitsu.app/password-reset",
					target: "_blank",
					style: {
						fontSize: "0.875rem",
						textAlign: "end",
						width: "100%",
					},
				});

				const passwordModifier = tray.flex([checkbox, passwordReset], {
					direction: "row",
					style: {
						justifyContent: "space-between",
						width: "100%",
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
					onClick: ctx.eventHandler("kitsu:login", async () => {
						if (
							!fieldRefs.email.current.length ||
							!fieldRefs.password.current.length
						) {
							state.loginError.set("Please enter your email/password.");
							return;
						} else {
							state.loginError.set(null);
						}

						state.loggingIn.set(true);
						state.loginLabel.set("Logging In");
						log.sendInfo("Logging In...");

						try {
							await kitsuTokenManager.login(
								fieldRefs.email.current,
								fieldRefs.password.current
							);
							ctx.toast.success("Successfully logged in to kitsu!");
							log.sendSuccess("Successfully logged in!");

							if (fieldRefs.rememberLoginDetails.current) {
								$storage.set("kitsu.email", fieldRefs.email.current);
								$storage.set("kitsu.password", fieldRefs.password.current);
								log.sendInfo("User opted to remember login details");
								log.send("Saving login details");
							} else {
								fieldRefs.email.setValue("");
								fieldRefs.password.setValue("");
								$storage.set("kitsu.email", "");
								$storage.set("kitsu.password", "");
								log.sendInfo("User opted out to remember login details");
							}

							initKitsu();
							// Navigate to landing page
							tabs.current.set(Tab.landing);
						} catch (e) {
							state.loginError.set("Incorrect email/password.");
							log.sendError("Login failed: " + (e as Error).message);
						}

						state.loggingIn.set(false);
						state.loginLabel.set("Login");
					}),
				});

				const signup = tray.div([
					tray.text("Don't have an account? ", {
						style: {
							display: "inline",
						},
					}),
					tray.anchor({
						text: "Sign-up",
						href: "https://kitsu.app",
						target: "_blank",
					}),
				]);

				const form = tray.flex(
					[error, email, password, passwordModifier, login, signup],
					{
						direction: "column",
						style: {
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
							padding: "0.75em",
						},
					}
				);

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
						onClick: ctx.eventHandler("kitsu:log-out", () => {
							log.sendInfo("Logging out...");
							state.loggingOut.set(true);

							// clear data
							kitsuTokenManager.reset();
							kitsuProfile.reset();

							// Back to login screen
							ctx.setTimeout(() => {
								ctx.toast.success("Logged out of kitsu!");
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

				const statusbg =
					kitsuProfile.status.get() === ConnectionState.Connected
						? "#35ff5098"
						: "#ff353598";

				const status = tray.flex(
					[
						tray.text(kitsuProfile.status.get() ?? "<???>", {
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
								backgroundImage: `url(${kitsuProfile.displayAvatar.get() ?? kitsuProfile.defaultAvatar})`,
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
										tray.text(
											kitsuProfile.username.get() ?? "<kitsuUserName>",
											{
												style: { fontWeight: "bolder" },
											}
										),
										tray.text(
											`ID: ${kitsuProfile.userId.get() ?? "<kitsuUserId>"}`,
											{
												style: {
													fontSize: "0.875em",
													color: "#6b656b",
													fontWeight: "600",
												},
											}
										),
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
				const importBtn = tray.button("Import from AniList", {
					...buttonOpts,
					disabled: true,
				});
				const importBtnChk = tray.checkbox("Overwrite entries", {
					size: "sm",
					disabled: true,
				});
				const exportBtn = tray.button("Export to AniList", {
					...buttonOpts,
					disabled: true,
				});
				const exportBtnChk = tray.checkbox("Overwrite entries", {
					size: "sm",
					disabled: true,
				});
				const Logs = tray.button("View Logs", {
					...buttonOpts,
					onClick: ctx.eventHandler("kitsu:view-logs", () => {
						tabs.current.set(Tab.logs);
					}),
					loading: state.loggingOut.get(),
				});

				const importExport = tray.stack(
					[
						tray.stack([importBtn, importBtnChk], { gap: 0.5 }),
						tray.stack([exportBtn, exportBtnChk], { gap: 0.5 }),
					],
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
			// Tray tab for checking logs
			[Tab.logs]() {
				const header = tray.flex(
					[
						tray.text("Kitsu Logs", {
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
								onClick: ctx.eventHandler("kitsu:clear-logs", () => {
									log.clearEntries();
								}),
							}),
							tray.button("Go Back", {
								size: "sm",
								intent: "gray-subtle",
								style: {
									width: "fit-content",
								},
								onClick: ctx.eventHandler("kitsu:navigate-landing", () => {
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
					const color: Record<
						"Info" | "Warning" | "Error" | "Log" | "Success",
						string
					> = {
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

		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
			width: "fit-content",
		});

		async function initKitsu() {
			log.sendInfo("Logging in...");
			const headers = await kitsuTokenManager.withAuthHeaders();
			const res = await ctx.fetch(
				"https://kitsu.io/api/edge/users?filter[self]=true",
				{ headers }
			);

			if (!res.ok) {
				log.sendError("Failed to fetch current user");
				log.sendError(res.statusText);
				return;
			}

			const data = await res.json();
			const userId = data?.data?.[0]?.id ?? null;
			const username = data?.data?.[0]?.attributes?.name ?? null;
			const avatarURL = data?.data?.[0]?.attributes?.avatar?.original ?? null;

			kitsuProfile.userId.set(userId);
			kitsuProfile.username.set(username);
			kitsuProfile.displayAvatar.set(avatarURL);
			kitsuProfile.status.set(ConnectionState.Connected);

			if (!userId || !username) {
				log.sendWarning("Unable to extract userId and userName");
				log.send(JSON.stringify(data));
			}

			if (!avatarURL) {
				log.sendWarning("Missing avatar for current user");
			}

			tabs.current.set(Tab.landing);
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
		if (kitsuTokenManager.getAccessToken() === null) {
			log.sendWarning("No access token found!");
			if (kitsuTokenManager.token.refreshToken.get()) {
				log.send("Checking availability of refresh token...");
				try {
					kitsuTokenManager.refresh().then(() => {
						log.sendSuccess("Successfully refreshed access token!");
					});
					return initKitsu();
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
			initKitsu();
		}

		// Syncing logic start here
		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		async function resolvekitsuMediaIdFromAniListId(
			anilistId: number,
			type: "anime" | "manga"
		): Promise<number | null> {
			const uri = `https://kitsu.io/api/edge/mappings?filter[externalSite]=anilist/${type}&filter[externalId]=${anilistId}&include=item`;
			const res = await ctx.fetch(uri);

			if (!res.ok) throw new Error(res.statusText);
			const data = await res.json();

			// Match the type passed in (anime or manga)
			const item = data.included?.find((i: any) => i.type === type);

			// Convert string ID to number if possible
			return item?.id ? Number(item.id) : null;
		}

		async function getLibraryEntryId(
			kitsuMediaId: number
		): Promise<string | null> {
			const headers = await kitsuTokenManager.withAuthHeaders();
			const userId = kitsuProfile.userId.get();
			const res = await ctx.fetch(
				`https://kitsu.io/api/edge/library-entries?filter[userId]=${userId}&filter[mediaId]=${kitsuMediaId}`,
				{ headers }
			);

			if (!res.ok) {
				// prettier-ignore
				log.sendError(`Failed to check entry existence for [kitsu:${kitsuMediaId}]`);
				log.sendError(res.statusText);
				return null;
			}

			const data = await res.json();
			// Return the first entry’s ID if it exists
			return Array.isArray(data.data) && data.data.length > 0
				? data.data[0].id
				: null;
		}

		async function post(
			kitsuMediaId: string,
			type: "anime" | "manga",
			attributes: KitsuLibraryEntryAttributes
		): Promise<KitsuLibraryEntryPostResponse> {
			const headers = await kitsuTokenManager.withAuthHeaders();
			headers["Content-Type"] = "application/vnd.api+json";

			const body: KitsuLibraryEntryPostBody = {
				data: {
					type: "libraryEntries",
					attributes,
					relationships: {
						media: {
							data: { type, id: kitsuMediaId },
						},
						user: {
							data: {
								type: "users",
								id: kitsuProfile.userId.get()?.toString()!,
							},
						},
					},
				},
			};

			const res = await ctx.fetch("https://kitsu.io/api/edge/library-entries", {
				method: "POST",
				headers,
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error(res.statusText);
			const data: KitsuLibraryEntryPostResponse = await res.json();
			return data;
		}

		async function patch(
			libraryId: string,
			attributes: KitsuLibraryEntryAttributes
		): Promise<KitsuLibraryEntryPatchResponse> {
			const headers = await kitsuTokenManager.withAuthHeaders();
			headers["Content-Type"] = "application/vnd.api+json";
			const body: KitsuLibraryEntryPatchBody = {
				data: {
					id: libraryId,
					type: "libraryEntries",
					attributes,
				},
			};

			const res = await ctx.fetch(
				`https://kitsu.io/api/edge/library-entries/${libraryId}`,
				{
					method: "PATCH",
					headers,
					body: JSON.stringify(body),
				}
			);

			if (!res.ok) throw new Error(res.statusText);
			const data: KitsuLibraryEntryPatchResponse = await res.json();
			return data;
		}

		async function del(entryId: string): Promise<void> {
			const headers = await kitsuTokenManager.withAuthHeaders();
			const res = await ctx.fetch(
				`https://kitsu.io/api/edge/library-entries/${entryId}`,
				{
					method: "DELETE",
					headers,
				}
			);
			if (!res.ok) throw new Error(res.statusText);
		}

		async function getMedia(mediaId: number) {
			const anime = await ctx.anime.getAnimeEntry(mediaId).catch(() => null);
			if (anime !== null)
				return {
					type: "ANIME",
					media: anime.media,
					listData: anime.listData,
				};

			const manga = await ctx.manga
				.getCollection()
				.then(
					(c) =>
						c.lists
							?.flatMap((l) => l.entries)
							.find((e) => e?.mediaId === mediaId) ?? null
				)
				.catch(() => null);

			if (manga !== null)
				return {
					type: "MANGA",
					media: manga.media,
					listData: manga.listData,
				};

			return null;
		}

		function normalizeStatus(
			anilistStatus?: string
		): KitsuLibraryEntryAttributes["status"] {
			if (!anilistStatus) return undefined;

			// Strip quotes and normalize casing
			const status = anilistStatus.replace(/"/g, "").toUpperCase();

			switch (status) {
				case "CURRENT":
					return "current";
				case "PLANNING":
					return "planned";
				case "COMPLETED":
					return "completed";
				case "DROPPED":
					return "dropped";
				case "PAUSED":
					return "on_hold";
				case "REPEATING":
					return "current"; // handled separately with reconsumeCount
				default:
					return undefined;
			}
		}

		function toISODate(startedAt?: {
			year?: number;
			month?: number;
			day?: number;
		}): string | undefined {
			if (!startedAt?.year) return undefined; // year is required

			const year = startedAt.year;
			const month = startedAt.month ?? 1; // default to January if missing
			const day = startedAt.day ?? 1; // default to 1st if missing

			const date = new Date(year, month - 1, day);

			return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
		}

		function normalizeRequestBody(
			list: $app.Anime_EntryListData | $app.Manga_EntryListData | null,
			update: PreUpdateData | null
		) {
			const body: Partial<KitsuLibraryEntryAttributes> = {};
			// old data
			if (list) {
				if (list.completedAt) body.finishedAt = list.completedAt;
				if (list.progress) body.progress = list.progress;
				if (list.repeat) body.reconsumeCount = list.repeat;
				if (list.score) body.ratingTwenty = list.score / 5;
				if (list.startedAt) body.startedAt = list.startedAt;
				if (list.status) body.status = normalizeStatus(list.status);
				if (list.status === "REPEATING") body.reconsuming = true;
			}

			// overwrite body with new data
			if (update) {
				if ("status" in update && update.status)
					body.status = normalizeStatus(update.status);

				if ("status" in update && update.status === "REPEATING")
					body.reconsuming = true;

				if ("scoreRaw" in update && update.scoreRaw)
					body.ratingTwenty = update.scoreRaw / 5;

				if ("progress" in update && update.progress)
					body.progress = update.progress;

				if ("startedAt" in update && update.startedAt)
					body.startedAt = toISODate(update.startedAt);

				if ("completedAt" in update && update.completedAt)
					body.finishedAt = toISODate(update.completedAt);

				if ("repeat" in update && update.repeat)
					body.reconsumeCount = update.repeat;
			}

			log.send("Update body: " + JSON.stringify(body));

			return body;
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

			// mediaData always returns an outdated data no matter how long we wait

			const mediaType = mediaData.type.toLowerCase() as "anime" | "manga";
			const kitsuMediaId = await resolvekitsuMediaIdFromAniListId(
				e.mediaId,
				mediaType
			).catch((e) => ({ error: (e as Error).message }));

			if (typeof kitsuMediaId !== "number") {
				if (kitsuMediaId) {
					log.sendError(kitsuMediaId.error);
				} else {
					// prettier-ignore
					log.sendWarning(`[KitsuMediaIdResolver] No matching records found for Anilist/${mediaData.type}: ${e.mediaId}`);
				}
				return;
			}

			// API was called for resolvekitsuMediaIdFromAnilistId, wait to reduce load on subsequent calls
			await $_wait(1_500);
			const kitsuLibraryId = await getLibraryEntryId(kitsuMediaId);
			const updateData: PreUpdateData | null = $store.get("PRE_UPDATE_DATA");

			if (!updateData && !("isDeleted" in e)) {
				// prettier-ignore
				log.sendWarning("No update data was emitted from the pre update hooks!")
			} else {
				// consume the data
				$store.set("PRE_UPDATE_DATA", null);
			}

			if (kitsuLibraryId !== null) {
				// API was called for entryExist, wait to reduce load on subsequent calls
				await $_wait(1_500);

				// DELETE (Entry on Kitsu + No entry on AniList = remove kitsu entry)
				if ("isDeleted" in e && e.isDeleted) {
					// prettier-ignore
					log.sendInfo("[KitsuLibraryUpdate.DELETE] preparing to remove entry from kitsu");
					const res = await del(kitsuLibraryId).catch(
						(e) => (e as Error).message
					);
					if (typeof res === "string") {
						log.sendError(`[KitsuLibraryUpdate.DELETE] ${res}`);
					} else {
						// prettier-ignore
						log.sendSuccess(`[KitsuLibraryUpdate.DELETE] removed [${e.mediaId} as ${kitsuMediaId}] from Kitsu`);
					}
					return;
				}

				// PATCH (Entry on Kitsu + Entry on Anilist = update entry)
				const res = await patch(
					kitsuLibraryId,
					normalizeRequestBody(mediaData.listData ?? null, updateData)
				).catch((e) => (e as Error).message);

				if (typeof res === "string") {
					log.sendError(`[KitsuLibraryUpdate.PATCH] ${res}`);
				} else {
					// prettier-ignore
					log.sendSuccess(`[KitsuLibraryUpdate.PATCH] synced [${e.mediaId} as ${kitsuMediaId}] to Kitsu`);
				}
			} else {
				// No entry on kitsu + no entry on anilist
				if ("isDeleted" in e && e.isDeleted) {
					// prettier-ignore
					log.sendInfo(`[KitsuLibraryUpdate] Already synced (no entry on kitsu and anilist)`);
					return;
				}

				// POST (No entry on Kitsu + entry on anilist = create entry)
				const res = await post(
					kitsuMediaId.toString(),
					mediaType,
					normalizeRequestBody(mediaData.listData ?? null, updateData)
				).catch((e) => (e as Error).message);

				if (typeof res === "string") {
					log.sendError(`[KitsuLibraryUpdate.POST] ${res}`);
				} else {
					// prettier-ignore
					log.sendSuccess(`[KitsuLibraryUpdate.POST] synced [${e.mediaId} as ${kitsuMediaId}] to Kitsu`);
				}
			}
		}

		$store.watch("POST_UPDATE_ENTRY", handlePostUpdateEntry);
		$store.watch("POST_UPDATE_ENTRY_PROGRESS", handlePostUpdateEntry);
		$store.watch("POST_UPDATE_ENTRY_REPEAT", handlePostUpdateEntry);
		$store.watch("POST_DELETE_ENTRY", handlePostUpdateEntry);
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
