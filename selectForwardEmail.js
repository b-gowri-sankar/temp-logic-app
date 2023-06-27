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
	await page.type('input[type="email"]', "gowri.sankar.71779944667", {
		delay: 100,
	});
	await page.locator("#identifierNext >> button").click();

	await page.waitForLoadState();
	await new Promise((r) => setTimeout(r, 5000));
	await page.type('#password >> input[type="password"]', "pKNuMLaW");
	await page.locator("button >> nth=1").click();
	await page.waitForLoadState();

	await new Promise((r) => setTimeout(r, 10000));

	await page.locator("a.FH").click();

	await page.waitForLoadState();
	await new Promise((r) => setTimeout(r, 5000));

	await page.locator("button.Tj").click();
	await new Promise((r) => setTimeout(r, 10000));
	await page.waitForURL("https://mail.google.com/mail/u/0/#settings/general");
	await new Promise((r) => setTimeout(r, 10000));
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
	await new Promise((r) => setTimeout(r, 3000));

	await page.locator('input[name="sx_em"]').nth(1).check();

	await new Promise((r) => setTimeout(r, 3000));
	const article = page.locator(`div.Tm.aeJ`);
	const isScrollable = await article.evaluate(
		(e) => e.clientHeight < e.scrollHeight
	);
	if (isScrollable) {
		await article.evaluate((e) => e.scrollTo(0, 518));
	}
	// await page.evaluate(() => {
	// 	window.scrollTo(0, document.body.scrollHeight);
	// });
	await new Promise((r) => setTimeout(r, 5000));
	const buttons = await page
		.locator("button:has-text('Save Changes')")
		.nth(1)
		.click();
	console.log(buttons);
	await new Promise((r) => setTimeout(r, 3000));
	await page.waitForLoadState();
	await new Promise((r) => setTimeout(r, 10000));
})();
