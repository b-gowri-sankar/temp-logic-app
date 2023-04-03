const { firefox } = require("playwright");
const axios = require("axios");
const fs = require("fs");
const getRandomUsername = () => {
	return `gowri.sankar.${Math.floor(Date.now() * Math.random())}`;
};

function generatePassword() {
	var length = 8,
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

const getBearerToken = async () => {
	try {
		const config = {
			method: "post",
			url: "https://www.textverified.com/api/SimpleAuthentication",
			headers: {
				"X-SIMPLE-API-ACCESS-TOKEN":
					"1_IGVmJqNHbxn26SJnl8peG30Eb5yDxfkGfHG31LZzSZ2fKVEbSP0lc8Jk5EFvkzut8vhBmTbS",
				Cookie:
					"_i=h3%2B747rRKmhErMdsUTPQ3s0yiA%2FaZZChQ1KjYBSddHWKUWkITZ60sCJLj1ocPKHKZQKoG9legy0JKQITxO4ticA3vQqDYaU3V9XQZgMPfMkCLdN0; _sessid=ny24Wuz2UU35nbCqcFIo5Q; _tmSessionCtx=N5aHnnD19LwgqMp7NOroCgr7BnA87RKss789RiYzKEKAA4TodoknfLVDPCNIasqRgg",
			},
		};
		const response = await axios(config);
		if (response?.data?.bearer_token) {
			return response?.data?.bearer_token;
		}
		return "";
	} catch (error) {
		console.error;
		return "";
	}
};

async function getCode(bearer_token, verificationId) {
	console.log(
		"################ Get SMS Code from TEXTVERIFIED ################"
	);

	let output;
	var config = {
		method: "get",
		url: `https://www.textverified.com/api/Verifications/${verificationId}`,
		headers: {
			Authorization: `Bearer ${bearer_token}`,
			Cookie:
				"_i=h3%2B747rRKmhErMdsUTPQ3s0yiA%2FaZZChQ1KjYBSddHWKUWkITZ60sCJLj1ocPKHKZQKoG9legy0JKQITxO4ticA3vQqDYaU3V9XQZgMPfMkCLdN0; _sessid=ny24Wuz2UU35nbCqcFIo5Q; _tmSessionCtx=N5aHnnD19LwgqMp7NOroCgr7BnA87RKss789RiYzKEKAA4TodoknfLVDPCNIasqRgg",
		},
	};
	while (true) {
		const response = await axios(config);
		console.log(response.data);
		if (response?.data?.code) {
			output = response?.data?.code;
			break;
		}
		await new Promise((r) => setTimeout(r, 2000));
	}
	return output;
}

const getVerficationData = async (bearer_token) => {
	try {
		const data = JSON.stringify({
			id: 90,
			areaCode: null,
			requestedTimeAllotment: null,
		});

		var config = {
			method: "post",
			url: "https://www.textverified.com/api/Verifications",
			headers: {
				Authorization: `Bearer ${bearer_token}`,
				"Content-Type": "application/json",
				Cookie:
					"_i=h3%2B747rRKmhErMdsUTPQ3s0yiA%2FaZZChQ1KjYBSddHWKUWkITZ60sCJLj1ocPKHKZQKoG9legy0JKQITxO4ticA3vQqDYaU3V9XQZgMPfMkCLdN0; _sessid=ny24Wuz2UU35nbCqcFIo5Q; _tmSessionCtx=N5aHnnD19LwgqMp7NOroCgr7BnA87RKss789RiYzKEKAA4TodoknfLVDPCNIasqRgg",
			},
			data: data,
		};
		const response = await axios(config);
		if (response?.data) {
			return response.data;
		}
		return "";
	} catch (error) {
		console.error(error);
		return "";
	}
};

(async () => {
	try {
		const bearer_token = await getBearerToken();
		if (!bearer_token) {
			return;
		}
		console.log("bearer token:", bearer_token);
		const browser = await firefox.launch({
			headless: true,
			slowMo: 100,
			// proxy: {
			// 	server: `${"142.214.180.75"}:${"8800"}`,
			// 	username: "163096",
			// 	password: "wCZpMhQ8fuj8",
			// },
		});
		const context = await browser.newContext();
		const page = await context.newPage();

		await page.goto(
			"https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp"
		);

		// await page.mouse.click(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100))
		console.log("################ First Name ################");
		await page.focus("//*[@name='firstName']");
		await page.click("//*[@name='firstName']");
		await page.type("//*[@name='firstName']", "Gowri", { delay: 100 });
		await new Promise((r) => setTimeout(r, 2000));

		console.log("################ Last Name ################");
		await page.focus("//*[@name='lastName']");
		await page.click("//*[@name='lastName']");
		await page.type("//*[@name='lastName']", "Sankar", { delay: 100 });
		await new Promise((r) => setTimeout(r, 2000));

		console.log("################  UserName ################");
		const username = getRandomUsername();
		await page.focus("//*[@name='Username']");
		await page.click("//*[@name='Username']");
		await page.type("//*[@name='Username']", username, { delay: 100 });
		await new Promise((r) => setTimeout(r, 2000));
		console.log("username:", username);

		console.log("################ password ################");
		const password = generatePassword();
		await page.focus("//*[@name='Passwd']");
		await page.click("//*[@name='Passwd']");
		await page.type("//*[@name='Passwd']", password, { delay: 100 });
		await new Promise((r) => setTimeout(r, 2000));

		console.log("Password", password);

		await page.focus("//*[@name='ConfirmPasswd']");
		await page.click("//*[@name='ConfirmPasswd']");
		await page.type("//*[@name='ConfirmPasswd']", password, { delay: 100 });
		await new Promise((r) => setTimeout(r, 2000));

		const nextButton = await page.$(
			"//button[@class='VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b']"
		);
		nextButton.click();

		await page.waitForLoadState();
		console.log(
			"################ Get Phone Number from Text Verified ################"
		);
		const verificationData = await getVerficationData(bearer_token);
		if (!verificationData) {
			return;
		}
		console.log("Vefication Data", verificationData);
		await page.focus("//*[@id='phoneNumberId']");
		await page.click("//*[@id='phoneNumberId']");
		await page.type(
			"//*[@id='phoneNumberId']",
			`+1${verificationData?.number}`,
			{ delay: 100 }
		);
		await new Promise((r) => setTimeout(r, 2000));

		const Button = await page.$("//button");
		Button.click();

		await page.waitForLoadState();

		const code = await getCode(bearer_token, verificationData?.id);
		if (!code) {
			return;
		}
		console.log("################ Verificatin Code ################");
		await page.focus('//input[@name="code"]');
		await page.click('//input[@name="code"]');
		await page.type('//input[@name="code"]', code, { delay: 100 });
		await new Promise((r) => setTimeout(r, 2000));

		const NextButton = await page.$("//button");
		NextButton.click();

		await page.waitForLoadState();
		console.log("################ Day ################");
		await page.focus('//input[@name="day"]');
		await page.click('//input[@name="day"]');
		await page.type('//input[@name="day"]', "29", { delay: 100 });
		await new Promise((r) => setTimeout(r, 2000));
		console.log("################ Year ################");
		await page.focus('//input[@name="year"]');
		await page.click('//input[@name="year"]');
		await page.type('//input[@name="year"]', "1997", { delay: 100 });
		await new Promise((r) => setTimeout(r, 2000));
		console.log("################ Gender and Month ################");
		await page.locator('xpath=//select[@id="gender"]').selectOption("1");
		await page.locator('xpath=//select[@id="month"]').selectOption("7");
		const nxtButton = await page.$("//button");
		nxtButton.click();

		await page.waitForLoadState();
		await new Promise((r) => setTimeout(r, 5000));
		console.log("################ I am In ################");
		await page
			.locator(
				"xpath=//button[@class='VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b']"
			)
			.click();

		await page.waitForLoadState();
		await new Promise((r) => setTimeout(r, 4000));

		await page.evaluate(() => {
			window.scrollTo(0, document.body.scrollHeight);
		});
		await new Promise((r) => setTimeout(r, 3000));
		console.log("################ Agree Button ################");
		const aggreeButton = await page.$(
			"//button[@class='VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b']"
		);
		await new Promise((r) => setTimeout(r, 2000));
		aggreeButton.click();

		await page.waitForLoadState();
		await new Promise((r) => setTimeout(r, 10000));

		console.log("################ Save to Report.txt ################");
		fs.appendFile(
			"report.txt",
			`\nUsername:${username}\t\tPassword:${password}\t\tMobileNumber:${verificationData?.number}`,
			function (err) {
				if (err) return console.error(err);
				console.log("Added the results to the report.");
			}
		);
		await browser.close();
	} catch (error) {
		console.error(error.message);
	}
})();
