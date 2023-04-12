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
	await page.type(
		'input[type="email"]',
		"gowri.sankar.154969228349@gmail.com",
		{
			delay: 100,
		}
	);
	await page.locator("#identifierNext >> button").click();

	await page.waitForLoadState();
	await new Promise((r) => setTimeout(r, 5000));
	await page.type('#password >> input[type="password"]', "hA8pMedY");
	await page.locator("button >> nth=1").click();

	await new Promise((r) => setTimeout(r, 10000));
	const mails = await page.locator("td.xY.a4W").allTextContents();
	await new Promise((r) => setTimeout(r, 5000));
	console.log(mails);
	let nthMail = null;
	for (let i = 0; i < mails.length; i++) {
		if (
			mails[i].includes("Gmail Forwarding Confirmation") &&
			mails[i].includes("gowri.sankar.1119315864412@gmail.com")
		) {
			console.log("element found in list", i);
			nthMail = i;
			break;
		}
	}
	await page.locator("tr.zA").nth(nthMail).click();
	console.log(mails);
	await page.waitForLoadState();
	await new Promise((r) => setTimeout(r, 10000));
	const linksLocator = await page.locator(".ii a[href]");
	let nthLink = null;
	let i = 0;
	for (const el of await linksLocator.elementHandles()) {
		let verificationLink = await el.getAttribute("href");
		if (verificationLink.includes("https://mail-settings.google.com")) {
			nthLink = i;
			break;
		}
		i++;
	}
	await new Promise((r) => setTimeout(r, 5000));

	const [newPage] = await Promise.all([
		context.waitForEvent("page"),
		// This action triggers the new tab
		page.locator(".ii a[href]").nth(nthLink).click(),
	]);

	await newPage.waitForLoadState();
	await newPage.click('input[type="submit"]');
	await newPage.waitForLoadState();
	await new Promise((r) => setTimeout(r, 10000));

	// await browser.close();
})();
