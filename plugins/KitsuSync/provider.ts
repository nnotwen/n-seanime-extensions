/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./kitsusync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/KitsuSync/icon.png";
		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
			width: "fit-content",
		});

		enum Tab {
			Logon = "1",
			Landing = "2",
			Logs = "3",
			ManageList = "4",
			ManageListDanger = "5",
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
			import: "Bring your AniList library into Kitsu to sync progress.",
			export: "Update AniList with your current Kitsu entries.",
		};

		const manageListSyncTypeDesc: Record<ManageListSyncType, string> = {
			patch: "Import only items not already in your list. Existing entries remain unchanged.",
			post: "Replace data for items found in both trackers. Items missing in either list are ignored.",
			fullsync: "Make both trackers identical. Shared entries are updated, and items missing in one are deleted.",
		};

		const fieldRefs = {
			email: ctx.fieldRef<string>($storage.get("kitsu.email") ?? ""),
			password: ctx.fieldRef<string>($storage.get("kitsu.password") ?? ""),
			rememberLoginDetails: ctx.fieldRef<boolean>(!!$storage.get("kitsu.email")?.length && !!$storage.get("kitsu.password")?.length),
			disableSyncing: ctx.fieldRef<boolean>($storage.get("kitsu:options-disableSync")?.valueOf() ?? false),
			manageListJobType: ctx.fieldRef<ManageListJobType>(ManageListJobType.Import),
			manageListMediaType: ctx.fieldRef<"Anime" | "Manga">("Anime"),
			manageListSyncType: ctx.fieldRef<ManageListSyncType>(ManageListSyncType.Patch),
		};

		const state = {
			loggingIn: ctx.state<boolean>(false),
			loginError: ctx.state<string | null>(null),
			loginLabel: ctx.state<string>("Login"),
			loggingOut: ctx.state<boolean>(false),
			manageListJobTypeDesc: ctx.state<string>(manageListJobTypeDesc[fieldRefs.manageListJobType.current]),
			manageListSyncTypeDesc: ctx.state<string>(manageListSyncTypeDesc[fieldRefs.manageListSyncType.current]),
			syncing: ctx.state<boolean>(false),
			cancellingSync: ctx.state<boolean>(false),
			syncDetail: ctx.state<string>("Waiting..."),
		};

		const log = {
			id: "kitsu:38a42e01-8e10-4330-b0b7-922321edffa3",
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
			userAgent: "Kitsu for Seanime Client",
			baseUri: "https://kitsu.io/api/edge/",
			token: {
				accessToken: ctx.state<string | null>(($storage.get("kitsu.accessToken") as string | undefined) ?? null),
				refreshToken: ctx.state<string | null>(($storage.get("kitsu.refreshToken") as string | undefined) ?? null),
				expiresAt: ctx.state<number | null>(($storage.get("kitsu.expiresAt") as number | undefined) ?? null),
				tokenType: ctx.state<string | null>(($storage.get("kitsu.tokenType") as string | undefined) ?? null),
				set(data: $kitsusync.RequestAccessTokenResponse | null) {
					const expiresAt = data ? Date.now() + data.expires_in * 1000 : null;

					$storage.set("kitsu.accessToken", data?.access_token ?? null);
					$storage.set("kitsu.refreshToken", data?.refresh_token ?? null);
					$storage.set("kitsu.expiresAt", expiresAt);
					$storage.set("kitsu.tokenType", data?.token_type ?? null);

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

				async login(username: string, password: string) {
					const res = await ctx.fetch("https://kitsu.io/api/oauth/token", {
						method: "POST",
						headers: {
							"User-Agent": application.userAgent,
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: new URLSearchParams({
							grant_type: "password",
							username,
							password,
						}),
					});

					if (!res.ok) throw new Error(res.json?.()?.error ?? res.statusText);
					const data: $kitsusync.RequestAccessTokenResponse = res.json();
					this.set(data);
					return data;
				},

				async refresh() {
					const refresh_token = this.refreshToken.get();
					const grant_type = "refresh_token";
					if (!refresh_token) throw new Error("No refresh token available");

					const res = await ctx.fetch("https://kitsu.io/api/oauth/token", {
						method: "POST",
						body: new URLSearchParams({ grant_type, refresh_token }),
						headers: {
							"User-Agent": application.userAgent,
							"Content-Type": "application/x-www-form-urlencoded",
						},
					});

					if (!res.ok) throw new Error(res.json?.()?.error_description ?? res.statusText);
					const data: $kitsusync.RequestAccessTokenResponse = await res.json();
					this.set(data);
				},
			},

			userInfo: {
				id: ctx.state<string | null>(null),
				username: ctx.state<string | null>(null),
				avatar: {
					default: "https://kitsu.app/images/default_avatar-2ec3a4e2fc39a0de55bf42bf4822272a.png",
					display: ctx.state<string | null>(null),
				},
				status: ctx.state<ConnectionState>(ConnectionState.Disconnected),

				async fetch() {
					const res: $kitsusync.KitsuUserResponse = await application.fetch("/users?filter[self]=true", { method: "GET" });
					const user = res.data[0];
					const avatar = user.attributes.avatar;

					this.id.set(user.id ?? null);
					this.username.set(user.attributes.name ?? null);
					this.avatar.display.set(avatar?.large ?? avatar?.medium ?? avatar?.small ?? avatar?.tiny ?? this.avatar.default);
					this.status.set(ConnectionState.Connected);

					return user;
				},

				reset() {
					this.id.set(null);
					this.username.set(null);
					this.avatar.display.set(this.avatar.default);
					this.status.set(ConnectionState.Disconnected);
				},
			},

			list: {
				async getLibraryEntryId(kitsuMediaId: number) {
					const userId = application.userInfo.id.get()!;
					const endpoint = `library-entries?filter[userId]=${userId}&filter[mediaId]=${kitsuMediaId}`;
					const res: $kitsusync.KitsuLibraryEntryResponse = await application.fetch(endpoint);
					return Number(res.data[0]?.id) || null;
				},

				async getKitsuMediaId(anilistMediaId: number, type: "anime" | "manga") {
					const res = await application.fetch(`/mappings?filter[externalSite]=anilist/${type}&filter[externalId]=${anilistMediaId}&include=item`);
					const item = res.included?.find((i: any) => i.type === type);
					return Number(item?.id) || null;
				},

				async getAnilistMediaId(kitsuMediaId: number, type: "anime" | "manga") {
					const res = await application.fetch(`/${type}/${kitsuMediaId}?include=mappings`);
					const mapping = res.included?.find((m: any) => m.type === "mappings" && m.attributes?.externalSite === `anilist/${type}`);
					return Number(mapping?.attributes?.externalId) || null;
				},

				async post(id: number, type: "anime" | "manga", attributes: $kitsusync.KitsuLibraryEntryWriteAttributes) {
					const userId = application.userInfo.id.get();
					const res: $kitsusync.KitsuLibraryEntryPostResponse = await application.fetch("library-entries", {
						method: "POST",
						headers: { "Content-Type": "application/vnd.api+json" },
						body: JSON.stringify({
							data: {
								type: "libraryEntries",
								attributes,
								relationships: {
									media: {
										data: { type, id },
									},
									user: {
										data: {
											type: "users",
											id: userId,
										},
									},
								},
							},
						}),
					});
					return res;
				},

				async patch(libraryId: number, attributes: $kitsusync.KitsuLibraryEntryWriteAttributes) {
					const res: $kitsusync.KitsuLibraryEntryPostResponse = await application.fetch(`/library-entries/${libraryId}`, {
						method: "PATCH",
						headers: { "Content-Type": "application/vnd.api+json" },
						body: JSON.stringify({
							data: {
								id: libraryId,
								type: "libraryEntries",
								attributes,
							},
						}),
					});

					return res;
				},

				async delete(libraryId: number) {
					const res = await ctx.fetch(`${application.baseUri}library-entries/${libraryId}`, {
						method: "DELETE",
						headers: { ...(await application.withAuthHeaders()), "Content-Type": "application/vnd.api+json" },
					});

					return res.status === 204;
				},

				async fetchAll(type: "Anime" | "Manga") {
					const userId = application.userInfo.id.get();
					const kind = type.toLowerCase();
					let path: string | null = `/library-entries?filter[userId]=${userId}&filter[kind]=${kind}&include=media.mappings&page[limit]=500&page[offset]=0`;
					const all = [];

					while (path && state.syncing.get()) {
						try {
							const res: $kitsusync.KitsuLibraryEntriesResponse = await application.fetch(path);
							const medias: Record<string, $kitsusync.KitsuMedia> = {};
							const mappings: Record<string, $kitsusync.KitsuMappings> = {};

							for (const media of res.included ?? []) {
								if (media.type === "mappings") {
									if (!media.attributes.externalSite.startsWith("anilist")) continue;
									mappings[media.id] = media;
								} else {
									medias[media.id] = media;
								}
							}

							for (const entry of res.data ?? []) {
								const media = medias[entry.relationships?.media?.data?.id ?? "__missing__"];
								const mappingIds = (media?.relationships?.mappings?.data ?? []).map((x) => x.id);
								let mapping: $kitsusync.KitsuMappings | undefined;

								for (const id of mappingIds) {
									mapping = mappings[id] ?? mapping;
								}

								const mediaTitle =
									media?.attributes?.canonicalTitle ??
									media?.attributes?.titles?.en ??
									media?.attributes?.titles?.en_jp ??
									media?.attributes?.titles?.ja_jp ??
									null;

								all.push({
									libraryId: entry.id,
									mediaId: entry.relationships?.media?.data?.id,
									anilistId: mapping?.attributes?.externalId,
									mediaTitle,
									mediaType: entry.relationships?.media?.data?.type,
									attributes: entry.attributes,
								});
							}

							path = decodeURI(res.links?.next?.replace("https://kitsu.io/api/edge/", "") ?? "") || null;
							await $_wait(2_000);
						} catch (err) {
							throw new Error((err as Error).message);
						}
					}

					return all;
				},
			},

			async withAuthHeaders(): Promise<Record<string, string>> {
				if (!this.token.getAccessToken()) {
					await this.token.refresh();
				}
				return {
					Authorization: `${this.token.tokenType.get() ?? "Bearer"} ${this.token.accessToken.get()}`,
					"Content-Type": "application/json",
					"User-Agent": this.userAgent,
				};
			},

			async fetch(path: string, init: RequestInit = {}) {
				const res = await ctx.fetch(encodeURI(this.baseUri + path.replace(/^\/+/, "")), {
					...init,
					headers: {
						...(await this.withAuthHeaders()),
						...(init.headers as Record<string, string>),
					},
				});

				if (!res.ok) {
					const json = res.json?.();
					throw new Error(
						json?.message ??
							json?.error ??
							json?.error_description ??
							json?.errors?.map((e: any) => `${e?.title ?? "Error"}: ${e.detail ?? "(no details)"}`).join("\n") ??
							res.statusText
					);
				}

				return res.json();
			},
		};

		const tabs = {
			current: ctx.state<Tab>(Tab.Logon),
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
						tray.text("for Seanime", {
							style: { fontSize: "14px", textAlign: "center", marginTop: "-5px" },
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
						background: "linear-gradient(to bottom, #433242 0%, transparent 100%)",
						padding: "0.75rem",
					},
				});

				return tray.div([container, stack]);
			},
			backBtn() {
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

				const email = tray.input({ label: "Email", fieldRef: fieldRefs.email, disabled: state.loggingIn.get() });
				const password = tray.input({
					label: "Password",
					fieldRef: fieldRefs.password,
					disabled: state.loggingIn.get(),
					style: { "-webkit-text-security": "disc" },
				});
				const checkbox = tray.checkbox({
					label: "Remember me",
					size: "sm",
					disabled: state.loggingIn.get(),
					fieldRef: fieldRefs.rememberLoginDetails,
					style: { display: "inline" },
				});
				const passwordReset = tray.anchor({
					text: "Forgot password",
					href: "https://kitsu.app/password-reset",
					target: "_blank",
					style: { fontSize: "0.875rem", textAlign: "end", width: "100%" },
				});
				const passwordModifier = tray.flex([checkbox, passwordReset], {
					direction: "row",
					style: { justifyContent: "space-between", width: "100%" },
				});
				const login = tray.button({
					label: state.loginLabel.get(),
					intent: "gray-subtle",
					size: "md",
					loading: state.loggingIn.get(),
					style: {
						width: "100%",
					},
					onClick: ctx.eventHandler("kitsu:login", () => {
						if (!fieldRefs.email.current.length || !fieldRefs.password.current.length) {
							state.loginError.set("Please enter your email/password.");
							return;
						} else {
							state.loginError.set(null);
						}

						state.loggingIn.set(true);
						state.loginLabel.set("Logging In");
						log.sendInfo("Logging In...");

						application.token
							.login(fieldRefs.email.current, fieldRefs.password.current)
							.then(async () => {
								ctx.toast.success("Successfully logged in to kitsu!");
								log.sendSuccess("Successfully logged in!");

								$storage.set("kitsu.email", fieldRefs.rememberLoginDetails.current ? fieldRefs.email.current : "");
								$storage.set("kitsu.password", fieldRefs.rememberLoginDetails.current ? fieldRefs.password.current : "");
								log.sendInfo(`User ${fieldRefs.rememberLoginDetails.current ? "opted" : "opted out"} to remember login details`);

								await $_wait(1_000);
								return application.userInfo.fetch();
							})
							.then((user) => {
								log.send(`Welcome ${user.attributes.name}!`);

								if (application.userInfo.avatar.display.get() === application.userInfo.avatar.default)
									log.sendWarning("Missing avatar for current user. Reverting to default...");

								tabs.current.set(Tab.Landing);
							})
							.catch((err) => {
								const message = (err as Error).message === "invalid_grant" ? "Incorrect email/password" : (err as Error).message;
								state.loginError.set(message);
								log.sendError(`Login failed: ${message}`);
							})
							.finally(() => {
								state.loggingIn.set(false);
								state.loginLabel.set("Login");
							});
					}),
				});

				const signup = tray.div([
					tray.text("Don't have an account? ", { style: { display: "inline" } }),
					tray.anchor({ text: "Sign-up", href: "https://kitsu.app", target: "_blank" }),
				]);

				const logs = tray.button("View Logs", {
					size: "md",
					intent: "gray-subtle",
					className: "h-10",
					style: { marginTop: "1em" },
					onClick: ctx.eventHandler("kitsu:view-logs", () => {
						tabs.current.set(Tab.Logs);
					}),
					loading: state.loggingIn.get(),
				});

				const form = tray.flex([error, email, password, passwordModifier, login, signup, logs], {
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

			[Tab.Landing]() {
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
							application.token.set(null);
							application.userInfo.reset();
							state.syncing.set(false);

							// Back to login screen
							ctx.setTimeout(() => {
								ctx.toast.success("Logged out of kitsu!");
								tabs.current.set(Tab.Logon);
								state.loggingOut.set(false);
							}, 1_000);
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

				const statusbg = application.userInfo.status.get() === ConnectionState.Connected ? "#35ff5098" : "#ff353598";

				const status = tray.flex(
					[
						tray.text(application.userInfo.status.get() ?? "<???>", {
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
								backgroundImage: `url(${application.userInfo.avatar.display.get()})`,
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
										tray.text(application.userInfo.username.get() ?? "<kitsuUserName>", {
											style: { fontWeight: "bolder" },
										}),
										tray.text(`ID: ${application.userInfo.id.get() ?? "<kitsuUserId>"}`, {
											style: { fontSize: "0.875em", color: "#6b656b", fontWeight: "600" },
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
					onChange: ctx.eventHandler("kitsu:temp-disable", (e) => {
						$storage.set("kitsu:options-disableSync", e.value);
					}),
				});

				const manageList = tray.button("Manage List", {
					...buttonOpts,
					loading: state.loggingOut.get(),
					onClick: ctx.eventHandler("kitsu:list-settings", () => {
						tabs.current.set(Tab.ManageList);
					}),
				});

				const logs = tray.button("View Logs", {
					...buttonOpts,
					onClick: ctx.eventHandler("kitsu:view-logs", () => tabs.current.set(Tab.Logs)),
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

			[Tab.Logs]() {
				const header = tray.flex(
					[
						tray.text("Kitsu Logs", {
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
							onClick: ctx.eventHandler("kitsu:clear-logs", () => {
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

			[Tab.ManageList]() {
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
							value: "import",
						},
						{
							label: "Export to Anilist",
							value: "export",
						},
					],
					onChange: ctx.eventHandler("kitsu:manage-list-job-type", (e) => {
						const value = e.value as ManageListJobType;
						const subtext: Record<ManageListJobType, string> = {
							import: "Bring your AniList library into Kitsu to sync progress.",
							export: "Update AniList with your current Kitsu entries.",
						};

						fieldRefs.manageListJobType.setValue(value);
						state.manageListJobTypeDesc.set(subtext[value]);
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

				const mediaType = tray.select("Media Type", {
					size: "md",
					placeholder: "Select...",
					fieldRef: fieldRefs.manageListMediaType,
					disabled: state.syncing.get() || state.cancellingSync.get(),
					onChange: ctx.eventHandler("kitsu:manage-list-media-type", (e) => fieldRefs.manageListMediaType.setValue(e.value)),
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
				});

				const syncType = tray.select("Sync Type", {
					size: "md",
					placeholder: "Select...",
					fieldRef: fieldRefs.manageListSyncType,
					disabled: state.syncing.get() || state.cancellingSync.get(),
					style: { borderRadius: "1em 1em 0 0" },
					options: [
						{
							label: "Add Missing Entries",
							value: "patch",
						},
						{
							label: "Update Shared Entries",
							value: "post",
						},
						{
							label: "Mirror Lists",
							value: "fullsync",
						},
					],
					onChange: ctx.eventHandler("kitsu:manage-list-sync-type", (e) => {
						const value = e.value as ManageListSyncType;
						const subtext: Record<ManageListSyncType, string> = {
							patch: "Import only items not already in your list. Existing entries remain unchanged.",
							post: "Replace data for items found in both trackers. Items missing in either list are ignored.",
							fullsync: "Make both trackers identical. Shared entries are updated, and items missing in one are deleted.",
						};

						fieldRefs.manageListSyncType.setValue(value);
						state.manageListSyncTypeDesc.set(subtext[value]);
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
					label: state.syncing.get() || state.cancellingSync.get() ? "Cancel" : "Sync!",
					size: "md",
					loading: state.cancellingSync.get(),
					intent: state.syncing.get() || state.cancellingSync.get() ? "alert" : "success",
					style: {
						width: "100%",
						marginTop: "1.5em",
					},
					onClick: ctx.eventHandler("kitsu:manage-list-start-job", () => {
						if (state.syncing.get()) {
							state.syncing.set(false);
							state.cancellingSync.set(true);
							ctx.setTimeout(() => {
								state.cancellingSync.set(false);
							}, 5_000);
						} else {
							if (fieldRefs.manageListSyncType.current === ManageListSyncType.FullSync) {
								tabs.current.set(Tab.ManageListDanger);
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
								background: "#e75e45",
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

			[Tab.ManageListDanger]() {
				const container = tray.stack(
					[
						tray.text(
							"Continuing this operation will completely overwrite your list. Any entries that are not present in the source list will be permanently deleted. It is strongly recommended that you create a backup first by exporting your list on the respective tracker's website. By clicking the button below, you confirm that you understand the risk, acknowledge the consequences, and agree to proceed despite the potential loss of data.",
							{
								style: {
									textAlign: "justify",
									textAlignLast: "center",
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
							label: "Proceed",
							intent: "alert",
							size: "md",
							onClick: ctx.eventHandler("shikimori:sync-danger-accepted", () => {
								state.syncing.set(true);
								tabs.current.set(Tab.ManageList);
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

		function toISODate(date?: $app.AL_FuzzyDateInput) {
			if (!date?.year) return undefined;
			return new Date(Date.UTC(date.year, (date.month ?? 1) - 1, date.day ?? 1)).toISOString();
		}

		function anilistEntryToKitsuAttributeBody(
			entry: ReturnType<typeof getAnilistEntries>[number],
			kitsuEntry?: Awaited<ReturnType<typeof application.list.fetchAll>>[number]
		) {
			// entry is a GO/WASM object so i need to properly unwrap them here
			const status = unwrap(entry.status);
			const progress = unwrap(entry.progress);
			const repeat = unwrap(entry.repeat);
			const score = unwrap(entry.score);

			const body: $kitsusync.KitsuLibraryEntryWriteAttributes = {
				status: normalizeAniListStatustoKitsu(status),
				progress: status !== "COMPLETED" && progress ? progress : undefined,
				reconsuming: status === "REPEATING",
				reconsumeCount: status === "REPEATING" ? (repeat ?? 0) + 1 : repeat,
				ratingTwenty: score && score >= 10 ? Math.round(score / 5) : undefined,
				startedAt: toISODate({
					year: unwrap(entry.startedAt?.year),
					month: unwrap(entry.startedAt?.month),
					day: unwrap(entry.startedAt?.day),
				}),
				finishedAt: toISODate({
					year: unwrap(entry.completedAt?.year),
					month: unwrap(entry.completedAt?.month),
					day: unwrap(entry.completedAt?.day),
				}),
				notes: unwrap(entry.notes),
				private: unwrap(entry.private),
			};

			if (kitsuEntry?.attributes) {
				for (const prop in body) {
					const key = prop as keyof typeof body;
					if (body[key] === undefined || body[key] === kitsuEntry.attributes[key]) delete body[key];
				}
			}

			return body;
		}

		function kitsuLibrarytoAnilistBody(
			mediaId: number,
			entry: Awaited<ReturnType<typeof application.list.fetchAll>>[number],
			anilistEntry?: ReturnType<typeof getAnilistEntries>[number]
		) {
			const startedAt = entry.attributes.startedAt ? new Date(entry.attributes.startedAt) : undefined;
			const finishedAt = entry.attributes.finishedAt ? new Date(entry.attributes.finishedAt) : undefined;

			const body: AniListSaveMediaListEntryInput = {
				mediaId,
				status: normalizeKitsuStatustoAniList(entry.attributes.status),
				score: !isNaN(Number(entry.attributes.ratingTwenty)) ? Number(entry.attributes.ratingTwenty) * 5 : undefined,
				progress: entry.attributes.progress,
				repeat: entry.attributes.reconsumeCount,
				private: entry.attributes.private,
				notes: entry.attributes.notes ?? "",
				startedAt: startedAt
					? {
							year: startedAt.getFullYear(),
							month: startedAt.getMonth() + 1,
							day: startedAt.getDate(),
					  }
					: undefined,
				completedAt: finishedAt
					? {
							year: finishedAt.getFullYear(),
							month: finishedAt.getMonth() + 1,
							day: finishedAt.getDate(),
					  }
					: undefined,
			};

			if (anilistEntry) {
				for (const prop in body) {
					const key = prop as keyof typeof body;
					if (key === "startedAt") {
						if (startedAt?.toISOString().substring(0, 10) === toISODate(anilistEntry?.startedAt)?.substring(0, 10)) delete body[key];
					} else if (key === "completedAt") {
						if (finishedAt?.toISOString().substring(0, 10) === toISODate(anilistEntry?.completedAt)?.substring(0, 10)) delete body[key];
					} else {
						if (body[key] === undefined || body[key] === anilistEntry[key]) delete body[key];
					}
				}
			}

			return body;
		}

		function normalizeAniListStatustoKitsu(status?: $app.AL_MediaListStatus) {
			if (status === undefined || status === null) return undefined;
			const map: Record<typeof status, $kitsusync.ListStatus> = {
				COMPLETED: "completed",
				CURRENT: "current",
				DROPPED: "dropped",
				PAUSED: "on_hold",
				PLANNING: "planned",
				REPEATING: "current",
			};
			return map[status];
		}

		function normalizeKitsuStatustoAniList(status?: $kitsusync.ListStatus) {
			if (status === undefined || status === null) return undefined;
			const map: Record<typeof status, $app.AL_MediaListStatus> = {
				completed: "COMPLETED",
				current: "CURRENT",
				dropped: "DROPPED",
				on_hold: "PAUSED",
				planned: "PLANNING",
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

		async function syncEntries() {
			const jobType = fieldRefs.manageListJobType.current;
			const mediaType = fieldRefs.manageListMediaType.current;
			const syncType = fieldRefs.manageListSyncType.current;

			// Anilist ➔ Kitsu
			if (jobType === ManageListJobType.Import) {
				log.sendInfo("[SYNCLIST] Starting sync job... (Anilist ➔ kitsu)");
				const entries = getAnilistEntries(mediaType);
				if (!entries.length) {
					log.sendWarning("[SYNCLIST] No entries found.");
					log.sendWarning("[SYNCLIST] Sync job terminated.");
					return state.syncing.set(false);
				} else {
					log.sendInfo(`[SYNCLIST] Found ${entries.length} entries in AniList!`);
					syncProgress.refresh(entries.length);
				}

				log.send("[SYNCLIST] Querying Kitsu entries...");
				const kitsuEntries = await application.list
					.fetchAll(mediaType)
					.catch((e) => (e as Error).message)
					.finally(async () => await $_wait(1_000));
				if (typeof kitsuEntries === "string") {
					state.syncing.set(false);
					state.syncDetail.set(`Waiting...`);
					syncProgress.refresh(0);
					return log.sendError(`[SYNCLIST] Terminating syncjob: ${kitsuEntries}`);
				}
				log.sendInfo(`[SYNCLIST] Found ${kitsuEntries.length} entries in Kitsu!`);

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop();
					syncProgress.tick();

					if (!entry?.mediaId) continue;

					const title = entry?.title;
					state.syncDetail.set(`Syncing ${title}`);

					const kitsuLibraryEntry = popByProperty(kitsuEntries, "anilistId", String(entry.mediaId));
					if (!!kitsuLibraryEntry && syncType === ManageListSyncType.Patch) {
						log.sendWarning(`[SYNCLIST] Skipping ${title} (already-exists)...`);
						continue;
					}

					const idKitsu =
						Number(kitsuLibraryEntry?.mediaId) ||
						(await application.list
							.getKitsuMediaId(entry.mediaId, mediaType.toLowerCase() as "anime" | "manga")
							.catch((err) => (err as Error).message)
							.finally(async () => await $_wait(1000)));

					if (typeof idKitsu === "string") {
						log.sendError(`[SYNCLIST] Error on ${title}: ${idKitsu}`);
						continue;
					} else if (!idKitsu) {
						log.sendError(`[SYNCLIST] Skipping ${title} (no equivalent kitsu entry)...`);
						continue;
					}

					const update = anilistEntryToKitsuAttributeBody(entry, kitsuLibraryEntry);
					if (!Object.keys(update).length) {
						log.sendWarning(`[SYNCLIST] Skipping ${title}. (no-new-update)...`);
						continue;
					}

					await (kitsuLibraryEntry?.libraryId
						? application.list.patch(Number(kitsuLibraryEntry.libraryId), update)
						: application.list.post(idKitsu, mediaType.toLowerCase() as "anime" | "manga", update)
					)
						.then(() => log.sendSuccess(`[SYNCLIST] Updated ${entry.title} on Kitsu: ${JSON.stringify(update)}`))
						.catch((e) => log.sendError(`[SYNCLIST] Failed to update ${entry.title} on Kitsu ${(e as Error).message} ${JSON.stringify(update)}`))
						.finally(async () => await $_wait(1000));
				}

				if (syncType === ManageListSyncType.FullSync && typeof kitsuEntries !== "string" && state.syncing.get()) {
					log.sendInfo(`[SYNCLIST] Found ${kitsuEntries.length} remaining entries. Purging...`);
					state.syncDetail.set(`Purging ${kitsuEntries.length} entries...`);
					syncProgress.refresh(kitsuEntries.length);

					while (state.syncing.get() && kitsuEntries.length) {
						const kitsuLibraryEntry = kitsuEntries.pop()!;
						const title = kitsuLibraryEntry.mediaTitle ?? `kitsu-id/${kitsuLibraryEntry.mediaId}`;

						syncProgress.tick();
						state.syncDetail.set(`Deleting ${title}`);

						const idAnilist =
							Number(kitsuLibraryEntry.anilistId) ||
							(await application.list
								.getAnilistMediaId(Number(kitsuLibraryEntry.mediaId), kitsuLibraryEntry.mediaType!)
								.catch((err) => (err as Error).message)
								.finally(async () => await $_wait(1000)));

						if (typeof idAnilist === "string") {
							log.sendError(`[SYNCLIST] Unable to delete ${title}: ${idAnilist}`);
							continue;
						} else if (!idAnilist) {
							log.sendError(`[SYNCLIST] Will not delete ${title} (no equivalent AniList entry)...`);
							continue;
						}

						await application.list
							.delete(Number(kitsuLibraryEntry.libraryId))
							.then(() => log.sendSuccess(`[SYNCLIST] Deleted ${title} from kitsu library!`))
							.catch((err) => log.sendError(`[SYNCLIST] Unable to delete ${title}: ${(err as Error).message}`))
							.finally(async () => await $_wait(1000));
					}
				}
			}

			// Kitsu ➔ Anilist
			if (jobType === ManageListJobType.Export) {
				log.sendInfo("[SYNCLIST] Starting sync job... (Kitsu ➔ Anilist)");
				log.send("[SYNCLIST] Querying Kitsu entries...");
				const entries = await application.list
					.fetchAll(mediaType)
					.catch((e) => (e as Error).message)
					.finally(async () => await $_wait(1_000));

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
				const query = "mutation ( $mediaId: Int!, $status: MediaListStatus, $progress: Int, $progressVolumes: Int, $score: Float, $repeat: Int, $notes: String, $startedAt: FuzzyDateInput, $completedAt: FuzzyDateInput ) { SaveMediaListEntry( mediaId: $mediaId, status: $status, progress: $progress, progressVolumes: $progressVolumes, score: $score, repeat: $repeat, notes: $notes, startedAt: $startedAt, completedAt: $completedAt ) { id status progress progressVolumes score repeat notes startedAt { year month day } completedAt { year month day } } }";
				const anilistEntries = getAnilistEntries(mediaType);

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop()!;
					syncProgress.tick();

					const title = entry.mediaTitle ?? `kitsu-id/${entry.mediaId}`;
					state.syncDetail.set(`Syncing ${title}`);

					const idAnilist =
						Number(entry.anilistId) ||
						(await application.list
							.getAnilistMediaId(Number(entry.mediaId), entry.mediaType!)
							.catch((e) => (e as Error).message)
							.finally(async () => await $_wait(1_000)));

					if (typeof idAnilist === "string") {
						log.sendError(`[SYNCLIST] Error on ${title}: ${idAnilist}`);
						continue;
					} else if (!idAnilist) {
						log.sendError(`[SYNCLIST] Skipping ${title} (no equivalent AniList entry)...`);
						continue;
					}

					const anilistEntry = popByProperty(anilistEntries, "id", idAnilist);
					if (!!anilistEntry && syncType === ManageListSyncType.Patch) {
						log.sendWarning(`[SYNCLIST] Skipping ${title} (already-exists)...`);
						continue;
					}

					const body = kitsuLibrarytoAnilistBody(idAnilist, entry, anilistEntry);
					if (Object.keys(body).length <= 1) {
						log.sendWarning(`[SYNCLIST] Skipping ${title}. (no-new-update)...`);
						continue;
					}

					await anilistQuery(query, body)
						.then(() => log.sendSuccess(`[SYNCLIST] Updated ${title} on Anilist. ${JSON.stringify(body)}`))
						.catch((e) => log.sendError(`[SYNCLIST] Failed to update ${title} on Anilist: ${(e as Error).message} ${JSON.stringify(body)}`))
						.finally(async () => await $_wait(1000));
				}

				if (syncType === ManageListSyncType.FullSync && state.syncing.get()) {
					log.sendInfo(`[SYNCLIST] Found ${anilistEntries.length} remaining entries. Purging...`);
					state.syncDetail.set(`Purging ${anilistEntries.length} entries...`);

					syncProgress.refresh(anilistEntries.length);
					const query = "mutation ($id: Int!) { DeleteMediaListEntry(id: $id) { deleted } }";

					while (state.syncing.get() && anilistEntries.length) {
						const anilistEntry = anilistEntries.pop()!;
						const mediaTitle = anilistEntry.title ?? `anilist-id/${anilistEntry.id}`;

						syncProgress.tick();
						state.syncDetail.set(`Purging ${mediaTitle ?? "anilist-id/" + anilistEntry.id}`);

						// Check if entry exists in kitsu
						const idKitsu = await application.list
							.getKitsuMediaId(anilistEntry.id, mediaType.toLowerCase() as "anime" | "manga")
							.catch((err) => (err as Error).message)
							.finally(async () => await $_wait(1000));

						if (typeof idKitsu === "string") {
							log.sendError(`[SYNCLIST] Error on ${mediaTitle}: ${idKitsu}`);
							continue;
						} else if (!idKitsu) {
							log.sendError(`[SYNCLIST] Skipping ${mediaTitle} (no equivalent kitsu entry)...`);
							continue;
						}

						await anilistQuery(query, { id: anilistEntry.id })
							.then(() => log.sendSuccess(`[SYNCLIST] Deleted ${mediaTitle} from Anilist.`))
							.catch((e) => log.sendError(`[SYNCLIST] Failed to delete ${mediaTitle} from Anilist: ${(e as Error).message}}`))
							.finally(async () => await $_wait(1000));
					}
				}
			}

			if (!state.syncing.get()) {
				log.sendWarning("[SYNCLIST] Syncing was terminated by user");
			} else {
				log.sendInfo("[SYNCLIST] Finished syncing entries!");
				state.syncing.set(false);
			}

			state.syncDetail.set(`Waiting...`);
			syncProgress.refresh(0);
		}

		async function liveSync({
			event,
			preDataKey,
			buildBody,
			actionLabel,
		}: {
			event: $app.PostUpdateEntryEvent | $app.PostUpdateEntryProgressEvent | $app.PostUpdateEntryRepeatEvent | $app.PostDeleteEntryEvent;
			preDataKey: string;
			buildBody: (data: any, entry: any) => $kitsusync.KitsuLibraryEntryWriteAttributes;
			actionLabel: string;
		}) {
			const { mediaId } = event;

			if (!mediaId) {
				log.sendWarning(`[${actionLabel}] postUpdate hook was triggered but it contained no mediaId`);
				return $store.set(preDataKey, null);
			}

			const data = $store.get(preDataKey);
			if (!data) return log.sendWarning(`[${actionLabel}] No update data was emitted from the pre update hooks!`);
			$store.set(preDataKey, null);

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`[${actionLabel}] Syncing was disabled. Will not sync entry [${mediaId}]`);
			}

			const entry = await getMedia(mediaId);
			if (!entry || !entry.media) return log.sendWarning(`[${actionLabel}] Media not found (${mediaId})`);

			const title = entry.media.title?.userPreferred ?? `anilist-id/${mediaId}`;
			if (data.mediaId !== mediaId) return log.sendWarning(`[${actionLabel}] preUpdate data was invalid!`);

			const kitsuMediaId = await application.list
				.getKitsuMediaId(mediaId, entry.type.toLowerCase() as "anime" | "manga")
				.then(async (data) => {
					await $_wait(1000);
					return data;
				})
				.catch((e) => (e as Error).message);
			if (typeof kitsuMediaId === "string") return log.sendError(`[${actionLabel}] [${title}] ${kitsuMediaId}`);
			if (kitsuMediaId === null) return log.sendWarning(`[${actionLabel}] No equivalent Kitsu entry found for [${title}]`);

			const kitsuLibraryId = await application.list
				.getLibraryEntryId(kitsuMediaId)
				.then(async (data) => {
					await $_wait(1000);
					return data;
				})
				.catch((e) => (e as Error).message);
			if (typeof kitsuLibraryId === "string") return log.sendError(`[${actionLabel}] [${title}] ${kitsuMediaId}`);

			const body = buildBody(data, entry);
			const op = kitsuLibraryId
				? application.list.patch(kitsuLibraryId, body)
				: application.list.post(kitsuMediaId, entry.type.toLowerCase() as "anime" | "manga", body);
			const opName = kitsuLibraryId ? "PATCH" : "POST";

			op
				.then(() => log.sendSuccess(`[${actionLabel}] [${opName}] Synced ${title} to Kitsu. ${JSON.stringify(body)}`))
				.catch((e) => log.sendError(`[${actionLabel}] [${opName}] ${(e as Error).message}`));
		}

		$store.watch("POST_UPDATE_ENTRY", async (e) => {
			liveSync({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_DATA",
				actionLabel: "Kitsu.UpdateEntry",
				buildBody: (data) => {
					const body: $kitsusync.KitsuLibraryEntryWriteAttributes = {};
					if (typeof data.progress === "number") body.progress = data.progress;
					if (typeof data.scoreRaw === "number" && data.scoreRaw >= 10) body.ratingTwenty = data.scoreRaw / 5;
					if (typeof data.status === "string") body.status = normalizeAniListStatustoKitsu(data.status);
					body.reconsuming = (data.status as $app.AL_MediaListStatus) === "REPEATING";
					return body;
				},
			});
		});

		$store.watch("POST_UPDATE_ENTRY_PROGRESS", async (e) => {
			liveSync({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_PROGRESS_DATA",
				actionLabel: "Kitsu.UpdateProgress",
				buildBody: (data) => {
					const body: $kitsusync.KitsuLibraryEntryWriteAttributes = {};
					if (typeof data.status === "string") body.status = normalizeAniListStatustoKitsu(data.status);
					if (typeof data.progress === "number") body.progress = data.progress;
					if (data.progress === data.totalCount) body.status = "completed";
					body.reconsuming = (data.status as $app.AL_MediaListStatus) === "REPEATING";
					return body;
				},
			});
		});

		$store.watch("POST_UPDATE_ENTRY_REPEAT", async (e) => {
			liveSync({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_REPEAT_DATA",
				actionLabel: "Kitsu.UpdateRepeat",
				buildBody: (data) => ({
					reconsumeCount: data.repeat,
					reconsuming: false,
				}),
			});
		});

		$store.watch("POST_UPDATE_DELETE", async (e) => {
			const { mediaId } = e;
			if (!mediaId) return log.sendWarning("[Kitsu.DeleteEntry] postUpdate hook was triggered but it contained no mediaId");
			if (fieldRefs.disableSyncing.current.valueOf()) return log.sendInfo(`[Kitsu.DeleteEntry] Syncing was disabled. Will not sync entry [${mediaId}]`);

			const entry = await getMedia(mediaId);
			if (!entry || !entry.media) return log.sendWarning(`[Kitsu.DeleteEntry] Media not found (${mediaId})`);
			const title = entry.media.title?.userPreferred ?? `anilist-id/${mediaId}`;

			const kitsuMediaId = await application.list
				.getKitsuMediaId(mediaId, entry.type.toLowerCase() as "anime" | "manga")
				.catch((e) => (e as Error).message)
				.finally(async () => $_wait(1000));
			if (typeof kitsuMediaId === "string") return log.sendError(`[Kitsu.DeleteEntry] [${title}] ${kitsuMediaId}`);
			if (kitsuMediaId === null) return log.sendWarning(`[Kitsu.DeleteEntry] No equivalent Kitsu entry found for [${title}]`);

			const kitsuLibraryId = await application.list
				.getLibraryEntryId(kitsuMediaId)
				.catch((e) => (e as Error).message)
				.finally(async () => $_wait(1000));

			if (typeof kitsuLibraryId === "string") return log.sendError(`[Kitsu.DeleteEntry] [${title}] ${kitsuLibraryId}`);
			if (kitsuLibraryId === null) return log.sendInfo(`[Kitsu.DeleteEntry] [DELETE] ${title} does not exist in user's list.`);

			application.list
				.delete(kitsuLibraryId)
				.then((data) => {
					if (data) log.sendSuccess(`[Kitsu.DeleteEntry] [DELETE] Removed ${title} from Kitsu`);
					else log.sendInfo(`[Kitsu.DeleteEntry] [DELETE] ${title} does not exist in user's list.`);
				})
				.catch((e) => log.sendError(`[Kitsu.DeleteEntry] [DELETE] ${(e as Error).message}`));
		});

		tray.render(() => tabs.get());

		ctx.setInterval(() => {
			if (tabs.current.get() === Tab.Logs) tray.update();
		}, 1_500);

		log.send("Initializing extension...");
		log.send("Checking availability of access tokens...");
		if (application.token.getAccessToken() !== null) {
			log.sendSuccess("Access token found!");
			log.sendInfo("Fetching user info...");
			return application.userInfo
				.fetch()
				.then((data) => {
					log.sendSuccess("Successfully fetched user info!");
					log.send(`Signed in as: ${data.attributes.name}!`);
					if (application.userInfo.avatar.display.get() === application.userInfo.avatar.default)
						log.sendWarning("No user avatar detected! Reverting to default...");
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
					log.sendSuccess("Successfully fetched user info!");
					log.send(`Signed in as: ${data.attributes.name}!`);
					if (application.userInfo.avatar.display.get() === application.userInfo.avatar.default)
						log.sendWarning("No user avatar detected! Reverting to default...");
					tabs.current.set(Tab.Landing);
				})
				.catch((err: Error) => {
					log.sendError(`[Token Refresh Failed] ${err.message}`);
					log.send("Session Expired. Please login again.");
					state.loginError.set("Session Expired. Please login again.");
					tabs.current.set(Tab.Logon);
				});
		}

		log.sendWarning("Refresh token not found!");
		log.sendWarning("User authentication required.");
		tabs.current.set(Tab.Logon);
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
