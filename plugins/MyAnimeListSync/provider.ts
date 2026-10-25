/**
 * myanimelistsync
 * Copyright (c) 2026 nnotwen
 * SPDX-License-Identifier: MIT
 */

/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./myanimelistsync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://raw.githubusercontent.com/nnotwen/n-seanime-extensions/refs/heads/master/plugins/MyAnimeListSync/icon.png";

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
				myanimelist: /*html*/ ` <svg width="1rem" height="1rem" fill="#cacaca" viewBox="200 350 600 240" xmlns="http://www.w3.org/2000/svg"> <path d="M432.49 410.61V590.3l-44.86-.06V479l-43.31 51.29-42.43-52.44-.43 112.75H256V410.65h47l39.79 54.29 43-54.31zm184.06 44.14.53 135.15h-50.45l-.17-61.25h-59.73c1.49 10.65 4.48 27 8.9 38 3.31 8.13 6.36 16 12.44 24.06l-36.37 24c-7.45-13.57-13.27-28.52-18.73-44.42a198.3 198.3 0 0 1-10.82-46.49c-1.81-16-2.07-31.38 2.28-47.19a83.37 83.37 0 0 1 24.77-39.81c6.68-6.25 16-10.67 23.47-14.66s15.85-5.63 23.62-7.66a158 158 0 0 1 25.41-3.9c8.49-.73 23.62-1.41 51-.6l11.63 37.31h-58.78c-12.65.17-18.73 0-28.61 4.46a47.7 47.7 0 0 0-27.26 41l56.81.7.81-38.61h49.26zM701.72 410v141.35L768 552l-9.17 37.87H656.28V409.33z"/> </svg>`,
				myanimelist_logo: /*html*/ ` <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="477.333" fill="#cacaca" height="85.333" viewBox="0 0 358 64"> <path d="M163 6.5V12h13.1l-.3-5.3-.3-5.2-6.2-.3-6.3-.3zm-65.7-2C86.3 10 80.5 24.4 83 40.2 84 47 88.2 58 89.7 58c.4 0 2.9-1.6 5.5-3.5l4.7-3.5-1.4-3.4c-.8-1.9-1.9-5.3-2.4-7.5l-.9-4.1H108v14h13V16h-13v9h-5c-2.7 0-5-.3-5-.8 0-1.6 4-7.1 6-8.2 1.2-.7 5.5-1.4 9.6-1.7l7.4-.6V2h-9.3c-8 0-10 .4-14.4 2.5M295 7v5h12V2h-12zM0 27v23h13V23.5l4 6c2.2 3.3 4.4 6 5 6s2.8-2.7 5.1-6l4.1-6-.5 13.2-.4 13.3H43V4H30.2l-3.8 6c-2.2 3.3-4.2 6-4.5 6s-2.3-2.7-4.3-6l-3.7-6H0zm263 0v23h26.8l.6-3.8c.4-2 .9-4.5 1.2-5.5.5-1.5-.3-1.7-7.5-1.7H276V4h-13zm80.8-19.7c-3.3 1.3-4.8 2.5-4.8 3.8 0 1.2-.7 1.9-2 1.9-1.8 0-2 .7-2 6s.2 6 2 6c1.9 0 2 .7 2 10.8 0 13.1.7 14.2 9.1 14.2 5.3 0 5.6-.1 7.2-3.5 2.2-4.6 2.2-4.3-1.5-4.7l-3.3-.3-.3-8.3-.3-8.2h6.1V13h-3.4c-3.3 0-3.5-.2-3.8-3.8l-.3-3.9zM45 14.8c0 .5 3.1 8.2 7 17.2l6.9 16.3-2.9 7.1c-1.7 3.9-3 7.4-3 7.8 0 .5 2.8.8 6.3.8h6.3l7.7-23.9c4.2-13.2 7.7-24.4 7.7-25 0-.7-2.5-1.1-6.3-1.1h-6.2l-2.1 7.7-2.1 7.8-2.3-7.8-2.3-7.7h-7.4c-4 0-7.3.4-7.3.8m195.5.6c-8.1 3-12.2 12-9.6 21.4 2.4 8.9 8.4 13.2 18.7 13.2 5.8 0 5.9-.1 8.2-4l2.3-4h-10.2l3.9-4.7c6.8-8.2 7.7-15.6 2.7-20.3-3.1-2.9-10.4-3.6-16-1.6m8.5 10.9c0 .7-1.3 2.6-2.9 4.1-4.3 4.1-7 1.7-3.5-3.2 1.6-2.4 6.4-3.1 6.4-.9M137.3 15.8l-10.3.3V51h12V37.4c0-13.5 0-13.5 2.3-13.2 2.1.3 2.2.7 2.5 13l.3 12.8h3.3c1.8 0 4.8.3 6.5.6l3.1.6V35.3c0-20.7.6-20.1-19.7-19.5m62.6 0-18.6.2-.6 16.8c-.3 9.2-.4 16.7-.4 16.8.1.1 2.6.4 5.5.7l5.2.6V24h8v13.6c0 12 .2 13.5 1.6 13 .9-.3 3.1-.6 5-.6h3.4V24h8.2l-.3 13-.4 13h11.7l-.4-15c-.3-13.4-.5-15.1-2.3-16.9-2.7-2.5-4.1-2.6-25.6-2.3M163 33.5V51h12V16h-12zm132-.5v17h12V16h-12zm17.2-15.4c-3.8 2.6-3 8.1 2.3 15.3 2.5 3.4 4.5 6.6 4.5 7.1 0 .6-1.8 1-4 1s-4 .3-4 .7.8 2.7 1.8 5.1l1.7 4.4 7.3-.5c13.8-1 15.6-5.3 7.3-18-2.7-4.1-4.7-7.8-4.4-8.1.4-.3 2.4-.6 4.5-.6 4.3 0 4.3.1 2.4-4.5l-1.5-3.5h-7.8c-5.5 0-8.5.5-10.1 1.6"/> </svg>`,
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
						let a = h >= 12 ? "PM" : "AM";
						return `${h % 12 || 12}:${m} ${a}`;
					},
					time = p(d.getHours(), d.getMinutes().toString().padStart(2, "0"));
				return c === n ? `Today at ${time}` :
					c === n - 864e5 ? `Yesterday at ${time}` :
					`${d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })} ${time}`;
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
			const id = "mal:c6d44b38-f7b6-4785-92fd-a30a8fef71b3";
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

			const clear = () => { $store.set(id, []); send("Log Cleared!"); };

			const modal = (trigger: any, id: string = utils.generateRandomUUID()) =>
				tray.modal({
					trigger,
					title: "MyAnimeListSync Logs",
					className: "max-w-5xl",
					onOpenChange: ctx.eventHandler(id, ({ open }) => modalOpened.set(open)),
					items: [
						tray.flex([
							tray.button("Copy to Clipboard", {
								intent: "white", size: "md", className: "w-fit",
								onClick: ctx.eventHandler("modal:logs:clipboard:copy", () => {
									ctx.dom.clipboard.write(
										log.entries()?.map(([message]) => message.replace(/{{USERNAME}}/gi, application.user.isNameHidden ? "*****" : (application.user.data?.name ?? ""))).join("\n") ?? "",
									);
									ctx.toast.success("Copied logs to clipboard!");
								}),
							}),
							tray.button("Clear logs", {
								intent: "alert-subtle", size: "md", className: "w-fit",
								onClick: ctx.eventHandler("modal:logs:clipboard:clear", () => {
									log.clear();
									tray.update();
									ctx.toast.success("Cleared logs!");
								}),
							}),
						]),
						!modalOpened.get()
							? tray.flex([tray.img({ src: icons.get("spinner"), width: "50", className: "animate-spin" })], { className: "w-full justify-center items-center", style: { height: "5rem" } })
							: tray.div([tray.div(
								log.entries().map(([message, type], idx) => {
									const className: Record<"Info" | "Warning" | "Error" | "Log" | "Success", string> = {
										Info: "text-blue-200 bg-gray-",
										Warning: "text-orange-500 bg-gray-",
										Error: "text-white bg-red-",
										Log: "text-[--muted] bg-gray-",
										Success: "text-green-200 bg-gray-",
									};
									return tray.text(message.replace(/{{USERNAME}}/gi, application.user.isNameHidden ? "*****" : (application.user.data?.name ?? "")), {
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

		const PKCE = (() => {
			const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
			const base64UrlEncode = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
			const generateCodeVerifier = () => Array.from({ length: 86 }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join("");
			const generatePair = () => {
				const verifier = generateCodeVerifier();
				return { verifier, challenge: base64UrlEncode(new Uint8Array(verifier.length).fill(0)) };
			};
			return { generatePair };
		})(); // prettier-ignore

		const application = (() => {
			const name = "seanime-myanimelist-sync";
			const version = "3.0.0";
			const clientId = "204cc9247a57a5750a93787a6fbef485";
			const redirectUri = "https://nnotwen.github.io/n-seanime-extensions/plugins/MyAnimeListSync/callback.html";
			const baseUri = "https://api.myanimelist.net/v2/";

			// NETWORK
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

			// AUTH
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
						response_type: "code",
						client_id: clientId,
						redirect_uri: redirectUri,
						code_challenge: pair.verifier, // plain challenge == verifier
						code_challenge_method: "plain",
						state: $store.get<string>(STATE_KEY),
					};
					const url = new URL("https://myanimelist.net/v1/oauth2/authorize");
					for (const [field, value] of Object.entries(fields)) url.searchParams.set(field, value);
					return url.toString();
				};

				const exchangeCode = async (code: string) => {
					const pair = $store.get<ReturnType<typeof PKCE.generatePair>>(PAIR_KEY);
					if (!pair) throw new Error("PKCE pair missing!");

					busy.set(true);
					const res = await ctx.fetch("https://myanimelist.net/v1/oauth2/token", {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
                            code,
                            client_id: clientId,
                            redirect_uri: redirectUri,
                            grant_type: "authorization_code",
                            code_verifier: pair.verifier,
                        }).toString(),
					}).finally(() => busy.set(false));

					const { expires_in, ...data } = handle<$malsync.RequestAccessTokenResponse>(res);
					const expires_at = expires_in * 1000 + Date.now();
					$store.set("store@token", { ...data, expires_in, expires_at });
					$storage.set("storage@token", { ...data, expires_in, expires_at });
					return { ...data, expires_in, expires_at };
				};

				// MAL has no revoke endpoint
				const revoke = async (_: "access_token" | "refresh_token") => {
					log.info("logout > MAL does not expose a revoke endpoint; clearing local tokens.");
				};

				return { generateURL, exchangeCode, revoke, busy };
			})();

			// TOKEN
			const Token = (() => {
				$store.set("store@token", $storage.get("storage@token") ?? null);

				const refreshToken = async () => {
					const token = $store.get<Awaited<ReturnType<typeof Auth.exchangeCode>> | null>("store@token");
					if (!token || !token.refresh_token.length) throw new Error("Missing refresh_token. Please login again!");

					const res = await ctx.fetch("https://myanimelist.net/v1/oauth2/token", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ grant_type: "refresh_token", client_id: clientId, refresh_token: token.refresh_token }),
					});

					const { expires_in, ...data } = handle<$malsync.RequestAccessTokenResponse>(res);
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
				return { getToken, refreshToken, resetToken, get cached_token() { return $store.get<Awaited<ReturnType<typeof Auth.exchangeCode>> | null>("store@token") } };
			})();

			// USER
			const User = (() => {
				const hidename = ctx.state<boolean>(false);
				const data = ctx.state<$malsync.User | null>(null);
				return {
					get data() {
						const $data = data.get();
						return hidename.get() && $data ? { ...$data, name: "*****" } : $data;
					},
					toggleHideName() { return hidename.set(!hidename.get()); },
					get isNameHidden() { return hidename.get(); },
					reset: () => data.set(null),
					fetch: async () => {
						const res = await _fetch<$malsync.User>("/users/@me");
						data.set(res);
						return res;
					},
				};
			})();

			// AUTHENTICATED FETCH
			const _fetch = async <T,>(endpoint: string, init: RequestInit = {}) => {
				const url = new URL(baseUri + endpoint.replace(/^\/+/, ""));
				const token = await Token.getToken();
				if (!token) throw new Error("Token not found!");

				const res = await ctx.fetch(url.toString(), {
					...init,
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
						...(init.headers as Record<string, string>),
					},
				} as FetchOptions);

				return handle<T>(res);
			};

			// LIST
			const List = (() => {
				const id = "ead67d68-2313-4fd7-9059-03073be5f5d8";
				const fetchingByType = { ANIME: ctx.state<boolean>(false), MANGA: ctx.state<boolean>(false) };

				const sortOpts = [
					{ label: "Default", value: "default" },
					{ label: "Title (A–Z)", value: "title_asc" },
					{ label: "Title (Z–A)", value: "title_desc" },
					{ label: "Recently Updated", value: "last_updated_desc" },
					{ label: "Progress", value: "progress_desc" },
					{ label: "Score", value: "rating_desc" },
				] as const;

				const listStatusOpts = (type: "ANIME" | "MANGA") => {
					const base = [
						{ label: "Completed", value: "completed" },
						{ label: "Paused", value: "on_hold" },
						{ label: "Dropped", value: "dropped" },
						{ label: "All status", value: "default" },
					];
					return type === "ANIME"
						? [{ label: "Watching", value: "watching" }, { label: "Plan to watch", value: "plan_to_watch" }, ...base]
						: [{ label: "Reading", value: "reading" }, { label: "Plan to read", value: "plan_to_read" }, ...base];
				};

				const patch = <T extends $app.AL_MediaType>(type: T, malId: number, body: T extends "ANIME" ? $malsync.ListUpdateAnimeBody : $malsync.ListUpdateMangaBody) =>  
					_fetch<T extends "ANIME" ? $malsync.AnimeListEntry : $malsync.MangaListEntry>(`${type.toLowerCase()}/${malId}/my_list_status`, {
						method: "PATCH",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)])),
					});

				const del = async (type: $app.AL_MediaType, malId: number) => ctx.fetch(`${baseUri}${type.toLowerCase()}/${malId}/my_list_status`, {
						method: "DELETE",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${await Token.getToken()}`,
                        },
					}).then(res => {
						const bool = res.ok || (res.status === 200);
						Network[bool ? "ok" : "err"](res.statusText);
                        if (![200, 404].includes(res.status)) throw new Error(res.statusText);
						return bool;
					});

				const fetchAll = <T extends $app.AL_MediaType>(type: T, skipCache: boolean = false, throttleMs: number = 2_000) => ctx.jobs.singleflight(`list@fetchAll:${type}`, async () => {
					const startedAt = Date.now(), cached = $storage.get<{ last_sync: number | null, data: ((T extends "ANIME" ? $malsync.AnimeListEntryWrapper : $malsync.MangaListEntryWrapper) & { idMal: number })[]}>(`${id}:${type}`) ?? { last_sync: null, data: [] }; // prettier-ignore
					if (!skipCache && cached.last_sync && (cached.last_sync + 60 * 60 * 1000 > Date.now())) {
                        log.info(`[${type}List] cache HIT (${cached.data.length} entries, age=${Math.round((Date.now() - cached.last_sync) / 1000)}s)`);
                        return cached.data;
                    }

                    log.info(`[${type}List] cache MISS (skipCache=${skipCache}, last_sync=${cached.last_sync ? new Date(cached.last_sync).toISOString() : "never"})`);					
					const fetching = fetchingByType[type];
                    try {
						let page = 1, path: string | null = `users/@me/${type.toLowerCase()}list?fields=list_status{comments,num_times_rewatched,num_times_reread},media_type,num_episodes,num_chapters,num_volumes&nsfw=true&limit=1000`; // prettier-ignore
						const all: ((T extends "ANIME" ? $malsync.AnimeListEntryWrapper : $malsync.MangaListEntryWrapper) & { idMal: number })[] = [];

						fetching.set(true);
						while (path) {
                            log.info(`[${type}List] fetching page ${page} (offset=${all.length})`);
							const res = await _fetch<{ data: (T extends "ANIME" ? $malsync.AnimeListEntryWrapper : $malsync.MangaListEntryWrapper)[] | null, paging?: { next?: string }}>(path); // prettier-ignore
							if (!res.data) throw new Error("Invalid MAL response: missing data");

							all.push(...res.data.map(d => ({ idMal: d.node.id, ...d })));

                            log.send(`[${type}List] page ${page} → ${res.data.length} entries (total=${all.length}, has_next=${!!res.paging?.next})`);

							path = (res.paging?.next?.replace(baseUri, "") ?? null) as string | null;
							if (path) {
                                page++;
                                await utils.wait(throttleMs);
                            }
						}
						$storage.set(`${id}:${type}`, { last_sync: Date.now(), data: all });
                        log.success(`[${type}List] fetched ${all.length} entries in ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);
						return all;
					}  catch (err) {
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
							try { err = res.json<$malsync.AnilistError>(); } catch { err = null; }
							throw new Error(err?.errors?.map((m) => m.message).join(" ") ?? res.statusText);
						}
						const json = res.json<{ data: { Page: { media: { id: number, idMal: number | null, title: { userPreferred?: string }}[]}}} | $malsync.AnilistError>();
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
					const selectedSort = ctx.state<(typeof sortOpts)[number]["value"]>("default");
					const selectedListStatus = ctx.state<string>("default");

					const formatEntry = (entry: $malsync.AnimeListEntryWrapper | $malsync.MangaListEntryWrapper, idx: number) => {
                        const episodeLabel = type === "ANIME"
							? `${(entry as $malsync.AnimeListEntryWrapper).list_status.num_episodes_watched} / ${(entry as $malsync.AnimeListEntryWrapper).node.num_episodes ?? "--"}`
							: `${(entry as $malsync.MangaListEntryWrapper).list_status.num_chapters_read} / ${(entry as $malsync.MangaListEntryWrapper).node.num_chapters ?? "--"}`;
						const totalKey = type === "ANIME" ? "Episodes" : "Chapters";

						return tray.div([
							tray.img({ src: entry.node.main_picture?.large ?? "", width: "100", className: "shrink-0 object-cover group-hover:opacity-50 group-hover:scale-105 transition-all duration-200" }),
							tray.div([
								tray.flex([tray.text(entry.node.title ?? "", { className: "font-semibold w-full line-clamp-2 break-normal text-pretty" })]),
								tray.div([
									tray.div([tray.text("Type", { className: "text-xs text-[--muted] font-semibold" }), tray.text(entry.node.media_type?.toUpperCase() ?? "--")]),
									tray.div([tray.text(totalKey, { className: "text-xs text-[--muted] font-semibold" }), tray.text(episodeLabel)]),
									tray.div([tray.text("Status", { className: "text-xs text-[--muted] font-semibold" }), tray.text(utils.pretty(entry.list_status.status ?? ""))]),
									tray.div([tray.text("Score", { className: "text-xs text-[--muted] font-semibold" }), tray.text(entry.list_status.score?.toString() ?? "--")]),
									tray.div([tray.text("Updated", { className: "text-xs text-[--muted] font-semibold" }), tray.text(entry.list_status.updated_at ? new Date(entry.list_status.updated_at).toLocaleDateString() : "")]),
								], { className: "grid grid-cols-3 gap-2 text-xs" }),
							], { className: "space-y-3 p-2 w-full bg-gray-950" }),
						], {
							className: "group flex border rounded-2xl overflow-hidden cursor-pointer",
							style: { gap: "0rem", flexDirection: "row" },
						});
					};

					const modal = (trigger: any, eventId?: string) => {
						const { last_sync, data } = $storage.get<{ last_sync: number | null, data: (( $malsync.AnimeListEntryWrapper | $malsync.MangaListEntryWrapper) & { idMal: number })[]}>(`${id}:${type}`) ?? { last_sync: null, data: [] };
						const pre = [...data]
							.sort((a, b) => {
								switch (selectedSort.get()) {
									case "title_asc": return a.node.title.localeCompare(b.node.title);
									case "title_desc": return b.node.title.localeCompare(a.node.title);
									case "last_updated_desc": return (b.list_status.updated_at ?? "").localeCompare(a.list_status.updated_at ?? "");
									case "progress_desc": return type === "ANIME"
										? (a as $malsync.AnimeListEntryWrapper).list_status.num_episodes_watched - (b as $malsync.AnimeListEntryWrapper).list_status.num_episodes_watched
										: (a as $malsync.MangaListEntryWrapper).list_status.num_chapters_read - (b as $malsync.MangaListEntryWrapper).list_status.num_chapters_read;
									case "rating_desc": return (b.list_status.score ?? 0) - (a.list_status.score ?? 0);
									default: return 0;
								}
							})
							.filter((a) => {
								if (!a.node.title.toLowerCase().includes(searchQuery.get().toLowerCase())) return false;
								const ls = selectedListStatus.get();
								if (ls !== "default" && ls !== a.list_status.status) return false;
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
							utils.components.button({ icon: "caret_left_fill", tooltip: "Prev", size: "sm", transparent: true, disabled: curIdx === 0, onClick: ctx.eventHandler(`${type}:page:left`, () => step(-1)) }),
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
							utils.components.button({ icon: "caret_right_fill", tooltip: "Next", size: "sm", transparent: true, disabled: curIdx >= paginated.length - 1, onClick: ctx.eventHandler(`${type}:page:right`, () => step(+1)) }),
						], { className: "w-fit p-2 rounded-full border" });

						const advanced_search = tray.flex([
							tray.div([
								tray.div([tray.input({
									placeholder: "Search",
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
										onChange: ctx.eventHandler(`${type}:status`, ({ value }: { value: ReturnType<typeof listStatusOpts>[number]["value"]}) => selectedListStatus.set(value)),
										options: listStatusOpts(type),
									}),
								], { className: "grid grid-cols-4 gap-2" }),
							], { className: "w-full space-y-2" }),
							utils.components.button({
								icon: "refresh", stroke: "#000", tooltip: "Refresh List",
								className: "rounded-xl", intent: "white", size: "lg",
								loading: fetchingByType[type].get() || !isModalOpen.get(),
								onClick: ctx.eventHandler(`${type}:refresh`, () => fetchAll(type, true)
									.then(() => ctx.jobs.debounce(`${type}:refresh-deb`, () => ctx.toast.success("Fetched MyAnimeList MediaList!"), 500))
									.catch((err: Error) => ctx.toast.error(err.message))),
							}),
						], { className: "border px-2 py-3 rounded-2xl bg-gray-900 w-full" });

						return tray.modal({
							trigger,
							title: `MyAnimeList MediaList (${type})`,
							description: `Last Sync: ${last_sync ? utils.formatTimestamp(new Date(last_sync).getTime()) : "Unknown"}`,
							className: "max-w-5xl",
							items: [
								tray.div([
									styles,
									advanced_search,
									(fetchingByType[type].get() || !isModalOpen.get())
										? [tray.flex([tray.img({ src: icons.get("spinner"), width: "50", className: "animate-spin" })], { className: "w-full justify-center items-center", style: { height: "25rem" } })]
										: [
											tray.div(paginated[curIdx] ?? [], { className: "grid grid-cols-2 gap-3" }),
											tray.text("Your list is empty", {
												className: "text-center p-5 text-xl font-semibold text-[--muted] border rounded-lg",
												style: { display: paginated[curIdx]?.length ? "none" : "block" },
											}),
										],
								], { className: "space-y-2" }),
							],
							footer: fetchingByType[type].get() || !isModalOpen.get() ? [] : [tray.flex([pages], { className: "justify-center w-full" })],
							onOpenChange: ctx.eventHandler(`${type}-list-modal`, ({ open }: { open: boolean }) => {
								isModalOpen.set(open);
								if (open && !data.length && !fetchingByType[type].get()) {
									fetchAll(type).catch((err) => log.error(`[${type}List]: ${err.message}`));
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

				return {
					patch, delete: del, fetchAll, mapMalIdstoALIds, clearCache,
					anime, manga,
				};
			})();

			return {
				network: Network as Omit<typeof Network, "ok" | "err">,
				token: Token,
				auth: Auth,
				user: User,
				list: List,
			};
		})(); // prettier-ignore

		const notifications = (() => {
			const id = "28bd743e-203a-4fee-abc6-c432d6285e54";
			const modalOpened = ctx.state<boolean>(false);
			const currentPageIndex = ctx.state<number>(0);
			const suppressBadge = ctx.state<boolean>($storage.get<boolean | undefined>("malsync:options-suppressnotificationbadge") ?? false);

			const entries = () => $storage.get<$malsync.NotificationV2[]>(id) ?? [];

			const add = (data: Omit<$malsync.NotificationV2, "timestamp" | "unread">) => {
				$storage.set(id, [...entries(), { ...data, timestamp: Date.now(), unread: true }]);
				unreads.set(entries().filter((x) => x.unread).length);
			};

			const clear = () => { unreads.set(0); $storage.set(id, []); };

			const formatEntry = (n:  $malsync.NotificationV2, idx: number, arr: $malsync.NotificationV2[]) => {
				const unreadBorder = n.unread ? [
					tray.div([], { className: "w-3 h-3 rounded-full bg-red-500 absolute border border-white", style: { right: "-0.25rem", top: "-0.1rem" } }),
					tray.div([], { className: "absolute z-[0] left-0 top-0 h-full w-full bg-gradient-to-r to-gray-900 max-w-[50%] from-yellow-900/10" }),
				] : [];

				const thumbnail = tray.div([tray.img({ src: n.thumbnail ?? "", width: "70", className: "rounded-lg" })], { className: "relative shrink-0" });
				const title = tray.text(n.title, { className: "w-full font-bold mb-2 break-normal line-clamp-2" });
				const desc = n.description ? tray.text(n.description, { className: "w-full break-normal text-sm text-[--muted] pb-2" }) : [];
				const timestamp = tray.text(utils.formatTimestamp(n.timestamp), { className: "w-full break-normal text-xs text-[--muted] mt-2" });
				const fields = tray.div((n.fields ?? []).map((f) => tray.div([
					tray.text(f.name, { className: "text-xs text-[--muted]" }),
					tray.text(f.value, { className: "font-semibold" }),
				])), { className: "grid grid-cols-3 gap-2 text-sm" });

				const markRead = utils.components.button({
					icon: "check2all", tooltip: "Mark as Read", intent: "success-subtle", transparent: true,
					style: { width: "2.5rem", height: "2.5rem" },
					onClick: ctx.eventHandler(`notification-entry-${idx}`, () => {
						arr[idx].unread = false;
						$storage.set(id, [...arr].reverse());
						unreads.set(entries().filter((e) => e.unread).length);
					}),
				});

				const deleteEntry = utils.components.button({
					icon: "delete", tooltip: "Delete", intent: "alert-subtle", transparent: true,
					style: { width: "2.5rem", height: "2.5rem" },
					onClick: ctx.eventHandler(utils.generateRandomUUID(), () => {
						$storage.set(id, arr.toSpliced(idx, 1).reverse());
						unreads.set(entries().filter((e) => e.unread).length);
					}),
				});

				const actionbtns = tray.stack([n.unread ? markRead : [], deleteEntry], { className: "group-hover:visible" });

				return tray.div([
					unreadBorder,
					tray.flex([thumbnail, tray.div([title, desc, fields, timestamp], { className: "relative flex-1" }), actionbtns], { gap: 3 }),
				], {
					className: `relative group p-2 rounded-lg cursor-pointer border bg-gray-900${n.unread ? " border-yellow-400/10" : "/70"}`,
					style: { borderLeftWidth: "0.5rem", ...(n.accentColor && { borderLeftColor: n.accentColor }) },
				});
			};

			const modal = (trigger: any, eventId?: string) => {
				const paginated = utils.chunk(entries().reverse().map(formatEntry), 15);
				const curIdx = Math.max(0, Math.min(currentPageIndex.get(), paginated.length - 1));

				const btnAllRead = tray.button("Mark all as Read", {
					intent: "gray-subtle", size: "md", className: "w-fit bg-transparent border",
					style: { borderColor: "var(--border)" },
					disabled: unreads.get() <= 0,
					onClick: ctx.eventHandler(eventId ?? utils.generateRandomUUID(), () => {
						$storage.set(id, entries().map((e) => ({ ...e, unread: false })));
						unreads.set(0);
					}),
				});

				const btnAllDelete = tray.button("Delete all", {
					intent: "alert-subtle", size: "md", className: "w-fit",
					disabled: !entries().length,
					onClick: ctx.eventHandler(utils.generateRandomUUID(), () => { $storage.set(id, []); unreads.set(0); }),
				});

				const styles = tray.css(`
					.group .group-hover\\:visible { visibility: hidden; opacity: 0; transition: visibility 0.2s, opacity 0.2s; }
					.group:hover .group-hover\\:visible { visibility: visible; opacity: 1; }
				`);

				const step = (delta: number) => currentPageIndex.set(Math.min(Math.max(curIdx + delta, 0), Math.max(paginated.length, 1) - 1));
				const pages = tray.flex([
					utils.components.button({ icon: "caret_left_fill", tooltip: "Prev", size: "sm", transparent: true, disabled: curIdx === 0, onClick: ctx.eventHandler("notify:page:left", () => step(-1)) }),
					utils.pageRange(curIdx, paginated.length, 5).map((e) => {
						if (e === "...") return tray.span("...");
						return tray.button(`${e + 1}`, {
							intent: e === curIdx ? "primary" : "gray-subtle",
							disabled: e === curIdx, size: "sm",
							className: `rounded-full ${e !== curIdx ? "bg-transparent" : ""}`.trim(),
							onClick: ctx.eventHandler(`notify:page:${e}`, () => { if (e !== curIdx) currentPageIndex.set(e); }),
						});
					}),
					utils.components.button({ icon: "caret_right_fill", tooltip: "Next", size: "sm", transparent: true, disabled: curIdx >= paginated.length - 1, onClick: ctx.eventHandler("notify:page:right", () => step(+1)) }),
				], { className: "w-fit p-2 rounded-full border" });

				return tray.modal({
					trigger,
					title: "MyAnimeListSync Notifications",
					className: "max-w-xl",
					items: [
						tray.flex([btnAllRead, btnAllDelete]),
						!modalOpened.get()
							? [tray.flex([tray.img({ src: icons.get("spinner"), width: "50", className: "animate-spin" })], { className: "w-full justify-center items-center", style: { height: "25rem" } })]
							: tray.div([
								styles,
								paginated[curIdx] ?? [],
								tray.text("No Notifications", {
									className: "text-center p-5 text-xl font-semibold text-[--muted] border rounded-lg",
									style: { display: paginated[curIdx]?.length ? "none" : "block" },
								}),
							], { className: "space-y-2" }),
					],
					footer: !modalOpened.get() ? [] : [tray.flex([pages], { className: "justify-center w-full" })],
					onOpenChange: ctx.eventHandler("malsync-notification-modal", ({ open }: { open: boolean }) => {
						modalOpened.set(open);
						if (!open) currentPageIndex.set(0);
					}),
				});
			};

			const unreads = ctx.state<number>((entries()?.filter((n) => n.unread) ?? []).length);
			return { unreads, entries, add, modal, clear, suppressBadge };
		})(); // prettier-ignore

		const sync = (() => {
			const includeAdult = ctx.state<boolean>(false);
			const includePrivate = ctx.state<boolean>(false);
			const busy = ctx.state<boolean>(false);
			const mediaType = ctx.state<"ANIME" | "MANGA">("ANIME");
			const type = ctx.state<"patch" | "post" | "fullsync">("patch");
			const kind = ctx.state<"import" | "export">("import");
			const aborted = ctx.state<boolean>(false);
			const disableLiveSync = ctx.fieldRef<boolean>(false);
			const skipAdultLiveSync = ctx.fieldRef<boolean>($storage.get("malsync:options-skipAdult")?.valueOf() ?? false);

			const isCustom = (mediaId: number) => (mediaId ?? 0) >= 2 ** 31;

			const run = (afn: () => Promise<void>) => {
				if (busy.get()) throw new Error(`A sync is already running!`);
				busy.set(true);
				aborted.set(false);
				afn()
					.then(() => log.send(`synclist > Operation finished successfully.`))
					.catch((err: Error) => {
						log.error(`synclist > ${err.message}`);
						notifications.add({ title: "Manual Sync Error", description: err.message, accentColor: "#ef5350", thumbnail: icons.get("gears") });
					})
					.finally(() => {
						busy.set(false);
						aborted.set(false);
					});
			};

			const statusToAL = <T extends $app.AL_MediaType>(mt: T, status?: T extends "ANIME" ? $malsync.ListStatusAnime : $malsync.ListStatusManga) => {
				const STATUS_TO_AL: Record<$app.AL_MediaType, Record<string, $app.AL_MediaListStatus>> = {
					ANIME: {
						completed: "COMPLETED",
						dropped: "DROPPED",
						on_hold: "PAUSED",
						watching: "CURRENT",
						plan_to_watch: "PLANNING",
					},
					MANGA: {
						completed: "COMPLETED",
						dropped: "DROPPED",
						on_hold: "PAUSED",
						reading: "CURRENT",
						plan_to_read: "PLANNING",
					},
				};

				if (!status) return undefined;
				const map = STATUS_TO_AL[mt];
				return (map as Record<string, $app.AL_MediaListStatus>)[status];
			};

			const statusToMAL = <T extends "ANIME" | "MANGA">(mt: T, status?: $app.AL_MediaListStatus) => {
				if (!status) return status;
				switch (status) {
					case "COMPLETED":
						return "completed";
					case "DROPPED":
						return "dropped";
					case "PAUSED":
						return "on_hold";
					case "CURRENT":
						return (mt === "ANIME" ? "watching" : "reading") as T extends "ANIME" ? "watching" : "reading";
					case "PLANNING":
						return (mt === "ANIME" ? "plan_to_watch" : "plan_to_read") as T extends "ANIME" ? "plan_to_watch" : "plan_to_read";
					case "REPEATING":
						return (mt === "ANIME" ? "watching" : "reading") as T extends "ANIME" ? "watching" : "reading";
				}
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
				const mt = mediaType.get(),
					t = type.get(),
					k = kind.get(),
					a = includeAdult.get(),
					p = includePrivate.get();
				const counts = { candidates: 0, updated: 0, no_delta: 0, no_idMal: 0, excluded_by_status: 0, errored: 0, deleted: 0, delete_candidates: 0 };
				log.send(`synclist > Performing Manual Sync | mediaType="${mt}" type="${t}" kind="${k}" includeAdult="${a}" includePrivate="${p}"`);

				const forFullSyncDeletion: number[] = [];
				const validate = <T extends "ANIME" | "MANGA">(T2: T, listEntries: ReturnType<typeof getAnilistEntries>) => {
					if (!a) {
						const [nonAdults, adults] = utils.partition(listEntries, (l) => !utils.unwrap(l.isAdult));
						if (t === "fullsync") forFullSyncDeletion.push(...adults.map((e) => Number(e.idMal)).filter(Number.isFinite));
						listEntries = nonAdults;
						log.send(`synclist > [${T2}] Pruned [${adults.length}] adult entries`);
					}
					if (!p) {
						const [nonPriv, priv] = utils.partition(listEntries, (l) => !utils.unwrap(l.private));
						if (t === "fullsync") forFullSyncDeletion.push(...priv.map((e) => Number(e.idMal)).filter(Number.isFinite));
						listEntries = nonPriv;
						log.send(`synclist > [${T2}] Pruned [${priv.length}] private entries`);
					}
					const [nonCustom, custom] = utils.partition(listEntries, (l) => !isCustom(l.mediaId || 0));
					if (custom.length) log.send(`synclist > [${T2}] Pruned [${custom.length}] custom entries`);
					return nonCustom;
				};

				log.send("synclist > Scanning List...");
				const entries = getAnilistEntries(mt);
				log.info(`synclist > Found ${entries.length} entries!`);

				if (aborted.get()) throw new Error("Operation aborted by <User>");
				const malEntries = await application.list.fetchAll(mt);
				log.success(`synclist > Fetched ${malEntries.length} MyAnimeList entries!`);

				const listInclude = (mal: Awaited<ReturnType<typeof application.list.fetchAll>>, anilist: typeof entries) => {
					const malSet = new Set(mal.map((x) => Number(x.idMal)).filter(Number.isFinite));
					log.send(`synclist > [${mt}] listInclude malSet=${malSet.size} anilist=${anilist.length} t=${t}`);

					switch (t) {
						case "patch":
							return new Set(
								anilist
									.filter((x) => Number.isFinite(Number(x.idMal)) && !malSet.has(Number(x.idMal)))
									.map((x) => Number(x.mediaId))
									.filter(Number.isFinite),
							);
						case "post":
							return new Set(
								anilist
									.filter((x) => Number.isFinite(Number(x.idMal)) && malSet.has(Number(x.idMal)))
									.map((x) => Number(x.mediaId))
									.filter(Number.isFinite),
							);
						default:
							return new Set(anilist.map((x) => Number(x.mediaId)).filter(Number.isFinite));
					}
				};

				const included = listInclude(malEntries, entries);
				for (const entry of validate(mt, entries).filter((e) => included.has(e.mediaId!))) {
					if (aborted.get()) break;
					counts.candidates++;

					if (!entry.idMal) {
						log.send(`synclist > [skip] ${entry.title} | reason=no_idMal | mediaId=${entry.mediaId}`);
						counts.no_idMal++;
						continue;
					}

					const start = utils.toISODate(entry.startedAt);
					const finish = utils.toISODate(entry.completedAt);
					const notes = utils.unwrap(entry.notes);
					const score = Math.round((utils.unwrap(entry.score) ?? NaN) / 10);
					const status = utils.unwrap(entry.status);
					const malEntry = malEntries.find((e) => Number(e.idMal) === Number(entry.idMal));

					const shared: $malsync.ListUpdateBodyBase = {};
					const deltas: string[] = [];

					if (start !== malEntry?.list_status?.start_date) {
						shared.start_date = start;
						deltas.push(`start_date: "${malEntry?.list_status?.start_date ?? "<none>"}" -> "${start ?? "<none>"}"`);
					}
					if (finish !== malEntry?.list_status?.finish_date) {
						shared.finish_date = finish;
						deltas.push(`finish_date: "${malEntry?.list_status?.finish_date ?? "<none>"}" -> "${finish ?? "<none>"}"`);
					}

					const malNotes = LoadDoc(`<p>${malEntry?.list_status?.comments ?? ""}</p>`)("p").text();
					if (notes !== malNotes) {
						shared.comments = notes;
						deltas.push(`comments: "${malNotes}" -> "${notes ?? "<none>"}"`);
					}

					if (score !== malEntry?.list_status?.score) {
						shared.score = score;
						deltas.push(`score: ${malEntry?.list_status?.score ?? "<none>"} -> ${Number.isNaN(score) ? "<NaN>" : score}`);
					}

					const body =
						mt === "ANIME"
							? (() => {
									const req: $malsync.ListUpdateAnimeBody = { ...shared };
									const listStatus = malEntry?.list_status as $malsync.AnimeListEntry | undefined;

									const wantStatus = statusToMAL(mt, status);
									if (wantStatus !== listStatus?.status) {
										req.status = wantStatus;
										deltas.push(`status: "${listStatus?.status ?? "<none>"}" -> "${wantStatus ?? "<none>"}"`);
									}

									const wantRewatching = status === "REPEATING";
									if (wantRewatching !== listStatus?.is_rewatching) {
										req.is_rewatching = wantRewatching;
										deltas.push(`is_rewatching: ${listStatus?.is_rewatching ?? "<none>"} -> ${wantRewatching}`);
									}

									const wantEps = utils.unwrap(entry.progress);
									const curEps = listStatus?.num_episodes_watched;
									if (wantEps !== curEps && listStatus?.status !== "completed") {
										req.num_watched_episodes = wantEps;
										deltas.push(`num_watched_episodes: ${curEps ?? "<none>"} -> ${wantEps ?? "<none>"}`);
									} else if (wantEps !== curEps && listStatus?.status === "completed") {
										log.send(
											`synclist > [skip-delta] ${entry.title} | num_watched_episodes suppressed because MAL status="completed" (${curEps} vs ${wantEps})`,
										);
									}

									const wantRewatch = utils.unwrap(entry.repeat);
									if (wantRewatch !== listStatus?.num_times_rewatched) {
										req.num_times_rewatched = wantRewatch;
										deltas.push(`num_times_rewatched: ${listStatus?.num_times_rewatched ?? "<none>"} -> ${wantRewatch ?? "<none>"}`);
									}

									return req;
								})()
							: (() => {
									const req: $malsync.ListUpdateMangaBody = { ...shared };
									const listStatus = malEntry?.list_status as $malsync.MangaListEntry | undefined;

									const wantStatus = statusToMAL(mt, status);
									if (wantStatus !== listStatus?.status) {
										req.status = wantStatus;
										deltas.push(`status: "${listStatus?.status ?? "<none>"}" -> "${wantStatus ?? "<none>"}"`);
									}

									const wantRereading = status === "REPEATING";
									if (wantRereading !== listStatus?.is_rereading) {
										req.is_rereading = wantRereading;
										deltas.push(`is_rereading: ${listStatus?.is_rereading ?? "<none>"} -> ${wantRereading}`);
									}

									const wantChaps = utils.unwrap(entry.progress);
									const curChaps = listStatus?.num_chapters_read;
									if (wantChaps !== curChaps && listStatus?.status !== "completed") {
										req.num_chapters_read = wantChaps;
										deltas.push(`num_chapters_read: ${curChaps ?? "<none>"} -> ${wantChaps ?? "<none>"}`);
									} else if (wantChaps !== curChaps && listStatus?.status === "completed") {
										log.send(
											`synclist > [skip-delta] ${entry.title} | num_chapters_read suppressed because MAL status="completed" (${curChaps} vs ${wantChaps})`,
										);
									}

									const wantReread = utils.unwrap(entry.repeat);
									if (wantReread !== listStatus?.num_times_reread) {
										req.num_times_reread = wantReread;
										deltas.push(`num_times_reread: ${listStatus?.num_times_reread ?? "<none>"} -> ${wantReread ?? "<none>"}`);
									}

									return req;
								})();

					if (!Object.keys(body).filter((k) => (body as any)[k] !== undefined).length) {
						counts.no_delta++;
						continue;
					}

					await application.list
						.patch(mt, entry.idMal, body)
						.then(() => {
							log.success(`synclist > Updated ${entry.title} on MAL. ${JSON.stringify(body)}`);
							counts.updated++;
						})
						.catch((e: Error) => {
							log.error(`synclist > Failed to update ${entry.title}: ${e.message}`);
							counts.errored++;
						});
					await utils.wait(500);
				}

				if (t === "fullsync" && !aborted.get()) {
					const toDelete = [...new Set(forFullSyncDeletion)]
						.map(Number)
						.filter(Number.isFinite)
						.filter((idMal) => malEntries.some((x) => Number(x.idMal) === idMal));

					counts.delete_candidates = toDelete.length;
					if (toDelete.length === 0) {
						log.info(`synclist > [fullsync] nothing to delete from MAL`);
					} else {
						log.info(`synclist > [fullsync] deleting ${toDelete.length} entries from MAL`);
						for (const idMal of toDelete) {
							if (aborted.get()) {
								log.warn(`synclist > [fullsync] aborted by user`);
								break;
							}

							const entry = malEntries.find((x) => Number(x.idMal) === idMal);
							const title = entry?.node.title ?? `mal-id/${idMal}`;

							try {
								const isDeleted = await application.list.delete(mt, idMal);
								if (isDeleted) {
									log.success(`synclist > deleted ${title}`);
									counts.deleted++;
								} else {
									log.error(`synclist > failed to delete ${title} | not_found`);
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

				await application.list
					.fetchAll(mt, true)
					.then(() => log.info(`synclist > [fetchAll] updated ${mt} store!`))
					.catch((e) => log.error(`synclist > [fetchAll] failed to update ${mt} store: ${e.message}`));

				notifications.add({
					title: `Manual Sync ${aborted.get() ? "Aborted" : "Completed"}`,
					accentColor: aborted.get() ? "#d44949c4" : "#3fa05ac4",
					thumbnail: icons.get("gears"),
					fields: [
						{ name: "Type", value: t.toUpperCase() },
						{ name: "Direction", value: k === "import" ? "AniList → MAL" : "MAL → AniList" },
						{ name: "Media", value: mt },
						{ name: "Mature Content", value: a ? "Included" : "Excluded" },
						{ name: "Private Entries", value: p ? "Included" : "Excluded" },
						{ name: "Candidates", value: (counts.candidates || "None").toString() },
						{ name: "Updated", value: (counts.updated || "None").toString() },
						{ name: "Up-to-date", value: (counts.no_delta || "None").toString() },
						{ name: "No MAL match", value: (counts.no_idMal || "None").toString() },
						...(counts.excluded_by_status > 0 ? [{ name: "Progress ignored (completed)", value: counts.excluded_by_status.toString() }] : []),
						...(t === "fullsync" ? [{ name: "Deleted", value: counts.delete_candidates ? `${counts.deleted}/${counts.delete_candidates}` : "None" }] : []),
						{ name: "Errors", value: (counts.errored || "None").toString() },
					],
				});
			}

			async function perfExport() {
				const mt = mediaType.get(),
					t = type.get(),
					k = kind.get(),
					a = includeAdult.get(),
					p = includePrivate.get();
				log.send(`synclist > Performing Manual Sync | type="${t}" kind="${k}" mediaType="${mt}"`);

				const token = $database.anilist.getToken();
				if (!token.length) return log.error(`synclist > No AniList Token detected! Cancelling sync...`);

				const forFullSyncDeletion: number[] = [];
				const validate = (listEntries: Awaited<ReturnType<typeof application.list.fetchAll>>) => {
					if (!a) {
						const [non, adults] = utils.partition(listEntries, (l) => l.node.nsfw !== "black");
						if (t === "fullsync") forFullSyncDeletion.push(...adults.map((e) => Number(e.idMal)).filter(Number.isFinite));
						listEntries = non;
						log.send(`synclist > [${mt}] Pruned [${adults.length}] adult entries`);
					}
					return listEntries;
				};

				const alEntries = getAnilistEntries(mt);
				const mappedAl = new Map(alEntries.filter((e): e is typeof e & { idMal: number } => e.idMal != null).map((e) => [e.idMal, e]));

				const malEntries = await application.list.fetchAll(mt, false);
				log.info(`synclist > Fetched ${malEntries.length} MAL entries; ${mappedAl.size} AniList entries with malId`);

				const notInAl = malEntries.map((e) => e.idMal).filter((id) => !mappedAl.has(id));
				const mapping =
					t === "patch" || !notInAl.length
						? []
						: await application.list.mapMalIdstoALIds(notInAl).catch((err: Error) => {
								log.error(`synclist > mapping failed: ${err.message}`);
								return [] as { id: number; idMal: number; title: string }[];
							});
				const mapped = new Map(mapping.map((e) => [e.idMal, e]));

				let processed = 0;
				for (const malEntry of validate(malEntries)) {
					const alEntry = mappedAl.get(malEntry.idMal) ?? mapped.get(malEntry.idMal);
					if (!alEntry) {
						log.warn(`synclist > no mapping for ${malEntry.node.title}`);
						continue;
					}

					const body: $malsync.AnilistSaveMediaListEntryVariables = { mediaId: alEntry.id };
					const start = malEntry.list_status.start_date;
					const tgtStart = utils.toISODate("startedAt" in alEntry ? alEntry.startedAt?.valueOf() : undefined);
					if (start !== tgtStart) body.startedAt = utils.toFuzzyDate(start ?? undefined) ?? null;

					const finish = malEntry.list_status.finish_date;
					const tgtFinish = utils.toISODate("completedAt" in alEntry ? alEntry?.completedAt?.valueOf() : undefined);
					if (finish !== tgtFinish) body.completedAt = utils.toFuzzyDate(finish ?? undefined) ?? null;

					const notes = LoadDoc(`<p>${malEntry.list_status.comments ?? ""}</p>`)("p").text() || undefined;
					const tgtNotes = utils.unwrap("notes" in alEntry ? alEntry.notes?.valueOf() : undefined);
					if (notes !== tgtNotes) body.notes = notes ?? null;

					const score = malEntry.list_status.score != null ? malEntry.list_status.score * 10 : undefined;
					const tgtScore = "score" in alEntry && alEntry.score != null ? Math.round(utils.unwrap(alEntry.score)!) : undefined;
					if (score !== tgtScore) body.scoreRaw = score ?? null;

					const status = statusToAL(mt, malEntry.list_status.status);
					const tgtStatus = "status" in alEntry ? utils.unwrap(alEntry.status) : undefined;
					if (status !== tgtStatus) body.status = status;

					const progress = mt === "ANIME"
                        ? (malEntry as $malsync.AnimeListEntryWrapper).list_status.num_episodes_watched
                        : (malEntry as $malsync.MangaListEntryWrapper).list_status.num_chapters_read;
					const tgtProgress =  "progress" in alEntry ? utils.unwrap(alEntry?.progress) : undefined;
					if (progress !== tgtProgress) body.progress = progress ?? null;

					if (Object.keys(body).length <= 1) continue;

					await ctx
						.fetch("https://graphql.anilist.co/", {
							method: "POST",
							headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
							body: JSON.stringify({
								query: "mutation ($mediaId: Int!, $status: MediaListStatus, $progress: Int, $scoreRaw: Int, $notes: String, $startedAt: FuzzyDateInput, $completedAt: FuzzyDateInput) { SaveMediaListEntry(mediaId: $mediaId, status: $status, progress: $progress, scoreRaw: $scoreRaw, notes: $notes, startedAt: $startedAt, completedAt: $completedAt) { id status progress scoreRaw media { title { userPreferred } } } }",
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
					title: "Manual Sync Completed",
					accentColor: "#0b7b2ac4",
					thumbnail: icons.get("gears"),
					fields: [
						{ name: "Type", value: t.toUpperCase() },
						{ name: "Direction", value: "MyAnimeList → AniList" },
						{ name: "Processed entries", value: processed.toString() },
					],
				});
			} // prettier-ignore

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

			function buildDeltaFields(
				action: "update" | "progress" | "repeat",
				body: $malsync.ListUpdateAnimeBody | $malsync.ListUpdateMangaBody,
				entry: NonNullable<Awaited<ReturnType<typeof getMedia>>>,
			): { name: string; value: string }[] {
				const out: { name: string; value: string }[] = [];

				if (body.status !== undefined) {
					const s = String(body.status).replace(/_/g, " ");
					out.push({ name: "Status", value: s.charAt(0).toUpperCase() + s.slice(1) });
				}
				if ((body as $malsync.ListUpdateBodyBase).score !== undefined) {
					out.push({ name: "Score", value: `${(body as $malsync.ListUpdateBodyBase).score} / 10` });
				}
				if ((body as $malsync.ListUpdateBodyBase).start_date !== undefined) {
					out.push({ name: "Started", value: (body as $malsync.ListUpdateBodyBase).start_date || "cleared" });
				}
				if ((body as $malsync.ListUpdateBodyBase).finish_date !== undefined) {
					out.push({ name: "Finished", value: (body as $malsync.ListUpdateBodyBase).finish_date || "cleared" });
				}
				if ((body as $malsync.ListUpdateBodyBase).comments !== undefined) {
					const c = String((body as $malsync.ListUpdateBodyBase).comments ?? "");
					out.push({ name: "Notes", value: c ? `${c.slice(0, 60)}${c.length > 60 ? "…" : ""}` : "cleared" });
				}

				if (entry.type === "ANIME") {
					const b = body as $malsync.ListUpdateAnimeBody;
					if (b.num_watched_episodes !== undefined) out.push({ name: "Episodes", value: String(b.num_watched_episodes) });
					if (b.num_times_rewatched !== undefined) out.push({ name: "Rewatches", value: String(b.num_times_rewatched) });
					if (b.is_rewatching !== undefined) out.push({ name: "Rewatching", value: b.is_rewatching ? "Yes" : "No" });
				} else {
					const b = body as $malsync.ListUpdateMangaBody;
					if (b.num_chapters_read !== undefined) out.push({ name: "Chapters", value: String(b.num_chapters_read) });
					if (b.num_times_reread !== undefined) out.push({ name: "Rereads", value: String(b.num_times_reread) });
					if (b.is_rereading !== undefined) out.push({ name: "Rereading", value: b.is_rereading ? "Yes" : "No" });
				}

				if (out.length === 0) out.push({ name: "Action", value: action });
				return out;
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
				buildBody: (data: TData, entry: NonNullable<Awaited<ReturnType<typeof getMedia>>>) => $malsync.ListUpdateAnimeBody | $malsync.ListUpdateMangaBody;
				requireRepeat?: boolean;
			}): Promise<
				| { ok: false; reason: string; title?: string; thumbnail?: string }
				| {
						ok: true;
						action: "delete" | "patch";
						entry: NonNullable<Awaited<ReturnType<typeof getMedia>>>;
						title: string;
						type: "ANIME" | "MANGA";
						body: $malsync.ListUpdateAnimeBody | $malsync.ListUpdateMangaBody;
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
				if (!entry.media?.idMal) return skip(`No MAL match (${mediaId})`);
				if (skipAdultLiveSync.current && entry.media.isAdult?.valueOf()) return skip(`${entry.media.title?.userPreferred} has mature content rating.`);

				const title = entry.media.title?.userPreferred ?? `anilist-id/${mediaId}`;
				const type = entry.type;

				if (actionLabel === "delete") {
					try {
						const ok = await application.list.delete(type, entry.media.idMal);
						if (!ok) return skip(`${title} is not in your MyAnimeList list`);
						log.success(`delete > [DELETE] Removed ${title} from MyAnimeList`);
						return { ok: true, action: "delete", entry, title, type, body: {} };
					} catch (e) {
						log.error(`delete > [DELETE] ${(e as Error).message}`);
						return { ...skip((e as Error).message), title, thumbnail: entry.media?.coverImage?.large };
					}
				}

				const body = buildBody(data, entry);
				try {
					await application.list.patch(type, entry.media.idMal, body);
					log.success(`${actionLabel} > [PATCH] Synced ${title} to MyAnimeList. ${JSON.stringify(body)}`);
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
						const body: any = {};
						const start = utils.toISODate(data.startedAt);
						if (start) body.start_date = start;
						const finish = utils.toISODate(data.completedAt);
						if (finish) body.finish_date = finish;
						if (typeof data.scoreRaw === "number" && data.scoreRaw > 0) body.score = Math.round(data.scoreRaw / 10);
						if (entry.type === "ANIME") {
							return { ...body, status: statusToMAL("ANIME", data.status), is_rewatching: data.status === "REPEATING", num_watched_episodes: data.progress };
						}
						return { ...body, status: statusToMAL("MANGA", data.status), is_rereading: data.status === "REPEATING", num_chapters_read: data.progress };
					},
				});

				if (!result.ok) {
					// Skip generic errors (no media | adultOnly | etc)
					if (result.title)
						notifications.add({
							title: result.title,
							description: `Failed to update to MyAnimeList: ${result.reason}`,
							thumbnail: result.thumbnail,
							accentColor: "#ef5350",
						});
					return;
				}

				const { entry, title, type } = result;
				const thumbnail = entry.media?.coverImage?.large;
				const body = result.body;

				// "Add to list" case: status is only field, and it's planning.
				const isPlanningOnly = (type === "ANIME" ? (() => {
					const b = body as $malsync.ListUpdateAnimeBody;
					return b.status === "plan_to_watch" && !b.num_watched_episodes && !b.is_rewatching;
				})() : (() => {
					const b = body as $malsync.ListUpdateMangaBody;
					return b.status === "plan_to_read" && !b.num_chapters_read && !b.num_volumes_read && !b.is_rereading;
				})()) && !body?.score && !body?.start_date && !body?.finish_date;

				if (isPlanningOnly) {
					notifications.add({
						title, thumbnail,
						description: `Set ${type.toLowerCase()} to Planning in MyAnimeList.`,
						accentColor: "#505bef",
					});
					return;
				}

				notifications.add({
					title, thumbnail,
					description: `Updated ${type.toLowerCase()} on MyAnimeList.`,
					accentColor: "#505bef",
					fields: buildDeltaFields("update", body, entry),
				});
			}); // prettier-ignore

			$store.watch("POST_UPDATE_ENTRY_PROGRESS", async (e) => {
				const result = await liveSyncRun({
					event: e,
					preDataKey: "PRE_UPDATE_ENTRY_PROGRESS_DATA",
					actionLabel: "progress",
					buildBody: (data: $app.PreUpdateEntryProgressEvent, entry) => {
						if (entry.type === "ANIME")
							return { status: statusToMAL("ANIME", data.status), is_rewatching: data.status === "REPEATING", num_watched_episodes: data.progress };
						return { status: statusToMAL("MANGA", data.status), is_rereading: data.status === "REPEATING", num_chapters_read: data.progress };
					},
				});

				if (!result.ok) {
					// Skip generic errors (no media | adultOnly | etc)
					if (result.title)
						notifications.add({
							title: result.title,
							description: `Failed to sync progress to MyAnimeList: ${result.reason}`,
							thumbnail: result.thumbnail,
							accentColor: "#ef5350",
						});
					return;
				}

				const { entry, title, type, body } = result;
				const thumbnail = entry.media?.coverImage?.large;
				
				// Prefer the pre-hook data that buildBody received; fall back to the body.
				const progress = (type === "ANIME"
						? (body as $malsync.ListUpdateAnimeBody)?.num_watched_episodes
						: (body as $malsync.ListUpdateMangaBody)?.num_chapters_read)!;
				const total = utils.unwrap(type === "ANIME"
						? (entry.media as $app.AL_BaseAnime)?.episodes
						: (entry.media as $app.AL_BaseManga)?.chapters);

				const isAnime = type === "ANIME";
				const unit = isAnime ? "episode" : "chapter";
				const description =
					total && progress == total
						? `Completed ${isAnime ? "Watching" : "Reading"} ${type.toLowerCase()} (${progress}/${total}).`
						: total
							? `${isAnime ? "Watched" : "Read"} ${unit} ${progress} of ${total}.`
							: `${isAnime ? "Watched" : "Read"} ${unit} ${progress}.`;

				notifications.add({
					title,
					description,
					thumbnail,
					accentColor: "#505bef",
				});
			}); // prettier-ignore

			$store.watch("POST_UPDATE_ENTRY_REPEAT", async (e) => {
				const result = await liveSyncRun({
					event: e,
					preDataKey: "PRE_UPDATE_ENTRY_REPEAT_DATA",
					actionLabel: "repeat",
					requireRepeat: true,
					buildBody: (data: any, entry) => entry.type === "ANIME" ? { num_times_rewatched: data.repeat } : { num_times_reread: data.repeat },
				});

				if (!result.ok) {
					// Skip generic errors (no media | adultOnly | etc)
					if (result.title)
						notifications.add({
							title: result.title,
							description: `Failed to sync repeat count to MyAnimeList: ${result.reason}`,
							thumbnail: result.thumbnail,
							accentColor: "#ef5350",
						});
					return;
				}

				const { entry, title, type, body } = result;
				const repeat = type === "ANIME"
					? (body as $malsync.ListUpdateAnimeBody)?.num_times_rewatched
					: (body as $malsync.ListUpdateMangaBody)?.num_times_reread;

				notifications.add({
					title,
					description: `Set ${type === "ANIME" ? "rewatch" : "reread"} count to ${repeat}.`,
					thumbnail: entry.media?.coverImage?.large,
					accentColor: "#505bef",
				});
			}); // prettier-ignore

			$store.watch("POST_DELETE_ENTRY", async (e) => {
				const result = await liveSyncRun({ event: e, preDataKey: "PRE_UPDATE_DELETE", actionLabel: "delete", buildBody: () => ({}) });

				if (!result.ok) {
					// Skip generic errors (no media | adultOnly | etc)
					if (result.title)
						notifications.add({
							title: result.title,
							description: `Failed to delete from MyAnimeList: ${result.reason}`,
							thumbnail: result.thumbnail,
							accentColor: "#ef5350",
						});
					return;
				}

				notifications.add({
					title: result.title,
					description: `Removed ${result.type.toLowerCase()} from MyAnimeList.`,
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
		})();

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

				const info = tray.text(
					"Click the button below to authorize the application, then copy the token from the website and paste it into the field below.",
					{ style: { textAlign: "center", wordBreak: "normal" } },
				);

				const authButton = tray.anchor({
					text: "Authorize",
					href: application.auth.generateURL(),
					target: "_blank",
					className:
						"UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border bg-gray-100 border-transparent hover:bg-gray-200 active:bg-gray-300 dark:text-gray-300 dark:bg-opacity-10 dark:hover:bg-opacity-20 h-10 px-4 no-underline",
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
					onClick: ctx.eventHandler("malsync:login", async () => {
						if (!authField.current.trim().length) return authError.set("Error: Please enter your Auth code");
						authError.set("");
						try {
							await application.auth.exchangeCode(authField.current);
							authField.setValue("");
							log.success("login > Successfully logged in!");
							log.send("login > Fetching user info...");
						} catch (err) {
							authError.set((err as Error).message);
							log.error(`login > ${(err as Error).message}`);
							return;
						}

						let retries = 1,
							ok = false;
						while (!ok && retries <= 3) {
							try {
								await application.user.fetch();
								ok = true;
								log.success("login > Successfully fetched user info!");
								log.send(`login > Welcome {{USERNAME}}!`);
								tray.updateBadge({ number: 0 });
								current.set(Tab.Landing);
							} catch (err) {
								log.warn(`login > fetch attempt ${retries} failed: ${(err as Error).message}`);
								retries++;
								await utils.wait(2_000);
							}
						}
						if (!ok) log.warn(`login > Unable to fetch user info after 3 attempts.`);
					}),
				});

				const logs = log.modal(
					utils.components.button({ icon: "code", tooltip: "Open Logs", intent: "gray-subtle", className: "rounded-lg", size: "md" }),
					"login-log-modal",
				);

				return tray.div([
					tray.stack(
						[
							tray.flex(
								[
									tray.div([], {
										style: { backgroundImage: `url(${icons.get("myanimelist_logo")})` },
										className: "w-40 h-12 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
									}),
								],
								{ className: "justify-center" },
							),
							tray.text("for Seanime", { style: { marginTop: "-1rem" }, className: "text-sm text-center text-[--muted]" }),
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
                    { ...(ncount > 0 && { className: "animate-bounce" }) }),
				);

				const pfp = tray.tooltip(
					tray.a({
						href: `https://myanimelist.net/profile/${profile?.name ?? ""}`,
						className: "flex justify-center items-center w-10 h-10 bg-transparent hover:bg-gray-200 dark:bg-opacity-10 dark:hover:bg-opacity-20 rounded-full overflow-hidden",
						items: [tray.img({ src: profile?.picture ?? icons.get("person"), width: "30", className: "rounded-full" })],
					}),
					{ text: "Open profile in browser" },
				);

				const logout = tray.modal({
					trigger: utils.components.button({ icon: "power", size: "lg", intent: "alert-subtle", tooltip: "Sign-out", transparent: true }),
					title: "Sign-out of MyAnimeListSync",
					items: [
						tray.text("Are you sure you want to sign out?", { className: "break-normal text-pretty" }),
						tray.text("This will clear tokens, notifications, userinfo and cached media collection, and abort any active sync.", {
							className: "text-[--muted] text-sm break-normal text-pretty",
						}),
					],
					footer: [
						tray.button("Sign-out", {
							intent: "alert",
							onClick: ctx.eventHandler("malsync:sign-out", async () => {
								current.set(Tab.Logon);
								log.info("logout > logging out");
								try {
									await application.auth.revoke("access_token");
								} catch {}
								notifications.clear();
								application.token.resetToken();
								application.user.reset();
								application.list.clearCache();
								sync.abort();
								ctx.toast.success("Logged out of MyAnimeListSync");
								log.success("logout > Logged out of MyAnimeListSync");
							}),
						}),
					],
				});

				const header = tray.flex([
					tray.stack(
						[
							tray.flex([
								tray.div([], {
									style: { backgroundImage: `url(${icons.get("myanimelist_logo")})` },
									className: "w-40 h-12 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
								}),
							]),
							tray.text("for Seanime", { style: { marginTop: "-0.75rem", paddingInlineStart: "2.2rem" }, className: "text-sm text-[--muted]" }),
						],
						{ className: "flex-1", gap: 0 },
					),
					tray.flex([notif, pfp], { gap: 2, className: "items-center" }),
				]);

				const body = tray.stack([
                    tray.div([
                        tray.flex([
                            tray.span("Welcome,", { className: "font-semibold" }),
                            tray.div([tray.img({ width: "18", src: icons.get(application.user.isNameHidden ? "eye" : "eye_slash") })], {
                                className: "flex items-center cursor-pointer",
                                onClick: ctx.eventHandler("toggle-privacy-name", () => application.user.toggleHideName()),
                            }),
                        ]),
                        tray.text(profile?.name ?? "Username", { className: "font-bold text-3xl line-clamp-1", style: { maxWidth: "25rem" } }),
                    ],{ className: "relative rounded p-3 mb-3", style: { background: "linear-gradient(to right, #1A2E5C, #2E51A2)"} }),

                    tray.flex([
                        tray.flex([
                            log.modal(
                                utils.components.button({ icon: "code", size: "lg", className: "rounded-r-xl", tooltip: "View Logs", style: { width: "80px" } }),
                                "landing-logs-btn",
                            ),
                            tray.modal({
                                trigger: tray.div([
                                    utils.components.button({ icon: "refresh", tooltip: "Perform Manual Sync", className: "rounded-none", style: { width: "80px" }, size: "lg" }),
                                    !sync.busy.get() ? [] : tray.div([], {
                                        className: "w-3 h-3 rounded-full bg-red-500 absolute border border-white",
                                        style: { top: "-0.1rem", right: "-0.25rem" },
                                    }),
                                ], { className: "relative" }),
                                title: "Perform Manual Sync",
                                description: "Manually sync AniList and MyAnimeList trackers",
                                className: "max-w-2xl",
                                items: [
                                    utils.components.select({
                                        heading: "Direction",
                                        description: "Choose which tracker to sync to and from",
                                        value: sync_kind,
                                        onChange: (v: any) => sync.options.kind.set(v),
                                        disabled: sync.busy.get(),
                                        options: [{
                                            title: "Sync to MyAnimeList",
                                            desc: "Bring AniList entries to MAL",
                                            icon: icons.get("myanimelist", { fill: "#9f92ff" }),
                                            value: "import",
                                        }, { title: "Sync to AniList", desc: "Bring MAL entries to AniList", icon: icons.get("anilist", { fill: "#9f92ff" }), value: "export" }],
                                    }),
                                    utils.components.select({
                                        heading: "Media Type",
                                        description: "Choose which media library to sync",
                                        value: sync.options.mediaType.get(),
                                        onChange: (v: any) => sync.options.mediaType.set(v),
                                        disabled: sync.busy.get(),
                                        options: [
                                            { title: "Anime", desc: "Sync anime entries", icon: icons.get("play", { fill: "#9f92ff" }), value: "ANIME" },
                                            { title: "Manga", desc: "Sync manga entries", icon: icons.get("book", { fill: "#9f92ff" }), value: "MANGA" },
                                        ],
                                    }),
                                    utils.components.select({
                                        heading: "Sync Type",
                                        description: "Choose the method of syncing",
                                        value: sync.options.type.get(),
                                        gridCols: 1,
                                        onChange: (v: any) => sync.options.type.set(v),
                                        disabled: sync.busy.get(),
                                        options: [
                                            {
                                                title: "Add missing entries",
                                                desc: "Adds new items from source that aren't in your target list.",
                                                icon: icons.get("plusCircleDotted", { fill: "#9f92ff" }),
                                                value: "patch",
                                            },
                                            {
                                                title: "Update existing entries",
                                                desc: "Updates entries that exist in both trackers.",
                                                icon: icons.get("arrow_r", { fill: "#9f92ff" }),
                                                value: "post",
                                            },
                                            {
                                                title: "Mirror Source List",
                                                desc: "Adds, updates, and removes to make target identical to source.",
                                                icon: icons.get("arrow_lr", { fill: "#9f92ff" }),
                                                value: "fullsync",
                                            },
                                        ],
                                    }),
                                    utils.components.groupedCheckbox({
                                        heading: "Misc",
                                        description: "Miscellaneous options",
                                        disabled: sync.busy.get(),
                                        entries: [
                                            {
                                                title: "Mature Content",
                                                desc: "Include mature content",
                                                icon: icons.get("explicit", { fill: "#9f92ff" }),
                                                value: sync.options.includeAdult.get(),
                                                eventHandlerId: "sync-include-adult",
                                                onChange: (v: boolean) => sync.options.includeAdult.set(v),
                                                overwrites: { ifTrue: "Enabled", ifFalse: "Disabled" },
                                            },
                                            {
                                                title: "Private Entries",
                                                desc: "Include private entries",
                                                icon: icons.get("eye_slash", { fill: "#9f92ff" }),
                                                value: sync.options.includePrivate.get(),
                                                eventHandlerId: "sync-include-private",
                                                onChange: (v: boolean) => sync.options.includePrivate.set(v),
                                                overwrites: { ifTrue: "Enabled", ifFalse: "Disabled" },
                                            },
                                        ],
                                    }),
                                    tray.button({
                                        label: sync.busy.get() ? "Cancel Manual Sync" : "Start Manual Sync",
                                        size: "lg",
                                        intent: sync.busy.get() ? "alert" : "success",
                                        loading: sync.aborted,
                                        onClick: ctx.eventHandler("malsync:manage-list-start-job", () => {
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
                            application.list.anime.modal(
                                utils.components.button({ icon: "play", tooltip: "Anime List", size: "lg", className: "rounded-none", style: { width: "80px" } }),
                                "anime-list-btn",
                            ),
                            application.list.manga.modal(
                                utils.components.button({ icon: "book", tooltip: "Manga List", size: "lg", className: "rounded-l-xl", style: { width: "80px" } }),
                                "manga-list-btn",
                            ),
                            ],
                            { gap: 0, className: "w-fit" },
                        ),
                        tray.div([], { className: "flex-1" }),
                        logout,
                    ],{ style: { gap: "0.5rem" } }),

						tray.div([
							tray.switch("Temporarily disable livesync", {
								fieldRef: sync.liveSync.disabled,
								disabled: application.auth.busy.get(),
								style: { "--color-brand-500": "255 95 95" },
							}),
							tray.switch("Skip adult entries for livesync", {
								fieldRef: sync.liveSync.skipAdult,
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("malsync:skip-adult", (e) => $storage.set("malsync:options-skipAdult", e.value)),
							}),
							tray.switch("Disable badge for non-critical notifications", {
								value: notifications.suppressBadge.get(),
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("malsync:suppress-notification-badge", (e) => {
									notifications.suppressBadge.set(e.value);
									$storage.set("malsync:options-suppressnotificationbadge", e.value);
								}),
							}),
						]),
						tray.div([], { className: "flex-1" }),
						tray.div(
							[
								tray.text(`Connections made: ${network.success + network.failed}`),
								tray.text(`Successful connections: ${network.success} (${((network.success * 100) / (network.success + network.failed) || 0).toFixed(2)}%)`),
								tray.p([
									tray.span("Last connection:", { className: "mr-1" }),
									tray.span(network.lastState, { className: `font-bold text-${network.modifier}-300` }),
								]),
							],
							{ className: "text-xs text-[--muted]" },
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
							{ className: "justify-center text-xs text-[--muted] mt-2" },
						),
					],
					{ style: { height: "28rem" } },
				);

				return tray.stack([header, body], { className: "m-2" });
			}; // prettier-ignore

			return { current, [Tab.Logon]: logon, [Tab.Landing]: landing, Tab };
		})();

		const tray = ctx.newTray({ iconUrl, withContent: true, width: "30rem" });
		tray.render(() => tabs[tabs.current.get()]());

		ctx.effect(() => {
			if (application.user.data === null) return tray.updateBadge({ number: 1, intent: "alert" });
			if (sync.busy.get()) return tray.updateBadge({ number: 1, intent: "alert" });
			if (notifications.unreads.get() > 0 && !notifications.suppressBadge.get())
				return tray.updateBadge({ number: notifications.unreads.get(), intent: "warning" });
			return tray.updateBadge({ number: 0 });
		}, [application.auth.busy, sync.busy, notifications.unreads, notifications.suppressBadge]);

		(() => {
			async function init() {
				log.send("init > Initializing extension...");
				log.send("init > Checking availability of access tokens...");
				try {
					const token = await application.token.getToken();
					if (!token) throw new Error("Missing token. Please authenticate this app by opening the tray.");
					let profile = await application.user.fetch().catch((err: Error) => {
						log.error(`init > ${err.message}. Retrying [1/3]`);
						return null;
					});
					if (!profile) {
						for (let i = 1; i <= 3 && !profile; i++) {
							profile = await application.user.fetch().catch(async (err: Error) => {
								await utils.wait(2_000);
								log.error(`init > ${err.message}. Retrying [${i}/3]`);
								return null;
							});
						}
						if (!profile) throw new Error("Failed to get the user info after 3 retries.");
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

			// Cleanup old notifications
			$storage.remove("59ea4fe-5a29-485c-96a6-d236c0f04876");
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
