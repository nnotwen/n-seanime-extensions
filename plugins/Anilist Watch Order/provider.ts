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
				edge = { from: toId, to: fromId, label: normalizeString("SEQUEL"), arrows: "to" };
			} else {
				edge = { from: fromId, to: toId, label: normalizeString(relationType), arrows: "to" };
			}

			// Skip adding parent
			if (relationType === "PARENT") return;

			// Dash styles
			(edge as any).dashes = true;
			(edge as any).color = { color: "#3d3d3d" };
			(edge as any).font = {
				color: "#848484",
				background: "#111111",
				strokeWidth: 0,
			};

			const currentEdges = edges.get();

			let key: string;
			if (edge.label.trim() === "ALTERNATIVE") {
				const minId = Math.min(edge.from, edge.to);
				const maxId = Math.max(edge.from, edge.to);
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

			if (fetching.get()) {
				console.log("[Ext<AnilistWatchOrder>]: (log) Avoiding parallel call");
				return;
			}

			$store.set("now", Date.now());
			queued.set([media.id]);
			seen.set([]);
			nodes.set([]);
			edges.set([]);
			fetching.set(true);

			// add current media to node
			addNode(media);

			do {
				const list = await fetchMediaBulk(queued.get()).catch((e: Error) => e.message);

				// Monitor api calls
				calls.set(calls.get() + 1);
				await delay(2_000);
				if (typeof list === "string") {
					button.setStyle(buttonStyle);
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
						container.className = "sm:max-w-5xl lg:m-[10px] transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-500 data-[state=open]:duration-500 focus:outline-none focus-visible:outline-none select-none data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right rounded-[--radius]";
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
						dismissBtn.addEventListener("click", () => {
							container.setAttribute("data-state", "closed");
							setTimeout(() => container.remove(), 400); // match duration
						});
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
						spinner.className = "UI-Skeleton__root animate-pulse rounded-[--radius-md] bg-[--subtle] w-full h-full flex justify-center items-center flex-col space-y-4";

						const spinIcon = document.createElement("div");
						spinIcon.className = "UI-LoadingSpinner__container flex flex-col w-full items-center h-24 justify-center";

						// build the SVG
						const spinSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
						spinSVG.setAttribute("stroke", "currentColor");
						spinSVG.setAttribute("fill", "currentColor");
						spinSVG.setAttribute("stroke-width", "0");
						spinSVG.setAttribute("version", "1.1");
						spinSVG.setAttribute("viewBox", "0 0 16 16");
						spinSVG.setAttribute("class", "size-14 lg:size-20 text-white animate-spin");
						spinSVG.setAttribute("height", "1em");
						spinSVG.setAttribute("width", "1em");
						spinSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");

						const spinPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
						spinPath.setAttribute("d","M16 8c-0.020-1.045-0.247-2.086-0.665-3.038-0.417-0.953-1.023-1.817-1.766-2.53s-1.624-1.278-2.578-1.651c-0.953-0.374-1.978-0.552-2.991-0.531-1.013 0.020-2.021 0.24-2.943 0.646-0.923 0.405-1.758 0.992-2.449 1.712s-1.237 1.574-1.597 2.497c-0.361 0.923-0.533 1.914-0.512 2.895 0.020 0.981 0.234 1.955 0.627 2.847 0.392 0.892 0.961 1.7 1.658 2.368s1.523 1.195 2.416 1.543c0.892 0.348 1.851 0.514 2.799 0.493 0.949-0.020 1.89-0.227 2.751-0.608 0.862-0.379 1.642-0.929 2.287-1.604s1.154-1.472 1.488-2.335c0.204-0.523 0.342-1.069 0.415-1.622 0.019 0.001 0.039 0.002 0.059 0.002 0.552 0 1-0.448 1-1 0-0.028-0.001-0.056-0.004-0.083h0.004zM14.411 10.655c-0.367 0.831-0.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434c-0.832 0.323-1.723 0.476-2.608 0.454-0.884-0.020-1.759-0.215-2.56-0.57-0.801-0.354-1.526-0.867-2.125-1.495s-1.071-1.371-1.38-2.173c-0.31-0.801-0.457-1.66-0.435-2.512s0.208-1.694 0.551-2.464c0.342-0.77 0.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c0.771-0.298 1.596-0.438 2.416-0.416s1.629 0.202 2.368 0.532c0.74 0.329 1.41 0.805 1.963 1.387s0.988 1.27 1.272 2.011c0.285 0.74 0.418 1.532 0.397 2.32h0.004c-0.002 0.027-0.004 0.055-0.004 0.083 0 0.516 0.39 0.94 0.892 0.994-0.097 0.544-0.258 1.075-0.481 1.578z");
						spinSVG.appendChild(spinPath);
						spinIcon.appendChild(spinSVG);

						const spinText = document.createElement("div");
						spinText.className = "text-center text-xs lg:text-sm";
						spinText.innerHTML = "<p>Loading relations data. This won't take long...</p>";

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
						container.setAttribute("data-state", "open");
						container.appendChild(header);
						container.appendChild(body);
						document.body.appendChild(container);
					}
				})();
			`);

			await walkRelations(e.media);

			// Poll until fetching is false
			while (fetching.get()) {
				await delay(100); // check every 100ms
			}

			const dataScript = await ctx.dom.createElement("script");
			dataScript.setAttribute("data-relations-graph-data", "true");
			dataScript.setText(`
				(function () {
					const nodesData = ${JSON.stringify(nodes.get())};
					const edgesData = ${JSON.stringify(edges.get())};
					const graphArea = document.getElementById("graph-area");
					if (!graphArea) return;

					const g = new dagre.graphlib.Graph();
					g.setGraph({ rankdir: "LR" });
					g.setDefaultEdgeLabel(() => ({}));

					nodesData.forEach(n => {
						g.setNode(n.id, { width: 250, height: 100 });
					});

					edgesData.forEach(e => {
						g.setEdge(e.from, e.to)
					});

					dagre.layout(g)

					nodesData.forEach(n => {
						const pos = g.node(n.id);
						n.x = pos.x;
						n.y = pos.y;
						n.fixed = { x: true, y: true };
					});

					graphArea.innerHTML = ""; // clear loading

					const nodes = new vis.DataSet(nodesData);
					const edges = new vis.DataSet(edgesData);
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

					const network = new vis.Network(graphArea, data, options);
					network.selectNodes([${e.media.id}]);

					network.once("afterDrawing", () => {
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
							marker.setAttribute("data-clicked", "true");
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
			const dagreScript = await ctx.dom.createElement("script");
			const visScript = await ctx.dom.createElement("script");
			const visStyles = await ctx.dom.createElement("style");
			const head = await ctx.dom.queryOne("head");
			dagreScript.setAttribute("src", "https://unpkg.com/dagre/dist/dagre.min.js");
			visScript.setAttribute("src", "https://unpkg.com/vis-network/standalone/umd/vis-network.min.js");
			visStyles.setAttribute("href", "https://unpkg.com/vis-network/styles/vis-network.min.css");
			visStyles.setAttribute("rel", "stylesheet");
			visStyles.setAttribute("type", "text/css");

			head?.append(dagreScript);
			head?.append(visScript);
			head?.append(visStyles);

			button.onClick(handleButtonPress);
		});

		ctx.dom.observe("#franchise-navigate-marker", (elements) => {
			if (!currentMediaId.get()) return;
			const id = elements[0]?.attributes["data-id"];
			const clicked = elements[0]?.attributes["data-clicked"];
			if (id && clicked === "true") {
				ctx.screen.navigateTo("/entry", { id });
				elements[0]?.setAttribute("data-clicked", "false");
			}
		});

		ctx.screen.loadCurrent();
	});
}
