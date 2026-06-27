/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./traktSync.d.ts" />

// To Finish: Line 2017
//@ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/TraktSync/icon.png";
		const tray = ctx.newTray({ iconUrl, withContent: true, width: "30rem" });

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
				trakt_logo: /*html*/ `
					<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" fill="#cacaca">
						<path d="M355.3 166.2 230 291.5l-46-46-46-45.9-7.5 7.4c-4.1 4.1-7.3 7.5-7.2 7.7C125.2 217 275.6 367 276 367c.3 0 3.8-3.3 7.8-7.3l7.2-7.2-23-23-23-23L369.5 182 494 57.5l-4.1-6c-4.4-6.3-7.9-10.5-8.8-10.5-.3 0-57 56.4-125.8 125.2"/><path d="M129.5 50.1c-12.1 1-19.1 3-31 8.8C87.2 64.5 76.7 72.8 69 82.3c-6.5 7.9-14.4 23.8-17.3 34.7l-2.2 8.5.3 130.5c.3 148.8-.3 138.1 9.3 157.5 8.8 18 21.2 30.4 39.4 39.5 17.2 8.6 14.6 8.2 78.5 9.1 82.7 1 193 1 204.5-.1 13.5-1.2 20.2-3.1 32-8.9 23-11.3 39.7-31.9 46.1-56.9 2.3-8.6 2.6-12.4 3.1-33.9l.6-24.3H441v22.3c0 18.9-.3 23.6-1.9 30-6.4 24.8-24.1 42.6-48.7 48.7-7.9 2-10.4 2-137.5 1.8l-129.4-.3-7.7-2.8c-21.4-7.9-36.6-24.2-42.9-46.2-1.2-4.2-1.4-25.2-1.4-136v-131l2.7-8.1c6.7-19.6 22.5-35.3 42.8-42.6l6.5-2.3 117.8-.3L359 71V60.6c0-8.5-.3-10.5-1.6-11-2.3-.9-217.1-.4-227.9.5"/><path d="M380.2 187.3 260.8 306.7l18.7 18.4c10.2 10.1 18.8 18.6 19.1 18.8.3.3 3.8-2.8 7.9-6.9l7.5-7.5-11.5-11.5-11.5-11.5 108.4-108.4L507.8 89.7l-1.2-4.1c-.7-2.3-1.6-5.1-2-6.3-.6-2-.3-2.2 3.6-2.6l4.3-.4-4.6-.1c-4.2-.2-4.6-.5-6.5-4.2l-1.9-4z"/><path d="M408.2 205.3 307 306.5l7.5 7.5 7.5 7.5 95.1-95 95.1-95-.6-13c-.3-7.2-.6-13.3-.6-13.8 0-.4-.3-.7-.8-.7-.4 0-46.3 45.6-102 101.3m-232-44-7.3 7.3 33.9 34c18.7 18.6 37.6 37.5 42.1 41.9l8.1 8 7.5-7.5 7.5-7.5-41.7-41.7c-23-23-42-41.8-42.3-41.8s-3.8 3.3-7.8 7.3m-23 23-7.2 7.2 42 42 42 42 7.5-7.5 7.5-7.5-41.7-41.7c-23-23-42-41.8-42.3-41.8s-3.8 3.3-7.8 7.3"/>
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
			Post = "post",
			FullSync = "fullsync",
		}

		const fieldRefs = {
			traktAuthCode: ctx.fieldRef<string>(""),
			disableSyncing: ctx.fieldRef<boolean>($storage.get("trakt:options-disableSync")?.valueOf() ?? false),
			skipAdult: ctx.fieldRef<boolean>($storage.get("trakt:options-skipAdult")?.valueOf() ?? false),
			removeNonPlanningFromWatchlistOnLiveSync: ctx.fieldRef<boolean>(
				$storage.get("trakt:options-removeNonPlanningFromWatchlistOnLiveSync")?.valueOf() ?? false,
			),
			manageListMediaType: ctx.fieldRef("Anime"),
			suppressNotificationBadge: ctx.fieldRef<boolean>($storage.get("trakt:options-suppressnotificationbadge")?.valueOf() ?? false),
			manageListJobtype: ctx.fieldRef<ManageListJobType>(ManageListJobType.Import),
			manageListSyncType: ctx.fieldRef<ManageListSyncType>(ManageListSyncType.Post),
		};

		const state = {
			loggingIn: ctx.state<boolean>(false),
			loggingOut: ctx.state<boolean>(false),
			loginError: ctx.state<string | null>(null),

			syncing: ctx.state<boolean>(false),
			cancellingSync: ctx.state<boolean>(false),

			animeListSearch: ctx.state<string>(""),
			animeListFormat: ctx.state<string>("all"),
			animeListStatus: ctx.state<string>("all"),

			mangaListSearch: ctx.state<string>(""),
			mangaListFormat: ctx.state<string>("all"),
			mangaListStatus: ctx.state<string>("all"),
		};

		const notifications: $traktsync.NotificationManager = {
			id: "82f9c022-7270-42df-9924-d13ad39a9bf8",
			unreads: ctx.state<number>(0),
			get entries() {
				return this.modalOpened.get() ? ($storage.get<$traktsync.NotificationManager["entries"]>(this.id) ?? []) : undefined;
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

				const header = "type" in entry.body ? entry.body.type.charAt(0).toUpperCase() + entry.body.type.slice(1) + "d " : "";
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
										tray.text(header + entry.title, { className: "font-bold mb-2 break-normal line-clamp-2" }),
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
												notifications.unreads.set(($storage.get(notifications.id) ?? []).filter((x: $traktsync.Notification) => x.unread).length);
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
														const entries = $storage.get<$traktsync.NotificationManager["entries"]>(notifications.id);
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
		notifications.unreads.set(($storage.get<$traktsync.NotificationManager["entries"]>(notifications.id) ?? []).filter((x) => x.unread).length);

		const log = {
			id: "trakt:c6d44b38-f7b6-4785-92fd-a30a8fef71b3",
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

		const PKCE = {
			base64urlEncode(bytes: Uint8Array): string {
				// Directly base64-encode the raw bytes; do NOT pass through a string
				return Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
			},

			generateCodeVerifier(): string {
				const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
				let result = "";
				for (let i = 0; i < 86; i++) {
					result += charset.charAt(Math.floor(Math.random() * charset.length));
				}
				return result;
			},

			sha256(message: string): Uint8Array {
				const data = new Uint8Array(message.length);
				for (let i = 0; i < message.length; i++) data[i] = message.charCodeAt(i);

				const K = [
					0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
					0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
					0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
					0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
					0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
					0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
				];
				function rotr(x: number, n: number) {
					return (x >>> n) | (x << (32 - n));
				}

				const bitLen = data.length * 8;
				const withOne = new Uint8Array(((data.length + 9 + 63) >> 6) << 6);
				withOne.set(data);
				withOne[data.length] = 0x80;
				const dv = new DataView(withOne.buffer);
				const hi = Math.floor(bitLen / 0x100000000);
				const lo = bitLen >>> 0;
				dv.setUint32(withOne.length - 8, hi, false);
				dv.setUint32(withOne.length - 4, lo, false);

				let H0 = 0x6a09e667,
					H1 = 0xbb67ae85,
					H2 = 0x3c6ef372,
					H3 = 0xa54ff53a,
					H4 = 0x510e527f,
					H5 = 0x9b05688c,
					H6 = 0x1f83d9ab,
					H7 = 0x5be0cd19;

				const W = new Uint32Array(64);
				for (let i = 0; i < withOne.length; i += 64) {
					for (let t = 0; t < 16; t++) W[t] = dv.getUint32(i + t * 4, false);
					for (let t = 16; t < 64; t++) {
						const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
						const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
						W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
					}
					let a = H0,
						b = H1,
						c = H2,
						d = H3,
						e = H4,
						f = H5,
						g = H6,
						h = H7;
					for (let t = 0; t < 64; t++) {
						const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
						const ch = (e & f) ^ (~e & g);
						const temp1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
						const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
						const maj = (a & b) ^ (a & c) ^ (b & c);
						const temp2 = (S0 + maj) >>> 0;
						h = g;
						g = f;
						f = e;
						e = (d + temp1) >>> 0;
						d = c;
						c = b;
						b = a;
						a = (temp1 + temp2) >>> 0;
					}
					H0 = (H0 + a) >>> 0;
					H1 = (H1 + b) >>> 0;
					H2 = (H2 + c) >>> 0;
					H3 = (H3 + d) >>> 0;
					H4 = (H4 + e) >>> 0;
					H5 = (H5 + f) >>> 0;
					H6 = (H6 + g) >>> 0;
					H7 = (H7 + h) >>> 0;
				}

				const out = new Uint8Array(32);
				const H = [H0, H1, H2, H3, H4, H5, H6, H7];
				for (let i = 0; i < 8; i++) {
					out[i * 4] = H[i] >>> 24;
					out[i * 4 + 1] = (H[i] >>> 16) & 0xff;
					out[i * 4 + 2] = (H[i] >>> 8) & 0xff;
					out[i * 4 + 3] = H[i] & 0xff;
				}
				return out;
			},

			generatePair(): { verifier: string; challenge: string } {
				const verifier = this.generateCodeVerifier();
				const hashBytes = this.sha256(verifier);
				const challenge = this.base64urlEncode(hashBytes);
				return { verifier, challenge };
			},
		};

		const application = {
			clientId: "f95f217507a1b866da27d4e7ea5197fb9199b6033c79b5627968a2a13353ba4a",
			userAgent: "Trakt for Seanime",
			redirectUri: "https://nnotwen.github.io/n-seanime-extensions/plugins/TraktSync/callback.html",
			baseUri: "https://api.trakt.tv/",
			currentAuthUrl: ctx.state<string | null>(null),
			rateLimit: ctx.state<RateLimitInfo | null>(null),
			token: {
				accessToken: ctx.state<string | null>($storage.get("traktsync.accessToken") ?? null),
				refreshToken: ctx.state<string | null>($storage.get("traktsync.refreshToken") ?? null),
				expiresAt: ctx.state<number | null>($storage.get("traktsync.expiresAt") ?? null),
				set(data: $traktsync.RequestAccessTokenResponse | null) {
					const expiresAt = data ? Date.now() + data.expires_in * 1000 : null;

					$storage.set("traktsync.accessToken", data?.access_token ?? null);
					$storage.set("traktsync.refreshToken", data?.refresh_token ?? null);
					$storage.set("traktsync.expiresAt", expiresAt);

					this.accessToken.set(data?.access_token ?? null);
					this.refreshToken.set(data?.refresh_token ?? null);
					this.expiresAt.set(expiresAt);
				},

				getAccessToken() {
					const token = this.accessToken.get();
					const expiry = this.expiresAt.get();
					if (!token || !expiry) return null;
					if (Date.now() > expiry) return null;
					return token;
				},

				generateAuthUrl() {
					const { verifier, challenge } = PKCE.generatePair();
					$store.set("trakt:auth.verifier", verifier);

					const url = new URL("https://trakt.tv/oauth/authorize");
					url.searchParams.set("response_type", "code");
					url.searchParams.set("client_id", application.clientId);
					url.searchParams.set("redirect_uri", application.redirectUri);
					url.searchParams.set("code_challenge", challenge);
					url.searchParams.set("code_challenge_method", "S256");
					application.currentAuthUrl.set(url.toString());
				},

				async exchangeCode(code: string) {
					const codeVerifier = $store.get("trakt:auth.verifier");
					if (!codeVerifier) throw new Error("No verifier was set!");

					const res = await ctx.fetch("https://api.trakt.tv/oauth/token", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							code,
							client_id: application.clientId,
							redirect_uri: application.redirectUri,
							grant_type: "authorization_code",
							code_verifier: codeVerifier,
						} satisfies $traktsync.RequestAccessTokenBody),
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

					$store.set("trakt:auth.verifier", undefined);
					application.currentAuthUrl.set(null);

					const data: $traktsync.RequestAccessTokenResponse = await res.json();
					this.set(data);
					return data;
				},

				async refresh() {
					if (!this.refreshToken.get()) throw new Error("No refresh token available");

					const res = await ctx.fetch("https://api.trakt.tv/oauth/token", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: new URLSearchParams({
							refresh_token: this.refreshToken.get()!,
							client_id: application.clientId,
							grant_type: "refresh_token",
						} satisfies $traktsync.RefreshAccessTokenBody),
					});

					if (!res.ok) {
						this.set(null);
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					const data: $traktsync.RequestAccessTokenResponse = await res.json();
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
				cache: ctx.state<$traktsync.ExtendedMediaObjectUser | null>(null),
				async fetch() {
					const res = await application.fetch("/users/me?extended=full", { method: "GET" });
					if (!res.ok) {
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					const data: $traktsync.ExtendedMediaObjectUser = await res.json();
					this.cache.set(data);
					return data;
				},
			},
			list: {
				cache: {
					fetching: ctx.state<boolean>(false),
					watchlistModalOpened: ctx.state<boolean>(false),
					watchedModalOpened: ctx.state<boolean>(false),
					get watchlist() {
						return $store.get("traktsync:cache:watchlist") as $traktsync.WatchlistResponse<"movies" | "shows">[] | undefined;
					},
					get watched() {
						return $store.get("traktsync:cache:watched") as $traktsync.WatchedResponse<"movies" | "shows">[] | undefined;
					},
				},

				// Identical to status:PLANNING
				async fetchAllWatchlist() {
					let all: $traktsync.WatchlistResponse<"movies" | "shows">[] = [],
						page = 1,
						limit = 1000; // Max allowable per request

					application.list.cache.fetching.set(true);
					for (const mediaType of ["shows", "movies"] as const) {
						page = 1;
						while (true) {
							const path = `sync/watchlist/${mediaType}?limit=${limit}&page=${page}&extended=full`;
							const res = await application.fetch(path, {
								headers: await application.withAuthHeaders(),
							});

							if (!res.ok) {
								application.list.cache.fetching.set(false);
								throw new Error(`Request failed with status ${res.statusText}`);
							}

							try {
								const items: $traktsync.WatchlistResponse<typeof mediaType>[] = res.json();
								if (!items || !items.length) break;

								all = [...all, ...items.filter((i) => ("show" in i ? i.show : i.movie).genres.includes("anime"))];
							} catch (err) {
								application.list.cache.fetching.set(false);
								throw new Error("Invalid Trakt Response: " + (err as Error).message);
							}

							const totalPages = parseInt(res.headers["X-Pagination-Page-Count"] || "0");
							if (page >= totalPages) break;

							page++;
							await $_wait(1_000);
						}
					}

					$store.set("traktsync:cache:watchlist", all);
					application.list.cache.fetching.set(false);
					return all;
				},
				async fetchAllWatched() {
					const uniqueAnime = new Map();
					let page = 1,
						limit = 1000; // Max allowable per request

					application.list.cache.fetching.set(true);
					for (const mediaType of ["shows", "movies"] as const) {
						page = 1;
						while (true) {
							const path = `users/me/watched/${mediaType}?limit=${limit}&page=${page}&extended=full`;
							const res = await application.fetch(path, {
								headers: await application.withAuthHeaders(),
							});

							if (!res.ok) {
								application.list.cache.fetching.set(false);
								throw new Error(`Request failed with status ${res.statusText}`);
							}

							try {
								const items: $traktsync.WatchedResponse<typeof mediaType>[] = res.json();
								if (!items || !items.length) break;

								for (const item of items) {
									if (mediaType === "movies") {
										const genres = (item as $traktsync.WatchedMovieResponse).movie.genres || [];
										if (genres.includes("anime")) {
											uniqueAnime.set((item as $traktsync.WatchedMovieResponse).movie.ids.trakt, item);
										}
									} else {
										const genres = (item as $traktsync.WatchedShowResponse).show.genres || [];
										if (genres.includes("anime")) {
											uniqueAnime.set((item as $traktsync.WatchedShowResponse).show.ids.trakt, item);
										}
									}
								}
							} catch (err) {
								application.list.cache.fetching.set(false);
								throw new Error("Invalid Trakt Response: " + (err as Error).message);
							}

							const totalPages = parseInt(res.headers["X-Pagination-Page-Count"] || "0");
							if (page >= totalPages) break;

							page++;
							await $_wait(1_000);
						}
					}

					$store.set("traktsync:cache:watched", Array.from(uniqueAnime.values()));
					application.list.cache.fetching.set(false);
					return Array.from(uniqueAnime.values()) as ($traktsync.WatchedMovieResponse | $traktsync.WatchedShowResponse)[];
				},
				async getTraktId(anilistId: number) {
					const res = await ctx.fetch("https://animeapi.my.id/anilist/" + anilistId);
					if (!res.ok) throw new Error(res.statusText);

					const data = await res.json();
					return {
						id: data.trakt as number | null, // Trakt ID, can be used for movie or show, website: https://trakt.tv/
						mayInvalid: data.trakt_may_invalid as number | null, // Whether the entry is actually a split cour, which both Trakt and TMDB merge it into one
						season: data.trakt_season as number | null, // Trakt season number, only available for shows
						seasonId: data.trakt_season_id as number | null, // Trakt season ID
						slug: data.trakt_slug as string | null, // Trakt slug
						type: data.trakt_type as "movies" | "shows" | null, // Trakt media type, can be movie or show
					};
				},
				async getAnilistId(type: "shows" | "movies", traktId: number, season?: number) {
					const res = await ctx.fetch(`https://animeapi.my.id/trakt/${type}/${traktId}${typeof season === "number" ? `/seasons/${season}` : ""}`);
					if (!res.ok) throw new Error(res.statusText);

					const data = await res.json();
					return data.anilist as number | null;
				},
				// for anilist_status:PLANNING, needs to be manually removed if anilist_status is changed (or ask user)
				async syncWatchlist(body: $traktsync.SyncPayload, action: "add" | "remove") {
					const endpoint = action === "add" ? "/sync/watchlist" : "/sync/watchlist/remove";
					const res = await application.fetch(endpoint, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(body),
					});

					if (!res.ok) throw new Error(res.statusText);
					return res.json() as $traktsync.TraktSyncResponse;
				},
				// equivalent method for when deleting an entry on anilist
				async syncHistory(body: $traktsync.SyncPayload, action: "add" | "remove") {
					const endpoint = action === "add" ? "/sync/history" : "/sync/history/remove";
					const res = await application.fetch(endpoint, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(body),
					});

					if (!res.ok) throw new Error(res.statusText);
					return res.json() as $traktsync.TraktSyncResponse;
				},
				// for adding/removing score
				async syncRating<T extends "add" | "remove">(
					body: T extends "add" ? $traktsync.RatingAddPayload : $traktsync.RatingRemovePayload,
					action: T,
					anilistRating: boolean = true,
				) {
					if (action === "add" && anilistRating === true) {
						for (const type of ["movies", "shows"] as const) {
							body[type] = (body as $traktsync.RatingAddPayload)[type]?.map((e) => ({
								...e,
								...(typeof e.rating === "number" && (anilistRating ? { rating: Math.max(1, Math.round((e.rating / 10) * 2) / 2) } : { rating: e.rating })),
							}));
						}
					}

					const res = await application.fetch(action ? "/sync/ratings" : "/sync/ratings/remove", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(body),
					});

					if (!res.ok) throw new Error(res.statusText);
					return res.json() as $traktsync.TraktSyncResponse;
				},
			},
			playback: {
				fetchingTraktId: ctx.state<boolean>(false),
				state: ctx.state<$traktsync.ApplicationPlaybackState | null>(null),
				playing: ctx.state<boolean>(false),
				currentIntervalCancelFunction: ctx.state<Function>(() => 0),
				async scrobble(action: "start" | "pause" | "stop", payload: $traktsync.ScrobbleRequestBody) {
					const res = await application.fetch(`/scrobble/${action}`, {
						method: "POST",
						headers: await application.withAuthHeaders(),
						body: JSON.stringify(payload),
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

					return res.json() as $traktsync.ScrobbleResponseBody;
				},
			},
			async withAuthHeaders(): Promise<Record<string, string>> {
				if (!this.token.getAccessToken()) {
					await this.token.refresh();
				}
				return {
					Authorization: `Bearer ${this.token.accessToken.get()}`,
					"Content-Type": "application/json",
					"User-Agent": this.userAgent,
					"trakt-api-version": "2",
					"trakt-api-key": this.clientId,
				};
			},
			async fetch(path: string, init: RequestInit = {}) {
				const res = await ctx.fetch(this.baseUri + path.replace(/^\/+/, ""), {
					...init,
					headers: {
						...(await this.withAuthHeaders()),
						...(init.headers as Record<string, string>),
					},
				} as FetchOptions);

				if (res.ok) {
					this.connection.success.set(this.connection.success.get() + 1);
					this.connection.lastState.set(`Success (${res.status})`);
				} else {
					this.connection.fail.set(this.connection.fail.get() + 1);
					this.connection.lastState.set(`Failed (${res.status})`);
				}

				// Capture rate-limit headers if present
				const limit = parseInt(res.headers["X-RateLimit-Limit"] ?? "0", 10);
				const remaining = parseInt(res.headers["X-RateLimit-Remaining"] ?? "0", 10);
				const reset = parseInt(res.headers["X-RateLimit-Reset"] ?? "0", 10);

				if (limit && remaining && reset) {
					this.rateLimit.set({ limit, remaining, reset });
				}

				return res;
			},
		};

		const tabs = {
			current: ctx.state<Tab>(Tab.Logon),
			currentOverlay: ctx.state<any[] | null>(null),

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
				options: { title: string; desc: string; icon: string; value: string; disabled?: boolean }[];
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
											tray.text(option.title, { className: "font-medium break-normal text-pretty" }),
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
								((params.value !== undefined ? params.value : params.fieldRef?.current) === option.value ? " border-[--brand]" : "") +
								(option.disabled ? " opacity-50 pointer-events-none" : ""),
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
					title: "TraktSync Logs",
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

			[Tab.Logon]() {
				// login details
				const error = state.loginError.get()
					? tray.text(state.loginError.get() ?? "", {
							className: "break-normal bg-red-600/70 text-red-100 text-sm border border-red-500 rounded-md mb-4 px-2 py-1 line-clamp-3",
						})
					: [];

				const info = tray.text(
					"Click the button below to authorize the application, then copy the token from the website and paste it into the field below.",
					{
						style: {
							textAlign: "center",
							wordBreak: "normal",
						},
					},
				);

				if (!application.currentAuthUrl.get()) {
					application.token.generateAuthUrl();
				}

				const authButton = tray.anchor({
					text: "Authorize",
					href: application.currentAuthUrl.get() ?? "",
					target: "_blank",
					// prettier-ignore
					className: "UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border bg-gray-100 border-transparent hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 h-10 px-4 no-underline",
					style: {
						pointerEvents: state.loggingIn.get() ? "none" : "auto",
						opacity: state.loggingIn.get() ? "0.5" : "1",
						width: "100%",
					},
				});

				const authToken = tray.input({
					label: "\u200b",
					placeholder: "Auth Code",
					fieldRef: fieldRefs.traktAuthCode,
					disabled: state.loggingIn.get(),
					style: {
						color: "var(--background)",
						background: "var(--foreground)",
						borderRadius: "0.5rem",
					},
				});

				const login = tray.button({
					label: "Login",
					intent: "primary",
					size: "md",
					loading: state.loggingIn.get(),
					style: {
						width: "100%",
					},
					onClick: ctx.eventHandler("traktsync:login", async () => {
						if (!fieldRefs.traktAuthCode.current.trim().length) {
							state.loginError.set("Error: Please enter your Auth code");
							return;
						} else {
							state.loginError.set(null);
						}

						// start logging in
						state.loggingIn.set(true);
						try {
							await application.token.exchangeCode(fieldRefs.traktAuthCode.current);

							log.sendSuccess("login > Successfully logged in!");

							log.send("login > Fetching user info (wait: 5000 ms)");
							await $_wait(5000);
							const data = await application.userInfo.fetch();

							log.sendSuccess("login > Successfully fetched user info!");
							log.send(`login > Welcome ${data.name}!`);
							tabs.current.set(Tab.Landing);
							fieldRefs.traktAuthCode.setValue("");
						} catch (e) {
							await $_wait(2_000);
							state.loginError.set(`Error: ${(e as Error).message}`);
							log.sendError("login > Login failed: " + (e as Error).message);
						} finally {
							state.loggingIn.set(false);
						}
					}),
				});

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
							tray.flex(
								[
									tray.div([], {
										style: { backgroundImage: `url(${icons.get("trakt_logo")})` },
										className: "w-12 h-12 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
									}),
									tray.span("trakt", { className: "mr-1 text-4xl font-bold" }),
								],
								{ className: "justify-center" },
							),
							tray.text("for Seanime", {
								style: { marginTop: "-1rem", paddingInlineStart: "3rem" },
								className: "text-sm text-center text-[--muted]",
							}),
						],
						{ className: "justify-center mt-3", gap: 0 },
					),
					tray.stack([error, info, authButton, authToken, tray.flex([logs, login], { className: "w-full" })], {
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
					title: "TraktSync Notifications",
					className: "max-w-xl",
					onOpenChange: ctx.eventHandler("traktsync:notification:modalchange", ({ open }) => notifications.modalOpened.set(open)),
					items: [
						tray.flex([
							tray.button("Mark all as Read", {
								intent: "gray-subtle",
								size: "md",
								className: "w-fit bg-transparent border",
								style: { borderColor: "var(--border)" },
								disabled: notifications.unreads.get() <= 0,
								onClick: ctx.eventHandler("traktsync:notifications:markread", () => {
									const entries = $storage.get<$traktsync.Notification[]>(notifications.id) ?? [];
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
								onClick: ctx.eventHandler("traktsync:notifications:deleteall", () => {
									$storage.set(notifications.id, []);
									notifications.unreads.set(0);
								}),
							}),
						]),
						tray.div([notifications.modalOpened.get() ? notifications.formattedEntry : tabs.spinner()], { className: "max-h-[40rem] overflow-scroll" }),
					],
				});

				const cachedUserInfo = application.userInfo.cache.get();

				const profile = tray.div(
					[
						tray.img({
							src: cachedUserInfo?.images?.avatar?.full ?? icons.get("person"),
							width: "70%",
							alt: "Profile",
							className: "absolute pointer-events-none rounded-full",
							style: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
						}),
						tray.tooltip(tray.button("\u200b", { className: "w-10 h-10 rounded-full bg-transparent ", intent: "gray-subtle" }), { text: "Profile" }),
					],
					{ className: "relative w-10 h-10" },
				);

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
									href: `https://trakt.tv/users/${cachedUserInfo?.name}`,
									className: "no-underline",
								}),
							],
							{ disabled: !cachedUserInfo?.name },
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
								onClick: ctx.eventHandler("traktsync:signout:modal", () => {
									// Can't combine tray.dropdown + tray.modal yet
									tabs.confirmationModal("Sign out from TraktSync?", "Are you sure you want to sign out?", "alert", () => {
										log.sendInfo("logout > Logging out");
										state.loggingOut.set(true);

										// $storage.remove(notifications.id);
										// log.send("logout > Notifications cache cleared");

										application.token.set(null);
										log.send("logout > Removed account token");

										application.userInfo.cache.set(null);
										log.send("logout > Userinfo cache cleared");

										state.syncing.set(false);
										log.send("logout > Stopping pending/active manual sync");

										ctx.toast.success("Logged out of TraktSync");
										log.sendSuccess("logout > Logged out of TraktSync");

										tabs.current.set(Tab.Logon);
										state.loggingOut.set(false);
									});
								}),
							},
						),
					],
				});

				const header = tray.flex([
					tray.stack(
						[
							tray.flex([
								tray.div([], {
									style: { backgroundImage: `url(${icons.get("trakt_logo")})` },
									className: "w-12 h-12 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
								}),
								tray.span("trakt", { className: "mr-1 text-4xl font-bold" }),
							]),
							tray.text("for Seanime", {
								style: { marginTop: "-1rem", paddingInlineStart: "3.5rem" },
								className: "text-sm text-[--muted]",
							}),
						],
						{ className: "flex-1", gap: 0 },
					),
					tray.flex([notification, profileDropdown], { gap: 2 }),
				]);

				const body = tray.stack(
					[
						tray.div(
							[
								tray.text("Welcome,", { className: "font-semibold" }),
								tray.text(cachedUserInfo?.name ?? "Username", { className: "font-bold text-3xl line-clamp-1", style: { maxWidth: "25rem" } }),
							],
							{
								className: "relative rounded p-3 mb-3",
								style: { background: "linear-gradient(45deg, #E54820, #B32EE6)" },
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
									description: "Manually sync AniList and Trakt trackers",
									className: "max-w-2xl",
									items: [
										tabs.select({
											heading: "Direction",
											description: "Choose which tracker to sync to and from",
											fieldRef: fieldRefs.manageListJobtype,
											disabled: state.syncing.get() || state.cancellingSync.get(),
											options: [
												{
													title: "Sync to Trakt",
													desc: "Bring your AniList entries over to Trakt",
													icon: icons.get("trakt_logo", { fill: "#9f92ff" }),
													value: ManageListJobType.Import,
												},
												{
													title: "Sync to AniList",
													desc: "Bring your Trakt entries over to AniList (coming soon)",
													icon: icons.get("anilist", { fill: "#9f92ff" }),
													value: ManageListJobType.Export,
													disabled: true,
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
													desc: "Sync Manga Entries (Not available)",
													icon: icons.get("book", { fill: "#9f92ff" }),
													value: "Manga",
													disabled: true,
												},
											],
										}),
										tabs.select({
											heading: "Sync Type",
											description: "Choose the method of syncing",
											fieldRef: fieldRefs.manageListSyncType,
											disabled: state.syncing.get() || state.cancellingSync.get(),
											options: [
												{
													title: "Merge & Update",
													desc: "Adds missing items and updates existing ones. Items not in the source list remain untouched. Safe for regular syncing.",
													icon: icons.get("plusCircleDotted", { fill: "#9f92ff" }),
													value: ManageListSyncType.Post,
												},
												{
													title: "Full Mirror (Destructive)",
													desc:
														"Makes target list an exact copy of source. Adds missing, updates existing, and DELETES any items not in source. Recommended: Backup your target tracker first as this action cannot be undone.",
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
											onClick: ctx.eventHandler("traktsync:manage-list-start-job", () => {
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
								this.button(
									{ icon: icons.get("play"), tooltip: "Watchlist" },
									{ size: "md", className: "bg-no-repeat bg-center p-0", style: { width: "103.5px" }, disabled: true },
								),
								this.button(
									{ icon: icons.get("play"), tooltip: "Watched List" },
									{ size: "md", className: "bg-no-repeat bg-center p-0", style: { width: "103.5px" }, disabled: true },
								),
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
								onChange: ctx.eventHandler("traktsync:skip-adult", (e) => {
									$storage.set("traktsync:options-skipAdult", e.value);
								}),
							}),
							tray.switch("Disable badge for non-critical notifications", {
								fieldRef: fieldRefs.suppressNotificationBadge,
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("traktsync:suppress-notification-badge", (e) => {
									$storage.set("traktsync:options-suppressnotificationbadge", e.value);
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
											href: `https://github.com/nnotwen/n-seanime-extensions/blob/master/plugins/TraktSync/${item.slug}.md`,
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

			// Wrapper to retrieve the current tab
			get() {
				return this[this.current.get()]();
			},
		};

		// Scrobbler
		ctx.effect(() => {
			if (application.playback.playing.get() === false) {
				log.send("scrobbler > stopping playback scrobbler.");
				application.playback.currentIntervalCancelFunction.get()();

				const state = application.playback.state.get();
				if (!state) return log.sendWarning("scrobbler > stop signal received but playback state was null.");

				application.playback.state.set(null);
				const payload: $traktsync.ScrobbleRequestBody = {
					[state.type]: { ids: { trakt: state.traktId } },
					progress: state.progress,
					...(state.episode && state.season && { episode: { season: state.season, number: state.episode } }),
				};

				log.send(`scrobbler > sending request="POST" @api/scrobble/stop payload=${JSON.stringify(payload)}`);
				let status: "error" | "success" = "error";
				application.playback
					.scrobble("stop", payload)
					.then(() => {
						log.sendSuccess("scrobbler > request accepted");
						status = "success";
					})
					.catch((err) => log.sendError(`scrobbler > ${err.message}`))
					.finally(() => {
						if (state.progress > 80)
							notifications.push({
								title: state.title,
								body: {
									status,
									type: "progress",
									metadata: { image: state.coverImage },
									payload: { progress: state.episode ?? 1 },
								},
							});
					});
			} else {
				const state = application.playback.state.get();
				if (!state) {
					log.sendWarning("scrobbler > start signal received but playback state was null.");
				} else {
					log.send(`scrobbler > scrobbling ${state.title} type="${state.type}" episode="${state.episode ?? "N/A"}" season=${state.season ?? "N/A"}`);
				}

				application.playback.currentIntervalCancelFunction.set(
					// Polling function for the scrobbler / executes every 10 seconds
					() =>
						ctx.setInterval(() => {
							const state = application.playback.state.get();
							if (!state) return log.sendWarning("scrobbler > polling scrobbler but playback state was null.");

							if (!state.traktId) return log.sendWarning(`scrobbler > no equivalent trakt Id found for ${state.title}.`);

							const payload: $traktsync.ScrobbleRequestBody = {
								[state.type]: { ids: { trakt: state.traktId } },
								progress: state.progress,
								...(state.episode && state.season && { episode: { season: state.season, number: state.episode } }),
							};

							const action = state.paused ? "pause" : "start";
							log.send(`scrobbler > sending request="POST" @api/scrobble/${action} payload=${JSON.stringify(payload)}`);
							application.playback
								.scrobble(action, payload)
								.then(() => log.sendSuccess("scrobbler > request accepted"))
								.catch((err) => log.sendError(`scrobbler > ${err.message}`));
						}, 10_000),
				);
			}
		}, [application.playback.playing]);

		// Fires every 1-3 seconds, updates the application.playback.state data
		ctx.playback.registerEventListener(async (event) => {
			if (event.isVideoCompleted || event.isVideoStopped || event.isStreamCompleted || event.isVideoStopped) {
				application.playback.playing.set(false);
			}

			if (!application.playback.state.get() && !application.playback.fetchingTraktId.get()) {
				log.send("scrobbler > start: Fetching mapping data");

				application.playback.fetchingTraktId.set(true);
				const traktIds = await application.list.getTraktId(event.state.mediaId).catch((e) => e as Error);
				application.playback.fetchingTraktId.set(false);
				if (traktIds instanceof Error) return log.sendError(`scrobbler > mapping error for anilist/${event.state.mediaId}: ${traktIds.message}`);

				application.playback.state.set({
					traktId: traktIds.id ?? null,
					type: traktIds.type === "movies" ? "movie" : "show",
					progress: event.status.completionPercentage * 100,
					paused: event.status.paused,
					title: event.state.mediaTitle,
					episode: event.state.episodeNumber,
					coverImage: event.state.mediaCoverImage,
					...(traktIds.season && { season: traktIds.season }),
				});

				// Start scrobbler with slight debounce
				ctx.setTimeout(() => application.playback.playing.set(true), 500);
			} else {
				application.playback.state.set({
					...application.playback.state.get()!,
					progress: event.status.completionPercentage * 100,
				});
			}
		});

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

		function generateRandomUUID() {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
				((((Math.random() * 16) | 0) & (c == "x" ? 15 : 3)) | (c == "x" ? 0 : 8)).toString(16),
			);
		}

		async function getMedia(mediaId: number) {
			const [animeRes] = await Promise.allSettled([ctx.anime.getAnimeEntry(mediaId)]);

			if (animeRes.status === "fulfilled" && animeRes.value) {
				return { type: "Anime" as const, media: animeRes.value.media, listData: animeRes.value.listData };
			}

			return null;
		}

		function isCustomSource(mediaId?: number) {
			return (mediaId ?? 0) >= 2 ** 31;
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

		function reduceToNonZero(data: $traktsync.TraktSyncResponse): DeepPartial<$traktsync.TraktSyncResponse> {
			const result: any = {};

			for (const category of ["added", "deleted", "updated"] as const) {
				const categoryData = data[category];
				if (!categoryData) continue;

				const nonZeroEntries = Object.entries(categoryData).filter(([_, value]) => value > 0);
				if (nonZeroEntries.length > 0) {
					result[category] = Object.fromEntries(nonZeroEntries);
				}
			}

			if (data.not_found) {
				const notFoundEntries = Object.entries(data.not_found).filter(([_, items]) => items.length > 0);
				if (notFoundEntries.length > 0) {
					result.not_found = Object.fromEntries(notFoundEntries);
				}
			}

			return result;
		}

		async function syncEntries() {
			const jobType = fieldRefs.manageListJobtype.current;
			const mediaType = "Anime";
			const syncType = fieldRefs.manageListSyncType.current;
			const notifUpdt = { entries: 0, errors: 0, skips: 0, updates: 0, job_type: jobType, media_type: mediaType, sync_type: syncType };

			// Anilist ➔ Trakt
			if (jobType === ManageListJobType.Import) {
				log.sendInfo("synclist > Starting sync job... (Anilist ➔ Trakt)");
				const entries = getAnilistEntries(mediaType);
				if (!entries.length) {
					log.sendWarning("synclist > No entries found.");
					log.sendInfo("synclist > Sync job aborted.");
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "No entries found" },
					});
					return state.syncing.set(false);
				} else {
					log.sendInfo(`synclist > Found ${entries.length} entries in AniList!`);
					notifUpdt.entries = entries.length;
				}

				const payloads = {
					watchlist_add: {} as $traktsync.SyncPayload,
					watchlist_remove: {} as $traktsync.SyncPayload,
					history_add: {} as $traktsync.SyncPayload,
					history_remove: {} as $traktsync.SyncPayload,
					rating_add: {} as $traktsync.RatingAddPayload,
					rating_remove: {} as $traktsync.RatingRemovePayload,
					getLength(prop: Exclude<keyof typeof this, "getLength">): number {
						return Object.values(this[prop]).reduce((acc, curr: any[]) => acc + curr.length, 0);
					},
				};

				// Processing multiple entries for batching
				log.sendInfo(`synclist > Preparing entries for batching...`);
				while (state.syncing.get() && entries.length) {
					const entry = entries.pop();

					if (!entry?.mediaId) continue;

					const title = entry?.title;
					const traktIds = await application.list.getTraktId(entry.mediaId).catch((e) => (e as Error).message);
					await $_wait(1_500);
					if (typeof traktIds === "string") {
						log.sendError(`synclist > Error encountered on mapping API for ${title} (${entry.mediaId}): ${traktIds}`);
						notifUpdt.errors++;
						continue;
					} else if (!traktIds.id || !traktIds.type) {
						log.sendWarning(`synclist > No matching records on trakt for ${title} (${entry.mediaId})`);
						notifUpdt.skips++;
						continue;
					} else if (traktIds.mayInvalid) {
						log.sendWarning(`synclist > Part of a multi-cour series. Please manually add this entry to trakt: ${JSON.stringify(entry)}`);
						notifUpdt.skips++;
						continue;
					}

					if (unwrap(entry.private)) {
						log.send(`synclist > Skipped ${title} (private)...`);
						notifUpdt.skips++;
						continue;
					}

					if (entry.status === "PLANNING") {
						// Add in trakt watchlist
						if (!(traktIds.type in payloads.watchlist_add)) payloads.watchlist_add[traktIds.type] = [];
						payloads.watchlist_add[traktIds.type]!.push({
							ids: { trakt: traktIds.id },
							...(typeof traktIds.season === "number" && {
								seasons: [{ number: traktIds.season }],
							}),
						});
						// Do not touch history
					} else {
						// remove from trakt watchlist
						if (!(traktIds.type in payloads.watchlist_remove)) payloads.watchlist_remove[traktIds.type] = [];
						payloads.watchlist_remove[traktIds.type]!.push({
							ids: { trakt: traktIds.id },
							...(typeof traktIds.season === "number" && {
								seasons: [{ number: traktIds.season }],
							}),
						});
						// Add to trakt history (If trakt has higher watched progress than episode, it wont get overwritten)
						// caould not sync startedAt, completedAt: no relevant field in trakt
						if (!(traktIds.type in payloads.history_add)) payloads.history_add[traktIds.type] = [];
						payloads.history_add[traktIds.type]!.push({
							ids: { trakt: traktIds.id },
							...(typeof traktIds.season === "number" && {
								seasons: [
									{
										number: traktIds.season,
										...(typeof entry.progress === "number" && {
											episodes: Array.from({ length: entry.progress }, (_, idx) => ({ number: idx + 1 })),
										}),
									},
								],
							}),
						});
					}

					// Sync scores
					if (typeof entry.score === "number") {
						if (typeof traktIds.seasonId === "number") {
							if (!("seasons" in payloads.rating_add)) payloads.rating_add.seasons = [];
							payloads.rating_add.seasons!.push({ ids: { trakt: traktIds.seasonId }, rating: entry.score });
						} else {
							if (!(traktIds.type in payloads.rating_add)) payloads.rating_add[traktIds.type] = [];
							payloads.rating_add[traktIds.type]!.push({ ids: { trakt: traktIds.id }, rating: entry.score });
						}
					} else {
						if (typeof traktIds.seasonId === "number") {
							if (!("seasons" in payloads.rating_remove)) payloads.rating_remove.seasons = [];
							payloads.rating_remove.seasons!.push({ ids: { trakt: traktIds.seasonId } });
						} else {
							if (!(traktIds.type in payloads.rating_remove)) payloads.rating_remove[traktIds.type] = [];
							payloads.rating_remove[traktIds.type]!.push({ ids: { trakt: traktIds.id } });
						}
					}
				}

				// Batch update
				log.sendInfo(`synclist > Performing sync by batching...`);
				let hasProcessibleEntries = false;
				for (const key of Object.keys(payloads) as (keyof typeof payloads)[]) {
					if (!state.syncing.get()) continue;

					if (key === "getLength") continue;

					hasProcessibleEntries = true;
					const length = payloads.getLength(key);
					if (length <= 0) continue;

					const [endpoint, action] = key.split("_") as ["watchlist" | "history" | "rating", "add" | "remove"];
					const apipath = `sync/${endpoint}/${action === "remove" ? "remove" : ""}`;
					log.send(`synclist > Sending ${length} items to ${apipath}...`);

					let fn;
					switch (key) {
						case "history_add":
							fn = () => application.list.syncHistory(payloads[key], "add");
							break;
						case "history_remove":
							fn = () => application.list.syncHistory(payloads[key], "remove");
							break;
						case "rating_add":
							fn = () => application.list.syncRating(payloads[key], "add");
							break;
						case "rating_remove":
							fn = () => application.list.syncRating(payloads[key], "remove");
							break;
						case "watchlist_add":
							fn = () => application.list.syncWatchlist(payloads[key], "add");
							break;
						case "watchlist_remove":
							fn = () => application.list.syncWatchlist(payloads[key], "remove");
							break;
					}

					await fn()
						.then((data) => log.sendSuccess(`synclist > response from ${apipath}=${JSON.stringify(reduceToNonZero(data))}`))
						.catch((e) => log.sendError(`synclist > error on ${apipath}: ${(e as Error).message}`));

					// Manual throttle (Reduce risk of API ratelimit)
					await $_wait(1_000);
				}

				if (!hasProcessibleEntries) log.sendInfo(`synclist > No entries were processed...`);

				// Fullsync additional operations
				if (syncType === ManageListSyncType.FullSync && state.syncing.get()) {
					log.sendInfo(`synclist > Preparing to remove entries from Trakt (Fullsync Mode)`);

					// Syncing watchlist as status:PLANNED
					log.send("synclist > Querying Trakt watchlist entries...");
					const traktWatchlistEntries = await application.list.fetchAllWatchlist().catch((e) => (e as Error).message);
					if (typeof traktWatchlistEntries === "string") {
						state.syncing.set(false);
						notifications.push({
							title: "Manual Sync Performed",
							body: { ...notifUpdt, remarks: "Error Fetching watchlist entries for fullsync" },
						});
						return log.sendError(`synclist > Terminating syncjob: ${traktWatchlistEntries}`);
					} else {
						log.send(`synclist > Found ${traktWatchlistEntries.length} watchlist entries!`);
						const payload: $traktsync.SyncPayload = {};
						for (const entry of traktWatchlistEntries) {
							const type = "movie" in entry ? "movies" : "shows";
							const traktId = ("movie" in entry ? entry.movie : entry.show).ids.trakt;

							// Individual seasons cannot be retrieved in bulk and have to be checked individually.
							// As this is costly for API, subsequent seasons will be ignored, fullsync will only
							// scan the watchlist at the show level
							const anilistId = await application.list.getAnilistId(type, traktId).catch((e) => (e as Error).message);
							await $_wait(1_000);
							if (typeof anilistId === "string") {
								log.sendError(`synclist > [fullsync] retrieval for anilistId from trakt/${traktId} has failed: ${anilistId}`);
								continue;
							} else if (typeof anilistId !== "number") {
								log.sendWarning(`synclist > [fullsync] trakt/${traktId} has no equivalent media on AniList.`);
								continue;
							}

							const media = await getMedia(anilistId).catch((e) => (e as Error).message);
							if (typeof media === "string") {
								log.sendError(`synclist > [fullsync] retrieval for media of anilist/${anilistId} has failed: ${media}`);
								continue;
							} else if (!media) {
								log.sendWarning(`synclist > [fullsync] seanime could not retrieve the media anilist/${anilistId} (media=null)`);
								continue;
							}

							// If equivalent media from watchlist is not in list or not planning, remove from watchlist
							if (!media.listData || media.listData.status !== "PLANNING") {
								if (!payload[type]) payload[type] = [];
								payload[type]!.push({ ids: { trakt: traktId } });
								log.send(`synclist > [fullsync] removing ${media.media?.title?.userPreferred} from user watchlist (traktId=${traktId}) (batched)`);
							}
						}

						const payloadSize = Object.values(payload).reduce((acc, curr) => acc + curr.length, 0);
						if (payloadSize > 0) {
							log.send(`synclist > [fullsync] removing ${payloadSize} watchlist entries from trakt...`);
							await application.list
								.syncWatchlist(payload, "remove")
								.then((data) => log.sendSuccess(`synclist > [fullsync] sync/watchlist/remove response=${JSON.stringify(reduceToNonZero(data))}`))
								.catch((e) => log.sendError(`synclist > error on  sync/watchlist/remove: ${(e as Error).message}`));
							await $_wait(1_000);
						} else {
							log.send(`synclist > [fullsync] no update found for watchlist entries~`);
						}
					}

					const traktWatchedEntries = await application.list.fetchAllWatched().catch((e) => (e as Error).message);
					if (typeof traktWatchedEntries === "string") {
						state.syncing.set(false);
						notifications.push({
							title: "Manual Sync Performed",
							body: { ...notifUpdt, remarks: "Error Fetching watched entries for fullsync" },
						});
						return log.sendError(`synclist > Terminating syncjob: ${traktWatchedEntries}`);
					} else {
						log.send(`synclist > Found ${traktWatchedEntries.length} watched entries!`);
						const payload: $traktsync.SyncPayload = {};
						for (const entry of traktWatchedEntries) {
							const type = "movie" in entry ? "movies" : "shows";
							const traktId = ("movie" in entry ? entry.movie : entry.show).ids.trakt;
							const seasons = "show" in entry ? (entry.show.seasons?.map((s) => s.number) ?? [undefined]) : [undefined];

							const payload_seasons = [];
							for (const season of seasons) {
								const anilistId = await application.list.getAnilistId(type, traktId, season).catch((e) => (e as Error).message);
								await $_wait(1_000);
								if (typeof anilistId === "string") {
									log.sendError(
										`synclist > [fullsync] retrieval for anilistId from trakt/${traktId}${season ? `/season/${season}` : ""} has failed: ${anilistId}`,
									);
									continue;
								} else if (typeof anilistId !== "number") {
									log.sendWarning(`synclist > [fullsync] trakt/${traktId} has no equivalent media on AniList.`);
									continue;
								}

								const media = await getMedia(anilistId).catch((e) => (e as Error).message);
								if (typeof media === "string") {
									log.sendError(`synclist > [fullsync] retrieval for media of anilist/${anilistId} has failed: ${media}`);
									continue;
								} else if (!media) {
									log.sendWarning(`synclist > [fullsync] seanime could not retrieve the media anilist/${anilistId} (media=null)`);
									continue;
								}

								// If equivalent media from watchlist is not in list or still planning, remove from history
								if (!media.listData || media.listData.status === "PLANNING") {
									if (typeof season === "number") {
										payload_seasons.push(season);
									} else {
										if (!payload[type]) payload[type] = [];
										payload[type]!.push({ ids: { trakt: traktId } });
										log.send(`synclist > [fullsync] removing ${media.media?.title?.userPreferred} from user history (traktId=${traktId}) (batched)`);
									}
								}
							}

							if (payload_seasons.length) {
								if (!payload[type]) payload[type] = [];
								payload[type]!.push({ ids: { trakt: traktId } });
								log.send(`synclist > [fullsync] removing multi-season (seasons=${payload_seasons}) media from user history (traktId=${traktId}) (batched)`);
							}
						}

						const payloadSize = Object.values(payload).reduce((acc, curr) => acc + curr.length, 0);
						if (payloadSize > 0) {
							log.send(`synclist > [fullsync] removing ${payloadSize} history entries from trakt...`);
							await application.list
								.syncHistory(payload, "remove")
								.then((data) => log.sendSuccess(`synclist > [fullsync] sync/history/remove response=${JSON.stringify(reduceToNonZero(data))}`))
								.catch((e) => log.sendError(`synclist > error on  sync/history/remove: ${(e as Error).message}`));
							await $_wait(1_000);
						} else {
							log.send(`synclist > [fullsync] no update found for history entries~`);
						}
					}
				}
			}

			// Trakt ➔ Anilist
			if (jobType === ManageListJobType.Export) {
				log.sendInfo("synclist > Starting sync job... (Trakt ➔ Anilist)");

				// Sync anime watchlists
				log.send("synclist > retrieving watchlist (for status=PLANNED)");
				const traktWatchlistEntries = await application.list.fetchAllWatchlist().catch((e) => (e as Error).message);
				if (typeof traktWatchlistEntries === "string") {
					state.syncing.set(false);
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "Error Fetching watchlist entries" },
					});
					return log.sendError(`synclist > Terminating syncjob: ${traktWatchlistEntries}`);
				} else {
					log.send(`synclist > Found ${traktWatchlistEntries.length} watchlist entries!`);
					for (const entry of traktWatchlistEntries) {
						const type = "movie" in entry ? "movies" : "shows";
						const traktId = ("movie" in entry ? entry.movie : entry.show).ids.trakt;

						// Individual seasons cannot be retrieved in bulk and have to be checked individually.
						// As this is costly for API, subsequent seasons will be ignored, synclist will only
						// scan the watchlist at the show level
						const anilistId = await application.list.getAnilistId(type, traktId).catch((e) => (e as Error).message);
						await $_wait(1_000);
						if (typeof anilistId === "string") {
							log.sendError(`synclist > [fullsync] retrieval for anilistId from trakt/${traktId} has failed: ${anilistId}`);
							continue;
						} else if (typeof anilistId !== "number") {
							log.sendWarning(`synclist > [fullsync] trakt/${traktId} has no equivalent media on AniList.`);
							continue;
						}

						// Mark the entry as planning on AniList
						// Check first if media exists in MediaListCollection, if found, use libraryId for the mutation
						// If media does not exist in user's MediaListCollection, use mediaId for the mutation
						const media = await getMedia(anilistId).catch((e) => (e as Error).message);
					}
				}

				// Sync anime watched (show.progress === 100 -> COMPLETED, movie.progress > 80 -> COMPLETED)
				// (show|movie).lastWatchedAt - Date.now() < 3 months ? WATCHING : PAUSED;
				log.send("synclist > retrieving watched list (for status=COMPLETED|PAUSED)");
				const traktWatchedEntries = await application.list.fetchAllWatchlist().catch((e) => (e as Error).message);
				if (typeof traktWatchedEntries === "string") {
					state.syncing.set(false);
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "Error Fetching watched entries" },
					});
					return log.sendError(`synclist > Terminating syncjob: ${traktWatchedEntries}`);
				} else {
					log.send(`synclist > Found ${traktWatchedEntries.length} watchlist entries!`);
				}

				if (syncType === ManageListSyncType.FullSync && state.syncing.get()) {
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

		// List update on single entry
		$store.watch("POST_UPDATE_ENTRY", async (e: Omit<$app.PostUpdateEntryEvent, "next">) => {
			if (!e.mediaId) return log.sendWarning("update > missing mediaId");

			if (fieldRefs.disableSyncing.current) return log.sendWarning(`update > Syncing was disabled. Will not sync anilist/${e.mediaId}`);

			const data: Omit<$app.PreUpdateEntryEvent, "next" | "preventDefault"> | undefined = $store.get("PRE_UPDATE_ENTRY_DATA");
			if (!data) {
				return log.sendWarning("update > No update data was emitted from the pre update hooks!");
			} else if (data.mediaId !== e.mediaId) {
				return log.sendWarning("update > mediaId mismatch found from preUpdate to postUpdate hooks!");
			} else {
				$store.set("PRE_UPDATE_ENTRY_DATA", null);
			}

			const entry = await getMedia(data.mediaId);
			if (!entry || !entry.media) return log.sendWarning(`update > AnimeMedia not found (${data.mediaId})`);

			if (unwrap(getAnilistEntries(entry.type).find((x) => x.mediaId === data.mediaId)?.private)) {
				return log.sendWarning(`update > ${entry.media.title?.userPreferred ?? "anilist-id/" + data.mediaId} is private. Skipping...`);
			}

			const traktIds = await application.list.getTraktId(e.mediaId).catch((e) => e as Error);
			if (traktIds instanceof Error) {
				return log.sendError(`update > ${traktIds.message} `);
			}

			if (!traktIds.id || traktIds.mayInvalid || !traktIds.type) {
				let reason;

				// Cascading reason
				if (!traktIds.type) reason = `anilist/${e.mediaId} expected type from field 'type' is shows|movies. Received type value=${traktIds.type}`;
				if (traktIds.mayInvalid) reason = `anilist/${e.mediaId} media may be part of a cour. flag={ mayInvalid: true }`;
				if (!traktIds.id) reason = `anilist/${e.mediaId} has no corresponding trakt entry.`;

				return log.sendError(`update > ${reason}`);
			}

			const jobqueue: {
				key: Exclude<keyof typeof application.list, "cache" | "getTraktId">;
				fn: (...args: any[]) => Promise<$traktsync.TraktSyncResponse>;
			}[] = [];

			// Scoring
			jobqueue.push({
				key: "syncRating",
				fn: () =>
					application.list.syncRating(
						{
							[traktIds.type!]: [
								{
									ids: { trakt: traktIds.id },
									rating: data.scoreRaw,
								},
							],
						},
						typeof data.scoreRaw === "number" ? "add" : "remove",
						true,
					),
			});

			// Wathclist (for status:PLANNING)
			const watchlist_payload: $traktsync.SyncPayload = {
				[traktIds.type]: [
					{
						ids: { trakt: traktIds.id },
						...(typeof traktIds.season === "number" && {
							seasons: [{ number: traktIds.season }],
						}),
					},
				],
			};
			jobqueue.push({
				key: "syncWatchlist",
				fn: () => application.list.syncWatchlist(watchlist_payload, data.status === "PLANNING" ? "add" : "remove"),
			});

			// progress (reduced episode will not be added, if progress is changed from big to small, i.e. 5 -> 2)
			// trakt will ignore the change
			if (data.status !== "PLANNING") {
				const payload: $traktsync.SyncPayload = {
					[traktIds.type]: [
						{
							ids: { trakt: traktIds.id },
							...(traktIds.type === "shows" &&
								typeof traktIds.season === "number" && {
									seasons: [
										{
											number: traktIds.season,
											...(typeof data.progress === "number" &&
												data.progress > 0 && {
													episodes: Array.from({ length: data.progress }, (_, idx) => ({ number: idx + 1 })),
												}),
										},
									],
								}),
						},
					],
				};

				jobqueue.push({
					key: "syncHistory",
					fn: () => application.list.syncHistory(payload, "add"),
				});
			}

			const endpoints_ok = [],
				endpoionts_bad = [];
			for (const job of jobqueue) {
				job
					.fn()
					.then((data) => {
						log.sendSuccess(`update > request="POST" list.${job.key} response=${JSON.stringify(reduceToNonZero(data))}`);
						endpoints_ok.push(job.key);
					})
					.catch((err) => {
						log.sendError(`update > list.${job.key} error=${(err as Error).message}`);
						endpoionts_bad.push(job.key);
					});
				await $_wait(1_000);
			}

			notifications.push({
				title: entry.media?.title?.userPreferred ?? e.mediaId!.toString(),
				body: {
					type: "update",
					status: endpoionts_bad.length ? "error" : "success",
					metadata: { image: entry.media?.coverImage?.large },
					payload: {
						score: jobqueue.find(({ key }) => key === "syncRating") ? data.scoreRaw : undefined,
						progress: data.progress,
					},
				},
			});
		});

		// Updates when single entry gets removed from list
		$store.watch("POST_DELETE_ENTRY", async (e: Omit<$app.PostDeleteEntryEvent, "next">) => {
			if (!e.mediaId) return log.sendWarning("delete > missing mediaId");

			if (fieldRefs.disableSyncing.current) return log.sendWarning(`delete > Syncing was disabled. Will not sync anilist/${e.mediaId}`);

			const entry = await getMedia(e.mediaId);
			if (!entry) return log.sendWarning(`delete > AnimeMedia not found (${e.mediaId})`);

			const traktIds = await application.list.getTraktId(e.mediaId).catch((e) => e as Error);
			if (traktIds instanceof Error) {
				return log.sendError(`delete > ${traktIds.message} `);
			}

			if (!traktIds.id || traktIds.mayInvalid || !traktIds.type) {
				let reason;

				// Cascading reason
				if (!traktIds.type) reason = `anilist/${e.mediaId} expected type from field 'type' is shows|movies. Received type value=${traktIds.type}`;
				if (traktIds.mayInvalid) reason = `anilist/${e.mediaId} media may be part of a cour. flag={ mayInvalid: true }`;
				if (!traktIds.id) reason = `anilist/${e.mediaId} has no corresponding trakt entry.`;

				return log.sendError(`delete > ${reason}`);
			}

			const payload: $traktsync.SyncPayload = {
				[traktIds.type]: [
					{
						ids: { trakt: traktIds.id },
						...(traktIds.type === "shows" && typeof traktIds.season === "number" && { seasons: { number: traktIds.season } }),
					},
				],
			};

			const endpoints_ok = [],
				endpoionts_bad = [];
			await application.list
				.syncWatchlist(payload, "remove")
				.then((data) => {
					log.sendSuccess(`delete > request="POST" @api/watchlist/remove response=${JSON.stringify(reduceToNonZero(data))}`);
					endpoints_ok.push("watchlist");
				})
				.catch((err) => {
					log.sendError(`delete > @api/watchlist/remove error=${(err as Error).message}`);
					endpoionts_bad.push("watchlist");
				});

			await $_wait(1_000); // Manual throttle

			await application.list
				.syncHistory(payload, "remove")
				.then((data) => {
					log.sendSuccess(`delete > request="POST" @api/history/remove response=${JSON.stringify(reduceToNonZero(data))}`);
					endpoints_ok.push("history");
				})
				.catch((err) => {
					log.sendError(`delete > @api/history/remove error=${(err as Error).message}`);
					endpoionts_bad.push("history");
				});

			notifications.push({
				title: entry.media?.title?.userPreferred ?? e.mediaId!.toString(),
				body: {
					type: "delete",
					status: endpoionts_bad.length ? "error" : "success",
					metadata: { image: entry.media?.coverImage?.large },
					payload: {},
				},
			});
		});

		tray.render(() => tabs.get());

		ctx.effect(() => {
			if (application.userInfo.cache.get() === null) return tray.updateBadge({ number: 1, intent: "alert" });
			if (state.syncing.get()) return tray.updateBadge({ number: 1, intent: "alert" });
			if (notifications.unreads.get() > 0 && fieldRefs.suppressNotificationBadge.current === false)
				return tray.updateBadge({ number: notifications.unreads.get(), intent: "warning" });
			return tray.updateBadge({ number: 0 });
		}, [application.userInfo.cache, state.syncing, notifications.unreads]);

		// Authenticate
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
					log.send(`login > Signed in as: ${data.name}!`);
					if (!data.images.avatar.full) log.sendWarning("login > No user avatar detected! Reverting to default...");
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
					log.sendSuccess("login > Successfully fetched the user info!");
					log.send(`login > Signed in as: ${data.name}!`);
					if (!data.images.avatar.full) log.sendWarning("login > No user avatar detected! Reverting to default...");
					tabs.current.set(Tab.Landing);
				})
				.catch((err: Error) => {
					log.sendError(`login > [Token Refresh Failed] ${err.message}`);
					log.send("login > Session Expired. Please login again.");
					state.loginError.set("Session Expired. Please login again.");
					tabs.current.set(Tab.Logon);
				})
				.finally(() => state.loggingIn.set(false));
		}

		log.sendWarning("login > Refresh token not found!");
		log.sendWarning("login > User authentication required.");
		tabs.current.set(Tab.Logon);
		state.loggingIn.set(false);
		// END OF CODE //
	});

	// UpdateEntryProgress handled by scrobbler
	// UpdateEntryRepeat has no relevant data for trakt
	$app.onPreUpdateEntry((e) => {
		$store.set("PRE_UPDATE_ENTRY_DATA", $clone(e));
		e.next();
	});
	$app.onPostUpdateEntry((e) => {
		$store.set("POST_UPDATE_ENTRY", $clone(e));
		e.next();
	});
	$app.onPostDeleteEntry((e) => {
		$store.set("POST_DELETE_ENTRY", $clone(e));
		e.next();
	});
}
