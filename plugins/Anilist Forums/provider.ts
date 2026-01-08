/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./anilist-forums.d.ts" />
//
// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const state = {
			currentMediaId: ctx.state<number | null>(null),
			currentMediaTitle: ctx.state<string>(""),
			commentThreadLikeButtonIsLoading: ctx.state<boolean>(false),
			replyThreadLikeButtonIsLoading: ctx.state<boolean>(false),
			currentThread: ctx.state<($forums.ThreadOverview & { comments?: $forums.ThreadCommentsPage }) | null>(null),
			expandedReplies: ctx.state<number[]>([]),
			spoilers: ctx.state<string[]>([]),
			currentlyEditing: ctx.state<number>(0),
		};

		ctx.effect(() => state.expandedReplies.set([]), [state.currentThread]);

		const ThreadsManager = {
			id: "threads-manager-main",
			username: $database.anilist.getUsername(),
			isFetching: ctx.state<boolean>(false),
			commentSort: {
				enum: { ID: "Oldest", ID_DESC: "Newest" },
				fieldRef: ctx.fieldRef<"ID" | "ID_DESC">("ID"),
			},
			threadComment: {
				fieldRef: ctx.fieldRef<string>(""),
				replyFieldRef: ctx.fieldRef<string>(""),
				isReplying: ctx.state<boolean>(false),
				isDeleting: ctx.state<boolean>(false),
				edit: {
					commentId: ctx.state<number | null>(null),
					fieldRef: ctx.fieldRef<string>(""),
				},
			},
			threadGroup: {
				title: ctx.state<string>(""),
				mediaCategoryId: ctx.state<number | null>(null),
				type: ctx.state<"recentlyActive" | "releaseDiscussions" | "newlyCreated" | "media">("recentlyActive"),
				data: ctx.state<{
					Page: { threads: $forums.ThreadOverview[]; pageInfo: { hasNextPage: boolean; currentPage: number; lastPage: number } };
				} | null>(null),
			},
			threadSearch: {
				current: ctx.fieldRef<string>(""),
				queued: ctx.state<string | null>(null),
				lastRes: ctx.state<{
					Page: { threads: $forums.ThreadOverview[]; pageInfo: { hasNextPage: boolean; currentPage: number; lastPage: number } };
				} | null>(null),
			},
			get overview(): ($forums.ThreadListOverview["data"] & { fetchedAt: number }) | {} {
				return $store.getOrSet(this.id, () => ({}));
			},
			async searchThreads(search: string, page?: number) {
				// prettier-ignore
				ThreadsManager.threadSearch.current.setValue(search);
				const query =
					"query ($search: String, $page: Int = 1) { Page(page: $page, perPage: 20) { threads(sort: ID_DESC, search: $search) { id title body likeCount isLiked replyCount viewCount isSubscribed isLocked createdAt repliedAt user { id name avatar { large } moderatorRoles } replyUser { id name avatar { large } } categories { id name } mediaCategories { id type title { userPreferred } } } pageInfo { currentPage hasNextPage lastPage } } }";
				const response:
					| {
							data: { Page: { threads: $forums.ThreadOverview[]; pageInfo: { hasNextPage: boolean; currentPage: number; lastPage: number } } };
					  }
					| $forums.AnilistError = await this.fetch(query, { search, page });

				if (!response.data) throw new Error(response.errors.map((e) => `[${e.status}] ${e.message}`).join("\n"));
				ThreadsManager.threadSearch.lastRes.set(response.data);

				const queued = ThreadsManager.threadSearch.queued.get();
				if (queued?.trim().length) {
					ThreadsManager.threadSearch.queued.set(null);
					ThreadsManager.searchThreads(queued);
				}

				return response.data;
			},
			async fetchThreadsOverview(bypasscache: boolean = false, ttl: number = 60 * 5) {
				const overview = this.overview;
				if (!bypasscache && "fetchedAt" in overview && overview.fetchedAt + ttl * 1000 > Date.now()) {
					const { fetchedAt, ...rest } = overview;
					return rest;
				}

				// prettier-ignore
				const query = "query { pinnedThreads: Page(page: 1, perPage: 50) { threads( id_in: [1, 2340, 73094, 3878, 76237, 76239, 14] sort: UPDATED_AT_DESC ) { id title body(asHtml: false) likeCount isLiked replyCount viewCount isSubscribed isLocked createdAt repliedAt user { id name avatar { large } moderatorRoles } replyUser { id name avatar { large } } categories { id name } mediaCategories { id type title { userPreferred } } } } recentlyActive: Page(page: 1, perPage: 5) { threads(sort: REPLIED_AT_DESC) { id title body(asHtml: false) likeCount isLiked replyCount viewCount isSubscribed isLocked createdAt repliedAt user { id name avatar { large } moderatorRoles } replyUser { id name avatar { large } } categories { id name } mediaCategories { id type title { userPreferred } } } } releaseDiscussions: Page(page: 1, perPage: 5) { threads(categoryId: 5, sort: REPLIED_AT_DESC) { id title body(asHtml: false) likeCount isLiked replyCount viewCount isSubscribed isLocked createdAt repliedAt user { id name avatar { large } moderatorRoles } replyUser { id name avatar { large } } categories { id name } mediaCategories { id type title { userPreferred } } } } newlyCreated: Page(page: 1, perPage: 5) { threads(sort: ID_DESC) { id title body(asHtml: false) likeCount isLiked replyCount viewCount isSubscribed isLocked createdAt repliedAt user { id name avatar { large } moderatorRoles } replyUser { id name avatar { large } } categories { id name } mediaCategories { id type title { userPreferred } } } } }";
				const response: $forums.ThreadListOverview | $forums.AnilistError = await this.fetch(query);

				if (!response.data) throw new Error(response.errors.map((e) => `[${e.status}] ${e.message}`).join("\n"));
				$store.set(this.id, { ...response.data, fetchedAt: Date.now() });
				return response.data;
			},
			async fetchThreadsType(type: "recentlyActive" | "releaseDiscussions" | "newlyCreated" | "media", page: number = 1) {
				// prettier-ignore
				const args = ({ recentlyActive: "(sort: REPLIED_AT_DESC)", releaseDiscussions : "(categoryId: 5, sort: REPLIED_AT_DESC)", newlyCreated: "(sort: ID_DESC)", media: `(mediaCategoryId: ${ThreadsManager.threadGroup.mediaCategoryId.get()})`} as Record<typeof type, string>)[type] ?? "";
				// prettier-ignore
				const query = `query($page: Int = 1) { Page(page: $page, perPage: 20) { threads ${args} { id title body(asHtml: false) likeCount isLiked replyCount viewCount isSubscribed isLocked createdAt repliedAt user { id name avatar { large } moderatorRoles } replyUser { id name avatar { large } } categories { id name } mediaCategories { id type title { userPreferred } } }  pageInfo { hasNextPage currentPage lastPage } } }`;
				const response:
					| { data: { Page: { threads: $forums.ThreadOverview[]; pageInfo: { currentPage: number; lastPage: number; hasNextPage: boolean } } } }
					| $forums.AnilistError = await this.fetch(query, { page });

				if (!response.data) throw new Error(response.errors.map((e) => `[${e.status}] ${e.message}`).join("\n"));
				ThreadsManager.threadGroup.data.set(response.data);
				return response.data;
			},
			async fetchThreadCommentsPage(threadId: number, page?: number) {
				// prettier-ignore
				const query = "query ($threadId: Int, $page: Int = 1, $perPage: Int = 15) { Page(page: $page, perPage: $perPage) { threadComments(threadId: $threadId) { id threadId comment isLocked createdAt updatedAt user { id name avatar { large } moderatorRoles } likeCount isLiked isLocked childComments } pageInfo { hasNextPage currentPage lastPage } } }";
				// const sort = [this.commentSort.fieldRef.current];
				const response: { data: { Page: $forums.ThreadCommentsPage } } | $forums.AnilistError = await this.fetch(query, { threadId, page });

				if (!response.data) throw new Error(response.errors.map((e) => `[${e.status}] ${e.message}`).join("\n"));
				return response.data.Page;
			},
			async toggleLike(id: number, type: $forums.LikeableType) {
				const query = "mutation ($id: Int! $type: LikeableType) { ToggleLike(id: $id, type: $type) { id } }";
				const response: { data: { ToggleLike: { id: number } } } | $forums.AnilistError = await this.fetch(query, { id, type }, true);

				if (!response.data) throw new Error(response.errors.map((e) => `[${e.status}] ${e.message}`).join("\n"));
				return response.data;
			},
			async toggleThreadSubscription(threadId: number, subscribe: boolean) {
				const query =
					"mutation ($threadId: Int!, $subscribe: Boolean!) { ToggleThreadSubscription(threadId: $threadId, subscribe: $subscribe) { id isSubscribed } }";
				const response: { data: { ToggleThreadSubscription: { id: number; isSubscribed: boolean } } } | $forums.AnilistError = await this.fetch(
					query,
					{ threadId, subscribe },
					true
				);

				if (!response.data) throw new Error(response.errors.map((e) => `[${e.status}] ${e.message}`).join("\n"));
				return response.data;
			},
			async replyToThread(threadId: number, comment: string) {
				this.threadComment.isReplying.set(true);
				// prettier-ignore
				const query = "mutation($threadId: Int! $comment: String!) { SaveThreadComment( threadId: $threadId comment: $comment ) { id threadId comment createdAt updatedAt user { id name avatar { large } moderatorRoles } likeCount isLiked isLocked childComments } }";
				const response: { data: { SaveThreadComment: $forums.ThreadComment } } | $forums.AnilistError = await this.fetch(
					query,
					{ threadId, comment },
					true
				);

				this.threadComment.isReplying.set(false);
				if (!response.data) throw new Error(response.errors.map((e) => `[${e.status}] ${e.message}`).join("\n"));
				return response.data;
			},
			async replyToThreadComment(threadId: number, parentCommentId: number, comment: string) {
				this.threadComment.isReplying.set(true);
				// prettier-ignore
				const query = "mutation($threadId: Int! $parentCommentId: Int! $comment: String!) { SaveThreadComment( threadId: $threadId parentCommentId: $parentCommentId comment: $comment ) { id threadId comment createdAt updatedAt user { id name avatar { large } moderatorRoles } likeCount isLiked isLocked childComments } }";
				const response: { data: { SaveThreadComment: $forums.ThreadComment } } | $forums.AnilistError = await this.fetch(
					query,
					{
						threadId,
						parentCommentId,
						comment,
					},
					true
				);

				this.threadComment.isReplying.set(false);
				if (!response.data) throw new Error(response.errors.map((e) => `[${e.status}] ${e.message}`).join("\n"));
				return response.data;
			},
			async editThreadReply(id: number, threadId: number, comment: string) {
				this.threadComment.isReplying.set(true);
				// prettier-ignore
				const query = "mutation($id: Int!, $threadId: Int!, $comment: String!) { SaveThreadComment( id: $id threadId: $threadId comment: $comment ) { id threadId comment createdAt updatedAt user { id name avatar { large } moderatorRoles } likeCount isLiked isLocked childComments  } }";
				const response: { data: { SaveThreadComment: $forums.ThreadComment } } | $forums.AnilistError = await this.fetch(
					query,
					{
						id,
						threadId,
						comment,
					},
					true
				);

				this.threadComment.isReplying.set(false);
				if (!response.data) throw new Error(response.errors.map((e) => `[${e.status}] ${e.message}`).join("\n"));
				this.threadComment.edit.commentId.set(null);
				this.threadComment.edit.fieldRef.setValue("");
				return response.data;
			},
			async deleteThreadReply(id: number) {
				ThreadsManager.threadComment.isDeleting.set(true);
				const query = "mutation($id: Int!) { DeleteThreadComment(id: $id) { deleted } }";
				const response: { data: { DeleteThreadComment: { deleted: boolean } } } | $forums.AnilistError = await this.fetch(query, { id }, true);
				ThreadsManager.threadComment.isDeleting.set(false);
				if (!response.data) throw new Error(response.errors.map((e) => `[${e.status}] ${e.message}`).join("\n"));
				return response.data;
			},
			async fetch(query: string, variables?: Record<string, any>, suppressFetchState: boolean = false) {
				if (ThreadsManager.isFetching.get()) throw new Error("Violation: Parallel calls to https://graphql.anilist.co is not allowed!");

				ThreadsManager.isFetching.set(!suppressFetchState ? true : false);
				if (tabs.current.get() === Tabs.ThreadGroupView) tray.update(); // hacky way to schedule a re-render on ThreadGroupView since it doesn't seem to update after flipping isfetching value

				const res = await ctx
					.fetch("https://graphql.anilist.co", {
						method: "POST",
						headers: {
							Authorization: "Bearer " + $database.anilist.getToken(),
							"Content-Type": "application/json",
							Accept: "application/json",
						},
						body: JSON.stringify({ query, variables }),
					})
					.finally(() => ThreadsManager.isFetching.set(false));

				if (!res.ok) {
					try {
						return res.json() as $forums.AnilistError;
					} catch (err) {
						return {
							data: null,
							errors: [
								{
									message: res.statusText,
									status: res.status,
									locations: [],
								},
							],
						} satisfies $forums.AnilistError;
					}
				}

				return res.json();
			},
		};

		const MarkdownParser = {
			isPreceededByNewline: function (src: string, pos: number): boolean {
				if (pos === 0) return true;
				let i = pos - 1;
				while (i >= 0 && (src[i] === " " || src[i] === "\t")) {
					i--;
				}
				if (i < 0) return true;
				return src[i] === "\n";
			},

			parse: function (md: string, exclusions: { list?: boolean; hr?: boolean } = {}, uid?: string): $forums.MarkdownNode[] {
				const nodes: $forums.MarkdownNode[] = [];
				let i = 0;

				while (i < (md?.length ?? 0)) {
					// block level tokenizers
					const codeblock = md.slice(i).match(/^(?:```([\s\S]+?)```|<pre>([\s\S]+?)<\/pre>)/i);
					if (codeblock) {
						nodes.push({ type: "codeblock", content: codeblock[1] ?? codeblock[2].replace(/<[^>]+>/g, "") });
						i += codeblock[0].length;
						continue;
					}

					const spoiler = md.slice(i).match(/^(?:~!([\s\S]*?)!~|<div\s+rel=["']spoiler["']>([\s\S]*?)<\/div>)/i);
					if (spoiler) {
						nodes.push({
							type: "spoiler",
							uid: `${uid}:${i}`,
							children: MarkdownParser.parse(spoiler[1] ?? spoiler[2], { hr: true, list: true }, uid),
						});
						i += spoiler[0].length;
						continue;
					}

					const heading = md.slice(i).match(/^(#{1,5})\s*([^\n]+)|^<(h[1-5])>([\s\S]+?)(?:<\/\3>|\n|$)|^([^\n]+)\n(={2,}|-{2,})\s*(?:\n|$)/i);
					if (heading) {
						const level = heading[1] ? heading[1].length : heading[3] ? parseInt(heading[3].slice(1), 10) : heading[6].startsWith("=") ? 1 : 2;
						const text = (heading[2] || heading[4] || heading[5]).trim();
						nodes.push({ type: "heading", level, children: MarkdownParser.parse(text, { list: true }, uid) });
						i += heading[0].length;
						continue;
					}

					// Make sure this is always after parsing [heading] to avoid collision
					const hr = md.slice(i).match(/^(?:\n+)?(?:(?:-\s*){3,}|(?:\*\s*){3,}|(?:_\s*){3,}|<hr\s*\/?>)/i);
					if (hr && !exclusions.hr && (i === 0 || md[i - 1] === "\n")) {
						nodes.push({ type: "hr" });
						i += hr[0].length;
						continue;
					}

					// prettier-ignore
					const align = md.slice(i).match(/^(?:~~~([\s\S]+?)~~~|<center>([\s\S]+?)(?:<\/center>|$)|<(p|div)\s+align=["'](left|center|right|justify)["']>([\s\S]+?)<\/\3>)/i);
					if (align) {
						nodes.push({ type: "align", align: align[4] ?? "center", children: MarkdownParser.parse(align[1] ?? align[2] ?? align[5] ?? "", {}, uid) });
						i += align[0].length;
						continue;
					}

					const blockquote = md.slice(i).match(/^(>.*(?:\n(?!\n).*)*)(?:\n\n|$)/);
					if (blockquote && !exclusions.list && MarkdownParser.isPreceededByNewline(md, i)) {
						const lines = blockquote[1].split("\n");
						const root: Extract<$forums.MarkdownNode, { type: "quote" }> = { type: "quote", children: [] };

						const ensureContainer = (level: number) => {
							if (level === 0) return root;
							let node = root;
							for (let d = 1; d <= level; d++) {
								const last = node.children[node.children.length - 1];
								if (!last || last.type !== "quote") {
									const next: typeof root = { type: "quote", children: [] };
									node.children.push(next);
									node = next;
								} else {
									node = last;
								}
							}
							return node;
						};

						let level = 0;
						for (const line of lines) {
							const m = line.match(/^(>+)\s?(.*)$/);
							if (m) {
								const count = m[1].length;
								const text = m[2];

								// Apply rules:
								// - '>' alone: behave like no '>' (stay at current level)
								// - '>>': go to next level
								// - '>>>': go to next 2 levels, etc.
								const delta = Math.max(0, count - 1);
								level = delta === 0 ? level : delta;

								const container = ensureContainer(level);
								container.children.push({ type: "paragraph", children: MarkdownParser.parse(text, {}, uid) });
							} else {
								const container = ensureContainer(level);
								container.children.push({ type: "paragraph", children: MarkdownParser.parse(line, {}, uid) });
							}
						}

						nodes.push(root);
						i += blockquote[0].length;
						continue;
					}

					if (/^<blockquote>/i.test(md.slice(i))) {
						let depth = 0,
							end = i;
						const re = /<\/?blockquote>/gi;
						let m;
						while ((m = re.exec(md.slice(i)))) {
							if (m[0].toLowerCase() === "<blockquote>") depth++;
							else depth--;
							if (depth === 0) {
								end = i + re.lastIndex;
								break;
							}
						}

						if (depth > 0) end = md.length;
						const inner = md.slice(i + "<blockquote>".length, depth === 0 ? end - "</blockquote>".length : end).trim();

						nodes.push({ type: "quote", children: MarkdownParser.parse(inner, {}, uid) });
						i = end;
						continue;
					}

					// prettier-ignore
					const listblock = md.slice(i).match(/^( *)(?:[*+-]|\d+\.) [\s\S]+?(?:\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))|\n+(?=^ {0,3}\[((?:\\[\[\]]|[^\[\]])+)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)((?:"(?:\\"|[^"]|"[^"\n]*")*"|'\n?(?:[^'\n]+\n?)*'|\([^()]*\))))? *(?:\n+|$))|\n{2,}(?! )(?!\1(?:[*+-]|\d+\.) )\n*|\s*$)/);
					if (listblock && !exclusions.list && MarkdownParser.isPreceededByNewline(md, i)) {
						const lines = listblock[0].split(/\n(?=(?: {0,3})(?:[*+-]|\d+\.))/);

						// find first real item to determine base indent and ordered flag
						const first = lines.find((l) => /^(\s*)([*+-]|\d+\.)\s+/.test(l));
						if (!first) {
							i += listblock[0].length;
							continue;
						}
						const firstMatch = first.match(/^(\s*)([*+-]|\d+\.)\s+(.*)$/s)!;
						const baseIndent = firstMatch[1].length;

						const root: Extract<$forums.MarkdownNode, { type: "list" }> = {
							type: "list",
							ordered: /^\s*\d+\./.test(firstMatch[2]),
							items: [],
						};

						// stack of nesting levels; top is current list
						const stack: { indent: number; list: any }[] = [{ indent: baseIndent, list: root }];
						let lastItem: any = null;

						for (const raw of lines) {
							const m = raw.match(/^(\s*)([*+-]|\d+\.)\s+(.*)$/s);
							if (!m) continue;
							const indentLen = m[1].length;
							const bullet = m[2];
							let payload = m[3];

							// If payload has continuation lines, compute minimal leading spaces among continuation lines
							if (payload.includes("\n")) {
								const parts = payload.split("\n");
								// consider only continuation lines (lines after the first)
								const cont = parts.slice(1).filter((l) => l.length > 0);
								if (cont.length > 0) {
									const minLeading = cont.reduce((min, line) => {
										const leading = (line.match(/^ */) || [""])[0].length;
										return Math.min(min, leading);
									}, Infinity);
									// clamp strip to 1..4 (conservative)
									const strip = Number.isFinite(minLeading) ? Math.max(1, Math.min(minLeading, 4)) : 0;
									if (strip > 0) payload = payload.replace(new RegExp("^ {1," + strip + "}", "gm"), "");
								}
							}

							// If this item is outdented above the base indent, stop parsing this list block
							if (indentLen < baseIndent) break;

							// Pop stack until top.indent <= indentLen
							while (stack.length > 0 && indentLen < stack[stack.length - 1].indent) {
								stack.pop();
								lastItem = null;
							}

							const top = stack[stack.length - 1];

							if (indentLen === top.indent) {
								// sibling item at current level
								const itemNode = { type: "listitem", children: MarkdownParser.parse(payload, {}, uid) };
								top.list.items.push(itemNode);
								lastItem = itemNode;
							} else if (indentLen > top.indent) {
								// deeper indent -> nested list under lastItem
								if (!lastItem) {
									// defensive: create placeholder listitem if none exists
									lastItem = { type: "listitem", children: [] };
									top.list.items.push(lastItem);
								}

								const nestedList: Extract<$forums.MarkdownNode, { type: "list" }> = {
									type: "list",
									ordered: /^\s*\d+\./.test(bullet),
									items: [],
								};
								// attach nested list to lastItem
								lastItem.children.push(nestedList);

								// push nested level
								stack.push({ indent: indentLen, list: nestedList });

								// create first item in nested list
								const nestedItem: Extract<$forums.MarkdownNode, { type: "listitem" }> = {
									type: "listitem",
									children: MarkdownParser.parse(payload, {}, uid),
								};
								nestedList.items.push(nestedItem);
								lastItem = nestedItem;
							}
						}

						i += listblock[0].length;
						nodes.push(root);
						continue;
					}

					// inline tokenizers
					const newline = md.slice(i).match(/^(?:\n+|<br\s*\/?>)/);
					if (newline) {
						nodes.push({ type: "newline" });
						i += newline[0].length;
						continue;
					}

					const inlinecode = md.slice(i).match(/^(?:`([\s\S]+?)`|<code>([\s\S]+?)<\/code>)/i);
					if (inlinecode) {
						const content = inlinecode[1] ?? inlinecode[2].replace(/<[^>]+>/g, "");
						nodes.push({ type: "code", content });
						i += inlinecode[0].length;
						continue;
					}

					const boldtalic = md.slice(i).match(/^(\*\*\*|___)([\s\S]+?)\1/);
					if (boldtalic) {
						nodes.push({ type: "bold", children: [{ type: "italic", children: MarkdownParser.parse(boldtalic[2], {}, uid) }] });
						i += boldtalic[0].length;
						continue;
					}

					const bold = md.slice(i).match(/^(?:\*\*([\s\S]+?)\*\*|__([\s\S]+?)__|<(b|strong)>([\s\S]+?)<\/\3>)/i);
					if (bold) {
						nodes.push({ type: "bold", children: MarkdownParser.parse(bold[1] ?? bold[2] ?? bold[4], {}, uid) });
						i += bold[0].length;
						continue;
					}

					const italic = md.slice(i).match(/^(?:\*([\s\S]+?)\*|_([\s\S]+?)_|<(i|em)>([\s\S]+?)<\/\3>)/i);
					if (italic) {
						nodes.push({ type: "italic", children: MarkdownParser.parse(italic[1] ?? italic[2] ?? italic[4], {}, uid) });
						i += italic[0].length;
						continue;
					}

					const strike = md.slice(i).match(/^(?:~~([\s\S]+?)~~|<(del|strike)>([\s\S]+?)<\/\2>)/i);
					if (strike) {
						nodes.push({ type: "strikethrough", children: MarkdownParser.parse(strike[1] ?? strike[3], {}, uid) });
						i += strike[0].length;
						continue;
					}

					// prettier-ignore
					const image = md.slice(i).match(/^(?:!\[[^\]]*\]\(([^)]*)\)|<img\b[^>]*\bsrc=["']([^"']*)["'][^>]*>|img(\d+%?)?\(([^)]+)\))/i);
					if (image) {
						nodes.push({
							type: "image",
							src: image[1] ?? image[2] ?? image[4],
							width: image[3] ? (image[3].endsWith("%") ? image[3] : image[3] + "px") : undefined,
						});
						i += image[0].length;
						continue;
					}

					// [![alt](src)](href) → link with image child
					const linkedImage = md.slice(i).match(/^\[!\[([^\]]*)\]\(([^)]*)\)\]\(([^)]*)\)/);
					if (linkedImage) {
						nodes.push({ type: "link", href: linkedImage[3], children: [{ type: "image", src: linkedImage[2] }] });
						i += linkedImage[0].length;
						continue;
					}

					// [text](url)
					const link = md
						.slice(i)
						.match(/^(?:\[([^\]]*)\]\(([^)]*)\)|<a\s+href=["']([^"']*)["']>([\s\S]*?)<\/a>|<((?:https?|ftp):\/\/[^\s>]+)>|((?:https?|ftp):\/\/[^\s]+))/i);
					if (link) {
						const [match, mdText, mdHref, htmlHref, htmlText, autoUrl, bareUrl] = link;
						const href = mdHref ?? htmlHref ?? autoUrl ?? bareUrl ?? "";
						const text = mdText ?? htmlText ?? autoUrl ?? bareUrl ?? "";

						nodes.push({
							type: "link",
							href,
							children: /^(https?|ftp):\/\//.test(text) ? [{ type: "text", content: text }] : MarkdownParser.parse(text, {}, uid),
						});
						i += match.length;
						continue;
					}

					// highlight (<a> text </a>)
					const highlight = md.slice(i).match(/^<a\s*>(.*?)(?:<\/a\s*>|$)/i);
					if (highlight) {
						nodes.push({ type: "highlight", children: MarkdownParser.parse(highlight[1], {}, uid) });
						i += highlight[0].length;
						continue;
					}

					const youtube = md.slice(i).match(/^youtube\(([^)]*)\)/i);
					if (youtube) {
						const id = (youtube[1] ?? "").match(/(?:v=|youtu\.be\/|embed\/)?([A-Za-z0-9_-]{11})/)?.[1] ?? null;
						nodes.push({
							type: "youtube",
							id,
							src: `https://youtube.com/${id ? `watch?v=${id}` : ""}`,
							thumbnail: id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null,
						});
						i += youtube[0].length;
						continue;
					}

					const webm = /^webm\(([^)]+)\)/.exec(md.slice(i));
					if (webm) {
						nodes.push({ type: "webm", src: webm[1] });
						i += webm[0].length;
						continue;
					}

					const userlink = md.slice(i).match(/^@(\w+)/);
					if (userlink && (i === 0 || /\s/.test(md[i - 1]))) {
						nodes.push({ type: "link", href: `https://anilist.co/user/${userlink[1]}`, children: [{ type: "text", content: userlink[1] }] });
						i += userlink[0].length;
						continue;
					}

					// Fallback: plain text until next special token
					// prettier-ignore
					const specialRE = /(\n|[*_]{2,3}|[*_]|\n>|~~~|~~|~!|`|@|(?:^|\n)#{1,5}|<(?:code|center|pre|a|b|p|h{1,5}|blockquote|strong|i|em|del|strike|hr|img|div\s+rel=["']spoiler["'])|\[!\[|\[|img\d+%?\(|youtube\(|webm\()|(?:https?:\/\/|www\.)[^\s]+/;
					const nextSpecial = md.slice(i).search(specialRE);
					if (nextSpecial === -1) {
						nodes.push({
							type: "text",
							content: md
								.slice(i)
								.replace(/<[^>]+>/i, "")
								.replace(/ {2,}/g, " "),
						});
						break;
					} else if (nextSpecial > 0) {
						if (md.slice(i)[nextSpecial - 1] === "\\") {
							const [match, token] = md.slice(i).match(specialRE) ?? [];
							if (match && !/^</.test(token)) {
								nodes.push({
									type: "text",
									content: md
										.slice(i, i + nextSpecial + (token.length ?? 0))
										.replace(/^\\/, "")
										.replace(/<[^>]+>/i, "")
										.replace(/ {2,}/g, " "),
								});
								i += nextSpecial + (match?.length ?? 0);
								continue;
							}
						}
						nodes.push({
							type: "text",
							content: md
								.slice(i, i + nextSpecial)
								.replace(/<[^>]+>/i, "")
								.replace(/ {2,}/g, " "),
						});
						i += nextSpecial;
					} else {
						nodes.push({ type: "text", content: md[i].replace(/<[^>]+>/i, "").replace(/ {2,}/g, " ") });
						i += 1;
					}
				}

				return nodes;
			},

			renderTray: function (node: $forums.MarkdownNode): void {
				switch (node.type) {
					case "codeblock":
						return tray.text(`${node.content}`, { className: "bg-gray-800 p-2 rounded-sm", style: { fontFamily: "monospace" } });
					case "heading":
						return tray.div(node.children.map(MarkdownParser.renderTray), {
							className: "font-bold",
							style: { fontSize: `${1.25 - 0.05 * (node.level - 1)}rem` },
						});
					case "hr":
						return tray.div([tray.div([], { className: "absolute top-0 left-0 w-full h-1 bg-gray-800 rounded-full" })], { className: "relative h-2 mt-2" });
					case "listitem":
						return tray.div(node.children.map(MarkdownParser.renderTray));
					case "bold":
						return tray.div(node.children.map(MarkdownParser.renderTray), { className: "inline font-bold" });
					case "align":
						return tray.div(node.children.map(MarkdownParser.renderTray), {
							className: `w-full h-full text-${node.align}`,
						});
					case "code":
						return tray.text(`${node.content}`, { className: "inline", style: { fontFamily: "monospace" } });
					case "highlight":
						return tray.div([node.children.map(MarkdownParser.renderTray)], { className: "inline text-blue-400" });
					case "image":
						return tray.button("\u200b", {
							className: "w-full h-auto bg-no-repeat bg-start bg-cover",
							style: {
								// width: node.width ?? "",
								// maxWidth: "100%",
								backgroundImage: `url(${node.src})`,
								aspectRatio: "16 / 9",
								"--tw-bg-opacity": "0",
							},
							onClick: ctx.eventHandler(`preview:${node.src}:${Math.random().toFixed(5)}`, () => tabs.previewImage(node.src ?? "")),
						});
					case "italic":
						return tray.div(node.children.map(MarkdownParser.renderTray), { className: "inline italic" });
					case "link":
						if (node.children[0]?.type === "text" && node.children[0].content === node.href) {
							return tray.anchor(`${node.href}`, { href: node.href, target: "_blank", className: "text-blue-400 no-underline hover:underline" });
						} else {
							return tray.div((node.children ?? []).map(MarkdownParser.renderTray), {
								className: "inline text-blue-400 hover:underline cursor-pointer",
								onClick: ctx.eventHandler(`goto:${node.href}:${Math.random().toFixed(5)}`, () =>
									tabs.externalLinkModal(
										"Leaving Seanime",
										[
											tray.stack([
												tray.text("This link is taking you to the following website"),
												tray.text(`${node.href}`, { className: "p-3 rounded-lg border text-sm bg-gray-950 opacity-70" }),
											]),
										],
										node.href
									)
								),
							});
						}
					case "list":
						return tray.stack(
							node.items.map((item, i) =>
								tray.flex([
									tray.text(`${node.ordered ? i + 1 : "•"}`, { className: "w-fit" }),
									tray.div([MarkdownParser.renderTray(item)], { style: { alignItems: "flex-start" } }),
								])
							),
							{ gap: 0, className: "ml-2" }
						);
					case "newline":
						return tray.text("\u200b");
					case "paragraph":
						return tray.div(node.children.map(MarkdownParser.renderTray), { className: "w-full" });
					case "quote":
						return tray.div(node.children.map(MarkdownParser.renderTray), {
							className: "w-full border-l-4 rounded-md py-2 pl-4 pr-2 bg-blue-950 bg-opacity-30 text-gray-400 italic my-2",
						});
					case "spoiler":
						return tray.stack(
							[
								state.spoilers.get().includes(node.uid)
									? tray.div(
											[
												node.children.map(MarkdownParser.renderTray),
												tray.div(
													[
														tray.button("Click to hide spoiler", {
															size: "xs",
															className: "bg-transparent hover:bg-transparent hover:underline text-blue-400 p-0 w-fit font-normal",
															onClick: ctx.eventHandler(`spoiler:hide:${node.uid}`, () =>
																state.spoilers.set([...state.spoilers.get().filter((x) => x !== node.uid)])
															),
														}),
													],
													{ className: "mt-4" }
												),
											],
											{ className: "bg-blue-900 bg-opacity-30 p-2" }
									  )
									: tray.button("Spoiler, click to view", {
											size: "xs",
											className: "bg-transparent hover:bg-transparent hover:underline text-blue-400 p-0 w-fit font-normal",
											onClick: ctx.eventHandler(`spoiler:reveal:${node.uid}`, () => state.spoilers.set([...new Set([...state.spoilers.get(), node.uid])])),
									  }),
							],
							{ className: "justify-left" }
						);
					case "strikethrough":
						return tray.div(node.children.map(MarkdownParser.renderTray), { className: "inline", style: { textDecoration: "line-through" } });
					case "text": {
						return tray.text(`${LoadDoc(`<p>${node.content}</p>`)("body").text()}`, {
							className: `w-fit text-pretty inline break-words`,
							style: { wordBreak: "break-word" },
						});
					}
					case "webm":
						return tray.anchor("Open video in external tab", {
							href: node.src,
							className: "w-fit italic no-underline hover:underline text-blue-400",
						});
					case "youtube":
						return tray.flex(
							[
								tray.div([], {
									className: "bg-no-repeat bg-center bg-contain w-10 h-10",
									style: {
										backgroundImage: `url(${icons.youtube})`,
										width: "5rem",
										height: "5rem",
									},
								}),
								tray.anchor("\u200b", { href: node.src, className: "absolute w-full h-full top-0 left-0 z-[2]" }),
							],
							{
								className: "relative flex w-full block bg-no-repeat bg-center bg-contain justify-center items-center",
								style: {
									backgroundImage: `url(${node.thumbnail})`,
									aspectRatio: "4",
									"--tw-bg-opacity": "0",
								},
							}
						);
					default:
						return [] as any;
				}
			},
		};

		enum Tabs {
			Overview = 1,
			Search = 2,
			ThreadGroupView = 3,
			ThreadView = 4,
		}

		// prettier-ignore
		const icons = {
            back: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNSA4YS41LjUgMCAwIDAtLjUtLjVIMi43MDdsMy4xNDctMy4xNDZhLjUuNSAwIDEgMC0uNzA4LS43MDhsLTQgNGEuNS41IDAgMCAwIDAgLjcwOGw0IDRhLjUuNSAwIDAgMCAuNzA4LS43MDhMMi43MDcgOC41SDE0LjVBLjUuNSAwIDAgMCAxNSA4Ii8+PC9zdmc+",
			bold: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJNMzMzLjQ5IDIzOGExMjIgMTIyIDAgMCAwIDI3LTY1LjIxQzM2Ny44NyA5Ni40OSAzMDggMzIgMjMzLjQyIDMySDM0YTE2IDE2IDAgMCAwLTE2IDE2djQ4YTE2IDE2IDAgMCAwIDE2IDE2aDMxLjg3djI4OEgzNGExNiAxNiAwIDAgMC0xNiAxNnY0OGExNiAxNiAwIDAgMCAxNiAxNmgyMDkuMzJjNzAuOCAwIDEzNC4xNC01MS43NSAxNDEtMTIyLjQgNC43NC00OC40NS0xNi4zOS05Mi4wNi01MC44My0xMTkuNk0xNDUuNjYgMTEyaDg3Ljc2YTQ4IDQ4IDAgMCAxIDAgOTZoLTg3Ljc2em04Ny43NiAyODhoLTg3Ljc2VjI4OGg4Ny43NmE1NiA1NiAwIDAgMSAwIDExMiIvPjwvc3ZnPg==",
			center: "data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDQ4IDUxMiIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLWFsaWduLWNlbnRlciBmYS13LTE0Ij48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJNNDMyIDE2MEgxNmExNiAxNiAwIDAgMC0xNiAxNnYzMmExNiAxNiAwIDAgMCAxNiAxNmg0MTZhMTYgMTYgMCAwIDAgMTYtMTZ2LTMyYTE2IDE2IDAgMCAwLTE2LTE2bTAgMjU2SDE2YTE2IDE2IDAgMCAwLTE2IDE2djMyYTE2IDE2IDAgMCAwIDE2IDE2aDQxNmExNiAxNiAwIDAgMCAxNi0xNnYtMzJhMTYgMTYgMCAwIDAtMTYtMTZNMTA4LjEgOTZoMjMxLjgxQTEyLjA5IDEyLjA5IDAgMCAwIDM1MiA4My45VjQ0LjA5QTEyLjA5IDEyLjA5IDAgMCAwIDMzOS45MSAzMkgxMDguMUExMi4wOSAxMi4wOSAwIDAgMCA5NiA0NC4wOVY4My45QTEyLjEgMTIuMSAwIDAgMCAxMDguMSA5Nm0yMzEuODEgMjU2QTEyLjA5IDEyLjA5IDAgMCAwIDM1MiAzMzkuOXYtMzkuODFBMTIuMDkgMTIuMDkgMCAwIDAgMzM5LjkxIDI4OEgxMDguMUExMi4wOSAxMi4wOSAwIDAgMCA5NiAzMDAuMDl2MzkuODFhMTIuMSAxMi4xIDAgMCAwIDEyLjEgMTIuMXoiLz48L3N2Zz4=",
			chevy_down: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNjYWNhY2EiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMTguNzA3IDguNzkzYTEgMSAwIDAgMC0xLjQxNCAwTDEyIDE0LjA4NiA2LjcwNyA4Ljc5M2ExIDEgMCAxIDAtMS40MTQgMS40MTRMMTIgMTYuOTE0bDYuNzA3LTYuNzA3YTEgMSAwIDAgMCAwLTEuNDE0Ii8+PC9zdmc+",
			chevy_right: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIj48cGF0aCBzdHJva2U9IiNjYWNhY2EiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJtNyAxNiA2LTYtNi02Ii8+PC9zdmc+",
			chevy_up: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBmaWxsPSIjY2FjYWNhIj48cGF0aCBkPSJNNS4yOTMgMTUuMjA3YTEgMSAwIDAgMCAxLjQxNCAwTDEyIDkuOTE0bDUuMjkzIDUuMjkzYTEgMSAwIDEgMCAxLjQxNC0xLjQxNEwxMiA3LjA4NmwtNi43MDcgNi43MDdhMSAxIDAgMCAwIDAgMS40MTQiLz48L3N2Zz4=",
			close: "data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDE2IDE2IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibTcuMTE2IDgtNC41NTggNC41NTguODg0Ljg4NEw4IDguODg0bDQuNTU4IDQuNTU4Ljg4NC0uODg0TDguODg0IDhsNC41NTgtNC41NTgtLjg4NC0uODg0TDggNy4xMTYgMy40NDIgMi41NThsLS44ODQuODg0eiIgc3Ryb2tlPSJub25lIi8+PC9zdmc+",
            code: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJtMjc4LjkgNTExLjUtNjEtMTcuN2MtNi40LTEuOC0xMC04LjUtOC4yLTE0LjlMMzQ2LjIgOC43YzEuOC02LjQgOC41LTEwIDE0LjktOC4ybDYxIDE3LjdjNi40IDEuOCAxMCA4LjUgOC4yIDE0LjlMMjkzLjggNTAzLjNjLTEuOSA2LjQtOC41IDEwLjEtMTQuOSA4LjJtLTExNC0xMTIuMiA0My41LTQ2LjRjNC42LTQuOSA0LjMtMTIuNy0uOC0xNy4yTDExNyAyNTZsOTAuNi03OS43YzUuMS00LjUgNS41LTEyLjMuOC0xNy4ybC00My41LTQ2LjRjLTQuNS00LjgtMTIuMS01LjEtMTctLjVMMy44IDI0Ny4yYy01LjEgNC43LTUuMSAxMi44IDAgMTcuNWwxNDQuMSAxMzUuMWM0LjkgNC42IDEyLjUgNC40IDE3LS41bTMyNy4yLjYgMTQ0LjEtMTM1LjFjNS4xLTQuNyA1LjEtMTIuOCAwLTE3LjVMNDkyLjEgMTEyLjFjLTQuOC00LjUtMTIuNC00LjMtMTcgLjVMNDMxLjYgMTU5Yy00LjYgNC45LTQuMyAxMi43LjggMTcuMkw1MjMgMjU2bC05MC42IDc5LjdjLTUuMSA0LjUtNS41IDEyLjMtLjggMTcuMmw0My41IDQ2LjRjNC41IDQuOSAxMi4xIDUuMSAxNyAuNiIvPjwvc3ZnPg==",
			comments: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNyIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDU3NiA1MTIiPjxwYXRoIGZpbGw9IiNjYWNhY2EiIGQ9Ik00MTYgMTkyYzAtODguNC05My4xLTE2MC0yMDgtMTYwUzAgMTAzLjYgMCAxOTJjMCAzNC4zIDE0LjEgNjUuOSAzOCA5Mi0xMy40IDMwLjItMzUuNSA1NC4yLTM1LjggNTQuNS0yLjIgMi4zLTIuOCA1LjctMS41IDguN1M0LjggMzUyIDggMzUyYzM2LjYgMCA2Ni45LTEyLjMgODguNy0yNSAzMi4yIDE1LjcgNzAuMyAyNSAxMTEuMyAyNSAxMTQuOSAwIDIwOC03MS42IDIwOC0xNjBtMTIyIDIyMGMyMy45LTI2IDM4LTU3LjcgMzgtOTIgMC02Ni45LTUzLjUtMTI0LjItMTI5LjMtMTQ4LjEuOSA2LjYgMS4zIDEzLjMgMS4zIDIwLjEgMCAxMDUuOS0xMDcuNyAxOTItMjQwIDE5Mi0xMC44IDAtMjEuMy0uOC0zMS43LTEuOUMyMDcuOCA0MzkuNiAyODEuOCA0ODAgMzY4IDQ4MGM0MSAwIDc5LjEtOS4yIDExMS4zLTI1IDIxLjggMTIuNyA1Mi4xIDI1IDg4LjcgMjUgMy4yIDAgNi4xLTEuOSA3LjMtNC44IDEuMy0yLjkuNy02LjMtMS41LTguNy0uMy0uMy0yMi40LTI0LjItMzUuOC01NC41Ii8+PC9zdmc+",
            flag: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2NhY2FjYSIgY2xhc3M9ImJpIGJpLWZsYWctZmlsbCIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNMTQuNzc4LjA4NUEuNS41IDAgMCAxIDE1IC41VjhhLjUuNSAwIDAgMS0uMzE0LjQ2NEwxNC41IDhsLjE4Ni40NjQtLjAwMy4wMDEtLjAwNi4wMDMtLjAyMy4wMDlhMTIgMTIgMCAwIDEtLjM5Ny4xNWMtLjI2NC4wOTUtLjYzMS4yMjMtMS4wNDcuMzUtLjgxNi4yNTItMS44NzkuNTIzLTIuNzEuNTIzLS44NDcgMC0xLjU0OC0uMjgtMi4xNTgtLjUyNWwtLjAyOC0uMDFDNy42OCA4LjcxIDcuMTQgOC41IDYuNSA4LjVjLS43IDAtMS42MzguMjMtMi40MzcuNDc3QTIwIDIwIDAgMCAwIDMgOS4zNDJWMTUuNWEuNS41IDAgMCAxLTEgMFYuNWEuNS41IDAgMCAxIDEgMHYuMjgyYy4yMjYtLjA3OS40OTYtLjE3Ljc5LS4yNkM0LjYwNi4yNzIgNS42NyAwIDYuNSAwYy44NCAwIDEuNTI0LjI3NyAyLjEyMS41MTlsLjA0My4wMThDOS4yODYuNzg4IDkuODI4IDEgMTAuNSAxYy43IDAgMS42MzgtLjIzIDIuNDM3LS40NzdhMjAgMjAgMCAwIDAgMS4zNDktLjQ3NmwuMDE5LS4wMDcuMDA0LS4wMDJoLjAwMSIvPjwvc3ZnPg==",
			heading: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJNNDQ4IDk2djMyMGgzMmExNiAxNiAwIDAgMSAxNiAxNnYzMmExNiAxNiAwIDAgMS0xNiAxNkgzMjBhMTYgMTYgMCAwIDEtMTYtMTZ2LTMyYTE2IDE2IDAgMCAxIDE2LTE2aDMyVjI4OEgxNjB2MTI4aDMyYTE2IDE2IDAgMCAxIDE2IDE2djMyYTE2IDE2IDAgMCAxLTE2IDE2SDMyYTE2IDE2IDAgMCAxLTE2LTE2di0zMmExNiAxNiAwIDAgMSAxNi0xNmgzMlY5NkgzMmExNiAxNiAwIDAgMS0xNi0xNlY0OGExNiAxNiAwIDAgMSAxNi0xNmgxNjBhMTYgMTYgMCAwIDEgMTYgMTZ2MzJhMTYgMTYgMCAwIDEtMTYgMTZoLTMydjEyOGgxOTJWOTZoLTMyYTE2IDE2IDAgMCAxLTE2LTE2VjQ4YTE2IDE2IDAgMCAxIDE2LTE2aDE2MGExNiAxNiAwIDAgMSAxNiAxNnYzMmExNiAxNiAwIDAgMS0xNiAxNnoiLz48L3N2Zz4=",
			heart: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDUxMiA1MTIiPjxwYXRoIGZpbGw9IiNjYWNhY2EiIGQ9Ik00NjIuMyA2Mi42QzQwNy41IDE1LjkgMzI2IDI0LjMgMjc1LjcgNzYuMkwyNTYgOTYuNWwtMTkuNy0yMC4zQzE4Ni4xIDI0LjMgMTA0LjUgMTUuOSA0OS43IDYyLjZjLTYyLjggNTMuNi02Ni4xIDE0OS44LTkuOSAyMDcuOWwxOTMuNSAxOTkuOGMxMi41IDEyLjkgMzIuOCAxMi45IDQ1LjMgMGwxOTMuNS0xOTkuOGM1Ni4zLTU4LjEgNTMtMTU0LjMtOS44LTIwNy45Ii8+PC9zdmc+",
			heart_active: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDUxMiA1MTIiPjxwYXRoIGZpbGw9IiNmODcxNzEiIGQ9Ik00NjIuMyA2Mi42QzQwNy41IDE1LjkgMzI2IDI0LjMgMjc1LjcgNzYuMkwyNTYgOTYuNWwtMTkuNy0yMC4zQzE4Ni4xIDI0LjMgMTA0LjUgMTUuOSA0OS43IDYyLjZjLTYyLjggNTMuNi02Ni4xIDE0OS44LTkuOSAyMDcuOWwxOTMuNSAxOTkuOGMxMi41IDEyLjkgMzIuOCAxMi45IDQ1LjMgMGwxOTMuNS0xOTkuOGM1Ni4zLTU4LjEgNTMtMTU0LjMtOS44LTIwNy45Ii8+PC9zdmc+",
			image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBjbGFzcz0ic3ZnLWlubGluZS0tZmEgZmEtaW1hZ2UgZmEtdy0xNiI+PHBhdGggZmlsbD0iI2NhY2FjYSIgZD0iTTQ2NCA0NDhINDhjLTI2LjUxIDAtNDgtMjEuNDktNDgtNDhWMTEyYzAtMjYuNTEgMjEuNDktNDggNDgtNDhoNDE2YzI2LjUxIDAgNDggMjEuNDkgNDggNDh2Mjg4YzAgMjYuNTEtMjEuNDkgNDgtNDggNDhNMTEyIDEyMGMtMzAuOTI4IDAtNTYgMjUuMDcyLTU2IDU2czI1LjA3MiA1NiA1NiA1NiA1Ni0yNS4wNzIgNTYtNTYtMjUuMDcyLTU2LTU2LTU2TTY0IDM4NGgzODRWMjcybC04Ny41MTUtODcuNTE1Yy00LjY4Ni00LjY4Ni0xMi4yODQtNC42ODYtMTYuOTcxIDBMMjA4IDMyMGwtNTUuNTE1LTU1LjUxNWMtNC42ODYtNC42ODYtMTIuMjg0LTQuNjg2LTE2Ljk3MSAwTDY0IDMzNnoiLz48L3N2Zz4=",
			italic: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgNTEyIiBjbGFzcz0ic3ZnLWlubGluZS0tZmEgZmEtaXRhbGljIGZhLXctMTAiPjxwYXRoIGZpbGw9IiNjYWNhY2EiIGQ9Ik0zMjAgNDh2MzJhMTYgMTYgMCAwIDEtMTYgMTZoLTYyLjc2bC04MCAzMjBIMjA4YTE2IDE2IDAgMCAxIDE2IDE2djMyYTE2IDE2IDAgMCAxLTE2IDE2SDE2YTE2IDE2IDAgMCAxLTE2LTE2di0zMmExNiAxNiAwIDAgMSAxNi0xNmg2Mi43Nmw4MC0zMjBIMTEyYTE2IDE2IDAgMCAxLTE2LTE2VjQ4YTE2IDE2IDAgMCAxIDE2LTE2aDE5MmExNiAxNiAwIDAgMSAxNiAxNiIvPjwvc3ZnPg==",
			link: "data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0zMjYuNjEyIDE4NS4zOTFjNTkuNzQ3IDU5LjgwOSA1OC45MjcgMTU1LjY5OC4zNiAyMTQuNTktLjExLjEyLS4yNC4yNS0uMzYuMzdsLTY3LjIgNjcuMmMtNTkuMjcgNTkuMjctMTU1LjY5OSA1OS4yNjItMjE0Ljk2IDAtNTkuMjctNTkuMjYtNTkuMjctMTU1LjcgMC0yMTQuOTZsMzcuMTA2LTM3LjEwNmM5Ljg0LTkuODQgMjYuNzg2LTMuMyAyNy4yOTQgMTAuNjA2LjY0OCAxNy43MjIgMy44MjYgMzUuNTI3IDkuNjkgNTIuNzIxIDEuOTg2IDUuODIyLjU2NyAxMi4yNjItMy43ODMgMTYuNjEybC0xMy4wODcgMTMuMDg3Yy0yOC4wMjYgMjguMDI2LTI4LjkwNSA3My42Ni0xLjE1NSAxMDEuOTYgMjguMDI0IDI4LjU3OSA3NC4wODYgMjguNzQ5IDEwMi4zMjUuNTFsNjcuMi02Ny4xOWMyOC4xOTEtMjguMTkxIDI4LjA3My03My43NTcgMC0xMDEuODMtMy43MDEtMy42OTQtNy40MjktNi41NjQtMTAuMzQxLTguNTY5YTE2LjA0IDE2LjA0IDAgMCAxLTYuOTQ3LTEyLjYwNmMtLjM5Ni0xMC41NjcgMy4zNDgtMjEuNDU2IDExLjY5OC0yOS44MDZsMjEuMDU0LTIxLjA1NWM1LjUyMS01LjUyMSAxNC4xODItNi4xOTkgMjAuNTg0LTEuNzMxYTE1Mi41IDE1Mi41IDAgMCAxIDIwLjUyMiAxNy4xOTdNNDY3LjU0NyA0NC40NDljLTU5LjI2MS01OS4yNjItMTU1LjY5LTU5LjI3LTIxNC45NiAwbC02Ny4yIDY3LjJjLS4xMi4xMi0uMjUuMjUtLjM2LjM3LTU4LjU2NiA1OC44OTItNTkuMzg3IDE1NC43ODEuMzYgMjE0LjU5YTE1Mi41IDE1Mi41IDAgMCAwIDIwLjUyMSAxNy4xOTZjNi40MDIgNC40NjggMTUuMDY0IDMuNzg5IDIwLjU4NC0xLjczMWwyMS4wNTQtMjEuMDU1YzguMzUtOC4zNSAxMi4wOTQtMTkuMjM5IDExLjY5OC0yOS44MDZhMTYuMDQgMTYuMDQgMCAwIDAtNi45NDctMTIuNjA2Yy0yLjkxMi0yLjAwNS02LjY0LTQuODc1LTEwLjM0MS04LjU2OS0yOC4wNzMtMjguMDczLTI4LjE5MS03My42MzkgMC0xMDEuODNsNjcuMi02Ny4xOWMyOC4yMzktMjguMjM5IDc0LjMtMjguMDY5IDEwMi4zMjUuNTEgMjcuNzUgMjguMyAyNi44NzIgNzMuOTM0LTEuMTU1IDEwMS45NmwtMTMuMDg3IDEzLjA4N2MtNC4zNSA0LjM1LTUuNzY5IDEwLjc5LTMuNzgzIDE2LjYxMiA1Ljg2NCAxNy4xOTQgOS4wNDIgMzQuOTk5IDkuNjkgNTIuNzIxLjUwOSAxMy45MDYgMTcuNDU0IDIwLjQ0NiAyNy4yOTQgMTAuNjA2bDM3LjEwNi0zNy4xMDZjNTkuMjcxLTU5LjI1OSA1OS4yNzEtMTU1LjY5OS4wMDEtMjE0Ljk1OSIgc3Ryb2tlPSJub25lIi8+PC9zdmc+",
            magnifying_glass: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM1YTVhNWEiIGhlaWdodD0iNTEyIiB3aWR0aD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTQ5NSA0NjYuMiAzNzcuMiAzNDguNGMyOS4yLTM1LjYgNDYuOC04MS4yIDQ2LjgtMTMwLjlDNDI0IDEwMy41IDMzMS41IDExIDIxNy41IDExIDEwMy40IDExIDExIDEwMy41IDExIDIxNy41UzEwMy40IDQyNCAyMTcuNSA0MjRjNDkuNyAwIDk1LjItMTcuNSAxMzAuOC00Ni43TDQ2Ni4xIDQ5NWM4IDggMjAuOSA4IDI4LjkgMCA4LTcuOSA4LTIwLjkgMC0yOC44bS0yNzcuNS04My4zQzEyNi4yIDM4Mi45IDUyIDMwOC43IDUyIDIxNy41UzEyNi4yIDUyIDIxNy41IDUyQzMwOC43IDUyIDM4MyAxMjYuMyAzODMgMjE3LjVzLTc0LjMgMTY1LjQtMTY1LjUgMTY1LjQiLz48L3N2Zz4=",
            ol: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJtNjEuNzcgNDAxIDE3LjUtMjAuMTVhMTkuOTIgMTkuOTIgMCAwIDAgNS4wNy0xNC4xOXYtMy4zMUM4NC4zNCAzNTYgODAuNSAzNTIgNzMgMzUySDE2YTggOCAwIDAgMC04IDh2MTZhOCA4IDAgMCAwIDggOGgyMi44M2ExNTcgMTU3IDAgMCAwLTExIDEyLjMxbC01LjYxIDdjLTQgNS4wNy01LjI1IDEwLjEzLTIuOCAxNC44OGwxLjA1IDEuOTNjMyA1Ljc2IDYuMjkgNy44OCAxMi4yNSA3Ljg4aDQuNzNjMTAuMzMgMCAxNS45NCAyLjQ0IDE1Ljk0IDkuMDkgMCA0LjcyLTQuMiA4LjIyLTE0LjM2IDguMjJhNDEuNSA0MS41IDAgMCAxLTE1LjQ3LTMuMTJjLTYuNDktMy44OC0xMS43NC0zLjUtMTUuNiAzLjEybC01LjU5IDkuMzFjLTMuNzIgNi4xMy0zLjE5IDExLjcyIDIuNjMgMTUuOTQgNy43MSA0LjY5IDIwLjM4IDkuNDQgMzcgOS40NCAzNC4xNiAwIDQ4LjUtMjIuNzUgNDguNS00NC4xMi0uMDMtMTQuMzgtOS4xMi0yOS43Ni0yOC43My0zNC44OE00OTYgMjI0SDE3NmExNiAxNiAwIDAgMC0xNiAxNnYzMmExNiAxNiAwIDAgMCAxNiAxNmgzMjBhMTYgMTYgMCAwIDAgMTYtMTZ2LTMyYTE2IDE2IDAgMCAwLTE2LTE2bTAtMTYwSDE3NmExNiAxNiAwIDAgMC0xNiAxNnYzMmExNiAxNiAwIDAgMCAxNiAxNmgzMjBhMTYgMTYgMCAwIDAgMTYtMTZWODBhMTYgMTYgMCAwIDAtMTYtMTZtMCAzMjBIMTc2YTE2IDE2IDAgMCAwLTE2IDE2djMyYTE2IDE2IDAgMCAwIDE2IDE2aDMyMGExNiAxNiAwIDAgMCAxNi0xNnYtMzJhMTYgMTYgMCAwIDAtMTYtMTZNMTYgMTYwaDY0YTggOCAwIDAgMCA4LTh2LTE2YTggOCAwIDAgMC04LThINjRWNDBhOCA4IDAgMCAwLTgtOEgzMmE4IDggMCAwIDAtNy4xNCA0LjQybC04IDE2QTggOCAwIDAgMCAyNCA2NGg4djY0SDE2YTggOCAwIDAgMC04IDh2MTZhOCA4IDAgMCAwIDggOG0tMy45MSAxNjBIODBhOCA4IDAgMCAwIDgtOHYtMTZhOCA4IDAgMCAwLTgtOEg0MS4zMmMzLjI5LTEwLjI5IDQ4LjM0LTE4LjY4IDQ4LjM0LTU2LjQ0IDAtMjkuMDYtMjUtMzkuNTYtNDQuNDctMzkuNTYtMjEuMzYgMC0zMy44IDEwLTQwLjQ2IDE4Ljc1LTQuMzcgNS41OS0zIDEwLjg0IDIuOCAxNS4zN2w4LjU4IDYuODhjNS42MSA0LjU2IDExIDIuNDcgMTYuMTItMi40NGExMy40NCAxMy40NCAwIDAgMSA5LjQ2LTMuODRjMy4zMyAwIDkuMjggMS41NiA5LjI4IDguNzVDNTEgMjQ4LjE5IDAgMjU3LjMxIDAgMzA0LjU5djRDMCAzMTYgNS4wOCAzMjAgMTIuMDkgMzIwIi8+PC9zdmc+",
			pin: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJNMTkuMzggMTEuMzhhMyAzIDAgMCAwIDQuMjQgMGwuMDMtLjAzYS41LjUgMCAwIDAgMC0uN0wxMy4zNS4zNWEuNS41IDAgMCAwLS43IDBsLS4wMy4wM2EzIDMgMCAwIDAgMCA0LjI0TDEzIDVsLTIuOTIgMi45Mi0zLjY1LS4zNGEyIDIgMCAwIDAtMS42LjU4bC0uNjIuNjNhMSAxIDAgMCAwIDAgMS40Mmw5LjU4IDkuNThhMSAxIDAgMCAwIDEuNDIgMGwuNjMtLjYzYTIgMiAwIDAgMCAuNTgtMS42bC0uMzQtMy42NEwxOSAxMXpNOS4wNyAxNy4wN2EuNS41IDAgMCAxLS4wOC43N2wtNS4xNSAzLjQzYS41LjUgMCAwIDEtLjYzLS4wNmwtLjQyLS40MmEuNS41IDAgMCAxLS4wNi0uNjNMNi4xNiAxNWEuNS41IDAgMCAxIC43Ny0uMDhsMi4xNCAyLjE0WiIvPjwvc3ZnPg==",
            pin_blue: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNjBhNWZhIiBkPSJNMTkuMzggMTEuMzhhMyAzIDAgMCAwIDQuMjQgMGwuMDMtLjAzYS41LjUgMCAwIDAgMC0uN0wxMy4zNS4zNWEuNS41IDAgMCAwLS43IDBsLS4wMy4wM2EzIDMgMCAwIDAgMCA0LjI0TDEzIDVsLTIuOTIgMi45Mi0zLjY1LS4zNGEyIDIgMCAwIDAtMS42LjU4bC0uNjIuNjNhMSAxIDAgMCAwIDAgMS40Mmw5LjU4IDkuNThhMSAxIDAgMCAwIDEuNDIgMGwuNjMtLjYzYTIgMiAwIDAgMCAuNTgtMS42bC0uMzQtMy42NEwxOSAxMXpNOS4wNyAxNy4wN2EuNS41IDAgMCAxLS4wOC43N2wtNS4xNSAzLjQzYS41LjUgMCAwIDEtLjYzLS4wNmwtLjQyLS40MmEuNS41IDAgMCAxLS4wNi0uNjNMNi4xNiAxNWEuNS41IDAgMCAxIC43Ny0uMDhsMi4xNCAyLjE0WiIvPjwvc3ZnPg==",
            plus: "data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9IiNjYWNhY2EiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjFlbSIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgMTFoLTZWNWgtMnY2SDV2Mmg2djZoMnYtNmg2eiI+PC9wYXRoPjwvc3ZnPg==",
            quote: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJNNDY0IDMySDMzNmMtMjYuNSAwLTQ4IDIxLjUtNDggNDh2MTI4YzAgMjYuNSAyMS41IDQ4IDQ4IDQ4aDgwdjY0YzAgMzUuMy0yOC43IDY0LTY0IDY0aC04Yy0xMy4zIDAtMjQgMTAuNy0yNCAyNHY0OGMwIDEzLjMgMTAuNyAyNCAyNCAyNGg4Yzg4LjQgMCAxNjAtNzEuNiAxNjAtMTYwVjgwYzAtMjYuNS0yMS41LTQ4LTQ4LTQ4bS0yODggMEg0OEMyMS41IDMyIDAgNTMuNSAwIDgwdjEyOGMwIDI2LjUgMjEuNSA0OCA0OCA0OGg4MHY2NGMwIDM1LjMtMjguNyA2NC02NCA2NGgtOGMtMTMuMyAwLTI0IDEwLjctMjQgMjR2NDhjMCAxMy4zIDEwLjcgMjQgMjQgMjRoOGM4OC40IDAgMTYwLTcxLjYgMTYwLTE2MFY4MGMwLTI2LjUtMjEuNS00OC00OC00OCIvPjwvc3ZnPg==",
			refresh: "data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNjYWNhY2EiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGhlaWdodD0iMWVtIiB3aWR0aD0iMWVtIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDAtOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4Ii8+PHBhdGggZD0iTTMgM3Y1aDVtLTUgNGE5IDkgMCAwIDAgOSA5IDkuNzUgOS43NSAwIDAgMCA2Ljc0LTIuNzRMMjEgMTYiLz48cGF0aCBkPSJNMTYgMTZoNXY1Ii8+PC9zdmc+",
			send: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTEuNSAxMkg1LjQybS0uMTczLjc5N0w0LjI0MiAxNS44Yy0uNTUgMS42NDMtLjgyNiAyLjQ2NS0uNjI4IDIuOTcxLjE3MS40NC41NC43NzMuOTk0LjkuNTIzLjE0NiAxLjMxNC0uMjEgMi44OTQtLjkybDEwLjEzNS00LjU2MWMxLjU0My0uNjk1IDIuMzE0LTEuMDQyIDIuNTUzLTEuNTI0YTEuNSAxLjUgMCAwIDAgMC0xLjMzYy0uMjM5LS40ODItMS4wMS0uODMtMi41NTMtMS41MjRMNy40ODUgNS4yNDNjLTEuNTc2LS43MS0yLjM2NC0xLjA2NC0yLjg4Ny0uOTE4YTEuNSAxLjUgMCAwIDAtLjk5NC44OTdjLS4xOTguNTA1LjA3NCAxLjMyNS42MTggMi45NjZsMS4wMjYgMy4wOTFjLjA5NC4yODIuMTQuNDIzLjE1OS41NjdhMS41IDEuNSAwIDAgMSAwIC4zODVjLS4wMi4xNDQtLjA2Ni4yODUtLjE2LjU2NiIgc3Ryb2tlPSIjY2FjYWNhIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==",
			spoiler: "data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjQwIDUxMiIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLWV5ZS1zbGFzaCBmYS13LTIwIj48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJNMzIwIDQwMGMtNzUuODUgMC0xMzcuMjUtNTguNzEtMTQyLjktMTMzLjExTDcyLjIgMTg1LjgyYy0xMy43OSAxNy4zLTI2LjQ4IDM1LjU5LTM2LjcyIDU1LjU5YTMyLjM1IDMyLjM1IDAgMCAwIDAgMjkuMTlDODkuNzEgMzc2LjQxIDE5Ny4wNyA0NDggMzIwIDQ0OGMyNi45MSAwIDUyLjg3LTQgNzcuODktMTAuNDZMMzQ2IDM5Ny4zOWExNDQgMTQ0IDAgMCAxLTI2IDIuNjFtMzEzLjgyIDU4LjEtMTEwLjU1LTg1LjQ0YTMzMS4zIDMzMS4zIDAgMCAwIDgxLjI1LTEwMi4wNyAzMi4zNSAzMi4zNSAwIDAgMCAwLTI5LjE5QzU1MC4yOSAxMzUuNTkgNDQyLjkzIDY0IDMyMCA2NGEzMDguMTUgMzA4LjE1IDAgMCAwLTE0Ny4zMiAzNy43TDQ1LjQ2IDMuMzdBMTYgMTYgMCAwIDAgMjMgNi4xOEwzLjM3IDMxLjQ1QTE2IDE2IDAgMCAwIDYuMTggNTMuOWw1ODguMzYgNDU0LjczYTE2IDE2IDAgMCAwIDIyLjQ2LTIuODFsMTkuNjQtMjUuMjdhMTYgMTYgMCAwIDAtMi44Mi0yMi40NW0tMTgzLjcyLTE0Mi0zOS4zLTMwLjM4QTk0LjggOTQuOCAwIDAgMCA0MTYgMjU2YTk0Ljc2IDk0Ljc2IDAgMCAwLTEyMS4zMS05Mi4yMUE0Ny42NSA0Ny42NSAwIDAgMSAzMDQgMTkyYTQ2LjYgNDYuNiAwIDAgMS0xLjU0IDEwbC03My42MS01Ni44OUExNDIuMyAxNDIuMyAwIDAgMSAzMjAgMTEyYTE0My45MiAxNDMuOTIgMCAwIDEgMTQ0IDE0NGMwIDIxLjYzLTUuMjkgNDEuNzktMTMuOSA2MC4xMXoiLz48L3N2Zz4=",
			strikethrough: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJNNDk2IDIyNEgyOTMuOWwtODcuMTctMjYuODNBNDMuNTUgNDMuNTUgMCAwIDEgMjE5LjU1IDExMmg2Ni43OUE0OS44OSA0OS44OSAwIDAgMSAzMzEgMTM5LjU4YTE2IDE2IDAgMCAwIDIxLjQ2IDcuMTVsNDIuOTQtMjEuNDdhMTYgMTYgMCAwIDAgNy4xNi0yMS40NmwtLjUzLTFBMTI4IDEyOCAwIDAgMCAyODcuNTEgMzJoLTY4YTEyMy42OCAxMjMuNjggMCAwIDAtMTIzIDEzNS42NGMyIDIwLjg5IDEwLjEgMzkuODMgMjEuNzggNTYuMzZIMTZhMTYgMTYgMCAwIDAtMTYgMTZ2MzJhMTYgMTYgMCAwIDAgMTYgMTZoNDgwYTE2IDE2IDAgMCAwIDE2LTE2di0zMmExNiAxNiAwIDAgMC0xNi0xNm0tMTgwLjI0IDk2QTQzIDQzIDAgMCAxIDMzNiAzNTYuNDUgNDMuNTkgNDMuNTkgMCAwIDEgMjkyLjQ1IDQwMGgtNjYuNzlBNDkuODkgNDkuODkgMCAwIDEgMTgxIDM3Mi40MmExNiAxNiAwIDAgMC0yMS40Ni03LjE1bC00Mi45NCAyMS40N2ExNiAxNiAwIDAgMC03LjE2IDIxLjQ2bC41MyAxQTEyOCAxMjggMCAwIDAgMjI0LjQ5IDQ4MGg2OGExMjMuNjggMTIzLjY4IDAgMCAwIDEyMy0xMzUuNjQgMTE0LjMgMTE0LjMgMCAwIDAtNS4zNC0yNC4zNnoiLz48L3N2Zz4=",
			ul: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJNNDggNDhhNDggNDggMCAxIDAgNDggNDggNDggNDggMCAwIDAtNDgtNDhtMCAxNjBhNDggNDggMCAxIDAgNDggNDggNDggNDggMCAwIDAtNDgtNDhtMCAxNjBhNDggNDggMCAxIDAgNDggNDggNDggNDggMCAwIDAtNDgtNDhtNDQ4IDE2SDE3NmExNiAxNiAwIDAgMC0xNiAxNnYzMmExNiAxNiAwIDAgMCAxNiAxNmgzMjBhMTYgMTYgMCAwIDAgMTYtMTZ2LTMyYTE2IDE2IDAgMCAwLTE2LTE2bTAtMzIwSDE3NmExNiAxNiAwIDAgMC0xNiAxNnYzMmExNiAxNiAwIDAgMCAxNiAxNmgzMjBhMTYgMTYgMCAwIDAgMTYtMTZWODBhMTYgMTYgMCAwIDAtMTYtMTZtMCAxNjBIMTc2YTE2IDE2IDAgMCAwLTE2IDE2djMyYTE2IDE2IDAgMCAwIDE2IDE2aDMyMGExNiAxNiAwIDAgMCAxNi0xNnYtMzJhMTYgMTYgMCAwIDAtMTYtMTYiLz48L3N2Zz4=",
			video: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJNMzM2LjIgNjRINDcuOEMyMS40IDY0IDAgODUuNCAwIDExMS44djI4OC40QzAgNDI2LjYgMjEuNCA0NDggNDcuOCA0NDhoMjg4LjRjMjYuNCAwIDQ3LjgtMjEuNCA0Ny44LTQ3LjhWMTExLjhjMC0yNi40LTIxLjQtNDcuOC00Ny44LTQ3LjhtMTg5LjQgMzcuN0w0MTYgMTc3LjN2MTU3LjRsMTA5LjYgNzUuNWMyMS4yIDE0LjYgNTAuNC0uMyA1MC40LTI1LjhWMTI3LjVjMC0yNS40LTI5LjEtNDAuNC01MC40LTI1LjgiLz48L3N2Zz4=",
			views: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNyIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDU3NiA1MTIiPjxwYXRoIGZpbGw9IiNjYWNhY2EiIGQ9Ik01NzIuNTIgMjQxLjRDNTE4LjI5IDEzNS41OSA0MTAuOTMgNjQgMjg4IDY0UzU3LjY4IDEzNS42NCAzLjQ4IDI0MS40MWEzMi4zNSAzMi4zNSAwIDAgMCAwIDI5LjE5QzU3LjcxIDM3Ni40MSAxNjUuMDcgNDQ4IDI4OCA0NDhzMjMwLjMyLTcxLjY0IDI4NC41Mi0xNzcuNDFhMzIuMzUgMzIuMzUgMCAwIDAgMC0yOS4xOU0yODggNDAwYTE0NCAxNDQgMCAxIDEgMTQ0LTE0NCAxNDMuOTMgMTQzLjkzIDAgMCAxLTE0NCAxNDRtMC0yNDBhOTUuMyA5NS4zIDAgMCAwLTI1LjMxIDMuNzkgNDcuODUgNDcuODUgMCAwIDEtNjYuOSA2Ni45QTk1Ljc4IDk1Ljc4IDAgMSAwIDI4OCAxNjAiLz48L3N2Zz4=",
			youtube: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2OCA0OCI+PHBhdGggZD0iTTY2LjUyIDcuNzRjLS43OC0yLjkzLTIuNDktNS40MS01LjQyLTYuMTlDNTUuNzkuMTMgMzQgMCAzNCAwUzEyLjIxLjEzIDYuOSAxLjU1Yy0yLjkzLjc4LTQuNjMgMy4yNi01LjQyIDYuMTlDLjA2IDEzLjA1IDAgMjQgMCAyNHMuMDYgMTAuOTUgMS40OCAxNi4yNmMuNzggMi45MyAyLjQ5IDUuNDEgNS40MiA2LjE5QzEyLjIxIDQ3Ljg3IDM0IDQ4IDM0IDQ4czIxLjc5LS4xMyAyNy4xLTEuNTVjMi45My0uNzggNC42NC0zLjI2IDUuNDItNi4xOUM2Ny45NCAzNC45NSA2OCAyNCA2OCAyNHMtLjA2LTEwLjk1LTEuNDgtMTYuMjYiIGZpbGw9InJlZCIvPjxwYXRoIGQ9Ik00NSAyNCAyNyAxNHYyMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==",
			youtube_grayscale: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj48cGF0aCBmaWxsPSIjY2FjYWNhIiBkPSJNNTQ5LjY1NSAxMjQuMDgzYy02LjI4MS0yMy42NS0yNC43ODctNDIuMjc2LTQ4LjI4NC00OC41OTdDNDU4Ljc4MSA2NCAyODggNjQgMjg4IDY0UzExNy4yMiA2NCA3NC42MjkgNzUuNDg2Yy0yMy40OTcgNi4zMjItNDIuMDAzIDI0Ljk0Ny00OC4yODQgNDguNTk3LTExLjQxMiA0Mi44NjctMTEuNDEyIDEzMi4zMDUtMTEuNDEyIDEzMi4zMDVzMCA4OS40MzggMTEuNDEyIDEzMi4zMDVjNi4yODEgMjMuNjUgMjQuNzg3IDQxLjUgNDguMjg0IDQ3LjgyMUMxMTcuMjIgNDQ4IDI4OCA0NDggMjg4IDQ0OHMxNzAuNzggMCAyMTMuMzcxLTExLjQ4NmMyMy40OTctNi4zMjEgNDIuMDAzLTI0LjE3MSA0OC4yODQtNDcuODIxIDExLjQxMi00Mi44NjcgMTEuNDEyLTEzMi4zMDUgMTEuNDEyLTEzMi4zMDVzMC04OS40MzgtMTEuNDEyLTEzMi4zMDVtLTMxNy41MSAyMTMuNTA4VjE3NS4xODVsMTQyLjczOSA4MS4yMDV6Ii8+PC9zdmc+",
        }

		const categoryColors: { [key: number]: string } = {
			1: "rgb(0, 170, 255)",
			2: "rgb(76, 175, 80)",
			3: "rgb(75, 179, 185)",
			4: "rgb(75, 179, 185)",
			5: "rgb(103, 58, 183)",
			// 6: "var(--xxx)", //does not exist
			7: "rgb(78, 163, 230)",
			8: "rgb(0, 150, 136)",
			9: "rgb(96, 125, 139)",
			10: "rgb(36, 36, 169)",
			11: "rgb(251, 71, 30)",
			12: "rgb(239, 48, 81)",
			13: "rgb(233, 30, 99)",
			14: "rgb(192, 195, 61)",
			15: "rgb(184, 90, 199)",
			16: "rgb(255, 152, 0)",
			17: "rgb(121, 85, 72)",
			18: "rgb(43, 76, 105)",
		};

		const tabs = {
			current: ctx.state<Tabs>(Tabs.Overview),
			last: ctx.state<Tabs[]>([]),
			currentOverlay: ctx.state<any[] | null>(null),
			currentOverlayType: ctx.state<"default" | "blur">("default"),
			styles: {
				button_md: {
					width: "2.5rem",
					height: "2.5rem",
					borderRadius: "50%",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					backgroundSize: "1.5rem",
					padding: "0",
					paddingInlineStart: "0.5rem",
				},
			},
			overlay() {
				const overlay = this.currentOverlay.get();
				const type = this.currentOverlayType.get();
				return overlay
					? tray.div([tray.flex(overlay, { style: { justifyContent: "center", alignItems: "center", width: "100%", height: "100%" } })], {
							className: `fixed rounded-lg top-0 left-0 bg-black/80 z-[50]`,
							style: {
								width: "calc(100%)",
								height: "calc(100% - 1rem)",
								border: "1px solid var(--border)",
								backdropFilter: type === "blur" ? "blur(5px)" : "",
								overflow: "scroll",
							},
					  })
					: ([] as any[]);
			},
			confirmationModal(title: string | any[], body: string | any, confirmButtonIntent: $ui.Intent, successCallback: () => void) {
				const TITLE = typeof title === "string" ? tray.text(title, { className: "font-semibold text-lg line-clamp-1" }) : tray.div(title);
				const BODY = typeof body === "string" ? tray.text(body, { className: "opacity-70" }) : tray.div(body);

				const CLOSE_BUTTON = tray.button("\u200b", {
					intent: "alert-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.close})`, backgroundSize: "1rem" },
					onClick: ctx.eventHandler("modal:close", () => this.currentOverlay.set(null)),
				});
				const CANCEL_BUTTON = tray.button("Cancel", {
					intent: "gray-subtle",
					className: "w-fit",
					onClick: ctx.eventHandler("modal:cancel", () => tabs.currentOverlay.set(null)),
				});
				const CONFIRM_BUTTON = tray.button("Confirm", {
					intent: confirmButtonIntent,
					className: "w-fit",
					onClick: ctx.eventHandler("modal:confirm", () => {
						tabs.currentOverlay.set(null);
						successCallback();
					}),
				});

				tabs.currentOverlay.set([
					tray.stack(
						[
							tray.flex([TITLE, CLOSE_BUTTON], { className: "justify-between items-center border-b" }),
							BODY,
							tray.flex([CANCEL_BUTTON, CONFIRM_BUTTON], { className: "justify-center mt-4" }),
						],
						{
							gap: 4,
							className: "p-4 m-2 bg-gray-900 border rounded-lg",
						}
					),
				]);
			},
			externalLinkModal(title: string | any[], body: string | any, href: string, acceptButtonProps: Partial<Parameters<$ui.Tray["anchor"]>[1]> = {}) {
				const TITLE = typeof title === "string" ? tray.text(title, { className: "font-semibold text-lg line-clamp-1" }) : tray.div(title);
				const BODY = typeof body === "string" ? tray.text(body, { className: "opacity-70 break-words" }) : tray.div(body);

				const CLOSE_BUTTON = tray.button("\u200b", {
					intent: "alert-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.close})`, backgroundSize: "1rem" },
					onClick: ctx.eventHandler("modal:close", () => this.currentOverlay.set(null)),
				});
				const CANCEL_BUTTON = tray.button("Cancel", {
					intent: "gray-subtle",
					className: "w-fit",
					onClick: ctx.eventHandler("modal:cancel", () => tabs.currentOverlay.set(null)),
				});
				const CONFIRM_BUTTON = tray.div(
					[
						tray.anchor("Take me there", {
							href: acceptButtonProps.href ?? href,
							target: acceptButtonProps.target ?? "_blank",
							className: "no-underline h-full block",
							style: { alignContent: "center", ...(acceptButtonProps.style ?? {}) },
						}),
					],
					{
						className:
							"cursor-pointer px-2 bg-gray-100 rounded-lg bg-opacity-10 hover:bg-red-500 hover:bg-opacity-100 transition ease-in hover:text-white text-sm font-semibold" +
							(acceptButtonProps.className ?? ""),
						onClick: acceptButtonProps.onClick ?? ctx.eventHandler("modal:extlink", () => tabs.currentOverlay.set(null)),
					}
				);

				tabs.currentOverlay.set([
					tray.stack(
						[
							tray.flex([TITLE, CLOSE_BUTTON], { className: "justify-between items-center border-b" }),
							BODY,
							tray.flex([CANCEL_BUTTON, CONFIRM_BUTTON], { className: "justify-center mt-4" }),
						],
						{
							gap: 4,
							className: "p-4 m-2 bg-gray-900 border rounded-lg",
						}
					),
				]);
			},
			replyModal(rto: $forums.ThreadComment | $forums.ThreadOverview) {
				ThreadsManager.threadComment.replyFieldRef.setValue("");
				tabs.currentOverlayType.set("blur");

				const type = "body" in rto ? "Thread" : "Comment";
				const author = rto.user?.name ?? type;

				const TITLE = tray.text(`Replying to ${author}${type === "Thread" ? "'s Thread" : ""}`, { className: "font-semibold text-lg line-clamp-1" });
				const CLOSE_BUTTON = tray.button("\u200b", {
					intent: "alert-subtle",
					className: "bg-transparent w-10 h-10 rounded-full bg-no-repeat bg-center",
					style: { backgroundImage: `url(${icons.close})`, backgroundSize: "1rem" },
					onClick: ctx.eventHandler("modal:close", () => this.currentOverlay.set(null)),
				});
				const CANCEL_BUTTON = tray.button("Cancel", {
					intent: "gray-subtle",
					className: "w-fit",
					onClick: ctx.eventHandler("modal:cancel", () => tabs.currentOverlay.set(null)),
				});
				const CONFIRM_BUTTON = tray.button("Send Reply", {
					intent: "success",
					className: "w-fit",
					loading: ThreadsManager.threadComment.isReplying.get(),
					onClick: ctx.eventHandler("modal:confirm", () => {
						const comment = ThreadsManager.threadComment.replyFieldRef.current;
						const thread = state.currentThread.get();
						if (!comment.trim().length) return ctx.toast.error(`Comment field cannot be blank!`);
						let reply: Promise<void>;

						if ("body" in rto) {
							reply = ThreadsManager.replyToThread(rto.id, comment).then((data) => {
								if (thread?.id !== rto.id) return;

								if (thread.comments) {
									thread.comments.threadComments.unshift(data.SaveThreadComment);
								} else {
									thread.comments = {
										threadComments: [data.SaveThreadComment],
										pageInfo: { lastPage: 1, currentPage: 1, hasNextPage: false },
									};
								}
								thread.replyCount++;
								state.currentThread.set(thread);
								ThreadsManager.threadComment.replyFieldRef.setValue("");
							});
						} else {
							reply = ThreadsManager.replyToThreadComment(rto.threadId, rto.id, comment).then((data) => {
								if (thread?.id !== rto.threadId) return;

								rto.childComments = [data.SaveThreadComment, ...(rto.childComments ?? [])];
								if (thread.comments) {
									replaceThreadComment(thread.comments.threadComments, rto);
								} else {
									thread.comments = {
										threadComments: [rto],
										pageInfo: { lastPage: 1, currentPage: 1, hasNextPage: false },
									};
								}

								state.expandedReplies.set([...state.expandedReplies.get(), data.SaveThreadComment.id]);
								thread.replyCount++;
								state.currentThread.set(thread);
								ThreadsManager.threadComment.replyFieldRef.setValue("");
							});
						}
						tabs.currentOverlay.set(null);
						reply.catch((err) => ctx.toast.error(`Error on thread reply: ${(err as Error).message}`));
					}),
				});

				const button: Parameters<$ui.Tray["button"]>[1] = {
					intent: "gray-subtle",
					className: "h-6 w-6 rounded-lg bg-no-repeat bg-center bg-cover bg-transparent",
				};
				const selected = ctx.state<{ cursorStart: number; cursorEnd: number }>({ cursorStart: 0, cursorEnd: 0 });
				const BODY = tray.stack([
					tray.flex(
						[
							tray.button("\u200b", {
								...button,
								style: { backgroundSize: "0.675rem", backgroundImage: `url(${icons.bold})` },
								onClick: ctx.eventHandler("editor:modifier:bold", () => {
									const v = ThreadsManager.threadComment.replyFieldRef.current;
									const { cursorStart: s, cursorEnd: e } = selected.get();
									ThreadsManager.threadComment.replyFieldRef.setValue(`${v.slice(0, s)}__${v.slice(s, e)}__${v.slice(e)}`);
									selected.set({ cursorStart: v.length + 4, cursorEnd: v.length + 4 });
								}),
							}),
							tray.button("\u200b", {
								...button,
								style: { backgroundSize: "0.575rem", backgroundImage: `url(${icons.italic})` },
								onClick: ctx.eventHandler("editor:modifier:italic", () => {
									const v = ThreadsManager.threadComment.replyFieldRef.current;
									const { cursorStart: s, cursorEnd: e } = selected.get();
									ThreadsManager.threadComment.replyFieldRef.setValue(`${v.slice(0, s)}_${v.slice(s, e)}_${v.slice(e)}`);
									selected.set({ cursorStart: v.length + 2, cursorEnd: v.length + 2 });
								}),
							}),
							tray.button("\u200b", {
								...button,
								style: { backgroundSize: "0.875rem", backgroundImage: `url(${icons.strikethrough})` },
								onClick: ctx.eventHandler("editor:modifier:strike", () => {
									const v = ThreadsManager.threadComment.replyFieldRef.current;
									const { cursorStart: s, cursorEnd: e } = selected.get();
									ThreadsManager.threadComment.replyFieldRef.setValue(`${v.slice(0, s)}~~${v.slice(s, e)}~~${v.slice(e)}`);
									selected.set({ cursorStart: v.length + 4, cursorEnd: v.length + 4 });
								}),
							}),
							tray.button("\u200b", {
								...button,
								style: { backgroundSize: "1.000rem", backgroundImage: `url(${icons.spoiler})` },
								onClick: ctx.eventHandler("editor:modifier:spoiler", () => {
									const v = ThreadsManager.threadComment.replyFieldRef.current;
									const { cursorStart: s, cursorEnd: e } = selected.get();
									ThreadsManager.threadComment.replyFieldRef.setValue(`${v.slice(0, s)}~!${v.slice(s, e)}!~${v.slice(e)}`);
									selected.set({ cursorStart: v.length + 4, cursorEnd: v.length + 4 });
								}),
							}),
							tray.button("\u200b", {
								...button,
								disabled: true, // not currently supported
								style: { backgroundSize: "0.875rem", backgroundImage: `url(${icons.link})` },
								onClick: ctx.eventHandler("editor:modifier:link", () => {}),
							}),
							tray.button("\u200b", {
								...button,
								disabled: true, // not currently supported
								style: { backgroundSize: "0.875rem", backgroundImage: `url(${icons.image})` },
								onClick: ctx.eventHandler("editor:modifier:image", () => {}),
							}),
							tray.button("\u200b", {
								...button,
								disabled: true, // not currently supported
								style: { backgroundSize: "1.000rem", backgroundImage: `url(${icons.youtube_grayscale})` },
								onClick: ctx.eventHandler("editor:modifier:yt", () => {}),
							}),
							tray.button("\u200b", {
								...button,
								disabled: true, // not currently supported
								style: { backgroundSize: "0.875rem", backgroundImage: `url(${icons.video})` },
								onClick: ctx.eventHandler("editor:modifier:video", () => {}),
							}),
							tray.button("\u200b", {
								...button,
								style: { backgroundSize: "0.875rem", backgroundImage: `url(${icons.ol})` },
								onClick: ctx.eventHandler("editor:modifier:ol", () => {
									const v = ThreadsManager.threadComment.replyFieldRef.current;
									const { cursorStart: s, cursorEnd: e } = selected.get();
									ThreadsManager.threadComment.replyFieldRef.setValue(`${v.slice(0, s)}1. ${v.slice(s, e)}${v.slice(e)}`);
									selected.set({ cursorStart: v.length + 3, cursorEnd: v.length + 3 });
								}),
							}),
							tray.button("\u200b", {
								...button,
								style: { backgroundSize: "0.875rem", backgroundImage: `url(${icons.ul})` },
								onClick: ctx.eventHandler("editor:modifier:ul", () => {
									const v = ThreadsManager.threadComment.replyFieldRef.current;
									const { cursorStart: s, cursorEnd: e } = selected.get();
									ThreadsManager.threadComment.replyFieldRef.setValue(`${v.slice(0, s)}- ${v.slice(s, e)}${v.slice(e)}`);
									selected.set({ cursorStart: v.length + 2, cursorEnd: v.length + 2 });
								}),
							}),
							tray.button("\u200b", {
								...button,
								style: { backgroundSize: "0.875rem", backgroundImage: `url(${icons.heading})` },
								onClick: ctx.eventHandler("editor:modifier:heading", () => {
									const v = ThreadsManager.threadComment.replyFieldRef.current;
									const { cursorStart: s, cursorEnd: e } = selected.get();
									ThreadsManager.threadComment.replyFieldRef.setValue(`${v.slice(0, s)}# ${v.slice(s, e)}${v.slice(e)}`);
									selected.set({ cursorStart: v.length + 2, cursorEnd: v.length + 2 });
								}),
							}),
							tray.button("\u200b", {
								...button,
								style: { backgroundSize: "0.875rem", backgroundImage: `url(${icons.center})` },
								onClick: ctx.eventHandler("editor:modifier:center", () => {
									const v = ThreadsManager.threadComment.replyFieldRef.current;
									const { cursorStart: s, cursorEnd: e } = selected.get();
									ThreadsManager.threadComment.replyFieldRef.setValue(`${v.slice(0, s)}~~~${v.slice(s, e)}~~~${v.slice(e)}`);
									selected.set({ cursorStart: v.length + 6, cursorEnd: v.length + 6 });
								}),
							}),
							tray.button("\u200b", {
								...button,
								style: { backgroundSize: "0.875rem", backgroundImage: `url(${icons.quote})` },
								onClick: ctx.eventHandler("editor:modifier:quote", () => {
									const v = ThreadsManager.threadComment.replyFieldRef.current;
									const { cursorStart: s, cursorEnd: e } = selected.get();
									ThreadsManager.threadComment.replyFieldRef.setValue(`${v.slice(0, s)}> ${v.slice(s, e)}${v.slice(e)}`);
									selected.set({ cursorStart: v.length + 2, cursorEnd: v.length + 2 });
								}),
							}),
							tray.button("\u200b", {
								...button,
								style: { backgroundSize: "0.875rem", backgroundImage: `url(${icons.code})` },
								onClick: ctx.eventHandler("editor:modifier:code", () => {
									const v = ThreadsManager.threadComment.replyFieldRef.current;
									const { cursorStart: s, cursorEnd: e } = selected.get();
									ThreadsManager.threadComment.replyFieldRef.setValue(`${v.slice(0, s)}\`${v.slice(s, e)}\`${v.slice(e)}`);
									selected.set({ cursorStart: v.length + 2, cursorEnd: v.length + 2 });
								}),
							}),
						],
						{
							gap: 0,
							className: "bg-gray-900 border rounded-lg p-2",
						}
					),
					tray.input("", {
						size: "sm",
						textarea: true,
						fieldRef: ThreadsManager.threadComment.replyFieldRef,
						style: { fontSize: "0.875rem", lineHeight: "1.25rem", borderRadius: "0.5rem" },
						onSelect: ctx.eventHandler(`input:thread_comment_sel:${rto.id}`, ({ cursorStart, cursorEnd }: { cursorStart: number; cursorEnd: number }) =>
							selected.set({ cursorStart, cursorEnd })
						),
					}),
				]);

				tabs.currentOverlay.set([
					tray.stack(
						[
							tray.flex([TITLE, CLOSE_BUTTON], { className: "justify-between items-center border-b" }),
							BODY,
							tray.flex([CANCEL_BUTTON, CONFIRM_BUTTON], { className: "justify-center mt-4" }),
						],
						{
							gap: 4,
							className: "p-4 m-2 bg-gray-900 border rounded-lg",
						}
					),
				]);
			},
			header(main: string = "Anilist Forums", subtext: string = "Overview", additionalComponents?: any[]) {
				const icon = tray.div([], {
					className: "bg-contain bg-no-repeat bg-center w-10 h-10 shrink-0",
					style: { backgroundImage: `url(${iconUrl})` },
				});

				const MAIN = tray.text(`${main}`, { className: "line-clamp-1 overflow-ellipsis font-bold", style: { fontSize: "1.2em" } });
				const SUBTEXT = tray.text(`${subtext ?? "\u200b"}`, {
					className: "line-clamp-1 overflow-ellipsis text-pretty opacity-30",
					style: { fontSize: "0.8em", wordBreak: "normal" },
				});

				return tray.flex([icon, tray.stack([MAIN, SUBTEXT], { style: { lineHeight: "1rem", width: "100%" } }), tray.div(additionalComponents ?? [])], {
					gap: 3,
					style: { marginBottom: "1rem" },
				});
			},
			loadingCard_lg() {
				return tray.div([], { className: "animate-pulse h-20 rounded-lg bg-gray-800 shrink-0" });
			},
			loadingCard_sm() {
				return tray.div([], { className: "animate-pulse h-8 rounded-lg bg-gray-800" });
			},
			loadingComment() {
				const AVATAR = tray.div([], { className: "animate-pulse bg-gray-800 shrink-0 rounded-full w-8 h-8" });
				const REPLY_LINE = tray.div([], { className: "absolute h-full w-1/2 right-0 border-b border-l", style: { borderRadius: "0 0 0 0.75rem" } });
				const REPLY_CONTAINER = tray.div([REPLY_LINE], { className: "w-full relative", style: { height: "calc(100% - 2.5rem)" } });
				const LEFT_STACK = tray.stack([AVATAR, REPLY_CONTAINER], { gap: 0, className: "mr-4" });

				const buildPill = (width: string = "6rem", marginTop?: string) =>
					tray.div([], { className: "animate-pulse bg-gray-800 inline rounded-xl h-4 ", style: { width, ...(marginTop ? { marginTop } : {}) } });

				const RIGHT_STACK = tray.stack([
					tray.flex([buildPill(), buildPill("4rem")]),
					buildPill("80%"),
					tray.flex([buildPill("4rem"), buildPill("4rem")]),
					buildPill("5rem", "0.5rem"),
				]);

				return tray.flex([LEFT_STACK, RIGHT_STACK], { gap: 0 });
			},
			labelWithIcon(icon: string, label: string, fontSize: string = "0.6rem", width: string = "0.9rem", height: string = "0.8rem") {
				const ICON = tray.div([], {
					className: "bg-contain bg-no-repeat bg-center shrink-0",
					style: { width, height, backgroundImage: `url(${icon})` },
				});

				const LABEL = tray.text(`${label}`, {
					className: "content-evenly leading-none",
					style: { fontSize: "0.6rem", color: "#cacaca", wordBreak: "keep-all" },
				});

				return tray.flex([ICON, LABEL], { className: "w-fit h-fit", gap: 1 });
			},
			threadCategory(category: $forums.ThreadOverview["categories"][number]) {
				return tray.anchor(`${category.name}`, {
					href: `https://anilist.co/forum/recent?category=${category.id}`,
					target: "_blank",
					className: "bg-gray-800 rounded-full no-underline hover:underline text-white whitespace-nowrap",
					style: {
						alignContent: "center",
						padding: "0.15rem 0.5rem",
						fontSize: "0.65rem",
						lineHeight: "normal",
						backgroundColor: categoryColors[category.id],
					},
				});
			},
			threadMediaCategory(media: $forums.ThreadOverview["mediaCategories"][number]) {
				return tray.button(`${truncateString(media.title.userPreferred, 23)}`, {
					className: "h-fit w-fit bg-opacity-100 hover:bg-opacity-70 bg-gray-800 rounded-full hover:underline text-white bg-purple-600 whitespace-nowrap",
					style: { padding: "0.15rem 0.5rem", fontSize: "0.65rem", lineHeight: "normal" },
					onClick: ctx.eventHandler(`toggle:goto_page:${media.id}:${Math.random().toFixed(5)}`, () =>
						ctx.screen.navigateTo(media.type === "ANIME" ? "/entry" : "/manga/entry", { id: media.id.toString() })
					),
				});
			},
			formatThreadOverview(thread: $forums.ThreadOverview) {
				const AVATAR = tray.div([], {
					className: "bg-cover bg-no-repeat bg-center rounded-full shrink-0 w-6",
					style: { backgroundImage: `url(${thread.replyUser?.avatar.large ?? thread.user.avatar.large})` },
				});

				const AVATAR_LABEL = tray.flex(
					[
						tray.text(thread.replyCount > 0 ? `replied ${getRelativeTime(thread.repliedAt)}` : "By", {
							style: { width: "fit-content", order: thread.replyCount > 0 ? "2" : "1" },
							className: `order-${thread.replyCount > 0 ? 2 : 1}`,
						}),
						tray.anchor(`${thread.replyUser?.name ?? thread.user.name}`, {
							href: `https://anilist.co/user/${thread.replyUser?.id ?? thread.user.id}/`,
							target: "_blank",
							className: `no-underline hover:underline text-blue-400 z-[2]`,
							style: { order: thread.replyCount > 0 ? "1" : "2" },
						}),
					],
					{ gap: 1 }
				);

				const [, ep, num] = thread.title.match(/(episode|chapter)\s*(\d+)/i) ?? [];
				return tray.stack(
					[
						tray.flex([
							tray.text(`${thread.title}`, { className: "line-clamp-2 text-pretty", style: { wordBreak: "normal" } }),
							thread.replyCount > 0 ? tabs.labelWithIcon(icons.comments, formatToK(thread.replyCount)) : [],
							thread.viewCount > 0 ? tabs.labelWithIcon(icons.views, formatToK(thread.viewCount)) : [],
						]),
						tray.div(
							tabs.parseMarkdownPreviewText(
								thread.categories.some((c) => c.id === 5)
									? `Preview hidden. May contain spoilers${ep && num ? ` for <a>__${ep} ${num}__</a>` : ""}.`
									: thread.body.slice(0, 250)
							),
							{
								className: "line-clamp-1 opacity-70",
								style: { fontSize: "0.8rem", color: "#cacaca" },
							}
						),
						tray.flex([AVATAR, AVATAR_LABEL], { style: { fontSize: "0.8rem" } }),
						tray.flex([...thread.categories.map(tabs.threadCategory), ...thread.mediaCategories.map(tabs.threadMediaCategory)], {
							className: "mt-2 z-[2] overflow-hidden",
							style: { maskImage: "linear-gradient(to right, rgba(0,0,0,1) 85%, transparent 100%)" },
						}),
						tray.button("\u200b", {
							className: "w-full h-full absolute top-0 left-0 bg-transparent",
							onClick: ctx.eventHandler(`toggle:tabs:thread_view:${thread.id}:${Math.random().toFixed(5)}`, () => {
								state.currentThread.set(thread);
								tabs.last.set([...tabs.last.get(), tabs.current.get()]);
								tabs.current.set(Tabs.ThreadView);
							}),
						}),
					],
					{
						gap: 0,
						className: "bg-gray-900 transition ease-in hover:bg-gray-800 border p-3 rounded-lg relative",
					}
				);
			},
			formatPinnedThreadOverview(thread: $forums.ThreadOverview) {
				return tray.stack(
					[
						tray.flex([
							tray.div([], {
								className: "w-6 h-auto rounded-full bg-no-repeat bg-center p-0 shrink-0",
								style: { backgroundSize: "1.5rem", paddingInlineStart: "0.5rem", backgroundImage: `url(${icons.pin_blue})` },
							}),
							tray.text(`${thread.title}`, { className: "line-clamp-1 text-pretty", style: { wordBreak: "normal" } }),
							thread.replyCount > 0 ? tabs.labelWithIcon(icons.comments, formatToK(thread.replyCount)) : [],
							thread.viewCount > 0 ? tabs.labelWithIcon(icons.views, formatToK(thread.viewCount)) : [],
						]),
						tray.button("\u200b", {
							className: "w-full h-full absolute top-0 left-0 bg-transparent",
							onClick: ctx.eventHandler(`toggle:tabs:thread_view:${thread.id}`, () => {
								state.currentThread.set(thread);
								tabs.last.set([...tabs.last.get(), tabs.current.get()]);
								tabs.current.set(Tabs.ThreadView);
							}),
						}),
					],
					{
						gap: 0,
						className: "bg-gray-900 transition ease-in hover:bg-gray-800 border p-3 rounded-lg relative",
					}
				);
			},
			formatComment(level: number, comment: $forums.ThreadComment, index: number, array: $forums.ThreadComment[]): void {
				const isReplyExpanded = state.expandedReplies.get().includes(comment.id);

				// Left stack
				const THREAD_ATTACHMENT = tray.div([], {
					className: `absolute left-0 border-l border-b rounded-bl-xl h-[50%] transform w-${level === 1 ? 9 : 6}`,
					style: { "--tw-translate-x": "-100%" },
				});
				const THREAD_LINE = tray.div([], {
					className: "absolute w-1/2 right-0 border-l border-b rounded-bl-xl",
					style: { height: "calc(100% - 0.75rem)" },
				});
				const AVATAR = tray.div([level !== 0 ? THREAD_ATTACHMENT : []], {
					className: `relative shrink-0 bg-cover bg-no-repeat bg-center rounded-full w-${level === 0 ? "10" : "6"} h-${level === 0 ? "10" : "6"}`,
					style: { backgroundImage: `url(${comment.user?.avatar.large ?? "https://i.imgur.com/EKtChtm.png"})` },
				});
				const THREAD_LINE_CONTAINER = comment.childComments?.length ? tray.div([THREAD_LINE], { className: "h-full relative" }) : [];
				const LEFT_STACK = tray.stack([AVATAR, THREAD_LINE_CONTAINER], { gap: 0, className: `mr-${level === 0 ? 4 : 3}` });

				// Right stack
				let USER_INFO: void;
				const RELTIME = tray.anchor(`${getRelativeTime(comment.createdAt)}`, {
					href: `https://anilist.co/forum/thread/${comment.threadId}/comment/${comment.id}`,
					className: "text-xs text-gray-400 whitespace-nowrap no-underline hover:underline",
				});
				if (comment.user) {
					const USERNAME = tray.anchor({
						href: `https://anilist.co/user/${comment.user.id}`,
						text: comment.user.name ?? "\u200b",
						className: `no-underline hover:underline font-semibold text-${comment.user.moderatorRoles ? "orange-400" : "blue-400"} text-sm`,
					});
					const MODROLES = comment.user.moderatorRoles?.length
						? tray.text(`${comment.user.moderatorRoles[0].replace(/_/g, " ")}`, {
								className: "w-fit h-fit leading-none font-semibold rounded-full bg-red-600",
								style: { alignContent: "center", fontSize: "0.6rem", padding: "0.2rem 0.5rem" },
						  })
						: [];
					USER_INFO = tray.flex([USERNAME, MODROLES, RELTIME], { className: "h-fit items-center" });
				} else {
					const USERNAME = tray.text("Unknown", { className: "font-semibold text-sm" });
					USER_INFO = tray.flex([USERNAME, RELTIME], { className: "h-fit items-center" });
				}

				let COMMENT_CONTENT: void;
				const editState = ThreadsManager.threadComment.edit;
				if (editState.commentId.get() === comment.id) {
					const EDITOR_INPUT = tray.input("", {
						size: "sm",
						value: comment.comment,
						textarea: true,
						style: { height: "2.35rem", borderRadius: "0.5rem 0 0 0.5rem", fontSize: "0.875rem", lineHeight: "1.25rem" },
						onChange: ctx.eventHandler(`input:thread_comment_edit:${comment.id}`, ({ value }) => editState.fieldRef.setValue(value)),
					});
					const EDITOR_SUBMIT = tray.button("\u200b", {
						size: "sm",
						loading: ThreadsManager.threadComment.isReplying.get() || ThreadsManager.isFetching.get(),
						// prettier-ignore
						className: "w-fit h-full bg-no-repeat bg-center px-5 bg-transparent border-gray-900 hover:bg-opacity-70 hover:bg-brand-500 hover:border-brand-400/20",
						style: {
							borderRadius: "0 0.5rem 0.5rem 0",
							marginLeft: "-1px",
							backgroundImage: ThreadsManager.threadComment.isReplying.get() || ThreadsManager.isFetching.get() ? "" : `url(${icons.send})`,
						},
						onClick: ctx.eventHandler(`submit:thread_comment_edit:${comment.id}`, () => {
							const editvalue = editState.fieldRef.current;
							ThreadsManager.threadComment.isReplying.set(true);

							const submitValue = editvalue.trim().length
								? ThreadsManager.editThreadReply(comment.id, comment.threadId, editvalue)
								: ThreadsManager.deleteThreadReply(comment.id);

							submitValue
								.then((data) => {
									const thread = state.currentThread.get();
									const comments = thread?.comments?.threadComments;
									if (!comments) return ctx.toast.error("Could not find thread/comments");

									if (("SaveThreadComment" in data && replaceThreadComment(comments, data.SaveThreadComment)) || removeThreadComment(comments, comment.id))
										state.currentThread.set(thread);
								})
								.catch((err) => ctx.toast.error(`Error on thread reply: ${(err as Error).message}`))
								.finally(() => {});
						}),
					});
					COMMENT_CONTENT = tray.flex([EDITOR_INPUT, EDITOR_SUBMIT], { gap: 0, className: "h-full leading-tight text-sm" });
				} else {
					COMMENT_CONTENT = tray.div([tabs.parseMarkdownText(comment.comment, comment.id.toString())], { className: "leading-tight text-sm" });
				}

				let COMMENT_STATISTICS: void | any[] = [];
				if (comment.user) {
					const isLikeBtnLoading = state.replyThreadLikeButtonIsLoading.get();
					const isSelfAuthored = comment.user.name === ThreadsManager.username;

					const COMMENT_LIKES = tray.button(`${comment.likeCount > 0 ? formatToK(comment.likeCount) : "\u200b"}`, {
						intent: "gray-subtle",
						size: "xs",
						className: "bg-transparent bg-no-repeat rounded-full ps-2 dark:text-gray-400 xs",
						loading: isLikeBtnLoading,
						style: {
							backgroundImage: isLikeBtnLoading ? "" : `url(${icons[comment.isLiked ? "heart_active" : "heart"]})`,
							backgroundPosition: "0.85em center",
							backgroundSize: "0.8rem",
							textIndent: isLikeBtnLoading ? "" : "1.6rem",
							paddingInlineStart: "0.5rem",
						},
						onClick: ctx.eventHandler(`toggle:thread_manager:comment_liked:${comment.id}`, () => {
							state.replyThreadLikeButtonIsLoading.set(true);
							const thread = state.currentThread.get();
							if (!thread || !thread.comments?.threadComments) return ctx.toast.error(`Could not retrieve current thread!`);

							ThreadsManager.toggleLike(comment.id, "THREAD_COMMENT")
								.then(() => {
									comment.isLiked = !comment.isLiked;
									comment.likeCount = comment.isLiked ? comment.likeCount + 1 : comment.likeCount - 1;
									if (!thread.comments?.threadComments) return ctx.toast.error(`Unable to find reference for the selected reply.`);
									replaceThreadComment(thread.comments?.threadComments, comment);
									state.currentThread.set(thread);
								})
								.catch((error) => ctx.toast.error((error as Error).message))
								.finally(() => ctx.setTimeout(() => state.replyThreadLikeButtonIsLoading.set(false), 1_000));
						}),
					});

					const COMMENT_REPLY = tray.button("Reply", {
						intent: "gray-subtle",
						size: "xs",
						disabled: comment.isLocked,
						loading: ThreadsManager.isFetching.get() || ThreadsManager.threadComment.isReplying.get() || ThreadsManager.threadComment.isDeleting.get(),
						className: "bg-transparent rounded-full text-xs",
						onClick: ctx.eventHandler(`toggle:thread_manager:comment_reply_to:${comment.id}`, () => tabs.replyModal(comment)),
					});

					const COMMENT_EDIT = isSelfAuthored
						? tray.button(ThreadsManager.threadComment.edit.commentId.get() === comment.id ? "Cancel Edit" : "Edit", {
								intent: "gray-subtle",
								size: "xs",
								disabled: comment.isLocked,
								loading: ThreadsManager.isFetching.get() || ThreadsManager.threadComment.isReplying.get() || ThreadsManager.threadComment.isDeleting.get(),
								className: "bg-transparent rounded-full text-xs",
								onClick: ctx.eventHandler(`toggle:thread_comment_edit:${comment.id}`, () =>
									ThreadsManager.threadComment.edit.commentId.set(ThreadsManager.threadComment.edit.commentId.get() === comment.id ? null : comment.id)
								),
						  })
						: [];

					const COMMENT_DELETE = isSelfAuthored
						? tray.button("Delete", {
								intent: "gray-subtle",
								size: "xs",
								disabled: comment.isLocked,
								loading: ThreadsManager.isFetching.get() || ThreadsManager.threadComment.isReplying.get() || ThreadsManager.threadComment.isDeleting.get(),
								className: "bg-transparent rounded-full text-xs",
								onClick: ctx.eventHandler(`toggle:thread_comment_delete:${comment.id}`, () => {
									tabs.confirmationModal("Delete reply?", "Are you sure you want to delete this reply?", "alert", () => {
										ThreadsManager.deleteThreadReply(comment.id)
											.then(() => {
												if (ThreadsManager.threadComment.edit.commentId.get() === comment.id) ThreadsManager.threadComment.edit.commentId.set(null);
												const thread = state.currentThread.get();
												if (!thread?.comments?.threadComments) return ctx.toast.error(`Unable to find thread/comments`);
												thread.comments.threadComments = removeThreadComment(thread.comments.threadComments, comment.id);
												thread.replyCount--;
												state.currentThread.set(thread);
											})
											.catch((err) => ctx.toast.error(`Error on thread_comment_delete: ${(err as Error).message}`));
									});
								}),
						  })
						: [];

					COMMENT_STATISTICS = tray.flex([COMMENT_LIKES, COMMENT_REPLY, COMMENT_EDIT, COMMENT_DELETE], { className: "my-2" });
				}

				let COMMENT_REPLIES: void | any[] = [];
				if (comment.childComments?.length) {
					if (isReplyExpanded) {
						const REPLY_ITEMS = tray.stack(comment.childComments.map(tabs.formatComment.bind(null, level + 1)), { gap: 4 });
						const HIDE_BUTTON = tray.button("Hide replies", {
							intent: "gray-subtle",
							size: "xs",
							className: "absolute bg-transparent rounded-full text-xs bg-no-repeat w-fit pr-6",
							style: {
								left: level === 0 ? "-1rem" : "-0.75rem",
								backgroundImage: `url(${icons.chevy_up})`,
								backgroundPosition: "calc(100%) center",
								backgroundSize: "1.4rem",
							},
							onClick: ctx.eventHandler(`toggle:forum_thread_replies_collapse:${comment.id}`, () =>
								state.expandedReplies.set([...state.expandedReplies.get().filter((x) => x !== comment.id)])
							),
						});
						COMMENT_REPLIES = tray.stack([REPLY_ITEMS, tray.div([HIDE_BUTTON], { className: "relatve w-full h-6" })]);
					} else {
						const SHOW_BUTTON = tray.button(`${comment.childComments.length} ${comment.childComments.length > 1 ? "Replies" : "Reply"}`, {
							intent: "gray-subtle",
							size: "xs",
							className: "absolute bg-transparent rounded-full text-xs bg-no-repeat w-fit pr-6",
							style: {
								left: level === 0 ? "-1rem" : "-0.75rem",
								backgroundImage: `url(${icons.chevy_down})`,
								backgroundPosition: "calc(100%) center",
								backgroundSize: "1.4rem",
							},
							onClick: ctx.eventHandler(`toggle:forum_thread_replies_expand:${comment.id}`, () =>
								state.expandedReplies.set([...state.expandedReplies.get(), comment.id])
							),
						});
						COMMENT_REPLIES = tray.div([SHOW_BUTTON], { className: "relative full h-6" });
					}
				}

				return tray.flex([LEFT_STACK, tray.stack([USER_INFO, COMMENT_CONTENT, COMMENT_STATISTICS, COMMENT_REPLIES], { gap: 0, className: "w-full" })], {
					gap: 0,
				});
			},
			parseMarkdownText(md: string, uid?: string) {
				return [tray.div(MarkdownParser.parse(md, {}, uid).map(MarkdownParser.renderTray).filter(Boolean))];
			},
			parseMarkdownPreviewText(md: string, uid?: string) {
				return MarkdownParser.parse(md, {}, uid)
					.filter((node) =>
						(["bold", "code", "heading", "highlight", "italic", "link", "paragraph", "strikethrough", "text"] as (typeof node.type)[]).includes(node.type)
					)
					.map((node) => (node.type === "heading" ? { ...node, level: 5 } : node))
					.map(MarkdownParser.renderTray)
					.filter(Boolean);
			},
			previewImage(src: string) {
				tabs.currentOverlayType.set("blur");

				const CLOSE = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-no-repeat bg-center bg-transparent p-0 z-[1] absolute",
					style: { backgroundSize: "1.5rem", paddingInlineStart: "0.5rem", backgroundImage: `url(${icons.close})`, top: "0.5rem", right: "0.5rem" },
					onClick: ctx.eventHandler("toggle:overlay:preview_image", () => {
						tabs.currentOverlay.set(null);
						tabs.currentOverlayType.set("default");
					}),
				});

				const IMAGE = tray.div([], {
					className: "w-full bg-no-repeat bg-center bg-contain",
					style: { backgroundImage: `url(${src})`, aspectRatio: "4" },
				});

				tabs.currentOverlay.set([tray.flex([CLOSE, IMAGE], { className: "relative w-full h-full" })]);
			},
			createThread() {
				return;
			},
			[Tabs.Overview]() {
				state.spoilers.set([]);
				ThreadsManager.fetchThreadsOverview();

				tabs.last.set([]);
				const moreButtonOpts = {
					className: "bg-transparent bg-no-repeat rounded-full",
					intent: "gray-subtle" as $ui.Intent,
					disabled: ThreadsManager.isFetching.get(),
					style: {
						backgroundImage: `url(${icons.chevy_right})`,
						backgroundPosition: "calc(100% - 0.5rem) center",
						backgroundSize: "1.1rem",
						paddingInlineEnd: "2.3rem",
						marginRight: "0.5rem",
					},
				};

				const header = this.header("Anilist Forums", "Overview", [
					tray.flex([
						// tray.button("\u200b", {
						// 	intent: "gray-subtle",
						// 	className: "bg-transparent",
						// 	disabled: ThreadsManager.isFetching.get(),
						// 	style: { ...tabs.styles.button_md, backgroundImage: `url(${icons.plus})` },
						// 	onClick: ctx.eventHandler("toggle:overlay:create_thread", () => {}),
						// }),
						tray.anchor("\u200b", {
							href: "https://anilist.co/forum/thread/editor/new",
							target: "_blank",
							className: "bg-transparent bg-center bg-no-repeat rounded-full hover:bg-gray-200 dark:hover:bg-opacity-20 h-10 w-10",
							style: { backgroundImage: `url(${icons.plus})`, backgroundSize: "1.5rem" },
						}),
						tray.button("\u200b", {
							intent: "gray-subtle",
							className: "bg-transparent",
							loading: ThreadsManager.isFetching.get(),
							style: { ...tabs.styles.button_md, backgroundImage: ThreadsManager.isFetching.get() ? "" : `url(${icons.refresh})`, backgroundSize: "1.2rem" },
							onClick: ctx.eventHandler("toggle:threads_manager:refresh_overview", () => ThreadsManager.fetchThreadsOverview(true)),
						}),
					]),
				]);

				const search = tray.input({
					placeholder: "Search threads...",
					fieldRef: ThreadsManager.threadSearch.current,
					disabled: ThreadsManager.isFetching.get(),
					style: {
						borderRadius: "0.5rem",
						paddingInlineStart: "2.5rem",
						backgroundImage: `url(${icons.magnifying_glass})`,
						backgroundSize: "1rem",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "calc(0% + 0.75rem) center",
					},
					onChange: ctx.eventHandler("toggle:overlay:search_threads", ({ value }) => {
						if (!value.trim().length) return;
						ThreadsManager.searchThreads(value);
						tabs.current.set(Tabs.Search);
					}),
				});

				const overview = ThreadsManager.overview;
				const categoryKeys = ["pinnedThreads", "recentlyActive", "releaseDiscussions", "newlyCreated"] as const;
				const categories: Record<(typeof categoryKeys)[number], string> = {
					pinnedThreads: "Pinned",
					recentlyActive: "Recently Active",
					releaseDiscussions: "Release Discussions",
					newlyCreated: "Newly Created",
				};

				const body = tray.stack(
					categoryKeys.map((type) =>
						tray.stack([
							tray.flex(
								[
									tray.text(categories[type], { className: "font-semibold", style: { fontSize: "1.1rem", borderBottom: "1px solid var(--border)" } }),
									tray.button("More", {
										...moreButtonOpts,
										disabled:
											moreButtonOpts.disabled || type === "pinnedThreads" || !(overview as Partial<$forums.ThreadListOverview["data"]>)[type]?.threads.length,
										onClick: ctx.eventHandler(`toggle:tabs:group_thread_view:${type}`, () => {
											if (type === "pinnedThreads") return;
											ThreadsManager.threadGroup.title.set(
												{ recentlyActive: "Recently Active", newlyCreated: "Newly Created", releaseDiscussions: "Release Discussion" }[type] + " Threads"
											);
											ThreadsManager.threadGroup.type.set(type);
											tabs.current.set(Tabs.ThreadGroupView);
										}),
									}),
								],
								{ style: { justifyContent: "space-between" } }
							),
							ThreadsManager.isFetching.get()
								? Array.from({ length: 5 }).map(this.loadingCard_lg)
								: (overview as Partial<$forums.ThreadListOverview["data"]>)[type]?.threads.length
								? (overview as Partial<$forums.ThreadListOverview["data"]>)[type]?.threads.map(
										type === "pinnedThreads" ? this.formatPinnedThreadOverview : this.formatThreadOverview
								  )
								: tray.text("No threads found", {
										className: "bg-gray-900 border opacity-30",
										style: { padding: "0.5rem", borderRadius: "0.5rem", textAlign: "center", alignContent: "center", height: "5rem" },
								  }),
						])
					),
					{
						gap: 5,
						style: {
							height: "25rem",
							overflowY: "scroll",
						},
					}
				);

				return tray.stack([header, search, body], { style: { padding: "0.5rem" } });
			},
			[Tabs.Search]() {
				state.spoilers.set([]);
				const currentQueryString = ThreadsManager.threadSearch.current.current;
				const {
					Page: { threads, pageInfo },
				} = ThreadsManager.threadSearch.lastRes.get() ?? {
					Page: { threads: [], pageInfo: { currentPage: 1, hasNextPage: false, lastPage: 1 } },
				};

				const header = this.header("Anilist Forums", "Search Threads", [
					tray.button("\u200b", {
						intent: "gray-subtle",
						className: "bg-transparent",
						loading: ThreadsManager.isFetching.get(),
						style: { ...tabs.styles.button_md, backgroundImage: ThreadsManager.isFetching.get() ? "" : `url(${icons.refresh})`, backgroundSize: "1.2rem" },
						onClick: ctx.eventHandler("toggle:threads_manager:refresh_overview", () =>
							ThreadsManager.searchThreads(currentQueryString, pageInfo.currentPage)
						),
					}),
				]);

				const search = tray.div(
					[
						tray.input({
							placeholder: "Search threads...",
							fieldRef: ThreadsManager.threadSearch.current,
							style: {
								borderRadius: "0.5rem",
								paddingInlineStart: "2.5rem",
								paddingInlineEnd: "2.5rem",
								backgroundImage: `url(${icons.magnifying_glass})`,
								backgroundSize: "1rem",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "calc(0% + 0.75rem) center",
							},
							onChange: ctx.eventHandler("toggle:overlay:search_threads", ({ value }) => {
								if (!value.length && !ThreadsManager.isFetching.get()) {
									return tabs.current.set(Tabs.Overview);
								}

								// do not process empty strings;
								if (!value.trim().length) return;

								if (ThreadsManager.isFetching.get()) {
									return ThreadsManager.threadSearch.queued.set(value);
								} else {
									ThreadsManager.searchThreads(value);
								}
							}),
						}),
						tray.button("\u200b", {
							intent: "gray-subtle",
							className: "w-10 h-full bg-transparent bg-no-repeat bg-center absolute right-0 top-0",
							disabled: ThreadsManager.isFetching.get(),
							style: { borderRadius: "0 0.5rem 0.5rem 0", backgroundImage: `url(${icons.close})` },
							onClick: ctx.eventHandler("toggle:cancel_search", () => ThreadsManager.threadSearch.current.setValue("")),
						}),
					],
					{ className: "relative h-full" }
				);

				const stacks = ThreadsManager.isFetching.get()
					? Array.from({ length: 6 }).map(this.loadingCard_lg)
					: threads.length
					? threads.map(tabs.formatThreadOverview)
					: [tray.text(`No results for ${currentQueryString}`, { className: "text-center font-semibold" })];

				const pagination = tray.flex(
					[
						pageInfo.lastPage !== 1
							? tray.flex(
									getPagination(pageInfo.currentPage, pageInfo.lastPage).map((page) => {
										if (typeof page === "string") {
											return tray.text(`${page}`, { className: "inline" });
										} else if (page === pageInfo.currentPage) {
											return tray.button(`${page}`, {
												size: "xs",
												className: "bg-transparent hover:bg-transparent text-blue-400",
											});
										} else {
											return tray.button(`${page}`, {
												intent: "gray-subtle",
												size: "xs",
												className: "bg-transparent",
												disabled: ThreadsManager.isFetching.get(),
												onClick: ctx.eventHandler(`toggle:search_threads:fetch_page:${page}`, () =>
													ThreadsManager.searchThreads(currentQueryString, page).catch((error) => ctx.toast.error((error as Error).message))
												),
											});
										}
									}),
									{ gap: 0 }
							  )
							: [],
					],
					{ className: "justify-center mt-4" }
				);

				const body = tray.stack(
					[
						tray.div([tray.text(`Results for ${currentQueryString}`, { className: "line-clamp-1 shrink-0 font-semibold text-md text-gray-400" })], {
							className: "pb-2 border-b",
						}),
						stacks,
						pagination,
					],
					{
						gap: 2,
						style: {
							height: "25rem",
							overflowY: "scroll",
						},
					}
				);

				return tray.stack([header, search, body], { style: { padding: "0.5rem" } });
			},
			[Tabs.ThreadGroupView]() {
				state.spoilers.set([]);
				const title = ThreadsManager.threadGroup.title.get();
				const type = ThreadsManager.threadGroup.type.get();
				const {
					Page: { threads, pageInfo },
				} = ThreadsManager.threadGroup.data.get() ?? {
					Page: { threads: [], pageInfo: { currentPage: 1, hasNextPage: false, lastPage: 1 } },
				};

				const header = this.header("Anilist Forums", `Viewing threads for ${title}`, [
					tray.flex([
						tray.button("\u200b", {
							intent: "gray-subtle",
							className: "bg-transparent",
							loading: ThreadsManager.isFetching.get(),
							disabled: !threads.length,
							style: { ...tabs.styles.button_md, backgroundImage: ThreadsManager.isFetching.get() ? "" : `url(${icons.refresh})`, backgroundSize: "1.2rem" },
							onClick: ctx.eventHandler("toggle:threads_manager:refresh_overview", () => ThreadsManager.fetchThreadsType(type, pageInfo.currentPage)),
						}),
						tray.button("\u200b", {
							intent: "gray-subtle",
							className: "bg-transparent",
							disabled: ThreadsManager.isFetching.get(),
							style: { ...tabs.styles.button_md, backgroundImage: `url(${icons.back})` },
							onClick: ctx.eventHandler("toggle:tabs:previous_page", () => tabs.current.set(Tabs.Overview)),
						}),
					]),
				]);

				const stacks = ThreadsManager.isFetching.get()
					? Array.from({ length: 6 }).map(this.loadingCard_lg)
					: threads.length
					? threads.map(tabs.formatThreadOverview)
					: [tray.text(`No results for ${title}`, { className: "text-center font-semibold" })];

				const pagination = tray.flex(
					[
						pageInfo.lastPage !== 1
							? tray.flex(
									getPagination(pageInfo.currentPage, pageInfo.lastPage).map((page) => {
										if (typeof page === "string") {
											return tray.text(`${page}`, { className: "inline" });
										} else if (page === pageInfo.currentPage) {
											return tray.button(`${page}`, {
												size: "xs",
												className: "bg-transparent hover:bg-transparent text-blue-400",
											});
										} else {
											return tray.button(`${page}`, {
												intent: "gray-subtle",
												size: "xs",
												className: "bg-transparent",
												disabled: ThreadsManager.isFetching.get(),
												onClick: ctx.eventHandler(`toggle:group_threads:fetch_page:${page}`, () =>
													ThreadsManager.fetchThreadsType(type, page).catch((error) => ctx.toast.error((error as Error).message))
												),
											});
										}
									}),
									{ gap: 0 }
							  )
							: [],
					],
					{ className: "justify-center pt-4 mt-4" }
				);

				const body = tray.stack(
					[
						tray.div([tray.text(`${title}`, { className: "line-clamp-1 shrink-0 font-semibold text-md text-gray-400" })], {
							className: "pb-2 border-b",
						}),
						stacks,
						pagination,
					],
					{
						gap: 2,
						style: {
							height: "28rem",
							overflowY: "scroll",
						},
					}
				);

				return tray.stack([header, body], { style: { padding: "0.5rem" } });
			},
			[Tabs.ThreadView]() {
				const thread = state.currentThread.get();
				ThreadsManager.threadComment.fieldRef.setValue("");

				if (!thread) {
					ctx.toast.error(`Unable to get source thread!`);
					return tabs.current.set(Tabs.Overview);
				}

				if (thread.replyCount && !thread.comments) {
					ThreadsManager.fetchThreadCommentsPage(thread.id)
						.then((comments) => state.currentThread.set({ ...thread, comments }))
						.catch((error) => ctx.toast.error((error as Error).message))
						.finally(() => ThreadsManager.isFetching.set(false));
				}

				const header = this.header("Anilist Forums", `Viewing thread: ${thread.title}`, [
					tray.flex([
						// Back button
						tray.button("\u200b", {
							intent: "gray-subtle",
							className: "bg-transparent",
							disabled: ThreadsManager.isFetching.get(),
							style: { ...tabs.styles.button_md, backgroundImage: `url(${icons.back})` },
							onClick: ctx.eventHandler("toggle:tabs:previous_page", () => {
								const prev = tabs.last.get();
								tabs.current.set(prev.pop() ?? Tabs.Overview);
								tabs.last.set([...prev]);
							}),
						}),
					]),
				]);

				const body = tray.stack(
					[
						// Thread title
						tray.text(`${thread.title}`, { className: "text-center break-words text-pretty font-semibold text-lg" }),
						tray.flex([...thread.categories.map(tabs.threadCategory), thread.mediaCategories.map(tabs.threadMediaCategory)], {
							className: "justify-center flex-wrap",
						}),
						tray.flex(
							[
								tray.div([], {
									className: "bg-cover bg-no-repeat bg-center rounded-full w-10 h-10 shrink-0",
									style: { backgroundImage: `url(${thread.user.avatar.large})` },
								}),
								tray.anchor(`${thread.user.name}`, {
									href: `https://anilist.co/user/${thread.user.id}/`,
									target: "_blank",
									className: `no-underline hover:underline text-${thread.user.moderatorRoles ? "orange-400" : "blue-400"}`,
									style: { alignSelf: "center" },
								}),
								thread.user.moderatorRoles?.length
									? tray.text(`${thread.user.moderatorRoles[0].replace(/_/g, " ")}`, {
											className: "w-fit h-fit whitespace-nowrap leading-none font-semibold rounded-full bg-red-600",
											style: { alignContent: "center", fontSize: "0.6rem", padding: "0.2rem 0.5rem" },
									  })
									: [],
								tray.text(`${getRelativeTime(thread.createdAt)}`, {
									className: "w-full opacity-50 text-xs leading-tight whitespace-nowrap",
								}),
								tray.div([], {
									className: `cursor-pointer rounded-lg bg-transparent bg-no-repeat bg-center hover:bg-gray-200 active:bg-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 w-8 h-8 shrink-0`,
									style: { backgroundSize: "1rem", backgroundImage: `url(${icons.flag})` },
									onClick: ctx.eventHandler("toggle:thread:report", () =>
										tabs.externalLinkModal(
											"Thread Reporting Unavailable",
											"AniList does not support reporting threads via API. You can report or flag the discussion directly on AniList by opening the thread.",
											`https://anilist.co/forum/thread/${thread.id}/`
										)
									),
								}),
								tray.anchor(`\u200b`, {
									href: `https://anilist.co/forum/thread/${thread.id}/`,
									target: "_blank",
									className: `rounded-lg bg-transparent bg-no-repeat bg-center hover:bg-gray-200 active:bg-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 w-8 h-8 shrink-0`,
									style: { backgroundSize: "1rem", backgroundImage: `url(${icons.link})` },
								}),
							],
							{ className: "items-center" }
						),
						tray.div(this.parseMarkdownText(thread.body, thread.id.toString()), { className: "text-sm" }),
						tray.flex(
							[
								tray.flex(
									[
										tray.button("\u200b", {
											intent: "gray-subtle",
											className: "bg-transparent h-full w-12 bg-cover bg-center bg-no-repeat px-2",
											loading: state.replyThreadLikeButtonIsLoading.get(),
											disabled: ThreadsManager.isFetching.get(),
											style: {
												backgroundImage: state.replyThreadLikeButtonIsLoading.get() ? "" : `url(${thread.isLiked ? icons.heart_active : icons.heart})`,
												backgroundSize: "1rem",
												paddingInlineStart: "0.5rem",
											},
											onClick: ctx.eventHandler(`toggle:thread:like:${thread.id}`, () => {
												state.replyThreadLikeButtonIsLoading.set(true);
												ThreadsManager.toggleLike(thread.id, "THREAD")
													.then(() => {
														thread.isLiked = !thread.isLiked;
														thread.likeCount = thread.isLiked ? thread.likeCount + 1 : thread.likeCount - 1;
														state.currentThread.set(thread);
													})
													.catch((error) => ctx.toast.error((error as Error).message))
													.finally(() => state.replyThreadLikeButtonIsLoading.set(false));
											}),
										}),
										tray.text(`${thread.likeCount}`, { className: "opacity-50 text-sm" }),
									],
									{ gap: 1, className: "h-full items-center" }
								),
								tray.button(thread.isSubscribed ? "Subscribed" : "Subscribe", {
									size: "sm",
									intent: thread.isSubscribed ? "alert" : "gray-subtle",
									className: `${thread.isSubscribed ? "" : "bg-transparent"}`,
									loading: state.replyThreadLikeButtonIsLoading.get(),
									disabled: ThreadsManager.isFetching.get(),
									onClick: ctx.eventHandler(`toggle:thread:subscribe:${thread.id}`, () => {
										state.replyThreadLikeButtonIsLoading.set(true);
										ThreadsManager.toggleThreadSubscription(thread.id, !thread.isSubscribed)
											.then(({ ToggleThreadSubscription: { isSubscribed } }) => {
												thread.isSubscribed = isSubscribed;
												state.currentThread.set(thread);
											})
											.catch((error) => ctx.toast.error((error as Error).message))
											.finally(() => state.replyThreadLikeButtonIsLoading.set(false));
									}),
								}),
							],
							{ className: "justify-start items-center" }
						),
						tray.flex(
							[
								tray.text(`${formatToK(thread.replyCount)} Replies`, { className: "w-fit font-semibold" }),
								tray.flex(
									[
										tray.text("Sort by", {
											className: "opacity-50 w-fit text-xs h-8 px-2 bg-gray-800 border rounded-tl-lg rounded-bl-lg rounded-r-none whitespace-nowrap",
											style: { alignContent: "center" },
										}),
										tray.select("", {
											size: "sm",
											fieldRef: ThreadsManager.commentSort.fieldRef,
											disabled: true, //disabled for now
											options: Object.entries(ThreadsManager.commentSort.enum).map(([value, label]) => ({ value, label })),
											style: { height: "2rem", borderRadius: "0 0.5rem 0.5rem 0", marginLeft: "-1px" },
											onChange: ctx.eventHandler(`toggle:thread:comment_sort:${thread.id}`, ({ value }) => {
												// SORT IS BROKEN IN AL API GRRRR
												// ThreadsManager.commentSort.fieldRef.setValue(value);
												// ThreadsManager.fetchThreadCommentsPage(thread.id, thread.comments?.pageInfo?.currentPage)
												// 	.then((comments) => state.currentThread.set({ ...thread, comments }))
												// 	.catch((error) => ctx.toast.error((error as Error).message))
												// 	.finally(() => ThreadsManager.isFetching.set(false));
											}),
										}),
									],
									{ gap: 0, style: { alignItems: "center" } }
								),
							],
							{
								className: "justify-between border-t pt-4 mt-4",
							}
						),
						ThreadsManager.isFetching.get()
							? tray.stack(Array.from({ length: 5 }).map(tabs.loadingComment), { gap: 4 })
							: tray.stack(thread.comments?.threadComments.map(tabs.formatComment.bind(null, 0)) ?? [], { gap: 4 }),
						tray.flex(
							[
								thread.replyCount && thread.comments?.threadComments?.length && thread.comments.pageInfo.lastPage !== 1
									? tray.flex(
											getPagination(thread.comments.pageInfo.currentPage, thread.comments.pageInfo.lastPage).map((page) => {
												if (typeof page === "string") {
													return tray.text(`${page}`, { className: "inline" });
												} else if (page === thread.comments?.pageInfo.currentPage) {
													return tray.button(`${page}`, {
														size: "xs",
														className: "bg-transparent hover:bg-transparent text-blue-400",
													});
												} else {
													return tray.button(`${page}`, {
														intent: "gray-subtle",
														size: "xs",
														className: "bg-transparent",
														disabled: ThreadsManager.isFetching.get(),
														onClick: ctx.eventHandler(`toggle:thread_comments:fetch_page:${page}`, () =>
															ThreadsManager.fetchThreadCommentsPage(thread.id, page)
																.then((comments) => state.currentThread.set({ ...thread, comments }))
																.catch((error) => ctx.toast.error((error as Error).message))
														),
													});
												}
											}),
											{ gap: 0 }
									  )
									: [],
							],
							{ className: "justify-center pt-4 mt-4" }
						),
						tray.stack(
							[
								tray.flex(
									[
										tray.input("", {
											size: "sm",
											textarea: true,
											disabled: thread.isLocked,
											placeholder: thread.isLocked ? "This thread is locked." : "Write a comment...",
											style: { height: "2.35rem", borderRadius: "0.5rem 0 0 0.5rem", fontSize: "0.875rem", lineHeight: "1.25rem" },
											onChange: ctx.eventHandler(`input:thread_comment:${thread.id}`, ({ value }) => ThreadsManager.threadComment.fieldRef.setValue(value)),
										}),
										tray.button("\u200b", {
											size: "sm",
											disabled: thread.isLocked,
											loading: ThreadsManager.threadComment.isReplying.get() || ThreadsManager.isFetching.get(),
											className:
												"w-fit h-full bg-no-repeat bg-center px-5 bg-transparent border-gray-900 hover:bg-opacity-70 hover:bg-brand-500 hover:border-brand-400/20",
											style: {
												borderRadius: "0 0.5rem 0.5rem 0",
												marginLeft: "-1px",
												backgroundImage: ThreadsManager.threadComment.isReplying.get() || ThreadsManager.isFetching.get() ? "" : `url(${icons.send})`,
											},
											onClick: ctx.eventHandler(`submit:thread_comment:${thread.id}`, () => {
												const comment = ThreadsManager.threadComment.fieldRef.current;
												if (!comment.trim().length) return ctx.toast.error(`Comment cannot be blank!`);

												ThreadsManager.threadComment.isReplying.set(true);
												ThreadsManager.replyToThread(thread.id, comment)
													.then((data) => {
														if (thread.comments) {
															thread.comments.threadComments.unshift(data.SaveThreadComment);
														} else {
															thread.comments = {
																threadComments: [data.SaveThreadComment],
																pageInfo: { lastPage: 1, currentPage: 1, hasNextPage: false },
															};
														}
														thread.replyCount = thread.replyCount++;
														state.currentThread.set(thread);
														ThreadsManager.threadComment.fieldRef.setValue("");
													})
													.catch((err) => ctx.toast.error(`Error on thread reply: ${(err as Error).message}`))
													.finally(() => ThreadsManager.threadComment.isReplying.set(false));
											}),
										}),
									],
									{ gap: 0 }
								),
								tray.flex(
									[
										tray.anchor("🛈 Markdown is allowed", {
											href: thread.isLocked ? "" : "https://anilist.co/forum/thread/6125",
											target: "_blank",
											className: `opacity-${thread.isLocked ? "30" : "70"} text-xs no-underline ${thread.isLocked ? "" : "hover:underline"} w-fit`,
										}),
										tray.button("Use markdown editor", {
											size: "sm",
											disabled: thread.isLocked,
											className: "bg-transparent h-fit hover:underline text-xs opacity-70",
											style: { fontWeight: "normal" },
											onClick: ctx.eventHandler(`toggle:markdown_editor:${thread.id}`, () => tabs.replyModal(thread)),
										}),
									],
									{
										className: "justify-between items-center",
									}
								),
							],
							{
								className: "sticky p-2 m-1 mb-1 rounded-lg bg-gray-900 border",
								style: { bottom: "0.25rem", boxShadow: "0 0 0.5rem #000" },
							}
						),
					],
					{ style: { height: "28rem", overflow: "hidden scroll", paddingRight: "0.25rem" } }
				);

				return tray.stack([tabs.overlay(), header, body], { style: { padding: "0.5rem" } });
			},
			get() {
				return tabs[this.current.get()]();
			},
		};

		function truncateString(str: string, maxLength: number): string {
			if (str.length <= maxLength) return str;
			if (maxLength <= 3) return str.slice(0, maxLength);
			return str.slice(0, maxLength - 3) + "...";
		}

		function formatToK(num: number) {
			if (num < 1000) return num.toString();
			const formatted = (num / 1000).toFixed(1);
			return formatted.replace(/\.0$/, "") + "K";
		}

		function getRelativeTime(unixS: number): string {
			const unixMS = unixS * 1000;
			const diff = Date.now() - unixMS;

			const seconds = Math.max(Math.floor(diff / 1000), 1);
			if (seconds < 60) return `${seconds}s ago`;

			const minutes = Math.max(Math.floor(seconds / 60), 1);
			if (minutes < 60) return `${minutes}m ago`;

			const hours = Math.max(Math.floor(minutes / 60), 1);
			if (hours < 24) return `${hours}h ago`;

			const days = Math.max(Math.floor(hours / 24), 1);
			if (days < 7) return `${days}d ago`;

			const weeks = Math.max(Math.floor(days / 7), 1);
			if (weeks < 4) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;

			const months = Math.max(Math.floor(days / 30), 1); // approximate month length
			if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;

			const years = Math.max(Math.floor(days / 365), 1); // approximate year length
			return years === 1 ? "1 year ago" : `${years} years ago`;
		}

		function getPagination(current: number, last: number): (number | string)[] {
			const pages: (number | string)[] = [];

			// Always include first
			pages.push(1);

			// Case: near the beginning
			if (current <= 4) {
				const end = Math.min(6, last - 1);
				for (let i = 2; i <= end; i++) pages.push(i);
				if (last > end + 1) pages.push("...");
				pages.push(last);
				return pages;
			}

			// Case: near the end
			if (current >= last - 3) {
				pages.push("...");
				const start = Math.max(last - 5, 2);
				for (let i = start; i < last; i++) pages.push(i);
				pages.push(last);
				return pages;
			}

			// Case: middle range
			pages.push("...");
			const start = current - 2;
			const end = current + 2;
			for (let i = start; i <= end; i++) pages.push(i);
			pages.push("...");
			pages.push(last);

			return pages;
		}

		function replaceThreadComment(comments: $forums.ThreadComment[], updated: $forums.ThreadComment): boolean {
			for (let i = 0; i < comments.length; i++) {
				const comment = comments[i];

				if (comment.id === updated.id) {
					comments[i] = updated;
					return true;
				}

				if (comment.childComments?.length) {
					if (replaceThreadComment(comment.childComments, updated)) {
						return true;
					}
				}
			}
			return false;
		}

		function removeThreadComment(comments: $forums.ThreadComment[], id: number): $forums.ThreadComment[] {
			return comments
				.filter((c) => c.id !== id)
				.map((c) => ({
					...c,
					...(c.childComments?.length ? { childComments: removeThreadComment(c.childComments, id) } : {}),
				}));
		}

		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Anilist%20Forums/icon.png";
		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
		});

		tray.render(() => tabs.get());

		tray.onOpen(() => {
			const currentMediaId = state.currentMediaId.get();
			const previousMediaId = ThreadsManager.threadGroup.mediaCategoryId.get();
			const previousType = ThreadsManager.threadGroup.type.get();
			ThreadsManager.threadGroup.mediaCategoryId.set(currentMediaId);
			// Enforce page view if in media page
			if (currentMediaId !== null) {
				// This will trigger a refetch (ctx.effect) only if not previously media
				ThreadsManager.threadGroup.type.set("media");
				tabs.current.set(Tabs.ThreadGroupView);

				// If different media ids, force a fetch
				// Check if previous type is media (if not previously media, already fetched)
				if (previousType === "media" && currentMediaId !== previousMediaId) {
					ThreadsManager.fetchThreadsType("media").catch((e) => ctx.toast.error((e as Error).message));
				}
			}
		});

		ctx.screen.onNavigate((e) => {
			// Anime or manga
			if (["/entry", "/manga/entry"].includes(e.pathname)) {
				const mediaId = Number(e.searchParams.id);
				(e.pathname === "/entry" ? ctx.anime.getAnimeEntry : ctx.manga.getMangaEntry)(mediaId)
					.then((entry) => {
						ThreadsManager.threadGroup.title.set(`Threads related to ${entry.media?.title?.userPreferred}`);
						state.currentMediaId.set(entry.mediaId);
					})
					.catch((error) => {
						ctx.toast.error(`Anilist Forums [failed to set current media id]: ${(error as Error).message}`);
						state.currentMediaId.set(null);
					});
			} else {
				state.currentMediaId.set(null);
			}
		});

		ctx.effect(() => {
			ThreadsManager.fetchThreadsType(ThreadsManager.threadGroup.type.get()).catch((e) => ctx.toast.error((e as Error).message));
		}, [ThreadsManager.threadGroup.type]);

		ctx.screen.loadCurrent(); // load current screen on extension init
	});
}
