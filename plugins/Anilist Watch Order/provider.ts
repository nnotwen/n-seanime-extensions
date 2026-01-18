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
			"SUMMARY",
		];

		const currentMediaId = ctx.state<number | null>(null);
		const graphData = ctx.state<{
			nodes: RelationsTreeNode[];
			edges: RelationsTreeEdge[];
			mediaId: number | null;
			ready: boolean;
		}>({ nodes: [], edges: [], mediaId: null, ready: false });
		const queued = ctx.state<number[]>([]);
		const fetched = ctx.state<number[]>([]);
		const seen = ctx.state<number[]>([]);
		const calls = ctx.state<number>(0);
		const fetching = ctx.state<boolean>(false);
		const isOpen = ctx.state<boolean>(false);

		const buttonStyle = {
			// prettier-ignore
			backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOSA0djltMyAwSDZtNiAxNEg2bTAtN3MzLTMgNSAwLTUgNy01IDdtMCA3LjVzMi0zIDUtMSAwIDQuNSAwIDQuNSAzIDIuNSAwIDQuNS01LTEtNS0xbTUtMy41SDlNOSA0IDYgNm0xNSAxOGgyMk0yMSAzOGgyMk0yMSAxMGgyMiIgc3Ryb2tlPSIjY2FjYWNhIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==)",
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			backgroundSize: "21.5px 21.5px",
			width: "40px",
			padding: "0",
			paddingInlineStart: "0.5rem",
		};

		const button = ctx.action.newAnimePageButton({
			label: "\u200b",
			intent: "gray-subtle",
			style: buttonStyle,
			tooltipText: "Watch Order",
		});

		button.mount();

		// Create fixed webview
		// const webview = ctx.newWebview({
		// 	slot: "fixed",
		// 	width: "100%",
		// 	maxWidth: "1200px",
		// 	height: "500px",
		// 	window: {
		// 		draggable: true,
		// 		defaultPosition: "bottom-right",
		// 	},
		// 	hidden: true,
		// });

		// Try using a mounted webview
		const webview = ctx.newWebview({
			slot: "before-anime-entry-episode-list",
			width: "100%",
			height: "500px",
			maxHeight: "65vh",
			hidden: true,
		});

		ctx.effect(() => {
			if (isOpen.get() && webview.isHidden()) webview.show();
			else if (!isOpen.get() && !webview.isHidden()) webview.hide();
		}, [isOpen]);

		// Initialize cache
		$store.set(CACHED_RESULTS, []);

		// Setup webview communication
		webview.channel.sync("graphData", graphData);
		webview.channel.sync("fetching", fetching);

		webview.channel.on("close", () => {
			isOpen.set(false);
		});

		webview.channel.on("navigate", (mediaId: number) => {
			ctx.screen.navigateTo("/entry", { id: mediaId.toString() });
		});

		// Render webview content
		webview.setContent(
			() => /*html*/ `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<style>
				html {
					color-scheme: dark;
					overflow: hidden;
					border-radius: 15px;   
				}
				
				body {
					/*background: #0c0c0c;*/
					border-radius: 15px;
					overflow: hidden;
					color: #fff;
					font-family: -apple-system, system-ui, sans-serif;
					margin: 0;
					/*padding: 1rem;*/
					display: flex;
					flex-direction: column;
					height: 100vh;
					box-sizing: border-box;
				}

				.header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0.5rem 0;
					margin-bottom: 1rem;
				}

				.header h3 {
					margin: 0;
				}

				.close-btn {
					background: none;
					border: none;
					color: #fff;
					font-size: 1.2rem;
					cursor: pointer;
					padding: 0.25rem 0.5rem;
				}

				.close-btn:hover {
					opacity: 0.7;
				}

				.graph-container {
					flex: 1;
					background: #111;
					border-radius: 15px;
					overflow: hidden;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 1px solid #ffffff0f;
				}

				.loading {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 1rem;
				}

				.spinner {
					width: 3rem;
					height: 3rem;
					border: 3px solid rgba(255, 255, 255, 0.1);
					border-top-color: #fff;
					border-radius: 50%;
					animation: spin 1s linear infinite;
				}

				@keyframes spin {
					to { transform: rotate(360deg); }
				}

				.extras {
					color: #919191;
					margin-top: 0.5rem;
					margin-bottom: 1rem;
					font-size: 0.9rem;
				}
			</style>
			<script src="https://unpkg.com/dagre/dist/dagre.min.js"></script>
			<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
			<link rel="stylesheet" href="https://unpkg.com/vis-network/styles/vis-network.min.css">
		</head>
		<body>
			<div class="header">
				<h3>Watch Order</h3>
				<button class="close-btn" onclick="closeWebview()">✕</button>
			</div>
			
			<div class="graph-container" id="graph-area">
				<div class="loading">
					<div class="spinner"></div>
					<p>Loading relations data. This won't take long...</p>
				</div>
			</div>
			
			<div class="extras">
				You can click on any node to navigate to that page directly.
			</div>

			<script>
				let network = null;

				function closeWebview() {
					window.webview.send("close");
				}

				function renderGraph(graphData) {
					if (!graphData || !graphData.nodes || !graphData.edges || graphData.nodes.length === 0) {
						return;
					}

					const graphArea = document.getElementById("graph-area");
					graphArea.innerHTML = "";

					const g = new dagre.graphlib.Graph();
					g.setGraph({ rankdir: "LR" });
					g.setDefaultEdgeLabel(() => ({}));

					graphData.nodes.forEach(n => {
						g.setNode(n.id, { width: 250, height: 100 });
					});

					graphData.edges.forEach(e => {
						g.setEdge(e.from, e.to);
					});

					dagre.layout(g);

					const nodesWithPositions = graphData.nodes.map(n => {
						const pos = g.node(n.id);
						return {
							...n,
							x: pos.x,
							y: pos.y,
							fixed: { x: true, y: true }
						};
					});

					const nodes = new vis.DataSet(nodesWithPositions);
					const edges = new vis.DataSet(graphData.edges);
					const data = { nodes, edges };

					const options = {
						physics: false,
						edges: {
							smooth: {
								type: "cubicBezier",
								forceDirection: "horizontal",
								roundness: 0.4
							}
						}
					};

					network = new vis.Network(graphArea, data, options);
					
					if (graphData.mediaId) {
						network.selectNodes([graphData.mediaId]);
						network.once("afterDrawing", () => {
							network.focus(graphData.mediaId, {
								scale: 1,
								animation: { duration: 500, easingFunction: "easeInOutQuad" }
							});
						});
					}

					network.on("click", (params) => {
						if (params.nodes.length > 0) {
							const id = params.nodes[0];
							window.webview.send("navigate", id);
						}
					});
				}

				if (window.webview) {
					window.webview.on("graphData", (data) => {
						if (data && data.ready && data.nodes.length > 0) {
							renderGraph(data);
						}
					});

					window.webview.on("fetching", (isFetching) => {
						// no-op
					});
				}
			</script>
		</body>
		</html>`,
		);

		function delay(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		function normalizeString(type: string): string {
			return type.split("_").join(" ");
		}

		function wrapString(text: string, maxCharsPerLine = 20): string {
			if (!text) return "";

			const words = text.split(" ");
			const lines: string[] = [];
			let currentLine = "";

			words.forEach((word) => {
				if ((currentLine + word).length > maxCharsPerLine) {
					lines.push(currentLine.trim());
					currentLine = word + " ";
				} else {
					currentLine += word + " ";
				}
			});

			if (currentLine.trim().length > 0) {
				lines.push(currentLine.trim());
			}

			return lines.join("\n");
		}

		async function fetchMediaBulk(ids: number[]): Promise<MediaQueryResponse[]> {
			console.log("[Ext<AnilistWatchOrder>]: (log) fetchMediaBulk called for ", ids);
			// prettier-ignore
			const QUERY = "query ($ids: [Int]) { Page { media(id_in: $ids, type: ANIME) { id title { userPreferred } startDate { year } type format status relations { edges { relationType node { id title { userPreferred } startDate { year } type format status relations { edges { relationType node { id title { userPreferred } startDate { year } type format status } } } } } } } } }"
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

			const statusColor = media.status ? STATUS_BORDER_COLORS[media.status] : "#4a89dc";

			const node = {
				id: media.id,
				label: `${wrapString(media.title?.userPreferred ?? "")}\n\n${
					media.format ? normalizeString(media.format) + " " : ""
				}(${media.startDate?.year ?? "UPCOMING"})`,
				shape: "box",
				borderWidth: 1,
				borderWidthSelected: 2,
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
					border: statusColor,
					highlight: {
						background: "#333", // dark gray when selected
						border: "#ff00ff",
					},
					hover: {
						background: "#444", // lighter gray on hover
						border: statusColor,
					},
				},
			};

			const current = graphData.get();
			graphData.set({
				...current,
				nodes: [...current.nodes, node],
				ready: false,
			});
			return true;
		}

		function addEdgeNormalized(fromId: number, toId: number, relationType: string) {
			let edge: { dashes?: boolean; color?: any; font?: any } & $awo.RelationsTreeEdge;

			// Normalize PREQUEL → SEQUEL
			if (relationType === "PREQUEL") {
				edge = { from: toId, to: fromId, label: normalizeString("SEQUEL"), arrows: "to" };
			} else {
				edge = { from: fromId, to: toId, label: normalizeString(relationType), arrows: "to" };
			}

			// Skip adding parent
			if (relationType === "PARENT") return;

			// Dash styles
			edge.dashes = true;
			edge.color = { color: "#3d3d3d" };
			edge.font = {
				color: "#848484",
				background: "#111111",
				strokeWidth: 0,
			};

			const current = graphData.get();
			const currentEdges = current.edges;

			let key: string;
			if (edge.label.trim() === "ALTERNATIVE") {
				const minId = Math.min(edge.from, edge.to!);
				const maxId = Math.max(edge.from, edge.to!);
				key = `${minId}-${maxId}-${edge.label}`;
			} else {
				key = `${edge.from}-${edge.to}-${edge.label}`;
			}

			const exists = currentEdges.some((e) => {
				if (edge.label.trim() === "ALTERNATIVE") {
					const minId = Math.min(e.from, e.to ?? 1e9);
					const maxId = Math.max(e.from, e.to ?? 1e9);
					return `${minId}-${maxId}-${e.label}` === key;
				}
				return e.from === edge.from && e.to === edge.to && e.label === edge.label;
			});

			if (!exists) {
				graphData.set({
					...current,
					edges: [...currentEdges, edge],
					ready: false,
				});
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
							queued.set(Array.from(new Set([...queued.get(), node.id])));
						}
					}
				}
			}
		}

		async function walkRelations(media: $app.AL_BaseAnime) {
			if (fetching.get()) {
				console.log("[Ext<AnilistWatchOrder>]: (log) Avoiding parallel call");
				return;
			}

			// Start fetching
			fetching.set(true);
			graphData.set({ nodes: [], edges: [], mediaId: media.id, ready: false });

			// Check cache
			const cache = $store.get(CACHED_RESULTS) as RelationsCache[];
			const cacheEntry = cache.find((e) => e.family.includes(media.id));

			if (cacheEntry) {
				console.log("[Ext<AnilistWatchOrder>]: (log) Cache hit for media.id:", media.id);
				graphData.set({
					nodes: cacheEntry.nodes,
					edges: cacheEntry.edges,
					mediaId: media.id,
					ready: true,
				});
				fetching.set(false);
				return;
			}

			// No cache, fetch
			$store.set("now", Date.now());
			queued.set([media.id]);
			seen.set([]);
			fetched.set([]);

			// add current media to node
			addNode(media);

			do {
				const list = await fetchMediaBulk(queued.get()).catch((e: Error) => e.message);

				// Monitor api calls
				calls.set(calls.get() + 1);
				await delay(500);
				if (typeof list === "string") {
					button.setStyle(buttonStyle);
					ctx.toast.error(`An error occured while performing a recursive operation: ${list}`);
					fetching.set(false);
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
							queued.set(Array.from(new Set([...queued.get(), media.id])));
						}
					}
				}
			} while (queued.get().length > 0);

			// Diagnostics (Monitor API Health)
			const elapsed = ((Date.now() - $store.get("now")) / 1000).toFixed(2);
			console.log(`Performed ${calls.get()} API calls in ${elapsed} seconds!`);

			// Get final data
			const finalData = graphData.get();

			// Cache this result
			$store.set(CACHED_RESULTS, [
				...$store.get(CACHED_RESULTS),
				{
					family: fetched.get(),
					edges: finalData.edges,
					nodes: finalData.nodes,
				},
			]);

			// Mark as ready and set final mediaId
			graphData.set({
				...finalData,
				mediaId: currentMediaId.get(),
				ready: true,
			});

			// Reset API calls monitor
			calls.set(0);
			fetching.set(false);
		}

		async function handleButtonPress(e: { media: $app.AL_BaseAnime }) {
			currentMediaId.set(e.media.id);
			isOpen.set(true);

			await walkRelations(e.media);
		}

		ctx.effect(() => {
			// Update button loading state
			button.setLoading(fetching.get());
			button.setTooltipText(fetching.get() ? "Fetching relations data..." : "Watch Order");
			button.setStyle({
				...buttonStyle,
				...(fetching.get()
					? {
							backgroundImage: "",
							textIndent: "",
						}
					: {}),
			});
		}, [fetching]);

		// When users navigate to other page
		ctx.screen.onNavigate(async (e) => {
			// isOpen.set(false); // comment to leave open
			if (e.pathname === "/entry" && !!e.searchParams.id) {
				const newMediaId = parseInt(e.searchParams.id) || null;
				const previousMediaId = currentMediaId.get();

				if (newMediaId && newMediaId !== previousMediaId) {
					currentMediaId.set(newMediaId);

					// devnote: won't happen
					// If the webview is open, fetch data for the new media
					if (isOpen.get()) {
						const entry = await ctx.anime.getAnimeEntry(newMediaId);
						if (entry && entry.media) {
							await walkRelations(entry.media);
						}
					}
				}
			} else {
				isOpen.set(false);
				currentMediaId.set(null);
			}
		});

		ctx.dom.onReady(() => {
			console.log(ctx.dom.viewport.getSize());
		});

		ctx.dom.viewport.onResize((v) => {
			console.log("onResize", v);
		});

		button.onClick(handleButtonPress);

		ctx.screen.loadCurrent();
	});
}
