const { firefox } = require("playwright");
(async () => {
	const browser = await firefox.launch({
		headless: false,
		slowMo: 100,
		// proxy: {
		// 	server: `${"142.214.180.75"}:${"8800"}`,
		// 	username: "163096",
		// 	password: "wCZpMhQ8fuj8",
		// },
	});
	const context = await browser.newContext({
		storageState: "./setup/storage-state.json",
	});
	const page = await context.newPage();

	await page.goto("https://mail.google.com/mail/u/0/#inbox");
})();
