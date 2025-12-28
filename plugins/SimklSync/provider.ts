/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./simklsync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://eu.simkl.in/img_favicon/v2/favicon-192x192.png";
		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
			width: "26.5rem",
		});

		enum Tab {
			Logon = 1,
			Landing = 2,
			Logs = 3,
			manageList = 4,
		}

		enum ManageListJobType {
			Import = "import",
			// Export = "export",
		}

		enum ManageListSyncType {
			// Patch = "patch",
			Post = "post",
			// FullSync = "fullsync",
		}

		const manageListJobTypeDesc: Record<ManageListJobType, string> = {
			import: "Bring your AniList library into SIMKL to sync progress.",
			// export: "Update AniList with your current SIMKL entries.",
		};

		const manageListSyncTypeDesc: Record<ManageListSyncType, string> = {
			// patch: "Import only items not already in your list. Existing entries remain unchanged.",
			post: "Replace data for items found in both trackers. Items missing in either list are ignored.",
			// fullsync: "Make both trackers identical. Shared entries are updated, and items missing in one are deleted.",
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

		const application = {
			clientId: "6cbaeafe0161a8ee3e287f63b33f18733a1566c1d83c356793250eaa5dc4edcd",
			clientSecret: "f287ab839c1a159ca81048dd3dd15bfbffad9d1dce8c9afddfc40eee982d6cb4",
			redirectUri: "https://nnotwen.github.io/n-seanime-extensions/plugins/SimklSync/callback.html",

			token: {
				accessToken: ctx.state<string | null>($storage.get("simkl.accesstoken") ?? null),

				set(accessToken: string | null) {
					this.accessToken.set(accessToken);
					$storage.set("simkl.accesstoken", accessToken);
				},

				generateAuthUrl() {
					const url = new URL("https://simkl.com/oauth/authorize");
					url.searchParams.set("response_type", "code");
					url.searchParams.set("client_id", application.clientId);
					url.searchParams.set("redirect_uri", application.redirectUri);
					return url.toString();
				},

				async exchangeCode(code: string) {
					const res = await fetch("https://api.simkl.com/oauth/token", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							code,
							client_id: application.clientId,
							client_secret: application.clientSecret,
							redirect_uri: application.redirectUri,
							grant_type: "authorization_code",
						}),
					});
					if (!res.ok) throw new Error(res.json()?.message ?? res.statusText);
					const { access_token, ...rest }: $simkl.AccessTokenExchangeCodeResponse = res.json();

					if ("error" in rest) throw new Error(rest.error as string);

					this.set(access_token);
					return { access_token, ...rest };
				},
			},

			userInfo: {
				data: ctx.state<$simkl.SimklUserInfo | null>(null),
				async fetch() {
					try {
						const res: $simkl.SimklUserInfo = await application.fetch("/users/settings");
						this.data.set(res);
						return res;
					} catch (error) {
						throw new Error((error as Error).message);
					}
				},
			},

			list: {
				async getSimklMediaId(anilistMediaId: number) {
					const res = await ctx.fetch(`https://animeapi.my.id/anilist/${anilistMediaId}`);

					if (!res.ok) throw new Error(res.json()?.message ?? res.statusText);
					return res.json().simkl as number | null;
				},

				async addToWatchlist(body: $simkl.UpdatePayload) {
					return await application.fetch("/sync/add-to-list", {
						method: "POST",
						body: JSON.stringify(body),
					});
				},

				async addToHistory(body: $simkl.UpdatePayload) {
					return await application.fetch("/sync/history", {
						method: "POST",
						body: JSON.stringify(body),
					});
				},

				async removeFromList(body: $simkl.UpdatePayload) {
					return await application.fetch("/sync/history/remove", {
						method: "POST",
						body: JSON.stringify(body),
					});
				},
			},

			withAuthHeaders() {
				const access_token = this.token.accessToken.get();
				if (!access_token) throw new Error(`Missing auth token!`);

				return {
					Authorization: `Bearer ${access_token}`,
					"Content-Type": "application/json",
					"simkl-api-key": application.clientId,
				};
			},

			async fetch(endpoint: string, init: RequestInit = {}) {
				const res = await ctx.fetch("https://api.simkl.com/" + endpoint.replace(/^\/+/, ""), {
					...init,
					headers: {
						...this.withAuthHeaders(),
						...(init.headers as Record<string, string>),
					},
				});

				if (!res.ok) throw new Error(res.json()?.message ?? res.statusText);
				return res.json();
			},
		};

		const fieldRefs = {
			authCode: ctx.fieldRef<string>(""),
			disableSyncing: ctx.fieldRef<boolean>($storage.get("simkl.disableSyncing") ?? false),
			manageListJobType: ctx.fieldRef<ManageListJobType>(ManageListJobType.Import),
			manageListSyncType: ctx.fieldRef<ManageListSyncType>(ManageListSyncType.Post),
		};

		const state = {
			loggingIn: ctx.state<boolean>(false),
			loggingOut: ctx.state<boolean>(false),
			loginError: ctx.state<string | null>(null),
			syncing: ctx.state<boolean>(false),
			cancellingSync: ctx.state<boolean>(false),
			syncDetail: ctx.state<string>("Waiting..."),
			manageListJobTypeDesc: ctx.state<string>(manageListJobTypeDesc[fieldRefs.manageListJobType.current]),
			manageListSyncTypeDesc: ctx.state<string>(manageListSyncTypeDesc[fieldRefs.manageListSyncType.current]),
		};

		const log = {
			id: "simkl:69481fa7-d16d-40f2-ae3a-aba6e3f212ad",
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
				console.error(`[SimklSync:Error] ${message}`);
			},

			sendInfo(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Info"]);
				console.info(`[SimklSync:Info] ${message}`);
			},

			sendWarning(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Warning"]);
				console.warn(`[SimklSync:Warning] ${message}`);
			},

			sendSuccess(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Success"]);
				console.log(`[SimklSync:Success] ${message}`);
			},

			send(message: string) {
				this.record([`[${this.dateFormat()}] ${message}`, "Log"]);
				console.log(`[SimklSync:Log] ${message}`);
			},
		};

		const tabs = {
			current: ctx.state<Tab>(Tab.Logon),
			logo() {
				return tray.flex(
					[
						tray.div([], {
							style: {
								width: "100%",
								height: "2.5em",
								backgroundImage: `url(https://eu.simkl.in/img_blog_2012/logo.png)`,
								backgroundSize: "contain",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								flexGrow: "0",
								flexShrink: "0",
							},
						}),
						tray.text("for Seanime", {
							style: { fontSize: "14px", textAlign: "center", marginTop: "-5px", color: "#fff" },
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
			stack(content: any[], props: { gap?: number } & $ui.ComponentProps = {}) {
				return tray.stack([this.logo(), ...content], { ...props, style: { padding: "0.5rem", height: "30rem", ...props.style } });
			},
			backButton() {
				return tray.button("\u200b", {
					intent: "gray-subtle",
					className: "bg-transparent",
					style: {
						width: "2.5rem",
						height: "2.5rem",
						borderRadius: "50%",
						backgroundImage:
							"url(data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMjggMjRhMTA0IDEwNCAwIDEgMCAxMDQgMTA0QTEwNC4xMSAxMDQuMTEgMCAwIDAgMTI4IDI0bTAgMTkyYTg4IDg4IDAgMSAxIDg4LTg4IDg4LjEgODguMSAwIDAgMS04OCA4OG00OC04OGE4IDggMCAwIDEtOCA4aC02MC42OWwxOC4zNSAxOC4zNGE4IDggMCAwIDEtMTEuMzIgMTEuMzJsLTMyLTMyYTggOCAwIDAgMSAwLTExLjMybDMyLTMyYTggOCAwIDAgMSAxMS4zMiAxMS4zMkwxMDcuMzEgMTIwSDE2OGE4IDggMCAwIDEgOCA4IiBzdHJva2U9Im5vbmUiLz48L3N2Zz4=)",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
						backgroundSize: "1.5rem",
						position: "absolute",
						top: "1rem",
						right: "1rem",
					},
					onClick: ctx.eventHandler("goto:back", () => {
						tabs.current.set(application.token.accessToken.get() ? Tab.Landing : Tab.Logon);
					}),
				});
			},
			[Tab.Logon]() {
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

				return this.stack(
					[
						tray.stack(
							[
								error,
								tray.text("Click the button below to authorize the application, then copy the token from the website and paste it into the field below.", {
									style: { textAlign: "center" },
								}),
								tray.anchor({
									text: "Authorize",
									href: application.token.generateAuthUrl(),
									target: "_blank",
									// prettier-ignore
									className: "UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border bg-gray-100 border-transparent hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 h-10 px-4 no-underline",
									style: {
										pointerEvents: state.loggingIn.get() ? "none" : "auto",
										opacity: state.loggingIn.get() ? "0.5" : "1",
										width: "100%",
									},
								}),
								tray.input({
									label: "\u200b",
									placeholder: "Auth Code",
									fieldRef: fieldRefs.authCode,
									disabled: state.loggingIn.get(),
									style: {
										color: "var(--background)",
										background: "var(--foreground)",
									},
								}),
								tray.button({
									label: "Login",
									intent: "success",
									size: "md",
									loading: state.loggingIn.get(),
									style: {
										width: "100%",
									},
									onClick: ctx.eventHandler("simkl:login", async () => {
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

											await $_wait(500);

											const data = await application.userInfo.fetch();

											log.sendSuccess("Successfully fetched user info!");
											log.send(`Welcome ${data.user.name}!`);
											if (!data.user.avatar) log.sendWarning("No user avatar detected! Reverting to default...");

											tabs.current.set(Tab.Landing);
											fieldRefs.authCode.setValue("");
										} catch (e) {
											await $_wait(2_000);
											state.loginError.set(`Error: ${(e as Error).message}`);
											log.sendError("Login failed: " + (e as Error).message);
										} finally {
											state.loggingIn.set(false);
										}
									}),
								}),
							],
							{ style: { flex: "1", justifyContent: "center" } }
						),
						tray.button("View Logs", {
							intent: "gray-subtle",
							size: "md",
							onClick: ctx.eventHandler("goto:logs", () => tabs.current.set(Tab.Logs)),
						}),
					],
					{ style: { justifyContent: "space-between" } }
				);
			},
			[Tab.Landing]() {
				const userdata = application.userInfo.data.get();

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
						onClick: ctx.eventHandler("simkl:log-out", () => {
							log.sendInfo("Logging out...");
							state.loggingOut.set(true);

							// clear data
							application.token.set(null);
							application.userInfo.data.set(null);
							state.syncing.set(false);

							// Back to login screen
							ctx.setTimeout(() => {
								ctx.toast.success("Logged out of simkl!");
								log.sendInfo("Logged out of simkl!");
								tabs.current.set(Tab.Logon);
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

				// prettier-ignore
				const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMGE0LjkgNC45IDAgMCAwLTEuODQ0LjM3NWMtLjA4My4wMzQtLjE2OC4wNTUtLjI1LjA5NC0uMDM0LjAxNi0uMDYuMDQ2LS4wOTQuMDYycS0uMzA1LjE1Mi0uNTkzLjM0NGMtLjAyNy4wMTctLjA2Ny4wMTMtLjA5NC4wMzEtLjA1Ni4wMzktLjEwMS4wODQtLjE1Ni4xMjUtLjE1Ny4xMTMtLjMyMi4yMTYtLjQ2OS4zNDQtLjEzNC4xMi0uMjUuMjcyLS4zNzUuNDA2YTYuNyA2LjcgMCAwIDAtMS4wOTQgMS40MzhjLS41MTUuOTAzLS45IDEuOTItMS4wNjIgMi45NjlhLjQuNCAwIDAgMC0uMjE5IDBjLS41MjUuMTctLjY1NSAxLjE2OC0uMzEzIDIuMjE4LjIwMS42MTYuNTM1IDEuMTAyLjg3NSAxLjM3NS40NTggMS43NzggMS40MjYgMy4yNiAyLjY4OCA0LjE4OFYxNWwtMSAxLTIgMWMtMS42MTcuODAxLTMuMjI4IDEuNjA1LTQuODQ0IDIuNDA2Qy4yNjEgMTkuOTQ2LS4wODUgMjEuMDA2IDAgMjJjLjA0Mi42MjYtLjE4NCAxLjQyNy40MzcgMS44NDQuNTkxLjMwNCAxLjI5Ni4xMDYgMS45MzguMTU2SDE2YzIuMzY3IDAgNC43MjcuMDA0IDcuMDk0IDAgLjc2OC0uMDU0Ljk4MS0uODY1LjkwNi0xLjUuMDE0LS45MzIuMDY5LTEuOTc2LS42NTYtMi42ODgtLjU5Mi0uNjAyLTEuNDM0LS44NC0yLjE1Ni0xLjI1QzIwLjEyNyAxOC4wMzcgMTkuMDYgMTcuNTI1IDE4IDE3bC0yLTEtMS0xdi0xLjAzMWMxLjI2Mi0uOTI4IDIuMjMtMi40MSAyLjY4OC00LjE4OC4zNC0uMjczLjY3NC0uNzU5Ljg3NC0xLjM3NS4zNDItMS4wNS4yMTMtMi4wNDgtLjMxMi0yLjIxOWEuNC40IDAgMCAwLS4yMTkgMGMtLjE2Mi0xLjA0OC0uNTQ3LTIuMDY1LTEuMDYyLTIuOTY4YTYuNyA2LjcgMCAwIDAtMS4wOTQtMS40MzhjLS4xMjYtLjEzNC0uMjQxLS4yODUtLjM3NS0uNDA2LS4wMDYtLjAwNS0uMDI1LjAwNi0uMDMxIDBhNS43IDUuNyAwIDAgMC0xLjI4MS0uODQ0IDUgNSAwIDAgMC0uNTk0LS4yNSA1IDUgMCAwIDAtLjc4Mi0uMjE4Yy0uMDItLjAwNC0uMDQyLjAwMy0uMDYyIDBBNC41IDQuNSAwIDAgMCAxMiAwIiBmaWxsPSIjMzQ0OTVlIi8+PHBhdGggZD0iTTAgMjNjLjAyNi4zLjEyNy42LjQzOC44LjU5LjMgMS4yOTUuMSAxLjkzNy4yaDIwLjcxOWMuNTc2LS4xLjg0Mi0uNS45MDYtMXoiIGZpbGw9IiMyYzNlNTAiLz48L3N2Zz4=";
				const userInfo = tray.flex(
					[
						tray.div([], {
							style: {
								// prettier-ignore
								backgroundImage: `url(${userdata?.user.avatar ?? defaultAvatar})`,
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
								tray.text(userdata?.user.name ?? "<SimklUserName>", {
									style: { fontWeight: "bolder", color: "#fff" },
								}),
								tray.text(`ID: ${userdata?.account.id ?? "<SimklId>"}`, {
									style: {
										marginTop: "-5px",
										fontSize: "0.75em",
										color: "#cacaca",
										fontWeight: "600",
									},
								}),
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
					onChange: ctx.eventHandler("simkl:temp-disable", (e) => {
						$storage.set("simkl.disableSyncing", e.value);
					}),
				});

				const manageList = tray.button("Manage List", {
					...buttonOpts,
					loading: state.loggingOut.get(),
					onClick: ctx.eventHandler("simkl:list-settings", () => {
						tabs.current.set(Tab.manageList);
					}),
				});

				const logs = tray.button("View Logs", {
					...buttonOpts,
					onClick: ctx.eventHandler("simkl:view-logs", () => {
						tabs.current.set(Tab.Logs);
					}),
					loading: state.loggingOut.get(),
				});

				const btnGroup = tray.stack([manageList, logs], { gap: 3 });

				const stack = tray.flex([userInfo, tempDisable, btnGroup], {
					direction: "column",
					gap: 5,
				});

				return this.stack([
					tray.flex([stack, logOut], {
						direction: "column",
						gap: 5,
						style: {
							justifyContent: "space-between",
							height: "100%",
						},
					}),
				]);
			},
			[Tab.Logs]() {
				const header = tray.flex(
					[
						tray.text("Simkl Logs", {
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
							onClick: ctx.eventHandler("simkl:clear-logs", () => {
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

				return this.stack([header, terminal, this.backButton()]);
			},
			[Tab.manageList]() {
				const jobType = tray.select("Job type", {
					size: "md",
					placeholder: "Select...",
					disabled: state.syncing.get() || state.cancellingSync.get(),
					fieldRef: fieldRefs.manageListJobType,
					style: {
						borderRadius: "1em 1em 0 0",
					},
					options: [
						{
							label: "Import from Anilist",
							value: ManageListJobType.Import,
						},
					] satisfies { label: string; value: ManageListJobType }[],
					onChange: ctx.eventHandler("mal:manage-list-job-type", (e) => {
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
						background: "#00000033",
						wordBreak: "normal",
						lineHeight: "normal",
						opacity: state.syncing.get() || state.cancellingSync.get() ? "0.5" : "1",
					},
				});

				const mediaType = tray.select("Media Type", {
					size: "md",
					placeholder: "Select...",
					disabled: state.syncing.get() || state.cancellingSync.get(),
					value: "Anime",
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
					fieldRef: fieldRefs.manageListSyncType,
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
							[ManageListSyncType.Post]: "#ffc107",
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
						marginTop: "0.5em",
					},
					onClick: ctx.eventHandler("mal:manage-list-start-job", () => {
						if (state.syncing.get()) {
							state.syncing.set(false);
							state.cancellingSync.set(true);
							ctx.setTimeout(() => {
								state.cancellingSync.set(false);
							}, 5_000);
						} else {
							state.syncing.set(true);
							ctx.setTimeout(() => {
								try {
									syncEntries();
								} catch (err) {
									log.sendError((err as Error).message);
								}
							}, 1000);
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

				return this.stack([container, startJob, progressBar, progressDetails, this.backButton()]);
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

		function toISODate(date?: $app.AL_FuzzyDateInput): string | undefined {
			if (!date || !unwrap(date)) return undefined;
			const year = unwrap(date?.year);

			if (!year) return undefined;
			const month = date.month ?? 1; // default to January if missing
			const day = date.day ?? 1; // default to 1st if missing

			return new Date(Date.UTC(year, month - 1, day)).toISOString();
		}

		function normalizeStatus(status: $app.AL_MediaListStatus) {
			if (status === undefined || status === null) return undefined;
			const map: Record<typeof status, $simkl.SimklStatus> = {
				COMPLETED: "completed",
				CURRENT: "watching",
				DROPPED: "dropped",
				PAUSED: "hold",
				PLANNING: "plantowatch",
				REPEATING: "watching",
			};
			return map[status];
		}

		function getAnilistEntries(mediaType: "Anime" | "Manga") {
			return ($anilist[`get${mediaType}Collection`](false).MediaListCollection?.lists ?? [])
				.flatMap((list) => list.entries)
				.filter((entry): entry is $app.AL_AnimeCollection_MediaListCollection_Lists_Entries => Boolean(entry))
				.map((entry) => {
					const { media, ...rest } = entry;
					return { ...rest, title: media?.title?.userPreferred, mediaId: media?.id, format: media?.format, episodes: media?.episodes };
				});
		}

		async function getMedia(mediaId: number) {
			return await ctx.anime.getAnimeEntry(mediaId).catch(() => null);
		}

		async function syncEntries() {
			const jobType = fieldRefs.manageListJobType.current;
			const mediaType = "Anime";

			// Anilist ➔ MyAnimeList
			if (jobType === ManageListJobType.Import) {
				log.sendInfo("[SYNCLIST] Starting sync job... (Anilist ➔ SIMKL)");
				const entries = getAnilistEntries(mediaType);
				if (!entries.length) {
					log.sendWarning("[SYNCLIST] No entries found.");
					log.sendWarning("[SYNCLIST] Sync job terminated.");
					return state.syncing.set(false);
				} else {
					log.sendInfo(`[SYNCLIST] Found ${entries.length} entries!`);
					syncProgress.refresh(entries.length);
				}

				const historyPayload: $simkl.UpdatePayload = {
					shows: [],
					movies: [],
				};

				const watchlistPayload: $simkl.UpdatePayload = {
					shows: [],
					movies: [],
				};

				while (state.syncing.get() && entries.length) {
					try {
						const entry = entries.pop();
						syncProgress.tick();

						if (!entry?.mediaId) continue;

						const title = entry?.title;
						state.syncDetail.set(`Processing ${title}`);

						const { anidbId } = (await ctx.anime.getAnimeMetadata("anilist", entry.mediaId))?.mappings ?? {};

						if (!anidbId) {
							log.sendWarning(`[SYNCLIST] Skipping ${title} (no equivalent SIMKL entry)`);
							continue;
						}

						if (unwrap(entry.private)) {
							log.sendWarning(`[SYNCLIST] Skipping ${title} (private)...`);
							continue;
						}

						const score = unwrap(entry.score);
						const item: $simkl.UpdateEntryBody & { watched_at?: string } = {
							ids: { anidb: anidbId },
							to: normalizeStatus(entry.status ?? "PLANNING"),
							rating: score ? score / 10 : score,
						};

						if (entry.format === "MOVIE") {
							item.watched_at = toISODate(entry.startedAt) ?? toISODate(entry.completedAt);
						} else {
							const episodesCount = entry.progress ?? 0;
							const startedAtISO = toISODate(entry.startedAt);
							const completedAtISO = toISODate(entry.completedAt);

							const startedAt = startedAtISO ? new Date(startedAtISO).getTime() : undefined;
							const completedAt = completedAtISO ? new Date(completedAtISO).getTime() : undefined;

							item.episodes = Array.from({ length: episodesCount }).map((_, i) => {
								let watched_at: string | undefined;

								if (startedAt && completedAt && episodesCount > 1) {
									// Linear interpolation
									const step = (completedAt - startedAt) / (episodesCount - 1);
									watched_at = new Date(startedAt + step * i).toISOString();
								} else if (startedAt) {
									// Increment by 30 minutes
									const step = 30 * 60 * 1000;
									watched_at = new Date(startedAt + step * i).toISOString();
								} else if (completedAt) {
									// Decrement by 30 minutes
									const step = 30 * 60 * 1000;
									const reverseIndex = episodesCount - 1 - i;
									watched_at = new Date(completedAt - step * reverseIndex).toISOString();
								}

								return { number: i + 1, watched_at };
							});
						}

						if (item.to === "plantowatch") {
							watchlistPayload[entry.format === "MOVIE" ? "movies" : "shows"]!.push(item);
						} else {
							historyPayload[entry.format === "MOVIE" ? "movies" : "shows"]!.push(item);
						}
					} catch (err) {
						log.sendError(`[SYNCLIST] ${(err as Error).message}`);
						continue; // skip instead of killing the loop
					}
				}

				if (!watchlistPayload.movies!.length && !watchlistPayload.shows!.length) {
					log.sendWarning(`[SYNCLIST] No entries to update on watchlist endpoint...`);
				} else {
					if (state.syncing.get()) {
						log.sendInfo(`[SYNCLIST] Updating ${watchlistPayload.movies!.length} movies and ${watchlistPayload.shows!.length} shows on watchlist...`);
						state.syncDetail.set(`Performing batch operation for watchlist payload...`);
						await application.list
							.addToWatchlist(watchlistPayload)
							.then((data) => log.sendSuccess(`[SYNCLIST] Synced ${data.added.movies.length} movies and ${data.added.shows.length} shows!`))
							.catch((err) => log.sendError(`[SYNCLIST] ${(err as Error).message}`));

						await $_wait(2_000);
					}
				}

				if (!historyPayload.movies!.length && !historyPayload.shows!.length) {
					log.sendWarning(`[SYNCLIST] No entries to update on history endpoint...`);
				} else {
					if (state.syncing.get()) {
						log.sendInfo(`[SYNCLIST] Updating ${historyPayload.movies!.length} movies and ${historyPayload.shows!.length} shows on watchlist...`);
						state.syncDetail.set(`Performing batch operation for history payload...`);
						await application.list
							.addToHistory(historyPayload)
							.then((data) => log.sendSuccess(`[SYNCLIST] Synced ${data.added.statuses.length} entries!`))
							.catch((err) => log.sendError(`[SYNCLIST] ${(err as Error).message}`));
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

			state.syncDetail.set(`Waiting...`);
			syncProgress.refresh(0);
		}

		async function liveSync<TData>({
			event,
			preDataKey,
			actionLabel,
			buildBody,
		}: {
			event: { mediaId?: number };
			preDataKey: string;
			actionLabel: string;
			buildBody: (data: TData, entry: $app.AL_BaseAnime, anidbId?: number, simkl?: number) => $simkl.UpdatePayload;
			requireRepeat?: boolean;
		}) {
			const { mediaId } = event;
			let simkl: number | null = null;

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
			if (!entry || !entry.media) return log.sendWarning(`[${actionLabel}] Media not found (${mediaId})`);

			const { anidbId } = (await ctx.anime.getAnimeMetadata("anilist", mediaId))?.mappings ?? {};

			if (!anidbId) {
				simkl = await application.list.getSimklMediaId(entry.media.id);
				if (!simkl) return log.sendWarning(`[${actionLabel}] anilist/${mediaId} has no equivalent entry on SIMKL!`);
			}

			if ((data as any).mediaId !== mediaId) {
				return log.sendWarning(`[${actionLabel}] preUpdate data was invalid!`);
			}

			if (unwrap(getAnilistEntries("Anime").find((x) => x.mediaId === mediaId)?.private)) {
				return log.sendWarning(`[${actionLabel}] ${entry.media.title?.userPreferred ?? "anilist-id/" + mediaId} is private. Skipping...`);
			}

			const title = entry.media.title?.userPreferred ?? `anilist-id/${mediaId}`;
			const body = buildBody(data, entry.media, anidbId, simkl ?? undefined);
			const status = ((data as any).status as $app.AL_MediaListStatus) ?? "PLANNING";

			application.list[status === "PLANNING" ? "addToWatchlist" : "addToHistory"](body)
				.then((data) => log.sendSuccess(`[${actionLabel}] [POST] Synced ${title} to SIMKL. ${JSON.stringify({ added: data.added })}`))
				.catch((e) => log.sendError(`[${actionLabel}] [POST] ${(e as Error).message} ${JSON.stringify(body)}`));
		}

		$store.watch("POST_UPDATE_ENTRY", async (e) => {
			liveSync<$app.PreUpdateEntryEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_DATA",
				actionLabel: "SIMKL.UpdateEntry",
				buildBody: (data: $app.PreUpdateEntryEvent, entry: $app.AL_BaseAnime, anidbId?: number, simkl?: number): $simkl.UpdatePayload => {
					const body: $simkl.UpdatePayload = {};
					const kind = entry.format === "MOVIE" ? "movies" : "shows";
					const item: $simkl.UpdateEntryBody = {
						ids: {
							anidb: anidbId,
							simkl,
						},
						to: normalizeStatus(data.status ?? "PLANNING")!,
					};

					if ("progress" in data && data.progress && kind === "shows") {
						item.episodes = Array.from({ length: data.progress }).map((_, i) => ({ number: i + 1 }));
					}

					if (data.status === "COMPLETED" && item.episodes) {
						const lastIndex = item.episodes.length - 1;
						const date = toISODate(data.completedAt) ?? new Date().toISOString();
						item.episodes[lastIndex] = { ...item.episodes[lastIndex], watched_at: date };
					}

					if (typeof data.scoreRaw === "number" && data.scoreRaw > 0) {
						item.rating = Math.round(data.scoreRaw / 10);
					}

					// @ts-ignore
					body[kind] = [item];
					return body;
				},
			});
		});

		$store.watch("POST_UPDATE_ENTRY_PROGRESS", async (e) => {
			liveSync<$app.PreUpdateEntryProgressEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_PROGRESS_DATA",
				actionLabel: "SIMKL.UpdateProgress",
				buildBody: (data: $app.PreUpdateEntryProgressEvent, entry: $app.AL_BaseAnime, anidbId?: number, simkl?: number): $simkl.UpdatePayload => {
					if (data.progress && data.progress === data.totalCount) data.status = "COMPLETED";

					const body: $simkl.UpdatePayload = {};
					const kind = entry.format === "MOVIE" ? "movies" : "shows";
					const item: $simkl.UpdateEntryBody = {
						ids: {
							anidb: anidbId,
							simkl,
						},
						status: normalizeStatus(data.status ?? "CURRENT")!,
					};

					item.episodes = [{ number: data.progress!, watched_at: new Date().toISOString() }];
					body[kind] = [item];
					return body;
				},
			});
		});

		$store.watch("POST_UPDATE_DELETE", async (e: $app.PostDeleteEntryEvent) => {
			const { mediaId } = e;
			let simkl: number | null = null;

			if (!mediaId) {
				return log.sendWarning(`[SIMKL.DeleteEntry] postUpdate hook was triggered but it contained no mediaId`);
			}

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`[SIMKL.DeleteEntry]  Syncing was disabled. Will not sync entry [${mediaId}]`);
			}

			const entry = await getMedia(mediaId);
			if (!entry || !entry.media) return log.sendWarning(`[SIMKL.DeleteEntry] Media not found (${mediaId})`);

			const { anidbId } = (await ctx.anime.getAnimeMetadata("anilist", mediaId))?.mappings ?? {};

			if (!anidbId) {
				simkl = await application.list.getSimklMediaId(entry.media.id);
				if (!simkl) return log.sendWarning(`[SIMKL.DeleteEntry] anilist/${mediaId} has no equivalent entry on SIMKL!`);
			}

			const title = entry.media.title?.userPreferred ?? `anilist-id/${mediaId}`;
			const body: $simkl.UpdatePayload = {};
			const kind = entry.media.format === "MOVIE" ? "movies" : "shows";
			const item: $simkl.UpdateEntryBody = {
				ids: {
					anidb: anidbId,
					simkl: simkl ?? undefined,
				},
			};

			// @ts-ignore
			body[kind] = [item];

			application.list
				.removeFromList(body)
				.then((data) => log.sendSuccess(`[SIMKL.DeleteEntry] [DELETE] Synced ${title} to SIMKL. ${JSON.stringify({ deleted: data.deleted })}`))
				.catch((e) => log.sendError(`[SIMKL.DeleteEntry] [DELETE] ${(e as Error).message} ${JSON.stringify(body)}`));
		});

		tray.render(() => tabs.get());

		ctx.setTimeout(() => {
			$store.watch(log.id, () => {
				if (tabs.current.get() === Tab.Logs) tray.update();
			});
		}, 5_000);

		// Authenticate
		log.send("Initializing extension...");
		log.send("Checking availability of access tokens...");
		if (application.token.accessToken.get() !== null) {
			log.sendSuccess("Access token found!");
			log.sendInfo("Fetching user info...");
			return application.userInfo
				.fetch()
				.then((data) => {
					log.sendSuccess("Successfully fetched user info!");
					log.send(`Signed in as: ${data.user.name}!`);
					if (!data.user.avatar) log.sendWarning("No user avatar detected! Reverting to default...");
					tabs.current.set(Tab.Landing);
				})
				.catch((err: Error) => {
					log.sendError(`Fetch failed: ${err.message}`);
					log.sendInfo("Invalidating cached token...");
					application.token.set(null);
					log.send("Session invalid. Please log in again.");
					tabs.current.set(Tab.Logon);
				});
		}

		log.sendWarning("Access token not found!");
		log.sendWarning("User authentication required.");
		tabs.current.set(Tab.Logon);
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

	// Simkl doesnt process repeat data;

	$app.onPostDeleteEntry((e) => {
		$store.set("POST_UPDATE_DELETE", $clone(e));
		e.next();
	});
}
