/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./anilist-watch-order.d.ts" />

// @ts-ignore
function init() {
	$ui.register(async (ctx) => {
		// prettier-ignore
		const CACHED_RESULTS = "0459a6e5-9ca0-41c7-8074-7d32feb46cf3";
		const ALLOWED_RELATIONS: $app.AL_MediaRelation[] = [
			"SEQUEL",
			"PREQUEL",
			"SPIN_OFF",
			"PARENT",
			"SIDE_STORY",
			"ALTERNATIVE",
		];

		const currentMediaId = ctx.state<number | null>(null);
		const nodes = ctx.state<RelationsTreeNode[]>([]);
		const edges = ctx.state<RelationsTreeEdge[]>([]);
		const queued = ctx.state<number[]>([]);
		const fetched = ctx.state<number[]>([]);
		const seen = ctx.state<number[]>([]);
		const calls = ctx.state<number>(0);
		const fetching = ctx.state<boolean>(false);

		const buttonStyle = {
			// prettier-ignore
			backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2NhY2FjYSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01IDExLjVhLjUuNSAwIDAgMSAuNS0uNWg5YS41LjUgMCAwIDEgMCAxaC05YS41LjUgMCAwIDEtLjUtLjVtMC00YS41LjUgMCAwIDEgLjUtLjVoOWEuNS41IDAgMCAxIDAgMWgtOWEuNS41IDAgMCAxLS41LS41bTAtNGEuNS41IDAgMCAxIC41LS41aDlhLjUuNSAwIDAgMSAwIDFoLTlhLjUuNSAwIDAgMS0uNS0uNSIvPjxwYXRoIGQ9Ik0xLjcxMyAxMS44NjV2LS40NzRIMmMuMjE3IDAgLjM2My0uMTM3LjM2My0uMzE3IDAtLjE4NS0uMTU4LS4zMS0uMzYxLS4zMS0uMjIzIDAtLjM2Ny4xNTItLjM3My4zMWgtLjU5Yy4wMTYtLjQ2Ny4zNzMtLjc4Ny45ODYtLjc4Ny41ODgtLjAwMi45NTQuMjkxLjk1Ny43MDNhLjU5NS41OTUgMCAwIDEtLjQ5Mi41OTR2LjAzM2EuNjE1LjYxNSAwIDAgMSAuNTY5LjYzMWMuMDAzLjUzMy0uNTAyLjgtMS4wNTEuOC0uNjU2IDAtMS0uMzctMS4wMDgtLjc5NGguNTgyYy4wMDguMTc4LjE4Ni4zMDYuNDIyLjMwOS4yNTQgMCAuNDI0LS4xNDUuNDIyLS4zNS0uMDAyLS4xOTUtLjE1NS0uMzQ4LS40MTQtLjM0OGgtLjN6bS0uMDA0LTQuNjk5aC0uNjA0di0uMDM1YzAtLjQwOC4yOTUtLjg0NC45NTgtLjg0NC41ODMgMCAuOTYuMzI2Ljk2Ljc1NiAwIC4zODktLjI1Ny42MTctLjQ3Ni44NDhsLS41MzcuNTcydi4wM2gxLjA1NFY5SDEuMTQzdi0uMzk1bC45NTctLjk5Yy4xMzgtLjE0Mi4yOTMtLjMwNC4yOTMtLjUwOCAwLS4xOC0uMTQ3LS4zMi0uMzQyLS4zMmEuMzMuMzMgMCAwIDAtLjM0Mi4zMzh6TTIuNTY0IDVoLS42MzVWMi45MjRoLS4wMzFsLS41OTguNDJ2LS41NjdsLjYyOS0uNDQzaC42MzV6Ii8+PC9zdmc+)",
			backgroundRepeat: "no-repeat",
			backgroundPosition: "0.85em center",
			textIndent: "2em",
			backgroundSize: "21.5px 21.5px",
		};
		const button = ctx.action.newAnimePageButton({
			label: "Watch Order",
			intent: "gray-subtle",
			style: buttonStyle,
		});

		button.mount();

		// Initialize cache
		$store.set(CACHED_RESULTS, []);

		// This is important to avoid hitting rate-limit
		// Querying fate series (large universe) took 15 seconds and 5 API calls to query over 40 entries
		// i think i could consider that performant (●'◡'●)
		function delay(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		function normalizeString(type: string): string {
			return type
				.toLowerCase()
				.split("_")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		}

		async function fetchMediaBulk(ids: number[]): Promise<MediaQueryResponse[]> {
			console.log("[Ext<AnilistWatchOrder>]: (log) fetchMediaBulk called for ", ids);
			// prettier-ignore
			const QUERY = "query ($ids: [Int]) { Page { media(id_in: $ids, type: ANIME) { id title { userPreferred } startDate { year } type format status relations { edges { relationType node { id title { userPreferred } startDate { year } type format status relations { edges { relationType node { id title { userPreferred } startDate { year } type format status } } } } } } } } }";
			const res = await fetch("https://graphql.anilist.co", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query: QUERY, variables: { ids } }),
			});

			if (!res.ok) throw new Error(res.statusText);
			return (await res.json()).data.Page.media;
		}

		function addNode(media: MediaQueryResponse | $app.AL_BaseAnime) {
			if (fetched.get().includes(media.id)) return false;
			fetched.set([...fetched.get(), media.id]);

			const STATUS_BORDER_COLORS: Record<$app.AL_MediaStatus, string> = {
				FINISHED: "#4a89dc", // blue
				RELEASING: "#a0d468", // green
				NOT_YET_RELEASED: "#ffce54", // yellow
				CANCELLED: "#ed5565", // red
				HIATUS: "#ac92ec", // purple
			};

			const node = {
				id: media.id,
				label: `${media.title?.userPreferred}\n${media.format ? media.format + " " : ""}(${
					media.startDate?.year ?? "UPCOMING"
				})`,
				shape: "box",
				borderWidth: 2,
				borderWidthSelected: 4,
				margin: 10,
				font: {
					multi: true,
					color: "#fff",
					size: 14,
					face: "Arial",
					strokeWidth: 2,
					strokeColor: "#000", // outline for readability
				},
				shadow: {
					enabled: true,
					color: "rgba(0,0,0,0.4)",
					size: 8,
					x: 2,
					y: 2,
				},
				color: {
					background: "#282828",
					border: STATUS_BORDER_COLORS[media.status!],
					highlight: {
						background: "#333", // dark gray when selected
						border: "#ff00ff",
					},
					hover: {
						background: "#444", // lighter gray on hover
						border: STATUS_BORDER_COLORS[media.status!],
					},
				},
			};

			nodes.set([...nodes.get(), node]);
			return true;
		}

		function addEdgeNormalized(fromId: number, toId: number, relationType: string) {
			let edge;

			// Normalize PREQUEL → SEQUEL
			if (relationType === "PREQUEL") {
				edge = { from: toId, to: fromId, label: "Sequel", arrows: "to" };
			} else {
				edge = { from: fromId, to: toId, label: normalizeString(relationType), arrows: "to" };
			}

			// Skip adding parent
			if (relationType === "PARENT") return;

			// 🔎 Add dashed styling for non-sequels
			if (edge.label !== "Sequel") {
				(edge as any).label = ` ${edge.label} `.toUpperCase();
				(edge as any).dashes = true;
				(edge as any).color = { color: "#808080" };
				(edge as any).font = {
					color: "#808080",
					strokeWidth: 0,
				};
			} else {
				(edge as any).label = ` ${edge.label} `.toUpperCase();
				(edge as any).width = 5;
				(edge as any).font = {
					color: "#fff",
					strokeWidth: 0,
				};
			}

			const currentEdges = edges.get();

			// Prevent exact duplicates
			const exists = currentEdges.some((e) => e.from === edge.from && e.to === edge.to && e.label === edge.label);
			if (!exists) {
				edges.set([...currentEdges, edge]);
			}
		}

		function getRelations(edges?: MediaEdge[], parentId?: number) {
			if (!edges || edges.length === 0) return; // guard clause

			for (const edge of edges) {
				const { relationType, node } = edge ?? {};
				if (!node || node.type !== "ANIME") continue;

				if (relationType && ALLOWED_RELATIONS.includes(relationType)) {
					// record node + edge
					addNode(node);
					if (parentId && relationType) {
						addEdgeNormalized(parentId, node.id, relationType);
					}

					// recurse if nested relations exist
					if (node.relations?.edges?.length) {
						getRelations(node.relations.edges, node.id);
					} else {
						if (!seen.get().includes(node.id)) {
							seen.set([...seen.get(), node.id]);
							queued.set([...new Set([...queued.get(), node.id])]);
						}
					}
				}
			}
		}

		async function walkRelations(media: $app.AL_BaseAnime) {
			// check cache
			const cache = $store.get(CACHED_RESULTS) as RelationsCache[];
			const cacheEntry = cache.find((e) => e.family.includes(media.id));

			if (cacheEntry) {
				nodes.set(cacheEntry.nodes);
				edges.set(cacheEntry.edges);
				console.log("[Ext<AnilistWatchOrder>]: (log) Cache hit for media.id:", media.id);
				return; // early return prevents duplicate work + duplicate cache entries
			}

			$store.set("now", Date.now());
			queued.set([media.id]);
			seen.set([]);
			nodes.set([]);
			edges.set([]);
			fetching.set(true);

			// add current media to node
			addNode(media);
			fetched.set([media.id]);

			do {
				const list = await fetchMediaBulk(queued.get()).catch((e: Error) => e.message);

				// Monitor api calls
				calls.set(calls.get() + 1);
				await delay(2_000);
				if (typeof list === "string") {
					ctx.toast.error(`An error occured while performing a recursive operation: ${list}`);
					return console.error(`[EXT<AnilistWatchOrder>]: (err) ${list}`);
				}

				queued.set([]);

				for (const media of list ?? []) {
					addNode(media);

					if (media.relations?.edges?.length) {
						getRelations(media.relations.edges, media.id);
					} else {
						if (!seen.get().includes(media.id)) {
							seen.set([...seen.get(), media.id]);
							queued.set([...new Set([...queued.get(), media.id])]);
						}
					}
				}
			} while (queued.get().length > 0);

			// Diagnostics (Monitor API Health)
			const elapsed = ((Date.now() - $store.get("now")) / 1000).toFixed(2);
			console.log(`Performed ${calls.get()} API calls in ${elapsed} seconds!`);

			// Cache this result
			$store.set(CACHED_RESULTS, [
				...$store.get(CACHED_RESULTS),
				{
					family: fetched.get(),
					edges: edges.get(),
					nodes: nodes.get(),
				},
			]);

			// Reset API calls monitor
			calls.set(0);
			fetching.set(false);
		}

		async function handleButtonPress(e: { media: $app.AL_BaseAnime }) {
			// reset nodes
			nodes.set([]);
			edges.set([]);

			const oldscript = [
				...(await ctx.dom.query("[data-relations-graph]")),
				...(await ctx.dom.query("[data-relations-graph-data]")),
			];

			if (oldscript.length) {
				for (const script of oldscript) {
					script.remove();
				}
			}

			const script = await ctx.dom.createElement("script");
			script.setAttribute("data-relations-graph", "true");
			script.setText(`
				(function () {
					let container = document.getElementById("franchise-graph");
					if (!container) {
						container = document.createElement("div");
						container.className = "sm:max-w-5xl lg:m-[10px]";
						container.id = "franchise-graph";
						container.style.width = "100%";
						container.style.height = "500px";
						container.style.border = "1px solid var(--border)";
						container.style.marginTop = "1rem";
						container.style.position = "fixed";
						container.style.bottom = "10px";
						container.style.right = "10px";
						container.style.backgroundColor = "var(--background, #111)";
						container.style.zIndex = "50";
						container.style.borderRadius = "15px";
						container.style.display = "flex";
						container.style.flexDirection = "column";
						container.style.padding = "1rem";

						// --- Header ---
						const header = document.createElement("div");
						header.style.display = "flex";
						header.style.justifyContent = "space-between";
						header.style.alignItems = "center";
						header.style.color = "#fff";
						header.style.padding = "0.5rem 0";

						const title = document.createElement("h3");
						title.textContent = "Watch Order";
						header.appendChild(title);

						const dismissBtn = document.createElement("button");
						dismissBtn.textContent = "✕";
						dismissBtn.style.background = "none";
						dismissBtn.style.border = "none";
						dismissBtn.style.color = "#fff";
						dismissBtn.style.fontSize = "1.2rem";
						dismissBtn.style.cursor = "pointer";
						dismissBtn.addEventListener("click", () => container.remove());
						header.appendChild(dismissBtn);

						// --- Body ---
						const body = document.createElement("div");
						body.style.flex = "1";
						body.style.display = "flex";
						body.style.flexDirection = "column";

						const graphArea = document.createElement("div");
						graphArea.id = "graph-area";
						graphArea.style.flex = "1";
						graphArea.style.background = "#111";
						graphArea.style.overflow = "hidden";
						graphArea.style.borderRadius = "15px";

						graphArea.style.display = "flex";
						graphArea.style.flexDirection = "column";
						graphArea.style.alignItems = "center";
						graphArea.style.justifyContent = "center";

						const spinner = document.createElement("div");
						spinner.className = "franchise-map-spinner-container";
						const spinIcon = document.createElement("div");
						spinIcon.className = "franchise-map-spinner";
						const spinText = document.createElement("div");
						spinText.className = "franchise-map-spinner-text";
						spinText.innerHTML = "Loading relations data. This won't take long...";
						
						spinner.appendChild(spinIcon);
						spinner.appendChild(spinText);
						graphArea.appendChild(spinner);
						body.appendChild(graphArea);

						const extras = document.createElement("div");
						extras.textContent = "You can click on any node to navigate on that page directly.";
						extras.style.color = "#cacaca";
						extras.style.marginTop = "0.5rem";
						body.appendChild(extras);

						// Assemble
						container.appendChild(header);
						container.appendChild(body);
						document.body.appendChild(container);
					}
				})();
			`);

			await walkRelations(e.media);

			const dataScript = await ctx.dom.createElement("script");
			dataScript.setAttribute("data-relations-graph-data", "true");
			dataScript.setText(`
				(function () {
					const nodesData = ${JSON.stringify(nodes.get())};
					const edgesData = ${JSON.stringify(edges.get())};
					const graphArea = document.getElementById("graph-area");
					if (!graphArea) return;

					graphArea.innerHTML = ""; // clear loading

					const nodes = new vis.DataSet(nodesData);
					const edges = new vis.DataSet(edgesData);
					const data = { nodes, edges };

					const options = {
						physics: {
							enabled: true,
							solver: "repulsion",
							repulsion: {
								nodeDistance: 250,
								springLength: 300,
								springConstant: 0.05,
							},
						},
					};

					const network = new vis.Network(graphArea, data, options);
					network.selectNodes([${e.media.id}]);

					network.once("stabilizationIterationsDone", () => {
						network.focus(${e.media.id}, {
							scale: 1,
							animation: { duration: 500, easingFunction: "easeInOutQuad" }
						});
					});

					network.on("click", (params) => {
						if (params.nodes.length > 0) {
							const id = params.nodes[0];
							let marker = document.getElementById("franchise-navigate-marker");
							if (!marker) {
								marker = document.createElement("div");
								marker.id = "franchise-navigate-marker";
								marker.style.display = "none";
								document.body.appendChild(marker);
							}
							marker.setAttribute("data-id", id);
						}
					});
				})();
			`);
		}

		ctx.effect(() => {
			// No abortcontroller so do this to avoid parallel api calls
			button.setStyle(fetching.get() ? { ...buttonStyle, opacity: "0.5", pointerEvents: "none" } : buttonStyle);
		}, [fetching]);

		// When users navigate to other page
		ctx.screen.onNavigate(async (e) => {
			const franchiseGraph = await ctx.dom.queryOne("#franchise-graph");
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				currentMediaId.set(parseInt(e.searchParams.id) || null);

				const franchiseGraph = await ctx.dom.queryOne("#franchise-graph");
				const fgMarker = await ctx.dom.queryOne("#franchise-navigate-marker");
				const markerId = await fgMarker?.getAttribute("data-id");

				if (!(markerId && parseInt(markerId) === currentMediaId.get())) franchiseGraph?.remove();
			} else {
				franchiseGraph?.remove();
				currentMediaId.set(null);
			}
		});

		// load vis module
		ctx.dom.onReady(async () => {
			const script = await ctx.dom.createElement("script");
			const styles = await ctx.dom.createElement("style");
			const head = await ctx.dom.queryOne("head");
			script.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis-network.min.js");
			styles.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis-network.min.css");
			styles.setAttribute("rel", "stylesheet");
			styles.setAttribute("type", "text/css");

			const customStyle = await ctx.dom.createElement("style");
			// prettier-ignore
			customStyle.setText(".franchise-map-spinner-container { display: flex; flex-direction: column; align-items: center; justify-content: center; } .franchise-map-spinner { width: 40px; height: 40px; border: 4px solid #ccc; border-top: 4px solid #4cafef; border-radius: 50%; animation: franchise-map-spin 1s linear infinite; margin-bottom: 0.5rem; } .franchise-map-spinner-text { color: #cacaca; font-size: 14px; } @keyframes franchise-map-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }");

			head?.append(script);
			head?.append(styles);
			head?.append(customStyle);

			button.onClick(handleButtonPress);
		});

		ctx.dom.observe("#franchise-navigate-marker", (elements) => {
			if (!currentMediaId.get()) return;
			const id = elements[0]?.attributes["data-id"];
			if (id) ctx.screen.navigateTo("/entry", { id });
		});

		ctx.screen.loadCurrent();
	});
}
