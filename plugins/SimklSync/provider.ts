/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./simklsync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://eu.simkl.in/img_favicon/v2/favicon-192x192.png";
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
				simkl_logo: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#cacaca">
						<path d="M3.84 0A3.83 3.83 0 0 0 0 3.84v16.32A3.83 3.83 0 0 0 3.84 24h16.32A3.83 3.83 0 0 0 24 20.16V3.84A3.83 3.83 0 0 0 20.16 0zm8.567 4.11q3.11 0 4.393.186 1.69.252 2.438.877 1.009.867 1.009 3.104 0 .241-.01.768h-4.234q-.021-.537-.074-.746-.147-.615-.966-.692-.725-.065-3.53-.066-2.775 0-3.289.165-.578.2-.578 1.024 0 .792.61.969.514.143 4.633.275 3.73.11 4.76.275 1.04.165 1.654.495t.983.936q.556.892.557 2.873 0 2.212-.546 3.247-.547 1.024-1.785 1.398-1.219.374-6.71.374-3.338 0-4.82-.187-1.806-.22-2.593-.86-.85-.684-1.008-1.93a10.5 10.5 0 0 1-.085-1.434v-.789H7.44q-.01 1.11.43 1.428.232.151.525.203.294.056 1.03.077a166 166 0 0 0 2.405.022q2.793-.01 3.234-.033.83-.065 1.092-.23.368-.242.368-1.077 0-.57-.231-.802-.316-.318-1.503-.34-.82 0-3.425-.132-2.69-.133-3.488-.154-2.08-.066-2.932-.505-1.092-.56-1.429-1.91-.189-.747-.189-1.956 0-2.547.925-3.59.693-.79 2.102-1.044 1.271-.22 6.053-.22z"/>
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
			Logon = 1,
			Landing = 2,
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
			disableSyncing: ctx.fieldRef<boolean>($storage.get("simkl.disableSyncing") ?? false),
			manageListJobType: ctx.fieldRef<ManageListJobType>(ManageListJobType.Import),
			manageListSyncType: ctx.fieldRef<ManageListSyncType>(ManageListSyncType.Post),
			manageListMediaType: ctx.fieldRef("Anime"),
			suppressNotificationBadge: ctx.fieldRef<boolean>($storage.get("simkl:options-suppressnotificationbadge")?.valueOf() ?? false),
			skipAdult: ctx.fieldRef<boolean>($storage.get("simkl:options-skipAdult")?.valueOf() ?? false),
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
		};

		const notifications: $simkl.NotificationManager = {
			id: "8110097a-3710-4dd7-ac72-7dc8f9f5c35f",
			unreads: ctx.state<number>(0),
			get entries() {
				return this.modalOpened.get() ? ($storage.get<$simkl.NotificationManager["entries"]>(this.id) ?? []) : undefined;
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
												notifications.unreads.set(($storage.get(notifications.id) ?? []).filter((x: $simkl.Notification) => x.unread).length);
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
														const entries = $storage.get<$simkl.NotificationManager["entries"]>(notifications.id);
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
		notifications.unreads.set(($storage.get<$simkl.NotificationManager["entries"]>(notifications.id) ?? []).filter((x) => x.unread).length);

		const log = {
			id: "simkl:69481fa7-d16d-40f2-ae3a-aba6e3f212ad",
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
			name: "seanime-simkl-sync",
			version: "1.0.2",
			clientId: "6cbaeafe0161a8ee3e287f63b33f18733a1566c1d83c356793250eaa5dc4edcd",
			redirectUri: "https://nnotwen.github.io/n-seanime-extensions/plugins/SimklSync/callback.html",
			baseUri: "https://api.simkl.com/",
			currentAuthUrl: ctx.state<string | null>(null),
			token: {
				accessToken: ctx.state<string | null>($storage.get("simkl.accesstoken") ?? null),
				set(accessToken: string | null) {
					$storage.set("simkl.accesstoken", accessToken);
					this.accessToken.set(accessToken);
				},
				generateAuthUrl() {
					const { verifier, challenge } = PKCE.generatePair();
					const oauth_state = generateRandomUUID();
					$store.set("simkl:auth.verifier", verifier);
					$store.set("simkl:oauth.state", oauth_state);

					const url = new URL("https://simkl.com/oauth/authorize");
					url.searchParams.set("response_type", "code");
					url.searchParams.set("client_id", application.clientId);
					url.searchParams.set("redirect_uri", application.redirectUri);
					url.searchParams.set("code_challenge", challenge);
					url.searchParams.set("code_challenge_method", "S256");
					url.searchParams.set("state", oauth_state);
					url.searchParams.set("app-name", application.name);
					url.searchParams.set("app-version", application.version);

					application.currentAuthUrl.set(url.toString());
					return url.toString();
				},
				async exchangeCode(code: string) {
					const codeVerifier = $store.get<string | undefined>("simkl:auth.verifier");
					if (!codeVerifier) throw new Error("No verifier was set!");

					const res = await fetch("https://api.simkl.com/oauth/token", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							code,
							client_id: application.clientId,
							code_verifier: codeVerifier,
							redirect_uri: application.redirectUri,
							grant_type: "authorization_code",
						}),
					});

					if (!res.ok) throw new Error(res.json()?.message ?? res.statusText);
					const { access_token, ...rest }: $simkl.AccessTokenExchangeCodeResponse = res.json();

					if ("error" in rest) throw new Error(rest.error as string);

					this.set(access_token);
					return { access_token, ...rest };
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
				data: ctx.state<$simkl.SimklUserInfo | null>(null),
				async fetch() {
					try {
						const res = await application.fetch<$simkl.SimklUserInfo>("/users/settings");
						this.data.set(res);
						return res;
					} catch (error) {
						throw new Error((error as Error).message);
					}
				},
			},
			list: {
				async addToWatchlist(body: $simkl.WatchlistPostBody) {
					return await application.fetch<$simkl.UpdateResponse>("/sync/add-to-list", {
						method: "POST",
						body: JSON.stringify(body),
					});
				},
				async addToHistory(body: $simkl.UpdatePayload) {
					return await application.fetch<$simkl.UpdateResponse>("/sync/history", {
						method: "POST",
						body: JSON.stringify(body),
					});
				},
				async removeFromList(body: $simkl.UpdatePayload) {
					return await application.fetch<$simkl.DeleteResponse>("/sync/history/remove", {
						method: "POST",
						body: JSON.stringify(body),
					});
				},
			},
			playback: {
				state: ctx.state<$simkl.ApplicationPlaybackState | null>(null),
				playing: ctx.state<boolean>(false),
				async scrobble(action: "start" | "pause" | "stop", body: $simkl.ScrobbleRequestBody) {
					return await application.fetch(`/scrobble/${action}`, {
						method: "POST",
						headers: application.withAuthHeaders(),
						body: JSON.stringify(body),
					});
				},
			},
			withAuthHeaders() {
				const access_token = this.token.accessToken.get();
				if (!access_token) throw new Error(`Missing auth token!`);

				return {
					Authorization: `Bearer ${access_token}`,
					"Content-Type": "application/json",
					"simkl-api-key": application.clientId,
					"User-Agent": `${application.name}/${application.version}`,
				};
			},
			async fetch<T>(endpoint: string, init: RequestInit = {}) {
				const url = new URL(application.baseUri + endpoint.replace(/^\/+/, ""));
				url.searchParams.set("client_id", application.clientId);
				url.searchParams.set("app-name", application.name);
				url.searchParams.set("app-version", application.version);

				const res = await ctx.fetch(url.toString(), {
					...init,
					headers: {
						...this.withAuthHeaders(),
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

				if (!res.ok) {
					let err = null;
					try {
						err = res.json();
					} catch {
						err = null;
					}
					throw new Error(err?.message || err?.error || res.statusText);
				}

				return res.json<T>();
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
					title: "SIMKL Logs",
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
					onClick: ctx.eventHandler("simklsync:login", async () => {
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
							log.send(`login > Welcome ${data.user.name}!`);
							tabs.current.set(Tab.Landing);
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
			},

			[Tab.Landing]() {
				const ncount = notifications.unreads.get();
				const notification = tray.modal({
					trigger: tray.div([this.button({ icon: icons.get("bell", { ...(ncount > 0 ? { stroke: "#fdba74" } : {}) }), tooltip: "Notifications" })], {
						className: ncount > 0 ? "animate-bounce" : "",
					}),
					title: "simklsync Notifications",
					className: "max-w-xl",
					onOpenChange: ctx.eventHandler("simklsync:notification:modalchange", ({ open }) => notifications.modalOpened.set(open)),
					items: [
						tray.flex([
							tray.button("Mark all as Read", {
								intent: "gray-subtle",
								size: "md",
								className: "w-fit bg-transparent border",
								style: { borderColor: "var(--border)" },
								disabled: notifications.unreads.get() <= 0,
								onClick: ctx.eventHandler("simklsync:notifications:markread", () => {
									const entries = $storage.get<$simkl.Notification[]>(notifications.id) ?? [];
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
								onClick: ctx.eventHandler("simklsync:notifications:deleteall", () => {
									$storage.set(notifications.id, []);
									notifications.unreads.set(0);
								}),
							}),
						]),
						tray.div([notifications.modalOpened.get() ? notifications.formattedEntry : tabs.spinner()], { className: "max-h-[40rem] overflow-scroll" }),
					],
				});

				const cachedUserInfo = application.userInfo.data.get();

				const profile = tray.div(
					[
						tray.img({
							src: cachedUserInfo?.user.avatar ?? icons.get("person"),
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
									href: `https://simkl.com/${cachedUserInfo?.account.id}/dashboard`,
									className: "no-underline",
								}),
							],
							{ disabled: !cachedUserInfo?.user.name },
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
								onClick: ctx.eventHandler("simklsync:signout:modal", () => {
									// Can't combine tray.dropdown + tray.modal yet
									tabs.confirmationModal("Sign out from simklsync?", "Are you sure you want to sign out?", "alert", () => {
										log.sendInfo("logout > Logging out");
										state.loggingOut.set(true);

										$storage.remove(notifications.id);
										log.send("logout > Notifications cache cleared");

										application.token.set(null);
										log.send("logout > Removed account token");

										application.userInfo.data.set(null);
										log.send("logout > Userinfo cache cleared");

										state.syncing.set(false);
										log.send("logout > Stopping pending/active manual sync");

										ctx.toast.success("Logged out of simklsync");
										log.sendSuccess("logout > Logged out of simklsync");

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
					tray.flex([notification, profileDropdown], { gap: 2 }),
				]);

				const body = tray.stack(
					[
						tray.div(
							[
								tray.text("Welcome,", { className: "font-semibold" }),
								tray.text(cachedUserInfo?.user.name ?? "Username", { className: "font-bold text-3xl line-clamp-1", style: { maxWidth: "25rem" } }),
							],
							{ className: "relative rounded p-3 mb-3 bg-gray-700" },
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
									description: "Manually sync AniList and SIMKL trackers",
									className: "max-w-2xl",
									items: [
										tabs.select({
											heading: "Direction",
											description: "Choose which tracker to sync to and from",
											fieldRef: fieldRefs.manageListJobType,
											disabled: state.syncing.get() || state.cancellingSync.get(),
											options: [
												{
													title: "Sync to SIMKL",
													desc: "Bring your AniList entries over to SIMKL",
													icon: icons.get("simkl_logo", { fill: "#9f92ff" }),
													value: ManageListJobType.Import,
												},
												{
													title: "Sync to AniList",
													desc: "Bring your SIMKL entries over to AniList (coming soon)",
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
											onClick: ctx.eventHandler("simklsync:manage-list-start-job", () => {
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
								onChange: ctx.eventHandler("simklsync:skip-adult", (e) => {
									$storage.set("simklsync:options-skipAdult", e.value);
								}),
							}),
							tray.switch("Disable badge for non-critical notifications", {
								fieldRef: fieldRefs.suppressNotificationBadge,
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("simklsync:suppress-notification-badge", (e) => {
									$storage.set("simklsync:options-suppressnotificationbadge", e.value);
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
											href: `https://github.com/nnotwen/n-seanime-extensions/blob/master/plugins/simklsync/${item.slug}.md`,
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

		ctx.effect(() => {
			const playbackstate = application.playback.state.get();
			const isPlaying = application.playback.playing.get();

			if (!playbackstate) return log.sendWarning(`scrobbler > ${isPlaying ? "start" : "stop"} signal received but playback state was null.`);

			if (typeof playbackstate.episode !== "number")
				return log.sendWarning(
					`scrobbler > ${isPlaying ? "start" : "stop"} signal received but invalid episode type. Expected 'number' received '${typeof playbackstate.episode}' (${playbackstate.episode})`,
				);

			const payload: $simkl.ScrobbleRequestBody = {
				anime: { ids: { anilist: playbackstate.anilistId } },
				progress: playbackstate.progress,
				episode: { number: playbackstate.episode },
			};

			if (!isPlaying) {
				log.send("scrobbler > stopping playback scrobbler.");
				application.playback.state.set(null);

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
						if (playbackstate.progress > 80)
							notifications.push({
								title: playbackstate.title,
								body: {
									status,
									type: "progress",
									metadata: { image: playbackstate.coverImage },
									payload: { progress: (playbackstate.episode ?? 1).toString() },
								},
							});
					});
			} else {
				log.send(`scrobbler > scrobbling ${playbackstate.title} episode="${playbackstate.episode ?? "N/A"}" season=${playbackstate.season ?? "N/A"}`);

				const action = playbackstate.paused ? "pause" : "start";
				log.send(`scrobbler > sending request="POST" @api/scrobble/${action} payload=${JSON.stringify(payload)}`);
				application.playback
					.scrobble(action, payload)
					.then(() => log.sendSuccess("scrobbler > request accepted"))
					.catch((err) => log.sendError(`scrobbler > ${err.message}`));
			}
		}, [application.playback.playing]);

		// Fires every 1-3 seconds, updates the application.playback.state data
		ctx.playback.registerEventListener(async (event) => {
			if (event.isVideoCompleted || event.isVideoStopped || event.isStreamCompleted || event.isVideoStopped) {
				application.playback.playing.set(false);
			}

			if (!application.playback.state.get()) {
				application.playback.state.set({
					anilistId: event.state.mediaId ?? null,
					progress: event.status.completionPercentage * 100,
					paused: event.status.paused,
					title: event.state.mediaTitle,
					episode: event.state.episodeNumber,
					coverImage: event.state.mediaCoverImage,
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

		// video-resumed always fires on playback start
		ctx.videoCore.addEventListener("video-resumed", async (event) => {
			application.playback.playing.set(true);
			const ps = ctx.videoCore.getPlaybackState();
			if (!ps) return log.sendError("videocore-video-resumed emitted but playback state was undefined");

			const playbackState = {
				anilistId: ps.playbackInfo.media?.id!,
				progress: (event.currentTime / event.duration) * 100,
				paused: false,
				title: ps.playbackInfo.media?.title?.userPreferred!,
				episode: ps.playbackInfo.episode?.episodeNumber!,
				coverImage: ps.playbackInfo.media?.coverImage?.large!,
			};

			application.playback.state.set(playbackState);
		});

		// video-ended fires when playback reaches eof
		ctx.videoCore.addEventListener("video-completed", async (event) => {
			application.playback.playing.set(false);
		});

		ctx.videoCore.addEventListener("video-terminated", async (event) => {
			application.playback.playing.set(false);
		});

		function $_wait(ms: number): Promise<void> {
			return new Promise((resolve) => ctx.setTimeout(resolve, ms));
		}

		function generateRandomUUID() {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
				((((Math.random() * 16) | 0) & (c == "x" ? 15 : 3)) | (c == "x" ? 0 : 8)).toString(16),
			);
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
			const month = date.month ?? 1; // default to January if missing
			const day = date.day ?? 1; // default to 1st if missing

			return new Date(Date.UTC(year, month - 1, day)).toISOString();
		}

		function normalizeStatus(status: $app.AL_MediaListStatus) {
			if (status === undefined || status === null) return undefined;
			const map: Record<typeof status, $simkl.SimklStatus> = {
				COMPLETED: "completed",
				CURRENT: "watching",
				DROPPED: "dropped",
				PAUSED: "hold",
				PLANNING: "plantowatch",
				REPEATING: "watching",
			};
			return map[status];
		}

		function getAnilistEntries(mediaType: "Anime" | "Manga") {
			return ($anilist[`get${mediaType}Collection`](false).MediaListCollection?.lists ?? [])
				.flatMap((list) => list.entries)
				.filter((entry): entry is $app.AL_AnimeCollection_MediaListCollection_Lists_Entries => !!entry && !isCustomSource(entry.id))
				.map((entry) => {
					const { media, ...rest } = entry;
					return {
						...rest,
						title: media?.title?.userPreferred,
						mediaId: media?.id,
						format: media?.format,
						episodes: media?.episodes,
						coverImage: media?.coverImage?.large,
					};
				});
		}

		function isCustomSource(mediaId?: number) {
			return (mediaId ?? 0) >= 2 ** 31;
		}

		function getMedia(mediaId: number) {
			return getAnilistEntries("Anime").find((e) => e.mediaId === mediaId);
		}

		async function syncEntries() {}

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

			const entry = getMedia(data.mediaId);
			if (!entry) return log.sendWarning(`update > AnimeMedia not found (${data.mediaId})`);
			if (unwrap(getAnilistEntries("Anime").find((x) => x.mediaId === data.mediaId)?.private)) {
				return log.sendWarning(`update > ${entry.title ?? "anilist-id/" + data.mediaId} is private. Skipping...`);
			}

			const notif_body: $simkl.Notification["body"] = {
				type: "update",
				status: "error",
				payload: {},
				metadata: { image: entry.coverImage },
			};

			if (data.status === "PLANNING") {
				notif_body.payload.added_in = "watchlist";
				await application.list
					.addToWatchlist({ anime: [{ to: "plantowatch", ids: { anilist: e.mediaId! } }] })
					.then((data) => {
						if (data.added.movies || data.added.shows) notif_body.status = "success";
						log.sendSuccess(`update > request="POST" @api/sync/add-to-list response=${JSON.stringify(data)}`);
					})
					.catch((err) => log.sendError(`update > request="POST" @api/sync/add-to-list error=${(err as Error).message}`));
			} else {
				notif_body.payload.added_in = "history";
				const payload: NonNullable<$simkl.UpdatePayload["anime"]>[number] = { ids: { anilist: e.mediaId } };

				if (data.status) payload.status = normalizeStatus(data.status);
				if (data.progress) payload.episodes = Array.from({ length: data.progress }, (_, idx) => ({ number: idx + 1 }));
				if (data.scoreRaw) payload.rating = Math.round(data.scoreRaw / 10);

				await application.list
					.addToHistory({ anime: [payload] })
					.then((r_data) => {
						notif_body.status = "success";
						if (r_data.added.episodes) notif_body.payload.progress = `${data.progress! - r_data.added.episodes} -> ${data.progress}`;
						if (data.scoreRaw) log.sendSuccess(`update > request="POST" @api/sync/history response=${JSON.stringify(r_data)}`);
					})
					.catch((err) => log.sendError(`update > request="POST" @api/sync/history error=${(err as Error).message}`));
			}

			return notifications.push({
				title: entry.title ?? e.mediaId!.toString(),
				body: notif_body,
			});
		});

		$store.watch("POST_DELETE_ENTRY", async (e: Omit<$app.PostDeleteEntryEvent, "next">) => {
			if (!e.mediaId) return log.sendWarning("delete > missing mediaId");

			if (fieldRefs.disableSyncing.current) return log.sendWarning(`delete > Syncing was disabled. Will not sync anilist/${e.mediaId}`);

			const entry = await getMedia(e.mediaId);
			if (!entry) return log.sendWarning(`delete > AnimeMedia not found (${e.mediaId})`);

			let status = "error";
			await application.list
				.removeFromList({ anime: [{ ids: { anilist: entry.mediaId! } }] })
				.then((data) => {
					log.sendSuccess(`delete > request="POST" @api/sync/history/remove response=${JSON.stringify(data)}`);
					status = data.deleted.anime !== 0 ? "success" : "error";
				})
				.catch((err) => log.sendError(`delete > request="POST" @api/watchlist/remove error=${(err as Error).message}`));

			notifications.push({
				title: entry.title ?? e.mediaId!.toString(),
				body: {
					type: "delete",
					status: status as "error" | "success",
					metadata: { image: entry.coverImage },
					payload: {},
				},
			});
		});

		tray.render(() => tabs.get());

		ctx.effect(() => {
			if (application.userInfo.data.get() === null) return tray.updateBadge({ number: 1, intent: "alert" });
			if (state.syncing.get()) return tray.updateBadge({ number: 1, intent: "alert" });
			if (notifications.unreads.get() > 0 && fieldRefs.suppressNotificationBadge.current === false)
				return tray.updateBadge({ number: notifications.unreads.get(), intent: "warning" });
			return tray.updateBadge({ number: 0 });
		}, [application.userInfo.data, state.syncing, notifications.unreads]);

		// Authenticate
		log.send("init > Initializing extension...");
		log.send("init > Checking availability of access tokens...");
		state.loggingIn.set(true);
		tray.updateBadge({ number: 1, intent: "alert" });

		if (application.token.accessToken.get() !== null) {
			log.sendSuccess("login > Access token found!");
			log.sendInfo("login > Fetching user info...");
			return application.userInfo
				.fetch()
				.then((data) => {
					log.sendSuccess("login > Successfully fetched user info!");
					log.send(`login > Signed in as: ${data.user.name}!`);
					if (!data.user.avatar) log.sendWarning("login > No user avatar detected! Reverting to default...");
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

		log.sendWarning("login > Refresh token not found!");
		log.sendWarning("login > User authentication required.");
		tabs.current.set(Tab.Logon);
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

	// Simkl doesnt process repeat data;

	$app.onPostDeleteEntry((e) => {
		$store.set("POST_UPDATE_DELETE", $clone(e));
		e.next();
	});
}
