/**
 * simklsync
 * Copyright (c) 2026 nnotwen
 * SPDX-License-Identifier: MIT
 */

/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./simklsync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://eu.simkl.in/img_favicon/v2/favicon-192x192.png";

		/**
		 * Icons: inline SVG registry.
		 * Stores each icon as an HTML string; `get()` returns either the raw SVG or a
		 * base64 `data:image/svg+xml` URL, with optional stroke/fill overrides.
		 */
		const icons = (() => {
			const htms = {
				anilist: /*html*/ `<svg fill="#cacaca" width="1rem" height="1rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M6.361 2.943 0 21.056h4.942l1.077-3.133H11.4l1.052 3.133H22.9c.71 0 1.1-.392 1.1-1.101V17.53c0-.71-.39-1.101-1.1-1.101h-6.483V4.045c0-.71-.392-1.102-1.101-1.102h-2.422c-.71 0-1.101.392-1.101 1.102v1.064l-.758-2.166zm2.324 5.948 1.688 5.018H7.144z"/> </svg>`,
				arrow_lr: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/> </svg>`,
				arrow_r: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/> </svg>`,
				back: /*html*/ `<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" height="1em" width="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"> <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88m48-88a8 8 0 0 1-8 8h-60.69l18.35 18.34a8 8 0 0 1-11.32 11.32l-32-32a8 8 0 0 1 0-11.32l32-32a8 8 0 0 1 11.32 11.32L107.31 120H168a8 8 0 0 1 8 8" stroke="none"/> </svg>`,
				bell: /*html*/ `<svg stroke="#cacaca" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path> <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path> <path d="M4 2C2.8 3.7 2 5.7 2 8"></path> <path d="M22 8c0-2.3-.8-4.3-2-6"></path> </svg>`,
				book: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/> </svg>`,
				caret_left_fill: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/> </svg>`,
				caret_right_fill: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" > <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/> </svg>`,
				check2all: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/> <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/> </svg>`,
				close: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/> </svg>`,
				code: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/> </svg>`,
				delete: /*html*/ `<svg stroke="#fca5a5" fill="#fca5a5" stroke-width="0" height="1em" width="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path> <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path> </svg>`,
				eye: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/> <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/> </svg>`,
				eye_slash: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/> <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/> <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/> </svg>`,
				explicit: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M6.826 10.88H10.5V12h-5V4.002h5v1.12H6.826V7.4h3.457v1.073H6.826z"/> <path d="M2.5 0A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0zM1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5z"/> </svg>`,
				format: /*html*/ `<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 0 0-2-2m0 14H3V5h18z"></path></svg>`,
				gears: /*html*/ `<svg stroke="#cacaca" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/> <circle cx="12" cy="12" r="3"/> </svg>`,
				globe: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/> </svg>`,
				simkl_logo: /*html*/ `<svg fill="#cacaca" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3.84 0A3.83 3.83 0 0 0 0 3.84v16.32A3.83 3.83 0 0 0 3.84 24h16.32A3.83 3.83 0 0 0 24 20.16V3.84A3.83 3.83 0 0 0 20.16 0zm8.567 4.11q3.11 0 4.393.186 1.69.252 2.438.877 1.009.867 1.009 3.104 0 .241-.01.768h-4.234q-.021-.537-.074-.746-.147-.615-.966-.692-.725-.065-3.53-.066-2.775 0-3.289.165-.578.2-.578 1.024 0 .792.61.969.514.143 4.633.275 3.73.11 4.76.275 1.04.165 1.654.495t.983.936q.556.892.557 2.873 0 2.212-.546 3.247-.547 1.024-1.785 1.398-1.219.374-6.71.374-3.338 0-4.82-.187-1.806-.22-2.593-.86-.85-.684-1.008-1.93a10.5 10.5 0 0 1-.085-1.434v-.789H7.44q-.01 1.11.43 1.428.232.151.525.203.294.056 1.03.077a166 166 0 0 0 2.405.022q2.793-.01 3.234-.033.83-.065 1.092-.23.368-.242.368-1.077 0-.57-.231-.802-.316-.318-1.503-.34-.82 0-3.425-.132-2.69-.133-3.488-.154-2.08-.066-2.932-.505-1.092-.56-1.429-1.91-.189-.747-.189-1.956 0-2.547.925-3.59.693-.79 2.102-1.044 1.271-.22 6.053-.22z"/> </svg>`,
				person: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/> </svg>`,
				play: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/> </svg>`,
				plusCircleDotted: /*html*/ `<svg fill="#cacaca" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/> </svg>`,
				power: /*html*/ `<svg fill="#f09e9f" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M7.5 1v7h1V1z"/> <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/> </svg>`,
				refresh: /*html*/ `<svg stroke="#cacaca" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/> <path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/> <path d="M16 16h5v5"/> </svg>`,
				search: /*html*/ `<svg fill="#5a5a5a" height="512" width="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"> <path d="M495 466.2 377.2 348.4c29.2-35.6 46.8-81.2 46.8-130.9C424 103.5 331.5 11 217.5 11 103.4 11 11 103.5 11 217.5S103.4 424 217.5 424c49.7 0 95.2-17.5 130.8-46.7L466.1 495c8 8 20.9 8 28.9 0 8-7.9 8-20.9 0-28.8m-277.5-83.3C126.2 382.9 52 308.7 52 217.5S126.2 52 217.5 52C308.7 52 383 126.3 383 217.5s-74.3 165.4-165.5 165.4"/> </svg>`,
				sort: /*html*/ `<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-128-64h-48V48a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v304H16c-14.19 0-21.37 17.24-11.29 27.31l80 96a16 16 0 0 0 22.62 0l80-96C197.35 369.26 190.22 352 176 352zm256-192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>`,
				spinner: /*html*/ `<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"> <path d="M16 8c-0.020-1.045-0.247-2.086-0.665-3.038-0.417-0.953-1.023-1.817-1.766-2.53s-1.624-1.278-2.578-1.651c-0.953-0.374-1.978-0.552-2.991-0.531-1.013 0.020-2.021 0.24-2.943 0.646-0.923 0.405-1.758 0.992-2.449 1.712s-1.237 1.574-1.597 2.497c-0.361 0.923-0.533 1.914-0.512 2.895 0.020 0.981 0.234 1.955 0.627 2.847 0.392 0.892 0.961 1.7 1.658 2.368s1.523 1.195 2.416 1.543c0.892 0.348 1.851 0.514 2.799 0.493 0.949-0.020 1.89-0.227 2.751-0.608 0.862-0.379 1.642-0.929 2.287-1.604s1.154-1.472 1.488-2.335c0.204-0.523 0.342-1.069 0.415-1.622 0.019 0.001 0.039 0.002 0.059 0.002 0.552 0 1-0.448 1-1 0-0.028-0.001-0.056-0.004-0.083h0.004zM14.411 10.655c-0.367 0.831-0.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434c-0.832 0.323-1.723 0.476-2.608 0.454-0.884-0.020-1.759-0.215-2.56-0.57-0.801-0.354-1.526-0.867-2.125-1.495s-1.071-1.371-1.38-2.173c-0.31-0.801-0.457-1.66-0.435-2.512s0.208-1.694 0.551-2.464c0.342-0.77 0.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c0.771-0.298 1.596-0.438 2.416-0.416s1.629 0.202 2.368 0.532c0.74 0.329 1.41 0.805 1.963 1.387s0.988 1.27 1.272 2.011c0.285 0.74 0.418 1.532 0.397 2.32h0.004c-0.002 0.027-0.004 0.055-0.004 0.083 0 0.516 0.39 0.94 0.892 0.994-0.097 0.544-0.258 1.075-0.481 1.578z"></path> </svg>`,
				status: /*html*/ `<svg stroke="#cacaca" fill="#cacaca" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.11629 20.0868L7.1308 18.348C5.2271 16.8856 4 14.5861 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 14.5861 18.7729 16.8856 16.8692 18.348L17.8837 20.0868C20.3786 18.2684 22 15.3236 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.3236 3.62137 18.2684 6.11629 20.0868ZM8.14965 16.6018C6.83562 15.5012 6 13.8482 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 13.8482 17.1644 15.5012 15.8503 16.6018L14.8203 14.8365C15.549 14.112 16 13.1087 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 13.1087 8.45105 14.112 9.17965 14.8365L8.14965 16.6018ZM11 13H13V22H11V13Z"></path></svg>`,
			};
			return {
				get: function (name: keyof typeof htms, options?: { raw?: boolean; stroke?: string; fill?: string }) {
					let htm = htms[name];
					// Apply color modifications if provided
					if (!!options?.stroke) htm = htm.replace(/stroke="[^"]*"/g, `stroke="${options.stroke}"`);
					if (!!options?.fill) htm = htm.replace(/fill="[^"]*"/g, `fill="${options.fill}"`);

					// Return raw HTML if requested
					if (options?.raw === true) return htm;

					// Return as base64 data URL
					return `data:image/svg+xml;base64,${Buffer.from(htm.trim(), "utf-8").toString("base64")}`;
				},
			};
		})();

		/**
		 * Utils: shared UI helpers for the Simkl sync plugin.
		 */
		const utils = (() => {
			const button = (
				o: { icon: Parameters<(typeof icons)["get"]>[0]; tooltip?: string; transparent?: boolean } & Parameters<$ui.Tray["button"]>[1] &
					Exclude<Parameters<typeof icons.get>[1], "raw">,
			) => {
				const { icon, tooltip, transparent, raw, stroke, fill, ...props } = o;
				const intent = props.intent ?? "gray-subtle";
				const className = (
					"w-10 rounded-full bg-no-repeat bg-center p-0 " + 
					(transparent ? "bg-transparent " : "") + 
					(props.className ?? "")).trim(); // prettier-ignore

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
			}; // prettier-ignore

			const nativeSelect = (icon: Parameters<typeof icons.get>[0], selectProps: Parameters<typeof tray.select>[1]) => tray.flex([
				tray.div([], {
					className: `w-10 h-full rounded-l-xl border bg-no-repeat bg-center bg-cover shrink-0 dark:bg-[--paper-lighter] border-r-0 ${selectProps.disabled ? "opacity-50" : ""}`.trim(),
					style: { backgroundImage: `url(${icons.get(icon)})`, backgroundSize: "1rem", marginRight:"-1px" },
				}),
				tray.select({
					...selectProps,
					style: { ...selectProps.style, borderTopLeftRadius: "0", borderBottomLeftRadius: "0", borderLeftColor: "#0000", "--tw-border-opacity": "0.5" },
					label: (selectProps as { label?: string }).label ?? "",
					options: selectProps.options,
				}),
			], { gap: 0 }); // prettier-ignore

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
				const card = (option: (typeof params.entries)[number]) =>
					tray.div([
						tray.div([
							tray.div([], { className: "w-5 h-5 mt-1 bg-repeat-none bg-cover bg-center", style: { backgroundImage: `url(${option.icon})` } }),
							tray.div([
								tray.flex([
									tray.text(option.title, { className: "font-medium break-normal text-pretty" }),
									tray.span(
										option.value ? option.overwrites?.ifTrue ?? "TRUE" : option.overwrites?.ifFalse ?? "FALSE",
										option.value 
											? { className: "text-xs border rounded-lg px-2 text-green-300 border-green-500 bg-green-500/20 h-full" }
											: { className: "text-xs border rounded-lg px-2 text-red-300 border-red-500 bg-red-500/20 h-full" }
									)
								], { className: "items-center" }),
								tray.text(option.desc, {
									className: "text-xs text-gray-600 dark:text-gray-400 break-normal",
								})],
								{ className: "flex-1" },
							),
						],{ className: "flex justify-start gap-3" },),
					],{
						className:
							"p-4 rounded-lg border cursor-pointer transition-all bg-brand-900/10" +
							(option.disabled ? " opacity-50 pointer-events-none" : ""),
						onClick: ctx.eventHandler(option.eventHandlerId ?? generateRandomUUID(), () => {
							option.fieldRef?.setValue(!option.value);
							tray.update();
							option.onChange?.(!option.value);
						}),
					}
				); // prettier-ignore

				const header = tray.div([
					tray.text(params.heading, {
						className: "font-semibold text-[1rem] tracking-wide transition-colors duration-300 px-4 py-1 border w-fit rounded-xl bg-gray-800/40 group-hover/settings-card:bg-brand-500/10 group-hover/settings-card:text-white flex-none",
					}),
					tray.text(params.description, { className: "text-sm text-[--muted] px-4 py-2 lg:py-0 w-fit" }),
				],{
					className: "p-0 pb-2 flex flex-col lg:flex-row items-center gap-0 mx-3 mt-3 space-y-0"
				}); // prettier-ignore

				const opts = tray.div(params.entries.map(card), { className: `grid grid-cols-1 md:grid-cols-${params.gridCols || 2} gap-4 px-3 pb-3` });
				return tray.div([header, opts], {
					className:
						"border bg-[--paper] shadow-sm group/settings-card relative bg-gray-950/80 rounded-xl transition-all duration-200" +
						(params.disabled ? " opacity-50 pointer-events-none" : ""),
				});
			}; // prettier-ignore;

			function unwrap<T>(value: T | null | undefined): T | undefined {
				if (value == null) return undefined;
				if (typeof value === "object") {
					const v = (value as any).valueOf?.();
					return v == null ? undefined : v;
				}
				return value;
			}

			const chunk = <T>(arr: readonly T[], size: number = 50) => {
				if (size <= 0) size = 1;
				const out: T[][] = [];
				for (let i = 0; i < arr.length; i += size) {
					out.push(arr.slice(i, i + size));
				}
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

			function $_wait(ms: number): Promise<void> {
				return new Promise((resolve) => ctx.setTimeout(resolve, ms));
			}

			function generateRandomUUID() {
				return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
					((((Math.random() * 16) | 0) & (c == "x" ? 15 : 3)) | (c == "x" ? 0 : 8)).toString(16),
				);
			}

			const components = { button, select, groupedCheckbox, nativeSelect };

			return { components, unwrap, chunk, pageRange, formatTimestamp, wait: $_wait, generateRandomUUID };
		})();

		/**
		 * Log
		 *
		 * In-memory logger backed by `$store`. Appends `[timestampedMessage, level]`
		 * records; readable via `entries()` only while the modal is open.
		 */
		const log = (() => {
			const id = "simkl:69481fa7-d16d-40f2-ae3a-aba6e3f212ad";
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

			const modal = (trigger: any, id: string = utils.generateRandomUUID()) =>
				tray.modal({
					trigger,
					title: "SIMKL Logs",
					className: "max-w-5xl",
					// logs can inflate easily, so we remove the logs render from the update tree when modal is closed
					onOpenChange: ctx.eventHandler(id, ({ open }) => modalOpened.set(open)),
					items: [
						tray.flex([
							tray.button("Copy to Clipboard", {
								intent: "white",
								size: "md",
								className: "w-fit",
								onClick: ctx.eventHandler("modal:logs:clipboard:copy", () => {
									ctx.dom.clipboard.write(
										log
											.entries()
											?.map(([message]) => message.replace(/{{USERNAME}}/gi, application.user.isNameHidden ? "*****" : (application.user.data?.user.name ?? "")))
											.join("\n") ?? "",
									);
									ctx.toast.success("Copied logs to clipboard!");
								}),
							}),
							tray.button("Clear logs", {
								intent: "alert-subtle",
								size: "md",
								className: "w-fit",
								onClick: ctx.eventHandler("modal:logs:clipboard:clear", () => {
									log.clear();
									tray.update();
									ctx.toast.success("Cleared logs!");
								}),
							}),
						]),
						!modalOpened.get()
							? tray.flex([tray.img({ src: icons.get("spinner"), width: "50", className: "animate-spin" })], {
									className: "w-full justify-center items-center",
									style: { height: "5rem" },
								})
							: tray.div(
									[
										tray.div(
											log.entries().map(([message, type], idx) => {
												const className: Record<"Info" | "Warning" | "Error" | "Log" | "Success", string> = {
													Info: "text-blue-200 bg-gray-",
													Warning: "text-orange-500 bg-gray-",
													Error: "text-white bg-red-",
													Log: "text-[--muted] bg-gray-",
													Success: "text-green-200 bg-gray-",
												};
												return tray.text(message.replace(/{{USERNAME}}/gi, application.user.isNameHidden ? "*****" : (application.user.data?.user.name ?? "")), {
													style: {
														fontFamily: "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
														fontSize: "16px",
													},
													className: className[type] + (idx % 2 === 0 ? "800" : "900"),
												});
											}),
											{ className: "text-md max-h-[40rem] p-2 min-h-12 whitespace-pre-wrap break-all" },
										),
									],
									{ className: "bg-gray-900 rounded-[--radius-md] border max-w-full overflow-x-auto" },
								),
					],
				});

			return { modalOpened, entries, record, error, warn, info, success, send, clear, modal };
		})();

		/**
		 * PKCE (RFC 7636) helper.
		 *
		 * Generates a code verifier and its S256 code challenge for the OAuth PKCE flow.
		 *
		 * - Verifier: 86 chars drawn from the unreserved set `[A-Za-z0-9-._~]` (RFC 7636 §4.1).
		 * - Challenge: base64url-encoded SHA-256 hash of the verifier (RFC 7636 §4.2, S256).
		 */
		const PKCE = (() => {
			const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

			const base64UrlEncode = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
			const generateCodeVerifier = () => Array.from({ length: 86 }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join("");
			const sha256 = (m:string) => {const d=new Uint8Array(m.length);for(let i=0;i<m.length;i++)d[i]=m.charCodeAt(i);const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];const R=(x:number,n:number)=>(x>>>n)|(x<<(32-n));const bl=d.length*8;const w=new Uint8Array(((d.length+9+63)>>6)<<6);w.set(d);w[d.length]=0x80;const v=new DataView(w.buffer);v.setUint32(w.length-8,Math.floor(bl/0x100000000),false);v.setUint32(w.length-4,bl>>>0,false);let a=0x6a09e667,b=0xbb67ae85,c=0x3c6ef372,e=0xa54ff53a,f=0x510e527f,g=0x9b05688c,h=0x1f83d9ab,j=0x5be0cd19;const W=new Uint32Array(64);for(let i=0;i<w.length;i+=64){for(let t=0;t<16;t++)W[t]=v.getUint32(i+t*4,false);for(let t=16;t<64;t++){const s0=R(W[t-15],7)^R(W[t-15],18)^(W[t-15]>>>3);const s1=R(W[t-2],17)^R(W[t-2],19)^(W[t-2]>>>10);W[t]=(W[t-16]+s0+W[t-7]+s1)>>>0}let A=a,B=b,C=c,D=e,E=f,F=g,G=h,H=j;for(let t=0;t<64;t++){const S1=R(E,6)^R(E,11)^R(E,25);const ch=(E&F)^(~E&G);const t1=(H+S1+ch+K[t]+W[t])>>>0;const S0=R(A,2)^R(A,13)^R(A,22);const maj=(A&B)^(A&C)^(B&C);const t2=(S0+maj)>>>0;H=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0}a=(a+A)>>>0;b=(b+B)>>>0;c=(c+C)>>>0;e=(e+D)>>>0;f=(f+E)>>>0;g=(g+F)>>>0;h=(h+G)>>>0;j=(j+H)>>>0}const o=new Uint8Array(32);const Hh=[a,b,c,e,f,g,h,j];for(let i=0;i<8;i++){o[i*4]=Hh[i]>>>24;o[i*4+1]=(Hh[i]>>>16)&0xff;o[i*4+2]=(Hh[i]>>>8)&0xff;o[i*4+3]=Hh[i]&0xff}return o} // prettier-ignore

			const generatePair = () => {
				const verifier = generateCodeVerifier();
				return { verifier, challenge: base64UrlEncode(sha256(verifier)) };
			};

			return { generatePair };
		})();

		/**
		 * Application: Simkl sync plugin core.
		 *
		 * Handles the OAuth PKCE flow, token persistence/refresh, and all authenticated
		 * Simkl API calls via internal `_fetch`.
		 */
		const application = (() => {
			const name = "seanime-simkl-sync";
			const version = "3.0.0";
			const clientId = "1da170635dc23d5b4be8d45cde78c48085c825e7d68f5923f64377e9fb9e5ab7";
			const redirectUri = "https://nnotwen.github.io/n-seanime-extensions/plugins/SimklSync/callback.html";
			const baseUri = "https://api.simkl.com/";

			// NETWORK CONNECTION MANAGEMENT
			const Network = (() => {
				const data = ctx.state<{ success: number; failed: number; lastState: string; modifier: "green" | "red" }>({
					success: 0,
					failed: 0,
					lastState: "",
					modifier: "green",
				});
				return {
					ok: (statusText: string) => data.set({ ...data.get(), success: data.get().success + 1, lastState: statusText, modifier: "green" }),
					err: (statusText: string) => data.set({ ...data.get(), failed: data.get().failed + 1, lastState: statusText, modifier: "red" }),
					data,
				};
			})();

			// AUTH MANAGEMENT
			const Auth = (() => {
				const PAIR_KEY = "store@PKCE-verifier-challenge";
				const STATE_KEY = "store@PKCE-state";
				const busy = ctx.state<boolean>(false);
				let urlLastRequestedTimestamp = 0;

				const generateURL = () => {
					if (urlLastRequestedTimestamp === 0 || Date.now() - urlLastRequestedTimestamp > 1000 * 60 * 10) {
						$store.set(PAIR_KEY, PKCE.generatePair());
						$store.set(STATE_KEY, utils.generateRandomUUID());
						urlLastRequestedTimestamp = Date.now();
					}

					const pair = $store.get<ReturnType<typeof PKCE.generatePair>>(PAIR_KEY);
					if (!pair) throw new Error("PKCE pair missing!");

					const fields: Record<string, string> = {
						client_id: clientId,
						redirect_uri: redirectUri,
						response_type: "code",
						code_challenge: pair.challenge,
						code_challenge_method: "S256",
						scope: "media:read media:write",
						state: $store.get<string>(STATE_KEY),
						"app-name": name,
						"app-version": version,
					};

					const url = new URL("https://simkl.com/oauth2/authorize");
					for (const [field, value] of Object.entries(fields)) url.searchParams.set(field, value);

					return url.toString();
				};

				const exchangeCode = async (code: string) => {
					const pair = $store.get<ReturnType<typeof PKCE.generatePair>>(PAIR_KEY);
					if (!pair) throw new Error("PKCE pair missing!");

					busy.set(true);
					const res = await ctx
						.fetch("https://api.simkl.com/oauth2/token", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								grant_type: "authorization_code",
								client_id: clientId,
								code,
								code_verifier: pair.verifier,
								redirect_uri: redirectUri,
							}),
						})
						.finally(() => busy.set(false));

					const { expires_in, ...data } = handle<$simkl.AccessTokenExchangeCodeResponse>(res);
					const expires_at = expires_in * 1000 + Date.now();
					$store.set("store@token", { ...data, expires_in, expires_at });
					$storage.set("storage@token", { ...data, expires_in, expires_at });
					return { ...data, expires_in, expires_at };
				};

				const revoke = async (type: "access_token" | "refresh_token") => {
					const token = $store.get<Awaited<ReturnType<typeof exchangeCode>> | null>("store@token");
					if (!token) throw new Error("Unable to revoke token. No token found.");

					busy.set(true);
					const url = new URL("https://api.simkl.com/oauth2/revoke");
					url.searchParams.set("client_id", clientId);
					url.searchParams.set("app-name", name);
					url.searchParams.set("app-version", version);

					const res = await ctx
						.fetch(url.toString(), {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ token: token[type] }),
						})
						.finally(() => busy.set(false));

					return handle(res);
				};

				return { generateURL, exchangeCode, revoke, busy };
			})();

			// TOKEN MANAGEMENT
			const Token = (() => {
				$store.set("store@token", $storage.get("storage@token") ?? null);

				const refreshToken = async () => {
					const token = $store.get<Awaited<ReturnType<typeof Auth.exchangeCode>> | null>("store@token");
					if (!token || !token.refresh_token.length) throw new Error("Missing refresh_token. Please login again!");

					const res = await ctx.fetch("https://api.simkl.com/oauth2/token", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							grant_type: "refresh_token",
							client_id: clientId,
							refresh_token: token.refresh_token,
						}),
					});

					const { expires_in, ...data } = handle<$simkl.AccessTokenExchangeCodeResponse>(res);
					const expires_at = expires_in * 1000 + Date.now();
					$store.set("store@token", { ...data, expires_in, expires_at });
					$storage.set("storage@token", { ...data, expires_in, expires_at });
					return { ...data, expires_in, expires_at };
				};

				const getToken = async () => {
					let token = $store.get<Awaited<ReturnType<typeof Auth.exchangeCode>> | null>("store@token");
					if (!token) return token;

					if (token.expires_at < Date.now()) token = await refreshToken();
					return token.access_token;
				};

				const resetToken = () => $storage.set("storage@token", null);

				return { getToken, refreshToken, resetToken, get cached_token (){ return $store.get<Awaited<ReturnType<typeof Auth.exchangeCode>> | null>("store@token") } }; //prettier-ignore
			})();

			const handle = <T>(res: $ui.FetchResponse): T => {
				if (!res.ok) {
					Network.err(res.statusText);
					throw new Error(res.json()?.error_description ?? res.json()?.error ?? res.statusText);
				}
				Network.ok(res.statusText);
				return res.json<T>();
			};

			// Middleware API fetch
			const _fetch = async <T>(endpoint: string, init: RequestInit = {}) => {
				const url = new URL(baseUri + endpoint.replace(/^\/+/, ""));
				url.searchParams.set("client_id", clientId);
				url.searchParams.set("app-name", name);
				url.searchParams.set("app-version", version);

				const token = await Token.getToken();

				if (!token) throw new Error("Token not found!");
				const res = await ctx.fetch(url.toString(), {
					...init,
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
						"simkl-api-key": clientId,
						"User-Agent": `${name}/${version}`,
						...(init.headers as Record<string, string>),
					},
				} as FetchOptions);

				return handle<T>(res);
			};

			// USER MANAGEMENT
			const User = (() => {
				const hidename = ctx.state<boolean>(false);
				const data = ctx.state<$simkl.SimklUserInfo | null>(null);
				return {
					get data() {
						const $data = data.get();
						return hidename.get() ? { ...($data ?? {}), user: { ...$data?.user, name: "*****" } } : $data;
					},
					toggleHideName() {
						return hidename.set(!hidename.get());
					},
					get isNameHidden() {
						return hidename.get();
					},
					reset: () => data.set(null),
					fetch: async () => {
						try {
							const res = await _fetch<$simkl.SimklUserInfo>("/users/settings");
							data.set(res);
							return res;
						} catch (error) {
							throw new Error((error as Error).message);
						}
					},
				};
			})();

			// LIST MANAGEMENT
			const List = (() => {
				const id = "ead67d68-2313-4fd7-9059-03073be5f5d8";
				const fetching = ctx.state<boolean>(false);
				const currentPageIndex = ctx.state<number>(0);
				const searchQuery = ctx.state<string>("");
				const isModalOpen = ctx.state<boolean>(false);

				const sortOpts = [
					{ label: "Default", value: "default" },
					{ label: "Title (A–Z)", value: "title_asc" },
					{ label: "Title (Z–A)", value: "title_desc" },
					{ label: "Year (Newest)", value: "year_desc" },
					{ label: "Year (Oldest)", value: "year_asc" },
					{ label: "Recently Watched", value: "last_watched_desc" },
					{ label: "Added to List", value: "added_desc" },
					{ label: "Progress", value: "progress_desc" },
					{ label: "Rating", value: "rating_desc" },
				] as const;
				const selectedSort = ctx.state<(typeof sortOpts)[number]["value"]>("default");

				const listStatusOpts: { label: string; value: $simkl.SimklStatus | "default" }[] = [
					{ label: "All status", value: "default" },
					{ label: "Planning", value: "plantowatch" },
					{ label: "Watching", value: "watching" },
					{ label: "Completed", value: "completed" },
					{ label: "Dropped", value: "dropped" },
					{ label: "Paused", value: "hold" },
				];
				const selectedListStatus = ctx.state<(typeof listStatusOpts)[number]["value"]>("default");

				const formatOpts: { label: string; value: NonNullable<$simkl.MediaListCollection["anime"][number]["anime_type"]> | "default" }[] = [
					{ label: "All formats", value: "default" },
					{ label: "TV", value: "tv" },
					{ label: "Movie", value: "movie" },
					{ label: "ONA", value: "ona" },
					{ label: "OVA", value: "ova" },
					{ label: "Special", value: "special" },
					{ label: "Music", value: "music video" },
				];
				const selectedFormat = ctx.state<(typeof formatOpts)[number]["value"]>("default");

				const getMediaListCollection = async () => {
					fetching.set(true);
					try {
						const cached = $storage.get<$simkl.MediaListCollection>(id) ?? { last_sync: null, anime: [] };
						const act = await _fetch<$simkl.Activities>("/sync/activities");
						if (cached.last_sync && act.anime.all === cached.last_sync.anime.all) return cached;

						const cursor = cached.last_sync;
						log.send(cursor
							? "application.list > Stale cache detected, fetching updates..."
							: "application.list > No simkl records found! First time fetching sync/all-items/anime/all"
						); //prettier-ignore

						let base = cached.anime;
						if (cursor !== null && act.anime.removed_from_list !== cached.last_sync?.anime.removed_from_list) {
							log.send("application.list > Removals detected, reconciling deleted entries...");

							const before = base.length;
							const idsRes = await _fetch<{ anime?: { show: { ids: { simkl: number } } }[] }>("/sync/all-items/anime/all?extended=simkl_ids_only");
							const liveIds = new Set((idsRes.anime ?? []).map((e) => e.show.ids.simkl));
							base = cached.anime.filter((e) => liveIds.has(e.show.ids.simkl));
							log.info(`application.list > Removed ${before - base.length} deleted entries.`);
						}

						const res = await _fetch<{ anime?: $simkl.MediaListCollection["anime"] }>(cursor
							? `/sync/all-items/anime/all?date_from=${encodeURIComponent(cursor.anime.all)}&memos=yes`
							: `/sync/all-items/anime/all&memos=yes`
						); //prettier-ignore

						const delta = res.anime ?? [];
						log.success(`application.list > Fetched [${delta.length}] ${cursor ? "delta" : "anime"} records!`);

						const map = new Map(base.map((e) => [e.show.ids.simkl, e]));
						for (const d of delta) map.set(d.show.ids.simkl, d);

						const next: $simkl.MediaListCollection = {
							last_sync: {
								anime: { all: act.anime.all, removed_from_list: act.anime.removed_from_list },
							},
							anime: [...map.values()],
						};
						$storage.set(id, next);
						return next;
					} catch (error) {
						log.error(`application.list > ${(error as Error).message}`);
						throw new Error((error as Error).message, { cause: error });
					} finally {
						fetching.set(false);
					}
				};

				const clearMediaListCollection = () => $storage.set(id, { last_sync: null, anime: [] });

				const addToWatchList = (body: $simkl.WatchlistPostBody) =>
					_fetch<$simkl.UpdateResponse>("/sync/add-to-list", {
						method: "POST",
						body: JSON.stringify(body),
					});

				const addToHistory = (body: $simkl.UpdatePayload) =>
					_fetch<$simkl.HistoryUpdateResponse>("/sync/history", {
						method: "POST",
						body: JSON.stringify(body),
					});

				const removeFromList = (body: Omit<$simkl.UpdatePayload, "anime">) =>
					_fetch<$simkl.DeleteResponse>("/sync/history/remove", {
						method: "POST",
						body: JSON.stringify(body),
					});

				const removeRatings = (body: $simkl.UpdatePayload) =>
					_fetch<$simkl.DeleteResponse>("/sync/ratings/remove", {
						method: "POST",
						body: JSON.stringify(body),
					});

				const list_modal_format_entry = (entry: Partial<$simkl.MediaListCollection["anime"][number]> | undefined, idx: number, arr: $simkl.MediaListCollection["anime"]) => tray.div([
					tray.img({ src: entry?.show?.poster ? `https://simkl.in/posters/${entry.show.poster}_m.webp` : "" , width: "100", className: "shrink-0 object-cover group-hover:opacity-50" }),
					tray.div([
						tray.flex([
							tray.text(entry?.show?.title ?? "", { className: "font-semibold w-full line-clamp-2 break-normal text-pretty" }),
							// tray.img({ src: icons.get("eye"), width: "20" }),
						]),
						tray.div([
							tray.div([
								tray.text("Release Year", { className: "text-xs text-[--muted] font-semibold"}),
								tray.text(entry?.show?.year?.toString() ?? ""),
							]),
							tray.div([
								tray.text("Type", { className: "text-xs text-[--muted] font-semibold"}),
								tray.text(entry?.anime_type?.toUpperCase() ?? "--"),
							]),
							tray.div([
								tray.text("Episode", { className: "text-xs text-[--muted] font-semibold"}),
								tray.text(`${entry?.watched_episodes_count} / ${entry?.total_episodes_count}`),
							]),
							tray.div([
								tray.text("Status", { className: "text-xs text-[--muted] font-semibold"}),
								tray.text(entry?.status?.toUpperCase() ?? ""),
							]),
							tray.div([
								tray.text("Score", { className: "text-xs text-[--muted] font-semibold"}),
								tray.text(entry?.user_rating?.toString() ?? "--"),
							]),
							tray.div([
								tray.text("Added", { className: "text-xs text-[--muted] font-semibold"}),
								tray.text(entry?.added_to_watchlist_at ? new Date(entry.added_to_watchlist_at).toLocaleDateString() : ""),
							]),
						], { className: "grid grid-cols-3 gap-2 text-xs" })
					], { className: "space-y-3 p-2 w-full" })
				], { 
					className: `group flex border rounded-2xl overflow-hidden transition duration-200 ${entry?.show?.ids.anilist ? "hover:bg-gray-800 cursor-pointer" : ""}`.trim(), 
					style: { gap: "0rem", flexDirection: "row" },
					...(entry?.show?.ids.anilist && { onClick: ctx.eventHandler(`list-open-page-${entry.show.ids.anilist}`, () => {
						ctx.screen.navigateTo("/entry", { id: entry.show?.ids.anilist! });
						tray.close();
					})})
				}); // prettier-ignore

				const modal = (trigger: any, eventId?: string) => {
					const { last_sync, anime } = $storage.get<$simkl.MediaListCollection>(id) ?? { last_sync: null, anime: [] };
					const pre = anime
						.sort((a, b) => {
							switch(selectedSort.get()){
								case "title_asc": return a.show.title.localeCompare(b.show.title);
								case "title_desc": return b.show.title.localeCompare(a.show.title);
								case "year_asc": return a.show.year - b.show.year;
								case "year_desc": return b.show.year - a.show.year;
								case "last_watched_desc":  return (b.last_watched_at ?? "").localeCompare(a.last_watched_at ?? "");
								case "added_desc": return (b.added_to_watchlist_at ?? "").localeCompare(a.added_to_watchlist_at ?? "");
								case "progress_desc": return b.watched_episodes_count - a.watched_episodes_count;
								case "rating_desc": return (b.user_rating ?? 0) - (a.user_rating ?? 0);
								default: return 0;
							}
						})
						.filter((a) => {
							// search
							if (!a.show.title.toLowerCase().includes(searchQuery.get().toLowerCase())) return false;
							// list status
							const listStatus = selectedListStatus.get();
							if (listStatus !== "default" && listStatus !== a.status) return false;
							// format
							const listFormat = selectedFormat.get();
							if (listFormat !== "default" && listFormat !== a.anime_type) return false;
							return true;
						}); // prettier-ignore

					const paginated = utils.chunk(pre.map(list_modal_format_entry), 20);
					const curIdx = Math.max(0, Math.min(currentPageIndex.get(), paginated.length - 1));

					const styles = tray.css(/*css*/ `
						.group .group-hover\\:visible {
							visibility: hidden;
							opacity: 0;
							transition: visibility 0.2s, opacity 0.2s;
						}
						.group:hover .group-hover\\:visible {
							visibility: visible;
							opacity: 1;
						}
						.group .group-hover\\:opacity-50 {
							opacity: 0.5;
							transition: opacity 0.2s;
						}
						.group:hover .group-hover\\:opacity-50 {
							opacity: 1;
						}
						.hover\\:bg-gray-800\\:hover {
							background-color: var(--gray-800);
						}
					`);

					const step = (delta: number) => currentPageIndex.set(Math.min(Math.max(curIdx + delta, 0), Math.max(paginated.length, 1) - 1));
					const pages = tray.flex([
						utils.components.button({
							icon: "caret_left_fill",
							tooltip: "Prev",
							size: "sm",
							transparent: true,
							disabled: curIdx === 0,
							onClick: ctx.eventHandler("list:page:left", () => step(-1)),
						}),
						utils.pageRange(curIdx, paginated.length, 5).map((e) => {
							if (e === "...") return tray.span("...");
							return tray.button(`${e + 1}`, {
								intent: e === curIdx ? "primary" : "gray-subtle",
								disabled: e === curIdx,
								size: "sm",
								className: `rounded-full ${e !== curIdx ? "bg-transparent" : ""}`.trim(),
								onClick: ctx.eventHandler(`list:page:${e}`, () => {
									if (e !== curIdx) currentPageIndex.set(e);
								}),
							});
						}),
						utils.components.button({
							icon: "caret_right_fill",
							tooltip: "Next",
							size: "sm",
							transparent: true,
							disabled: curIdx >= paginated.length - 1,
							onClick: ctx.eventHandler("notify:page:right", () => step(+1)),
						}),
					],
					{ className: "w-fit p-2 rounded-full border" }); // prettier-ignore

					const advanced_search = tray.flex([
						tray.div([
							tray.div([tray.input({
								placeholder: "Search",
								value: searchQuery.get(),
								disabled: fetching.get() || !isModalOpen.get(),
								onChange: ctx.eventHandler("list-search", ({ value }: { value: string }) => searchQuery.set(value)),
								style: {
									paddingInlineStart: "2rem",
									backgroundImage: `url(${icons.get("search")})`,
									backgroundPosition: "0.5rem center",
									backgroundSize: "1rem",
									backgroundRepeat: "no-repeat",
								},
							})], { style: { width: "25rem" }}),
							tray.div([
								utils.components.nativeSelect("sort", {
									value: selectedSort.get(),
									disabled: fetching.get() || !isModalOpen.get(),
									onChange: ctx.eventHandler("list-sort-opt", ({ value }) => selectedSort.set(value)),
									options: [...sortOpts],
								}),
								utils.components.nativeSelect("status", {
									value: selectedListStatus.get(),
									disabled: fetching.get() || !isModalOpen.get(),
									onChange: ctx.eventHandler("list-status-opt", ({ value }) => selectedListStatus.set(value)),
									options: listStatusOpts,
								}),
								utils.components.nativeSelect("format", {
									value: selectedFormat.get(),
									disabled: fetching.get() || !isModalOpen.get(),
									onChange: ctx.eventHandler("list-format-opt", ({ value }) => selectedFormat.set(value)),
									options: formatOpts,
								}),
							], { className: "grid grid-cols-4 gap-2" })
						], { className: "w-full space-y-2" }),
						utils.components.button({
							icon:"refresh",
							stroke: "#000",
							tooltip: "Refresh List",
							className: "rounded-xl",
							intent: "white",
							size: "lg",
							loading: fetching.get() || !isModalOpen.get(),
							onClick: ctx.eventHandler("refresh-list", () => getMediaListCollection()
								.then(() => ctx.jobs.debounce("refresh-list-deb", () => ctx.toast.success("Successfully fetched SIMK Anime MediaList!"), 500))
								.catch((err:Error) => ctx.toast.error(err.message))),
						}),
					], { className: "border px-2 py-3 rounded-2xl bg-gray-900 w-full" }); //prettier-ignore

					return tray.modal({
						trigger,
						title: "SIMKLSync MediaList (Anime Only)",
						description: `Last Sync: ${last_sync?.anime.all ? utils.formatTimestamp(new Date(last_sync.anime.all).getTime()) : "Unknown"}`,
						className: "max-w-5xl",
						items: [
							tray.div([
									styles,
									advanced_search,
									(fetching.get() || !isModalOpen.get())
										? [
											tray.flex([
												tray.img({ src: icons.get("spinner"), width: "50", className: "animate-spin" })
											], { className: "w-full justify-center items-center", style: { height: "25rem" }})
										] : [
											tray.div(paginated[curIdx] ?? [], { className: "grid grid-cols-2 gap-3" }),
											tray.text("Your list is empty", {
												className: "text-center p-5 text-xl font-semibold text-[--muted] border rounded-lg",
												style: { display: paginated[curIdx]?.length ? "none" : "block" },
											})
										],
								],
								{ className: "space-y-2" },
							), // prettier-ignore
						],
						footer: fetching.get() || !isModalOpen.get() ? [] : [tray.flex([pages], { className: "justify-center w-full" })],
						onOpenChange: ctx.eventHandler("simkl-list-modal", ({ open }: { open: boolean }) => {
							isModalOpen.set(open);
							if (!open) {
								currentPageIndex.set(0);
								searchQuery.set("");
								selectedSort.set("default");
								selectedListStatus.set("default");
								selectedFormat.set("default");
							}
						}),
					}); // prettier-ignore;
				};

				return { getMediaListCollection, clearMediaListCollection, addToWatchList, addToHistory, removeFromList, removeRatings, modal };
			})();

			// PLAYBACK MANAGEMENT
			const Playback = {
				state: ctx.state<$simkl.ApplicationPlaybackState | null>(null),
				playing: ctx.state<boolean>(false),
				async scrobble(action: "start" | "pause" | "stop", body: $simkl.ScrobbleRequestBody) {
					return await _fetch<$simkl.ScrobleResponseShape>(`/scrobble/${action}`, {
						method: "POST",
						body: JSON.stringify(body),
					});
				},
			};

			return {
				network: Network as Omit<typeof Network, "ok" | "err">,
				token: Token,
				auth: Auth,
				user: User,
				list: List,
				playback: Playback,
			};
		})();

		/**
		 * Notifications: Simkl sync plugin notification store & UI.
		 *
		 * Persists notification records to `$storage` and renders a paginated modal
		 * with per-entry actions (mark read, delete) and bulk actions (mark all read,
		 * delete all).
		 */
		const notifications = (() => {
			const id = "01389c5c-6fc2-41a7-b4ba-2cf4bdfd415b";
			const modalOpened = ctx.state<boolean>(false);
			const thumbdefault = "";
			const currentPageIndex = ctx.state<number>(0);
			const suppressBadge = ctx.state<boolean>($storage.get<boolean | undefined>("simklsync:options-suppressnotificationbadge") ?? false); //prettier-ignore

			const add = (data: Omit<$simkl.NotificationV2, "timestamp" | "unread">) => {
				const e = entries();
				$storage.set(id, [...e, { ...data, timestamp: Date.now(), unread: true }]);
				unreads.set(entries().filter((x) => x.unread).length);
			};

			const entries = () => $storage.get<$simkl.NotificationV2[]>(id) ?? [];

			const clear = () => {
				unreads.set(0);
				$storage.set(id, []);
			};

			const formatEntry = (n: $simkl.NotificationV2, idx: number, arr: $simkl.NotificationV2[]) => {
				const unreadBorder = [
					tray.div([], { className: "w-3 h-3 rounded-full bg-red-500 absolute border border-white", style: { right: "-0.25rem", top: "-0.1rem" } }),
					tray.div([], { className: "absolute z-[0] left-0 top-0 h-full w-full bg-gradient-to-r to-gray-900 max-w-[50%] from-yellow-900/10" }),
				];

				const thumbnail = tray.div([tray.img({ src: n.thumbnail ?? thumbdefault, width: "70", className: "rounded-lg" })], {
					className: "relative shrink-0",
				});

				const title = tray.text(n.title, { className: "w-full font-bold mb-2 break-normal line-clamp-2" });
				const desc = n.description ? tray.text(n.description, { className: "w-full break-normal text-sm text-[--muted]" }) : [];
				const timestamp = tray.text(utils.formatTimestamp(n.timestamp), { className: "w-full break-normal text-xs text-[--muted] mt-2" });
				const fields = tray.div(
					[
						(n.fields ?? []).map((f) =>
							tray.div([tray.text(f.name, { className: "text-xs text-[--muted]" }), tray.text(f.value, { className: "font-semibold" })], {}),
						),
					],
					{ className: "grid grid-cols-3 gap-x-2 text-sm" },
				);

				const content = tray.div([title, desc, fields, timestamp], { className: "relative flex-1" });

				const markRead = utils.components.button({
					icon: "check2all",
					tooltip: "Mark as Read",
					intent: "success-subtle",
					transparent: true,
					style: { width: `${10 * 0.25}rem`, height: `${10 * 0.25}rem` },
					onClick: ctx.eventHandler(`notification-entry-${idx}`, () => {
						arr[idx].unread = false;
						$storage.set(id, arr.reverse());
						notifications.unreads.set(entries().filter((e) => e.unread).length);
					}),
				});

				const deleteEntry = utils.components.button({
					icon: "delete",
					tooltip: "Delete",
					intent: "alert-subtle",
					transparent: true,
					style: { width: `${10 * 0.25}rem`, height: `${10 * 0.25}rem` },
					onClick: ctx.eventHandler(utils.generateRandomUUID(), () => {
						$storage.set(id, arr.toSpliced(idx, 1).reverse());
						notifications.unreads.set(entries().filter((e) => e.unread).length);
					}),
				});

				const actionbtns = tray.stack([n.unread ? markRead : [], deleteEntry], { className: "group-hover:visible" });

				return tray.div([
					n.unread ? unreadBorder : [],
					tray.flex([thumbnail, content, actionbtns], { gap: 3 }), //
				], {
					 className: `relative group p-2 rounded-lg cursor-pointer border bg-gray-900${n.unread ? " border-yellow-400/10" : "/70"}`,
					 style: { borderLeftWidth: "0.5rem", ...(n.accentColor && { borderLeftColor: n.accentColor })}
				}); // prettier-ignore
			};

			const modal = (trigger: any, eventId?: string) => {
				const paginated = utils.chunk(entries().reverse().map(formatEntry), 10);
				const curIdx = Math.max(0, Math.min(currentPageIndex.get(), paginated.length - 1));

				const btnAllRead = tray.button("Mark all as Read", {
					intent: "gray-subtle",
					size: "md",
					className: "w-fit bg-transparent border",
					style: { borderColor: "var(--border)" },
					disabled: notifications.unreads.get() <= 0,
					onClick: ctx.eventHandler(eventId ?? utils.generateRandomUUID(), () => {
						$storage.set(id, entries().map((e) => ({ ...e, unread: false }))); // prettier-ignore
						notifications.unreads.set(0);
					}),
				});

				const btnAllDelete = tray.button("Delete all", {
					intent: "alert-subtle",
					size: "md",
					className: "w-fit",
					disabled: !($storage.get<$simkl.NotificationV2[]>(id) ?? []).length,
					onClick: ctx.eventHandler(utils.generateRandomUUID(), () => {
						$storage.set(id, []);
						notifications.unreads.set(0);
					}),
				});

				const styles = tray.css(/*css*/ `
					.group .group-hover\\:visible {
						visibility: hidden;
						opacity: 0;
						transition: visibility 0.2s, opacity 0.2s;
					}
					.group:hover .group-hover\\:visible {
						visibility: visible;
						opacity: 1;
					}
				`);

				const step = (delta: number) => currentPageIndex.set(Math.min(Math.max(curIdx + delta, 0), Math.max(paginated.length, 1) - 1));
				const pages = tray.flex(
					[
						utils.components.button({
							icon: "caret_left_fill",
							tooltip: "Prev",
							size: "sm",
							transparent: true,
							disabled: curIdx === 0,
							onClick: ctx.eventHandler("notify:page:left", () => step(-1)),
						}),
						utils.pageRange(curIdx, paginated.length, 5).map((e) => {
							if (e === "...") return tray.span("...");
							return tray.button(`${e + 1}`, {
								intent: e === curIdx ? "primary" : "gray-subtle",
								disabled: e === curIdx,
								size: "sm",
								className: `rounded-full ${e !== curIdx ? "bg-transparent" : ""}`.trim(),
								onClick: ctx.eventHandler(`notify:page:${e}`, () => {
									if (e !== curIdx) currentPageIndex.set(e);
								}),
							});
						}),
						utils.components.button({
							icon: "caret_right_fill",
							tooltip: "Next",
							size: "sm",
							transparent: true,
							disabled: curIdx >= paginated.length - 1,
							onClick: ctx.eventHandler("notify:page:right", () => step(+1)),
						}),
					],
					{ className: "w-fit p-2 rounded-full border" },
				);

				return tray.modal({
					trigger,
					title: "SIMKLSync Notifications",
					className: "max-w-xl",
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
										paginated[curIdx] ?? [],
										tray.text("No Notifications", {
											className: "text-center p-5 text-xl font-semibold text-[--muted] border rounded-lg",
											style: { display: paginated[curIdx]?.length ? "none" : "block" },
										}),
									],
									{ className: "space-y-2" },
								),
					],
					footer: !modalOpened.get() ? [] : [tray.flex([pages], { className: "justify-center w-full" })],
					onOpenChange: ctx.eventHandler("simkl-notification-modal", ({ open }: { open: boolean }) => {
						modalOpened.set(open);
						if (!open) currentPageIndex.set(0);
					}),
				}); // prettier-ignore;
			};

			const unreads = ctx.state<number>((entries()?.filter((n) => n.unread) ?? []).length);
			return { unreads, entries, add, modal, clear, suppressBadge };
		})();

		/**
		 * Sync: AniList - Simkl anime list synchronization.
		 *
		 * Handles the two-way sync between an AniList media list collection and a Simkl
		 * anime library, with three sync modes (`patch` / `post` / `fullsync`) and
		 * abort/retry support.
		 *
		 * Sync modes:
		 * - `patch`    - add entries missing from the target (no updates, no deletes).
		 * - `post`     - update entries that exist on both sides (no adds, no deletes).
		 * - `fullsync` - add + update + delete entries absent from the source.
		 *
		 * Directions:
		 * - `import` - AniList → Simkl.
		 * - `export` - Simkl → AniList.
		 */
		const sync = (() => {
			const includeAdult = ctx.state<boolean>(false);
			const includePrivate = ctx.state<boolean>(false);
			const busy = ctx.state<boolean>(false);
			const type = ctx.state<"patch" | "post" | "fullsync">("patch");
			const kind = ctx.state<"import" | "export">("import"); // Import from anilist (Anilist -> SIMKL)
			const aborted = ctx.state<boolean>(false);
			const disableLiveSync = ctx.fieldRef<boolean>(false);
			const includeAdultLiveSync = ctx.fieldRef<boolean>($storage.get("simklsync:options-includeAdult")?.valueOf() ?? false);
			const includePrivateLiveSync = ctx.fieldRef<boolean>($storage.get("simklsync:options-includePrivate")?.valueOf() ?? false);

			const Custom = (() => {
				// [anilistId, simklId][]
				const id = "bce2ed58-db50-4507-9f76-644c129e3c9c";
				let cache: Map<number, number> | null = null;

				const load = () => {
					if (cache) return cache;
					cache = new Map($storage.get<[number, number][]>(id) ?? []);
					return cache;
				};

				const persist = (map: Map<number, number>) => {
					cache = map;
					$storage.set(id, [...map.entries()]);
				};

				const match = (mediaId?: number) => (mediaId ?? 0) >= 2 ** 31;
				const get = (customId: number) => load().get(customId);
				const set = (anilistId: number, simklId: number) => persist(load().set(anilistId, simklId)) // prettier-ignore
				const has = (customId: number) => load().has(customId);
				const del = (anilistId: number) => {
					const map = load();
					const res = map.delete(anilistId);
					if (res) persist(map);
					return res;
				};
				const clear = () => persist(new Map<number, number>());
				const getAbsoluteId = (anilistId: number) => match(anilistId) ? (get(anilistId) ?? anilistId) : anilistId; // prettier-ignore
				return { match, has, get, set, delete: del, getAbsoluteId, clear };
			})();

			const run = (afn: () => Promise<void>) => {
				if (busy.get()) throw new Error(`A sync is already running!`);
				busy.set(true);
				aborted.set(false);
				afn()
					.then(() => log.send(`synclist > Operation finished successfully.`))
					.catch((err: Error) => {
						log.error(`synclist > ${err.message}`);
						notifications.add({
							title: "Manual Sync Error",
							description: err.message,
							accentColor: "#ef5350",
							thumbnail: icons.get("gears"),
						});
					})
					.finally(() => {
						busy.set(false);
						aborted.set(false);
					});
			};

			const statusToAL = (status?: $simkl.SimklStatus): $app.AL_MediaListStatus | undefined => 
				!status ? undefined : 
				({ completed: "COMPLETED", dropped: "DROPPED", hold: "PAUSED", plantowatch: "PLANNING", watching: "CURRENT", } as const)[status]; // prettier-ignore

			const statusToSIMKL = (status?: $app.AL_MediaListStatus): $simkl.SimklStatus | undefined =>
				!status ? undefined :
				({ COMPLETED: "completed", CURRENT: "watching", DROPPED: "dropped", PAUSED: "hold", PLANNING: "plantowatch", REPEATING: "watching", } as const)[status]; // prettier-ignore

			const getAnilistEntries = () => ($anilist.getAnimeCollection(false).MediaListCollection?.lists ?? [])
				.flatMap(list => list.entries)
				.filter((e) => e !== undefined)
				.map(({ media, ...rest }) => ({ ...rest,
					title: media?.title?.userPreferred,
					mediaId: media?.id,
					format: media?.format,
					episodes: media?.episodes,
					coverImage: media?.coverImage?.large,
					isAdult: media?.isAdult,
				})); //prettier-ignore

			async function perfImport() {
				const t = type.get(), k = kind.get(), a = includeAdult.get(), p = includePrivate.get(); // prettier-ignore
				log.send(`synclist > Performing Manual Sync | type="${t}" kind="${k}" includeAdult="${a}" includePrivate="${p}"`);

				log.send("synclist > Scanning List...");
				const mlc = $anilist.getAnimeCollection(false)?.MediaListCollection?.lists;
				if (!mlc) {
					log.warn("synclist > MediaListCollection is not yet ready! Please try again later!");
					throw new Error("MediaListCollection is not yet ready! Please try again later!");
				}

				const entries = mlc.map((c) => ({ name: utils.unwrap(c.name), status: utils.unwrap(c.status), count: c.entries?.length ?? 0, isCustom: utils.unwrap(c.isCustomList) })); //prettier-ignore
				log.info(`synclist > Found ${entries.reduce((sum, e) => sum + e.count, 0)} entries! ${entries.map((e) => `${e.name ?? e.status}="${e.count}"`).join(" ")}`); //prettier-ignore

				const customList = entries.filter((x) => x.isCustom);
				if (customList.length) log.warn(`synclist > Custom list found. Entries from your [${customList.length}] custom list will be ignored!`);

				log.send(`synclist > Retrieving simkl media collection <Anime>`);
				if (aborted.get()) throw new Error("Operation aborted by <User>");
				const simklCollection = await application.list.getMediaListCollection();

				const validate = (listEntries: $app.AL_AnimeCollection_MediaListCollection_Lists_Entries[], type: "Watchlist" | "History") => {
					if (!a) {
						const o_l = listEntries.length;
						log.send(`synclist > [${type}] Pruning adult entries from the payload...`);
						listEntries = listEntries.filter((x) => !utils.unwrap(x.media?.isAdult));
						log.send(`synclist > [${type}] Removed ${o_l - listEntries.length} adult only entries!`);
					}

					if (!p) {
						const o_l = listEntries.length;
						log.send(`synclist > [${type}] Pruning private entries from the payload...`);
						listEntries = listEntries.filter((x) => !utils.unwrap(x.private));
						log.send(`synclist > [${type}] Removed ${o_l - listEntries.length} private entries!`);
					}

					if (listEntries.some((x) => Custom.match(x.media?.id!))) {
						const o_l = listEntries.length;
						log.send(`synclist > [${type}] Pruning custom entries with no id overrides`);
						listEntries = listEntries.filter((x) => !Custom.match(Custom.getAbsoluteId(x.media?.id!)));
						log.send(`synclist > [${type}] Removed ${o_l - listEntries.length} custom entries!`);
					}

					return listEntries;
				};

				const listInclude = (simkl: $simkl.MediaListCollection["anime"], anilist: $app.AL_AnimeCollection_MediaListCollection_Lists_Entries[]) => {
					const simklSet = new Set(simkl.map((x) => Number(x.show.ids.anilist)).filter(Number.isFinite));
					switch (t) {
						// send entries NOT in Simkl
						case "patch": return new Set(anilist.map((x) => x?.media?.id).filter((id) => Number.isFinite(id) && !simklSet.has(id!)));
						// send entries IN Simkl
						case "post": return new Set(anilist.map((x) => x?.media?.id).filter((id) => Number.isFinite(id) && simklSet.has(id!)));
						// fullsync → send everything; return all AniList IDs
						default: return new Set(anilist.map((x) => x?.media?.id).filter(Number.isFinite));
					}
				}; // prettier-ignore

				let forWatchlist = mlc
					.filter((list) => utils.unwrap(list.status) === "PLANNING" && !utils.unwrap(list.isCustomList))
					.flatMap((l) => utils.unwrap(l.entries))
					.filter((e) => e !== undefined);

				const watchlistInclude = listInclude(simklCollection.anime.filter((x) => x.status === "plantowatch"), forWatchlist); // prettier-ignore
				forWatchlist = validate(forWatchlist, "Watchlist").filter((e) => watchlistInclude.has(utils.unwrap(e.media?.id)!));
				log.info(`synclist > [Watchlist] [${forWatchlist.length}] entries ready to add to watchlist.`);

				if (aborted.get()) throw new Error("Operation aborted by <User>");
				log.send(`synclist > [Watchlist] applying changes...`);
				await application.list
					.addToWatchList({
						anime: forWatchlist
							.map((e) => ({ to: statusToSIMKL(utils.unwrap(e.status))!, ids: { anilist: Custom.getAbsoluteId(utils.unwrap(e.media?.id)!) } })),
					})
					.then(({ added, not_found }) => log.success(`synclist > [Watchlist] added-movies="${added.movies.length}" added-shows="${added.shows.length}" not-found-movies="${not_found.movies?.length}" not-found-shows="${not_found.shows?.length}"`))
					.catch((e: Error) => log.error(`synclist [Watchlist] Error: ${e.message}`)); //prettier-ignore

				let fh: number = 0;
				let forHistory = mlc
					.filter((list) => utils.unwrap(list.status) !== "PLANNING" && !utils.unwrap(list.isCustomList))
					.flatMap((l) => l.entries)
					.filter((e) => e !== undefined);

				const historyInclude = listInclude(simklCollection.anime.filter((x) => x.status !== "plantowatch"), forHistory); // prettier-ignore
				forHistory = validate(forHistory, "History").filter((e) => historyInclude.has(utils.unwrap(e.media?.id)!));
				log.info(`synclist > [History] [${forHistory.length}] entries ready to add to history.`);

				const ep_del_queue: $simkl.UpdateEntryBody[] = [];

				const simklById = new Map(simklCollection.anime.map((x) => [Number(x.show.ids.anilist), x]));
				if (aborted.get()) throw new Error("Operation aborted by <User>");
				log.send(`synclist > [History] applying changes...`);

				const forHistoryPayload = forHistory
					.map((e) => {
						const entryPL: $simkl.UpdateEntryBody = { ids: { anilist: Custom.getAbsoluteId(utils.unwrap(e.media?.id)!) } };
						const existing = simklById.get(Number(utils.unwrap(e.media?.id)));

						const simklStatus = statusToSIMKL(utils.unwrap(e.status)!);
						if (simklStatus !== existing?.status) entryPL.status = simklStatus;

						const progress = e.progress?.valueOf();
						const existing_ep = existing?.watched_episodes_count ?? 0;
						const isMovie = existing?.anime_type === "movie" || e.media?.format === "MOVIE";
						if (!isMovie && progress != null && progress !== existing_ep) {
							if (progress > existing_ep) {
								entryPL.episodes = Array.from({ length: progress - existing_ep }, (_, idx) => ({ number: idx + 1 + existing_ep }));
							} else if (existing_ep > 0) {
								ep_del_queue.push({
									ids: { anilist: Custom.getAbsoluteId(utils.unwrap(e.media?.id)!) },
									episodes: Array.from({ length: existing_ep - progress }, (_, idx) => ({ number: progress + 1 + idx })),
								});
							}
						}
						
						const { day, month, year } = utils.unwrap(e.completedAt) ?? {};
						if (day && month && year) {
							const delta = new Date(Date.UTC(year, month - 1, day)).toISOString();
							if (delta !== existing?.last_watched_at) entryPL.watched_at = delta;
						}
						
						const simklRating = e.score?.valueOf() ? Math.max(1, Math.min(10, Math.round(e.score.valueOf() / 10))) : undefined;
						if (simklRating && simklRating !== existing?.user_rating) entryPL.rating = simklRating;

						const simklMemo = utils.unwrap(e.notes)?.slice(0, 140);
						if (simklMemo !== existing?.memo?.text) entryPL.memo = { text: utils.unwrap(e.notes)!.slice(0, 140) };
						
						return entryPL;
					})
					.filter((entry) => Object.keys(entry).length > 1); // prettier-ignore

				await application.list.addToHistory({ anime: forHistoryPayload })
					.then(({ added, not_found }) => log.success(`synclist > [History] added-episodes="${added.episodes}" added-movies="${added.movies}" added-shows="${added.shows}" modified-entries="${added.statuses.length}" not-found-episodes="${not_found.episodes?.length}" not-found-movies="${not_found.movies?.length}" not-found-shows="${not_found.shows.length}"`))
					.catch((e: Error) => log.error(`synclist > [History] Error: ${e.message}`)); //prettier-ignore

				if (aborted.get()) throw new Error("Operation aborted by <User>");

				if (t !== "patch") {
					if (t === "post" && ep_del_queue.length) {
						log.send(`synclist > [DeletionQueue] [${ep_del_queue.length}] entries queued for episode removal. Applying changes...`);
						await application.list.removeFromList({ shows: ep_del_queue })
								.then(({ deleted, not_found }) => log.success(`synclist > [History] deleted-episodes="${deleted.episodes}" not-found-entries="${not_found.shows.length}"`))
								.catch((e: Error) => log.error(`synclist > [History] Error: ${e.message}`)); //prettier-ignore
					}

					if (t === "fullsync") {
						const alColl = mlc.filter((list) => !utils.unwrap(list.isCustomList)).flatMap((l) => l.entries ?? []).filter(Boolean); //prettier-ignore
						const alIds = new Set(alColl.map((h) => Number(h?.media?.id)).filter(Number.isFinite));
						const histNotInAL = simklCollection.anime
							.filter((x) => {
								const id = Number(x.show.ids.anilist);
								return Number.isFinite(id) && !alIds.has(id);
							})
							.map((x) => ({ ids: { anilist: Number(x.show.ids.anilist) } }));

						const shows = [...histNotInAL, ...ep_del_queue];
						log.info(`synclist > Detected [${histNotInAL.length}] entries not in AniList and [${ep_del_queue.length}] episodes queued for deletion.`);

						if (aborted.get()) throw new Error("Operation aborted by <User>");
						log.send(`synclist > [DeletionQueue] applying changes...`);
						if (shows.length) await application.list
							.removeFromList({ shows })
							.then(({ deleted, not_found }) => log.success(`synclist > [History] deleted-entries="${deleted.shows}" deleted-episodes="${deleted.episodes}" not-found-entries="${not_found.shows.length}"`))
							.catch((e: Error) => log.error(`synclist > [History] Error: ${e.message}`)); //prettier-ignore
					}
				}

				fh = forHistory.length;

				notifications.add({
					title: "Manual Sync Successful",
					accentColor: "#0b7b2ac4",
					thumbnail: icons.get("gears"),
					fields: [
						{ name: "Type", value: t.toUpperCase() },
						{ name: "Direction", value: k === "import" ? "AniList → SIMKL" : "SIMKL → AniList" },
						{ name: "Mature Content", value: a ? "Included" : "Excluded" },
						{ name: "Private Entries", value: p ? "Included" : "Excluded" },
						{ name: "Processed entries", value: (forWatchlist.length + fh).toString() },
					],
				});
			}

			async function perfExport() {
				const t = type.get(), k = kind.get(), a = includeAdult.get(), p = includePrivate.get(), token = $database.anilist.getToken(); // prettier-ignore
				log.send(`synclist > Performing Manual Sync | type="${t}" kind="${k}" includeAdult="${a}" includePrivate="${p}"`);

				if (!token.length) {
					log.error(`synclist > No Anilist Token detected! Cancelling sync...`);
					return;
				}

				log.send("synclist > Scanning List...");

				const mlc = $anilist.getAnimeCollection(false)?.MediaListCollection?.lists?.filter((l) => !l.isCustomList?.valueOf());
				if (!mlc) {
					log.warn("synclist > MediaListCollection is not yet ready! Please try again later!");
					throw new Error("MediaListCollection is not yet ready! Please try again later!");
				}

				if (aborted.get()) throw new Error("Operation aborted by <User>");
				const { anime: rawAnime } = await application.list.getMediaListCollection();
				const simklAnime = rawAnime.filter((x) => isFinite(Number(x.show.ids.anilist)));
				log.info(`synclist > Found [${rawAnime.length}] entries! [${simklAnime.length}] entries have valid anilistId!`);

				const alAnime = new Map(mlc.flatMap(e => e.entries).filter(x => x !== undefined).map(e => [e.media!.id!, e])); //prettier-ignore
				const simklAnilistIds = new Set(simklAnime.map((s) => Number(s.show.ids.anilist)).filter(Number.isFinite));
				const fullsync_del_queue = [...alAnime.values()].filter((e) => e.media?.id != null && !simklAnilistIds.has(e.media.id)).map((a) => ({ id: a.id, title: a.media?.title?.userPreferred })); //prettier-ignore

				const payload = (() => {
					let data: typeof simklAnime;
					if (t === "patch") data = simklAnime.filter((x) => !alAnime.has(Number(x.show.ids.anilist)));
					else if (t === "post") data = simklAnime.filter((x) => alAnime.has(Number(x.show.ids.anilist)));
					else data = simklAnime; // fullsync

					return data
						.map((e) => {
							const al = alAnime.get(Number(e.show.ids.anilist));
							return {
								...(!!al ? { id: utils.unwrap(al.id) } : { mediaId: Number(e.show.ids.anilist) }),
								...(e.watched_episodes_count !== (utils.unwrap(al?.progress) ?? 0) ? { progress: e.watched_episodes_count } : {}),
								...(!!e.user_rating ? { scoreRaw: e.user_rating * 10 } : {}),
								...(!!e.status && e.status !== statusToSIMKL(utils.unwrap(al?.status)) ? { status: statusToAL(e.status) } : {}),
							};
						})
						.filter((p) => Object.keys(p).length > 1);
				})();

				log.info(`synclist > Syncing SIMKL Anime MediaList to Anilist Media Collection. This may take some time.`);
				log.warn("synclist > Anilist does not support batch updates for your media collection. Also the API is currently in a degrated state. As such, this operation may take longer than intended."); //prettier-ignore

				async function saveMediaListEntry(p: (typeof payload)[number], retries: number) {
					const res = await ctx.fetch("https://graphql.anilist.co/", {
						method: "POST",
						headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
						body: JSON.stringify({
							query: "mutation ($id: Int, $mediaId: Int, $status: MediaListStatus, $progress: Int, $scoreRaw: Int) { SaveMediaListEntry(id: $id, mediaId: $mediaId, status: $status, progress: $progress, scoreRaw: $scoreRaw) { id status progress scoreRaw media { title { userPreferred }} } }",
							variables: p,
						})
					}); //prettier-ignore

					if (res.status === 429) {
						const retryAfter = Number(res.headers?.["retry-after"] ?? 60);
						if (retries >= 2) {
							log.error("synclist > 3 consecutive ratelimit errors detected. Terminating sync.");
							throw new Error("Rate limited");
						}

						log.warn(`synclist > Rate limited. Waiting ${retryAfter}s... (retry ${retries + 1}/3)`);

						if (aborted.get()) throw new Error("Operation aborted by <User>");
						await utils.wait(retryAfter * 1000);
						retries++;

						if (aborted.get()) throw new Error("Operation aborted by <User>");
						return saveMediaListEntry(p, retries);
					}

					const body = res.json<{ errors: { message: string }[] } | { SaveMediaListEntry: { id: number, status?: $app.AL_MediaListStatus, progress?: number, scoreRaw?: number, media?: { title?: { userPreferred?: string }} }}>(); //prettier-ignore
					if (!res.ok) {
						log.error(`synclist > Failed to save MediaListEntry ${"id" in p ? `id="${p.id}"` : `mediaId="${p.mediaId}"`}: ${res.statusText}`);
					} else if ("errors" in body) {
						log.error(`synclist > Failed to save MediaListEntry ${"id" in p ? `id="${p.id}"` : `mediaId="${p.mediaId}"`}: ${body.errors[0]?.message ?? "Unknown GraphQL Error"}`); //prettier-ignore
					} else {
						const { SaveMediaListEntry: s } = body;
						log.success(`synclist > Synced MediaListEntry title="${s.media?.title?.userPreferred}" id="${s.id}" status="${s.status ?? ""}" progress="${s.progress ?? ""}" scoreRaw="${s.scoreRaw}"`); //prettier-ignore
					}
				}

				for (const [idx, p] of payload.entries()) {
					if (aborted.get()) throw new Error("Operation aborted by <User>");
					await saveMediaListEntry(p, 0);
					if (idx !== payload.length - 1) await utils.wait(3_000);
				}

				async function deleteMediaListEntry(id: number, retries: number, title?: string) {
					const res = await ctx.fetch("https://graphql.anilist.co/", {
						method: "POST",
						headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
						body: JSON.stringify({
							query: "mutation ($id: Int) { DeleteMediaListEntry(id: $id) { deleted } }",
							variables: { id },
						})
					}); //prettier-ignore

					if (res.status === 429) {
						const retryAfter = Number(res.headers?.["retry-after"] ?? 60);
						if (retries >= 2) {
							log.error("synclist > 3 consecutive ratelimit errors detected. Terminating sync.");
							throw new Error("Rate limited");
						}

						log.warn(`synclist > Rate limited. Waiting ${retryAfter}s... (retry ${retries + 1}/3)`);

						if (aborted.get()) throw new Error("Operation aborted by <User>");
						await utils.wait(retryAfter * 1000);
						retries++;

						if (aborted.get()) throw new Error("Operation aborted by <User>");
						return deleteMediaListEntry(id, retries, title);
					}

					const body = res.json<{ errors: { message: string }[] } | { DeleteMediaListEntry: { deleted: boolean }}>(); //prettier-ignore
					if (!res.ok) {
						log.error(`synclist > Failed to delete MediaListEntry id="${id}": ${res.statusText}`);
					} else if ("errors" in body) {
						log.error(`synclist > Failed to delete MediaListEntry id="${id}": ${body.errors[0]?.message ?? "Unknown GraphQL Error"}`); //prettier-ignore
					} else {
						const { DeleteMediaListEntry: d } = body;
						log.success(`synclist > Success on DeleteMediaListEntry title="${title}" id="${id}" deleted="${d.deleted}"`); //prettier-ignore
					}
				}

				if (t === "fullsync" && fullsync_del_queue.length) {
					log.info("synclist > Deleting entries absent from SIMKL...");
					for (const [idx, { id: mediaListId, title }] of fullsync_del_queue.entries()) {
						if (aborted.get()) throw new Error("Operation aborted by <User>");
						await deleteMediaListEntry(mediaListId, 0, title);
						if (idx !== fullsync_del_queue.length - 1) await utils.wait(3_000);
					}
				}

				notifications.add({
					title: "Manual Sync Successful",
					accentColor: "#0b7b2ac4",
					thumbnail: icons.get("gears"),
					fields: [
						{ name: "Type", value: t.toUpperCase() },
						{ name: "Direction", value: k === "import" ? "AniList → SIMKL" : "SIMKL → AniList" },
						{ name: "Mature Content", value: a ? "Included" : "Excluded" },
						{ name: "Private Entries", value: p ? "Included" : "Excluded" },
						{ name: "Processed entries", value: payload.length.toString() },
					],
				});
			}

			// LIVESYNC - Triggers when user manually updates an entry
			$store.watch<Omit<$app.PostUpdateEntryEvent, "next">>("POST_UPDATE_ENTRY", async (e) => {
				const p = includePrivateLiveSync.current, a = includeAdultLiveSync.current; // prettier-ignore

				if (!e.mediaId) 
					return log.warn("update > missing mediaId"); // prettier-ignore

				if (disableLiveSync.current) 
					return log.warn(`update > Syncing was disabled. Will not sync anilist/${e.mediaId}`); // prettier-ignore

				const data = $store.get<Omit<$app.PreUpdateEntryEvent, "next" | "preventDefault"> | undefined>("PRE_UPDATE_ENTRY_DATA");
				if (!data) {
					return log.warn("update > No update data was emitted from the pre update hooks!");
				} else if (data.mediaId !== e.mediaId) {
					return log.warn("update > mediaId mismatch found from preUpdate to postUpdate hooks!");
				} else {
					$store.set("PRE_UPDATE_ENTRY_DATA", null);
				}

				const entry = getAnilistEntries().find((x) => x.mediaId === e.mediaId);
				if (!entry) return log.warn(`update > AnimeMedia not found (${e.mediaId})`);

				if (utils.unwrap(entry.private) && !p) return log.warn(`update > ${entry.title ?? "anilist-id/" + data.mediaId} is private. Skipping...`);
				if (utils.unwrap(entry.isAdult) && !a) return log.warn(`update > ${entry.title ?? "anilist-id/" + data.mediaId} is adult-only. Skipping...`);

				if (Custom.match(e.mediaId) && !Custom.has(e.mediaId)) 
					return log.warn(`update > Unable to process custom entry: No id overrides found.`); // prettier-ignore

				if (data.status === "PLANNING") return application.list.addToWatchList({ anime: [{ to: "plantowatch", ids: { anilist: Custom.getAbsoluteId(e.mediaId) }}]})
					.then((data) => {
						log.success(`update > request="POST" @api/sync/add-to-list response=${JSON.stringify(data)}`);
						if (data.added.shows.length > 0 || data.added.movies.length > 0) notifications.add({
							title: `Added ${utils.unwrap(entry.title) ?? `anilist/${e.mediaId}`} to watchlist!`,
							thumbnail: utils.unwrap(entry.coverImage),
							accentColor: "#0b7b2ac4",
						}); // prettier-ignore
					})
					.catch((err: Error) => {
						log.error(`update > request="POST" @api/sync/add-to-list error="${err.message}"`);
						notifications.add({
							title: `Failed to add ${utils.unwrap(entry.title) ?? `anilist/${e.mediaId}`} to watchlist`,
							thumbnail: utils.unwrap(entry.coverImage),
							description: err.message,
							accentColor: "#ef5350",
						})
					}); // prettier-ignore

				const simklentry = await application.list.getMediaListCollection().then(c => c.anime.find(x => Number(x.show.ids.anilist) === e.mediaId)); // prettier-ignore
				const payload: $simkl.UpdateEntryBody = { ids: { anilist: Custom.getAbsoluteId(e.mediaId) } };
				const payload_r: $simkl.UpdateEntryBody = { ids: { anilist: Custom.getAbsoluteId(e.mediaId) } };
				const payload_r_r: Partial<$simkl.UpdateEntryBody> = {};

				// STATUS
				if (statusToSIMKL(data.status) !== simklentry?.status) payload.status = statusToSIMKL(data.status);

				// SCORE
				const computed = Number(simklentry?.user_rating) * 10;
				if (data.scoreRaw !== computed) {
					if (typeof data.scoreRaw === "number" && data.scoreRaw !== computed) payload.rating = Math.max(Math.round(data.scoreRaw / 10),1); //prettier-ignore
					if (data.scoreRaw === undefined || data.scoreRaw === null) payload_r_r.ids = { anilist: Custom.getAbsoluteId(e.mediaId) }; // prettier-ignore
				}

				// PROGRESS
				if (data.progress !== undefined && data.progress !== (simklentry?.watched_episodes_count ?? 0)) {
					const al = data.progress, simkl = simklentry?.watched_episodes_count ?? 0; // prettier-ignore
					if (data.progress > (simklentry?.watched_episodes_count ?? 0)) payload.episodes = Array.from({ length: (al - simkl) }, (_, idx) => ({
						number: simkl + 1 + idx,
					})); // prettier-ignore
					if (data.progress < (simklentry?.watched_episodes_count ?? 0)) payload_r.episodes = Array.from({ length: (simkl - al) }, (_, idx) => ({
						number: al + 1 + idx,
					})); // prettier-ignore
				}

				const targets: { status?: boolean; score?: "add" | "remove"; progress?: { type?: "add" | "remove"; eps: number[] }; err: string[] } = { err: [] }; // prettier-ignore;
				if (Object.keys(payload).length > 1) await application.list.addToHistory({ anime: [payload] })
					.then((data) => {
						if (data.not_found.shows.length || data.not_found.movies.length) throw new Error(`No matching simkl entry.`);
						log.success(`update > request="POST" @api/sync/history response=${JSON.stringify(data)}`);
						if ("status" in payload) targets.status = true;
						if ("rating" in payload) targets.score = "add";
						if ("episodes" in payload) targets.progress = { type: "add", eps: payload.episodes?.map(e => e.number )!};
					})
					.catch((err: Error) => {
						delete targets.status;
						delete targets.score;
						delete targets.progress;
						log.error(`update > request="POST" @api/history error=${err.message}`);
						targets.err.push(err.message);
					})
					.finally(() => utils.wait(1_000)); // prettier-ignore

				if (Object.keys(payload_r).length > 1) await application.list.removeFromList({ shows: [payload_r] })
					.then((data) => {
						if (data.not_found.shows.length || data.not_found.movies.length) throw new Error(`No matching simkl entry.`);
						log.success(`update > request="POST" @api/sync/history/remove response=${JSON.stringify(data)}`);
						targets.progress = { type: "remove", eps: payload_r.episodes?.map(e => e.number )!};
					})
					.catch((err: Error) => {
						log.error(`update > request="POST" @api/history/remove error=${err.message}`);
						delete targets.progress;
						targets.err.push(err.message);
					})
					.finally(() => utils.wait(1_000)); // prettier-ignore

				if (Object.keys(payload_r_r).length > 0) await application.list.removeRatings({ anime: [payload_r_r as $simkl.UpdateEntryBody] })
					.then((data) => {
						if (data.not_found?.shows?.length) throw new Error("No matching simkl entry.");log.success(`update > request="POST" @api/sync/ratings/remove response=${JSON.stringify(data)}`);
						targets.score = "remove";
					})
					.catch((err: Error) => {
						log.error(`update > request="POST" @api/ratings/remove error=${err.message}`);
						delete targets.score;
						targets.err.push(err.message);
					})
					.finally(() => utils.wait(1_000)); // prettier-ignore

				const fields: Parameters<typeof notifications.add>[0]["fields"] = [
					(targets.status ? { name: "Status", value: statusToAL(payload.status)! } : undefined),
					(targets.score === "add" ? { name: "Score", value: payload.rating?.toString()! } : undefined),
					(targets.score === "remove" ? { name: "Score", value: "Removed" } : undefined),
					(targets.progress?.type === "add" ? { name: "Added Episodes", value: `[${payload.episodes?.map(x => x.number)}]`} : undefined),
					(targets.progress?.type === "remove" ? { name: "Removed Episodes", value: `[${payload_r.episodes?.map(x => x.number)}]`} : undefined)
				].filter(x => x !== undefined); // prettier-ignore

				notifications.add({
					title: `${targets.err.length === 3 ? "Failed to update" : "Updated"} ${utils.unwrap(entry.title)}`,
					thumbnail: utils.unwrap(entry.coverImage),
					...(targets.err.length && { description: `Errors found: ${targets.err.join(" | ")}`}),
					accentColor: targets.err.length === 3 ? "#ef5350" : "#6152df",
					fields
				}); // prettier-ignore
			});

			// LIVESYNC - Triggers when users deletes an entry
			$store.watch("POST_DELETE_ENTRY", async (e: Omit<$app.PostDeleteEntryEvent, "next">) => {
				const p = includePrivateLiveSync.current, a = includeAdultLiveSync.current; // prettier-ignore

				if (!e.mediaId) 
					return log.warn("delete > missing mediaId"); // prettier-ignore

				if (disableLiveSync.current) 
					return log.warn(`delete > Syncing was disabled. Will not sync anilist/${e.mediaId}`); // prettier-ignore

				const entry = getAnilistEntries().find((x) => x.mediaId === e.mediaId);
				if (!entry) return log.warn(`delete > AnimeMedia not found (${e.mediaId})`);

				if (utils.unwrap(entry.isAdult) && !a)
					return log.warn(`delete > Sync for entry ${entry.title ?? `anilist/${entry.mediaId}`} cancelled. Reason: Entry is Adult-Only.`);

				if (utils.unwrap(entry.private) && !p)
					return log.warn(`delete > Sync for entry ${entry.title ?? `anilist/${entry.mediaId}`} cancelled. Reason: Entry is Private.`);

				if (Custom.match(e.mediaId) && !Custom.has(e.mediaId)) 
					return log.warn(`delete > Unable to process custom entry: No id overrides found.`); // prettier-ignore

				await application.list.removeFromList({ shows: [{ ids: { anilist: Custom.getAbsoluteId(e.mediaId)}}] })
					.then(data => {
						log.success(`delete > request="POST" @api/sync/history/remove response=${JSON.stringify(data)}`);
						if ((data.deleted.shows > 0) || (data.deleted.movies > 0)) notifications.add({
							title: `Removed ${utils.unwrap(entry.title) ?? `anilist/${e.mediaId}`} from list!`,
							thumbnail: utils.unwrap(entry.coverImage),
							accentColor: "#ef5350",
						}); // prettier-ignore
					})
					.catch((err) => {
						log.error(`delete > request="POST" @api/history/remove error=${(err as Error).message}`);
						notifications.add({
							title: `Failed to remove ${utils.unwrap(entry.title) ?? `anilist/${e.mediaId}`} from list!`,
							description: (err as Error).message,
							thumbnail: utils.unwrap(entry.coverImage),
							accentColor: "#ef5350",
						});
					}); //prettier-ignore
			});

			return {
				busy,
				get aborted() {
					return aborted.get();
				},
				liveSync: { includeAdult: includeAdultLiveSync, includePrivate: includePrivateLiveSync, disabled: disableLiveSync },
				options: { type, kind, includeAdult, includePrivate },
				customsource: Custom,
				run: () => run(kind.get() === "import" ? perfImport : perfExport),
				abort: () => aborted.set(true),
			};
		})();

		/**
		 * Scrobble Handler - wires playback events to Simkl's scrobble API.
		 *
		 * A `ctx.effect` on `application.playback.playing` sends
		 * `POST /scrobble/{start|pause|stop}`; two event listeners populate the
		 * playback state from external players (`ctx.playback`) and VideoCore
		 * (`ctx.videoCore`) respectively.
		 */
		(() => {
			// Fires whenever the playback.playing state is changed (playing = true | false)
			ctx.effect(() => {
				const { state, playing, scrobble } = application.playback;
				const playbackState = state.get(), isPlaying = playing.get(); // prettier-ignore

				if (!playbackState) return log.warn(`scrobbler > ${isPlaying ? "start" : "stop"} signal received but playback state was null.`);
				if (typeof playbackState.episode !== "number") return log.warn(`scrobbler > ${isPlaying ? "start" : "stop"} signal received but invalid episode type. Expected 'number' received '${typeof playbackState.episode}'`); //prettier-ignore

				const payload: $simkl.ScrobbleRequestBody = {
					anime: { ids: { anilist: playbackState.anilistId } },
					progress: playbackState.progress,
					episode: { number: playbackState.episode },
				};

				if (!isPlaying) {
					log.send(`scrobbler > stopping playback scrobbler | request="POST" @api/scrobble/stop payload="${JSON.stringify(payload)}"`);
					state.set(null);

					if (sync.liveSync.disabled.current) return log.warn("scrobbler > LiveSync is currently disabled. Only stop is allowed on this endpoint.");
					scrobble("stop", payload)
						.then(data => {
							log.success(`scrobbler > request accepted action="${data.action}" progress="${data.progress}"`);
							if (data.action === "scrobble") notifications.add({
								title: `Watched episode ${playbackState.episode} of ${playbackState.title}`,
								thumbnail: playbackState.coverImage,
							});
						})
						.catch(err =>log.error(`scrobbler > ${err.message}`)); //prettier-ignore
				} else {
					const { title, episode, season, paused } = playbackState;
					log.send(`scrobbler > scrobbling ${title} episode="${episode ?? "N/A"}" season=${season ?? "N/A"}`);

					const action = paused ? "pause" : "start";
					log.send(`scrobbler > sending request="POST" @api/scrobble/${action} payload=${JSON.stringify(payload)}`);

					if (sync.liveSync.disabled.current)
						return log.error("scrobbler > request aborted. LiveSync is currently disabled"); // prettier-ignore

					scrobble(action, payload)
						.then((data) => log.success(`scrobbler > request accepted action="${data.action}" progress="${data.progress}"`))
						.catch((err) => log.error(`scrobbler > ${err.message}`));
				}
			}, [application.playback.playing]);

			// Playback (automatic handling of playback state, EXTERNAL PLAYERS)
			ctx.playback.registerEventListener(async (e) => {
				if (e.isVideoCompleted || e.isVideoStopped || e.isStreamCompleted || e.isStreamStopped) {
					application.playback.playing.set(false);
				}

				const currState = application.playback.state.get();
				if (!currState) {
					const { mediaId: anilistId, mediaTitle: title, episodeNumber: episode, mediaCoverImage: coverImage } = e.state; // prettier-ignore
					const { completionPercentage: progress, paused } = e.status;
					application.playback.state.set({ anilistId, title, episode, coverImage, progress: progress * 100, paused }); // prettier-ignore
					// Start scrobbler with slight debounce
					ctx.setTimeout(() => application.playback.playing.set(true), 500);
				} else {
					application.playback.state.set({ ...currState, progress: e.status.completionPercentage * 100 });
				}
			});

			// VideoCore (automatic handling of playback state, VideoCore)
			// VideoCore.VideoResumed - always fires on playback start
			ctx.videoCore.addEventListener("video-resumed", async (e) => {
				application.playback.playing.set(true);
				const playbackState = ctx.videoCore.getPlaybackState();
				if (!playbackState) {
					log.error(`scrobble > videocore-video-resumed emitted but playback state was undefined or null.`);
					return;
				}

				const { playbackInfo: { media, episode }} = playbackState; // prettier-ignore
				application.playback.state.set({
					anilistId: media?.id!,
					progress: (e.currentTime / e.duration) * 100,
					paused: false,
					title: media?.title?.userPreferred!,
					episode: episode?.episodeNumber,
					coverImage: media?.coverImage?.large,
				});
			});

			// VideoCore.VideoEnded - fires when playback reaches eof for videocore player (excl. mpvcore)
			for (const evt of ["video-completed", "video-terminated"] as $ui.VideoEventType[]) {
				ctx.videoCore.addEventListener(evt, () => application.playback.playing.set(false));
			}
		})();

		const tabs = (() => {
			enum Tab { Logon = "0bd1997d-977b-41b9-bbeb-0706a0c19e20", Landing = "8f7da464-dbb2-4a6d-92b0-34ee816409bd" } // prettier-ignore
			const current = ctx.state<Tab>(Tab.Logon);
			const authError = ctx.state<string>("");
			const authField = ctx.fieldRef<string>("");

			const logon = () => {
				const authErrorStr = authError.get().trim();
				const error = tray.text(authErrorStr, {
					className: "break-normal bg-red-600/70 text-red-100 text-sm border border-red-500 rounded-md mb-4 px-2 py-1 line-clamp-3",
					style: { display: authErrorStr.length ? "block" : "none" },
				});

				const infoStr = "Click the button below to authorize the application, then copy the token from the website and paste it into the field below.";
				const info = tray.text(infoStr, { style: { textAlign: "center", wordBreak: "normal" } });

				const authButton = tray.anchor({
					text: "Authorize",
					href: application.auth.generateURL(),
					target: "_blank",
					className: "UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border bg-gray-100 border-transparent hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 h-10 px-4 no-underline", // prettier-ignore
					style: {
						pointerEvents: application.auth.busy.get() ? "none" : "auto",
						opacity: application.auth.busy.get() ? "0.5" : "1",
						width: "100%",
					},
				});

				const authToken = tray.input({
					label: "\u200b",
					placeholder: "Auth Code",
					fieldRef: authField,
					disabled: application.auth.busy.get(),
					style: { color: "var(--background)", background: "var(--foreground)", borderRadius: "0.5rem" },
				});

				const login = tray.button({
					label: "Login",
					intent: "primary",
					size: "md",
					loading: application.auth.busy.get(),
					style: { width: "100%" },
					onClick: ctx.eventHandler("simklsync:login", async () => {
						if (!authField.current.trim().length) return authError.set("Error: Please enter your Auth code");
						authError.set("");

						try {
							const tokenInfo = await application.auth.exchangeCode(authField.current);
							authField.setValue("");
							tabs.current.set(Tab.Landing);
							log.success(`login > Successfully logged in: access_token="***" scope="${tokenInfo.scope}" expires_in="${tokenInfo.expires_in}"`);
							log.send("login > Fetching user info...");
						} catch (error) {
							authError.set((error as Error).message);
							log.error(`login > Login failed: ${(error as Error).message}`);
							return;
						}

						let data: $simkl.SimklUserInfo | undefined = undefined,
							retries = 1;

						while (data === undefined && retries <= 3) {
							try {
								const res = await application.user.fetch();
								data = res;
								log.success("login > Successfully fetched user info!");
								log.send(`login > Welcome {{USERNAME}}!`);
								tray.updateBadge({ number: 0 });
							} catch (error) {
								if (retries === 3) {
									log.warn(`login > Unable to fetch the user info after 3 failed attempts. Some parts of the application may not work as intended. Please sign out and log in again.`); // prettier-ignore
								} else {
									log.warn(`login > Failed to fetch user info. Attempting a refetch (${retries})...`);
								}
								retries++;
								await utils.wait(2_000);
							}
						}
					}),
				});

				const logs = log.modal(
					utils.components.button({ icon: "code", tooltip: "Open Logs", transparent: false, intent: "gray-subtle", className: "rounded-lg", size: "md" }),
					"login-log-modal",
				);

				return tray.div([
					tray.stack(
						[
							tray.flex(
								[
									tray.div([], {
										style: { backgroundImage: `url(${icons.get("simkl_logo")})` },
										className: "w-12 h-12 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
									}),
									tray.span("SIMKL", { className: "mr-1 text-4xl font-bold" }),
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
			};

			const landing = () => {
				const ncount = notifications.unreads.get();
				const network = application.network.data.get();
				const profile = application.user.data;
				const sync_kind = sync.options.kind.get();

				const notif = notifications.modal(tray.div([
					utils.components.button({
						icon: "bell",
						size: "lg",
						...(ncount > 0 && { stroke: "#fdba74" }),
						tooltip: "Notifications",
						transparent: true,
					})],
					{ ...(ncount > 0 && { className: "animate-bounce" }) },
				)); // prettier-ignore

				const pfp = tray.tooltip(tray.a({
					href: `https://simkl.com/${profile?.account?.id}/dashboard`,
					className: "flex justify-center items-center w-10 h-10 bg-transparent hover:bg-gray-200 dark:bg-opacity-10 dark:hover:bg-opacity-20 rounded-full overflow-hidden",
					items: [tray.img({ src: profile?.user.avatar ?? icons.get("person"), width: "30", className: "rounded-full" })],
				}), { text: "Open profile in browser" }); // prettier-ignore

				const logout = tray.modal({
					trigger: utils.components.button({
						icon: "power",
						size: "lg",
						intent: "alert-subtle",
						tooltip: "Sign-out",
						transparent: true,
					}),
					title: "Sign-out of SIMKLSync",
					items: [
						tray.text("Are you sure you want to sign out of SIMKLSync?", { className: "break-normal text-pretty" }),
						tray.text("This action will revoke your token, clear your local storage (tokens, notifications, userinfo, simkl media collection) and abort active/pending manual sync.", { className: "text-[--muted] text-sm break-normal text-pretty" })
					],
					footer: [
						tray.button("Sign-out", {
							intent: "alert",
							onClick: ctx.eventHandler("sign-out", async () => {
								tabs.current.set(Tab.Logon);
								log.info("logout > logging out");
								try {
									await application.auth.revoke("access_token");
									log.success("logout > access_token has been revoked!");
								} catch (error) {
									log.warn(`logout > Failed to revoke "access_token": ${(error as Error).message}`);
								}

								notifications.clear();
								log.send("logout > Notifications cache cleared!");

								application.token.resetToken();
								log.send("logout > Removed account token!");

								application.user.reset();
								log.send("logout > Profile cache cleared!");

								application.list.clearMediaListCollection();
								log.send("logout > MediaListCollection cleared!");

								sync.abort();
								log.send("logout > Aborting pending/active manual sync");

								ctx.toast.success("Logged out of simklsync");
								log.success("logout > Logged out of simklsync");
							}),
						}),
					],
				}); // prettier-ignore

				const header = tray.flex([
					tray.stack(
						[
							tray.flex([
								tray.div([], {
									style: { backgroundImage: `url(${icons.get("simkl_logo")})` },
									className: "w-12 h-12 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
								}),
								tray.span("SIMKL", { className: "mr-1 text-4xl font-bold" }),
							]),
							tray.text("for Seanime", {
								style: { marginTop: "-1rem", paddingInlineStart: "3.5rem" },
								className: "text-sm text-[--muted]",
							}),
						],
						{ className: "flex-1", gap: 0 },
					),
					tray.flex([notif, pfp], { gap: 2, className: "items-center" }),
				]);

				const body = tray.stack([
					tray.div([
						tray.flex([
							tray.span("Welcome,", { className: "font-semibold" }),
							tray.div([tray.img({ width: "18", src: icons.get(application.user.isNameHidden ? "eye" : "eye_slash" )})], {
								className: "flex items-center cursor-pointer",
								onClick: ctx.eventHandler("toggle-privacy-name", () => application.user.toggleHideName()),
							}),
						]),
						tray.text(profile?.user.name ?? "Username", { className: "font-bold text-3xl line-clamp-1", style: { maxWidth: "25rem" } }),
					], { className: "relative rounded p-3 mb-3 bg-gray-700" }),
					tray.flex([
						tray.flex([
							log.modal(utils.components.button({
								icon: "code",
								size: "lg",
								className: "rounded-r-none",
								tooltip: "View Logs",
								style: { width: "80px" },
							}),"landing-logs-btn",
							),
							tray.modal({
								trigger: tray.div([
									utils.components.button({
										icon: "refresh",
										tooltip: "Perform Manual Sync",
										className: "rounded-none",
										style: { width: "80px" },
										size: "lg",
									}),
									(!sync.busy.get() ? [] : tray.div([], {
										className: "w-3 h-3 rounded-full bg-red-500 absolute border border-white",
										style: { top: "-0.1rem", right: "-0.25rem" },
									})),
								], { className: "relative" }),
								title: "Perform Manual Sync",
								description: "Manually sync AniList and SIMKL trackers",
								className: "max-w-2xl",
								items: [
									utils.components.select({
										heading: "Direction",
										description: "Choose which tracker to sync to and from",
										value: sync_kind,
										onChange: (v) => sync.options.kind.set(v),
										disabled: sync.busy.get(),
										options: [{
											title: "Sync to SIMKL",
											desc: "Bring your AniList entries over to SIMKL",
											icon: icons.get("simkl_logo", { fill: "#9f92ff" }),
											value: "import" as const,
										},{
											title: "Sync to AniList",
											desc: "Bring your SIMKL entries over to AniList (EXPERIMENTAL)",
											icon: icons.get("anilist", { fill: "#9f92ff" }),
											value: "export" as const,
										}]
									}),
									utils.components.select({
										heading: "Sync Type",
										description: "Choose the method of syncing",
										value: sync.options.type.get(),
										gridCols: 1,
										onChange: (v) => sync.options.type.set(v),
										options: [{
											title: "Add missing entries",
											desc: "Adds new items from source that aren't in your target list. Existing entries remain untouched.",
											icon: icons.get("plusCircleDotted", { fill: "#9f92ff"}),
											value: "patch" as const,
										},{
											title: "Update existing entries",
											desc: "Updates information for entries that exist in both trackers. Entries unique to either list are ignored.",
											icon: icons.get("arrow_r", { fill: "#9f92ff" }),
											value: "post" as const,
										},{
											title: "Mirror Source List",
											desc: "Makes target list identical to source by adding missing entries, updating existing ones, and removing extras. It is recommended to backup your target tracker first as this will permanently delete any entries not in source.",
											icon: icons.get("arrow_lr", { fill: "#9f92ff" }),
											value: "fullsync" as const,
										}]
									}),
									utils.components.groupedCheckbox({
										heading: "Misc",
										description: "Miscellaneous options",
										entries: [{
											title: "Mature Content",
											desc: "Include mature content in this sync",
											icon: icons.get("explicit", { fill: "#9f92ff" }),
											value: sync_kind === "export" ? false : sync.options.includeAdult.get(),
											disabled: sync_kind === "export",
											eventHandlerId: "sync-include-adult",
											onChange: (val) => sync.options.includeAdult.set(val),
											overwrites: { ifTrue: "Enabled", ifFalse: sync_kind === "export" ? "Unavailable" : "Disabled", }
										},{
											title: "Private Entries",
											desc: "Include private entries in this sync",
											icon: icons.get("eye_slash", { fill: "#9f92ff" }),
											value: sync_kind === "export" ? false : sync.options.includePrivate.get(),
											disabled: sync_kind === "export",
											eventHandlerId: "sync-include-private",
											onChange: (val) => sync.options.includePrivate.set(val),
											overwrites: { ifTrue: "Enabled", ifFalse: sync_kind === "export" ? "Unavailable" : "Disabled", }
										}]
									}),
									tray.button({
										label: sync.busy.get() ? "Cancel Manual Sync" : "Start Manual Sync",
										size: "lg",
										intent: sync.busy.get() ? "alert" : "success",
										loading: sync.aborted,
										onClick: ctx.eventHandler("simklsync:manage-list-start-job", () => {
											if (sync.busy.get()) {
												ctx.toast.info("Stopping manual sync...");
												sync.abort();
											} else {
												ctx.toast.info("Manual sync started");
												sync.run();
											}
										}),
									}),
								],
							}),
							application.list.modal(utils.components.button({icon: "play", tooltip: "SIMKL List", size:"lg", className: "rounded-none", style: { width: "80px" },}), "watchlist"),
							tray.modal({
								trigger: utils.components.button({ icon: "gears", tooltip: "Overrides", size:"lg", className: "rounded-l-none", style: { width: "80px" },}),
								title: "Overrides for Custom Entries (In Dev)",
								description: "Overrides allow for a one-way sync to SIMKL for custom entries."
							})
						], { gap: 0, className: "w-fit" }),
						tray.div([], { className: "flex-1" }),
						logout,
					],{ style: { gap: "0.5rem" } }),
					tray.div([
						tray.switch("Temporarily disable livesync", {
							fieldRef: sync.liveSync.disabled,
							disabled: application.auth.busy.get(),
							style: { "--color-brand-500": "255 95 95" },
						}),
						tray.switch("Include adult entries for livesync", {
							fieldRef: sync.liveSync.includeAdult,
							style: { "--color-brand-500": "255 95 95" },
							onChange: ctx.eventHandler("simklsync:include-adult", (e) => $storage.set("simklsync:options-includeAdult", e.value)),
						}),
						tray.switch("Disable badge for non-critical notifications", {
							value: notifications.suppressBadge.get(),
							style: { "--color-brand-500": "255 95 95" },
							onChange: ctx.eventHandler("simklsync:suppress-notification-badge", (e) => {
								notifications.suppressBadge.set(e.value);
								$storage.set("simklsync:options-suppressnotificationbadge", e.value);
							}),
						}),
					]),
					tray.div([], { className: "flex-1" }), // Divider
					tray.div([
						tray.text(`Connections made: ${network.success + network.failed}`),
						tray.text(`Successful connections: ${network.success} (${(network.success * 100 / (network.success + network.failed)).toFixed(2)}%)`),
						tray.p([
							tray.span("Last connection:", { className: "mr-1" }),
							tray.span(network.lastState, { className: `font-bold text-${network.modifier}-300` }),
						]),
					], { className: "text-xs text-[--muted]"}),
					tray.flex(
						([{ name: "Privacy Policy", slug: "PRIVACY" }, "separator", { name: "Terms", slug: "TERMS" }] as const).map((item) =>
							item === "separator"
								? tray.span("|")
								: tray.anchor(item.name, {
										href: `https://github.com/nnotwen/n-seanime-extensions/blob/master/plugins/SimklSync/${item.slug}.md`,
										className: "no-underline hover:underline",
									}),
						),
						{ className: "justify-center text-xs text-[--muted] mt-2" },
					),
				],
				{ style: { height: "28rem" } }); // prettier-ignore

				return tray.stack([header, body], { className: "m-2" });
			};

			return { current, [Tab.Logon]: logon, [Tab.Landing]: landing, Tab };
		})();

		// Create tray and render immediately
		const tray = ctx.newTray({ iconUrl, withContent: true, width: "30rem" });
		tray.render(() => tabs[tabs.current.get()]());

		// Tray Alert Badge States
		ctx.effect(() => {
			if (application.user.data === null)
				return tray.updateBadge({ number: 1, intent: "alert" }); // prettier-ignore

			if (sync.busy.get())
				return tray.updateBadge({ number: 1, intent: "alert" }); // prettier-ignore

			if (notifications.unreads.get() > 0 && !notifications.suppressBadge.get())
				return tray.updateBadge({ number: notifications.unreads.get(), intent: "warning" }); // prettier-ignore

			return tray.updateBadge({ number: 0 });
		}, [application.auth.busy, sync.busy, notifications.unreads, notifications.suppressBadge]);

		// Authenticate
		(() => {
			async function init() {
				log.send("init > Initializing extension...");
				log.send("init > Checking availability of access tokens...");

				try {
					const token = await application.token.getToken();
					if (!token) throw new Error("Missing token. Please authenticate this app by opening the tray.");

					let profile = await application.user.fetch().catch((err: Error) => {
						log.error(`init > Failed to get the user info: ${err.message}. Retrying [1/3]`);
						return null;
					});

					if (!profile) {
						for (let i = 1; i <= 3 && !profile; i++) {
							profile = await application.user.fetch().catch(async (err: Error) => {
								await utils.wait(2_000);
								log.error(`init > Failed to get the user info: ${err.message}. Retrying [${i}/3]`);
								return null;
							});
						}
						if (!profile) {
							throw new Error("Failed to get the user info after 3 retries. Some parts may not work as intended. Please reauthenticate this app.");
						}
					}
					log.success(`init > Successfully logged in! Welcome {{USERNAME}}`);
				} catch (error) {
					log.error(`init > Unable to authenticate the access token: ${(error as Error).message}`);
					throw new Error("USER_AUTH_FAILED");
				}
			}

			application.auth.busy.set(true);
			init()
				.then(() => tabs.current.set(tabs.Tab.Landing))
				.catch(() => tray.updateBadge({ number: 1, intent: "alert" }))
				.finally(() => application.auth.busy.set(false));
		})();
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

	$app.onPostDeleteEntry((e) => {
		$store.set("POST_DELETE_ENTRY", $clone(e));
		e.next();
	});
}
