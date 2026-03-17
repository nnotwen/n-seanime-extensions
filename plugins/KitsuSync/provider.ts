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
			hidePassword: ctx.state<boolean>(true),
			manageListJobTypeDesc: ctx.state<string>(manageListJobTypeDesc[fieldRefs.manageListJobType.current]),
			manageListSyncTypeDesc: ctx.state<string>(manageListSyncTypeDesc[fieldRefs.manageListSyncType.current]),
			syncing: ctx.state<boolean>(false),
			cancellingSync: ctx.state<boolean>(false),
			syncDetail: ctx.state<string>("Waiting..."),
		};

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
					},
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

			spinner(size: number = 16) {
				const icon = tray.div([], {
					className: `UI-LoadingSpinner__icon inline w-${size} h-${size} mr-2 my-10 animate-spin bg-center bg-no-repeat bg-cover`,
					style: { backgroundImage: `url(${icons.get("spinner")})`, width: `calc(0.25 * ${size})`, height: `calc(0.25 * ${size})` },
				});

				return tray.flex([icon], { className: "justify-center" });
			},

			logsModal(trigger: any) {
				return tray.modal({
					trigger,
					title: "KitsuSync Logs",
					className: "max-w-5xl",
					onOpenChange: ctx.eventHandler(generateRandomUUID(), ({ open }) => log.modalOpened.set(open)),
					items: [
						tray.button("Copy to Clipboard", { disabled: true, intent: "white", size: "md", className: "w-fit" }),
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
							className: "break-normal bg-red-600/70 text-red-100 text-sm border border-red-500 rounded-md mb-4 p-2",
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

				const signup = tray.div(
					[tray.span("Don't have an account?", { className: "mr-1" }), tray.anchor({ text: "Sign-up", href: "https://kitsu.app", target: "_blank" })],
					{ className: "text-sm" },
				);

				const logs = tabs.logsModal(
					tray.button("Open Logs", {
						intent: "gray-subtle",
						size: "md",
						className: "w-full",
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
					},
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
									{ gap: 0 },
								),
							],
							{
								gap: 0.5,
								direction: "column",
							},
						),
					],
					{
						gap: 3,
						direction: "row",
						style: {
							width: "100%",
						},
					},
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
					},
				);

				const entries = (log.getEntries() ?? []).map(([message, type]) => {
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
					},
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
					},
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
							},
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
					},
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

					await (
						kitsuLibraryEntry?.libraryId
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
