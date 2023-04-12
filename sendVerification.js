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
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("https://mail.google.com");
	await page.waitForLoadState();
	await page.type('input[type="email"]', "gowri.sankar.1119315864412", {
		delay: 100,
	});
	await page.locator("#identifierNext >> button").click();

	await page.waitForLoadState();
	await new Promise((r) => setTimeout(r, 5000));
	await page.type('#password >> input[type="password"]', "BXuolIWO");
	await page.locator("button >> nth=1").click();
	await page.waitForLoadState();

	await new Promise((r) => setTimeout(r, 10000));

	await page.locator("a.FH").click();

	await page.waitForLoadState();
	await new Promise((r) => setTimeout(r, 5000));

	await page.locator("button.Tj").click();
	await new Promise((r) => setTimeout(r, 15000));
	await page.waitForURL("https://mail.google.com/mail/u/0/#settings/general");
	await new Promise((r) => setTimeout(r, 5000));
	let link = `https://mail.google.com/mail/u/0/#settings/fwdandpop`;
	const linksLocator = await page.locator("a.f0.LJOhwe");
	let nthLink = null;
	let i = 0;
	for (const el of await linksLocator.elementHandles()) {
		let verificationLink = await el.getAttribute("href");
		console.log(verificationLink);
		if (verificationLink.includes(link)) {
			nthLink = i;
		}
		i++;
	}

	await new Promise((r) => setTimeout(r, 5000));
	await page.locator("a.f0.LJOhwe").nth(nthLink).click();
	await page.waitForLoadState();

	await new Promise((r) => setTimeout(r, 5000));
	await page.locator("input[type='button']").click();
	await new Promise((r) => setTimeout(r, 5000));

	await page.focus("div.PN input");
	await page.click("div.PN input");
	await page.type("div.PN input", "gowri.sankar.154969228349@gmail.com", {
		delay: 100,
	});
	await new Promise((r) => setTimeout(r, 5000));
	// const [newWindow] = await Promise.all([
	// 	context.waitForEvent("popup"),
	// 	// This action triggers the new tab
	// 	await page.locator("div button.J-at1-auR").click(),
	// ]);

	const [pageTwo] = await Promise.all([
		//listener
		page.waitForEvent("popup"),

		//event on the promise page. When click the button, new/second window is launched
		//second window url is not known
		await page.locator("div button.J-at1-auR").click(),
	]);
	await pageTwo.waitForLoadState();
	await new Promise((r) => setTimeout(r, 5000));
	await pageTwo.locator('input[type="submit"]').click();
	await new Promise((r) => setTimeout(r, 10000));
	// await browser.close();
})();
