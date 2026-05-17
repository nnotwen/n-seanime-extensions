/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />
/// <reference path="./shikimorisync.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {
		const iconUrl = "https://shikimori.io/favicons/favicon-96x96.png";
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
				person: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#cacaca" viewBox="0 0 16 16">
						<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
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
				shikimori_logo: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="#cacaca">
                        <path d="M2.803.003c-.025.027.03.12.18.297.098.113.16.233.233.444.055.16.12.316.145.347.036.049.04.037.042-.11V.818l.218.3c.331.457.537.7.675.798.07.046.113.092.095.098-.049.015-.478-.221-.678-.374a1.2 1.2 0 0 0-.211-.141c-.015 0-.065-.046-.107-.102a1 1 0 0 0-.206-.19c-.171-.119-.352-.29-.395-.373C2.763.772 2.668.732 2.668.78c0 .05.245.377.435.58.583.622 1.178.932 2.769 1.428.337.105.635.209.662.233a.2.2 0 0 0 .108.04.25.25 0 0 1 .104.03c.04.025.036.032-.01.032q-.055 0-.046.055.015.083.448.144c.129.018.16.012.16-.024 0-.05-.09-.083-.221-.083-.05 0-.086-.016-.086-.03 0-.02.03-.026.07-.02.037.01.166.03.282.052.276.046.353.077.353.135 0 .065.083.092.138.046q.046-.04.046-.003c0 .019.015.034.03.034.019 0 .031-.021.031-.046 0-.058-.03-.058.485.021.306.046.42.077.374.093-.098.036-.043.085.095.085.07 0 .12.016.12.034 0 .028.07.03.244.018.16-.012.252-.009.264.013.013.018.065.027.12.018.052-.01.196.003.312.025.307.058 1.132.104 2.977.169 2.983.104 5.157.327 5.973.615.362.13.908.405 1.009.51.16.168.208.306.19.533a.8.8 0 0 0 0 .224c.089.089.285-.086.285-.254 0-.034.064-.117.147-.188.33-.29.38-.454.343-1.119-.024-.448-.03-.478-.23-1.134-.26-.859-.321-.99-.634-1.322-.368-.386-.702-.607-1.16-.763a18 18 0 0 1-.52-.19c-.249-.098-.427-.141-.788-.193-.512-.074-1.613-.126-1.956-.092-.123.012-.614 0-1.15-.034-.61-.033-.984-.046-1.073-.027a2 2 0 0 1-.295.03.4.4 0 0 0-.29.098c-.126.092-.215.12-.565.178-.564.092-.929.165-1.082.218-.12.043-.316.07-.62.089-.83.052-1.302.095-1.407.129-.07.021-.34.027-.79.018-.55-.012-.69-.006-.718.028-.028.03-.015.04.058.04.181 0 1.797.125 1.812.14s-.273.003-1.097-.049a3 3 0 0 0-.472-.01c-.059.038-.494.032-.911-.011a10 10 0 0 1-1.472-.255 4 4 0 0 0-.644-.1C4.547.952 4.198.838 3.704.59 3.379.43 3.343.423 3.343.554v.101L3.244.533a1.2 1.2 0 0 1-.15-.23c-.055-.117-.26-.328-.291-.3M3.26 3.19c-.57.027-1.094.47-1.47 1.263-.224.475-.264.66-.279 1.291-.012.497-.006.598.064 1.012.15.861.19.962.506 1.272.334.331 1.165.785 1.628.89.16.033.347.076.414.094.258.065.61.089 1.487.101.843.015.914.013 1.027-.043.08-.04.249-.07.49-.088.203-.019.417-.046.476-.065a1.4 1.4 0 0 1 .276-.03c.095 0 .19-.019.208-.037.074-.074.423-.15.757-.169.187-.01.362-.027.393-.043.101-.055.052-.086-.113-.067a.5.5 0 0 1-.221-.016c-.05-.03-.034-.033.082-.036.077 0 .227-.01.335-.022.165-.015.184-.025.138-.058-.114-.083-.015-.104.493-.104.457 0 .59-.022.454-.074a1.2 1.2 0 0 0-.252-.022c-.113-.003-.162-.012-.113-.015.052-.006.163-.027.252-.043.086-.018.625-.04 1.196-.046.57-.006 1.054-.012 1.075-.015q.041-.001.022-.061c-.012-.044-.006-.062.027-.062.025 0 .083-.049.13-.107.091-.12.116-.114.155.043l.028.101.22.01c.176.006.234-.004.292-.047a.5.5 0 0 1 .184-.076l.114-.022-.019.178c-.018.144-.015.172.022.16a3 3 0 0 1 .22-.056l.175-.033-.067-.09a.4.4 0 0 0-.194-.116l-.122-.03.184-.007a5 5 0 0 1 .3 0c.065.003.114-.009.114-.027s-.018-.034-.037-.037c-.021-.003-.089-.006-.147-.01a.7.7 0 0 1-.215-.073.4.4 0 0 0-.159-.067c-.03 0-.055-.016-.055-.03 0-.022.092-.031.254-.025.248.009.252.009.26.092.013.095.013.095.08.067a.05.05 0 0 0 .031-.058c-.018-.049.037-.09.083-.059.018.01.092.022.16.028.165.01.971.074 1.18.095.11.012.159.03.159.062 0 .052.037.054.083.008.024-.024.144-.02.435.007.356.034.402.043.402.095q-.002.054.07.058c.037 0 .166.012.282.025.12.012.233.018.252.009.021-.007.089-.098.15-.202.12-.2.221-.326.26-.326.016 0 .019.022.01.047-.013.024-.003.046.015.046.022 0 .034.024.028.052-.006.036.021.058.092.073.113.025.165.058.089.058-.028 0-.053.019-.053.04s.181.099.445.184c.282.095.444.163.444.19 0 .03-.095.01-.358-.08-.625-.214-.898-.26-.898-.153 0 .046.049.068.285.123.153.037.3.064.325.064a.34.34 0 0 1 .129.074c.049.043.294.144.563.233.273.092.516.19.565.233a.8.8 0 0 0 .193.116c.193.083.47.331.678.61.3.405.297.39.131.39-.076 0-.294-.022-.484-.046a7 7 0 0 0-.53-.05c-.215-.005-1.969.028-2.625.05l-.445.015-.07-.15a1.6 1.6 0 0 0-.254-.331c-.175-.172-.184-.175-.224-.117-.025.034-.117.163-.206.282l-.162.224-.2.007c-.11 0-.223.003-.25 0-.068-.006-.071.03-.01.144l.043.085-.313.022c-.852.058-2.66.282-3.268.408a4.5 4.5 0 0 1-.678.052c-.46.006-.502.018-.794.187-.052.027-.092.034-.129.015q-.052-.03-.085.012c-.034.04-.144.058-.954.144-.178.019-.475.059-.665.09-.331.054-.35.054-.524 0-.184-.059-.758-.136-1.248-.17l-.276-.021-.162.147a2.5 2.5 0 0 0-.286.307c-.092.125-.14.166-.2.166-.125 0-1.244.174-2.056.321-.877.16-1.208.19-1.466.138-.266-.055-.27-.058-.257-.395.012-.285.009-.294-.065-.331-.168-.086-.33-.037-.551.162a.28.28 0 0 1-.2.068.8.8 0 0 0-.3.08l-.181.082.009.16a.5.5 0 0 1-.022.217c-.024.037-.03.2-.018.47.012.327.003.447-.04.606l-.052.197.147.208c.295.414.503.73.503.763 0 .019.092.117.208.218.506.445.721.565 1.218.669.527.113.613.107.941-.068a2.5 2.5 0 0 0 .39-.257c.08-.074.306-.194.742-.387.677-.3.763-.334.763-.294 0 .012.043.426.095.914.107 1.023.14 2.005.095 2.759-.037.592-.064.674-.481 1.46-.647 1.216-1.423 2.394-2.008 3.047-.105.12-.264.325-.353.46-.169.254-.481.595-.871.944-.132.12-.218.22-.208.245.009.025.104.074.211.11.105.04.206.083.224.099.049.049.11.03.337-.092l.22-.123.09.062c.107.07.3.076.463.015.064-.025.193-.052.288-.058.19-.019.313-.07.512-.224a.8.8 0 0 1 .215-.12c.089-.018.858-.797 1.27-1.288.128-.15.45-.49.72-.754.377-.374.545-.515.76-.644.31-.183.555-.407.585-.539a1 1 0 0 1 .092-.212c.095-.162.203-.579.175-.683a1.3 1.3 0 0 0-.101-.233c-.08-.141-.086-.19-.101-.583-.028-.69-.138-1.051-.488-1.594-.202-.313-.251-.423-.377-.828-.208-.696-.27-1.35-.165-1.861.049-.255.073-.288.279-.408.107-.064.248-.165.316-.227l.125-.116.595-.068c.328-.04.696-.088.812-.113.12-.024.383-.08.586-.12.205-.042.497-.116.647-.165.15-.052.362-.114.472-.138.215-.05.947-.12.972-.095.009.01.018.448.015.975 0 .828-.009 1.052-.08 1.662a22 22 0 0 0-.174 2.526c-.028 1.146-.037 1.198-.224 1.333-.135.098-.273.08-.68-.1a39 39 0 0 0-.951-.393 18 18 0 0 1-1.003-.441c-.233-.117-.423-.203-.423-.194s.117.16.26.334c.145.175.261.325.261.334s-.027.02-.064.02c-.055 0-.058.005-.015.063.027.04.036.101.027.166-.012.083-.003.11.058.15.04.028.105.104.145.172a.7.7 0 0 0 .14.177.7.7 0 0 1 .133.163c.03.058.134.166.233.24a.9.9 0 0 1 .21.208c.02.046.109.113.213.165.242.123.597.436.655.574.034.085.102.153.298.282.157.104.432.343.739.647.558.551.589.57 1.042.542.295-.021.442-.076.617-.236.07-.064.156-.132.187-.15a.8.8 0 0 0 .165-.2.8.8 0 0 1 .193-.22c.129-.077.359-.402.359-.506 0-.153.058-.251.26-.441.178-.166.215-.221.326-.494.172-.417.232-.687.288-1.223.067-.662.061-1.462-.015-1.962-.126-.816-.604-3.088-.748-3.542-.12-.377-.233-.867-.233-1.008 0-.034.064-.037.315-.022.23.016.41.01.675-.03.312-.046.42-.05.75-.019.212.019.393.04.4.05.024.02.496 1.557.576 1.87.165.64.169.686.202 2.299.016.843.03 1.843.037 2.223.006.64.012.71.089.993.098.359.205.592.426.91.089.127.224.347.3.488.154.285.353.521.61.717.338.261.666.473.868.565.243.11.439.285.632.558.08.11.193.26.254.337.062.077.138.193.172.26.058.123.077.136.408.234.153.046.576.055.812.015.132-.022.181-.052.393-.258.285-.276.42-.469.42-.607 0-.214.03-.279.156-.328q.12-.047.12-.104c0-.193-.203-.972-.307-1.175-.068-.134-.947-1.324-1.686-2.283-.785-1.015-1.061-1.457-1.224-1.935-.052-.163-.248-1.276-.37-2.143a8.4 8.4 0 0 0-.531-1.922c-.092-.233-.156-.423-.141-.423.074 0 1.653.441 1.745.487.058.03.297.16.527.288.23.132.454.236.493.236.046 0 .24.108.466.26l.39.262.202-.016c.292-.028.346-.04.47-.126.174-.12.278-.138.416-.073.267.126.451.147.289.034-.243-.17-.267-.252-.126-.464.169-.257.187-.275.361-.364.28-.141.298-.175.39-.678.043-.245.1-.484.126-.533.07-.148.055-.242-.065-.356a2 2 0 0 1-.23-.291c-.095-.147-.122-.218-.122-.325 0-.12-.013-.144-.101-.2a1.3 1.3 0 0 0-.218-.107c-.132-.046-.337-.263-.31-.324l.034-.083c.025-.062-.224-.197-.47-.255-.244-.058-.241-.058-.198-.107.021-.028.02-.123.002-.3-.092-.84-.432-1.43-.999-1.727a1.2 1.2 0 0 1-.239-.147c-.058-.089-.782-.365-1.18-.447a8 8 0 0 1-.552-.138 5 5 0 0 0-.61-.12c-.457-.043-1.073-.147-1.276-.212a6 6 0 0 0-.533-.12c-.193-.036-.359-.076-.368-.091-.012-.018-.086-.016-.187.003-.117.021-.291.021-.567-.003a16 16 0 0 0-1.196-.031c-.674.003-.858-.006-1.202-.061a5 5 0 0 0-.659-.065c-.337-.003-1.33-.104-1.153-.12.028 0 .12-.017.205-.036.141-.03.15-.037.123-.098-.03-.065-.046-.067-.478-.064-.368 0-.454.009-.481.049-.031.04-.062.043-.197.018-.144-.03-.153-.037-.107-.073.049-.037.05-.046.01-.074a.2.2 0 0 0-.096-.031c-.04 0-1.956-.19-2.753-.273-.157-.018-.294-.036-.303-.049-.01-.009.006-.015.033-.015.03 0 .052-.012.052-.028 0-.046-.156-.058-.37-.024-.15.021-.23.021-.28-.003-.058-.025-.04-.028.093-.015.29.03.168-.04-.139-.077-.165-.022-.337-.043-.38-.05a.5.5 0 0 1-.138-.045c-.03-.019-.368-.077-.748-.129a9 9 0 0 1-.95-.172c-.497-.14-.954-.37-1.217-.607l-.138-.122.049-.117a.86.86 0 0 1 .46-.493c.315-.154.46-.178 1.076-.197.56-.012.693-.036.628-.11-.03-.043-.472-.11-.692-.11-.138 0-.482-.068-.798-.16a1.2 1.2 0 0 0-.4-.049m8.85 2.95a.3.3 0 0 0-.068.006c-.18.03-.285.073-.377.15l-.092.073.147.003a.45.45 0 0 0 .353-.131q.107-.097.037-.1m5.776.951a.5.5 0 0 1 .162.032.6.6 0 0 0 .224.031c.03-.009.067-.003.08.019.015.027-.03.03-.184.015q-.203-.023-.203.009c0 .018.037.04.086.05.224.048.26.073.068.054a6 6 0 0 0-.368-.024c-.16 0-.169.003-.178.08-.01.07-.03.085-.18.116-.206.04-.178.043-.332-.028-.138-.067-.442-.14-.819-.199-.14-.021-.21-.04-.162-.043.052 0 .334.031.629.074.545.077.699.092.665.058a6 6 0 0 0-.534-.12l-.515-.1.3-.004c.264-.003.31.007.39.065.068.049.101.058.126.034.021-.022.113-.028.257-.02.193.016.245.01.353-.048a.4.4 0 0 1 .135-.05m-4.347.513q.024-.001.036.01c.013.01 0 .03-.024.046-.058.037-.083.037-.107.003-.014-.025.05-.057.095-.059m4.987.09q.008-.003.034.037a.15.15 0 0 0 .098.052c.05 0 .053.006.013.03a.2.2 0 0 1-.061.028c-.062-.006-.092-.043-.092-.098q0-.045.008-.049m-3.951.18c-.062 0-.104.053-.104.126 0 .016.07.028.156.028.147 0 .153-.003.116-.052-.06-.08-.098-.101-.168-.101m6.19 1.831c.021-.009.074.012.116.043.068.052.068.058.013.055-.086 0-.184-.076-.13-.098"/>
                    </svg>`,
				shikimori_gylph: /*html*/ `
					<svg xmlns="http://www.w3.org/2000/svg" width="831" height="104.5" viewBox="0 0 813 104.5" fill="#cacaca">
						<path d="M32.039 87.301q2.734 0 5.417-.545 2.693-.544 4.781-1.836a10.54 10.54 0 0 0 3.37-3.349q1.29-2.038 1.291-5.044 0-3.612-1.866-6.133-1.876-2.523-4.943-4.469-3.067-1.937-6.961-3.571a1225 1225 0 0 1-7.969-3.41 81 81 0 0 1-7.98-3.995 31.3 31.3 0 0 1-6.95-5.346q-3.067-3.137-4.943-7.465T3.41 31.808q0-7.021 2.723-12.751 2.735-5.72 7.778-9.714 5.044-3.985 12.267-6.164Q33.4.999 42.338 1q2.311 0 5.549.171 3.237.162 6.89.575 3.641.414 7.464 1.06a79 79 0 0 1 7.365 1.604l-3.955 17.381-1.16.545a52 52 0 0 0-6.073-2.321 64 64 0 0 0-5.962-1.563 54 54 0 0 0-5.447-.888q-2.562-.272-4.54-.272-6.132 0-9.744 2.451t-3.612 7.364q0 3.541 1.867 6.002 1.875 2.452 4.943 4.358 3.076 1.906 6.99 3.481a217 217 0 0 1 7.98 3.369 92 92 0 0 1 7.969 4.025 30.7 30.7 0 0 1 6.991 5.387q3.067 3.166 4.943 7.566 1.876 4.397 1.876 10.461 0 7.232-2.764 13.093t-7.939 10.018q-5.185 4.156-12.61 6.446-7.434 2.28-16.705 2.28-3.339 0-7.263-.343a91 91 0 0 1-8.181-1.09 87 87 0 0 1-8.615-1.977A65.5 65.5 0 0 1 0 97.116l3.884-17.452 1.432-.676a354 354 0 0 0 7.536 3.34q3.51 1.493 6.749 2.622a48 48 0 0 0 6.304 1.735q3.067.616 6.134.616M810.295 2.362v99.869h-27.681V2.362zm-90.878 63.876h-10.764v35.993h-27.681V2.362h38.374q10.502 0 18.138 2.108 7.636 2.118 12.61 5.7 4.983 3.57 7.333 8.241 2.35 4.672 2.351 9.715 0 4.71-1.776 8.827a33.4 33.4 0 0 1-4.569 7.636 47.6 47.6 0 0 1-6.164 6.416 97 97 0 0 1-6.517 5.145l27.55 46.081h-31.978Zm-10.764-47.584v32.654h15.535q1.573-.888 3.178-2.391 1.593-1.494 2.855-3.571 1.26-2.089 2.047-4.711t.787-5.821q0-3.48-1.029-6.416-1.018-2.924-2.996-5.114-1.977-2.18-4.872-3.4-2.894-1.23-6.719-1.23Zm-100.555 84.939q-11.046 0-20.387-3.269-9.342-3.279-16.12-9.583-6.78-6.306-10.603-15.475-3.813-9.17-3.813-20.962 0-12.065 3.985-21.881 3.985-9.815 11.217-16.806 7.223-6.98 17.21-10.804Q599.574 1 611.639 1q11.045 0 20.387 3.268 9.341 3.268 16.121 9.543 6.779 6.276 10.602 15.445 3.813 9.17 3.813 20.962 0 12.065-4.015 21.911-4.025 9.855-11.217 16.846-7.194 6.98-17.21 10.804-10.028 3.814-22.022 3.814m2.381-16.292q5.87 0 10.3-2.865 4.428-2.865 7.394-7.637 2.965-4.77 4.469-10.935 1.492-6.174 1.493-12.852 0-7.162-1.705-13.638-1.705-6.477-4.903-11.379-3.207-4.913-7.838-7.808-4.641-2.895-10.431-2.895-5.861 0-10.259 2.865-4.398 2.854-7.364 7.626-2.966 4.782-4.469 10.975-1.494 6.205-1.493 12.822 0 7.162 1.695 13.639 1.705 6.465 4.882 11.379 3.168 4.913 7.768 7.808t10.461 2.895m-175.466 14.93h-23.181l8.05-99.869h38.646l11.591 45.95 3.884 20.306h1.361l4.368-20.377 11.521-45.879h41.511l8.05 99.869h-30.273l-2.522-63.473-.061-19.217h-1.705l-4.297 18.673-16.494 62.039h-25.36l-16.504-61.898-4.428-18.814h-1.705v19.086zM390.706 2.362v99.869h-27.681V2.362zm-42.68 99.869h-33.27l-31.564-50.449 36.679-49.42h25.36l-35.589 42.873z" /><path d="M283.323 2.362v99.869h-27.681V2.362zm-50.856 0v99.869h-27.68V2.362zm-115.754 99.869h-27.68V2.362h27.68v40.29h37.214V2.362h27.681v99.869h-27.681V58.944h-37.214z"/>
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
			skipAdult: ctx.fieldRef<boolean>($storage.get("shikimori:options-skipAdult")?.valueOf() ?? false),
			suppressNotificationBadge: ctx.fieldRef<boolean>($storage.get("shikimori:options-suppressnotificationbadge")?.valueOf() ?? false),
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

		const log = {
			id: "shikimori:f9e08ae1-6a98-4ad8-b832-5cde59c7e94c",
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

		const notifications: $shikimorisync.NotificationManager = {
			id: "159ea4fe-5a29-485c-96a6-d236c0f04876",
			unreads: ctx.state<number>(0),
			get entries() {
				return this.modalOpened.get() ? ($storage.get<$shikimorisync.NotificationManager["entries"]>(this.id) ?? []) : undefined;
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
					: tray.text("Нет уведомлений", { className: "text-center p-5 text-xl font-semibold text-[--muted] border rounded-lg" });

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
				const entries = Object.entries(targetObj ?? {});

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
												notifications.unreads.set(($storage.get(notifications.id) ?? []).filter((x: $shikimorisync.Notification) => x.unread).length);
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
														const entries = $storage.get<$shikimorisync.NotificationManager["entries"]>(notifications.id);
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
		notifications.unreads.set(($storage.get<$shikimorisync.NotificationManager["entries"]>(notifications.id) ?? []).filter((x) => x.unread).length);

		const application = {
			clientId: "93Vlloacsr3lOZzD8Ttx3F7E4Pv9wUlLqaAuE9XcOhQ",
			clientSecret: "x49dnkFMduxIseuDSQE4g2mDjo9Nc8qCGMpIVe7mtKs",
			userAgent: "Shikimori Seanime Sync",
			redirectUri: "urn:ietf:wg:oauth:2.0:oob",
			baseUri: "https://shikimori.io/api",
			baseUriv2: "https://shikimori.io/api/v2",
			baseUriGraphQL: "https://shikimori.io/api/graphql",
			token: {
				baseUri: "https://shikimori.io/oauth/token",
				accessToken: ctx.state<string | null>($storage.get("shikimorisync.accessToken") ?? null),
				refreshToken: ctx.state<string | null>($storage.get("shikimorisync.refreshToken") ?? null),
				expiresAt: ctx.state<number | null>($storage.get("shikimorisync.expiresAt") ?? null),

				set(data: $shikimorisync.RequestAccessTokenResponse | null) {
					const expiresAt = data ? Date.now() + data.expires_in * 1000 : null;

					$storage.set("shikimorisync.accessToken", data?.access_token ?? null);
					$storage.set("shikimorisync.refreshToken", data?.refresh_token ?? null);
					$storage.set("shikimorisync.expiresAt", expiresAt);

					this.accessToken.set(data?.access_token ?? null);
					this.refreshToken.set(data?.refresh_token ?? null);
					this.expiresAt.set(expiresAt);
				},

				generateAuthUrl() {
					const url = new URL("https://shikimori.io/oauth/authorize");
					url.searchParams.set("client_id", application.clientId);
					url.searchParams.set("redirect_uri", application.redirectUri);
					url.searchParams.set("response_type", "code");
					url.searchParams.set("scope", "user_rates");

					return url.toString();
				},

				getAccessToken() {
					const token = this.accessToken.get();
					const expiry = this.expiresAt.get();
					if (!token || !expiry) return null;
					if (Date.now() > expiry) return null;
					return token;
				},

				async exchangeCode(code: string) {
					const res = await ctx.fetch(this.baseUri, {
						method: "POST",
						headers: { "User-Agent": application.userAgent, "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							grant_type: "authorization_code",
							client_id: application.clientId,
							client_secret: application.clientSecret,
							code,
							redirect_uri: application.redirectUri,
						}),
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

					const data: $shikimorisync.RequestAccessTokenResponse = await res.json();
					this.set(data);
					return data;
				},

				async refresh() {
					if (!this.refreshToken.get()) throw new Error("No refresh token available");

					const res = await ctx.fetch(this.baseUri, {
						method: "POST",
						headers: { "User-Agent": application.userAgent, "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							grant_type: "refresh_token",
							client_id: application.clientId,
							client_secret: application.clientSecret,
							refresh_token: this.refreshToken.get()!,
						}),
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

					const data: $shikimorisync.RequestAccessTokenResponse = await res.json();
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
				cache: ctx.state<$shikimorisync.WhoAmI | null>(null),
				async fetch() {
					const res = await application.fetch("v1", "/users/whoami", { method: "GET" });
					if (!res.ok) {
						let err = null;
						try {
							err = res.json();
						} catch {
							err = null;
						}
						throw new Error(err?.message || err?.error || res.statusText);
					}

					const data: $shikimorisync.WhoAmI = await res.json();
					this.cache.set(data);
					return data;
				},
			},
			list: {
				cache: {
					fetching: ctx.state<boolean>(false),
					animeModalOpened: ctx.state<boolean>(false),
					mangaModalOpened: ctx.state<boolean>(false),
					get anime() {
						return $store.get("shikimori:cache:anime") as $shikimorisync.UserRateResponse[] | undefined;
					},
					get manga() {
						return $store.get("shikimori:cache:manga") as $shikimorisync.UserRateResponse[] | undefined;
					},
				},
				async getUserRate(target_id: number, type: "Anime" | "Manga") {
					const res = await application.fetch(
						"v2",
						`user_rates?target_id=${target_id}&target_type=${type}&user_id=${application.userInfo.cache.get()?.id}`,
					);

					if (!res.ok) throw new Error(res.statusText);

					const data = await res.json();
					return Array.isArray(data) && data.length > 0 ? (data[0] as $shikimorisync.UserRateResponse) : null;
				},
				async favorite(action: "add" | "remove", linked_type: "Anime" | "Manga", linked_id: number) {
					const res = await application.fetch("v1", `favorites/${linked_type}/${linked_id}`, {
						method: action === "add" ? "POST" : "DELETE",
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

					return res.json() as { success: boolean; notice: string };
				},
				async patch(id: number, body: $shikimorisync.UserRatePatchOrPutBody) {
					const res = await application.fetch("v2", `user_rates/${id}`, {
						method: "PATCH",
						body: JSON.stringify(body),
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

					return res.json() as $shikimorisync.UserRateResponse;
				},
				async post(body: $shikimorisync.UserRateCreateBody) {
					const res = await application.fetch("v2", "user_rates", {
						method: "POST",
						body: JSON.stringify({ user_rate: { ...body.user_rate, user_id: application.userInfo.cache.get()?.id } }),
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

					return res.json() as $shikimorisync.UserRateResponse;
				},
				async delete(id: number) {
					const res = await application.fetch("v2", `user_rates/${id}`, {
						method: "DELETE",
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

					return res.status === 204;
				},
				async fetchAll(type: "Anime" | "Manga") {
					application.list.cache.fetching.set(true);
					const user_id = application.userInfo.cache.get()?.id;
					const res = await application.fetch("v2", `user_rates/?${user_id ? `user_id=${user_id}&` : ""}target_type=${type}`);
					application.list.cache.fetching.set(false);
					if (!res.ok) throw new Error(`Request failed with status ${res.statusText}`);

					const json: $shikimorisync.UserRateResponse[] = res.json();
					$store.set(`shikimori:cache:${type.toLowerCase()}`, json);
					return json;
				},
			},

			async withAuthHeaders(): Promise<Record<string, string>> {
				if (!application.token.getAccessToken()) await application.token.refresh();

				return {
					Authorization: `Bearer ${application.token!.accessToken.get()}`,
					"Content-Type": "application/json",
					"User-Agent": application.userAgent,
				};
			},

			async fetch(version: "v1" | "v2" | "graphql", endpoint: string, init: RequestInit = {}) {
				const uris: Record<typeof version, string> = {
					v1: application.baseUri,
					v2: application.baseUriv2,
					graphql: application.baseUriGraphQL,
				};

				const res = await ctx.fetch(uris[version] + "/" + endpoint.replace(/^\/+/, ""), {
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
			logo: "https://shikimori.io/assets/layouts/l-top_menu-v2/logo.svg",
			glyph: "https://shikimori.io/assets/layouts/l-top_menu-v2/glyph.svg",
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
				const CANCEL_BUTTON = tray.button("Отменить", {
					intent: "gray-subtle",
					className: "w-fit",
					onClick: ctx.eventHandler("modal:cancel", () => tabs.currentOverlay.set(null)),
				});
				const CONFIRM_BUTTON = tray.button("Да", {
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
											tray.text(option.title, { className: "font-medium text-pretty break-normal" }),
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
					title: "Логи Shikimori",
					className: "max-w-5xl",
					onOpenChange: ctx.eventHandler(generateRandomUUID(), ({ open }) => log.modalOpened.set(open)),
					items: [
						tray.button("Копировать в буфер обмена", {
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
			[Tab.logon]() {
				// login details
				const error = state.loginError.get()
					? tray.text(state.loginError.get() ?? "", {
							className: "break-normal bg-red-600/70 text-red-100 text-sm border border-red-500 rounded-md mb-4 px-2 py-1 line-clamp-3",
						})
					: [];

				const info = tray.text("Нажмите кнопку ниже, чтобы авторизовать приложение, затем скопируйте токен с сайта и вставьте его в поле ниже.", {
					style: {
						textAlign: "center",
						wordBreak: "normal",
					},
				});

				const authButton = tray.anchor({
					text: "Авторизовать ",
					href: application.token.generateAuthUrl(),
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
					placeholder: "Код авторизации",
					fieldRef: fieldRefs.authCode,
					disabled: state.loggingIn.get(),
					style: {
						color: "var(--background)",
						background: "var(--foreground)",
						borderRadius: "0.5rem",
					},
				});

				const login = tray.button({
					label: "Войти",
					intent: "primary",
					size: "md",
					loading: state.loggingIn.get(),
					style: {
						width: "100%",
					},
					onClick: ctx.eventHandler("shikimori:login", async () => {
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
					tray.button("Открыть журналы", {
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
										style: { backgroundImage: `url(${icons.get("shikimori_logo")})` },
										className: "w-10 h-10 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
									}),
									tray.div([], {
										style: { backgroundImage: `url(${icons.get("shikimori_gylph")})` },
										className: "w-48 h-10 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
									}),
								],
								{
									className: "justify-center",
								},
							),
							tray.text("для Seanime", {
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
					trigger: tray.div([this.button({ icon: icons.get("bell", { ...(ncount > 0 ? { stroke: "#fdba74" } : {}) }), tooltip: "Уведомления" })], {
						className: ncount > 0 ? "animate-bounce" : "",
					}),
					title: "Уведомления Shikimori",
					className: "max-w-xl",
					onOpenChange: ctx.eventHandler("shikimori:notification:modalchange", ({ open }) => notifications.modalOpened.set(open)),
					items: [
						tray.flex([
							tray.button("Отметить все как прочитанные", {
								intent: "gray-subtle",
								size: "md",
								className: "w-fit bg-transparent border",
								style: { borderColor: "var(--border)" },
								disabled: notifications.unreads.get() <= 0,
								onClick: ctx.eventHandler("shikimori:notifications:markread", () => {
									const entries = $storage.get<$shikimorisync.Notification[]>(notifications.id) ?? [];
									$storage.set(
										notifications.id,
										entries.map((e) => ({ ...e, unread: false })),
									);
									notifications.unreads.set(0);
								}),
							}),
							tray.button("Удалить все", {
								intent: "alert-subtle",
								size: "md",
								className: "w-fit",
								disabled: !$storage.get(notifications.id)?.length,
								onClick: ctx.eventHandler("shikimori:notifications:deleteall", () => {
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
							src: cachedUserInfo?.avatar ?? icons.get("person"),
							width: "70%",
							alt: "Profile",
							className: "absolute pointer-events-none rounded-full",
							style: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
						}),
						tray.tooltip(tray.button("\u200b", { className: "w-10 h-10 rounded-full bg-transparent ", intent: "gray-subtle" }), { text: "Профиль" }),
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
											tray.span("Открыть в браузере"),
										]),
									],
									href: cachedUserInfo?.url ?? "",
									className: "no-underline",
								}),
							],
							{ disabled: !cachedUserInfo?.nickname },
						),
						tray.dropdownMenuItem(
							[
								tray.flex([
									tray.div([], {
										className: "w-5 h-5 bg-no-repeat bg-center",
										style: { backgroundImage: `url(${icons.get("power")})` },
									}),
									tray.span("Выйти"),
								]),
							],
							{
								className:
									"disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--red] border bg-red-50 bg-transparent border-transparent hover:bg-red-100 active:bg-red-200 dark:bg-opacity-10 dark:hover:bg-opacity-20",
								onClick: ctx.eventHandler("shikimori:signout:modal", () => {
									// Can't combine tray.dropdown + tray.modal yet
									tabs.confirmationModal("Выход из Shikimori?", "Вы действительно хотите выйти?", "alert", () => {
										log.sendInfo("logout > Logging out");
										state.loggingOut.set(true);

										$storage.remove(notifications.id);
										log.send("logout > Notifications cache cleared");

										application.token.set(null);
										log.send("logout > Removed account token");

										application.userInfo.cache.set(null);
										log.send("logout > Userinfo cache cleared");

										state.syncing.set(false);
										log.send("logout > Stopping pending/active manual sync");

										ctx.toast.success("Logged out of Shikimori");
										log.sendSuccess("logout > Logged out of Shikimori");

										tabs.current.set(Tab.logon);
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
									style: { backgroundImage: `url(${icons.get("shikimori_logo")})` },
									className: "w-10 h-10 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
								}),
								tray.div([], {
									style: { backgroundImage: `url(${icons.get("shikimori_gylph")})` },
									className: "w-48 h-10 bg-contain bg-no-repeat bg-center grow-0 shrink-0",
								}),
							]),
							tray.text("для Seanime", {
								style: { marginTop: "-8px" },
								className: "text-sm ml-12 text-[--muted]",
							}),
						],
						{ className: "flex-1 mt-3", gap: 0 },
					),
					tray.flex([notification, profileDropdown], { gap: 2 }),
				]);

				const body = tray.stack(
					[
						tray.div(
							[
								tray.text("Добро пожаловать,", { className: "font-semibold" }),
								tray.text(cachedUserInfo?.nickname ?? "Username", { className: "font-bold text-3xl line-clamp-1", style: { maxWidth: "25rem" } }),
							],
							{
								className: "relative rounded p-3 mb-3",
								style: { background: "linear-gradient(45deg, #324143ff, #242829ff)" },
							},
						),
						tray.div(
							[
								tabs.logsModal(
									this.button(
										{ icon: icons.get("code"), tooltip: "Просмотреть логи" },
										{ size: "md", className: "bg-no-repeat bg-center p-0", style: { width: "103.5px" } },
									),
								),
								tray.modal({
									trigger: tray.div(
										[
											this.button(
												{ icon: icons.get("refresh"), tooltip: "Выполнить ручную синхронизацию" },
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
									title: "Выполнить ручную синхронизацию",
									description: "Вручную синхронизировать трекеры AniList и Shikimori",
									className: "max-w-2xl",
									items: [
										tabs.select({
											heading: "Направление",
											description: "выберите, откуда и куда синхронизировать",
											fieldRef: fieldRefs.manageListJobtype,
											disabled: state.syncing.get() || state.cancellingSync.get(),
											options: [
												{
													title: "Синхронизировать с Shikimori",
													desc: "перенести ваши записи из AniList в Shikimori",
													icon: icons.get("shikimori_logo", { fill: "#9f92ff" }),
													value: ManageListJobType.Import,
												},
												{
													title: "Синхронизировать с AniList",
													desc: "перенести ваши записи из Shikimori в AniList",
													icon: icons.get("anilist", { fill: "#9f92ff" }),
													value: ManageListJobType.Export,
												},
											],
										}),
										tabs.select({
											heading: "Тип медиа",
											description: "выберите, какой тип контента синхронизировать",
											fieldRef: fieldRefs.manageListMediaType,
											disabled: state.syncing.get() || state.cancellingSync.get(),
											options: [
												{
													title: "Аниме",
													desc: "синхронизировать записи аниме",
													icon: icons.get("play", { fill: "#9f92ff" }),
													value: "Anime",
												},
												{
													title: "Манга",
													desc: "синхронизировать записи манги",
													icon: icons.get("book", { fill: "#9f92ff" }),
													value: "Manga",
												},
											],
										}),
										tabs.select({
											heading: "Тип синхронизации",
											description: "выберите способ синхронизации",
											fieldRef: fieldRefs.manageListSyncType,
											disabled: state.syncing.get() || state.cancellingSync.get(),
											gridCols: 1,
											options: [
												{
													title: "Добавить отсутствующие записи",
													desc: "Добавляет новые элементы из источника, которых нет в вашем целевом списке. Существующие записи остаются без изменений.",
													icon: icons.get("plusCircleDotted", { fill: "#9f92ff" }),
													value: ManageListSyncType.Patch,
												},
												{
													title: "Обновить существующие записи",
													desc: "Обновляет информацию о записях, которые присутствуют в обоих трекерах. Записи, уникальные для одного из списков, игнорируются.",
													icon: icons.get("arrow_r", { fill: "#9f92ff" }),
													value: ManageListSyncType.Post,
												},
												{
													title: "Зеркалировать список источника",
													desc:
														"Делает целевой список идентичным источнику, добавляя отсутствующие записи, обновляя существующие и удаляя лишние. Рекомендуется сначала создать резервную копию целевого трекера, так как это приведет к безвозвратному удалению записей, отсутствующих в источнике.",
													icon: icons.get("arrow_lr", { fill: "#9f92ff" }),
													value: ManageListSyncType.FullSync,
												},
											],
										}),
										tray.button({
											label: state.syncing.get() ? "Отменить ручную синхронизацию" : "Запустить ручную синхронизацию",
											size: "lg",
											intent: state.syncing.get() ? "alert" : "success",
											loading: state.cancellingSync.get(),
											onClick: ctx.eventHandler("shikimori:manage-list-start-job", () => {
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
									{ icon: icons.get("play"), tooltip: "Список аниме" },
									{ size: "md", className: "bg-no-repeat bg-center p-0", style: { width: "103.5px" }, disabled: true },
								),
								this.button(
									{ icon: icons.get("book"), tooltip: "Список манги" },
									{ size: "md", className: "bg-no-repeat bg-center p-0", style: { width: "103.5px" }, disabled: true },
								),
							],
							{ className: "grid grid-cols-4", style: { gap: "0.5rem" } },
						),
						tray.div([
							tray.switch("Временно отключить livesync", {
								fieldRef: fieldRefs.disableSyncing,
								disabled: state.loggingOut.get(),
								style: { "--color-brand-500": "255 95 95" },
							}),
							tray.switch("Пропускать adult-записи для livesync", {
								fieldRef: fieldRefs.skipAdult,
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("shikimori:skip-adult", (e) => {
									$storage.set("shikimori:options-skipAdult", e.value);
								}),
							}),
							tray.switch("Отключить значок для некритичных уведомлений", {
								fieldRef: fieldRefs.suppressNotificationBadge,
								style: { "--color-brand-500": "255 95 95" },
								onChange: ctx.eventHandler("shikimori:suppress-notification-badge", (e) => {
									$storage.set("shikimori:options-suppressnotificationbadge", e.value);
								}),
							}),
						]),
						tray.div([], { className: "flex-1" }),
						tray.div(
							[
								tray.text(`Выполнено подключений: ${application.connection.success.get() + application.connection.fail.get()}`),
								tray.text(
									`Успешных подключений: ${application.connection.success.get()} (${((application.connection.success.get() / application.connection.total) * 100 || 0).toFixed(2)}%)`,
								),
								tray.p([
									tray.span("Последнее подключение:", { className: "mr-1" }),
									tray.span(application.connection.lastState.get(), {
										className: "font-bold " + application.connection.lastState.get().startsWith("Success") ? "text-green-300" : "text-red-300",
									}),
								]),
							],
							{ className: "text-xs text-muted opacity-70" },
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

		tray.render(() => tabs.get());

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

		function popByProperty<T, K extends keyof T>(entries: T[], prop: K, value: T[K]): T | undefined {
			const index = entries.findIndex((e) => unwrap(e[prop]) === value);
			if (index === -1) return undefined;

			const [removed] = entries.splice(index, 1);
			return removed;
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

			if (!res.ok) throw new Error(res.statusText);

			return await res.json();
		}

		function normalizeStatus(statusAL: $app.AL_MediaListStatus) {
			const map: Record<$app.AL_MediaListStatus, $shikimorisync.UserRateStatus> = {
				COMPLETED: "completed",
				CURRENT: "watching",
				DROPPED: "dropped",
				PAUSED: "on_hold",
				PLANNING: "planned",
				REPEATING: "rewatching",
			};
			return map[statusAL];
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

		function normalizeShikomoriStatus(status: $shikimorisync.UserRateStatus) {
			const map: Record<$shikimorisync.UserRateStatus, $app.AL_MediaListStatus> = {
				completed: "COMPLETED",
				watching: "CURRENT",
				dropped: "DROPPED",
				on_hold: "PAUSED",
				planned: "PLANNING",
				rewatching: "REPEATING",
			};
			return map[status];
		}

		function normalizeString(str: string | null | undefined): string | undefined {
			return LoadDoc(`<p>${str ?? ""}</p>`)("p").text();
		}

		async function filterExistingMalIds(malIds: number[]) {
			const endpoint = "https://graphql.anilist.co";
			const chunkSize = 50;
			const existing: { id: number; idMal: number; title: string }[] = [];

			// Split MAL IDs into chunks of 50
			const chunks: number[][] = [];
			for (let i = 0; i < malIds.length; i += chunkSize) {
				chunks.push(malIds.slice(i, i + chunkSize));
			}

			// Query AniList sequentially to avoid rate limits
			for (const chunk of chunks) {
				let page = 1;

				while (true) {
					// prettier-ignore
					const query = "query ($page: Int, $perPage: Int, $malIds: [Int]) { Page(page: $page, perPage: $perPage) { media(idMal_in: $malIds) { id idMal title { userPreferred }} } }";
					const variables = { page, perPage: 50, malIds: chunk };

					const res = await fetch(endpoint, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ query, variables }),
					});

					await $_wait(1_500);

					const json = await res.json();
					const media = json.data.Page.media;

					for (const m of media) {
						if (m.idMal != null) {
							existing.push({ id: m.id, idMal: m.idMal, title: m.title.userPreferred });
						}
					}

					if (media.length < 50) break;
					page++;
				}
			}

			return existing;
		}

		ctx.effect(() => {
			if (application.userInfo.cache.get() === null) return tray.updateBadge({ number: 1, intent: "alert" });
			if (state.syncing.get()) return tray.updateBadge({ number: 1, intent: "alert" });
			if (notifications.unreads.get() > 0 && fieldRefs.suppressNotificationBadge.current === false)
				return tray.updateBadge({ number: notifications.unreads.get(), intent: "warning" });
			return tray.updateBadge({ number: 0 });
		}, [application.userInfo.cache, state.syncing, notifications.unreads]);

		async function syncEntries() {
			const jobType = fieldRefs.manageListJobtype.current;
			const mediaType = fieldRefs.manageListMediaType.current;
			const syncType = fieldRefs.manageListSyncType.current;
			const notifUpdt = { entries: 0, errors: 0, skips: 0, updates: 0, job_type: jobType, media_type: mediaType, sync_type: syncType };

			// Anilist ➔ Shikimori
			if (jobType === ManageListJobType.Import) {
				log.sendInfo("synclist > Starting sync job... (Anilist ➔ Shikimori)");
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

				log.send("synclist > Querying Shikimori entries...");
				const shikimoriEntries = await application.list.fetchAll(mediaType).catch((e) => (e as Error).message);
				if (typeof shikimoriEntries === "string") {
					state.syncing.set(false);
					notifications.push({
						title: "Manual Sync Performed",
						body: { ...notifUpdt, remarks: "Fetch error" },
					});
					return log.sendError(`synclist > Terminating syncjob: ${shikimoriEntries}`);
				}
				log.sendInfo(`synclist > Found ${shikimoriEntries.length} entries in Shikimori!`);
				console.log(shikimoriEntries);

				while (state.syncing.get() && entries.length) {
					const entry = entries.pop()!;
					if (!entry?.mediaId) continue;

					const title = entry?.title;

					// RETRIEVE ID_MAL
					if (!entry.idMal) {
						log.send(`synclist > Skipped ${title} (no equivalent Shikimori entry)...`);
						notifUpdt.skips++;
						continue;
					}

					if (unwrap(entry.private)) {
						log.send(`synclist > Skipped ${title} (private)...`);
						if (!fieldRefs.deletePrivateEntries.current) {
							popByProperty(shikimoriEntries, "id", unwrap(entry.idMal) ?? 0);
						}
						notifUpdt.skips++;
						continue;
					}

					const shikimoriEntry = popByProperty(shikimoriEntries, "target_id", unwrap(entry.idMal)!);
					if (!!shikimoriEntry && syncType === ManageListSyncType.Patch) {
						log.send(`synclist > Skipped ${title} (already-exists)...`);
						notifUpdt.skips++;
						continue;
					}

					const rateId = shikimoriEntry?.id;
					const rateBase: Omit<$shikimorisync.UserRateBase, "user_id"> = {};

					const status = unwrap(entry.status);
					if (status && shikimoriEntry?.status !== normalizeStatus(status)) rateBase.status = normalizeStatus(status);

					const score = unwrap(entry.score);
					if (score !== undefined && score !== null && score !== (shikimoriEntry?.score ?? 0) * 10) rateBase.score = score / 10;

					const progress = unwrap(entry.progress);
					if (progress) {
						if (mediaType === "Anime" && shikimoriEntry?.episodes !== progress) rateBase.episodes = progress;
						if (mediaType === "Manga" && shikimoriEntry?.chapters !== progress) rateBase.chapters = progress;
					}

					const repeat = unwrap(entry.repeat);
					if (repeat !== undefined && mediaType === "Anime" && shikimoriEntry?.rewatches !== repeat) rateBase.rewatches = repeat;

					const notes = unwrap(entry.notes);
					if (notes && shikimoriEntry?.text !== notes) rateBase.text = notes;

					if (!Object.keys(rateBase).filter(Boolean).length) {
						log.send(`synclist > Skipping ${title}. (no-new-update)...`);
						notifUpdt.skips++;
						continue;
					}

					console.log(JSON.stringify({ user_rate: { ...rateBase, target_id: entry.idMal, target_type: mediaType } }));

					(typeof rateId === "number"
						? application.list.patch(rateId, { user_rate: rateBase })
						: application.list.post({ user_rate: { ...rateBase, target_id: entry.idMal, target_type: mediaType } })
					)
						.then(() => {
							log.sendSuccess(`synclist > Updated ${entry.title} on Shikimori. ${JSON.stringify(rateBase)}`);
							notifUpdt.updates++;
						})
						.catch((e) => {
							log.sendError(`synclist > Failed to update ${entry.title} on Shikimori ${(e as Error).message} ${JSON.stringify(rateBase)}`);
							notifUpdt.errors++;
						});

					await $_wait(1_000);
				}

				if (syncType === ManageListSyncType.FullSync && typeof shikimoriEntries !== "string" && state.syncing.get()) {
					log.sendInfo(`synclist > Found ${shikimoriEntries.length} remaining entries. Purging...`);
					const validEntries = await filterExistingMalIds(shikimoriEntries.map((x) => x.target_id)).catch((e) => (e as Error).message);
					if (typeof validEntries === "string") {
						log.sendError(`synclist > ${validEntries}`);
					} else {
						const validIds = new Set(validEntries.map((x) => x.idMal));
						const invalidMalEntries = shikimoriEntries.filter((c) => !validIds.has(c.target_id));
						const validMalEntries = shikimoriEntries.filter((c) => validIds.has(c.target_id));

						if (invalidMalEntries.length) {
							log.sendInfo(`synclist > Found ${invalidMalEntries.length} invalid entries queued for deletion...`);
							while (invalidMalEntries.length) {
								const invalidEntry = invalidMalEntries.pop()!;
								log.send(`synclist > Unqueued shikimoiri/${invalidEntry.target_id} from deletion <no matching records found on AniList>`);
							}
						}

						log.send(`synclist > Preparing to delete ${validMalEntries.length} entries...`);
						while (state.syncing.get() && validMalEntries.length) {
							const entry = validMalEntries.pop()!;
							await application.list
								.delete(entry.id)
								.then((data) => {
									if (data) {
										log.sendSuccess(`synclist > Deleted shikimori/${entry.target_id} from Shikimori`);
										notifUpdt.updates++;
									} else {
										log.send(`synclist > $shikimori/${entry.target_id} does not exist in user's list. No further action required.`);
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

			// Shikimori ➔ Anilist
			if (jobType === ManageListJobType.Export) {
				log.sendInfo("synclist > Starting sync job... (Shikimori ➔ Anilist)");
				const entries = await application.list
					.fetchAll(mediaType)
					.then((data) =>
						data.map((e) => ({
							idMal: e.target_id,
							score: e.score,
							progress: e[mediaType === "Anime" ? "episodes" : "chapters"],
							progressVolumes: mediaType === "Anime" ? undefined : e.volumes,
							repeat: mediaType === "Anime" ? e.rewatches : undefined,
							status: e.status ? normalizeShikomoriStatus(e.status) : undefined,
							notes: e.text,
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
				const query = "mutation ( $mediaId: Int!, $status: MediaListStatus, $progress: Int, $progressVolumes: Int, $score: Float, $repeat: Int, $notes: String, $startedAt: FuzzyDateInput, $completedAt: FuzzyDateInput ) { SaveMediaListEntry( mediaId: $mediaId, status: $status, progress: $progress, progressVolumes: $progressVolumes, score: $score, repeat: $repeat, notes: $notes, startedAt: $startedAt, completedAt: $completedAt ) { id status progress progressVolumes score repeat notes startedAt { year month day } completedAt { year month day } } }";
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
						log.send(`synclist > Skipped shikimori/${entry.idMal}. No matching media found on Anilist.`);
						notifUpdt.skips++;
						continue;
					}

					if (!!listEntry && syncType === ManageListSyncType.Patch) {
						log.send(`synclist > Skipped ${title} (already-exists)...`);
						notifUpdt.skips++;
						continue;
					}

					const body: $shikimorisync.AnilistSaveMediaListEntryVariables = { mediaId: id };

					if (entry.status !== unwrap(listEntry?.status)) body.status = entry.status;
					if (entry.progress !== (unwrap(listEntry?.progress) ?? 0)) body.progress = entry.progress;
					// Seanime's Anilist ListEntry for Manga does not support progressVolumes atm
					// if (entry.progressVolumes) body.progressVolumes = entry.progressVolumes;
					if (entry.score !== Math.round((unwrap(listEntry?.score) ?? NaN) / 10)) body.score = (entry.score ?? 0) * 10;
					if ((entry.repeat ?? 0) !== unwrap(listEntry?.repeat)) body.repeat = entry.repeat ?? 0;
					if (entry.notes !== normalizeString(unwrap(listEntry?.notes))) body.notes = entry.notes ?? "";

					// check if there are update in the entry
					if (Object.keys(body).length === 1) {
						log.send(`synclist > Skipped ${title ?? `shikimori/${entry.idMal}`} (no-update-body)...`);
						notifUpdt.skips++;
						continue;
					}

					await anilistQuery(query, body)
						.then(() => {
							log.sendSuccess(`synclist > Added ${title ?? `shikimori/${entry.idMal}`} to Anilist. ${JSON.stringify(body)}`);
							notifUpdt.updates++;
						})
						.catch((e) => {
							log.sendError(`synclist > Failed to add ${title ?? `shikimori/${entry.idMal}`} to Anilist ${(e as Error).message} ${JSON.stringify(body)}`);
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
							log.send(`synclist > Skipped ${mediaTitle} (no equivalent Shikimori entry)...`);
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
			buildBody: (data: TData, entry: any) => Omit<$shikimorisync.UserRateBase, "user_id">;
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

			if (fieldRefs.skipAdult.current.valueOf() && entry.media.isAdult?.valueOf()) {
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
			const rate = await application.list.getUserRate(entry.media.idMal, entry.type);
			await $_wait(1_000);

			(typeof rate?.id === "number"
				? application.list.patch(rate.id, { user_rate: body })
				: application.list.post({ user_rate: { ...body, target_id: entry.media.idMal, target_type: entry.type } })
			)
				.then((data) => {
					log.sendSuccess(`${actionLabel} > [PATCH] Synced ${title} to MyAnimeList. ${JSON.stringify(body)}`);
					notifications.push({
						title: `Updated ${title}`,
						body: { type: actionLabel, payload: data, status: "success", mediaId, metadata: { image: entry.media?.coverImage?.large } },
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

		$store.watch("POST_UPDATE_ENTRY", async (e: $app.PostUpdateEntryEvent) => {
			liveSync<$app.PreUpdateEntryEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_DATA",
				actionLabel: "update",
				buildBody: (data, entry) => {
					const body: Omit<$shikimorisync.UserRateBase, "user_id"> = {};

					if (typeof data.scoreRaw === "number" && data.scoreRaw > 0) {
						body.score = Math.round(data.scoreRaw / 10);
					}

					if (typeof data.status === "string") {
						body.status = normalizeStatus(data.status);
					}

					if (typeof data.progress === "number") {
						body[entry.type === "Anime" ? "episodes" : "chapters"] = data.progress;
					}

					return body;
				},
			});
		});

		$store.watch("POST_UPDATE_ENTRY_PROGRESS", async (e: $app.PostUpdateEntryProgressEvent) => {
			liveSync<$app.PreUpdateEntryProgressEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_PROGRESS_DATA",
				actionLabel: "progress",
				buildBody: (data, entry) => {
					const body: Omit<$shikimorisync.UserRateBase, "user_id"> = {};
					body[entry.type === "Anime" ? "episodes" : "chapters"] = data.progress;

					if (data.progress === data.totalCount) {
						body.status = "completed";
					} else {
						body.status = normalizeStatus(data.status!);
					}

					return body;
				},
			});
		});

		$store.watch("POST_UPDATE_ENTRY_REPEAT", async (e: $app.PostUpdateEntryRepeatEvent) => {
			liveSync<$app.PreUpdateEntryRepeatEvent>({
				event: e,
				preDataKey: "PRE_UPDATE_ENTRY_REPEAT_DATA",
				actionLabel: "repeat",
				requireRepeat: true,
				buildBody: (data, entry) => {
					return { rewatches: data.repeat };
				},
			});
		});

		$store.watch("POST_DELETE_ENTRY", async (e: $app.PostDeleteEntryEvent) => {
			if (!e.mediaId) {
				return log.sendWarning("delete-entry > postUpdate hook was triggered but it contained no mediaId");
			}

			if (fieldRefs.disableSyncing.current.valueOf()) {
				return log.sendInfo(`delete-entry > Syncing was disabled. Will not sync entry [${e.mediaId}]`);
			}

			const entry = await getMedia(e.mediaId);
			if (!entry) return log.sendWarning(`delete-entry > Media not found (${e.mediaId})`);

			if (!entry.media?.idMal) {
				return log.sendWarning(`delete-entry > No equivalent Shikimori entry found for [${e.mediaId}]`);
			}

			if (unwrap(getAnilistEntries(entry.type).find((x) => x.mediaId === e.mediaId)?.private)) {
				return log.sendWarning(`delete-entry > ${entry.media.title?.userPreferred ?? "anilist-id/" + e.mediaId} is private. Skipping...`);
			}

			const title = entry.media.title?.userPreferred;
			const rate = await application.list.getUserRate(entry.media.idMal, entry.type);
			if (rate?.id) {
				await application.list
					.delete(rate.id)
					.then((data) => {
						if (data) {
							log.sendSuccess(`delete-entry > [DELETE] Synced ${title} to Shikimori`);
							notifications.push({
								title: `Deleted ${title}`,
								body: { type: "delete", status: "success", mediaId: e.mediaId!, metadata: { image: entry.media?.coverImage?.large } },
							});
						} else {
							log.sendInfo(`delete-entry > [DELETE] ${title} does not exist in user's list. No further action required.`);
						}
					})
					.catch((e) => {
						log.sendError(`delete-entry > [DELETE] ${(e as Error).message}`);
						notifications.push({
							title: `Failed to delete ${title}`,
							body: { type: "delete", status: "error", mediaId: e.mediaId!, metadata: { image: entry.media?.coverImage?.large } },
						});
					});
			} else {
				log.sendWarning(`delete-entry > [DELETE] No entry to delete in shikimori (already synced)`);
			}
		});

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
					log.send(`login > Signed in as: ${data.nickname}!`);
					if (!data.avatar) log.sendWarning("login > No user avatar detected! Reverting to default...");
					tabs.current.set(Tab.landing);
				})
				.catch((err: Error) => {
					log.sendError(`login > Fetch failed: ${err.message}`);
					log.send("login > Session invalid. Please log in again.");
					tabs.current.set(Tab.logon);
					state.loginError.set("Сеанс завершён. Пожалуйста, войдите снова.");
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
					log.send(`login > Signed in as: ${data.nickname}!`);
					if (!data.avatar) log.sendWarning("login > No user avatar detected! Reverting to default...");
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
		$store.set("POST_DELETE_ENTRY", $clone(e));
		e.next();
	});
}
