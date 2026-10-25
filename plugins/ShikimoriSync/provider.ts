/**
 * shikimorisync
 * Copyright (c) 2026 nnotwen
 * SPDX-License-Identifier: MIT
 */

/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./shikimorisync.d.ts" />
/// <reference path="./shikimori.graphql.schema.d.ts" />

// LIVESYNC LOGIC STILL NOT IMPLEMENTED

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/master/plugins/ShikimoriSync/icon.png";

		const icons = (() => {
			const htms = {
				anilist: /*html*/ `<svg fill="#cacaca" width="1rem" height="1rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.361 2.943 0 21.056h4.942l1.077-3.133H11.4l1.052 3.133H22.9c.71 0 1.1-.392 1.1-1.101V17.53c0-.71-.39-1.101-1.1-1.101h-6.483V4.045c0-.71-.392-1.102-1.101-1.102h-2.422c-.71 0-1.101.392-1.101 1.102v1.064l-.758-2.166zm2.324 5.948 1.688 5.018H7.144z"/></svg>`,
				arrow_lr: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/></svg>`,
				arrow_r: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/></svg>`,
				bell: /*html*/ `<svg stroke="#cacaca" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path><path d="M4 2C2.8 3.7 2 5.7 2 8"></path><path d="M22 8c0-2.3-.8-4.3-2-6"></path></svg>`,
				book: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/></svg>`,
				caret_left_fill: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/></svg>`,
				caret_right_fill: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg>`,
				check2all: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/><path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/></svg>`,
				close: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>`,
				code: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/></svg>`,
				delete: /*html*/ `<svg stroke="#fca5a5" fill="#fca5a5" stroke-width="0" height="1em" width="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>`,
				eye: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>`,
				eye_slash: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/></svg>`,
				explicit: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M6.826 10.88H10.5V12h-5V4.002h5v1.12H6.826V7.4h3.457v1.073H6.826z"/><path d="M2.5 0A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0zM1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5z"/></svg>`,
				format: /*html*/ `<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 0 0-2-2m0 14H3V5h18z"></path></svg>`,
				gears: /*html*/ `<svg stroke="#cacaca" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/><circle cx="12" cy="12" r="3"/></svg>`,
				globe: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/></svg>`,
				person: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>`,
				play: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/></svg>`,
				plusCircleDotted: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg>`,
				power: /*html*/ `<svg fill="#f09e9f" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 1v7h1V1z"/><path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/></svg>`,
				refresh: /*html*/ `<svg stroke="#cacaca" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`,
				search: /*html*/ `<svg fill="#5a5a5a" height="512" width="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M495 466.2 377.2 348.4c29.2-35.6 46.8-81.2 46.8-130.9C424 103.5 331.5 11 217.5 11 103.4 11 11 103.5 11 217.5S103.4 424 217.5 424c49.7 0 95.2-17.5 130.8-46.7L466.1 495c8 8 20.9 8 28.9 0 8-7.9 8-20.9 0-28.8m-277.5-83.3C126.2 382.9 52 308.7 52 217.5S126.2 52 217.5 52C308.7 52 383 126.3 383 217.5s-74.3 165.4-165.5 165.4"/></svg>`,
				sort: /*html*/ `<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-128-64h-48V48a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v304H16c-14.19 0-21.37 17.24-11.29 27.31l80 96a16 16 0 0 0 22.62 0l80-96C197.35 369.26 190.22 352 176 352zm256-192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>`,
				spinner: /*html*/ `<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M16 8c-0.020-1.045-0.247-2.086-0.665-3.038-0.417-0.953-1.023-1.817-1.766-2.53s-1.624-1.278-2.578-1.651c-0.953-0.374-1.978-0.552-2.991-0.531-1.013 0.020-2.021 0.24-2.943 0.646-0.923 0.405-1.758 0.992-2.449 1.712s-1.237 1.574-1.597 2.497c-0.361 0.923-0.533 1.914-0.512 2.895 0.020 0.981 0.234 1.955 0.627 2.847 0.392 0.892 0.961 1.7 1.658 2.368s1.523 1.195 2.416 1.543c0.892 0.348 1.851 0.514 2.799 0.493 0.949-0.020 1.89-0.227 2.751-0.608 0.862-0.379 1.642-0.929 2.287-1.604s1.154-1.472 1.488-2.335c0.204-0.523 0.342-1.069 0.415-1.622 0.019 0.001 0.039 0.002 0.059 0.002 0.552 0 1-0.448 1-1 0-0.028-0.001-0.056-0.004-0.083h0.004zM14.411 10.655c-0.367 0.831-0.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434c-0.832 0.323-1.723 0.476-2.608 0.454-0.884-0.020-1.759-0.215-2.56-0.57-0.801-0.354-1.526-0.867-2.125-1.495s-1.071-1.371-1.38-2.173c-0.31-0.801-0.457-1.66-0.435-2.512s0.208-1.694 0.551-2.464c0.342-0.77 0.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c0.771-0.298 1.596-0.438 2.416-0.416s1.629 0.202 2.368 0.532c0.74 0.329 1.41 0.805 1.963 1.387s0.988 1.27 1.272 2.011c0.285 0.74 0.418 1.532 0.397 2.32h0.004c-0.002 0.027-0.004 0.055-0.004 0.083 0 0.516 0.39 0.94 0.892 0.994-0.097 0.544-0.258 1.075-0.481 1.578z"></path></svg>`,
				shikimori_logo: /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="#cacaca"><path d="M2.803.003c-.025.027.03.12.18.297.098.113.16.233.233.444.055.16.12.316.145.347.036.049.04.037.042-.11V.818l.218.3c.331.457.537.7.675.798.07.046.113.092.095.098-.049.015-.478-.221-.678-.374a1.2 1.2 0 0 0-.211-.141c-.015 0-.065-.046-.107-.102a1 1 0 0 0-.206-.19c-.171-.119-.352-.29-.395-.373C2.763.772 2.668.732 2.668.78c0 .05.245.377.435.58.583.622 1.178.932 2.769 1.428.337.105.635.209.662.233a.2.2 0 0 0 .108.04.25.25 0 0 1 .104.03c.04.025.036.032-.01.032q-.055 0-.046.055.015.083.448.144c.129.018.16.012.16-.024 0-.05-.09-.083-.221-.083-.05 0-.086-.016-.086-.03 0-.02.03-.026.07-.02.037.01.166.03.282.052.276.046.353.077.353.135 0 .065.083.092.138.046q.046-.04.046-.003c0 .019.015.034.03.034.019 0 .031-.021.031-.046 0-.058-.03-.058.485.021.306.046.42.077.374.093-.098.036-.043.085.095.085.07 0 .12.016.12.034 0 .028.07.03.244.018.16-.012.252-.009.264.013.013.018.065.027.12.018.052-.01.196.003.312.025.307.058 1.132.104 2.977.169 2.983.104 5.157.327 5.973.615.362.13.908.405 1.009.51.16.168.208.306.19.533a.8.8 0 0 0 0 .224c.089.089.285-.086.285-.254 0-.034.064-.117.147-.188.33-.29.38-.454.343-1.119-.024-.448-.03-.478-.23-1.134-.26-.859-.321-.99-.634-1.322-.368-.386-.702-.607-1.16-.763a18 18 0 0 1-.52-.19c-.249-.098-.427-.141-.788-.193-.512-.074-1.613-.126-1.956-.092-.123.012-.614 0-1.15-.034-.61-.033-.984-.046-1.073-.027a2 2 0 0 1-.295.03.4.4 0 0 0-.29.098c-.126.092-.215.12-.565.178-.564.092-.929.165-1.082.218-.12.043-.316.07-.62.089-.83.052-1.302.095-1.407.129-.07.021-.34.027-.79.018-.55-.012-.69-.006-.718.028-.028.03-.015.04.058.04.181 0 1.797.125 1.812.14s-.273.003-1.097-.049a3 3 0 0 0-.472-.01c-.059.038-.494.032-.911-.011a10 10 0 0 1-1.472-.255 4 4 0 0 0-.644-.1C4.547.952 4.198.838 3.704.59 3.379.43 3.343.423 3.343.554v.101L3.244.533a1.2 1.2 0 0 1-.15-.23c-.055-.117-.26-.328-.291-.3M3.26 3.19c-.57.027-1.094.47-1.47 1.263-.224.475-.264.66-.279 1.291-.012.497-.006.598.064 1.012.15.861.19.962.506 1.272.334.331 1.165.785 1.628.89.16.033.347.076.414.094.258.065.61.089 1.487.101.843.015.914.013 1.027-.043.08-.04.249-.07.49-.088.203-.019.417-.046.476-.065a1.4 1.4 0 0 1 .276-.03c.095 0 .19-.019.208-.037.074-.074.423-.15.757-.169.187-.01.362-.027.393-.043.101-.055.052-.086-.113-.067a.5.5 0 0 1-.221-.016c-.05-.03-.034-.033.082-.036.077 0 .227-.01.335-.022.165-.015.184-.025.138-.058-.114-.083-.015-.104.493-.104.457 0 .59-.022.454-.074a1.2 1.2 0 0 0-.252-.022c-.113-.003-.162-.012-.113-.015.052-.006.163-.027.252-.043.086-.018.625-.04 1.196-.046.57-.006 1.054-.012 1.075-.015q.041-.001.022-.061c-.012-.044-.006-.062.027-.062.025 0 .083-.049.13-.107.091-.12.116-.114.155.043l.028.101.22.01c.176.006.234-.004.292-.047a.5.5 0 0 1 .184-.076l.114-.022-.019.178c-.018.144-.015.172.022.16a3 3 0 0 1 .22-.056l.175-.033-.067-.09a.4.4 0 0 0-.194-.116l-.122-.03.184-.007a5 5 0 0 1 .3 0c.065.003.114-.009.114-.027s-.018-.034-.037-.037c-.021-.003-.089-.006-.147-.01a.7.7 0 0 1-.215-.073.4.4 0 0 0-.159-.067c-.03 0-.055-.016-.055-.03 0-.022.092-.031.254-.025.248.009.252.009.26.092.013.095.013.095.08.067a.05.05 0 0 0 .031-.058c-.018-.049.037-.09.083-.059.018.01.092.022.16.028.165.01.971.074 1.18.095.11.012.159.03.159.062 0 .052.037.054.083.008.024-.024.144-.02.435.007.356.034.402.043.402.095q-.002.054.07.058c.037 0 .166.012.282.025.12.012.233.018.252.009.021-.007.089-.098.15-.202.12-.2.221-.326.26-.326.016 0 .019.022.01.047-.013.024-.003.046.015.046.022 0 .034.024.028.052-.006.036.021.058.092.073.113.025.165.058.089.058-.028 0-.053.019-.053.04s.181.099.445.184c.282.095.444.163.444.19 0 .03-.095.01-.358-.08-.625-.214-.898-.26-.898-.153 0 .046.049.068.285.123.153.037.3.064.325.064a.34.34 0 0 1 .129.074c.049.043.294.144.563.233.273.092.516.19.565.233a.8.8 0 0 0 .193.116c.193.083.47.331.678.61.3.405.297.39.131.39-.076 0-.294-.022-.484-.046a7 7 0 0 0-.53-.05c-.215-.005-1.969.028-2.625.05l-.445.015-.07-.15a1.6 1.6 0 0 0-.254-.331c-.175-.172-.184-.175-.224-.117-.025.034-.117.163-.206.282l-.162.224-.2.007c-.11 0-.223.003-.25 0-.068-.006-.071.03-.01.144l.043.085-.313.022c-.852.058-2.66.282-3.268.408a4.5 4.5 0 0 1-.678.052c-.46.006-.502.018-.794.187-.052.027-.092.034-.129.015q-.052-.03-.085.012c-.034.04-.144.058-.954.144-.178.019-.475.059-.665.09-.331.054-.35.054-.524 0-.184-.059-.758-.136-1.248-.17l-.276-.021-.162.147a2.5 2.5 0 0 0-.286.307c-.092.125-.14.166-.2.166-.125 0-1.244.174-2.056.321-.877.16-1.208.19-1.466.138-.266-.055-.27-.058-.257-.395.012-.285.009-.294-.065-.331-.168-.086-.33-.037-.551.162a.28.28 0 0 1-.2.068.8.8 0 0 0-.3.08l-.181.082.009.16a.5.5 0 0 1-.022.217c-.024.037-.03.2-.018.47.012.327.003.447-.04.606l-.052.197.147.208c.295.414.503.73.503.763 0 .019.092.117.208.218.506.445.721.565 1.218.669.527.113.613.107.941-.068a2.5 2.5 0 0 0 .39-.257c.08-.074.306-.194.742-.387.677-.3.763-.334.763-.294 0 .012.043.426.095.914.107 1.023.14 2.005.095 2.759-.037.592-.064.674-.481 1.46-.647 1.216-1.423 2.394-2.008 3.047-.105.12-.264.325-.353.46-.169.254-.481.595-.871.944-.132.12-.218.22-.208.245.009.025.104.074.211.11.105.04.206.083.224.099.049.049.11.03.337-.092l.22-.123.09.062c.107.07.3.076.463.015.064-.025.193-.052.288-.058.19-.019.313-.07.512-.224a.8.8 0 0 1 .215-.12c.089-.018.858-.797 1.27-1.288.128-.15.45-.49.72-.754.377-.374.545-.515.76-.644.31-.183.555-.407.585-.539a1 1 0 0 1 .092-.212c.095-.162.203-.579.175-.683a1.3 1.3 0 0 0-.101-.233c-.08-.141-.086-.19-.101-.583-.028-.69-.138-1.051-.488-1.594-.202-.313-.251-.423-.377-.828-.208-.696-.27-1.35-.165-1.861.049-.255.073-.288.279-.408.107-.064.248-.165.316-.227l.125-.116.595-.068c.328-.04.696-.088.812-.113.12-.024.383-.08.586-.12.205-.042.497-.116.647-.165.15-.052.362-.114.472-.138.215-.05.947-.12.972-.095.009.01.018.448.015.975 0 .828-.009 1.052-.08 1.662a22 22 0 0 0-.174 2.526c-.028 1.146-.037 1.198-.224 1.333-.135.098-.273.08-.68-.1a39 39 0 0 0-.951-.393 18 18 0 0 1-1.003-.441c-.233-.117-.423-.203-.423-.194s.117.16.26.334c.145.175.261.325.261.334s-.027.02-.064.02c-.055 0-.058.005-.015.063.027.04.036.101.027.166-.012.083-.003.11.058.15.04.028.105.104.145.172a.7.7 0 0 0 .14.177.7.7 0 0 1 .133.163c.03.058.134.166.233.24a.9.9 0 0 1 .21.208c.02.046.109.113.213.165.242.123.597.436.655.574.034.085.102.153.298.282.157.104.432.343.739.647.558.551.589.57 1.042.542.295-.021.442-.076.617-.236.07-.064.156-.132.187-.15a.8.8 0 0 0 .165-.2.8.8 0 0 1 .193-.22c.129-.077.359-.402.359-.506 0-.153.058-.251.26-.441.178-.166.215-.221.326-.494.172-.417.232-.687.288-1.223.067-.662.061-1.462-.015-1.962-.126-.816-.604-3.088-.748-3.542-.12-.377-.233-.867-.233-1.008 0-.034.064-.037.315-.022.23.016.41.01.675-.03.312-.046.42-.05.75-.019.212.019.393.04.4.05.024.02.496 1.557.576 1.87.165.64.169.686.202 2.299.016.843.03 1.843.037 2.223.006.64.012.71.089.993.098.359.205.592.426.91.089.127.224.347.3.488.154.285.353.521.61.717.338.261.666.473.868.565.243.11.439.285.632.558.08.11.193.26.254.337.062.077.138.193.172.26.058.123.077.136.408.234.153.046.576.055.812.015.132-.022.181-.052.393-.258.285-.276.42-.469.42-.607 0-.214.03-.279.156-.328q.12-.047.12-.104c0-.193-.203-.972-.307-1.175-.068-.134-.947-1.324-1.686-2.283-.785-1.015-1.061-1.457-1.224-1.935-.052-.163-.248-1.276-.37-2.143a8.4 8.4 0 0 0-.531-1.922c-.092-.233-.156-.423-.141-.423.074 0 1.653.441 1.745.487.058.03.297.16.527.288.23.132.454.236.493.236.046 0 .24.108.466.26l.39.262.202-.016c.292-.028.346-.04.47-.126.174-.12.278-.138.416-.073.267.126.451.147.289.034-.243-.17-.267-.252-.126-.464.169-.257.187-.275.361-.364.28-.141.298-.175.39-.678.043-.245.1-.484.126-.533.07-.148.055-.242-.065-.356a2 2 0 0 1-.23-.291c-.095-.147-.122-.218-.122-.325 0-.12-.013-.144-.101-.2a1.3 1.3 0 0 0-.218-.107c-.132-.046-.337-.263-.31-.324l.034-.083c.025-.062-.224-.197-.47-.255-.244-.058-.241-.058-.198-.107.021-.028.02-.123.002-.3-.092-.84-.432-1.43-.999-1.727a1.2 1.2 0 0 1-.239-.147c-.058-.089-.782-.365-1.18-.447a8 8 0 0 1-.552-.138 5 5 0 0 0-.61-.12c-.457-.043-1.073-.147-1.276-.212a6 6 0 0 0-.533-.12c-.193-.036-.359-.076-.368-.091-.012-.018-.086-.016-.187.003-.117.021-.291.021-.567-.003a16 16 0 0 0-1.196-.031c-.674.003-.858-.006-1.202-.061a5 5 0 0 0-.659-.065c-.337-.003-1.33-.104-1.153-.12.028 0 .12-.017.205-.036.141-.03.15-.037.123-.098-.03-.065-.046-.067-.478-.064-.368 0-.454.009-.481.049-.031.04-.062.043-.197.018-.144-.03-.153-.037-.107-.073.049-.037.05-.046.01-.074a.2.2 0 0 0-.096-.031c-.04 0-1.956-.19-2.753-.273-.157-.018-.294-.036-.303-.049-.01-.009.006-.015.033-.015.03 0 .052-.012.052-.028 0-.046-.156-.058-.37-.024-.15.021-.23.021-.28-.003-.058-.025-.04-.028.093-.015.29.03.168-.04-.139-.077-.165-.022-.337-.043-.38-.05a.5.5 0 0 1-.138-.045c-.03-.019-.368-.077-.748-.129a9 9 0 0 1-.95-.172c-.497-.14-.954-.37-1.217-.607l-.138-.122.049-.117a.86.86 0 0 1 .46-.493c.315-.154.46-.178 1.076-.197.56-.012.693-.036.628-.11-.03-.043-.472-.11-.692-.11-.138 0-.482-.068-.798-.16a1.2 1.2 0 0 0-.4-.049m8.85 2.95a.3.3 0 0 0-.068.006c-.18.03-.285.073-.377.15l-.092.073.147.003a.45.45 0 0 0 .353-.131q.107-.097.037-.1m5.776.951a.5.5 0 0 1 .162.032.6.6 0 0 0 .224.031c.03-.009.067-.003.08.019.015.027-.03.03-.184.015q-.203-.023-.203.009c0 .018.037.04.086.05.224.048.26.073.068.054a6 6 0 0 0-.368-.024c-.16 0-.169.003-.178.08-.01.07-.03.085-.18.116-.206.04-.178.043-.332-.028-.138-.067-.442-.14-.819-.199-.14-.021-.21-.04-.162-.043.052 0 .334.031.629.074.545.077.699.092.665.058a6 6 0 0 0-.534-.12l-.515-.1.3-.004c.264-.003.31.007.39.065.068.049.101.058.126.034.021-.022.113-.028.257-.02.193.016.245.01.353-.048a.4.4 0 0 1 .135-.05m-4.347.513q.024-.001.036.01c.013.01 0 .03-.024.046-.058.037-.083.037-.107.003-.014-.025.05-.057.095-.059m4.987.09q.008-.003.034.037a.15.15 0 0 0 .098.052c.05 0 .053.006.013.03a.2.2 0 0 1-.061.028c-.062-.006-.092-.043-.092-.098q0-.045.008-.049m-3.951.18c-.062 0-.104.053-.104.126 0 .016.07.028.156.028.147 0 .153-.003.116-.052-.06-.08-.098-.101-.168-.101m6.19 1.831c.021-.009.074.012.116.043.068.052.068.058.013.055-.086 0-.184-.076-.13-.098"/></svg>`,
				shikimori_gylph: /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" width="831" height="104.5" viewBox="0 0 813 104.5" fill="#cacaca"><path d="M32.039 87.301q2.734 0 5.417-.545 2.693-.544 4.781-1.836a10.54 10.54 0 0 0 3.37-3.349q1.29-2.038 1.291-5.044 0-3.612-1.866-6.133-1.876-2.523-4.943-4.469-3.067-1.937-6.961-3.571a1225 1225 0 0 1-7.969-3.41 81 81 0 0 1-7.98-3.995 31.3 31.3 0 0 1-6.95-5.346q-3.067-3.137-4.943-7.465T3.41 31.808q0-7.021 2.723-12.751 2.735-5.72 7.778-9.714 5.044-3.985 12.267-6.164Q33.4.999 42.338 1q2.311 0 5.549.171 3.237.162 6.89.575 3.641.414 7.464 1.06a79 79 0 0 1 7.365 1.604l-3.955 17.381-1.16.545a52 52 0 0 0-6.073-2.321 64 64 0 0 0-5.962-1.563 54 54 0 0 0-5.447-.888q-2.562-.272-4.54-.272-6.132 0-9.744 2.451t-3.612 7.364q0 3.541 1.867 6.002 1.875 2.452 4.943 4.358 3.076 1.906 6.99 3.481a217 217 0 0 1 7.98 3.369 92 92 0 0 1 7.969 4.025 30.7 30.7 0 0 1 6.991 5.387q3.067 3.166 4.943 7.566 1.876 4.397 1.876 10.461 0 7.232-2.764 13.093t-7.939 10.018q-5.185 4.156-12.61 6.446-7.434 2.28-16.705 2.28-3.339 0-7.263-.343a91 91 0 0 1-8.181-1.09 87 87 0 0 1-8.615-1.977A65.5 65.5 0 0 1 0 97.116l3.884-17.452 1.432-.676a354 354 0 0 0 7.536 3.34q3.51 1.493 6.749 2.622a48 48 0 0 0 6.304 1.735q3.067.616 6.134.616M810.295 2.362v99.869h-27.681V2.362zm-90.878 63.876h-10.764v35.993h-27.681V2.362h38.374q10.502 0 18.138 2.108 7.636 2.118 12.61 5.7 4.983 3.57 7.333 8.241 2.35 4.672 2.351 9.715 0 4.71-1.776 8.827a33.4 33.4 0 0 1-4.569 7.636 47.6 47.6 0 0 1-6.164 6.416 97 97 0 0 1-6.517 5.145l27.55 46.081h-31.978Zm-10.764-47.584v32.654h15.535q1.573-.888 3.178-2.391 1.593-1.494 2.855-3.571 1.26-2.089 2.047-4.711t.787-5.821q0-3.48-1.029-6.416-1.018-2.924-2.996-5.114-1.977-2.18-4.872-3.4-2.894-1.23-6.719-1.23Zm-100.555 84.939q-11.046 0-20.387-3.269-9.342-3.279-16.12-9.583-6.78-6.306-10.603-15.475-3.813-9.17-3.813-20.962 0-12.065 3.985-21.881 3.985-9.815 11.217-16.806 7.223-6.98 17.21-10.804Q599.574 1 611.639 1q11.045 0 20.387 3.268 9.341 3.268 16.121 9.543 6.779 6.276 10.602 15.445 3.813 9.17 3.813 20.962 0 12.065-4.015 21.911-4.025 9.855-11.217 16.846-7.194 6.98-17.21 10.804-10.028 3.814-22.022 3.814m2.381-16.292q5.87 0 10.3-2.865 4.428-2.865 7.394-7.637 2.965-4.77 4.469-10.935 1.492-6.174 1.493-12.852 0-7.162-1.705-13.638-1.705-6.477-4.903-11.379-3.207-4.913-7.838-7.808-4.641-2.895-10.431-2.895-5.861 0-10.259 2.865-4.398 2.854-7.364 7.626-2.966 4.782-4.469 10.975-1.494 6.205-1.493 12.822 0 7.162 1.695 13.639 1.705 6.465 4.882 11.379 3.168 4.913 7.768 7.808t10.461 2.895m-175.466 14.93h-23.181l8.05-99.869h38.646l11.591 45.95 3.884 20.306h1.361l4.368-20.377 11.521-45.879h41.511l8.05 99.869h-30.273l-2.522-63.473-.061-19.217h-1.705l-4.297 18.673-16.494 62.039h-25.36l-16.504-61.898-4.428-18.814h-1.705v19.086zM390.706 2.362v99.869h-27.681V2.362zm-42.68 99.869h-33.27l-31.564-50.449 36.679-49.42h25.36l-35.589 42.873z"/><path d="M283.323 2.362v99.869h-27.681V2.362zm-50.856 0v99.869h-27.68V2.362zm-115.754 99.869h-27.68V2.362h27.68v40.29h37.214V2.362h27.681v99.869h-27.681V58.944h-37.214z"/></svg>`,
				status: /*html*/ `<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.11629 20.0868L7.1308 18.348C5.2271 16.8856 4 14.5861 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 14.5861 18.7729 16.8856 16.8692 18.348L17.8837 20.0868C20.3786 18.2684 22 15.3236 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.3236 3.62137 18.2684 6.11629 20.0868ZM8.14965 16.6018C6.83562 15.5012 6 13.8482 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 13.8482 17.1644 15.5012 15.8503 16.6018L14.8203 14.8365C15.549 14.112 16 13.1087 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 13.1087 8.45105 14.112 9.17965 14.8365L8.14965 16.6018ZM11 13H13V22H11V13Z"></path></svg>`,
			};
			return {
				get: function (name: keyof typeof htms, options?: { raw?: boolean; stroke?: string; fill?: string }) {
					let htm = htms[name];
					if (!!options?.stroke) htm = htm.replace(/stroke="[^"]*"/g, `stroke="${options.stroke}"`);
					if (!!options?.fill) htm = htm.replace(/fill="[^"]*"/g, `fill="${options.fill}"`);
					if (options?.raw === true) return htm;
					return `data:image/svg+xml;base64,${Buffer.from(htm.trim(), "utf-8").toString("base64")}`;
				},
			};
		})(); // prettier-ignore

		const utils = (() => {
			const button = (
				o: { icon: Parameters<(typeof icons)["get"]>[0]; tooltip?: string; transparent?: boolean } & Parameters<$ui.Tray["button"]>[1] &
					Exclude<Parameters<typeof icons.get>[1], "raw">,
			) => {
				const { icon, tooltip, transparent, raw, stroke, fill, ...props } = o;
				const intent = props.intent ?? "gray-subtle";
				const className = ("w-10 rounded-full bg-no-repeat bg-center p-0 " + (transparent ? "bg-transparent " : "") + (props.className ?? "")).trim();
				const style = {
					backgroundSize: "1.2rem",
					paddingInlineStart: "0.5rem",
					...(!props.loading && { backgroundImage: `url(${icons.get(icon, { stroke, fill })})` }),
				};
				const b = tray.button("\u200b", { intent, ...(props ?? {}), className, style: { ...style, ...(props.style ?? {}) } });
				return tooltip?.trim().length ? tray.tooltip(b, { text: tooltip.trim() }) : b;
			};

			const select = <T>(params: {
				heading: string;
				description: string;
				options: { title: string; desc: string; icon: string; value: T; disabled?: boolean }[];
				value?: T;
				fieldRef?: $ui.FieldRef<T>;
				disabled?: boolean;
				gridCols?: number;
				onChange?: (value: T) => void;
			}) => {
				const card = (option: (typeof params.options)[number]) => tray.div([tray.div([tray.div([], {
					className: "w-5 h-5 mt-1 bg-repeat-none bg-cover bg-center",
					style: { backgroundImage: `url(${option.icon})` },
				}), tray.div([
					tray.text(option.title, { className: "font-medium break-normal text-pretty" }),
					tray.text(option.desc, { className: "text-xs text-gray-600 dark:text-gray-400 break-normal" }),
				], { className: "flex-1" })], { className: "flex items-start gap-3" })], {
					className: "p-4 rounded-lg border cursor-pointer transition-all bg-brand-900/10" +
						((params.value !== undefined ? params.value : params.fieldRef?.current) === option.value ? " border-[--brand]" : "") +
						(option.disabled ? " opacity-50 pointer-events-none" : ""),
					onClick: ctx.eventHandler(generateRandomUUID(), () => {
						params.fieldRef?.setValue(option.value as T);
						tray.update();
						params.onChange?.(option.value as T);
					}),
				});

				const header = tray.div([
					tray.text(params.heading, { className: "font-semibold text-[1rem] tracking-wide transition-colors duration-300 px-4 py-1 border w-fit rounded-xl bg-gray-800/40 group-hover/settings-card:bg-brand-500/10 group-hover/settings-card:text-white flex-none" }),
					tray.text(params.description, { className: "text-sm text-[--muted] px-4 py-2 lg:py-0 w-fit" }),
				], { className: "p-0 pb-2 flex flex-col lg:flex-row items-center gap-0 mx-3 mt-3 space-y-0" });

				const opts = tray.div(params.options.map(card), { className: `grid grid-cols-1 md:grid-cols-${params.gridCols || 2} gap-4 px-3 pb-3` });
				return tray.div([header, opts], {
					className: "border bg-[--paper] shadow-sm group/settings-card relative bg-gray-950/80 rounded-xl transition-all duration-200" +
						(params.disabled ? " opacity-50 pointer-events-none" : ""),
				});
			};

			const nativeSelect = (icon: Parameters<typeof icons.get>[0], selectProps: Parameters<typeof tray.select>[1]) => tray.flex([
				tray.div([], {
					className: `w-10 h-full rounded-l-xl border bg-no-repeat bg-center bg-cover shrink-0 dark:bg-[--paper-lighter] border-r-0 ${selectProps.disabled ? "opacity-50" : ""}`.trim(),
					style: { backgroundImage: `url(${icons.get(icon)})`, backgroundSize: "1rem", marginRight: "-1px" },
				}),
				tray.select({
					...selectProps,
					style: { ...selectProps.style, borderTopLeftRadius: "0", borderBottomLeftRadius: "0", borderLeftColor: "#0000", "--tw-border-opacity": "0.5" },
					label: (selectProps as { label?: string }).label ?? "",
					options: selectProps.options,
				}),
			], { gap: 0 });

			const groupedCheckbox = (params: {
				heading: string;
				description: string;
				entries: {
					title: string;
					desc: string;
					icon: string;
					value: boolean;
					disabled?: boolean;
					fieldRef?: $ui.FieldRef<boolean>;
					overwrites?: { ifTrue?: string; ifFalse?: string };
					eventHandlerId?: string;
					onChange?: (value: boolean) => void;
				}[];
				gridCols?: number;
				disabled?: boolean;
			}) => {
				const card = (option: (typeof params.entries)[number]) => tray.div([tray.div([tray.div([], {
					className: "w-5 h-5 mt-1 bg-repeat-none bg-cover bg-center",
					style: { backgroundImage: `url(${option.icon})` },
				}), tray.div([tray.flex([
					tray.text(option.title, { className: "font-medium break-normal text-pretty" }),
					tray.span(option.value ? option.overwrites?.ifTrue ?? "TRUE" : option.overwrites?.ifFalse ?? "FALSE",
						option.value
							? { className: "text-xs border rounded-lg px-2 text-green-300 border-green-500 bg-green-500/20 h-full" }
							: { className: "text-xs border rounded-lg px-2 text-red-300 border-red-500 bg-red-500/20 h-full" }
					),
				], { className: "items-center" }), tray.text(option.desc, { className: "text-xs text-gray-600 dark:text-gray-400 break-normal" })], { className: "flex-1" })], { className: "flex justify-start gap-3" })], {
					className: "p-4 rounded-lg border cursor-pointer transition-all bg-brand-900/10" + (option.disabled ? " opacity-50 pointer-events-none" : ""),
					onClick: ctx.eventHandler(option.eventHandlerId ?? generateRandomUUID(), () => {
						option.fieldRef?.setValue(!option.value);
						tray.update();
						option.onChange?.(!option.value);
					}),
				});

				const header = tray.div([
					tray.text(params.heading, { className: "font-semibold text-[1rem] tracking-wide transition-colors duration-300 px-4 py-1 border w-fit rounded-xl bg-gray-800/40 group-hover/settings-card:bg-brand-500/10 group-hover/settings-card:text-white flex-none" }),
					tray.text(params.description, { className: "text-sm text-[--muted] px-4 py-2 lg:py-0 w-fit" }),
				], { className: "p-0 pb-2 flex flex-col lg:flex-row items-center gap-0 mx-3 mt-3 space-y-0" });

				const opts = tray.div(params.entries.map(card), { className: `grid grid-cols-1 md:grid-cols-${params.gridCols || 2} gap-4 px-3 pb-3` });
				return tray.div([header, opts], {
					className: "border bg-[--paper] shadow-sm group/settings-card relative bg-gray-950/80 rounded-xl transition-all duration-200" + (params.disabled ? " opacity-50 pointer-events-none" : ""),
				});
			};

			function unwrap<T>(value: T | null | undefined): T | undefined {
				if (value == null) return undefined;
				if (typeof value === "object") {
					const v = (value as any).valueOf?.();
					return v == null ? undefined : v;
				}
				return value;
			}

			function toISODate(date?: $app.AL_FuzzyDateInput): string | undefined {
				if (!date || !unwrap(date)) return undefined;
				const year = unwrap(date?.year);
				if (!year) return undefined;
				const month = date.month ?? 1;
				const day = date.day ?? 1;
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

			const chunk = <T>(arr: readonly T[], size: number = 50) => {
				if (size <= 0) size = 1;
				const out: T[][] = [];
				for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
				return out;
			};

			const pageRange = (c: number, t: number, s = 9): (number | "...")[] => {
				if (t <= 0) return [];
				if (t <= s + 2) return Array.from({ length: t }, (_, i) => i);
				const half = Math.floor(s / 2);
				let start = Math.max(0, c - half);
				let end = Math.min(t - 1, c + half);
				if (c - half < 0) end = Math.min(t - 1, end + (half - c));
				if (c + half > t - 1) start = Math.max(0, start - (c + half - (t - 1)));
				const out: (number | "...")[] = [];
				if (start > 1) out.push(0, "...");
				else for (let i = 0; i < start; i++) out.push(i);
				for (let i = start; i <= end; i++) out.push(i);
				if (end < t - 2) out.push("...", t - 1);
				else for (let i = end + 1; i < t; i++) out.push(i);
				return out;
			};

			function formatTimestamp(t: number) {
				let d = new Date(t),
					n = new Date().setHours(0, 0, 0, 0),
					c = new Date(d).setHours(0, 0, 0, 0),
					p = (h: number, m: string) => {
						return `${h.toString().padStart(2, "0")}:${m}`;
					},
					time = p(d.getHours(), d.getMinutes().toString().padStart(2, "0"));
				return c === n ? `Сегодня в ${time}` :
					c === n - 864e5 ? `Вчера в ${time}` :
					`${d.toLocaleDateString("ru-RU", { month: "numeric", day: "numeric", year: "numeric" })} ${time}`;
			}

			function $_wait(ms: number): Promise<void> {
				return new Promise((resolve) => ctx.setTimeout(resolve, ms));
			}

			function generateRandomUUID() {
				return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
					((((Math.random() * 16) | 0) & (c == "x" ? 15 : 3)) | (c == "x" ? 0 : 8)).toString(16),
				);
			}

			function partition<T>(arr: T[], pred: (x: T) => boolean) {
				const pass: T[] = [], fail: T[] = [];
				for (const x of arr) (pred(x) ? pass : fail).push(x);
				return [pass, fail] as [T[], T[]];
			}

			function pretty(s: string) {
				return s.replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → camel Case
					.replace(/[_-]+/g, " ")              // snake/kebab → spaces
					.trim()
					.replace(/\b\w/g, (c) => c.toUpperCase());
			}

			const components = { button, select, groupedCheckbox, nativeSelect };
			return { components, unwrap, chunk, pageRange, partition, pretty, formatTimestamp, wait: $_wait, generateRandomUUID, toISODate, toFuzzyDate };
		})(); // prettier-ignore

		const log = (() => {
			const id = "shikimori:f9e08ae1-6a98-4ad8-b832-5cde59c7e94c";
			const modalOpened = ctx.state<boolean>(false);
			type LogRecordData = [string, "Info" | "Warning" | "Error" | "Log" | "Success"];

			const date = () => new Date().toISOString().slice(0, 19);
			const record = (message: LogRecordData) => $store.set(id, [...($store.get(id) ?? []), message]);
			const entries = () => $store.get<LogRecordData[]>(id) ?? [];

			const write = (tag: LogRecordData[1], label: string) => (message: string) => record([`${date()} |${label}| ${message}`, tag]);
			const error = write("Error", "ERR");
			const warn = write("Warning", "WRN");
			const info = write("Info", "INF");
			const success = write("Success", "SUC");
			const send = write("Log", "DBG");

			const clear = () => {
				$store.set(id, []);
				send("Log Cleared!");
			};

			const modal = (trigger: any, eventId?: string) =>
				tray.modal({
					trigger,
					title: "Логи Shikimori",
					className: "max-w-5xl",
					onOpenChange: ctx.eventHandler(eventId ?? "shikimori:logs-modal", ({ open }) => modalOpened.set(open)),
					items: [
						tray.flex([
							tray.button("Копировать в буфер обмена", {
								intent: "white",
								size: "md",
								className: "w-fit",
								onClick: ctx.eventHandler("modal:logs:clipboard:copy", () => {
									ctx.dom.clipboard.write(entries().map(([message]) => message).join("\n"));
									ctx.toast.success("Copied logs to clipboard!");
								}),
							}),
							tray.button("Очистить логи", {
								intent: "alert-subtle",
								size: "md",
								className: "w-fit",
								onClick: ctx.eventHandler("modal:logs:clipboard:clear", () => {
									clear();
									tray.update();
									ctx.toast.success("Cleared logs!");
								}),
							}),
						]),
						!modalOpened.get()
							? tray.flex([tray.img({ src: icons.get("spinner"), width: "50", className: "animate-spin" })], { className: "w-full justify-center items-center", style: { height: "5rem" }, })
							: tray.div([tray.div(
								entries().map(([message, type], idx) => {
									const className: Record<"Info" | "Warning" | "Error" | "Log" | "Success", string> = {
										Info: "text-blue-200 bg-gray-",
										Warning: "text-orange-500 bg-gray-",
										Error: "text-white bg-red-",
										Log: "text-[--muted] bg-gray-",
										Success: "text-green-200 bg-gray-",
									};
									return tray.text(message, {
										style: { fontFamily: "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace", fontSize: "16px" },
										className: className[type] + (idx % 2 === 0 ? "800" : "900"),
									});
								}),
								{ className: "text-md max-h-[40rem] p-2 min-h-12 whitespace-pre-wrap break-all" },
							)], { className: "bg-gray-900 rounded-[--radius-md] border max-w-full overflow-x-auto" }),
					],
				});

			return { modalOpened, entries, record, error, warn, info, success, send, clear, modal };
		})(); // prettier-ignore

		const application = (() => {
			const clientId = "93Vlloacsr3lOZzD8Ttx3F7E4Pv9wUlLqaAuE9XcOhQ";
			const clientSecret = "x49dnkFMduxIseuDSQE4g2mDjo9Nc8qCGMpIVe7mtKs";
			const userAgent = "Shikimori Seanime Sync";
			const redirectUri = "urn:ietf:wg:oauth:2.0:oob";
			const baseUri = "https://shikimori.io/api";
			const baseUriv2 = "https://shikimori.io/api/v2";
			const baseUriGraphQL = "https://shikimori.io/api/graphql";
			const oauthUri = "https://shikimori.io/oauth/token";

			const Network = (() => {
				const data = ctx.state<{ success: number; failed: number; lastState: string; modifier: "green" | "red" }>({
					success: 0, failed: 0, lastState: "", modifier: "green",
				});
				return {
					ok: (statusText: string) => data.set({ ...data.get(), success: data.get().success + 1, lastState: statusText, modifier: "green" }),
					err: (statusText: string) => data.set({ ...data.get(), failed: data.get().failed + 1, lastState: statusText, modifier: "red" }),
					data,
				};
			})();

			const handle = <T,>(res: $ui.FetchResponse): T => {
				if (!res.ok) {
					Network.err(res.statusText);
					throw new Error(res.json()?.message ?? res.statusText);
				}
				Network.ok(res.statusText);
				return res.json<T>();
			};

			const Auth = (() => {
				const busy = ctx.state<boolean>(false);

				const generateURL = () => {
					const url = new URL("https://shikimori.io/oauth/authorize");
					url.searchParams.set("client_id", clientId);
					url.searchParams.set("redirect_uri", redirectUri);
					url.searchParams.set("response_type", "code");
					url.searchParams.set("scope", "user_rates");
					return url.toString();
				};

				const exchangeCode = async (code: string) => {
					busy.set(true);
					const res = await ctx.fetch(oauthUri, {
						method: "POST",
						headers: { "User-Agent": userAgent, "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							grant_type: "authorization_code",
							client_id: clientId,
							client_secret: clientSecret,
							code,
							redirect_uri: redirectUri,
						}),
					}).finally(() => busy.set(false));

					const { expires_in, ...data } = handle<$shikimorisync.RequestAccessTokenResponse>(res);
					const expires_at = expires_in * 1000 + Date.now();
					$store.set("store@token", { ...data, expires_in, expires_at });
					$storage.set("storage@token", { ...data, expires_in, expires_at });
					return { ...data, expires_in, expires_at };
				};

				return { generateURL, exchangeCode, busy };
			})();

			const Token = (() => {
				$store.set("store@token", $storage.get("storage@token") ?? null);

				const refreshToken = async () => {
					const token = $store.get<Awaited<ReturnType<typeof Auth.exchangeCode>>>("store@token");
					if (!token || !token.refresh_token.length) throw new Error("Missing refresh_token. Please reauthenticate.");

					const res = await ctx.fetch(oauthUri, {
						method: "POST",
						headers: { "User-Agent": userAgent, "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({ grant_type: "refresh_token", client_id: clientId, client_secret: clientSecret, refresh_token: token.refresh_token, }),
					});

					const { expires_in, ...data } = handle<$shikimorisync.RequestAccessTokenResponse>(res);
					const expires_at = expires_in * 1000 + Date.now();
					$store.set("store@token", { ...data, expires_in, expires_at });
					$storage.set("storage@token", { ...data, expires_in, expires_at });
					return { ...data, expires_in, expires_at };
				};

				const getToken = async () => {
					let token = $store.get<Awaited<ReturnType<typeof Auth.exchangeCode>>>("store@token");
					if (!token) return token;
					if (token.expires_at < Date.now()) token = await refreshToken();
					return token.access_token;
				};

				const resetToken = () => {
					$store.set("store@token", null);
					$storage.set("storage@token", null);
				};

				return { getToken, refreshToken, resetToken, get cached_token() { return $store.get<Awaited<ReturnType<typeof Auth.exchangeCode>> | null>("store@token") } };
			})();

			const User = (() => {
				const hidename = ctx.state<boolean>(false);
				const data = ctx.state<$shikimorisync.WhoAmI | null>(null);
				return {
					get data() {
						const $data = data.get();
						return hidename.get() && $data ? { ...$data, name: "*****" } : $data;
					},
					toggleHideName() { return hidename.set(!hidename.get()); },
					get isNameHidden() { return hidename.get() },
					reset: () => data.set(null),
					fetch: async () => {
						const res = await _fetch<$shikimorisync.WhoAmI>("v1", "/users/whoami", { method: "GET" });
						data.set(res);
						return res;
					}
				}
			})();

			const _fetch = async <T>(version: "v1" | "v2" | "graphql", endpoint: string, init: RequestInit = {}) => {
				const uris = { v1: baseUri, v2: baseUriv2, graphql: baseUriGraphQL };
				const base = uris[version].replace(/\/+$/, "");
				const path = endpoint.replace(/^\/+/, "");
				const url = new URL(path ? `${base}/${path}` : base);

				const token = await Token.getToken();
				if (!token) throw new Error("Token not found!");

				const res = await ctx.fetch(url.toString(), {
					...init,
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
						"User-Agent": userAgent,
						...(init.headers as Record<string, string>),
					},
				} as FetchOptions);

				return handle<T>(res);
			};

			const List = (() => {
				const id = "aa180781-3d16-47aa-9489-2e3c9f6dcc69";
				const fetchingByType = { ANIME: ctx.state<boolean>(false), MANGA: ctx.state<boolean>(false), };

				const patch = (id: Number, body: $shikimorisync.UserRatePatchOrPutBody) =>
					_fetch<$shikimorisync.UserRateResponse>("v2", `user_rates/${id}`, {
						method: "PATCH", 
						body: JSON.stringify(body)
					});

				const post = (body: $shikimorisync.UserRateCreateBody) => 
					_fetch<$shikimorisync.UserRateResponse>("v2", "user_rates", {
						method: "POST",
						body: JSON.stringify({ user_rate: { ...body.user_rate, user_id: User.data?.id }}),
					});

				const del = async (id: number) => {
					const token = await Token.getToken();
					if (!token) throw new Error("Token not found!");
					return ctx.fetch(`${baseUri}/v2/user_rates/${id}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${await Token.getToken()}`,
							"Content-Type": "application/json",
							"User-Agent": userAgent,
						}
					})
					.then(res => {
						const bool = res.status === 204;
						Network[bool ? "ok" : "err"](res.statusText);
						if (!bool && res.status !== 404) throw new Error(res.statusText);
						return bool;
					});
				}

				// Need to fix, delta doesn't account for deleted entries
				const getUserRate = <T extends $app.AL_MediaType>(type: T, skipCache: boolean = false, throttleMs: number = 1000, checkForDeletion: boolean = false) => ctx.jobs.singleflight(`list@fetchAll:${type}`, async () => {
					const startedAt = Date.now(), cached = $storage.get<{ last_sync: number | null, data: (T extends "ANIME" ? $shikimorisync.AnimeUserRate : $shikimorisync.MangaUserRate)[] }>(`${id}:${type}`) ?? { last_sync: null, data: [] as (T extends "ANIME" ? $shikimorisync.AnimeUserRate : $shikimorisync.MangaUserRate)[] };
					if (!skipCache && cached.last_sync && (cached.last_sync + 60 * 60 * 1000 > Date.now())) {
						log.info(`[${type}List] cache HIT (${cached.data.length} entries, age=${Math.round((Date.now() - cached.last_sync) / 1000)}s)`);
						return cached.data;
					}

					const SAFETY_MS = 60_000;
					const cutoffMs = cached.last_sync != null ? cached.last_sync - SAFETY_MS : -Infinity;
					const cutoffSec = Math.floor(cutoffMs / 1000);

					log.info(`[${type}List] cache MISS (skipCache=${skipCache}, last_sync=${cached.last_sync ? new Date(cached.last_sync).toISOString() : "never"})`);
					const fetching = fetchingByType[type];
					const query = type === "ANIME"
						? /* GraphQL */ ` query AnimeUserRates($page: PositiveInt!, $limit: PositiveInt!, $userId: ID!) { userRates( page: $page limit: $limit userId: $userId targetType: Anime order: { field: updated_at, order: desc } ) { id score status episodes chapters volumes rewatches text createdAt updatedAt anime { id name russian kind status score episodes episodesAired duration isCensored airedOn { year month day } poster { previewUrl mainUrl } genres { id name } url } } } `
						: /* GraphQL */ ` query MangaUserRates($page: PositiveInt!, $limit: PositiveInt!, $userId: ID!) { userRates( page: $page limit: $limit userId: $userId targetType: Manga order: { field: updated_at, order: desc } ) { id score status episodes chapters volumes rewatches text createdAt updatedAt manga { id name russian kind status score chapters volumes isCensored airedOn { year month day } releasedOn { year month day } poster { previewUrl mainUrl } genres { id name } url } } } `;

					try {
						const limit = 50, userId = User.data?.id, delta: (T extends "ANIME" ? $shikimorisync.AnimeUserRate : $shikimorisync.MangaUserRate)[] = [];
						let page = 1, reachedEnd = false, hasNextPage = true; 
						
						fetching.set(true);
						while (hasNextPage && !reachedEnd) {
							let deltaCount = 0;
							log.info(`[${type}List] fetching page ${page} (offset=${limit * (page - 1)})`);
							const { data, errors } = await _fetch<$shikigpql.GraphQLResponse<{ userRates: (T extends "ANIME" ? $shikimorisync.AnimeUserRate : $shikimorisync.MangaUserRate)[] }>>("graphql", "", {
								method: "POST",
								body: JSON.stringify({
									query,
									variables: { page, limit, userId },
								}),
							});

							if (errors) throw new Error(errors.map(e => e.message).join(" | "));
							for (const entry of data.userRates){
								const entryTs = Date.parse(entry.updatedAt) / 1000;
								if (entryTs <= cutoffSec) {
									reachedEnd = true;
									break;
								}
								delta.push(entry);
								deltaCount++;
							}

							hasNextPage = data.userRates.length === limit;

							log.send(`[${type}List] page ${page} → ${deltaCount} delta entries (total=${delta.length}, has_next=${hasNextPage && !reachedEnd})`);

							if (hasNextPage && !reachedEnd) {
								page++;
								await utils.wait(throttleMs);
							}
						}

						const byId = new Map(cached.data.map(r => [r.id, r]));
						for (const d of delta) byId.set(d.id, d);
						let merged = Array.from(byId.values()).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

						if (checkForDeletion){
							try {
								const checkStartedAt = Date.now();
								log.info(`[${type}List] deletion check: fetching existing IDs via REST v2...`);
								
								const res = await _fetch<$shikimorisync.UserRateResponse[]>( "v2", `/user_rates?target_type=${type === "ANIME" ? "Anime" : "Manga"}&user_id=${userId}`, { method: "GET" });
								const existingIds = new Set(res.map((r) => String(r.id)));
								const beforeCount = merged.length;

								merged = merged.filter((rate) => existingIds.has(String(rate.id)));
								const deletedCount = beforeCount - merged.length;
								log.success( `[${type}List] deletion check: ${existingIds.size} exist on Shikimori, removed ${deletedCount} stale entries in ${((Date.now() - checkStartedAt) / 1000).toFixed(1)}s` );
							} catch (error) {
								log.warn(`[${type}List] deletion check failed (keeping delta result): ${(error as Error).message}`);
							}
						}

						$storage.set(`${id}:${type}`, { last_sync: Date.now(), data: merged });
						log.success(`[${type}List] completed in ${((Date.now() - startedAt) / 1000).toFixed(1)}s - delta=${delta.length}, total=${merged.length}`);
						return merged;
					} catch (err) {
						log.error(`[${type}List] fetch failed: ${(err as Error).message}`);
                        throw err;
					} finally {
						fetching.set(false);
					}
				});

				const mapMalIdstoALIds = (malIds: number[]) => ctx.jobs.singleflight("list@mapper", async () => {
					const endpoint = "https://graphql.anilist.co";
					const existing: { id: number; idMal: number; title: string }[] = [];
					const perPage = 50;
					const query = "query ($page: Int, $perPage: Int, $malIds: [Int]) { Page(page: $page, perPage: $perPage) { media(idMal_in: $malIds) { id idMal title { userPreferred } } } }";
					let page = 1;
					while (true) {
						const res = await ctx.fetch(endpoint, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ query, variables: { page, perPage, malIds } }),
						});
						if (!res.ok) {
							let err = null;
							try { err = res.json<$shikimorisync.AnilistError>(); } catch { err = null; }
							throw new Error(err?.errors?.map((m) => m.message).join(" ") ?? res.statusText);
						}
						const json = res.json<{ data: { Page: { media: { id: number, idMal: number | null, title: { userPreferred?: string }}[]}}} | $shikimorisync.AnilistError>();
						if (!json.data) throw new Error(json.errors?.map((e) => e.message).join("\n"));
						existing.push( ...json.data.Page.media
                            .filter((m): m is typeof m & { idMal: number } => m.idMal != null)
                            .map(({ title, ...rest }) => ({ ...rest, title: title.userPreferred ?? "Untitled" })),
                        );

                        if (json.data.Page.media.length < perPage) break;
						await utils.wait(2_500);
						page++;
					}
					return existing;
				});

				const clearCache = () => {
					$storage.set(`${id}:ANIME`, { last_sync: null, data: [] });
					$storage.set(`${id}:MANGA`, { last_sync: null, data: [] });
				};

				// --- MODAL (factory: one store per type) ---
				const makeModal = (type: "ANIME" | "MANGA") => {
					const currentPageIndex = ctx.state<number>(0);
					const searchQuery = ctx.state<string>("");
					const isModalOpen = ctx.state<boolean>(false);

					const sortOpts = [
						{ label: "По умолчанию", value: "default" },
						{ label: "Название (А–Я)", value: "title_asc" },
						{ label: "Название (Я–А)", value: "title_desc" },
						{ label: "Недавно добавленные", value: "last_created_desc" },
						{ label: "Недавно обновлённые", value: "last_updated_desc" },
						{ label: "Прогресс", value: "progress_desc" },
						{ label: "Оценка", value: "rating_desc" },
					] as const;
					const selectedSort = ctx.state<(typeof sortOpts)[number]["value"]>("default");

					const listStatusOpts: { label: string; value: $shikimorisync.UserRateStatus | "default" }[] = [
						{ label: "Все статусы", value: "default" },
						{ label: "Запланировано", value: "planned" },
						{ label: "Смотрю", value: "watching" },
						{ label: "Просмотрено", value: "completed" },
						{ label: "Брошено", value: "dropped" },
						{ label: "Отложено", value: "on_hold" },
					] as const;
					const selectedListStatus = ctx.state<typeof listStatusOpts[number]["value"]>("default");

					const formatOpts: { label: string; value: keyof typeof $shikigpql.AnimeKindEnum | keyof typeof $shikigpql.MangaKindEnum | "default" }[] = 
						type === "ANIME" 
						? [
							{ label: "Все форматы", value: "default" },
							{ label: "ТВ", value: "tv" },
							{ label: "Фильм", value: "movie" },
							{ label: "OVA", value: "ova" },
							{ label: "ONA", value: "ona" },
							{ label: "Спешл", value: "special" },
							{ label: "ТВ-спешл", value: "tv_special" },
							{ label: "Клип", value: "music" },
							{ label: "Рекламный ролик", value: "pv" },
							{ label: "Реклама", value: "cm" },
						] : [
							{ label: "Все форматы", value: "default" },
							{ label: "Манга", value: "manga" },
							{ label: "Манхва", value: "manhwa" },
							{ label: "Маньхуа", value: "manhua" },
							{ label: "Ранобэ", value: "light_novel" },
							{ label: "Новелла", value: "novel" },
							{ label: "Ваншот", value: "one_shot" },
							{ label: "Додзинси", value: "doujin" },
						];
					const selectedFormat = ctx.state<(typeof formatOpts)[number]["value"]>("default");

					const formatEntry = (entry: $shikimorisync.AnimeUserRate | $shikimorisync.MangaUserRate, idx: number) => {
						const data = (type === "ANIME" ? (() => {
							const e = entry as $shikimorisync.AnimeUserRate;
							return {
								img: e.anime.poster?.mainUrl,
								title: e.anime.russian ?? e.anime.name,
								type: formatOpts.find(x => x.value === e.anime.kind)?.label ?? e.anime.kind,
								progress: e.episodes?.toString(),
								progressKey: "Эпизоды",
								status: listStatusOpts.find(x => x.value === e.status)?.label ?? e.status,
								score: e.score?.toString(),
								updated: new Date(e.updatedAt).toLocaleDateString("ru-RU"),
								url: e.anime.url,
							};
						}) : (() => {
							const e = entry as $shikimorisync.MangaUserRate;
							return {
								img: e.manga.poster?.mainUrl,
								title: e.manga.russian ?? e.manga.name,
								type: formatOpts.find(x => x.value === e.manga.kind)?.label ?? e.manga.kind,
								progress: e.chapters?.toString(),
								progressKey: "Главы",
								status: listStatusOpts.find(x => x.value === e.status)?.label ?? e.status,
								score: e.score?.toString(),
								updated: new Date(e.updatedAt).toLocaleDateString("ru-RU"),
								url: e.manga.url,
							};
						}))();

						return tray.a({
							href: data.url,
							items: [
								tray.img({ src: data.img ?? "", width: "100", className: "shrink-0 object-cover group-hover:opacity-50 group-hover:scale-105 transition-all duration-200" }),
								tray.div([
									tray.flex([tray.text(data.title ?? "", { className: "font-semibold w-full line-clamp-2 break-normal text-pretty" })]),
									tray.div([
										tray.div([tray.text("Тип", { className: "text-xs text-[--muted] font-semibold" }), tray.text(data.type ?? "--")]),
										tray.div([tray.text(data.progressKey, { className: "text-xs text-[--muted] font-semibold" }), tray.text(data.progress ?? "--")]),
										tray.div([tray.text("Статус", { className: "text-xs text-[--muted] font-semibold" }), tray.text(utils.pretty(data.status ?? "--"))]),
										tray.div([tray.text("Оценка", { className: "text-xs text-[--muted] font-semibold" }), tray.text(data.score ?? "--")]),
										tray.div([tray.text("Обновлено", { className: "text-xs text-[--muted] font-semibold" }), tray.text(data.updated ?? "--")]),
									], { className: "grid grid-cols-3 gap-2 text-xs" }),
								], { className: "space-y-3 p-2 w-full bg-gray-950" }),
							],
							className: "group flex border rounded-2xl overflow-hidden cursor-pointer no-underline",
							style: { gap: "0rem", flexDirection: "row" },
						});
					};

					const modal = (trigger: any, eventId?: string) => {
						const { last_sync, data } = $storage.get<{ last_sync: number | null, data: (( $shikimorisync.AnimeUserRate | $shikimorisync.MangaUserRate))[]}>(`${id}:${type}`) ?? { last_sync: null, data: [] };
						
						const pre = [...data]
							.sort((a, b) => {
								switch (selectedSort.get()) {
									case "title_asc": 
										return (a["anime" in a ? "anime" : "manga"]?.russian || a["anime" in a ? "anime" : "manga"]?.name)?.localeCompare((b["anime" in b ? "anime" : "manga"]?.russian || b["anime" in b ? "anime" : "manga"]?.name) ?? "") ?? 0;
									case "title_desc": 
										return (b["anime" in b ? "anime" : "manga"]?.russian || b["anime" in b ? "anime" : "manga"]?.name)?.localeCompare((a["anime" in a ? "anime" : "manga"]?.russian || a["anime" in a ? "anime" : "manga"]?.name) ?? "") ?? 0;
									case "last_created_desc":
										return (b.createdAt).localeCompare(a.createdAt);
									case "last_updated_desc":
										return (b.updatedAt).localeCompare(a.updatedAt);
									case "progress_desc": {
											const pa = "episodes" in a ? a.episodes : a.chapters;
											const pb = "episodes" in b ? b.episodes : b.chapters;
											return (pb ?? 0) - (pa ?? 0);
										}
									case "rating_desc": 
										return (b.score ?? 0) - (a.score ?? 0);
									default: return 0;
								}
							})
							.filter((a) => {
								if (!((a["anime" in a ? "anime" : "manga"]?.russian || a["anime" in a ? "anime" : "manga"]?.name) ?? "").includes(searchQuery.get().toLowerCase())) return false;
								const ls = selectedListStatus.get(), fmt = selectedFormat.get();
								if (ls !== "default" && ls !== a.status) return false;
								if (fmt !== "default" && fmt !== a["anime" in a ? "anime" : "manga"]?.kind) return false;
								return true;
							});

						const paginated = utils.chunk(pre.map(formatEntry), 20);
						const curIdx = Math.max(0, Math.min(currentPageIndex.get(), paginated.length - 1));

						const styles = tray.css(/*css*/`
							.group .group-hover\\:visible { visibility: hidden; opacity: 0; transition: visibility 0.2s, opacity 0.2s; }
							.group:hover .group-hover\\:visible { visibility: visible; opacity: 1; }
							.group .group-hover\\:opacity-50 { opacity: 0.5; }
							.group:hover .group-hover\\:opacity-50 { opacity: 1; }
							.group:hover .group-hover\\:scale-105 { transform: scale(1.08) }
						`);

						const step = (delta: number) => currentPageIndex.set(Math.min(Math.max(curIdx + delta, 0), Math.max(paginated.length, 1) - 1));
						const pages = tray.flex([
							utils.components.button({ icon: "caret_left_fill", tooltip: "Назад", size: "sm", transparent: true, disabled: curIdx === 0, onClick: ctx.eventHandler(`${type}:page:left`, () => step(-1)) }),
							utils.pageRange(curIdx, paginated.length, 5).map((e) => {
								if (e === "...") return tray.span("...");
								return tray.button(`${e + 1}`, {
									intent: e === curIdx ? "primary" : "gray-subtle",
									disabled: e === curIdx,
									size: "sm",
									className: `rounded-full ${e !== curIdx ? "bg-transparent" : ""}`.trim(),
									onClick: ctx.eventHandler(`${type}:page:${e}`, () => { if (e !== curIdx) currentPageIndex.set(e); }),
								});
							}),
							utils.components.button({ icon: "caret_right_fill", tooltip: "Вперёд", size: "sm", transparent: true, disabled: curIdx >= paginated.length - 1, onClick: ctx.eventHandler(`${type}:page:right`, () => step(+1)) }),
						], { className: "w-fit p-2 rounded-full border" });

						const advanced_search = tray.flex([
							tray.div([
								tray.div([tray.input({
									placeholder: "Поиск",
									value: searchQuery.get(),
									disabled: fetchingByType[type].get() || !isModalOpen.get(),
									onChange: ctx.eventHandler(`${type}:search`, ({ value }: { value: string }) => searchQuery.set(value)),
									style: {
										paddingInlineStart: "2rem",
										backgroundImage: `url(${icons.get("search")})`,
										backgroundPosition: "0.5rem center",
										backgroundSize: "1rem",
										backgroundRepeat: "no-repeat",
									},
								})], { style: { width: "25rem" } }),
								tray.div([
									utils.components.nativeSelect("sort", {
										value: selectedSort.get(),
										disabled: fetchingByType[type].get() || !isModalOpen.get(),
										onChange: ctx.eventHandler(`${type}:sort`, ({ value }: { value: (typeof sortOpts)[number]["value"]}) => selectedSort.set(value)),
										options: [...sortOpts],
									}),
									utils.components.nativeSelect("status", {
										value: selectedListStatus.get(),
										disabled: fetchingByType[type].get() || !isModalOpen.get(),
										onChange: ctx.eventHandler(`${type}:status`, ({ value }: { value: (typeof listStatusOpts)[number]["value"]}) => selectedListStatus.set(value)),
										options: [...listStatusOpts],
									}),
									utils.components.nativeSelect("format", {
										value: selectedFormat.get(),
										disabled: fetchingByType[type].get() || !isModalOpen.get(),
										onChange: ctx.eventHandler(`${type}:format`, ({ value }) => selectedFormat.set(value)),
										options: [...formatOpts],
									}),
								], { className: "grid grid-cols-4 gap-2" }),
							], { className: "w-full space-y-2" }),
							utils.components.button({
								icon: "refresh", stroke: "#000", tooltip: "Обновить список",
								className: "rounded-xl", intent: "white", size: "lg",
								loading: fetchingByType[type].get() || !isModalOpen.get(),
								onClick: ctx.eventHandler(`${type}:refresh`, () => getUserRate(type, true, 1000, true)
									.then(() => ctx.jobs.debounce(`${type}:refresh-deb`, () => ctx.toast.success("Список Shikimori загружен!"), 500))
									.catch((err: Error) => ctx.toast.error(err.message))),
							}),
						], { className: "border px-2 py-3 rounded-2xl bg-gray-900 w-full" });

						return tray.modal({
							trigger,
							title: `Список Shikimori (${type})`,
							description: `Последняя синхронизация: ${last_sync ? utils.formatTimestamp(new Date(last_sync).getTime()) : "Неизвестно"}`,
							className: "max-w-5xl",
							items: [
								tray.div([
									styles,
									advanced_search,
									(fetchingByType[type].get() || !isModalOpen.get())
										? [tray.flex([tray.img({ src: icons.get("spinner"), width: "50", className: "animate-spin" })], { className: "w-full justify-center items-center", style: { height: "25rem" } })]
										: [
											tray.div(paginated[curIdx] ?? [], { className: "grid grid-cols-2 gap-3" }),
											tray.text("Ваш список пуст", {
												className: "text-center p-5 text-xl font-semibold text-[--muted] border rounded-lg",
												style: { display: paginated[curIdx]?.length ? "none" : "block" },
											}),
										],
								], { className: "space-y-2" }),
							],
							footer: fetchingByType[type].get() || !isModalOpen.get() ? [] : [tray.flex([pages], { className: "justify-center w-full" })],
							onOpenChange: ctx.eventHandler(eventId ?? `${type}-list-modal`, ({ open }: { open: boolean }) => {
								isModalOpen.set(open);
								if (open && !data.length && !fetchingByType[type].get()) {
									getUserRate(type).catch((err) => log.error(`[${type}List]: ${err.message}`));
								}
								if (!open) {
									currentPageIndex.set(0);
									searchQuery.set("");
									selectedSort.set("default");
									selectedListStatus.set("default");
								}
							}),
						});
					};

					return { modal };
				};

				const anime = makeModal("ANIME");
				const manga = makeModal("MANGA");

				return { getUserRate, patch, post, delete: del, anime, manga, mapMalIdstoALIds, clearCache };
			})();

			return { Network, Auth, Token, User, List };
		})(); // prettier-ignore

		const notifications = (() => {
			const id = "159ea4fe-5a29-485c-96a6-d236c0f04876";
			const modalOpened = ctx.state<boolean>(false);
			const currentPageIndex = ctx.state<number>(0);
			const suppressBadge = ctx.state<boolean>($storage.get<boolean | undefined>("shikimori:options-suppressnotificationbadge") ?? false);
			const unreads = ctx.state<number>(0);

			const entries = () => $storage.get<$shikimorisync.NotificationV2[]>(id) ?? [];

			const add = (data: Omit<$shikimorisync.NotificationV2, "timestamp" | "unread">) => {
				$storage.set(id, [...entries(), { ...data, timestamp: Date.now(), unread: true }]);
				unreads.set(entries().filter((x) => x.unread).length);
			};

			const clear = () => {
				unreads.set(0);
				$storage.set(id, []);
			};

			const formatEntry = (n: $shikimorisync.NotificationV2, idx: number, arr: $shikimorisync.NotificationV2[]) => {
				const thumbnail = tray.div([tray.img({ src: n.thumbnail ?? "", width: "70", className: "rounded-lg" })], { className: "relative shrink-0" });
				const title = tray.text(n.title, { className: "w-full font-bold mb-2 break-normal line-clamp-2" });
				const desc = n.description ? tray.text(n.description, { className: "w-full break-normal text-sm text-[--muted] pb-2" }) : [];
				const timestamp = tray.text(utils.formatTimestamp(n.timestamp), { className: "w-full break-normal text-xs text-[--muted] mt-2" });
				const fields = tray.div(
					(n.fields ?? []).map((f) =>
						tray.div([tray.text(f.name, { className: "text-xs text-[--muted]" }), tray.text(f.value, { className: "font-semibold" })]),
					),
					{ className: "grid grid-cols-3 gap-2 text-sm" },
				);

				const markRead = utils.components.button({
					icon: "check2all",
					tooltip: "Отметить как прочитанное",
					intent: "success-subtle",
					transparent: true,
					style: { width: "2.5rem", height: "2.5rem" },
					onClick: ctx.eventHandler(`notification-entry-${idx}`, () => {
						arr[idx].unread = false;
						$storage.set(id, [...arr].reverse());
						unreads.set(entries().filter((e) => e.unread).length);
					}),
				});

				const deleteEntry = utils.components.button({
					icon: "delete",
					tooltip: "Удалить",
					intent: "alert-subtle",
					transparent: true,
					style: { width: "2.5rem", height: "2.5rem" },
					onClick: ctx.eventHandler(utils.generateRandomUUID(), () => {
						$storage.set(id, arr.toSpliced(idx, 1).reverse());
						unreads.set(entries().filter((e) => e.unread).length);
					}),
				});

				const actionbtns = tray.stack([n.unread ? markRead : [], deleteEntry], { className: "group-hover:visible" });

				return tray.div(
					[
						n.unread
							? [
									tray.div([], { className: "w-3 h-3 rounded-full bg-red-500 absolute border border-white", style: { right: "-0.25rem", top: "-0.1rem" } }),
									tray.div([], { className: "absolute z-[0] left-0 top-0 h-full w-full bg-gradient-to-r to-gray-900 max-w-[50%] from-yellow-900/10" }),
								]
							: [],
						tray.flex([thumbnail, tray.div([title, desc, fields, timestamp], { className: "relative flex-1" }), actionbtns], { gap: 3 }),
					],
					{
						className: `relative group p-2 rounded-lg cursor-pointer border bg-gray-900${n.unread ? " border-yellow-400/10" : "/70"}`,
						style: { borderLeftWidth: "0.5rem", ...(n.accentColor && { borderLeftColor: n.accentColor }) },
					},
				);
			};

			const modal = (trigger: any, eventId?: string) => {
				const paginated = utils.chunk(entries().reverse(), 15);
				const curIdx = Math.max(0, Math.min(currentPageIndex.get(), paginated.length - 1));

				const btnAllRead = tray.button("Отметить все как прочитанные", {
					intent: "gray-subtle",
					size: "md",
					className: "w-fit bg-transparent border",
					style: { borderColor: "var(--border)" },
					disabled: unreads.get() <= 0,
					onClick: ctx.eventHandler(eventId ?? utils.generateRandomUUID(), () => {
						$storage.set(
							id,
							entries().map((e) => ({ ...e, unread: false })),
						);
						unreads.set(0);
					}),
				});

				const btnAllDelete = tray.button("Удалить все", {
					intent: "alert-subtle",
					size: "md",
					className: "w-fit",
					disabled: !entries().length,
					onClick: ctx.eventHandler(utils.generateRandomUUID(), () => {
						$storage.set(id, []);
						unreads.set(0);
					}),
				});

				const styles = tray.css(/*css*/ `
					.group .group-hover\\:visible { visibility: hidden; opacity: 0; transition: visibility 0.2s, opacity 0.2s; }
					.group:hover .group-hover\\:visible { visibility: visible; opacity: 1; }
				`);

				return tray.modal({
					trigger,
					title: "Уведомления Shikimori",
					className: "max-w-2xl",
					items: [
						tray.flex([btnAllRead, btnAllDelete]),
						!modalOpened.get()
							? [
									tray.flex([tray.img({ src: icons.get("spinner"), width: "50", className: "animate-spin" })], {
										className: "w-full justify-center items-center",
										style: { height: "25rem" },
									}),
								]
							: tray.div(
									[
										styles,
										paginated[curIdx]?.map(formatEntry) ?? [],
										tray.text("Нет уведомлений", {
											className: "text-center p-5 text-xl font-semibold text-[--muted] border rounded-lg",
											style: { display: paginated[curIdx]?.length ? "none" : "block" },
										}),
									],
									{ className: "space-y-2" },
								),
					],
					onOpenChange: ctx.eventHandler("shikimori-notification-modal", ({ open }) => {
						modalOpened.set(open);
						if (!open) currentPageIndex.set(0);
					}),
				});
			};

			unreads.set(entries().filter((x) => x.unread).length);
			return { unreads, entries, add, modal, clear, suppressBadge };
		})(); // prettier-ignore

		const sync = (() => {
			const includeAdult = ctx.state<boolean>(false);
			const includePrivate = ctx.state<boolean>(false);
			const busy = ctx.state<boolean>(false);
			const mediaType = ctx.state<$app.AL_MediaType>("ANIME");
			const type = ctx.state<"patch" | "post" | "fullsync">("patch");
			const kind = ctx.state<"import" | "export">("import");
			const aborted = ctx.state<boolean>(false);
			const disableLiveSync = ctx.fieldRef<boolean>(false);
			const skipAdultLiveSync = ctx.fieldRef<boolean>($storage.get("shikimori:options-skipAdult")?.valueOf() ?? false);

			const isCustom = (mediaId: number) => (mediaId ?? 0) >= 2 ** 31;

			const run = (afn: () => Promise<void>) => {
				if (busy.get()) throw new Error("A sync is already running!");
				busy.set(true);
				aborted.set(false);
				afn()
					.then(() => log.send("synclist > Operation finished successfully."))
					.catch((err: Error) => {
						log.error(`synclist > ${err.message}`);
						notifications.add({ title: "Ошибка ручной синхронизации", description: err.message, accentColor: "#ef5350", thumbnail: icons.get("gears") });
					})
					.finally(() => {
						busy.set(false);
						aborted.set(false);
					});
			};

			const statusToShikimori = (s?: $app.AL_MediaListStatus): $shikimorisync.UserRateStatus | undefined => {
				if (!s) return s;
				const map: Record<$app.AL_MediaListStatus, $shikimorisync.UserRateStatus> = {
					COMPLETED: "completed",
					CURRENT: "watching",
					DROPPED: "dropped",
					PAUSED: "on_hold",
					PLANNING: "planned",
					REPEATING: "rewatching",
				};
				return map[s];
			};
			const statusToAL = (s: $shikimorisync.UserRateStatus): $app.AL_MediaListStatus => {
				const map: Record<$shikimorisync.UserRateStatus, $app.AL_MediaListStatus> = {
					completed: "COMPLETED",
					watching: "CURRENT",
					dropped: "DROPPED",
					on_hold: "PAUSED",
					planned: "PLANNING",
					rewatching: "REPEATING",
				};
				return map[s];
			};

			const getAnilistEntries = <T extends "ANIME" | "MANGA">(mt: T) =>
				($anilist[mt === "ANIME" ? "getAnimeCollection" : "getMangaCollection"](false).MediaListCollection?.lists ?? [])
					.flatMap((e) => e.entries)
					.filter((e): e is NonNullable<typeof e> => !!e && !!e.media)
					.map(({ media, ...rest }) => ({
						...rest,
						title: media?.title?.userPreferred,
						mediaId: media?.id,
						idMal: media?.idMal,
						format: media?.format,
						coverImage: media?.coverImage?.large,
						isAdult: media?.isAdult,
						type: media?.type,
					}));

			async function perfImport() {
				const mt = mediaType.get(), t = type.get(), k = kind.get(), a = includeAdult.get(), p = includePrivate.get();
				const counts = { candidates: 0, updated: 0, no_delta: 0, no_idMal: 0, errored: 0, deleted: 0, delete_candidates: 0 };
				log.send(`synclist > Performing Manual Sync | mediaType="${mt}" type="${t}" kind="${k}" includeAdult="${a}" includePrivate="${p}"`);

				const forFullSyncDeletion: number[] = [];
				const validate = (listEntries: ReturnType<typeof getAnilistEntries>) => {
					if (!a) {
						const [nonAdults, adults] = utils.partition(listEntries, (l) => !utils.unwrap(l.isAdult));
						if (t === "fullsync") forFullSyncDeletion.push(...adults.map((e) => Number(e.idMal)).filter(Number.isFinite));
						listEntries = nonAdults;
						log.send(`synclist > [${mt}] Pruned [${adults.length}] adult entries`);
					}
					if (!p) {
						const [nonPriv, priv] = utils.partition(listEntries, (l) => !utils.unwrap(l.private));
						if (t === "fullsync") forFullSyncDeletion.push(...priv.map((e) => Number(e.idMal)).filter(Number.isFinite));
						listEntries = nonPriv;
						log.send(`synclist > [${mt}] Pruned [${priv.length}] private entries`);
					}
					const [nonCustom, custom] = utils.partition(listEntries, (l) => !isCustom(l.mediaId || 0));
					if (custom.length) log.send(`synclist > [${mt}] Pruned [${custom.length}] custom entries`);
					return nonCustom;
				};

				log.send("synclist > Scanning List...");
				const entries = getAnilistEntries(mt);
				log.info(`synclist > Found ${entries.length} entries!`);

				if (aborted.get()) throw new Error("Operation aborted by <User>");
				const shikimoriEntries = await application.List.getUserRate(mt);
				log.success(`synclist > Fetched ${shikimoriEntries.length} Shikimori entries!`);

				const shikimoriSet = new Set(shikimoriEntries.map((x) => Number("anime" in x && x.anime ? x.anime.id : x.manga.id)).filter(Number.isFinite));
				const listInclude = (anilist: typeof entries) => {
					log.send(`synclist > [${mt}] listInclude shikimoriSet=${shikimoriSet.size} anilist=${anilist.length} t=${t}`);
					switch (t) {
						case "patch":
							return new Set(anilist
								.filter((x) => Number.isFinite(Number(x.idMal)) && !shikimoriSet.has(Number(x.idMal)))
								.map((x) => Number(x.mediaId))
								.filter(Number.isFinite));
						case "post":
							return new Set(anilist
								.filter((x) => Number.isFinite(Number(x.idMal)) && shikimoriSet.has(Number(x.idMal)))
								.map((x) => Number(x.mediaId))
								.filter(Number.isFinite));
						default:
							return new Set(anilist.map((x) => Number(x.mediaId)).filter(Number.isFinite));
					}
				};

				const included = listInclude(entries);
				log.send(`synclist > [${mt}] included=${included.size}`);

				for (const entry of validate(entries).filter((e) => included.has(e.mediaId!))) {
					if (aborted.get()) break;
					counts.candidates++;

					if (!entry.idMal) {
						log.send(`synclist > [skip] ${entry.title} | reason=no_idMal | mediaId=${entry.mediaId}`);
						counts.no_idMal++;
						continue;
					}

					const shikimoriEntry = shikimoriEntries.find((x) => Number("anime" in x && x.anime ? x.anime.id : x.manga.id) === Number(entry.idMal));
					const rateBase: Omit<$shikimorisync.UserRateBase, "user_id"> = {};

					const status = utils.unwrap(entry.status);
					if (status && shikimoriEntry?.status !== statusToShikimori(status)) rateBase.status = statusToShikimori(status);

					const score = utils.unwrap(entry.score);
					if (score != null && Math.round(score / 10) !== (shikimoriEntry?.score ?? 0)) {
						rateBase.score = Math.round(score / 10);
					}
					
					const progress = utils.unwrap(entry.progress);
					if (progress) {
						if (mt === "ANIME") {
							const animeEpisodes = (shikimoriEntry as $shikimorisync.AnimeUserRate)?.anime?.episodes ?? 0;
							const target = animeEpisodes > 0 ? Math.min(progress, animeEpisodes) : progress;
							if ((shikimoriEntry as $shikimorisync.AnimeUserRate)?.episodes !== target) rateBase.episodes = target;
						}
						if (mt === "MANGA") {
							const mangaChapters = (shikimoriEntry as $shikimorisync.MangaUserRate)?.manga?.chapters ?? 0;
							const target = mangaChapters > 0 ? Math.min(progress, mangaChapters) : progress;
							if ((shikimoriEntry as $shikimorisync.MangaUserRate)?.chapters !== target) rateBase.chapters = target;
						}
					}

					const repeat = utils.unwrap(entry.repeat);
					if (repeat != null && mt === "ANIME" && shikimoriEntry?.rewatches !== repeat) rateBase.rewatches = repeat;

					const notes = utils.unwrap(entry.notes);
					if (notes && shikimoriEntry?.text !== notes) rateBase.text = notes;

					if (!Object.keys(rateBase).filter(Boolean).length) {
						counts.no_delta++;
						continue;
					}

					try {
						if (typeof shikimoriEntry?.id === "number") {
							await application.List.patch(shikimoriEntry.id, { user_rate: rateBase });
						} else {
							await application.List.post({ user_rate: { ...rateBase, target_id: entry.idMal, target_type: mt === "ANIME" ? "Anime" : "Manga" }});
						}
						log.success(`synclist > Updated ${entry.title} on Shikimori. ${JSON.stringify(rateBase)}`);
						counts.updated++;
					} catch (e) {
						log.error(`synclist > Failed to update ${entry.title}: ${(e as Error).message}`);
						counts.errored++;
					}
					await utils.wait(1_000);
				}

				if (t === "fullsync" && !aborted.get()) {
					const toDelete = [...new Set(forFullSyncDeletion)]
						.map(Number)
						.filter(Number.isFinite)
						.filter((idMal) => shikimoriEntries.some((x) => Number("anime" in x && x.anime ? x.anime.id : x.manga.id) === idMal));

					counts.delete_candidates = toDelete.length;
					if (toDelete.length === 0) {
						log.info(`synclist > [fullsync] nothing to delete from Shikimori`);
					} else {
						log.info(`synclist > [fullsync] deleting ${toDelete.length} entries from Shikimori`);
						for (const idMal of toDelete) {
							if (aborted.get()) {
								log.warn(`synclist > [fullsync] aborted by user`);
								break;
							}
							const entry = shikimoriEntries.find((x) => Number("anime" in x && x.anime ? x.anime.id : x.manga.id) === idMal);
							const title = entry ? ("anime" in entry && entry.anime ? entry.anime.name : entry.manga.name) : `shikimori/${idMal}`;
							try {
								if (!entry?.id) {
									log.error(`synclist > failed to delete ${title} | not_found`);
									counts.errored++;
									continue;
								}
								const ok = await application.List.delete(Number(entry.id));
								if (ok) {
									log.success(`synclist > deleted ${title}`);
									counts.deleted++;
								} else {
									log.error(`synclist > failed to delete ${title}`);
									counts.errored++;
								}
							} catch (e) {
								log.error(`synclist > failed to delete ${title}: ${(e as Error).message}`);
								counts.errored++;
							}
							await utils.wait(1_000);
						}
					}
				}

				await application.List.getUserRate(mt, true, 1_000, true)
					.then(() => log.info(`synclist > [fetchAll] updated ${mt} store!`))
					.catch((e) => log.error(`synclist > [fetchAll] failed to update ${mt} store: ${e.message}`));

				notifications.add({
					title: `Ручная синхронизация ${aborted.get() ? "отменена" : "завершена"}`,
					accentColor: aborted.get() ? "#d44949c4" : "#3fa05ac4",
					thumbnail: icons.get("gears"),
					fields: [
						{ name: "Тип", value: t.toUpperCase() },
						{ name: "Направление", value: k === "import" ? "AniList → Shikimori" : "Shikimori → AniList" },
						{ name: "Медиа", value: mt },
						{ name: "Кандидаты", value: (counts.candidates || "Нет").toString() },
						{ name: "Обновлено", value: (counts.updated || "Нет").toString() },
						{ name: "Без изменений", value: (counts.no_delta || "Нет").toString() },
						{ name: "Без привязки", value: (counts.no_idMal || "Нет").toString() },
						...(t === "fullsync" ? [{ name: "Удалено", value: counts.delete_candidates ? `${counts.deleted}/${counts.delete_candidates}` : "Нет" }] : []),
						{ name: "Ошибки", value: (counts.errored || "Нет").toString() },
					],
				});
			};

			async function perfExport() {
				const mt = mediaType.get(), t = type.get(), k = kind.get(), a = includeAdult.get();
				log.send(`synclist > Performing Manual Sync | type="${t}" kind="${k}" mediaType="${mt}"`);

				const token = $database.anilist.getToken();
				if (!token.length) return log.error(`synclist > No AniList Token detected! Cancelling sync...`);

				const forFullSyncDeletion: number[] = [];
				const shikimoriEntries = await application.List.getUserRate(mt, true, 1_000, true);

				const validate = (listEntries: typeof shikimoriEntries) => {
					if (!a) {
						const [non, adults] = utils.partition(listEntries, (l) => !(l["anime" in l && l.anime ? "anime" : "manga"]?.isCensored ?? false));
						if (t === "fullsync") forFullSyncDeletion.push(...adults.map((e) => Number("anime" in e && e.anime ? e.anime.id : e.manga.id)).filter(Number.isFinite));
						listEntries = non;
					}
					return listEntries;
				};

				const alEntries = getAnilistEntries(mt);
				const mappedAl = new Map(alEntries.filter((e): e is typeof e & { idMal: number } => e.idMal != null).map((e) => [e.idMal, e]));

				const notInAl = shikimoriEntries.map((e) => Number("anime" in e && e.anime ? e.anime.id : e.manga.id)).filter((id) => !mappedAl.has(id));
				const mapping =
					t === "patch" || !notInAl.length
						? []
						: await application.List.mapMalIdstoALIds(notInAl).catch((err) => {
								log.error(`synclist > mapping failed: ${err.message}`);
								return [];
							});
				const mapped = new Map(mapping.map((e) => [e.idMal, e]));

				let processed = 0;
				for (const shikimoriEntry of validate(shikimoriEntries)) {
					const isAnime = "anime" in shikimoriEntry && shikimoriEntry.anime;
					const target_id = Number(isAnime ? shikimoriEntry.anime.id : shikimoriEntry.manga.id);
					const alEntry = mappedAl.get(target_id) ?? mapped.get(target_id);
					if (!alEntry) {
						log.warn(`synclist > no mapping for shikimori/${target_id}`);
						continue;
					}

					const body: $shikimorisync.AnilistSaveMediaListEntryVariables = { mediaId: alEntry.id };
					const progress = isAnime ? shikimoriEntry.episodes : shikimoriEntry.chapters;
					const tgtProgress = utils.unwrap((alEntry as any).progress);
					if (progress !== tgtProgress) body.progress = progress ?? null;

					if (shikimoriEntry.score != null) {
						const src = Math.round(shikimoriEntry.score * 10);
						const tgt = utils.unwrap((alEntry as any).score);
						if (src !== tgt) body.scoreRaw = src;
					}

					if (shikimoriEntry.status) {
						const src = statusToAL(shikimoriEntry.status);
						const tgt = utils.unwrap((alEntry as any).status);
						if (src !== tgt) body.status = src;
					}

					if (shikimoriEntry.text) {
						const src = shikimoriEntry.text;
						const tgt = utils.unwrap((alEntry as any).notes);
						if (src !== tgt) body.notes = src;
					}

					if (Object.keys(body).length <= 1) continue;

					await ctx
						.fetch("https://graphql.anilist.co/", {
							method: "POST",
							headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
							body: JSON.stringify({
								query: "mutation ($mediaId: Int!, $status: MediaListStatus, $progress: Int, $scoreRaw: Int, $notes: String) { SaveMediaListEntry(mediaId: $mediaId, status: $status, progress: $progress, scoreRaw: $scoreRaw, notes: $notes) { id status progress scoreRaw media { title { userPreferred } } } }",
								variables: body,
							}),
						})
						.then((res) => {
							if (!res.ok) throw new Error(res.statusText);
							log.success(`synclist > Synced ${alEntry.title}`);
							processed++;
						})
						.catch((e: Error) => log.error(`synclist > Failed to sync ${alEntry.title}: ${e.message}`));
					await utils.wait(2_000);
				}

				if (t === "fullsync" && forFullSyncDeletion.length) {
					for (const idMal of [...new Set(forFullSyncDeletion)]) {
						const al = mappedAl.get(idMal);
						if (!al) continue;
						await ctx
							.fetch("https://graphql.anilist.co/", {
								method: "POST",
								headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
								body: JSON.stringify({ query: "mutation ($id: Int) { DeleteMediaListEntry(id: $id) { deleted } }", variables: { id: al.id } }),
							})
							.then((res) => {
								if (res.ok) log.success(`synclist > Deleted ${al.title}`);
							})
							.catch((e: Error) => log.error(`synclist > Delete failed: ${e.message}`));
						await utils.wait(2_000);
					}
				}

				notifications.add({
					title: "Ручная синхронизация завершена",
					accentColor: "#0b7b2ac4",
					thumbnail: icons.get("gears"),
					fields: [
						{ name: "Тип", value: t.toUpperCase() },
						{ name: "Направление", value: "Shikimori → AniList" },
						{ name: "Обработано", value: processed.toString() },
					],
				});
			};

			function buildDeltaFields(
				action: "update" | "progress" | "repeat",
				body: Omit<$shikimorisync.UserRateBase, "user_id">,
				entry: NonNullable<Awaited<ReturnType<typeof getMedia>>>,
			): { name: string; value: string }[] {
				const out: { name: string; value: string }[] = [];

				const STATUS_RU: Record<string, string> = {
					planned: "Запланировано",
					watching: "Смотрю",
					rewatching: "Пересматриваю",
					completed: "Просмотрено",
					on_hold: "Отложено",
					dropped: "Брошено",
				};

				if (body.status !== undefined) {
					out.push({ name: "Статус", value: STATUS_RU[String(body.status)] ?? String(body.status) });
				}
				if (body.score !== undefined) {
					out.push({ name: "Оценка", value: `${body.score} / 10` });
				}
				if (body.text !== undefined) {
					const c = String(body.text ?? "");
					out.push({ name: "Заметки", value: c ? `${c.slice(0, 60)}${c.length > 60 ? "…" : ""}` : "очищено" });
				}

				if (entry.type === "ANIME") {
					if (body.episodes !== undefined) out.push({ name: "Эпизоды", value: String(body.episodes) });
					if (body.rewatches !== undefined) out.push({ name: "Пересмотры", value: String(body.rewatches) });
				} else {
					if (body.chapters !== undefined) out.push({ name: "Главы", value: String(body.chapters) });
					if (body.rewatches !== undefined) out.push({ name: "Перечитывания", value: String(body.rewatches) });
				}

				if (out.length === 0) out.push({ name: "Действие", value: action });
				return out;
			}

			// Live sync helpers
			async function getMedia(mediaId: number) {
				try {
					const [animeRes, mangaRes] = await Promise.allSettled([ctx.anime.getAnimeEntry(mediaId), ctx.manga.getCollection()]);
					if (animeRes.status === "fulfilled" && animeRes.value)
						return { type: "ANIME" as const, media: animeRes.value.media, listData: animeRes.value.listData };
					if (mangaRes.status === "fulfilled" && mangaRes.value) {
						const entries = mangaRes.value.lists?.flatMap((l) => l.entries ?? []) ?? [];
						const mangaEntry = entries.find((e) => e?.mediaId === mediaId);
						if (mangaEntry) return { type: "MANGA" as const, media: mangaEntry.media, listData: mangaEntry.listData };
					}
					return null;
				} catch {
					return null;
				}
			}

			async function liveSyncRun<TData>({
				event,
				preDataKey,
				actionLabel,
				buildBody,
				requireRepeat = false,
			}: {
				event: { mediaId?: number };
				preDataKey: string;
				actionLabel: "update" | "progress" | "repeat" | "delete";
				buildBody: (data: TData, entry: NonNullable<Awaited<ReturnType<typeof getMedia>>>) => Omit<$shikimorisync.UserRateBase, "user_id">;
				requireRepeat?: boolean;
			}): Promise<
				| { ok: false; reason: string; title?: string; thumbnail?: string }
				| {
						ok: true;
						action: "delete" | "patch";
						entry: NonNullable<Awaited<ReturnType<typeof getMedia>>>;
						title: string;
						type: "ANIME" | "MANGA";
						body: Omit<$shikimorisync.UserRateBase, "user_id">;
				}
			> {
				const { mediaId } = event;
				const skip = (reason: string) => {
					log.error(`${actionLabel} > Skipped livesync | reason="${reason}"`);
					return { ok: false as const, reason };
				};

				if (disableLiveSync.current) return skip("Livesync temporarily disabled");
				if (!mediaId) return skip("Missing mediaId");
				if (isCustom(mediaId)) return skip("Custom source");

				const data = $store.get<TData | null>(preDataKey);
				if (!data) return skip("Missing pre-hook data");
				if ((data as any).mediaId !== mediaId) return skip("Pre-hook data mismatch");
				$store.set(preDataKey, null);
				if (requireRepeat && typeof (data as any).repeat !== "number") return skip("Repeat data invalid");

				const entry = await getMedia(mediaId);
				if (!entry) return skip(`Media not found (${mediaId})`);
				if (!entry.media?.idMal) return skip(`No Shikimori match (${mediaId})`);
				if (skipAdultLiveSync.current && entry.media.isAdult?.valueOf()) return skip(`${entry.media.title?.userPreferred} has mature content rating.`);

				const title = entry.media.title?.userPreferred ?? `anilist-id/${mediaId}`;
				const type = entry.type;
				const targetId = entry.media.idMal;

				const cached = await application.List.getUserRate(type, true, 1_000, true);
				const existing = cached.find((r) => {
					const t = "anime" in r && r.anime ? r.anime.id : r.manga?.id;
					return Number(t) === Number(targetId);
				});

				if (actionLabel === "delete") {
					try {
						if (!existing?.id) return skip(`${title} is not in your Shikimori list`);
						const ok = await application.List.delete(Number(existing.id));
						if (!ok) return skip(`${title} is not in your Shikimori list`);
						log.success(`delete > [DELETE] Removed ${title} from Shikimori`);
						return { ok: true, action: "delete", entry, title, type, body: {} };
					} catch (e) {
						log.error(`delete > [DELETE] ${(e as Error).message}`);
						return { ...skip((e as Error).message), title, thumbnail: entry.media?.coverImage?.large };
					}
				}

				const body = buildBody(data, entry);
				try {
					if (existing?.id) {
						await application.List.patch(Number(existing.id), { user_rate: body });
						log.success(`${actionLabel} > [PATCH] Synced ${title} to Shikimori. ${JSON.stringify(body)}`);
					} else {
						await application.List.post({ user_rate: { ...body, target_id: targetId, target_type: type === "ANIME" ? "Anime" : "Manga" } });
						log.success(`${actionLabel} > [POST] Added ${title} to Shikimori. ${JSON.stringify(body)}`);
					}
					return { ok: true, action: "patch", entry, title, type, body };
				} catch (e) {
					log.error(`${actionLabel} > [PATCH] ${(e as Error).message}`);
					return { ...skip((e as Error).message), title, thumbnail: entry.media?.coverImage?.large };
				}
			}

			$store.watch("POST_UPDATE_ENTRY", async (e) => {
				const result = await liveSyncRun({
					event: e,
					preDataKey: "PRE_UPDATE_ENTRY_DATA",
					actionLabel: "update",
					buildBody: (data: any, entry) => {
						const body: Omit<$shikimorisync.UserRateBase, "user_id"> = {};
						if (typeof data.scoreRaw === "number" && data.scoreRaw > 0) body.score = Math.round(data.scoreRaw / 10);
						body.status = statusToShikimori(data.status);
						if (entry.type === "ANIME") {
							body.episodes = data.progress;
							if (data.status === "REPEATING") body.rewatches = (data.repeat ?? 0) + 1;
						} else {
							body.chapters = data.progress;
							if (data.status === "REPEATING") body.rewatches = (data.repeat ?? 0) + 1;
						}
						return body;
					},
				});

				if (!result.ok) {
					if (result.title)
						notifications.add({
							title: result.title,
							description: `Не удалось обновить в Shikimori: ${result.reason}`,
							thumbnail: result.thumbnail,
							accentColor: "#ef5350",
						});
					return;
				}

				const { entry, title, type } = result;
				const thumbnail = entry.media?.coverImage?.large;
				const body = result.body;
				const typeRu = type === "ANIME" ? "аниме" : "мангу";

				const isPlanningOnly = body.status === "planned" && !body.episodes && !body.chapters && !body.rewatches && !body.score;

				if (isPlanningOnly) {
					notifications.add({
						title,
						thumbnail,
						description: `Добавлено в «Запланировано» в Shikimori.`,
						accentColor: "#505bef",
					});
					return;
				}

				notifications.add({
					title,
					thumbnail,
					description: `Обновлено ${typeRu} в Shikimori.`,
					accentColor: "#505bef",
					fields: buildDeltaFields("update", body, entry),
				});
			});

			$store.watch("POST_UPDATE_ENTRY_PROGRESS", async (e) => {
				const result = await liveSyncRun({
					event: e,
					preDataKey: "PRE_UPDATE_ENTRY_PROGRESS_DATA",
					actionLabel: "progress",
					buildBody: (data: $app.PreUpdateEntryProgressEvent, entry) => {
						const body: Omit<$shikimorisync.UserRateBase, "user_id"> = {
							status: statusToShikimori(data.status),
						};
						if (entry.type === "ANIME") body.episodes = data.progress;
						else body.chapters = data.progress;
						return body;
					},
				});

				if (!result.ok) {
					if (result.title)
						notifications.add({
							title: result.title,
							description: `Не удалось синхронизировать прогресс в Shikimori: ${result.reason}`,
							thumbnail: result.thumbnail,
							accentColor: "#ef5350",
						});
					return;
				}

				const { entry, title, type, body } = result;
				const thumbnail = entry.media?.coverImage?.large;

				const progress = (type === "ANIME" ? body.episodes : body.chapters)!;
				const total = utils.unwrap(
					type === "ANIME"
						? (entry.media as $app.AL_BaseAnime)?.episodes
						: (entry.media as $app.AL_BaseManga)?.chapters,
				);

				const isAnime = type === "ANIME";
				const unit = isAnime ? "эпизод" : "главу";
				const typeRu = isAnime ? "аниме" : "мангу";
				const description =
					total && progress === total
						? `Просмотрено ${typeRu} (${progress}/${total}).`
						: total
							? `Просмотрено ${progress} из ${total} ${isAnime ? "эпизодов" : "глав"}.`
							: `Просмотрено ${progress} ${isAnime ? "эпизодов" : "глав"}.`;

				notifications.add({
					title,
					description,
					thumbnail,
					accentColor: "#505bef",
				});
			});

			$store.watch("POST_UPDATE_ENTRY_REPEAT", async (e) => {
				const result = await liveSyncRun({
					event: e,
					preDataKey: "PRE_UPDATE_ENTRY_REPEAT_DATA",
					actionLabel: "repeat",
					requireRepeat: true,
					buildBody: (data: any) => ({ rewatches: data.repeat }),
				});

				if (!result.ok) {
					if (result.title)
						notifications.add({
							title: result.title,
							description: `Не удалось синхронизировать количество пересмотров в Shikimori: ${result.reason}`,
							thumbnail: result.thumbnail,
							accentColor: "#ef5350",
						});
					return;
				}

				const { entry, title, type, body } = result;

				notifications.add({
					title,
					description: `Установлено количество ${type === "ANIME" ? "пересмотров" : "перечитываний"}: ${body.rewatches}.`,
					thumbnail: entry.media?.coverImage?.large,
					accentColor: "#505bef",
				});
			});

			$store.watch("POST_DELETE_ENTRY", async (e) => {
				const result = await liveSyncRun({ event: e, preDataKey: "PRE_UPDATE_DELETE", actionLabel: "delete", buildBody: () => ({}) });

				if (!result.ok) {
					if (result.title)
						notifications.add({
							title: result.title,
							description: `Не удалось удалить из Shikimori: ${result.reason}`,
							thumbnail: result.thumbnail,
							accentColor: "#ef5350",
						});
					return;
				}

				const typeRu = result.type === "ANIME" ? "аниме" : "манга";
				notifications.add({
					title: result.title,
					description: `Удалено ${typeRu} из Shikimori.`,
					thumbnail: result.entry.media?.coverImage?.large,
					accentColor: "#505bef",
				});
			});

			return {
				busy,
				get aborted() {
					return aborted.get();
				},
				liveSync: { skipAdult: skipAdultLiveSync, disabled: disableLiveSync },
				options: { type, kind, includeAdult, includePrivate, mediaType },
				run: () => run(kind.get() === "import" ? perfImport : perfExport),
				abort: () => aborted.set(true),
			};
		})(); // prettier-ignore

		const tabs = (() => {
			enum Tab {
				Logon = "logon",
				Landing = "landing",
			}
			const current = ctx.state<Tab>(Tab.Logon);
			const authError = ctx.state<string>("");
			const authField = ctx.fieldRef<string>("");

			const logon = () => {
				const authErrorStr = authError.get().trim();
				const error = tray.text(authErrorStr, {
					className: "break-normal bg-red-600/70 text-red-100 text-sm border border-red-500 rounded-md mb-4 px-2 py-1 line-clamp-3",
					style: { display: authErrorStr.length ? "block" : "none" },
				});

				const info = tray.text("Нажмите кнопку ниже, чтобы авторизовать приложение, затем скопируйте токен с сайта и вставьте его в поле ниже.", {
					style: { textAlign: "center", wordBreak: "normal" },
				});

				const authButton = tray.anchor({
					text: "Авторизовать",
					href: application.Auth.generateURL(),
					target: "_blank",
					className:
						"UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border bg-gray-100 border-transparent hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 h-10 px-4 no-underline",
					style: { width: "100%" },
				});

				const authToken = tray.input({
					label: "\u200b",
					placeholder: "Код авторизации",
					fieldRef: authField,
					style: { color: "var(--background)", background: "var(--foreground)", borderRadius: "0.5rem" },
				});

				const login = tray.button({
					label: "Войти",
					intent: "primary",
					size: "md",
					style: { width: "100%" },
					onClick: ctx.eventHandler("shikimori:login", async () => {
						if (!authField.current.trim().length) return authError.set("Ошибка: введите код авторизации");
						authError.set("");
						try {
							await application.Auth.exchangeCode(authField.current);
							authField.setValue("");
							log.success("login > Successfully logged in!");
						} catch (err) {
							authError.set((err as Error).message);
							log.error(`login > ${(err as Error).message}`);
							return;
						}
						let retries = 1,
							ok = false;
						while (!ok && retries <= 3) {
							try {
								await application.User.fetch();
								ok = true;
								log.success("login > Successfully fetched user info!");
								current.set(Tab.Landing);
							} catch (err) {
								log.warn(`login > fetch attempt ${retries} failed: ${(err as Error).message}`);
								retries++;
								await utils.wait(2_000);
							}
						}
					}),
				});

				const logs = log.modal(
					utils.components.button({ icon: "code", tooltip: "Открыть логи", intent: "gray-subtle", className: "rounded-lg", size: "md" }),
					"login-log-modal",
				);

				return tray.div([
					tray.stack(
						[
							tray.flex(
								[
									tray.div([], {
										style: { backgroundImage: `url(${icons.get("shikimori_logo")})` },
										className: "w-10 h-10 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
									}),
									tray.div([], {
										style: { backgroundImage: `url(${icons.get("shikimori_gylph")})` },
										className: "w-40 h-10 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
									}),
								],
								{ className: "justify-center" },
							),
							tray.text("для Seanime", { style: { marginTop: "-0.5rem" }, className: "text-sm text-center text-[--muted]" }),
						],
						{ className: "justify-center mt-3", gap: 0 },
					),
					tray.stack([error, info, authButton, authToken, tray.flex([logs, login], { className: "w-full" })], {
						className: "justify-center items-center p-3",
						style: { height: "28rem" },
					}),
				]);
			};

			const landing = () => {
				const ncount = notifications.unreads.get();
				const network = application.Network.data.get();
				const profile = application.User.data;
				const sync_kind = sync.options.kind.get();

				const notif = notifications.modal(
					tray.div(
						[utils.components.button({ icon: "bell", size: "lg", ...(ncount > 0 && { stroke: "#fdba74" }), tooltip: "Уведомления", transparent: true })],
						{ ...(ncount > 0 && { className: "animate-bounce" }) },
					),
				);

				const pfp = tray.tooltip(
					tray.a({
						href: profile?.url ?? "",
						className:
							"flex justify-center items-center w-10 h-10 bg-transparent hover:bg-gray-200 dark:bg-opacity-10 dark:hover:bg-opacity-20 rounded-full overflow-hidden",
						items: [tray.img({ src: profile?.avatar ?? icons.get("person"), width: "30", className: "rounded-full" })],
					}),
					{ text: "Открыть профиль в браузере" },
				);

				const logout = tray.modal({
					trigger: utils.components.button({ icon: "power", size: "lg", intent: "alert-subtle", tooltip: "Выйти", transparent: true }),
					title: "Выход из Shikimori",
					items: [
						tray.text("Вы действительно хотите выйти?", { className: "break-normal text-pretty" }),
						tray.text("Это действие очистит токены, уведомления, кэш профиля и списка, а также прервёт активную синхронизацию.", {
							className: "text-[--muted] text-sm break-normal text-pretty",
						}),
					],
					footer: [
						tray.button("Выйти", {
							intent: "alert",
							onClick: ctx.eventHandler("shikimori:sign-out", async () => {
								current.set(Tab.Logon);
								log.info("logout > logging out");
								notifications.clear();
								application.Token.resetToken();
								application.User.reset();
								application.List.clearCache();
								sync.abort();
								ctx.toast.success("Logged out of Shikimori");
								log.success("logout > Logged out of Shikimori");
							}),
						}),
					],
				});

				const header = tray.flex([
					tray.stack(
						[
							tray.flex([
								tray.div([], {
									style: { backgroundImage: `url(${icons.get("shikimori_logo")})` },
									className: "w-10 h-10 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
								}),
								tray.div([], {
									style: { backgroundImage: `url(${icons.get("shikimori_gylph")})` },
									className: "w-40 h-10 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
								}),
							]),
							tray.text("для Seanime", { style: { marginTop: "-0.5rem", paddingInlineStart: "2.5rem" }, className: "text-sm text-[--muted]" }),
						],
						{ className: "flex-1", gap: 0 },
					),
					tray.flex([notif, pfp], { gap: 2, className: "items-center" }),
				]);

				const body = tray.stack(
					[
						tray.div(
							[
								tray.text("Добро пожаловать,", { className: "font-semibold" }),
								tray.text(profile?.nickname ?? "Пользователь", { className: "font-bold text-3xl line-clamp-1", style: { maxWidth: "25rem" } }),
							],
							{ className: "relative rounded p-3 mb-3", style: { background: "linear-gradient(45deg, #324143ff, #242829ff)" } },
						),
						tray.flex(
							[
								tray.flex(
									[
										log.modal(
											utils.components.button({ icon: "code", size: "lg", className: "rounded-r-xl", tooltip: "Просмотреть логи", style: { width: "80px" } }),
											"landing-logs-btn",
										),
										tray.modal({
											trigger: tray.div(
												[
													utils.components.button({
														icon: "refresh",
														tooltip: "Выполнить ручную синхронизацию",
														className: "rounded-none",
														style: { width: "80px" },
														size: "lg",
													}),
													!sync.busy.get()
														? []
														: tray.div([], {
																className: "w-3 h-3 rounded-full bg-red-500 absolute border border-white",
																style: { top: "-0.1rem", right: "-0.25rem" },
															}),
												],
												{ className: "relative" },
											),
											title: "Выполнить ручную синхронизацию",
											description: "Вручную синхронизировать трекеры AniList и Shikimori",
											className: "max-w-2xl",
											items: [
												utils.components.select({
													heading: "Направление",
													description: "Выберите, откуда и куда синхронизировать",
													value: sync_kind,
													onChange: (v: any) => sync.options.kind.set(v),
													disabled: sync.busy.get(),
													options: [
														{
															title: "Синхронизировать с Shikimori",
															desc: "Перенести записи из AniList в Shikimori",
															icon: icons.get("shikimori_logo", { fill: "#9f92ff" }),
															value: "import",
														},
														{
															title: "Синхронизировать с AniList",
															desc: "Перенести записи из Shikimori в AniList",
															icon: icons.get("anilist", { fill: "#9f92ff" }),
															value: "export",
														},
													],
												}),
												utils.components.select({
													heading: "Тип медиа",
													description: "Выберите тип контента для синхронизации",
													value: sync.options.mediaType.get(),
													onChange: (v: $app.AL_MediaType) => sync.options.mediaType.set(v),
													disabled: sync.busy.get(),
													options: [
														{ title: "Аниме", desc: "Синхронизировать аниме", icon: icons.get("play", { fill: "#9f92ff" }), value: "ANIME" },
														{ title: "Манга", desc: "Синхронизировать мангу", icon: icons.get("book", { fill: "#9f92ff" }), value: "MANGA" },
													],
												}),
												utils.components.select({
													heading: "Тип синхронизации",
													description: "Выберите способ синхронизации",
													value: sync.options.type.get(),
													gridCols: 1,
													onChange: (v: any) => sync.options.type.set(v),
													disabled: sync.busy.get(),
													options: [
														{
															title: "Добавить отсутствующие записи",
															desc: "Добавляет новые элементы из источника, которых нет в целевом списке.",
															icon: icons.get("plusCircleDotted", { fill: "#9f92ff" }),
															value: "patch",
														},
														{
															title: "Обновить существующие записи",
															desc: "Обновляет записи, присутствующие в обоих трекерах.",
															icon: icons.get("arrow_r", { fill: "#9f92ff" }),
															value: "post",
														},
														{
															title: "Зеркалировать список источника",
															desc: "Делает целевой список идентичным источнику (добавляет, обновляет, удаляет). Рекомендуется заранее сделать резервную копию.",
															icon: icons.get("arrow_lr", { fill: "#9f92ff" }),
															value: "fullsync",
														},
													],
												}),
												tray.button({
													label: sync.busy.get() ? "Отменить ручную синхронизацию" : "Запустить ручную синхронизацию",
													size: "lg",
													intent: sync.busy.get() ? "alert" : "success",
													loading: sync.aborted,
													onClick: ctx.eventHandler("shikimori:manage-list-start-job", () => {
														if (sync.busy.get()) {
															ctx.toast.info("Останавливаем синхронизацию...");
															sync.abort();
														} else {
															ctx.toast.info("Синхронизация запущена");
															sync.run();
														}
													}),
												}),
											],
										}),
										application.List.anime.modal(
											utils.components.button({
												icon: "play",
												tooltip: "Список аниме",
												size: "lg",
												className: "rounded-none",
												style: { width: "80px" },
											}),
										),
										application.List.manga.modal(
											utils.components.button({
												icon: "book",
												tooltip: "Список манги",
												size: "lg",
												className: "rounded-l-xl",
												style: { width: "80px" },
											}),
										),
									],
									{ gap: 0, className: "w-fit" },
								),
								tray.div([], { className: "flex-1" }),
								logout,
							],
							{ style: { gap: "0.5rem" } },
						),
						tray.div([
							tray.switch("Временно отключить livesync", { fieldRef: sync.liveSync.disabled, style: { "--color-brand-500": "255 95 95" } }),
							tray.switch("Пропускать adult-записи для livesync", {
								fieldRef: sync.liveSync.skipAdult,
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("shikimori:skip-adult", (e) => $storage.set("shikimori:options-skipAdult", e.value)),
							}),
							tray.switch("Отключить значок для некритичных уведомлений", {
								value: notifications.suppressBadge.get(),
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("shikimori:suppress-notification-badge", (e) => {
									notifications.suppressBadge.set(e.value);
									$storage.set("shikimori:options-suppressnotificationbadge", e.value);
								}),
							}),
						]),
						tray.div([], { className: "flex-1" }),
						tray.div(
							[
								tray.text(`Соединений: ${network.success + network.failed}`),
								tray.text(`Успешных: ${network.success} (${((network.success * 100) / (network.success + network.failed) || 0).toFixed(2)}%)`),
								tray.p([
									tray.span("Последнее:", { className: "mr-1" }),
									tray.span(network.lastState, { className: `font-bold text-${network.modifier}-300` }),
								]),
							],
							{ className: "text-xs text-[--muted]" },
						),
						tray.flex(
							([{ name: "Политика конфиденциальности", slug: "PRIVACY" }, "separator", { name: "Условия использования", slug: "TERMS" }] as const).map(
								(item) =>
									item === "separator"
										? tray.span("|")
										: tray.anchor(item.name, {
												href: `https://github.com/nnotwen/n-seanime-extensions/blob/master/plugins/ShikimoriSync/${item.slug}.md`,
												className: "no-underline hover:underline",
											}),
							),
							{ className: "justify-center text-xs text-[--muted] mt-2" },
						),
					],
					{ style: { height: "28rem" } },
				);

				return tray.stack([header, body], { className: "m-2" });
			};

			return { current, [Tab.Logon]: logon, [Tab.Landing]: landing, Tab };
		})();

		const tray = ctx.newTray({ iconUrl, withContent: true, width: "30rem" });
		tray.render(() => tabs[tabs.current.get()]());

		ctx.effect(() => {
			if (application.User.data === null) return tray.updateBadge({ number: 1, intent: "alert" });
			if (sync.busy.get()) return tray.updateBadge({ number: 1, intent: "alert" });
			if (notifications.unreads.get() > 0 && !notifications.suppressBadge.get())
				return tray.updateBadge({ number: notifications.unreads.get(), intent: "warning" });
			return tray.updateBadge({ number: 0 });
		}, [application.Auth.busy, sync.busy, notifications.unreads, notifications.suppressBadge]);

		(() => {
			async function init() {
				log.send("init > Initializing extension...");
				try {
					const token = application.Token.getToken();
					if (!token) throw new Error("Missing token. Please authenticate this app by opening the tray.");
					await application.User.fetch();
					log.success("init > Successfully logged in!");
				} catch (error) {
					log.error(`init > ${(error as Error).message}`);
					throw new Error("USER_AUTH_FAILED");
				}
			}

			init()
				.then(() => tabs.current.set(tabs.Tab.Landing))
				.catch(() => tray.updateBadge({ number: 1, intent: "alert" }))
				.finally(() => undefined);
		})();
	});

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

	$app.onPreDeleteEntry((e) => {
		$store.set("PRE_UPDATE_DELETE", $clone(e));
		e.next();
	});

	$app.onPostDeleteEntry((e) => {
		$store.set("POST_DELETE_ENTRY", $clone(e));
		e.next();
	});
}
