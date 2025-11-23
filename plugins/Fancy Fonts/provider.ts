/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />
/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />

function init() {
	$ui.register(async (ctx) => {
		// prettier-ignore
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/Fancy%20Fonts/icon.png";
		const fontStorageId = "fancy-fonts";

		interface AppFont {
			type: "app";
		}

		interface SystemFont {
			type: "system";
		}

		interface PluginCustomFont {
			type: "plugin-custom";
			uuid: string;
		}

		interface ExternalFont {
			type: "plugin-external";
			url: string;
			scale: string;
			uid: string;
		}

		enum UUID {
			app = "0",
			system = "1",
		}

		type StoredFont = AppFont | SystemFont | PluginCustomFont | ExternalFont;

		const FONT_DEFAULT = "Inter, sans-serif";
		const FONT_SYSTEM = "sans-serif";

		// States
		const isExternalSource = ctx.fieldRef<boolean>(false);
		const defaultFontUUID = ctx.fieldRef<string>("0");
		const applyBtnlabel = ctx.state("Apply");
		const validateBtnLabel = ctx.state("Validate");

		// External font validated URL state
		const externalSrcURL = ctx.fieldRef<string>("");
		const externalSrcFontFamily = ctx.state<string>("");
		const externalSrcFontScale = ctx.state<string>("initial");

		const previewFontFamily = ctx.state<string>(FONT_DEFAULT);
		const previewFontSizeAdjust = ctx.state<string>("initial");

		// Is the extension currently applying the specified font
		const isBusy = ctx.state<boolean>(false);
		const isValidated = ctx.state<boolean>(false);

		// DEFAULT FONTS: Use latin fonts
		// prettier-ignore
		const DEFAULT_FONTS: { family: string; src: string; scale: string; uuid: string }[] = [
			{
				family: "Caveat",
				src: "https://fonts.gstatic.com/s/caveat/v23/Wnz6HAc5bAfYB2Q7ZjYY.woff2",
				scale: "0.55",
				uuid: "7bf6a1c1-bf21-4b75-b5f0-8a3c0153971a",
			},
			{
				family: "Comfortaa",
				src: "https://fonts.gstatic.com/s/comfortaa/v47/1Ptsg8LJRfWJmhDAuUs4TYFq.woff2",
				scale: "0.5",
				uuid: "72d9d59e-f4ed-490b-9905-b2a7780f2f65",
			},
			{
				family: "Geo",
				src: "https://fonts.gstatic.com/s/geo/v23/CSRz4zRZluflKHpn.woff2",
				scale: "0.55",
				uuid: "8d17e5d4-dbf4-4aa6-8e6b-9d7ee7527dc9",
			},
			{
				family: "Julee",
				src: "https://fonts.gstatic.com/s/julee/v26/TuGfUVB3RpZPQ5ZMq9k.woff2",
				scale: "0.2",
				uuid: "57b65ce6-184b-4b70-8be0-21038b1d22e9",
			},
			{
				family: "Manslava",
				src: "https://fonts.gstatic.com/s/mansalva/v16/aWB4m0aacbtDfvq5NKliKY8.woff2",
				scale: "0.45",
				uuid: "de25a9cb-f03b-49f9-9c13-9d8e210e8f20"
			},
			{
				family: "McLaren",
				src: "https://fonts.gstatic.com/s/mclaren/v19/2EbnL-ZuAXFqZFXIeYEV8g.woff2",
				scale: "initial",
				uuid: "5bc4d021-dfc8-4379-a749-741852513771",
			},
			{
				family: "Rancho",
				src: "https://fonts.gstatic.com/s/rancho/v22/46kulbzmXjLaqZRVam_h.woff2",
				scale: "0.6",
				uuid: "82d6bd3e-0570-4593-ba6c-00dbd97f8ade",
			},
			{
				family: "Saira",
				src: "https://fonts.gstatic.com/s/saira/v23/memjYa2wxmKQyPMrZX79wwYZQMhsyuSLiIvS.woff2",
				scale: "initial",
				uuid: "1da0b842-29b2-44f9-8cbc-8c6f1dab33c7",
			},
			{
				family: "Schoolbell",
				src: "https://fonts.gstatic.com/s/schoolbell/v18/92zQtBZWOrcgoe-fgnJIZxUa6w.woff2",
				scale: "0.58",
				uuid: "aa84b78c-606d-4380-9e4f-dc78528f8f7b",
			},
			{
				family: "Sniglet",
				src: "https://fonts.gstatic.com/s/sniglet/v18/cIf9MaFLtkE3UjaJ9C6hYQ.woff2",
				scale: "0.55",
				uuid: "5b0aa088-4f40-4765-8f76-3bc7fc85f1d2"
			},
		];

		function getDefaultFontFromUUID(uuid: string) {
			return DEFAULT_FONTS.find((f) => f.uuid === uuid);
		}

		const FONT_FORMAT_MAP = {
			woff: "woff",
			woff2: "woff2",
			ttf: "truetype",
			otf: "opentype",
			eot: "embedded-opentype",
		} as const;

		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		type FontFormat = (typeof FONT_FORMAT_MAP)[keyof typeof FONT_FORMAT_MAP];
		function getFontFormat(src: string): FontFormat | undefined {
			const ext = src.split(".").pop()?.toLowerCase();
			// prettier-ignore
			return ext ? FONT_FORMAT_MAP[ext as keyof typeof FONT_FORMAT_MAP] : undefined;
		}

		// Validate font url
		async function validateFont(url: string) {
			const res = await ctx.fetch(url, { method: "HEAD" });
			// prettier-ignore
			const size = res.headers["content-length"] || res.headers["Content-Length"];
			const type = res.headers["content-type"] || res.headers["Content-Type"];

			const validFontTypes = [
				"font/woff",
				"font/woff2",
				"font/ttf",
				"application/x-font-ttf",
				"font/otf",
				"application/x-font-opentype",
				"application/vnd.ms-fontobject",
			];

			if (!validFontTypes.includes(type.toLowerCase())) {
				return { isFont: false, size: parseInt(size, 10) };
			}
			return { isFont: true, size: parseInt(size, 10) };
		}

		function isValidHttpUrl(str: string): boolean {
			try {
				const url = new URL(str);
				return url.protocol === "http:" || url.protocol === "https:";
			} catch {
				return false;
			}
		}

		// Register the font to the app
		async function registerFont(family: string, src: string) {
			const style = await ctx.dom.createElement("style");
			const format = getFontFormat(src);
			// prettier-ignore
			style.setInnerHTML(`@font-face { font-family: "${family}"; src: url("${src}") format("${format}");}`);
		}

		// Apply font
		async function applyFont(family: string, scale: string = "initial") {
			const body = await ctx.dom.queryOne("body");

			if (!body) return;
			// Fallback to Inter when family is unreadable
			// Particularly useful for extension uninstall
			body.setStyle("font-family", `${family}, Inter`);
			body.setStyle("font-size-adjust", scale);
		}

		function applyDefaultUUIDtoPreview(uuid: string) {
			if (uuid == UUID.app) {
				previewFontFamily.set(FONT_DEFAULT);
				previewFontSizeAdjust.set("initial");
				return;
			}

			if (uuid == UUID.system) {
				previewFontFamily.set(FONT_SYSTEM);
				previewFontSizeAdjust.set("initial");
				return;
			}

			const font = getDefaultFontFromUUID(uuid);
			if (!font) return;

			previewFontFamily.set(font.family);
			previewFontSizeAdjust.set(font.scale);
		}

		function buildFontPreview() {
			const previewText = "Sphinx of black quartz, judge my vow.";
			return tray.text(previewText, {
				// prettier-ignore
				className: "bg-gray-900 border border-[rgb(255_255_255_/_5%)] rounded-xl text-center",
				style: {
					padding: "25px 0",
					fontSize: "1.5em",
					fontWeight: "500",
					color: "#666",
					wordBreak: "unset",
					fontFamily: previewFontFamily.get(),
					fontSizeAdjust: previewFontSizeAdjust.get(),
				},
			});
		}

		async function runOnceOnInit() {
			// Register fonts for preview;
			for (const dfont of DEFAULT_FONTS) {
				await registerFont(dfont.family, dfont.src);
			}

			const font: StoredFont | undefined = $storage.get(fontStorageId);
			if (!font || font.type === "app") return;

			if (font.type === "system") {
				applyFont("sans-serif");
				defaultFontUUID.setValue("1");
				return;
			}

			if (font.type === "plugin-custom") {
				const dfont = getDefaultFontFromUUID(font.uuid);
				if (!dfont) return;

				defaultFontUUID.setValue(dfont.uuid);

				await applyFont(dfont.family, dfont.scale);
				return;
			}

			if (font.type === "plugin-external") {
				const { isFont } = await validateFont(font.url);
				if (!isFont) {
					// prettier-ignore
					ctx.toast.error("[Fancy Fonts]: The saved font URL is no longer valid. Please update your settings. Reverting to default font.");
					return;
				}

				isExternalSource.setValue(true);
				externalSrcURL.setValue(font.url);
				await registerFont(font.uid, font.url);
				await applyFont(font.uid, font.scale);
			}
		}

		const tray = ctx.newTray({ iconUrl, withContent: true });
		tray.render(() => {
			const pluginIcon = tray.div([], {
				style: {
					width: "2.5em",
					height: "2.5em",
					backgroundImage: `url(${iconUrl})`,
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					flexGrow: "0",
					flexShrink: "0",
				},
			});

			const header_text = tray.text("Fancy Fonts", {
				style: {
					fontSize: "1.2em",
					"font-weight": "700",
					"user-select": "none",
				},
			});

			const text_helper = tray.text("Cusomize your app font~", {
				style: {
					fontSize: "13px",
					color: "#666",
					lineHeight: "normal",
					wordBreak: "unset",
					"user-select": "none",
					fontWeight: "500",
				},
			});

			const header = tray.flex(
				[pluginIcon, tray.stack([header_text, text_helper], { gap: 1 })],
				{ direction: "row", gap: 3, style: { padding: "10px" } }
			);

			const useFromExtSrcSelect = tray.switch(
				"Import a font from an external URL.",
				{
					fieldRef: isExternalSource,
					disabled: isBusy.get(),
					onChange: ctx.eventHandler(`src-sel-change`, (e) => {
						isExternalSource.setValue(e.value);

						if (e.value === false) {
							// Reset preview to default font
							applyDefaultUUIDtoPreview(defaultFontUUID.current);
						} else {
							isValidated.set(false);
						}

						tray.update();
					}),
					size: "lg",
					style: {},
				}
			);

			const defaultFontsSelect = tray.select({
				label: "Select from one of the following fonts",
				disabled: isBusy.get(),
				fieldRef: defaultFontUUID,
				options: [
					{
						label: "Default (Inter)",
						value: "0",
					},
					{
						label: "System Font",
						value: "1",
					},
					...DEFAULT_FONTS.map((f, i) => ({
						label: f.family,
						value: f.uuid,
					})),
				],
				onChange: ctx.eventHandler(`default-font-select`, (event) => {
					// Apply uuid to preview
					applyDefaultUUIDtoPreview(event.value);
					defaultFontUUID.setValue(event.value);

					// update tray
					tray.update();
				}),
			});

			const externalSrcInput = tray.input("Custom Font URL", {
				fieldRef: externalSrcURL,
				onChange: ctx.eventHandler(`external-url-input`, () => {
					if (isValidated.get()) {
						// Reset validation state
						isValidated.set(false);
						externalSrcFontFamily.set("");
						externalSrcFontScale.set("initial");
					}
				}),
			});

			const applyBtn = tray.button({
				label: applyBtnlabel.get(),
				intent: "primary",
				disabled: isExternalSource.current && !isValidated.get(),
				loading: !isExternalSource.current && isBusy.get(),
				onClick: ctx.eventHandler("save", async () => {
					isBusy.set(true);
					applyBtnlabel.set("Applying");

					await $_wait(3_000);
					// check if using custom source
					const isCustom = isExternalSource.current;
					const fontUUID = defaultFontUUID.current;

					if (isCustom) {
						// apply the custom font
						const uid = externalSrcFontFamily.get();
						const url = externalSrcURL.current;
						const scale = externalSrcFontScale.get();
						const type = "plugin-external";

						await applyFont(uid, scale);
						$storage.set(fontStorageId, { type, url, scale, uid });
					} else {
						// apply the preconfigured fonts
						if (fontUUID == UUID.app) {
							await applyFont(FONT_DEFAULT);
							$storage.set(fontStorageId, { type: "app" });
						} else if (fontUUID == UUID.system) {
							await applyFont(FONT_SYSTEM);
							$storage.set(fontStorageId, { type: "system" });
						} else {
							const font = getDefaultFontFromUUID(fontUUID);
							if (!font) return ctx.toast.error("Error! Unknown font UUID");

							await applyFont(font.family, font.scale);
							$storage.set(fontStorageId, {
								type: "plugin-custom",
								uuid: font.uuid,
							} as StoredFont);
						}
					}

					isBusy.set(false);
					applyBtnlabel.set("Apply");
					ctx.toast.success("Font applied successfully!");
				}),
				style: {
					flex: "1",
				},
			});

			const validateBtn = tray.button({
				label: validateBtnLabel.get(),
				intent: "success",
				loading: isBusy.get(),
				disabled: isValidated.get(),
				style: {
					flex: "1",
				},
				onClick: ctx.eventHandler("validate-ext-font", async () => {
					const url = externalSrcURL.current.trim();

					if (!url.length) {
						const error = "Please enter a URL.";
						return ctx.toast.error(error);
					}

					if (isValidHttpUrl(url) === false) {
						const error = "The URL provided is not a valid HTTP/HTTPS URL.";
						return ctx.toast.error(error);
					}

					isBusy.set(true);
					validateBtnLabel.set("Validating...");

					const { isFont, size } = await validateFont(url);
					await $_wait(2000);

					if (!isFont) {
						// prettier-ignore
						const error = "The URL provided does not point to a valid font file.";
						await $_wait(2000);
						isBusy.set(false);
						validateBtnLabel.set("Validate");
						return ctx.toast.error(error);
					}

					isValidated.set(true);
					isBusy.set(false);
					validateBtnLabel.set("Validate");

					const fontFamily = "CustomFont";

					// register font for preview
					registerFont(fontFamily, url);

					// set values for external srcs
					externalSrcFontFamily.set(fontFamily);
					externalSrcFontScale.set("initial");

					// update preview
					previewFontFamily.set(externalSrcFontFamily.get());
					previewFontSizeAdjust.set(externalSrcFontScale.get());

					// prettier-ignore
					ctx.toast.success(`The font URL is valid! (Size: ${(size/1024).toFixed(2)} KB) `);
				}),
			});

			const btnGroup = tray.flex([validateBtn, applyBtn], {
				direction: "row",
			});

			const body = tray.flex(
				[
					useFromExtSrcSelect,
					isExternalSource.current
						? [
								externalSrcInput,
								isValidated.get() ? buildFontPreview() : [],
								btnGroup,
						  ]
						: [
								defaultFontsSelect,
								buildFontPreview(),
								tray.flex([applyBtn], { direction: "row" }),
						  ],
				],
				{ direction: "column" }
			);

			return tray.stack([header, body], {});
		});

		tray.onClose(() => {
			// Sync tray options to saved profile
			const savedFont: StoredFont | undefined = $storage.get(fontStorageId);
			if (!savedFont) return;

			switch (savedFont.type) {
				case "app":
					defaultFontUUID.setValue(UUID.app);
					isExternalSource.setValue(false);
					break;
				case "system":
					defaultFontUUID.setValue(UUID.system);
					isExternalSource.setValue(false);
					break;
				case "plugin-custom":
					defaultFontUUID.setValue(savedFont.uuid);
					isExternalSource.setValue(false);
					break;
				case "plugin-external":
					defaultFontUUID.setValue(UUID.app /*reset*/);
					isExternalSource.setValue(true);
			}

			applyDefaultUUIDtoPreview(defaultFontUUID.current);
		});

		// Initialize when DOM is ready
		ctx.dom.onReady(runOnceOnInit);
	});
}
