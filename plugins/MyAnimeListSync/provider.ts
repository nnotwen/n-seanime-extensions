/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./myanimelistsync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/MyAnimeListSync/icon.png";
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
				gears: /*html*/ `
					<svg stroke="#cacaca" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
						<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/>
						<circle cx="12" cy="12" r="3"/>
					</svg>`,
				globe: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
					</svg>`,
				myanimelist: /*html*/ `
					<svg width="1rem" height="1rem" fill="#cacaca" viewBox="200 350 600 240" xmlns="http://www.w3.org/2000/svg">
						<path d="M432.49 410.61V590.3l-44.86-.06V479l-43.31 51.29-42.43-52.44-.43 112.75H256V410.65h47l39.79 54.29 43-54.31zm184.06 44.14.53 135.15h-50.45l-.17-61.25h-59.73c1.49 10.65 4.48 27 8.9 38 3.31 8.13 6.36 16 12.44 24.06l-36.37 24c-7.45-13.57-13.27-28.52-18.73-44.42a198.3 198.3 0 0 1-10.82-46.49c-1.81-16-2.07-31.38 2.28-47.19a83.37 83.37 0 0 1 24.77-39.81c6.68-6.25 16-10.67 23.47-14.66s15.85-5.63 23.62-7.66a158 158 0 0 1 25.41-3.9c8.49-.73 23.62-1.41 51-.6l11.63 37.31h-58.78c-12.65.17-18.73 0-28.61 4.46a47.7 47.7 0 0 0-27.26 41l56.81.7.81-38.61h49.26zM701.72 410v141.35L768 552l-9.17 37.87H656.28V409.33z"/>
					</svg>`,
				myanimelist_logo: /*html*/ `
					<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="477.333" fill="#cacaca" height="85.333" viewBox="0 0 358 64">
						<path d="M163 6.5V12h13.1l-.3-5.3-.3-5.2-6.2-.3-6.3-.3zm-65.7-2C86.3 10 80.5 24.4 83 40.2 84 47 88.2 58 89.7 58c.4 0 2.9-1.6 5.5-3.5l4.7-3.5-1.4-3.4c-.8-1.9-1.9-5.3-2.4-7.5l-.9-4.1H108v14h13V16h-13v9h-5c-2.7 0-5-.3-5-.8 0-1.6 4-7.1 6-8.2 1.2-.7 5.5-1.4 9.6-1.7l7.4-.6V2h-9.3c-8 0-10 .4-14.4 2.5M295 7v5h12V2h-12zM0 27v23h13V23.5l4 6c2.2 3.3 4.4 6 5 6s2.8-2.7 5.1-6l4.1-6-.5 13.2-.4 13.3H43V4H30.2l-3.8 6c-2.2 3.3-4.2 6-4.5 6s-2.3-2.7-4.3-6l-3.7-6H0zm263 0v23h26.8l.6-3.8c.4-2 .9-4.5 1.2-5.5.5-1.5-.3-1.7-7.5-1.7H276V4h-13zm80.8-19.7c-3.3 1.3-4.8 2.5-4.8 3.8 0 1.2-.7 1.9-2 1.9-1.8 0-2 .7-2 6s.2 6 2 6c1.9 0 2 .7 2 10.8 0 13.1.7 14.2 9.1 14.2 5.3 0 5.6-.1 7.2-3.5 2.2-4.6 2.2-4.3-1.5-4.7l-3.3-.3-.3-8.3-.3-8.2h6.1V13h-3.4c-3.3 0-3.5-.2-3.8-3.8l-.3-3.9zM45 14.8c0 .5 3.1 8.2 7 17.2l6.9 16.3-2.9 7.1c-1.7 3.9-3 7.4-3 7.8 0 .5 2.8.8 6.3.8h6.3l7.7-23.9c4.2-13.2 7.7-24.4 7.7-25 0-.7-2.5-1.1-6.3-1.1h-6.2l-2.1 7.7-2.1 7.8-2.3-7.8-2.3-7.7h-7.4c-4 0-7.3.4-7.3.8m195.5.6c-8.1 3-12.2 12-9.6 21.4 2.4 8.9 8.4 13.2 18.7 13.2 5.8 0 5.9-.1 8.2-4l2.3-4h-10.2l3.9-4.7c6.8-8.2 7.7-15.6 2.7-20.3-3.1-2.9-10.4-3.6-16-1.6m8.5 10.9c0 .7-1.3 2.6-2.9 4.1-4.3 4.1-7 1.7-3.5-3.2 1.6-2.4 6.4-3.1 6.4-.9M137.3 15.8l-10.3.3V51h12V37.4c0-13.5 0-13.5 2.3-13.2 2.1.3 2.2.7 2.5 13l.3 12.8h3.3c1.8 0 4.8.3 6.5.6l3.1.6V35.3c0-20.7.6-20.1-19.7-19.5m62.6 0-18.6.2-.6 16.8c-.3 9.2-.4 16.7-.4 16.8.1.1 2.6.4 5.5.7l5.2.6V24h8v13.6c0 12 .2 13.5 1.6 13 .9-.3 3.1-.6 5-.6h3.4V24h8.2l-.3 13-.4 13h11.7l-.4-15c-.3-13.4-.5-15.1-2.3-16.9-2.7-2.5-4.1-2.6-25.6-2.3M163 33.5V51h12V16h-12zm132-.5v17h12V16h-12zm17.2-15.4c-3.8 2.6-3 8.1 2.3 15.3 2.5 3.4 4.5 6.6 4.5 7.1 0 .6-1.8 1-4 1s-4 .3-4 .7.8 2.7 1.8 5.1l1.7 4.4 7.3-.5c13.8-1 15.6-5.3 7.3-18-2.7-4.1-4.7-7.8-4.4-8.1.4-.3 2.4-.6 4.5-.6 4.3 0 4.3.1 2.4-4.5l-1.5-3.5h-7.8c-5.5 0-8.5.5-10.1 1.6"/>
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
			logon = "1",
			landing = "2",
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
			authCode: ctx.fieldRef<string>(""),
			disableSyncing: ctx.fieldRef<boolean>(false),
			skipPrivate: ctx.fieldRef<boolean>($storage.get("malsync:options-skipPrivate")?.valueOf() ?? false),
			manageListJobtype: ctx.fieldRef<ManageListJobType>(ManageListJobType.Import),
			manageListMediaType: ctx.fieldRef<"Anime" | "Manga">("Anime"),
			manageListSyncType: ctx.fieldRef<ManageListSyncType>(ManageListSyncType.Patch),
			deletePrivateEntries: ctx.fieldRef<boolean>(false),
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

		const notifications: $malsync.NotificationManager = {
			id: "159ea4fe-5a29-485c-96a6-d236c0f04876",
			unreads: ctx.state<number>(0),
			get entries() {
				return this.modalOpened.get() ? ($storage.get<$malsync.NotificationManager["entries"]>(this.id) ?? []) : undefined;
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
												notifications.unreads.set(($storage.get(notifications.id) ?? []).filter((x: $malsync.Notification) => x.unread).length);
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
														const entries = $storage.get<$malsync.NotificationManager["entries"]>(notifications.id);
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
		notifications.unreads.set(($storage.get<$malsync.NotificationManager["entries"]>(notifications.id) ?? []).filter((x) => x.unread).length);

		const log = {
			id: "mal:c6d44b38-f7b6-4785-92fd-a30a8fef71b3",
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
			clientId: "204cc9247a57a5750a93787a6fbef485",
			userAgent: "MyAnimeList for Seanime",
			redirectUri: "https://nnotwen.github.io/n-seanime-extensions/plugins/MyAnimeListSync/callback.html",
			baseUri: "https://api.myanimelist.net/v2/",
			currentAuthUrl: ctx.state<string | null>(null),
			legal: {
				terms: ctx.state<string | null>(null),
				privacy: ctx.state<string | null>(null),
				isFetching: ctx.state<boolean>(false),
				async fetch() {
					this.isFetching.set(true);
					return Promise.all([
						ctx.fetch(`https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/MyAnimeListSync/PRIVACY.md`),
						ctx.fetch(`https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/MyAnimeListSync/TERMS.md`),
					])
						.then(([privacy, terms]) => {
							if (!privacy.ok || !terms.ok) throw new Error(!privacy.ok ? privacy.statusText : terms.statusText);
							this.privacy.set(privacy.text());
							this.terms.set(terms.text());
						})
						.finally(() => this.isFetching.set(false));
				},
			},
			token: {
				accessToken: ctx.state<string | null>($storage.get("mal.accessToken") ?? null),
				refreshToken: ctx.state<string | null>($storage.get("mal.refreshToken") ?? null),
				expiresAt: ctx.state<number | null>($storage.get("mal.expiresAt") ?? null),
				tokenType: ctx.state<string | null>($storage.get("mal.tokenType") ?? null),
				set(data: $malsync.RequestAccessTokenResponse | null) {
					const expiresAt = data ? Date.now() + data.expires_in * 1000 : null;

					$storage.set("mal.accessToken", data?.access_token ?? null);
					$storage.set("mal.refreshToken", data?.refresh_token ?? null);
					$storage.set("mal.expiresAt", expiresAt);
					$storage.set("mal.tokenType", data?.token_type ?? null);

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

				generateAuthUrl() {
					const { verifier, challenge } = PKCE.generatePair();
					$store.set("mal:auth.verifier", challenge);

					const url = new URL("https://myanimelist.net/v1/oauth2/authorize");
					url.searchParams.set("response_type", "code");
					url.searchParams.set("client_id", application.clientId);
					url.searchParams.set("redirect_uri", application.redirectUri);
					url.searchParams.set("code_challenge", challenge);
					url.searchParams.set("code_challenge_method", "plain"); // MAL does not support S256
					application.currentAuthUrl.set(url.toString());
				},

				async exchangeCode(code: string) {
					const codeVerifier = $store.get("mal:auth.verifier");
					if (!codeVerifier) throw new Error("No verifier was set!");

					const res = await ctx.fetch("https://myanimelist.net/v1/oauth2/token", {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							code,
							client_id: application.clientId,
							redirect_uri: application.redirectUri,
							grant_type: "authorization_code",
							code_verifier: codeVerifier,
						} satisfies $malsync.RequestAccessTokenBody),
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

					$store.set("mal:auth.verifier", undefined);
					application.currentAuthUrl.set(null);

					const data: $malsync.RequestAccessTokenResponse = await res.json();
					this.set(data);
					return data;
				},

				async refresh() {
					if (!this.refreshToken.get()) throw new Error("No refresh token available");

					const res = await ctx.fetch("https://myanimelist.net/v1/oauth2/token", {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							refresh_token: this.refreshToken.get()!,
							client_id: application.clientId,
							grant_type: "refresh_token",
						} satisfies $malsync.RefreshAccessTokenBody),
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

					const data: $malsync.RequestAccessTokenResponse = await res.json();
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
				id: ctx.state<number | null>(null),
				name: ctx.state<string | null>(null),
				picture: ctx.state<string | null>(null),
				isSupporter: ctx.state<boolean | null>(null),
				// prettier-ignore
				defaultAvatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGQ9Ik0xMSA2YTMgMyAwIDEgMS02IDAgMyAzIDAgMCAxIDYgMCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTAgOGE4IDggMCAxIDEgMTYgMEE4IDggMCAwIDEgMCA4bTgtN2E3IDcgMCAwIDAtNS40NjggMTEuMzdDMy4yNDIgMTEuMjI2IDQuODA1IDEwIDggMTBzNC43NTcgMS4yMjUgNS40NjggMi4zN0E3IDcgMCAwIDAgOCAxIi8+PC9zdmc+",
				async fetch() {
					const res = await application.fetch("users/@me?fields=is_supporter", { method: "GET" });
					if (!res.ok) {
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					const data: $malsync.User = await res.json();
					this.id.set(data.id);
					this.name.set(data.name);
					this.picture.set(data.picture ?? this.defaultAvatar);
					this.isSupporter.set(data.is_supporter ?? null);
					return data;
				},

				reset() {
					this.id.set(null);
					this.name.set(null);
					this.picture.set(null);
					this.isSupporter.set(null);
				},
			},
			list: {
				cache: {
					get anime() {
						return $store.get("malsync:cache:anime") as $malsync.AnimeListEntryWrapper[] | undefined;
					},
					get manga() {
						return $store.get("malsync:cache:manga") as $malsync.MangaListEntryWrapper[] | undefined;
					},
					animeModalOpened: ctx.state<boolean>(false),
					mangaModalOpened: ctx.state<boolean>(false),
					fetching: ctx.state<boolean>(false),
				},

				async patch<T extends "Anime" | "Manga">(
					type: T,
					malId: number,
					body: T extends "Anime" ? $malsync.ListUpdateAnimeBody : $malsync.ListUpdateMangaBody,
				) {
					const normalized = type.toLowerCase() as "anime" | "manga";

					const res = await application.fetch(`${normalized}/${malId}/my_list_status`, {
						method: "PATCH",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)])),
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

					return res.json() as T extends "Anime" ? $malsync.AnimeListEntry : $malsync.MangaListEntry;
				},

				async delete(type: "Anime" | "Manga", malId: number): Promise<boolean> {
					const normalized = type.toLowerCase() as "anime" | "manga";

					const res = await application.fetch(`${normalized}/${malId}/my_list_status`, {
						method: "DELETE",
					});

					if (res.ok) return true;
					if (res.status === 404) return false;

					let err = null;
					try {
						err = res.json();
					} catch {
						err = null;
					}
					throw new Error(err?.message || err?.error || res.statusText);
				},

				async fetchAll<T extends "Anime" | "Manga">(
					type: T,
				): Promise<Array<(T extends "Anime" ? $malsync.AnimeListEntryWrapper : $malsync.MangaListEntryWrapper) & { idMal: number }>> {
					let path: string | null =
						`users/@me/${type.toLowerCase()}list?fields=list_status{comments,num_times_rewatched,num_times_reread},media_type,num_episodes,num_chapters,num_volumes&nsfw=true&limit=1000`;
					const all = [];

					application.list.cache.fetching.set(true);
					while (path) {
						const res = await application.fetch(path, { method: "GET" });
						if (!res.ok) {
							application.list.cache.fetching.set(false);
							throw new Error(`Request failed with status ${res.statusText}`);
						}

						const json: {
							data?: $malsync.AllListEntry[] | null;
							paging?: { next?: string };
						} | null = res.json();

						if (!json || !json.data) {
							application.list.cache.fetching.set(false);
							throw new Error("Invalid MAL response: missing data");
						}

						all.push(...json.data.map((e) => ({ idMal: e.node.id, ...e })));
						path = json.paging?.next?.replace(application.baseUri, "") ?? null;
						await $_wait(2000);
					}

					$store.set(`malsync:cache:${type.toLowerCase()}`, all);
					application.list.cache.fetching.set(false);
					return all as any;
				},
			},
			async withAuthHeaders(): Promise<Record<string, string>> {
				if (!this.token.getAccessToken()) {
					await this.token.refresh();
				}
				return {
					Authorization: `${this.token.tokenType.get()} ${this.token.accessToken.get()}`,
					"Content-Type": "application/json",
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

				return res;
			},
		};

		const tabs = {
			current: ctx.state<Tab>(Tab.logon),
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

			listEntry(entry: $malsync.AnimeListEntryWrapper | $malsync.MangaListEntryWrapper, idx: number) {
				const episodes = "num_episodes_watched" in entry.list_status ? entry.list_status.num_episodes_watched : entry.list_status.num_chapters_read;
				const maxepisodes = "num_episodes" in entry.node ? entry.node.num_episodes : entry.node.num_chapters;

				return tray.flex(
					[
						tray.img({ src: entry.node.main_picture?.medium ?? "", width: "50", className: "rounded" }),
						tray.text(entry.node.title ?? "", { className: "w-[30rem] shrink-0 line-clamp-3 text-left break-normal" }),
						tray.text(`${episodes} / ${maxepisodes || "--"}`),
						tray.text(`${entry.list_status.score} / 10`),
						tray.text(
							entry.list_status.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
							{ className: "break-normal" },
						),
						tray.text(entry.node.media_type.replace(/_/g, " ").toUpperCase(), { className: "break-normal" }),
					],
					{ className: "p-3 text-center items-center text-sm font-semibold " + (idx % 2 === 0 ? "bg-gray-800" : "bg-gray-900") },
				);
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
								onChange: ctx.eventHandler(`malsync:list:${type}:search`, ({ value }) =>
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
									...[...new Set((application.list.cache[type.toLowerCase() as "anime" | "manga"] ?? []).map((x) => x.list_status.status))].map((x) => ({
										label: x.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
										value: x,
									})),
								],
								onChange: ctx.eventHandler(`malsync:list:${type}:status`, ({ value }) =>
									state[`${type.toLowerCase() as "anime" | "manga"}ListStatus`].set(value),
								),
							}),
							tray.select({
								label: "",
								size: "sm",
								value: state[`${type.toLowerCase() as "anime" | "manga"}ListFormat`].get(),
								disabled: application.list.cache.fetching.get(),
								className: "bg-no-repeat w-30",
								options: [
									{ label: "All formats", value: "all" },
									...[...new Set((application.list.cache[type.toLowerCase() as "anime" | "manga"] ?? []).map((x) => x.node.media_type))].map((x) => ({
										label: x.replace(/_/g, " ").toUpperCase(),
										value: x,
									})),
								],
								onChange: ctx.eventHandler(`malsync:list:${type}:mediatype`, ({ value }) =>
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
									onClick: ctx.eventHandler(`malsync:list:${type}:refetch`, () =>
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
							tray.text(type === "Anime" ? "Episodes" : "Chapters"),
							tray.text("Score"),
							tray.text("Status"),
							tray.text("Format"),
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
														(!query.trim().length || a.node.title.toLowerCase().includes(query.toLowerCase())) &&
														(status === "all" || a.list_status.status === status) &&
														(format === "all" || a.node.media_type === format)
													);
												}).map(tabs.listEntry),
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

			logsModal(trigger: any) {
				return tray.modal({
					trigger,
					title: "MyAnimeListSync Logs",
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

			[Tab.logon]() {
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
					fieldRef: fieldRefs.authCode,
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
					onClick: ctx.eventHandler("mal:login", async () => {
						if (!fieldRefs.authCode.current.trim().length) {
							state.loginError.set("Error: Please enter your Auth code");
							return;
						} else {
							state.loginError.set(null);
						}

						// start logging in
						state.loggingIn.set(true);
						try {
							await application.token.exchangeCode(fieldRefs.authCode.current);

							log.sendSuccess("login > Successfully logged in!");

							log.send("login > Fetching user info (wait: 5000 ms)");
							await $_wait(5000);
							const data = await application.userInfo.fetch();

							log.sendSuccess("login > Successfully fetched user info!");
							log.send(`login > Welcome ${data.name}!`);
							tabs.current.set(Tab.landing);
							fieldRefs.authCode.setValue("");
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
							tray.div([], {
								style: { backgroundImage: `url(${icons.get("myanimelist_logo")})` },
								className: "w-full h-10 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
							}),
							tray.text("for Seanime", {
								style: { marginTop: "-8px" },
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

			[Tab.landing]() {
				const ncount = notifications.unreads.get();
				const notification = tray.modal({
					trigger: tray.div([this.button({ icon: icons.get("bell", { ...(ncount > 0 ? { stroke: "#fdba74" } : {}) }), tooltip: "Notifications" })], {
						className: ncount > 0 ? "animate-bounce" : "",
					}),
					title: "MyAnimeListSync Notifications",
					className: "max-w-xl",
					onOpenChange: ctx.eventHandler("malsync:notification:modalchange", ({ open }) => notifications.modalOpened.set(open)),
					items: [
						tray.flex([
							tray.button("Mark all as Read", {
								intent: "gray-subtle",
								size: "md",
								className: "w-fit bg-transparent border",
								style: { borderColor: "var(--border)" },
								disabled: notifications.unreads.get() <= 0,
								onClick: ctx.eventHandler("malsync:notifications:markread", () => {
									const entries = $storage.get<$malsync.Notification[]>(notifications.id) ?? [];
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
								onClick: ctx.eventHandler("malsync:notifications:deleteall", () => {
									$storage.set(notifications.id, []);
									notifications.unreads.set(0);
								}),
							}),
						]),
						tray.div([notifications.modalOpened.get() ? notifications.formattedEntry : tabs.spinner()], { className: "max-h-[40rem] overflow-scroll" }),
					],
				});

				const profile = tray.div(
					[
						tray.img({
							src: application.userInfo.picture.get() ?? icons.get("person"),
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
									href: `https://myanimelist.net/profile/${application.userInfo.name.get()}`,
									className: "no-underline",
								}),
							],
							{ disabled: application.userInfo.name.get() === null },
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
								onClick: ctx.eventHandler("malsync:signout:modal", () => {
									// Can't combine tray.dropdown + tray.modal yet
									tabs.confirmationModal("Sign out from MyAnimeListSync?", "Are you sure you want to sign out?", "alert", () => {
										log.sendInfo("logout > Logging out");
										state.loggingOut.set(true);

										$storage.remove(notifications.id);
										log.send("logout > Notifications cache cleared");

										application.token.set(null);
										log.send("logout > Removed account token");

										application.userInfo.reset();
										log.send("logout > Userinfo cache cleared");

										state.syncing.set(false);
										log.send("logout > Stopping pending/active manual sync");

										ctx.toast.success("Logged out of MyAnimeListSync");
										log.sendSuccess("logout > Logged out of MyAnimeListSync");

										tabs.current.set(Tab.logon);
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
							tray.div([], { className: "bg-no-repeat bg-contain h-9", style: { backgroundImage: `url(${icons.get("myanimelist_logo")})` } }),
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
								tray.text(application.userInfo.name.get() ?? "Username", { className: "font-bold text-3xl line-clamp-1", style: { maxWidth: "25rem" } }),
							],
							{
								className: "relative rounded p-3 mb-3",
								style: { background: "linear-gradient(to right, #1A2E5C, #2E51A2)" },
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
									description: "Manually sync AniList and MyAnimeList trackers",
									className: "max-w-2xl",
									items: [
										tabs.select({
											heading: "Direction",
											description: "Choose which tracker to sync to and from",
											fieldRef: fieldRefs.manageListJobtype,
											disabled: state.syncing.get() || state.cancellingSync.get(),
											options: [
												{
													title: "Sync to MyAnimeList",
													desc: "Bring your AniList entries over to MyAnimeList",
													icon: icons.get("myanimelist", { fill: "#9f92ff" }),
													value: ManageListJobType.Import,
												},
												{
													title: "Sync to AniList",
													desc: "Bring your MyAnimeList entries over to AniList",
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
										fieldRefs.manageListSyncType.current === ManageListSyncType.FullSync
											? tray.switch("Delete private entries", {
													fieldRef: fieldRefs.deletePrivateEntries,
													onChange: ctx.eventHandler("delete-private", ({ value }: { value: boolean }) => fieldRefs.deletePrivateEntries.setValue(value)),
													style: { "--color-brand-500": "255 95 95" },
												})
											: [],
										tray.button({
											label: state.syncing.get() ? "Cancel Manual Sync" : "Start Manual Sync",
											size: "lg",
											intent: state.syncing.get() ? "alert" : "success",
											loading: state.cancellingSync.get(),
											onClick: ctx.eventHandler("malsync:manage-list-start-job", () => {
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
									description: "Viewing your MyAnimeList library (read-only)",
									className: "max-w-5xl",
									items: application.list.cache.animeModalOpened.get() ? tabs.listGroup("Anime") : [tabs.spinner()],
									onOpenChange: ctx.eventHandler("malsync:animelist:onModalOpened", ({ open }) => {
										application.list.cache.animeModalOpened.set(open);
										if (open && !application.list.cache.anime && !application.list.cache.fetching.get())
											application.list
												.fetchAll("Anime")
												.catch((err) => log.sendError(`[AnimeList]: ${err.message}`))
												.finally(() => application.list.cache.fetching.set(false));
									}),
								}),
								tray.modal({
									trigger: this.button(
										{ icon: icons.get("book"), tooltip: "Manga List" },
										{ size: "md", className: "bg-no-repeat bg-center p-0", style: { width: "103.5px" } },
									),
									title: "Manga List",
									description: "Viewing your MyAnimeList library (read-only)",
									className: "max-w-5xl",
									items: application.list.cache.mangaModalOpened.get() ? tabs.listGroup("Manga") : [tabs.spinner()],
									onOpenChange: ctx.eventHandler("malsync:mangalist:onModalOpened", ({ open }) => {
										application.list.cache.mangaModalOpened.set(open);
										if (open && !application.list.cache.manga && !application.list.cache.fetching.get())
											application.list
												.fetchAll("Manga")
												.catch((err) => log.sendError(`[MangaList]: ${err.message}`))
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
								fieldRef: fieldRefs.skipPrivate,
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("malsync:skip-private", (e) => {
									$storage.set("malsync:options-skipPrivate", e.value);
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
											href: `https://github.com/nnotwen/n-seanime-extensions/blob/master/plugins/MyAnimeListSync/${item.slug}.md`,
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

		function toISODate(date?: $app.AL_FuzzyDateInput): string | undefined {
			if (!date || !unwrap(date)) return undefined;
			const year = unwrap(date?.year);

			if (!year) return undefined;
			const month = date.month ?? 1; // default to January if missing
			const day = date.day ?? 1; // default to 1st if missing

			return new Date(Date.UTC(year, month - 1, day)).toISOString().substring(0, 10);
		}

		function toFuzzyDate(date?: string): $app.AL_FuzzyDateInput | undefined {
			if (!date) return undefined;

			const dateObject = new Date(date);
			const day = dateObject.getDate();
			const month = dateObject.getMonth() + 1;
			const year = dateObject.getFullYear();

			if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined;
			return { day, month, year };
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

		function normalizeString(str: string | null | undefined): string | undefined {
			return LoadDoc(`<p>${str ?? ""}</p>`)("p").text();
		}

		function normalizeAnimeStatusToMal(status?: $app.AL_MediaListStatus) {
			if (status === undefined || status === null) return undefined;
			const map: Record<typeof status, $malsync.ListStatusAnime> = {
				COMPLETED: "completed",
				CURRENT: "watching",
				DROPPED: "dropped",
				PAUSED: "on_hold",
				PLANNING: "plan_to_watch",
				REPEATING: "watching",
			};
			return map[status];
		}

		function normalizeMangaStatusToMal(status?: $app.AL_MediaListStatus) {
			if (status === undefined || status === null) return undefined;
			const map: Record<typeof status, $malsync.ListStatusManga> = {
				COMPLETED: "completed",
				CURRENT: "reading",
				DROPPED: "dropped",
				PAUSED: "on_hold",
				PLANNING: "plan_to_read",
				REPEATING: "reading",
			};
			return map[status];
		}

		function normalizeStatusToAnilist(status: $malsync.ListStatusAnime | $malsync.ListStatusManga) {
			if (status === undefined || status === null) return undefined;
			const map: Record<typeof status, $app.AL_MediaListStatus> = {
				completed: "COMPLETED",
				dropped: "DROPPED",
				on_hold: "PAUSED",
				plan_to_read: "PLANNING",
				plan_to_watch: "PLANNING",
				reading: "CURRENT",
				watching: "CURRENT",
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

		async function filterExistingMalIds(malIds: number[]) {
			const endpoint = "https://graphql.anilist.co";
			const existing: { id: number; idMal: number; title: string }[] = [];

			let page = 1;
			const perPage = 50;

			while (true) {
				const query =
					"query ($page: Int, $perPage: Int, $malIds: [Int]) { Page(page: $page, perPage: $perPage) { media(idMal_in: $malIds) { id idMal title { userPreferred } } } }";

				const variables = { page, perPage, malIds };

				const res = await fetch(endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ query, variables }),
				});

				await $_wait(2000);
				if (!res.ok) {
					let err = null;
					try {
						err = res.json();
					} catch {
						err = null;
					}
					throw new Error(err?.errors?.map((m: any) => m.message).join(" ") ?? res.statusText);
				}

				const json = await res.json();
				if (!json.data) throw new Error(json.errors?.join("\n"));

				const media = json.data.Page.media;
				for (const m of media) {
					if (m.idMal != null) {
						existing.push({
							id: m.id,
							idMal: m.idMal,
							title: m.title.userPreferred,
						});
					}
				}

				if (media.length < perPage) break;
				page++;
			}

			return existing;
		}

		async function syncEntries() {
			const jobType = fieldRefs.manageListJobtype.current;
			const mediaType = fieldRefs.manageListMediaType.current;
			const syncType = fieldRefs.manageListSyncType.current;
			const notifUpdt = { entries: 0, errors: 0, skips: 0, updates: 0, job_type: jobType, media_type: mediaType, sync_type: syncType };

			// Anilist ➔ MyAnimeList
			if (jobType === ManageListJobType.Import) {
				log.sendInfo("synclist > Starting sync job... (Anilist ➔ MyAnimeList)");
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

				log.send("synclist > Querying Myanimelist entries...");
				const malEntries = await application.list.fetchAll(mediaType).catch((e) => (e as Error).message);
				if (typeof malEntries === "string") {
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "Fetch error" },
					});
					return log.sendError(`synclist > Terminating syncjob: ${malEntries}`);
				}
				log.sendInfo(`synclist > Found ${malEntries.length} entries in MAL!`);

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop();

					if (!entry?.mediaId) continue;

					const title = entry?.title;

					if (!entry.idMal) {
						log.send(`synclist > Skipped ${title} (no equivalent MAL entry)...`);
						notifUpdt.skips++;
						continue;
					}

					if (unwrap(entry.private)) {
						log.send(`synclist > Skipped ${title} (private)...`);
						if (!fieldRefs.deletePrivateEntries.current) {
							popByProperty(malEntries, "idMal", unwrap(entry.idMal) ?? 0);
						}
						notifUpdt.skips++;
						continue;
					}

					const malEntry = popByProperty(malEntries, "idMal", unwrap(entry.idMal)!);
					if (!!malEntry && syncType === ManageListSyncType.Patch) {
						log.send(`synclist > Skipped ${title} (already-exists)...`);
						notifUpdt.skips++;
						continue;
					}

					const start = toISODate(entry.startedAt);
					const finish = toISODate(entry.completedAt);
					const notes = unwrap(entry.notes);
					const score = Math.round((unwrap(entry.score) ?? NaN) / 10);
					const status = unwrap(entry.status);

					const shared: $malsync.ListUpdateBodyBase = {};
					if (!!start && start !== malEntry?.list_status?.start_date) shared.start_date = start;
					if (!!finish && finish !== malEntry?.list_status?.finish_date) shared.finish_date = finish;
					if ((notes ?? "") !== (normalizeString(malEntry?.list_status?.comments) ?? "")) shared.comments = notes;
					if (!!score && score !== malEntry?.list_status?.score) shared.score = score;

					const body =
						mediaType === "Anime"
							? (() => {
									const b: $malsync.ListUpdateAnimeBody = { ...shared };
									const malAnime = malEntry?.list_status as $malsync.AnimeListEntry | undefined;
									const malStatus = normalizeAnimeStatusToMal(status);
									const malRewatching = unwrap(status) === "REPEATING";
									if (malStatus !== malAnime?.status) b.status = malStatus;
									if (malRewatching !== malAnime?.is_rewatching) b.is_rewatching = malRewatching;
									if ((unwrap(entry.progress) ?? 0) !== (malAnime?.num_episodes_watched ?? 0) && malAnime?.status !== "completed")
										b.num_watched_episodes = entry.progress;
									if ((unwrap(entry.repeat) ?? 0) !== (malAnime?.num_times_rewatched ?? 0)) b.num_times_rewatched = entry.repeat;
									return b;
								})()
							: (() => {
									const b: $malsync.ListUpdateMangaBody = { ...shared };
									const malManga = malEntry?.list_status as $malsync.MangaListEntry | undefined;
									const malStatus = normalizeMangaStatusToMal(status);
									const malRereading = status === "REPEATING";
									if (malStatus !== malManga?.status) b.status = malStatus;
									if (malRereading !== malManga?.is_rereading) b.is_rereading = malRereading;
									if ((unwrap(entry.progress) ?? 0) !== (malManga?.num_chapters_read ?? 0) && malManga?.status !== "completed")
										b.num_chapters_read = entry.progress;
									if ((unwrap(entry.repeat) ?? 0) !== (malManga?.num_times_reread ?? 0)) b.num_times_reread = entry.repeat;
									return b;
								})();

					if (!Object.keys(body).filter(Boolean).length) {
						log.send(`synclist > Skipping ${title}. (no-new-update)...`);
						notifUpdt.skips++;
						continue;
					}

					await application.list
						.patch(mediaType, entry.idMal, body)
						.then(() => {
							log.sendSuccess(`synclist > Updated ${entry.title} on MyAnimeList. ${JSON.stringify(body)}`);
							notifUpdt.updates++;
						})
						.catch((e) => {
							log.sendError(`synclist > Failed to update ${entry.title} on MyAnimeList ${(e as Error).message} ${JSON.stringify(body)}`);
							notifUpdt.errors++;
						});

					await $_wait(500);
				}

				if (syncType === ManageListSyncType.FullSync && typeof malEntries !== "string" && state.syncing.get()) {
					log.sendInfo(`synclist > Found ${malEntries.length} remaining entries. Purging...`);

					const validEntries = await filterExistingMalIds(malEntries.map((x) => x.node.id)).catch((e) => (e as Error).message);
					if (typeof validEntries === "string") {
						log.sendError(`synclist > ${validEntries}`);
					} else {
						const validIds = new Set(validEntries.map((x) => x.idMal));
						const invalidMalEntries = malEntries.filter((c) => !validIds.has(c.node.id));
						const validMalEntries = malEntries.filter((c) => validIds.has(c.node.id));

						if (invalidMalEntries.length) {
							log.sendInfo(`synclist > Found ${invalidMalEntries.length} invalid entries queued for deletion...`);
							while (invalidMalEntries.length) {
								const invalidEntry = invalidMalEntries.pop()!;
								log.send(`synclist > Unqueued ${invalidEntry.node.title} from deletion <no matching records found on AniList>`);
							}
						}

						log.send(`synclist > Preparing to delete ${validMalEntries.length} entries...`);
						while (state.syncing.get() && validMalEntries.length) {
							const entry = validMalEntries.pop()!;
							await application.list
								.delete(mediaType, entry.node.id)
								.then((data) => {
									if (data) {
										log.sendSuccess(`synclist > Deleted ${entry.node.title} from MyAnimeList`);
										notifUpdt.updates++;
									} else {
										log.send(`synclist > ${entry.node.title} does not exist in user's list. No further action required.`);
									}
								})
								.catch((e) => {
									log.sendError(`synclist > ${(e as Error).message}`);
									notifUpdt.errors++;
								});
							await $_wait(1_500);
						}
					}
				}
			}

			// MyAnimeList ➔ Anilist
			if (jobType === ManageListJobType.Export) {
				log.sendInfo("synclist > Starting sync job... (MyAnimeList ➔ Anilist)");
				const entries = await application.list
					.fetchAll(mediaType)
					.then((data) =>
						data.map((e) => ({
							idMal: e.node.id,
							title: e.node.title,
							score: e.list_status.score,
							progress:
								mediaType === "Anime"
									? (e as $malsync.AnimeListEntryWrapper).list_status.num_episodes_watched
									: (e as $malsync.MangaListEntryWrapper).list_status.num_chapters_read,
							progressVolumes: mediaType === "Anime" ? undefined : (e as $malsync.MangaListEntryWrapper).list_status.num_volumes_read,
							repeat:
								mediaType === "Anime"
									? (e as $malsync.AnimeListEntryWrapper).list_status.num_times_rewatched
									: (e as $malsync.MangaListEntryWrapper).list_status.num_times_reread,
							status: normalizeStatusToAnilist(e.list_status.status),
							notes: e.list_status.comments,
							// private: e.list_status.is_private,
							startedAt: e.list_status.start_date ?? undefined,
							completedAt: e.list_status.finish_date ?? undefined,
						})),
					)
					.catch((e) => (e as Error).message);

				if (typeof entries === "string") {
					log.sendError(`synclist > ${entries}`);
					log.sendInfo("synclist > Sync job aborted.");
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "Fetch error" },
					});
					return state.syncing.set(false);
				} else if (!entries.length) {
					log.sendWarning("synclist > No entries found.");
					log.sendInfo("synclist > Sync job aborted.");
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "No entries found" },
					});
					return state.syncing.set(false);
				} else {
					log.sendInfo(`synclist > Found ${entries.length} entries!`);
					notifUpdt.entries = entries.length;
				}

				// prettier-ignore
				const query = "const query = ` mutation ( $mediaId: Int!, $status: MediaListStatus, $progress: Int, $progressVolumes: Int, $score: Float, $repeat: Int, $notes: String, $startedAt: FuzzyDateInput, $completedAt: FuzzyDateInput ) { SaveMediaListEntry( mediaId: $mediaId, status: $status, progress: $progress, progressVolumes: $progressVolumes, score: $score, repeat: $repeat, notes: $notes, startedAt: $startedAt, completedAt: $completedAt ) { id status progress progressVolumes score repeat notes startedAt { year month day } completedAt { year month day } } }";
				const anilistGlobalEntries = await filterExistingMalIds(entries.map((e) => e.idMal)).catch((e) => (e as Error).message);
				const anilistEntries = getAnilistEntries(mediaType).filter((x) => !unwrap(x.private));

				if (typeof anilistGlobalEntries === "string") {
					log.sendError(`synclist > ${anilistGlobalEntries}`);
					log.send("synclist > Terminating sync...");
					state.syncing.set(false);
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "Fetch error" },
					});
					return;
				}

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop()!;
					const listEntry = popByProperty(anilistEntries, "idMal", entry.idMal);
					const { id, title } = anilistGlobalEntries.find((x) => x.idMal === entry.idMal) ?? {};

					if (!id) {
						log.send(`synclist > Skipped ${entry.title}. No matching media found on Anilist.`);
						notifUpdt.skips++;
						continue;
					}

					if (!!listEntry && syncType === ManageListSyncType.Patch) {
						log.send(`synclist > Skipped ${title} (already-exists)...`);
						notifUpdt.skips++;
						continue;
					}

					const body: $malsync.AnilistSaveMediaListEntryVariables = { mediaId: id };
					const startedAt = toFuzzyDate(entry.startedAt);
					const completedAt = toFuzzyDate(entry.completedAt);

					if (entry.status !== unwrap(listEntry?.status)) body.status = entry.status;
					if (entry.progress !== (unwrap(listEntry?.progress) ?? 0)) body.progress = entry.progress;
					// Seanime's Anilist ListEntry for Manga does not support progressVolumes atm
					// if (entry.progressVolumes) body.progressVolumes = entry.progressVolumes;
					if (entry.score !== Math.round((unwrap(listEntry?.score) ?? NaN) / 10)) body.score = entry.score * 10;
					if ((entry.repeat ?? 0) !== unwrap(listEntry?.repeat)) body.repeat = entry.repeat ?? 0;
					if (entry.notes !== normalizeString(unwrap(listEntry?.notes))) body.notes = entry.notes ?? "";

					if (toISODate(startedAt) !== toISODate(listEntry?.startedAt)) body.startedAt = startedAt;
					if (toISODate(completedAt) !== toISODate(listEntry?.completedAt)) body.completedAt = completedAt;

					// check if there are update in the entry
					if (Object.keys(body).length === 1) {
						log.send(`synclist > Skipped ${title ?? entry.title} (no-update-body)...`);
						notifUpdt.skips++;
						continue;
					}

					await anilistQuery(query, body)
						.then(() => {
							log.sendSuccess(`synclist > Added ${title ?? entry.title} to Anilist. ${JSON.stringify(body)}`);
							notifUpdt.updates++;
						})
						.catch((e) => {
							log.sendError(`synclist > Failed to add ${title ?? entry.title} to Anilist ${(e as Error).message} ${JSON.stringify(body)}`);
							notifUpdt.errors++;
						});
					await $_wait(2_000);
				}

				if (syncType === ManageListSyncType.FullSync && state.syncing.get()) {
					log.sendInfo(`synclist > Found ${anilistEntries.length} remaining entries. Purging...`);

					const query = "mutation ($id: Int!) { DeleteMediaListEntry(id: $id) { deleted } }";

					while (state.syncing.get() && anilistEntries.length) {
						const anilistEntry = anilistEntries.pop()!;
						const mediaTitle = anilistEntry.title;

						// Check if entry exists in shikomori/mal
						if (!unwrap(anilistEntry.idMal)) {
							log.send(`synclist > Skipped ${mediaTitle} (no equivalent MAL entry)...`);
							notifUpdt.skips++;
							continue;
						}

						// Check if entry is private
						if (unwrap(anilistEntry.private)) {
							log.send(`synclist > Skipped ${mediaTitle} (private in AL)...`);
							notifUpdt.skips++;
							continue;
						}

						anilistQuery(query, { id: anilistEntry.id })
							.then(() => {
								log.sendSuccess(`synclist > Removed ${mediaTitle ?? "anilist-id/" + anilistEntry.id} from Anilist!`);
								notifUpdt.updates++;
							})
							.catch((e) => {
								log.sendError(`synclist > Failed to remove ${mediaTitle ?? "anilist-id/" + anilistEntry.id} from Anilist: ${(e as Error).message}`);
								notifUpdt.errors++;
							});

						await $_wait(2_000);
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

			fieldRefs.deletePrivateEntries.setValue(false);
		}

		async function liveSync<TData>({
			event,
			preDataKey,
			actionLabel,
			buildBody,
			requireRepeat = false,
		}: {
			event: { mediaId?: number };
			preDataKey: string;
			actionLabel: "update" | "progress" | "repeat" | "delete";
			buildBody: (data: TData, entry: any) => $malsync.ListUpdateAnimeBody | $malsync.ListUpdateMangaBody;
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
			if (!entry) return log.sendWarning(`${actionLabel} > Media not found (${mediaId})`);

			if (!entry.media?.idMal) {
				return log.sendWarning(`${actionLabel} > No equivalent MyAnimeList entry found for [${mediaId}]`);
			}

			if (fieldRefs.skipPrivate.current.valueOf() && entry.media.isAdult?.valueOf()) {
				return log.sendWarning(`${actionLabel} > Skipped ${entry.media.title?.userPreferred ?? mediaId} (livesync-adult-disabled)`);
			}

			if ((data as any).mediaId !== mediaId) {
				return log.sendWarning(`${actionLabel} > preUpdate data was invalid!`);
			}

			if (requireRepeat && typeof (data as any).repeat !== "number") {
				return log.sendWarning(`${actionLabel} > preUpdate data was of invalid type!`);
			}

			if (unwrap(getAnilistEntries(entry.type).find((x) => x.mediaId === mediaId)?.private)) {
				return log.sendWarning(`${actionLabel} > ${entry.media.title?.userPreferred ?? "anilist-id/" + mediaId} is private. Skipping...`);
			}

			const title = entry.media.title?.userPreferred ?? `anilist-id/${mediaId}`;
			const body = buildBody(data, entry);

			application.list
				.patch(entry.type, entry.media.idMal, body)
				.then(() => {
					log.sendSuccess(`${actionLabel} > [PATCH] Synced ${title} to MyAnimeList. ${JSON.stringify(body)}`);
					notifications.push({
						title: `Updated ${title}`,
						body: { type: actionLabel, payload: body, status: "success", mediaId, metadata: { image: entry.media?.coverImage?.large } },
					});
				})
				.catch((e) => {
					log.sendError(`${actionLabel} > [PATCH] ${(e as Error).message} ${JSON.stringify(body)}`);
					notifications.push({
						title: `Failed to update ${title}`,
						body: { type: actionLabel, payload: body, status: "error", mediaId, metadata: { image: entry.media?.coverImage?.large } },
					});
				});
		}

		$store.watch("POST_UPDATE_ENTRY", async (e) => {
			liveSync<$app.PreUpdateEntryEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_DATA",
				actionLabel: "update",
				buildBody: (data, entry) => {
					const body: $malsync.ListUpdateBodyBase = {};

					const start = toISODate(data.startedAt);
					if (start) body.start_date = start;

					const finish = toISODate(data.completedAt);
					if (finish) body.finish_date = finish;

					if (typeof data.scoreRaw === "number" && data.scoreRaw > 0) {
						body.score = Math.round(data.scoreRaw / 10);
					}

					if (entry.type === "Anime") {
						return {
							...body,
							status: data.status ? normalizeAnimeStatusToMal(data.status) : undefined,
							is_rewatching: data.status ? data.status === "REPEATING" : undefined,
							num_watched_episodes: data.progress,
						};
					}

					return {
						...body,
						status: data.status ? normalizeMangaStatusToMal(data.status) : undefined,
						is_rereading: data.status ? data.status === "REPEATING" : undefined,
						num_chapters_read: data.progress,
					};
				},
			});
		});

		$store.watch("POST_UPDATE_ENTRY_PROGRESS", async (e) => {
			liveSync<$app.PreUpdateEntryProgressEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_PROGRESS_DATA",
				actionLabel: "progress",
				buildBody: (data, entry) => {
					const body: $malsync.ListUpdateBodyBase = {};
					if (data.progress && data.progress === data.totalCount) data.status = "COMPLETED";
					if (data.status === "COMPLETED") body.finish_date = new Date().toISOString().substring(0, 10);

					if (entry.type === "Anime") {
						return {
							...body,
							status: normalizeAnimeStatusToMal(data.status),
							is_rewatching: data.status === "REPEATING",
							num_watched_episodes: data.progress,
						};
					}

					return {
						...body,
						status: normalizeMangaStatusToMal(data.status),
						is_rereading: data.status === "REPEATING",
						num_chapters_read: data.progress,
					};
				},
			});
		});

		$store.watch("POST_UPDATE_ENTRY_REPEAT", async (e) => {
			liveSync<$app.PreUpdateEntryRepeatEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_REPEAT_DATA",
				actionLabel: "repeat",
				requireRepeat: true,
				buildBody: (data, entry) => {
					return entry.type === "Anime" ? { num_times_rewatched: data.repeat } : { num_times_reread: data.repeat };
				},
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
			if (!entry) return log.sendWarning(`delete-entry > Media not found (${e.mediaId})`);

			if (!entry.media?.idMal) {
				return log.sendWarning(`delete-entry > No equivalent MyAnimeList entry found for [${e.mediaId}]`);
			}

			if (unwrap(getAnilistEntries(entry.type).find((x) => x.mediaId === e.mediaId)?.private)) {
				return log.sendWarning(`delete-entry > ${entry.media.title?.userPreferred ?? "anilist-id/" + e.mediaId} is private. Skipping...`);
			}

			const title = entry.media.title?.userPreferred ?? "anilist-id/" + e.mediaId;
			application.list
				.delete(entry.type, entry.media.idMal)
				.then((data) => {
					if (data) {
						log.sendSuccess(`delete-entry > [DELETE] Synced ${title} to MyAnimeList`);
						notifications.push({
							title: `Deleted ${title}`,
							body: { type: "delete", payload: {}, status: "success", mediaId: e.mediaId!, metadata: { image: entry.media?.coverImage?.large } },
						});
					} else {
						log.sendInfo(`delete-entry > [DELETE] ${title} does not exist in user's list. No further action required.`);
					}
				})
				.catch((e) => {
					log.sendError(`delete-entry > [DELETE] ${(e as Error).message}`);
					notifications.push({
						title: `Failed to delete ${title}`,
						body: { type: "delete", payload: {}, status: "error", mediaId: e.mediaId!, metadata: { image: entry.media?.coverImage?.large } },
					});
				});
		});

		tray.render(() => tabs.get());

		ctx.effect(() => {
			if (application.userInfo.id.get() === null) return tray.updateBadge({ number: 1, intent: "alert" });
			if (state.syncing.get()) return tray.updateBadge({ number: 1, intent: "alert" });
			if (notifications.unreads.get() > 0) return tray.updateBadge({ number: notifications.unreads.get(), intent: "warning" });
			return tray.updateBadge({ number: 0 });
		}, [application.userInfo.id, state.syncing, notifications.unreads]);

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
					if (!data.picture) log.sendWarning("login > No user avatar detected! Reverting to default...");
					tabs.current.set(Tab.landing);
				})
				.catch((err: Error) => {
					log.sendError(`login > Fetch failed: ${err.message}`);
					log.send("login > Session invalid. Please log in again.");
					tabs.current.set(Tab.logon);
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
					if (!data.picture) log.sendWarning("login > No user avatar detected! Reverting to default...");
					tabs.current.set(Tab.landing);
				})
				.catch((err: Error) => {
					log.sendError(`login > [Token Refresh Failed] ${err.message}`);
					log.send("login > Session Expired. Please login again.");
					state.loginError.set("Session Expired. Please login again.");
					tabs.current.set(Tab.logon);
				})
				.finally(() => state.loggingIn.set(false));
		}

		log.sendWarning("login > Refresh token not found!");
		log.sendWarning("login > User authentication required.");
		tabs.current.set(Tab.logon);
		state.loggingIn.set(false);
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
