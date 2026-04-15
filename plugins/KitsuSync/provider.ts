/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./kitsusync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/KitsuSync/icon.png";
		const tray = ctx.newTray({
			iconUrl,
			withContent: true,
			width: "30rem",
		});

		const icons = {
			html: {
				anilist: /*html*/ `
					<svg fill="#cacaca" width="1rem" height="1rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path d="M6.361 2.943 0 21.056h4.942l1.077-3.133H11.4l1.052 3.133H22.9c.71 0 1.1-.392 1.1-1.101V17.53c0-.71-.39-1.101-1.1-1.101h-6.483V4.045c0-.71-.392-1.102-1.101-1.102h-2.422c-.71 0-1.101.392-1.101 1.102v1.064l-.758-2.166zm2.324 5.948 1.688 5.018H7.144z"/>
					</svg>`,
				arrow_lr: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
					</svg>`,
				arrow_r: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
					</svg>`,
				back: /*html*/ `
					<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 256 256" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a8 8 0 0 1-8 8h-60.69l18.35 18.34a8 8 0 0 1-11.32 11.32l-32-32a8 8 0 0 1 0-11.32l32-32a8 8 0 0 1 11.32 11.32L107.31 120H168a8 8 0 0 1 8 8" stroke="none"/>
					</svg>`,
				bell: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
						<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
						<path d="M4 2C2.8 3.7 2 5.7 2 8"></path>
						<path d="M22 8c0-2.3-.8-4.3-2-6"></path>
					</svg>`,
				book: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
					</svg>`,
				check2all: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/>
						<path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
					</svg>`,
				close: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
					</svg>`,
				code: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/>
					</svg>`,
				delete: /*html*/ `
					<svg stroke="#fca5a5" fill="#fca5a5" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
						<path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
					</svg>`,
				eye: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
						<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
					</svg>`,
				eye_slash: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
						<path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
						<path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
					</svg>`,
				gears: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/>
						<circle cx="12" cy="12" r="3"/>
					</svg>`,
				globe: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
					</svg>`,
				kitsu: /*html*/ `
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#cacaca">
						<path d="M1.429 5.441a12.5 12.5 0 0 0 1.916 2.056c.011.011.022.011.022.022.452.387 1.313.947 1.937 1.173 0 0 3.886 1.496 4.091 1.582a1.4 1.4 0 0 0 .237.075.694.694 0 0 0 .808-.549c.011-.065.022-.172.022-.248V5.161c.011-.667-.205-1.679-.398-2.239 0-.011-.011-.022-.011-.032A12 12 0 0 0 8.824.36L8.781.285a.697.697 0 0 0-.958-.162c-.054.032-.086.075-.129.119L7.608.36a4.74 4.74 0 0 0-.786 3.412 8 8 0 0 0-.775.463c-.043.032-.42.291-.71.56A4.8 4.8 0 0 0 1.87 4.3c-.043.011-.097.021-.14.032-.054.022-.107.043-.151.076a.7.7 0 0 0-.193.958zM8.222 1.07c.366.614.678 1.249.925 1.917q-.743.129-1.453.388a3.9 3.9 0 0 1 .528-2.305M4.658 5.463a7.5 7.5 0 0 0-.893 1.216 11.7 11.7 0 0 1-1.453-1.55 3.83 3.83 0 0 1 2.346.334m13.048-.302a7.7 7.7 0 0 0-2.347-.474 7.6 7.6 0 0 0-3.811.818l-.215.108v3.918c0 .054 0 .258-.032.431a1.54 1.54 0 0 1-.646.98 1.55 1.55 0 0 1-1.152.247 2.6 2.6 0 0 1-.409-.118 748 748 0 0 1-3.402-1.313 9 9 0 0 0-.323-.129 30.6 30.6 0 0 0-3.822 3.832l-.075.086a.698.698 0 0 0 .538 1.098.68.68 0 0 0 .42-.118c.011-.011.022-.022.043-.032 1.313-.947 2.756-1.712 4.284-2.325a.7.7 0 0 1 .818.13.704.704 0 0 1 .054.915l-.237.388a20.3 20.3 0 0 0-1.97 4.306l-.032.129a.65.65 0 0 0 .108.538.71.71 0 0 0 .549.301.66.66 0 0 0 .42-.118c.054-.043.108-.086.151-.14l.043-.065a19 19 0 0 1 1.765-2.153 20.16 20.16 0 0 1 10.797-6.018c.032-.011.065-.011.097-.011.237.011.42.215.409.452a.424.424 0 0 1-.344.398c-3.908.829-10.948 5.469-8.483 12.208.043.108.075.172.129.269a.71.71 0 0 0 .538.301.74.74 0 0 0 .657-.398c.398-.754 1.152-1.593 3.326-2.497 6.061-2.508 7.062-6.093 7.17-8.364v-.129a7.72 7.72 0 0 0-5.016-7.451m-6.083 17.762c-.56-1.669-.506-3.283.151-4.823 1.26 2.035 3.456 2.207 3.456 2.207-2.25.937-3.133 1.863-3.607 2.616"/>
					</svg>`,
				kitsu_logo: /*html*/ `
					<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="478.667" height="133.333" viewBox="0 0 359 100" fill="#cacaca">
						<path d="M25.4 2.5c-1 1.5-1.9 5-2.2 7.9-.3 4.3-.9 5.5-3.3 7.2-2.8 2-3.2 2-7.5.6-6-2-11.7-.8-12.2 2.6-.3 1.7 1.3 3.8 6 8.5 5.6 5.6 7.5 6.7 17.7 10.6 8.5 3.3 11.8 4.1 13 3.4 1.3-.9 1.6-3.3 1.6-14.9 0-14 0-14-3.5-20.9-4-8-6.7-9.4-9.6-5m5.4 7c1.6 3.5 1.6 3.5-1.4 3.5-2 0-2.5-.4-2-1.6.3-.9.6-2.2.6-3 0-2.2 1.6-1.6 2.8 1.1M11.9 22.9c1.2.7 1.1 1.2-.1 3-1.5 2.1-1.5 2.1-4.3-.9l-2.9-3h3c1.6 0 3.5.4 4.3.9"/><path d="M51.5 20c-9.7 2-9.5 1.8-9.5 12.4 0 14.6-2.5 16.2-16.4 10.8l-7.9-3.1-2.8 1.9C10.4 45.3 0 57.1 0 59.1c0 3 3.5 3.2 7.7.6 8.7-5.5 16.4-8.8 17.8-7.7 1.1.9.4 3-3.6 11.3C16.8 74 16.1 77 18.4 78.9c1.4 1.2 4.6.5 4.6-.9 0-1.9 14.5-16.1 20.9-20.4C55.6 49.8 74 42.6 76.4 45c.6.6.4 1.1-.5 1.5-.8.2-3.4 1.2-5.9 2-10.7 3.7-24.1 14.9-28.8 24-3 5.9-4 16.7-2.3 23.2 1 3.8 1.5 4.3 4 4.3 1.8 0 3.4-.9 4.8-2.8 1.2-1.7 6.8-5.3 13.5-8.7C74 81.8 83.1 74 87.1 66.3c2-4 2.4-6.2 2.4-13.8 0-7.8-.4-9.7-2.8-14.7C80.4 25 64.9 17.1 51.5 20m2.7 64.5 3.1.7-3 1.3c-1.7.7-4.9 2.9-7.1 4.9L43.3 95l-.7-3.1c-.8-4.3-.8-6.8.4-11l1-3.6 3.5 3.3c1.9 1.8 4.9 3.5 6.7 3.9m70.4-63.4-2.6 2v29c0 27.6.1 29 2 30.9 2.4 2.4 5.7 2.6 8.8.4 1.9-1.3 2.2-2.4 2.2-9.3 0-7.6 0-7.7 3.9-11.5l3.8-3.7 2.5 4.3c1.4 2.4 4 7.2 5.8 10.8s4.1 7.5 5.3 8.7c4.4 4.9 12.4 1.3 11.4-5.1-.3-1.7-3.7-9.1-7.6-16.4L152.9 48l3.4-4.3c4.8-5.9 8.7-14 8.7-18.1 0-3-.5-3.8-3.1-5.2-4.4-2.2-6.9-.8-10.9 6.2-3.2 5.7-8.2 12.8-13.4 18.9l-2.5 3-.1-12.7c0-12.5 0-12.7-2.6-14.7-1.5-1.2-3.2-2.1-3.9-2.1s-2.4.9-3.9 2.1m61.6-1.1c-1.2.5-2.7 2.1-3.2 3.5-.6 1.5-1 14.4-1 29.9 0 27.2 0 27.3 2.3 29.4 3 2.8 6.8 2.8 9.5-.1 2.2-2.3 2.2-2.9 2.2-30.9V23.1l-2.6-2c-2.9-2.3-3.8-2.4-7.2-1.1m89.6.4C267 23.6 263 29.1 263 38c0 8.5 3.2 12.6 15.5 20 3.9 2.4 7.3 4.8 7.7 5.4 1.3 1.9.9 6.3-.7 7.6-2.3 1.9-8.7 1.7-13.4-.4-5.8-2.7-9.5-1.4-9.9 3.3-.6 6.2 6.9 11 17.3 11.1 8.2 0 12.5-1.4 16.2-5.2 4-4.1 5.3-7.6 5.3-13.9 0-8.2-3.5-12.7-16.3-20.8-7.5-4.8-9.2-7.8-6.2-11.1 2.3-2.5 5.1-2.5 11.4 0 3.8 1.5 5.7 1.7 7.6 1 2.9-1.1 4.2-5.2 2.7-8.5-2.5-5.4-16.8-9-24.4-6.1m43.5-.4c-3.9 1.6-4.3 4-4.3 26.2 0 19.3.2 21.7 2.1 25.8 2.9 6.4 6.5 9.8 12.3 11.5 9.2 2.8 17.3 1.5 23.2-3.7 6.3-5.6 6.4-6.1 6.4-33.6v-25l-2.9-1.2c-3-1.2-6.6-.2-8.3 2.4-.4.6-.8 9.9-.8 20.6 0 25.8-1 28.9-9.3 29-2.7 0-4.5-.7-6.2-2.5-2.5-2.4-2.5-2.4-2.5-23.8 0-19-.2-21.7-1.7-23.5-2.2-2.5-5.1-3.3-8-2.2m-109.1 1.6c-1.5 1-2.2 2.5-2.2 4.9 0 4.7 2.9 6.5 10.2 6.5h5.8v23.8c0 23.6 0 23.9 2.3 26 3 2.8 6.8 2.8 9.5-.1 2.1-2.3 2.2-3.1 2.2-26V33h6c6.8 0 10-2.1 10-6.5 0-1.4-.9-3.4-2-4.5-1.9-1.9-3.3-2-20.8-2-15.4 0-19.2.3-21 1.6"/>
					</svg>`,
				person: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
					</svg>`,
				play: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca"  viewBox="0 0 16 16">
						<path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
						<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
					</svg>`,
				plusCircleDotted: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
					</svg>`,
				power: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f09e9f" viewBox="0 0 16 16">
						<path d="M7.5 1v7h1V1z"/>
						<path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/>
					</svg>`,
				refresh: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
						<path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
						<path d="M16 16h5v5"/>
					</svg>`,
				search: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" fill="#5a5a5a" height="512" width="512" viewBox="0 0 512 512">
						<path d="M495 466.2 377.2 348.4c29.2-35.6 46.8-81.2 46.8-130.9C424 103.5 331.5 11 217.5 11 103.4 11 11 103.5 11 217.5S103.4 424 217.5 424c49.7 0 95.2-17.5 130.8-46.7L466.1 495c8 8 20.9 8 28.9 0 8-7.9 8-20.9 0-28.8m-277.5-83.3C126.2 382.9 52 308.7 52 217.5S126.2 52 217.5 52C308.7 52 383 126.3 383 217.5s-74.3 165.4-165.5 165.4"/>
					</svg>`,
				spinner: /*html*/ `
					<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" version="1.1" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M16 8c-0.020-1.045-0.247-2.086-0.665-3.038-0.417-0.953-1.023-1.817-1.766-2.53s-1.624-1.278-2.578-1.651c-0.953-0.374-1.978-0.552-2.991-0.531-1.013 0.020-2.021 0.24-2.943 0.646-0.923 0.405-1.758 0.992-2.449 1.712s-1.237 1.574-1.597 2.497c-0.361 0.923-0.533 1.914-0.512 2.895 0.020 0.981 0.234 1.955 0.627 2.847 0.392 0.892 0.961 1.7 1.658 2.368s1.523 1.195 2.416 1.543c0.892 0.348 1.851 0.514 2.799 0.493 0.949-0.020 1.89-0.227 2.751-0.608 0.862-0.379 1.642-0.929 2.287-1.604s1.154-1.472 1.488-2.335c0.204-0.523 0.342-1.069 0.415-1.622 0.019 0.001 0.039 0.002 0.059 0.002 0.552 0 1-0.448 1-1 0-0.028-0.001-0.056-0.004-0.083h0.004zM14.411 10.655c-0.367 0.831-0.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434c-0.832 0.323-1.723 0.476-2.608 0.454-0.884-0.020-1.759-0.215-2.56-0.57-0.801-0.354-1.526-0.867-2.125-1.495s-1.071-1.371-1.38-2.173c-0.31-0.801-0.457-1.66-0.435-2.512s0.208-1.694 0.551-2.464c0.342-0.77 0.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c0.771-0.298 1.596-0.438 2.416-0.416s1.629 0.202 2.368 0.532c0.74 0.329 1.41 0.805 1.963 1.387s0.988 1.27 1.272 2.011c0.285 0.74 0.418 1.532 0.397 2.32h0.004c-0.002 0.027-0.004 0.055-0.004 0.083 0 0.516 0.39 0.94 0.892 0.994-0.097 0.544-0.258 1.075-0.481 1.578z"></path>
					</svg>`,
			},
			get(name: keyof typeof this.html, options?: { raw?: boolean; stroke?: string; fill?: string }) {
				let html = this.html[name];

				// Apply color modifications if provided
				if (options?.stroke || options?.fill) {
					html = html
						.replace(/stroke="[^"]*"/g, options?.stroke ? `stroke="${options.stroke}"` : 'stroke="none"')
						.replace(/fill="[^"]*"/g, options?.fill ? `fill="${options.fill}"` : 'fill="none"');
				}

				// Return raw HTML if requested
				if (options?.raw) return html;

				// Return as base64 data URL
				return `data:image/svg+xml;base64,${Buffer.from(html.trim(), "utf-8").toString("base64")}`;
			},
		};

		enum Tab {
			Logon = "1",
			Landing = "2",
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

		const fieldRefs = {
			email: ctx.fieldRef<string>($storage.get("kitsu.email") ?? ""),
			password: ctx.fieldRef<string>($storage.get("kitsu.password") ?? ""),
			rememberLoginDetails: ctx.fieldRef<boolean>(!!$storage.get("kitsu.email")?.length && !!$storage.get("kitsu.password")?.length),
			disableSyncing: ctx.fieldRef<boolean>(false),
			skipAdult: ctx.fieldRef<boolean>($storage.get("kitsu:options-skipAdult")?.valueOf() ?? false),
			suppressNotificationBadge: ctx.fieldRef<boolean>($storage.get("kitsu:options-suppressnotificationbadge")?.valueOf() ?? false),
			manageListJobType: ctx.fieldRef<ManageListJobType>(ManageListJobType.Import),
			manageListMediaType: ctx.fieldRef<"Anime" | "Manga">("Anime"),
			manageListSyncType: ctx.fieldRef<ManageListSyncType>(ManageListSyncType.Patch),
		};

		const state = {
			loggingIn: ctx.state<boolean>(false),
			loginError: ctx.state<string | null>(null),
			loginLabel: ctx.state<string>("Login"),
			loggingOut: ctx.state<boolean>(false),
			hidePassword: ctx.state<boolean>(true),
			syncing: ctx.state<boolean>(false),
			cancellingSync: ctx.state<boolean>(false),

			animeListSearch: ctx.state<string>(""),
			animeListFormat: ctx.state<string>("all"),
			animeListStatus: ctx.state<string>("all"),

			mangaListSearch: ctx.state<string>(""),
			mangaListFormat: ctx.state<string>("all"),
			mangaListStatus: ctx.state<string>("all"),
		};

		const notifications: $kitsusync.NotificationManager = {
			id: "925e36db-808c-415b-b2e5-330b1a6caab1",
			unreads: ctx.state<number>(0),
			get entries() {
				return this.modalOpened.get() ? ($storage.get<$kitsusync.NotificationManager["entries"]>(this.id) ?? []) : undefined;
			},
			get formattedEntry() {
				const entries = this.entries ?? [];
				const mapped = entries.map(notifications.formatEntry);
				const res = mapped.length
					? tray.div(
							[
								tray.css(/*css*/ `
								.group .group-hover\\:visible {
									visibility: hidden;
									opacity: 0;
									transition: visibility 0.2s, opacity 0.2s;
								}
								.group:hover .group-hover\\:visible {
									visibility: visible;
									opacity: 1;
								}`),
								mapped,
							],
							{ className: "flex flex-col-reverse gap-2 m-1" },
						)
					: tray.text("No Notifications", { className: "text-center p-5 text-xl font-semibold text-[--muted] border rounded-lg" });

				return [res];
			},
			modalOpened: ctx.state<boolean>(false),
			push(data) {
				$storage.set(this.id, [...($storage.get(this.id) ?? []), { ...data, unread: true, timestamp: Date.now() }]);
				this.unreads.set(this.unreads.get() + 1);
			},
			formatEntry(entry, idx: number) {
				const image =
					"payload" in entry.body
						? tray.div([tray.img({ src: unwrap(entry.body.metadata.image) ?? "", width: "50px", className: "rounded-lg" })], { className: "shrink-0" })
						: tray.div([], {
								className: "bg-center bg-fit bg-no-repeat",
								style: { width: "50px", height: "50px", backgroundImage: `url(${icons.get("gears")})`, backgroundSize: "2.25rem" },
							});

				const targetObj = "payload" in entry.body ? entry.body.payload : entry.body;
				const entries = Object.entries(targetObj);

				if ("payload" in entry.body) entries.sort(([a], [b]) => a.localeCompare(b));
				const body = entries.map(([k, v]) =>
					tray.p([
						tray.span(`${k.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:`, { className: "mr-2 text-[--muted] text-xs" }),
						tray.span(
							`${String(v)
								.replace(/_/g, " ")
								.replace(/\b\w/g, (l) => l.toUpperCase())}`,
							{ className: "font-semibold" },
						),
					]),
				);

				return tray.div(
					[
						entry.unread
							? [
									tray.div([], {
										className: "w-3 h-3 rounded-full bg-red-500 absolute border border-white",
										style: { top: "-0.1rem", right: "-0.25rem" },
									}),
									tray.div([], { className: "absolute z-[0] left-0 top-0 h-full w-full bg-gradient-to-r to-gray-900 max-w-[50%] from-yellow-900/10" }),
								]
							: [],
						tray.flex(
							[
								image,
								tray.div(
									[
										tray.text(entry.title, { className: "font-bold mb-2 break-normal line-clamp-2" }),
										tray.flex([tray.div(body, { className: "grid grid-cols-2 gap-x-2 text-sm flex-1" })]),
										tray.text(formatTimestamp(entry.timestamp), { className: "text-xs text-[--muted] mt-2" }),
									],
									{ className: "flex-1" },
								),
								tray.stack([
									tabs.button(
										{ icon: icons.get("delete"), tooltip: "Delete" },
										{
											intent: "alert-subtle",
											className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center p-0 group-hover:visible",
											onClick: ctx.eventHandler(generateRandomUUID(), (e) => {
												$storage.set(notifications.id, ($storage.get(notifications.id) ?? []).toSpliced(idx, 1));
												notifications.unreads.set(($storage.get(notifications.id) ?? []).filter((x: $kitsusync.Notification) => x.unread).length);
											}),
										},
									),
									entry.unread
										? tabs.button(
												{ icon: icons.get("check2all", { fill: "#68b695" }), tooltip: "Mark as Read" },
												{
													intent: "success-subtle",
													className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center p-0 group-hover:visible",
													onClick: ctx.eventHandler(generateRandomUUID(), () => {
														const entries = $storage.get<$kitsusync.NotificationManager["entries"]>(notifications.id);
														if (!entries) return;
														entries[idx].unread = false;
														$storage.set(notifications.id, entries);
														notifications.unreads.set(Math.max(notifications.unreads.get() - 1, 0));
													}),
												},
											)
										: [],
								]),
							],
							{ gap: 3 },
						),
					],
					{ className: `relative group p-2 rounded-lg cursor-pointer border bg-gray-900${entry.unread ? " border-yellow-400/10" : "/70"}` },
				);
			},
		};
		notifications.unreads.set(($storage.get<$kitsusync.NotificationManager["entries"]>(notifications.id) ?? []).filter((x) => x.unread).length);

		const log = {
			id: "kitsu:38a42e01-8e10-4330-b0b7-922321edffa3",
			modalOpened: ctx.state<boolean>(false),
			record(message: [string, "Info" | "Warning" | "Error" | "Log" | "Success"]) {
				$store.set(this.id, [...($store.get(this.id) ?? []), message]);
			},

			getEntries(): [string, "Info" | "Warning" | "Error" | "Log" | "Success"][] | undefined {
				return this.modalOpened.get() ? ($store.get(this.id) ?? []) : undefined;
			},

			clearEntries() {
				$store.set(this.id, []);
				this.sendInfo("Log cleared!");
			},

			dateFormat() {
				return new Date().toISOString().slice(0, 19);
			},

			sendError(message: string) {
				this.record([`${this.dateFormat()} |ERR| ${message}`, "Error"]);
			},

			sendInfo(message: string) {
				this.record([`${this.dateFormat()} |INF| ${message}`, "Info"]);
			},

			sendWarning(message: string) {
				this.record([`${this.dateFormat()} |WRN| ${message}`, "Warning"]);
			},

			sendSuccess(message: string) {
				this.record([`${this.dateFormat()} |SUC| ${message}`, "Success"]);
			},

			send(message: string) {
				this.record([`${this.dateFormat()} |DBG| ${message}`, "Log"]);
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
			connection: {
				success: ctx.state<number>(0),
				fail: ctx.state<number>(0),
				get total() {
					return this.success.get() + this.fail.get();
				},
				lastState: ctx.state<string>("--"),
			},
			userInfo: {
				id: ctx.state<string | null>(null),
				username: ctx.state<string | null>(null),
				avatar: {
					default: "https://kitsu.app/images/default_avatar-2ec3a4e2fc39a0de55bf42bf4822272a.png",
					display: ctx.state<string | null>(null),
				},
				async fetch() {
					const res: $kitsusync.KitsuUserResponse = await application.fetch("/users?filter[self]=true", { method: "GET" });
					const user = res.data[0];
					const avatar = user.attributes.avatar;

					this.id.set(user.id ?? null);
					this.username.set(user.attributes.name ?? null);
					this.avatar.display.set(avatar?.large ?? avatar?.medium ?? avatar?.small ?? avatar?.tiny ?? this.avatar.default);

					return user;
				},

				reset() {
					this.id.set(null);
					this.username.set(null);
					this.avatar.display.set(this.avatar.default);
				},
			},
			list: {
				cache: {
					get anime() {
						return $store.get("kitsu:cache:anime") as Array<
							Omit<Awaited<ReturnType<typeof application.list.fetchAll>>[number], "mediaType"> & {
								mediaType: "anime";
							}
						>;
					},
					get manga() {
						return $store.get("kitsu:cache:manga") as Array<
							Omit<Awaited<ReturnType<typeof application.list.fetchAll>>[number], "mediaType"> & {
								mediaType: "manga";
							}
						>;
					},
					animeModalOpened: ctx.state<boolean>(false),
					mangaModalOpened: ctx.state<boolean>(false),
					fetching: ctx.state<boolean>(false),
				},
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

					application.list.cache.fetching.set(true);
					log.send(`list > Fetching list (type: ${type})`);
					while (path) {
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
									posterImage: media?.attributes?.posterImage?.medium,
									mediaType: entry.relationships?.media?.data?.type,
									attributes: entry.attributes,
								});
							}

							log.send(`list > Performed fetch (path=${path})`);
							path = decodeURI(res.links?.next?.replace("https://kitsu.io/api/edge/", "") ?? "") || null;
							await $_wait(2_000);
						} catch (err) {
							log.sendError(`list > Encountered fetch error: ${(err as Error).message}`);
							throw new Error((err as Error).message);
						}
					}

					$store.set(`kitsu:cache:${type.toLowerCase()}`, all);
					application.list.cache.fetching.set(false);
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
				} as FetchOptions);

				if (!res.ok) {
					const json = res.json?.();
					throw new Error(
						json?.message ??
							json?.error ??
							json?.error_description ??
							json?.errors?.map((e: any) => `${e?.title ?? "Error"}: ${e.detail ?? "(no details)"}`).join("\n") ??
							res.statusText,
					);
				}

				if (res.ok) {
					this.connection.success.set(this.connection.success.get() + 1);
					this.connection.lastState.set(`Success (${res.status})`);
				} else {
					this.connection.fail.set(this.connection.fail.get() + 1);
					this.connection.lastState.set(`Failed (${res.status})`);
				}

				return res.json();
			},
		};

		const tabs = {
			current: ctx.state<Tab>(Tab.Logon),
			currentOverlay: ctx.state<any[] | null>(null),
			config: {
				// prettier-ignore
				logo: "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/KitsuSync/brand-logo.png",
				width: "25rem",
				height: "30rem",
			},
			overlay() {
				const overlay = this.currentOverlay.get();
				return overlay
					? tray.div([tray.flex(overlay, { style: { justifyContent: "center", alignItems: "center", width: "100%", height: "100%" } })], {
							className: `fixed rounded-lg top-0 left-0 bg-black/80 z-[50] overflow-scroll`,
							style: {
								width: "calc(100%)",
								height: "calc(100% - 1rem)",
								border: "1px solid var(--border)",
								backdropFilter: "blur(5px)",
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
					style: { backgroundImage: `url(${icons.get("close")})`, backgroundSize: "1rem" },
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
						},
					),
				]);
			},

			button(options: { icon: string; tooltip?: string }, props?: Parameters<$ui.Tray["button"]>[1]) {
				const button = tray.button("\u200b", {
					intent: "gray-subtle",
					className: "w-10 h-10 rounded-full bg-transparent bg-no-repeat bg-center p-0",
					...props,
					style: {
						backgroundSize: "1.2rem",
						paddingInlineStart: "0.5rem",
						...(props?.style ?? {}),
						...(props?.loading ? {} : { backgroundImage: `url(${options.icon})` }),
					},
				});

				return options.tooltip?.trim().length ? tray.tooltip(button, { text: options.tooltip.trim() }) : button;
			},

			spinner(size: number = 16) {
				const icon = tray.div([], {
					className: `UI-LoadingSpinner__icon inline w-${size} h-${size} mr-2 my-10 animate-spin bg-center bg-no-repeat bg-cover`,
					style: { backgroundImage: `url(${icons.get("spinner")})`, width: `calc(0.25 * ${size})`, height: `calc(0.25 * ${size})` },
				});

				return tray.flex([icon], { className: "justify-center" });
			},

			select<T>(params: {
				heading: string;
				description: string;
				options: { title: string; desc: string; icon: string; value: string }[];
				value?: T;
				fieldRef?: $ui.FieldRef<T>;
				disabled?: boolean;
				gridCols?: number;
				onChange?: (value: T) => void;
			}) {
				const card = (option: (typeof params.options)[number]) =>
					tray.div(
						[
							tray.div(
								[
									tray.div([], { className: "w-5 h-5 mt-1 bg-repeat-none bg-cover bg-center", style: { backgroundImage: `url(${option.icon})` } }),
									tray.div(
										[
											tray.text(option.title, { className: "font-medium" }),
											tray.text(option.desc, {
												className: "text-xs text-gray-600 dark:text-gray-400 break-normal",
											}),
										],
										{ className: "flex-1" },
									),
								],
								{ className: "flex items-start gap-3" },
							),
						],
						{
							className:
								"p-4 rounded-lg border cursor-pointer transition-all bg-brand-900/10" +
								((params.value !== undefined ? params.value : params.fieldRef?.current) === option.value ? " border-[--brand]" : ""),
							onClick: ctx.eventHandler(generateRandomUUID(), () => {
								params.fieldRef?.setValue(option.value as T);
								tray.update();
								params.onChange?.(option.value as T);
							}),
						},
					);

				const header = tray.div(
					[
						tray.text(params.heading, {
							className:
								"font-semibold text-[1rem] tracking-wide transition-colors duration-300 px-4 py-1 border w-fit rounded-xl bg-gray-800/40 group-hover/settings-card:bg-brand-500/10 group-hover/settings-card:text-white flex-none",
						}),
						tray.text(params.description, { className: "text-sm text-[--muted] px-4 py-2 lg:py-0 w-fit" }),
					],
					{ className: "p-0 pb-2 flex flex-col lg:flex-row items-center gap-0 mx-3 mt-3 space-y-0" },
				);

				const opts = tray.div(params.options.map(card), { className: `grid grid-cols-1 md:grid-cols-${params.gridCols || 2} gap-4 px-3 pb-3` });

				return tray.div([header, opts], {
					className:
						"border bg-[--paper] shadow-sm group/settings-card relative bg-gray-950/80 rounded-xl transition-all duration-200" +
						(params.disabled ? " opacity-50 pointer-events-none" : ""),
				});
			},

			logsModal(trigger: any) {
				return tray.modal({
					trigger,
					title: "KitsuSync Logs",
					className: "max-w-5xl",
					onOpenChange: ctx.eventHandler(generateRandomUUID(), ({ open }) => log.modalOpened.set(open)),
					items: [
						tray.button("Copy to Clipboard", {
							intent: "white",
							size: "md",
							className: "w-fit",
							onClick: ctx.eventHandler("modal:logs:clipboard", () => {
								ctx.dom.clipboard.write(
									log
										.getEntries()
										?.map(([message]) => message)
										.join("\n") ?? "",
								);
								ctx.toast.success("Copied logs to clipboard!");
							}),
						}),
						tray.div(
							[
								tray.div(
									log.getEntries()?.map(([message, type], idx) => {
										const className: Record<"Info" | "Warning" | "Error" | "Log" | "Success", string> = {
											Info: "text-blue-200 bg-gray-",
											Warning: "text-orange-500 bg-gray-",
											Error: "text-white bg-red-",
											Log: "text-[--muted] bg-gray-",
											Success: "text-green-200 bg-gray-",
										};
										return tray.text(message, {
											style: {
												fontFamily: "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
												fontSize: "16px",
											},
											className: className[type] + (idx % 2 === 0 ? "800" : "900"),
										});
									}) ?? [tabs.spinner()],
									{ className: "text-md max-h-[40rem] p-2 min-h-12 whitespace-pre-wrap break-all" },
								),
							],
							{ className: "bg-gray-900 rounded-[--radius-md] border max-w-full overflow-x-auto" },
						),
					],
				});
			},

			listGroup(type: "Anime" | "Manga") {
				return [
					tray.flex(
						[
							tray.input({
								placeholder: `Search ${type}`,
								size: "sm",
								value: state[`${type.toLowerCase() as "anime" | "manga"}ListSearch`].get(),
								disabled: application.list.cache.fetching.get(),
								className: "bg-no-repeat w-30",
								style: {
									paddingInlineStart: "2.5rem",
									backgroundImage: `url(${icons.get("search")})`,
									backgroundSize: "1rem",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "calc(0% + 0.75rem) center",
								},
								onChange: ctx.eventHandler(`kitsusync:list:${type}:search`, ({ value }) =>
									state[`${type.toLowerCase() as "anime" | "manga"}ListSearch`].set(value),
								),
							}),
							tray.select({
								label: "",
								size: "sm",
								value: state[`${type.toLowerCase() as "anime" | "manga"}ListStatus`].get(),
								disabled: application.list.cache.fetching.get(),
								className: "bg-no-repeat w-30",
								options: [
									{ label: "All status", value: "all" },
									...[...new Set((application.list.cache[type.toLowerCase() as "anime" | "manga"] ?? []).map((x) => x.attributes.status ?? "Unknown"))].map(
										(x) => ({
											label: x.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
											value: x,
										}),
									),
								],
								onChange: ctx.eventHandler(`kitsusync:list:${type}:status`, ({ value }) =>
									state[`${type.toLowerCase() as "anime" | "manga"}ListStatus`].set(value),
								),
							}),
							tray.select({
								label: "",
								size: "sm",
								value: state[`${type.toLowerCase() as "anime" | "manga"}ListFormat`].get(),
								disabled: true /*application.list.cache.fetching.get()*/,
								className: "bg-no-repeat w-30",
								options: [
									{ label: "All formats", value: "all" },
									// ...[...new Set((application.list.cache[type.toLowerCase() as "anime" | "manga"] ?? []).map((x) => x.))].map((x) => ({
									// 	label: x.replace(/_/g, " ").toUpperCase(),
									// 	value: x,
									// })),
								],
								onChange: ctx.eventHandler(`kitsusync:list:${type}:mediatype`, ({ value }) =>
									state[`${type.toLowerCase() as "anime" | "manga"}ListFormat`].set(value),
								),
							}),
							tray.div([], { className: "flex-1" }),
							tabs.button(
								{ icon: icons.get("refresh", { stroke: "#000" }), tooltip: "Refetch List" },
								{
									size: "md",
									intent: "white",
									loading: application.list.cache.fetching.get(),
									className: "bg-white bg-no-repeat bg-center p-0 w-10 h-10 rounded-lg",
									onClick: ctx.eventHandler(`kitsusync:list:${type}:refetch`, () =>
										application.list
											.fetchAll(type)
											.catch((err) => log.sendError(`[${type}List]: ${err.message}`))
											.finally(() => application.list.cache.fetching.set(false)),
									),
								},
							),
						],
						{ className: "p-2 border rounded-lg bg-gray-900 items-center" },
					),
					tray.flex(
						[
							tray.div([], { className: "shrink-0", style: { width: "50px" } }),
							tray.text("Title", { className: "w-[30rem] text-left shrink-0" }),
							tray.text("Progress"),
							tray.text("Score"),
							tray.text("Status"),
						],
						{ className: "px-3 py-2 text-center text-sm font-bold rounded-lg bg-gray-900 border" },
					),
					application.list.cache.fetching.get()
						? tray.text("Fetching list...", { className: "text-center" })
						: !application.list.cache[type.toLowerCase() as "anime" | "manga"]
							? tray.text(`An error occured while fetching ${type}`, { className: "text-center" })
							: tray.div(
									[
										tray.div(
											[
												application.list.cache[type.toLowerCase() as "anime" | "manga"]!.filter((a) => {
													const query = state[`${type.toLowerCase() as "anime" | "manga"}ListSearch`].get();
													const status = state[`${type.toLowerCase() as "anime" | "manga"}ListStatus`].get();
													const format = state[`${type.toLowerCase() as "anime" | "manga"}ListFormat`].get();

													return (
														(!query.trim().length || a.mediaTitle?.toLowerCase().includes(query.toLowerCase())) &&
														(status === "all" || a.attributes.status === status) /*&&
														(format === "all" || a.node.media_type === format)*/
													);
												})
													.sort((a, b) => (a.mediaTitle ? 0 : 1) - (b.mediaTitle ? 0 : 1) || a.mediaTitle!.localeCompare(b.mediaTitle!))
													.map(tabs.listEntry),
											],
											{ className: "max-h-[40rem] min-h-12" },
										),
									],
									{
										className: "bg-gray-900 max-w-full overflow-x-auto border rounded-lg",
									},
								),
				];
			},

			listEntry(entry: (typeof application.list.cache.anime | typeof application.list.cache.manga)[number], idx: number) {
				const episodes = entry.attributes.progress;

				return tray.flex(
					[
						tray.img({ src: entry.posterImage ?? "", width: "50", className: "rounded" }),
						tray.text(entry.mediaTitle ?? "", { className: "w-[30rem] shrink-0 line-clamp-3 text-left break-normal" }),
						tray.text(`${episodes}`),
						tray.text(`${(entry.attributes.ratingTwenty ?? 0) * 0.5} / 10`),
						tray.text(
							(entry.attributes.status ?? "Unknown").replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
							{ className: "break-normal" },
						),
						// tray.text(entry.node.media_type.replace(/_/g, " ").toUpperCase(), { className: "break-normal" }),
					],
					{ className: "p-3 text-center items-center text-sm font-semibold " + (idx % 2 === 0 ? "bg-gray-800" : "bg-gray-900") },
				);
			},

			[Tab.Logon]() {
				const css = tray.css({
					css: /*css*/ `
					a:hover { color: rgb(247 136 117); }
					.dark\\:data-\\[state\\=checked\\]\\:bg-brand[data-state=checked]:is(.dark *) {
						background-color: rgb(255 121 99 / var(--tw-bg-opacity, 1))
					}
					.focus\\:dark\\:border-gray-600:is(.dark *):focus {
						border-color: rgb(255 121 99);
						box-shadow: 0 0 0 .25rem rgb(247 81 54 / 25%);
					}
				`,
				});

				// login details
				const error = state.loginError.get()
					? tray.text(state.loginError.get() ?? "", {
							className: "break-normal bg-red-600/70 text-red-100 text-sm border border-red-500 rounded-md mb-4 px-2 py-1 line-clamp-3",
						})
					: [];

				const email = tray.input({ label: "Email", fieldRef: fieldRefs.email, disabled: state.loggingIn.get(), placeholder: "example@email.com" });

				const password = tray.div(
					[
						tray.input({
							label: "Password",
							fieldRef: fieldRefs.password,
							disabled: state.loggingIn.get(),
							style: { ...(state.hidePassword.get() ? { "-webkit-text-security": "disc" } : {}), paddingRight: "4rem" },
						}),
						tray.button("\u200b", {
							intent: "gray",
							className: "absolute bottom-0 right-0 px-3 w-12 h-10 bg-no-repeat bg-center rounded-r-md",
							disabled: state.loggingIn.get(),
							style: {
								backgroundImage: `url(${icons.get(state.hidePassword.get() ? "eye_slash" : "eye", { fill: "#fff" })})`,
								backgroundColor: "rgb(247 81 54 / var(--tw-bg-opacity, 1))",
								borderRadius: "0 0.75rem 0.75rem 0",
							},
							onClick: ctx.eventHandler("kitsu:login:pwvisibilitytoggled", () => state.hidePassword.set(!state.hidePassword.get())),
						}),
					],
					{ className: "relative w-full" },
				);

				const checkbox = tray.checkbox({
					label: "Remember me",
					size: "sm",
					disabled: state.loggingIn.get(),
					fieldRef: fieldRefs.rememberLoginDetails,
					className: "flex-1",
					style: { display: "inline" },
				});
				const passwordReset = tray.anchor({
					text: "Forgot password",
					href: "https://kitsu.app/password-reset",
					target: "_blank",
					style: { fontSize: "0.875rem", textAlign: "end", width: "fit-content" },
				});
				const passwordModifier = tray.flex([checkbox, passwordReset], { className: "w-full" });

				const login = tray.button({
					label: state.loginLabel.get(),
					intent: "gray",
					size: "md",
					loading: state.loggingIn.get(),
					style: { width: "100%", backgroundColor: "rgb(247 81 54 / var(--tw-bg-opacity, 1))" },
					onClick: ctx.eventHandler("kitsu:login", async () => {
						if (!fieldRefs.email.current.trim().length || !fieldRefs.password.current.trim().length) {
							state.loginError.set("Please enter your email/password.");
							return;
						} else {
							state.loginError.set(null);
						}

						state.loggingIn.set(true);
						state.loginLabel.set("Logging In");
						log.send("login > Logging In...");

						try {
							await application.token.login(fieldRefs.email.current, fieldRefs.password.current);
							log.sendSuccess("login > Successfully logged in!");

							log.send(`login > User opted ${fieldRefs.rememberLoginDetails.current ? "in" : "out"} to remember login details`);
							$storage.set("kitsu.email", fieldRefs.rememberLoginDetails.current ? fieldRefs.email.current : "");
							$storage.set("kitsu.password", fieldRefs.rememberLoginDetails.current ? fieldRefs.password.current : "");

							log.send("login > Fetching user info (wait 1000 ms)");
							await $_wait(1_000);
							const data = await application.userInfo.fetch();

							log.sendSuccess("login > Successfully fetched user info!");
							log.send(`login > Welcome ${data.attributes.name}!`);

							if (application.userInfo.avatar.display.get() === application.userInfo.avatar.default)
								log.sendWarning("login > Missing avatar for current user. Reverting to default...");

							tabs.current.set(Tab.Landing);
						} catch (error) {
							const message = (error as Error).message === "invalid_grant" ? "Incorrect email/password" : (error as Error).message;
							await $_wait(2_000);
							state.loginError.set(message);
							log.sendError("login > :Login failed: " + message);
						} finally {
							state.loggingIn.set(false);
							state.loginLabel.set("Login");
						}
					}),
				});

				const signup = tray.div(
					[tray.span("Don't have an account?", { className: "mr-1" }), tray.anchor({ text: "Sign-up", href: "https://kitsu.app", target: "_blank" })],
					{ className: "text-sm" },
				);

				const logs = tabs.logsModal(
					tray.button("Open Logs", {
						intent: "gray-subtle",
						size: "md",
						className: "w-full mt-4",
					}),
				);

				return tray.div([
					tray.stack(
						[
							tray.div([], {
								style: { backgroundImage: `url(${icons.get("kitsu_logo")})` },
								className: "w-full h-10 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
							}),
							tray.text("for Seanime", {
								style: { marginTop: "-8px" },
								className: "text-sm text-center text-[--muted]",
							}),
						],
						{ className: "justify-center mt-3", gap: 0 },
					),
					tray.stack([css, error, email, password, passwordModifier, login, signup, logs], {
						className: "justify-center items-center p-3",
						style: { height: "28rem" },
					}),
				]);
			},

			[Tab.Landing]() {
				const ncount = notifications.unreads.get();
				const notification = tray.modal({
					trigger: tray.div([this.button({ icon: icons.get("bell", { ...(ncount > 0 ? { stroke: "#fdba74" } : {}) }), tooltip: "Notifications" })], {
						className: ncount > 0 ? "animate-bounce" : "",
					}),
					title: "KitsuSync Notifications",
					className: "max-w-xl",
					onOpenChange: ctx.eventHandler("kitsusync:notification:modalchange", ({ open }) => notifications.modalOpened.set(open)),
					items: [
						tray.flex([
							tray.button("Mark all as Read", {
								intent: "gray-subtle",
								size: "md",
								className: "w-fit bg-transparent border",
								style: { borderColor: "var(--border)" },
								disabled: notifications.unreads.get() <= 0,
								onClick: ctx.eventHandler("kitsusync:notifications:markread", () => {
									const entries = $storage.get<$kitsusync.Notification[]>(notifications.id) ?? [];
									$storage.set(
										notifications.id,
										entries.map((e) => ({ ...e, unread: false })),
									);
									notifications.unreads.set(0);
								}),
							}),
							tray.button("Delete all", {
								intent: "alert-subtle",
								size: "md",
								className: "w-fit",
								disabled: !$storage.get(notifications.id)?.length,
								onClick: ctx.eventHandler("kitsusync:notifications:deleteall", () => {
									$storage.set(notifications.id, []);
									notifications.unreads.set(0);
								}),
							}),
						]),
						tray.div([notifications.modalOpened.get() ? notifications.formattedEntry : tabs.spinner()], { className: "max-h-[40rem] overflow-scroll" }),
					],
				});

				const profile = tray.div([
					tray.img({
						src: application.userInfo.avatar.display.get() ?? icons.get("person"),
						width: "70%",
						alt: "Profile",
						className: "absolute pointer-events-none rounded-full",
						style: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
					}),
					tray.tooltip(tray.button("\u200b", { className: "w-10 h-10 rounded-full bg-transparent ", intent: "gray-subtle" }), { text: "Profile" }),
				]);

				const profileDropdown = tray.dropdownMenu({
					trigger: profile,
					items: [
						tray.dropdownMenuItem(
							[
								tray.a({
									items: [
										tray.flex([
											tray.div([], {
												className: "w-5 h-5 bg-no-repeat bg-center",
												style: { backgroundImage: `url(${icons.get("globe")})` },
											}),
											tray.span("Open in browser"),
										]),
									],
									href: `https://kitsu.app/users/${application.userInfo.id.get()}`,
									className: "no-underline",
								}),
							],
							{ disabled: application.userInfo.username.get() === null },
						),
						tray.dropdownMenuItem(
							[
								tray.flex([
									tray.div([], {
										className: "w-5 h-5 bg-no-repeat bg-center",
										style: { backgroundImage: `url(${icons.get("power")})` },
									}),
									tray.span("Sign out"),
								]),
							],
							{
								className:
									"disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--red] border bg-red-50 bg-transparent border-transparent hover:bg-red-100 active:bg-red-200 dark:bg-opacity-10 dark:hover:bg-opacity-20",
								onClick: ctx.eventHandler("kitsu:signout:modal", () => {
									// Can't combine tray.dropdown + tray.modal yet
									tabs.confirmationModal("Sign out from KitsuSync?", "Are you sure you want to sign out?", "alert", () => {
										log.sendInfo("logout > Logging out");
										state.loggingOut.set(true);

										// $storage.remove(notifications.id);
										log.send("logout > Notifications cache cleared");

										application.token.set(null);
										log.send("logout > Removed account token");

										application.userInfo.reset();
										log.send("logout > Userinfo cache cleared");

										state.syncing.set(false);
										log.send("logout > Stopping pending/active manual sync");

										ctx.toast.success("Logged out of KitsuSync");
										log.sendSuccess("logout > Logged out of KitsuSync");

										tabs.current.set(Tab.Logon);
										state.loggingOut.set(false);
									});
								}),
							},
						),
					],
				});

				const header = tray.flex([
					tray.div(
						[
							tray.div([], { className: "bg-no-repeat bg-contain h-9", style: { backgroundImage: `url(${icons.get("kitsu_logo")})` } }),
							tray.text("for Seanime", { className: "mr-1 text-sm text-[--muted]" }),
						],
						{ className: "flex-1" },
					),
					tray.flex([notification, profileDropdown], { gap: 2 }),
				]);

				const body = tray.stack(
					[
						tray.div(
							[
								tray.text("Welcome,", { className: "font-semibold" }),
								tray.text(application.userInfo.username.get() ?? "Username", { className: "font-bold text-3xl line-clamp-1", style: { maxWidth: "25rem" } }),
							],
							{
								className: "relative rounded p-3 mb-3",
								style: { background: "linear-gradient(to right, #694E67, #433242)" },
							},
						),
						tray.div(
							[
								tabs.logsModal(
									this.button(
										{ icon: icons.get("code"), tooltip: "View Logs" },
										{ size: "md", className: "bg-no-repeat bg-center p-0", style: { width: "103.5px" } },
									),
								),
								tray.modal({
									trigger: tray.div(
										[
											this.button(
												{ icon: icons.get("refresh"), tooltip: "Perform Manual Sync" },
												{ size: "md", className: "bg-no-repeat bg-center p-0", style: { width: "103.5px" } },
											),
											state.syncing.get()
												? tray.div([], {
														className: "w-3 h-3 rounded-full bg-red-500 absolute border border-white",
														style: { top: "-0.1rem", right: "-0.25rem" },
													})
												: [],
										],
										{ className: "relative" },
									),
									title: "Perform Manual Sync",
									description: "Manually sync AniList and Kitsu trackers",
									className: "max-w-2xl",
									items: [
										tabs.select({
											heading: "Direction",
											description: "Choose which tracker to sync to and from",
											fieldRef: fieldRefs.manageListJobType,
											disabled: state.syncing.get() || state.cancellingSync.get(),
											options: [
												{
													title: "Sync to Kitsu",
													desc: "Bring your AniList entries over to Kitsu",
													icon: icons.get("kitsu", { fill: "#9f92ff" }),
													value: ManageListJobType.Import,
												},
												{
													title: "Sync to AniList",
													desc: "Bring your Kitsu entries over to AniList",
													icon: icons.get("anilist", { fill: "#9f92ff" }),
													value: ManageListJobType.Export,
												},
											],
										}),
										tabs.select({
											heading: "Media Type",
											description: "Choose which type of media to sync",
											fieldRef: fieldRefs.manageListMediaType,
											disabled: state.syncing.get() || state.cancellingSync.get(),
											options: [
												{
													title: "Anime",
													desc: "Sync Anime Entries",
													icon: icons.get("play", { fill: "#9f92ff" }),
													value: "Anime",
												},

												{
													title: "Manga",
													desc: "Sync Manga Entries",
													icon: icons.get("book", { fill: "#9f92ff" }),
													value: "Manga",
												},
											],
										}),
										tabs.select({
											heading: "Sync Type",
											description: "Choose the method of syncing",
											fieldRef: fieldRefs.manageListSyncType,
											disabled: state.syncing.get() || state.cancellingSync.get(),
											gridCols: 1,
											options: [
												{
													title: "Add missing entries",
													desc: "Adds new items from source that aren't in your target list. Existing entries remain untouched.",
													icon: icons.get("plusCircleDotted", { fill: "#9f92ff" }),
													value: ManageListSyncType.Patch,
												},
												{
													title: "Update existing entries",
													desc: "Updates information for entries that exist in both trackers. Entries unique to either list are ignored.",
													icon: icons.get("arrow_r", { fill: "#9f92ff" }),
													value: ManageListSyncType.Post,
												},
												{
													title: "Mirror source list",
													desc:
														"Makes target list identical to source by adding missing entries, updating existing ones, and removing extras. It is recommended to backup your target tracker first as this will permanently delete any entries not in source.",
													icon: icons.get("arrow_lr", { fill: "#9f92ff" }),
													value: ManageListSyncType.FullSync,
												},
											],
										}),
										tray.button({
											label: state.syncing.get() ? "Cancel Manual Sync" : "Start Manual Sync",
											size: "lg",
											intent: state.syncing.get() ? "alert" : "success",
											loading: state.cancellingSync.get(),
											onClick: ctx.eventHandler("kitsu:manage-list-start-job", () => {
												if (state.syncing.get()) {
													ctx.toast.info("Stopping manual sync...");
													state.syncing.set(false);
													state.cancellingSync.set(true);
													ctx.setTimeout(() => state.cancellingSync.set(false), 5_000);
												} else {
													ctx.toast.info("Manual sync started");
													state.syncing.set(true);
													ctx.setTimeout(() => syncEntries().finally(() => state.syncing.set(false)), 1000);
												}
											}),
										}),
									],
								}),
								tray.modal({
									trigger: this.button(
										{ icon: icons.get("play"), tooltip: "Anime List" },
										{ size: "md", className: "bg-no-repeat bg-center p-0", style: { width: "103.5px" } },
									),
									title: "Anime List",
									description: "Viewing your Kitsu library (read-only)",
									className: "max-w-5xl",
									items: application.list.cache.animeModalOpened.get() ? tabs.listGroup("Anime") : [tabs.spinner()],
									onOpenChange: ctx.eventHandler("kitsu:animelist:onModalOpened", ({ open }) => {
										application.list.cache.animeModalOpened.set(open);
										if (open && !application.list.cache.anime && !application.list.cache.fetching.get())
											application.list
												.fetchAll("Anime")
												.then((e) => log.send(`list > [AnimeList]: Fetched ${e.length} entries`))
												.catch((err) => log.sendError(`list > [AnimeList]: ${err.message}`))
												.finally(() => application.list.cache.fetching.set(false));
									}),
								}),
								tray.modal({
									trigger: this.button(
										{ icon: icons.get("book"), tooltip: "Manga List" },
										{ size: "md", className: "bg-no-repeat bg-center p-0", style: { width: "103.5px" } },
									),
									title: "Manga List",
									description: "Viewing your Kitsu library (read-only)",
									className: "max-w-5xl",
									items: application.list.cache.mangaModalOpened.get() ? tabs.listGroup("Manga") : [tabs.spinner()],
									onOpenChange: ctx.eventHandler("kitsu:mangalist:onModalOpened", ({ open }) => {
										application.list.cache.mangaModalOpened.set(open);
										if (open && !application.list.cache.manga && !application.list.cache.fetching.get())
											application.list
												.fetchAll("Manga")
												.then((e) => log.send(`list > [MangaList]: Fetched ${e.length} entries`))
												.catch((err) => log.sendError(`list > [MangaList]: ${err.message}`))
												.finally(() => application.list.cache.fetching.set(false));
									}),
								}),
							],
							{ className: "grid grid-cols-4", style: { gap: "0.5rem" } },
						),
						tray.div([
							tray.switch("Temporarily disable livesync", {
								fieldRef: fieldRefs.disableSyncing,
								disabled: state.loggingOut.get(),
								style: { "--color-brand-500": "255 95 95" },
							}),
							tray.switch("Skip adult entries for livesync", {
								fieldRef: fieldRefs.skipAdult,
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("kitsu:skip-private", (e) => {
									$storage.set("kitsu:options-skipAdult", e.value);
								}),
							}),
							tray.switch("Disable badge for non-critical notifications", {
								fieldRef: fieldRefs.suppressNotificationBadge,
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("kitsu:suppress-notification-badge", (e) => {
									$storage.set("kitsu:options-suppressnotificationbadge", e.value);
								}),
							}),
						]),
						tray.div([], { className: "flex-1" }),
						tray.div(
							[
								tray.text(`Connections made: ${application.connection.success.get() + application.connection.fail.get()}`),
								tray.text(
									`Successful connections: ${application.connection.success.get()} (${((application.connection.success.get() / application.connection.total) * 100 || 0).toFixed(2)}%)`,
								),
								tray.p([
									tray.span("Last connection:", { className: "mr-1" }),
									tray.span(application.connection.lastState.get(), {
										className: "font-bold " + application.connection.lastState.get().startsWith("Success") ? "text-green-300" : "text-red-300",
									}),
								]),
							],
							{ className: "text-xs text-muted opacity-70" },
						),
						tray.flex(
							([{ name: "Privacy Policy", slug: "PRIVACY" }, "separator", { name: "Terms", slug: "TERMS" }] as const).map((item) =>
								item === "separator"
									? tray.span("|")
									: tray.anchor(item.name, {
											href: `https://github.com/nnotwen/n-seanime-extensions/blob/master/plugins/KitsuSync/${item.slug}.md`,
											className: "no-underline hover:underline",
										}),
							),
							{ className: "justify-center text-xs text-muted opacity-70 mt-2" },
						),
					],
					{ style: { height: "28rem" } },
				);

				return tray.stack([this.overlay(), header, body], { className: "m-2" });
			},

			get() {
				return this[this.current.get()]();
			},
		};

		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		function generateRandomUUID() {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
				((((Math.random() * 16) | 0) & (c == "x" ? 15 : 3)) | (c == "x" ? 0 : 8)).toString(16),
			);
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

		function formatTimestamp(t: number) {
			let d = new Date(t),
				n = new Date().setHours(0, 0, 0, 0),
				c = new Date(d).setHours(0, 0, 0, 0),
				p = (h: number, m: string) => {
					let a = h >= 12 ? "PM" : "AM";
					return `${h % 12 || 12}:${m} ${a}`;
				},
				time = p(d.getHours(), d.getMinutes().toString().padStart(2, "0"));
			return c === n
				? `Today at ${time}`
				: c === n - 864e5
					? `Yesterday at ${time}`
					: `${d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })} ${time}`;
		}

		function anilistEntryToKitsuAttributeBody(
			entry: ReturnType<typeof getAnilistEntries>[number],
			kitsuEntry?: Awaited<ReturnType<typeof application.list.fetchAll>>[number],
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
			anilistEntry?: ReturnType<typeof getAnilistEntries>[number],
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
				.filter((entry): entry is $app.AL_AnimeCollection_MediaListCollection_Lists_Entries => !!entry && !isCustomSource(entry.id))
				.map((entry) => {
					const { media, ...rest } = entry;
					return { ...rest, title: media?.title?.userPreferred, mediaId: media?.id, idMal: media?.idMal };
				});
		}

		function isCustomSource(mediaId?: number) {
			return (mediaId ?? 0) >= 2 ** 31;
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
				application.connection.fail.set(application.connection.fail.get() + 1);
				application.connection.lastState.set(`Failed (${res.status})`);
				throw new Error(err?.message || err?.error || res.statusText);
			}

			application.connection.success.set(application.connection.success.get() + 1);
			application.connection.lastState.set(`Success (${res.status})`);
			return await res.json();
		}

		async function syncEntries() {
			const jobType = fieldRefs.manageListJobType.current;
			const mediaType = fieldRefs.manageListMediaType.current;
			const syncType = fieldRefs.manageListSyncType.current;
			const notifUpdt = { entries: 0, errors: 0, skips: 0, updates: 0, job_type: jobType, media_type: mediaType, sync_type: syncType };

			// Anilist ➔ Kitsu
			if (jobType === ManageListJobType.Import) {
				log.sendInfo("synclist > Starting sync job... (Anilist ➔ kitsu)");
				const entries = getAnilistEntries(mediaType);
				if (!entries.length) {
					log.sendWarning("synclist > No entries found.");
					log.sendInfo("synclist > Sync job terminated.");
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "No entries found" },
					});
					return state.syncing.set(false);
				} else {
					log.sendInfo(`synclist > Found ${entries.length} entries in AniList!`);
					notifUpdt.entries = entries.length;
				}

				log.send("synclist > Querying Kitsu entries...");
				const kitsuEntries = await application.list
					.fetchAll(mediaType)
					.catch((e) => (e as Error).message)
					.finally(async () => await $_wait(1_000));
				if (typeof kitsuEntries === "string") {
					state.syncing.set(false);
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "Fetch error" },
					});
					return log.sendError(`synclist > Terminating syncjob: ${kitsuEntries}`);
				}
				log.sendInfo(`synclist > Found ${kitsuEntries.length} entries in Kitsu!`);

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop();

					if (!entry?.mediaId) continue;

					const title = entry?.title;

					const kitsuLibraryEntry = popByProperty(kitsuEntries, "anilistId", String(entry.mediaId));
					if (!!kitsuLibraryEntry && syncType === ManageListSyncType.Patch) {
						log.send(`synclist > Skipped ${title} (already-exists)...`);
						notifUpdt.skips++;
						continue;
					}

					const idKitsu =
						Number(kitsuLibraryEntry?.mediaId) ||
						(await application.list
							.getKitsuMediaId(entry.mediaId, mediaType.toLowerCase() as "anime" | "manga")
							.catch((err) => (err as Error).message)
							.finally(async () => await $_wait(1000)));

					if (typeof idKitsu === "string") {
						log.sendError(`synclist > Error on ${title}: ${idKitsu}`);
						continue;
					} else if (!idKitsu) {
						log.send(`synclist > Skipped ${title} (no equivalent kitsu entry)...`);
						notifUpdt.skips++;
						continue;
					}

					const update = anilistEntryToKitsuAttributeBody(entry, kitsuLibraryEntry);
					if (!Object.keys(update).length) {
						log.send(`synclist > Skipped ${title}. (no-new-update)...`);
						notifUpdt.skips++;
						continue;
					}

					await (
						kitsuLibraryEntry?.libraryId
							? application.list.patch(Number(kitsuLibraryEntry.libraryId), update)
							: application.list.post(idKitsu, mediaType.toLowerCase() as "anime" | "manga", update)
					)
						.then(() => {
							log.sendSuccess(`synclist > Updated ${entry.title}: ${JSON.stringify(update)}`);
							notifUpdt.updates++;
						})
						.catch((e) => {
							log.sendError(`synclist > Failed to update ${entry.title}: ${(e as Error).message} ${JSON.stringify(update)}`);
							notifUpdt.errors++;
						})
						.finally(async () => await $_wait(1000));
				}

				if (syncType === ManageListSyncType.FullSync && typeof kitsuEntries !== "string" && state.syncing.get()) {
					log.sendInfo(`synclist > Found ${kitsuEntries.length} remaining entries. Purging...`);

					while (state.syncing.get() && kitsuEntries.length) {
						const kitsuLibraryEntry = kitsuEntries.pop()!;
						const title = kitsuLibraryEntry.mediaTitle ?? `kitsu-id/${kitsuLibraryEntry.mediaId}`;

						const idAnilist =
							Number(kitsuLibraryEntry.anilistId) ||
							(await application.list
								.getAnilistMediaId(Number(kitsuLibraryEntry.mediaId), kitsuLibraryEntry.mediaType!)
								.catch((err) => (err as Error).message)
								.finally(async () => await $_wait(1000)));

						if (typeof idAnilist === "string") {
							log.sendError(`synclist > Unable to delete ${title}: ${idAnilist}`);
							notifUpdt.errors++;
							continue;
						} else if (!idAnilist) {
							log.sendError(`synclist > Will not delete ${title} (no equivalent AniList entry)...`);
							notifUpdt.errors++;
							continue;
						}

						await application.list
							.delete(Number(kitsuLibraryEntry.libraryId))
							.then(() => {
								log.sendSuccess(`synclist > Deleted ${title} from kitsu library!`);
								notifUpdt.updates++;
							})
							.catch((err) => {
								log.sendError(`synclist > Unable to delete ${title}: ${(err as Error).message}`);
								notifUpdt.errors++;
							})
							.finally(async () => await $_wait(1000));
					}
				}
			}

			// Kitsu ➔ Anilist
			if (jobType === ManageListJobType.Export) {
				log.sendInfo("synclist > Starting sync job... (Kitsu ➔ Anilist)");
				log.send("synclist > Querying Kitsu entries...");
				const entries = await application.list
					.fetchAll(mediaType)
					.catch((e) => (e as Error).message)
					.finally(async () => await $_wait(1_000));

				if (typeof entries === "string") {
					log.sendError(`synclist > ${entries}`);
					log.sendWarning("synclist > Sync job terminated.");
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "Fetch error" },
					});
					return state.syncing.set(false);
				} else if (!entries.length) {
					log.sendWarning("synclist > No entries found.");
					log.sendWarning("synclist > Sync job terminated.");
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "No entries found" },
					});
					return state.syncing.set(false);
				} else {
					log.sendInfo(`synclist > Found ${entries.length} entries!`);
				}

				// prettier-ignore
				const query = "mutation ( $mediaId: Int!, $status: MediaListStatus, $progress: Int, $progressVolumes: Int, $score: Float, $repeat: Int, $notes: String, $startedAt: FuzzyDateInput, $completedAt: FuzzyDateInput ) { SaveMediaListEntry( mediaId: $mediaId, status: $status, progress: $progress, progressVolumes: $progressVolumes, score: $score, repeat: $repeat, notes: $notes, startedAt: $startedAt, completedAt: $completedAt ) { id status progress progressVolumes score repeat notes startedAt { year month day } completedAt { year month day } } }";
				const anilistEntries = getAnilistEntries(mediaType);

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop()!;
					const title = entry.mediaTitle ?? `kitsu-id/${entry.mediaId}`;

					const idAnilist =
						Number(entry.anilistId) ||
						(await application.list
							.getAnilistMediaId(Number(entry.mediaId), entry.mediaType!)
							.catch((e) => (e as Error).message)
							.finally(async () => await $_wait(1_000)));

					if (typeof idAnilist === "string") {
						log.sendError(`synclist > Error on ${title}: ${idAnilist}`);
						notifUpdt.errors++;
						continue;
					} else if (!idAnilist) {
						log.send(`synclist > Skipped ${title} (no equivalent AniList entry)...`);
						notifUpdt.skips++;
						continue;
					}

					const anilistEntry = popByProperty(anilistEntries, "id", idAnilist);
					if (!!anilistEntry && syncType === ManageListSyncType.Patch) {
						log.send(`synclist > Skipped ${title} (already-exists)...`);
						notifUpdt.skips++;
						continue;
					}

					const body = kitsuLibrarytoAnilistBody(idAnilist, entry, anilistEntry);
					if (Object.keys(body).length <= 1) {
						log.send(`synclist > Skipping ${title}. (no-new-update)...`);
						notifUpdt.skips++;
						continue;
					}

					await anilistQuery(query, body)
						.then(() => {
							notifUpdt.updates++;
							log.sendSuccess(`synclist > Updated ${title}: ${JSON.stringify(body)}`);
						})
						.catch((e) => {
							notifUpdt.errors++;
							log.sendError(`synclist > Failed to update ${title}: ${(e as Error).message} ${JSON.stringify(body)}`);
						})
						.finally(async () => await $_wait(1000));
				}

				if (syncType === ManageListSyncType.FullSync && state.syncing.get()) {
					log.sendInfo(`synclist > Found ${anilistEntries.length} remaining entries. Purging...`);

					const query = "mutation ($id: Int!) { DeleteMediaListEntry(id: $id) { deleted } }";

					while (state.syncing.get() && anilistEntries.length) {
						const anilistEntry = anilistEntries.pop()!;
						const mediaTitle = anilistEntry.title ?? `anilist-id/${anilistEntry.id}`;

						// Check if entry exists in kitsu
						const idKitsu = await application.list
							.getKitsuMediaId(anilistEntry.id, mediaType.toLowerCase() as "anime" | "manga")
							.catch((err) => (err as Error).message)
							.finally(async () => await $_wait(1000));

						if (typeof idKitsu === "string") {
							log.sendError(`synclist > Error on ${mediaTitle}: ${idKitsu}`);
							notifUpdt.errors++;
							continue;
						} else if (!idKitsu) {
							log.send(`synclist > Skipping ${mediaTitle} (no equivalent kitsu entry)...`);
							notifUpdt.skips++;
							continue;
						}

						await anilistQuery(query, { id: anilistEntry.id })
							.then(() => {
								log.sendSuccess(`synclist > Deleted ${mediaTitle} from Anilist.`);
								notifUpdt.updates++;
							})
							.catch((e) => {
								log.sendError(`synclist > Failed to delete ${mediaTitle} from Anilist: ${(e as Error).message}}`);
								notifUpdt.errors++;
							})
							.finally(async () => await $_wait(2_000));
					}
				}
			}

			let remarks;
			if (!state.syncing.get()) {
				// sync was cancelled
				log.sendWarning("synclist > Syncing was aborted by user");
				remarks = "Aborted";
			} else {
				log.sendInfo("synclist > Finished syncing entries!");
				remarks = "Completed";
				state.syncing.set(false);
			}

			notifications.push({
				title: "Manual Sync Performed",
				body: { ...notifUpdt, remarks },
			});
		}

		async function liveSync<TData>({
			event,
			preDataKey,
			buildBody,
			actionLabel,
			requireRepeat = false,
		}: {
			event: $app.PostUpdateEntryEvent | $app.PostUpdateEntryProgressEvent | $app.PostUpdateEntryRepeatEvent | $app.PostDeleteEntryEvent;
			preDataKey: string;
			buildBody: (data: any, entry: any) => $kitsusync.KitsuLibraryEntryWriteAttributes;
			actionLabel: "update" | "progress" | "repeat" | "delete";
			requireRepeat?: boolean;
		}) {
			const { mediaId } = event;

			if (!mediaId) {
				log.sendWarning(`${actionLabel} > postUpdate hook was triggered but it contained no mediaId`);
				return $store.set(preDataKey, null);
			}

			const data = $store.get(preDataKey) as TData | null;
			if (!data) return log.sendWarning(`${actionLabel} > No update data was emitted from the pre update hooks!`);
			$store.set(preDataKey, null);

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`${actionLabel} > Syncing was disabled. Will not sync entry [${mediaId}]`);
			}

			const entry = await getMedia(mediaId);
			if (!entry || !entry.media) return log.sendWarning(`${actionLabel} > Media not found (${mediaId})`);

			const title = entry.media.title?.userPreferred ?? `anilist-id/${mediaId}`;
			if ((data as any).mediaId !== mediaId) return log.sendWarning(`${actionLabel} > preUpdate data was invalid!`);

			if (requireRepeat && typeof (data as any).repeat !== "number") {
				return log.sendWarning(`${actionLabel} > preUpdate data was of invalid type!`);
			}

			if (fieldRefs.skipAdult.current.valueOf() && entry.media.isAdult?.valueOf()) {
				return log.sendWarning(`${actionLabel} > Skipped ${entry.media.title?.userPreferred ?? mediaId} (livesync-adult-disabled)`);
			}

			const kitsuMediaId = await application.list
				.getKitsuMediaId(mediaId, entry.type.toLowerCase() as "anime" | "manga")
				.then(async (data) => {
					await $_wait(1000);
					return data;
				})
				.catch((e) => (e as Error).message);
			if (typeof kitsuMediaId === "string") {
				notifications.push({
					title: `Failed to update ${title}`,
					body: { type: actionLabel, payload: buildBody(data, entry), status: "error", mediaId, metadata: { image: entry.media?.coverImage?.large } },
				});
				return log.sendError(`${actionLabel} > Failed to update "${title}": ${kitsuMediaId}`);
			}
			if (kitsuMediaId === null) {
				notifications.push({
					title: `Failed to update ${title}`,
					body: { type: actionLabel, payload: buildBody(data, entry), status: "error", mediaId, metadata: { image: entry.media?.coverImage?.large } },
				});
				return log.sendWarning(`${actionLabel} > No equivalent Kitsu entry found for ${title}`);
			}

			const kitsuLibraryId = await application.list
				.getLibraryEntryId(kitsuMediaId)
				.then(async (data) => {
					await $_wait(1000);
					return data;
				})
				.catch((e) => (e as Error).message);
			if (typeof kitsuLibraryId === "string") {
				notifications.push({
					title: `Failed to update ${title}`,
					body: { type: actionLabel, payload: buildBody(data, entry), status: "error", mediaId, metadata: { image: entry.media?.coverImage?.large } },
				});
				return log.sendError(`${actionLabel} > Failed to update "${title}": ${kitsuMediaId}`);
			}

			const body = buildBody(data, entry);
			const op = kitsuLibraryId
				? application.list.patch(kitsuLibraryId, body)
				: application.list.post(kitsuMediaId, entry.type.toLowerCase() as "anime" | "manga", body);
			const opName = kitsuLibraryId ? "PATCH" : "POST";

			op
				.then(() => {
					log.sendSuccess(`${actionLabel} > [${opName}] Synced ${title} to Kitsu. ${JSON.stringify(body)}`);
					notifications.push({
						title: `Updated ${title}`,
						body: { type: actionLabel, payload: body, status: "success", mediaId, metadata: { image: entry.media?.coverImage?.large } },
					});
				})
				.catch((e) => {
					log.sendError(`${actionLabel} > [${opName}] ${(e as Error).message}`);
					notifications.push({
						title: `Failed to update ${title}`,
						body: { type: actionLabel, payload: body, status: "error", mediaId, metadata: { image: entry.media?.coverImage?.large } },
					});
				});
		}

		$store.watch("POST_UPDATE_ENTRY", async (e) => {
			liveSync({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_DATA",
				actionLabel: "update",
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
				actionLabel: "progress",
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
				actionLabel: "repeat",
				requireRepeat: true,
				buildBody: (data) => ({
					reconsumeCount: data.repeat,
					reconsuming: false,
				}),
			});
		});

		$store.watch("POST_UPDATE_DELETE", async (e: $app.PostDeleteEntryEvent) => {
			if (!e.mediaId) {
				return log.sendWarning("delete-entry > postUpdate hook was triggered but it contained no mediaId");
			}

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`delete-entry > Syncing was disabled. Will not sync entry [${e.mediaId}]`);
			}

			const entry = await getMedia(e.mediaId);
			if (!entry || !entry.media) return log.sendWarning(`delete-entry > Media not found (${e.mediaId})`);

			const title = entry.media.title?.userPreferred ?? `anilist-id/${e.mediaId}`;

			const kitsuMediaId = await application.list
				.getKitsuMediaId(e.mediaId, entry.type.toLowerCase() as "anime" | "manga")
				.catch((e) => (e as Error).message)
				.finally(async () => $_wait(1000));
			if (typeof kitsuMediaId === "string") {
				notifications.push({
					title: `Failed to delete ${title}`,
					body: { type: "delete", payload: {}, status: "error", mediaId: e.mediaId, metadata: { image: entry.media?.coverImage?.large } },
				});
				return log.sendError(`delete-entry > Failed to update "${title}": ${kitsuMediaId}`);
			}
			if (kitsuMediaId === null) {
				notifications.push({
					title: `Failed to delete ${title}`,
					body: { type: "delete", payload: {}, status: "error", mediaId: e.mediaId, metadata: { image: entry.media?.coverImage?.large } },
				});
				return log.sendWarning(`delete-entry > No equivalent Kitsu entry found for ${title}`);
			}
			const kitsuLibraryId = await application.list
				.getLibraryEntryId(kitsuMediaId)
				.catch((e) => (e as Error).message)
				.finally(async () => $_wait(1000));

			if (typeof kitsuLibraryId === "string") {
				notifications.push({
					title: `Failed to delete ${title}`,
					body: { type: "delete", payload: {}, status: "error", mediaId: e.mediaId, metadata: { image: entry.media?.coverImage?.large } },
				});
				return log.sendError(`delete-entry > Failed to update "${title}": ${kitsuMediaId}`);
			}

			if (kitsuLibraryId === null) {
				notifications.push({
					title: `Deleted ${title}`,
					body: { type: "delete", payload: {}, status: "success", mediaId: e.mediaId, metadata: { image: entry.media?.coverImage?.large } },
				});
				return log.sendInfo(`delete-entry > [DELETE] ${title} does not exist in user's list.`);
			}

			application.list
				.delete(kitsuLibraryId)
				.then((data) => {
					const logmsg = data ? `Removed ${title} from Kitsu` : `${title} does not exist in user's list`;
					log.sendInfo(`delete-entry > [DELETE] ${logmsg}`);
					notifications.push({
						title: `Deleted ${title}`,
						body: { type: "delete", payload: {}, status: "success", mediaId: e.mediaId!, metadata: { image: entry.media?.coverImage?.large } },
					});
				})
				.catch((e) => {
					log.sendError(`delete-entry > [DELETE] ${(e as Error).message}`);
					notifications.push({
						title: `Deleted ${title}`,
						body: { type: "delete", payload: {}, status: "success", mediaId: e.mediaId, metadata: { image: entry.media?.coverImage?.large } },
					});
				});
		});

		tray.render(() => tabs.get());

		ctx.effect(() => {
			if (application.token.accessToken.get() === null) return tray.updateBadge({ number: 1, intent: "alert" });
			if (state.syncing.get()) return tray.updateBadge({ number: 1, intent: "alert" });
			if (notifications.unreads.get() > 0 && fieldRefs.suppressNotificationBadge.current === false)
				return tray.updateBadge({ number: notifications.unreads.get(), intent: "warning" });
			return tray.updateBadge({ number: 0 });
		}, [application.userInfo.id, state.syncing, notifications.unreads]);

		log.send("init > Initializing extension...");
		log.send("init > Checking availability of access tokens...");
		state.loggingIn.set(true);
		tray.updateBadge({ number: 1, intent: "alert" });

		if (application.token.getAccessToken() !== null) {
			log.sendSuccess("login > Access token found!");
			log.sendInfo("login > Fetching user info...");
			return application.userInfo
				.fetch()
				.then((data) => {
					log.sendSuccess("login > Successfully fetched user info!");
					log.send(`login > Signed in as: ${data.attributes.name}!`);
					if (application.userInfo.avatar.display.get() === application.userInfo.avatar.default)
						log.sendWarning("login > No user avatar detected! Reverting to default...");
					tabs.current.set(Tab.Landing);
				})
				.catch((err: Error) => {
					log.sendError(`login > Fetch failed: ${err.message}`);
					log.send("login > Session invalid. Please log in again.");
					tabs.current.set(Tab.Logon);
					state.loginError.set("Session invalid. Please log in again.");
				})
				.finally(() => state.loggingIn.set(false));
		}

		log.sendWarning("login > Access token not found!");
		log.sendInfo("login > Checking availability of refresh token...");
		if (application.token.refreshToken.get()) {
			log.sendSuccess("login > Refresh token found!");
			log.sendInfo("login > Refreshing access token...");
			return application.token
				.refresh()
				.then(() => {
					log.sendSuccess("login > Successfully refreshed access token!");
					log.sendInfo("login > Fetching user info...");
					return application.userInfo.fetch();
				})
				.then((data) => {
					log.sendSuccess("login > Successfully fetched user info!");
					log.send(`login > Signed in as: ${data.attributes.name}!`);
					if (application.userInfo.avatar.display.get() === application.userInfo.avatar.default)
						log.sendWarning("login > No user avatar detected! Reverting to default...");
					tabs.current.set(Tab.Landing);
				})
				.catch((err: Error) => {
					log.sendError(`login > [Token Refresh Failed] ${err.message}`);
					log.send("login > ession Expired. Please login again.");
					state.loginError.set("Session Expired. Please login again.");
					tabs.current.set(Tab.Logon);
				})
				.finally(() => state.loggingIn.set(false));
		}

		log.sendWarning("login > Refresh token not found!");
		log.sendWarning("login > User authentication required.");
		state.loggingIn.set(false);
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
