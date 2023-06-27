const { chromium } = require("playwright-extra");

// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
const stealth = require("puppeteer-extra-plugin-stealth")();

// Add the plugin to playwright (any number of plugins can be added)
chromium.use(stealth);

(async () => {
	const browser = await chromium.launch({
		headless: false,
		proxy: {
			server: "resi3.ipb.cloud:9000",
			username: "ygKznCgmw1Itg4E0",
			password: "wifi;us;;;;",
		},
	});
	const context = await browser.newContext();
	const page = await context.newPage();
	await page.goto("https://whatismyipaddress.com/");
	await page.screenshot({ path: "example.png" });
	// await browser.close();
})();
