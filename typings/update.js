const https = require("https");
const path = require("path");
const fs = require("fs");

const CONFIG = {
	owner: "5rahim",
	repo: "seanime",
	branch: "main",
	sourceDir: "internal/extension_repo/goja_plugin_types",
	files: ["app.d.ts", "core.d.ts", "plugin.d.ts", "system.d.ts"],
	retries: 3,
	timeout: 10_000,
};

const currentDir = path.dirname(process.argv[1]);

function downloadFile(filename, attempt = 1) {
	const rawUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${CONFIG.sourceDir}/${filename}`;

	return new Promise((resolve, reject) => {
		console.log(
			`[Attempt ${attempt}/${CONFIG.retries}] Downloading: ${filename}...`,
		);

		const request = https.get(
			rawUrl,
			{ timeout: CONFIG.timeout },
			(response) => {
				// Handle redirects
				if (response.statusCode === 301 || response.statusCode === 302) {
					console.log(`→ Redirecting to: ${response.headers.location}`);
					return downloadFile(response.headers.location, attempt)
						.then(resolve)
						.catch(reject);
				}

				// Check for successful response
				if (response.statusCode !== 200) {
					if (attempt < CONFIG.retries) {
						console.log(
							`⚠️  Attempt ${attempt} failed (HTTP ${response.statusCode}), retrying...`,
						);
						setTimeout(() => {
							downloadFile(filename, attempt + 1)
								.then(resolve)
								.catch(reject);
						}, 1000 * attempt); // Exponential backoff
					} else {
						reject(
							new Error(
								`Failed after ${CONFIG.retries} attempts: HTTP ${response.statusCode}`,
							),
						);
					}
					return;
				}

				let data = [];
				response.on("data", (chunk) => data.push(chunk));
				response.on("end", () => {
					const content = Buffer.concat(data).toString("utf8");
					console.log(`✅ Downloaded: ${filename} (${content.length} bytes)`);
					resolve(content);
				});
			},
		);

		request.on("error", (err) => {
			if (attempt < CONFIG.retries) {
				console.log(
					`⚠️  Attempt ${attempt} failed (${err.message}), retrying...`,
				);
				setTimeout(() => {
					downloadFile(filename, attempt + 1)
						.then(resolve)
						.catch(reject);
				}, 1000 * attempt);
			} else {
				reject(
					new Error(
						`Network error after ${CONFIG.retries} attempts: ${err.message}`,
					),
				);
			}
		});

		request.on("timeout", () => {
			request.destroy();
			if (attempt < CONFIG.retries) {
				console.log(`⚠️  Attempt ${attempt} timed out, retrying...`);
				setTimeout(() => {
					downloadFile(filename, attempt + 1)
						.then(resolve)
						.catch(reject);
				}, 1000 * attempt);
			} else {
				reject(new Error(`Timeout after ${CONFIG.retries} attempts`));
			}
		});
	});
}

async function downloadAllFiles() {
	console.log(
		`Starting download of .d.ts files from ${CONFIG.repo} repository...\n`,
	);
	console.log(`Source: ${CONFIG.owner}/${CONFIG.repo}/${CONFIG.sourceDir}`);
	console.log(`Destination: ${currentDir}`);
	console.log(`Max retries: ${CONFIG.retries}\n`);

	const results = [];

	for (const filename of CONFIG.files) {
		try {
			const content = await downloadFile(filename);
			const filePath = path.join(currentDir, filename);

			const fileExists = fs.existsSync(filePath);
			if (fileExists) {
				const stats = fs.statSync(filePath);
				console.log(
					`⚠️  Overwriting existing file: ${filename} (${stats.size} bytes)`,
				);
			}

			// Write file
			fs.writeFileSync(filePath, content, "utf8");
			console.log(
				`✔️  Saved: ${filename}${fileExists ? " (overwrote)" : ""}\n`,
			);

			results.push({ filename, success: true });
		} catch (error) {
			console.error(`❌  Failed to download ${filename}:`, error.message, "\n");
			results.push({ filename, success: false, error: error.message });
		}
	}

	// Summary
	console.log("=".repeat(60));
	console.log("📊 DOWNLOAD SUMMARY");
	console.log("=".repeat(60));

	const successful = results.filter((r) => r.success).length;
	const failed = results.filter((r) => !r.success).length;

	console.log(`✔️  Successful downloads: ${successful}`);
	if (failed > 0) {
		console.log(`❌ Failed downloads: ${failed}`);
		console.log("\nFailed files:");
		results
			.filter((r) => !r.success)
			.forEach((r) => {
				console.log(`   - ${r.filename}: ${r.error}`);
			});
	}

	console.log(`\n📁 Files saved in: ${currentDir}`);

	if (successful === CONFIG.files.length) {
		console.log("\n✔️  All files downloaded successfully!");
	} else {
		console.log(
			"\n⚠️  Some files failed to download. Check your internet connection and verify the files exist in the repository.",
		);
	}
	console.log("=".repeat(60));
}

// Run the download
downloadAllFiles().catch(console.error);
