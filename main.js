const { firefox } = require("playwright");
const axios = require("axios");
const https = require("https");
const moment = require("moment");
const sql = require("mssql");

const fs = require("fs");
const MAX_EMAILS = 3;
const getRandomUsername = (firstName, lastName) => {
	return `${firstName}.${lastName}.${Math.floor(Date.now() * Math.random())}`;
};
axios.defaults.timeout = 30000;
axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });

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
	const MAX_RETRY = 10;

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
	let i = 0;
	while (true) {
		if (i === MAX_RETRY) {
			return "";
			break;
		}
		const response = await axios(config);
		console.log(response.data);
		if (response?.data?.code) {
			output = response?.data?.code;
			break;
		}
		await new Promise((r) => setTimeout(r, 2000));
		i++;
	}
	return output;
}

const getCodeFromSMSMAN = async (id) => {
	try {
		const MAX_RETRY = 10;

		let output;
		var config = {
			method: "get",
			url: `http://api.sms-man.com/control/get-sms?token=8KX68ljLpJMGayWJYvRGS09tfVAtsNPA&request_id=${id}`,
			headers: {},
		};
		let i = 0;

		while (true) {
			if (i === MAX_RETRY) {
				break;
			}
			const response = await axios(config);
			console.log(response.data);
			if (response?.data?.sms_code) {
				output = response?.data?.sms_code;
				break;
			}
			await new Promise((r) => setTimeout(r, 2000));
			i++;
		}
	} catch (error) {
		console.error(error);
	}
};

const createRequestSMSMAN = async () => {
	try {
		var config = {
			method: "get",
			url: "http://api.sms-man.com/control/get-number?token=8KX68ljLpJMGayWJYvRGS09tfVAtsNPA&country_id=5&application_id=122",
			headers: {},
		};
		const response = await axios(config);
		if (response?.data) {
			return response.data;
		}
	} catch (error) {
		console.error(error);
	}
};

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
		const request = createRequestSMSMAN();
		return request;
	}
};

const createEmail = async ({
	FirstName,
	LastName,
	Username,
	Password,
	MobileNumber,
	DateOfBirth,
	GenderId,
	Id,
}) => {
	const browser = await firefox.launch({
		headless: false,
		slowMo: 100,
		// proxy: {
		// 	server: `${"142.214.180.75"}:${"8800"}`,
		// 	username: "163096",
		// 	password: "wCZpMhQ8fuj8",
		// },
	});
	try {
		const bearer_token = await getBearerToken();
		if (!bearer_token) {
			return;
		}
		console.log("bearer token:", bearer_token);

		const context = await browser.newContext();
		const page = await context.newPage();

		await page.goto(
			"https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp"
		);
		await page.waitForLoadState();
		const isUserNameIsVisible = await page
			.locator("//*[@name='Username']")
			.isVisible();
		if (!isUserNameIsVisible) {
			console.log("################ First Name ################");
			await page.focus("//*[@name='firstName']");
			await page.click("//*[@name='firstName']");
			await page.type(
				"//*[@name='firstName']",
				FirstName ? FirstName : "John",
				{ delay: 100 }
			);
			await new Promise((r) => setTimeout(r, 2000));

			console.log("################ Last Name ################");
			await page.focus("//*[@name='lastName']");
			await page.click("//*[@name='lastName']");
			await page.type("//*[@name='lastName']", LastName ? LastName : "Doe", {
				delay: 100,
			});
			await new Promise((r) => setTimeout(r, 2000));

			const nextButton = await page.$(
				"//button[@class='VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b']"
			);
			nextButton.click();

			await page.waitForLoadState();

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

			const btn2 = await page.$(
				"//button[@class='VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b']"
			);
			btn2.click();
			await page.waitForLoadState();
			const username = getRandomUsername();
			await page.focus("//*[@name='Username']");
			await page.click("//*[@name='Username']");
			await page.type("//*[@name='Username']", username, { delay: 100 });
			await new Promise((r) => setTimeout(r, 2000));
			console.log("username:", username);
			const btn3 = await page.$(
				"//button[@class='VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b']"
			);
			btn3.click();
			await page.waitForLoadState();
			await page.focus("//*[@name='Passwd']");
			await page.click("//*[@name='Passwd']");
			await page.type("//*[@name='Passwd']", password, { delay: 100 });
			await new Promise((r) => setTimeout(r, 2000));

			await page.focus("//*[@name='PasswdAgain']");
			await page.click("//*[@name='PasswdAgain']");
			await page.type("//*[@name='PasswdAgain']", password, { delay: 100 });
			await new Promise((r) => setTimeout(r, 2000));

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

			const btn4 = await page.$(
				"//button[@class='VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b']"
			);
			btn4.click();

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

			await page
				.locator(
					`//button[@class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe P62QJc LQeN7 xYnMae TrZEUc lw1w4b"]`
				)
				.nth(1)
				.click();
			await page.waitForLoadState();

			await new Promise((r) => setTimeout(r, 2000));

			await page
				.locator(
					`//button[@class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe P62QJc LQeN7 xYnMae TrZEUc lw1w4b"]`
				)
				.nth(1)
				.click();

			await page.waitForLoadState();

			await new Promise((r) => setTimeout(r, 2000));

			const btn5 = await page.$(
				"//button[@class='VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b']"
			);
			btn5.click();

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

			return;
		}

		// await page.mouse.click(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100))
		console.log("################ First Name ################");
		await page.focus("//*[@name='firstName']");
		await page.click("//*[@name='firstName']");
		await page.type("//*[@name='firstName']", FirstName ? FirstName : "John", {
			delay: 100,
		});
		await new Promise((r) => setTimeout(r, 2000));

		console.log("################ Last Name ################");
		await page.focus("//*[@name='lastName']");
		await page.click("//*[@name='lastName']");
		await page.type("//*[@name='lastName']", LastName ? LastName : "Doe", {
			delay: 100,
		});
		await new Promise((r) => setTimeout(r, 2000));

		console.log("################  UserName ################");
		let username = getRandomUsername(FirstName, LastName);
		await page.focus("//*[@name='Username']");
		await page.click("//*[@name='Username']");
		await page.type("//*[@name='Username']", "sankaryadavrgukt", {
			delay: 100,
		});
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

		const isVisilbe = await page
			.locator("//div[@class='o6cuMc Jj6Lae']")
			.isVisible();

		if (isVisilbe) {
			const errorTextContent = await page
				.locator("//div[@class='o6cuMc Jj6Lae']")
				.nth(0)
				.textContent();

			if (
				errorTextContent.includes("username") &&
				errorTextContent.includes("taken")
			) {
				await new Promise((r) => setTimeout(r, 3000));
				let buttonText = await page
					.locator("//button[@class='fBRZbb TrZEUc']")
					.nth(10)
					.isVisible();
				console.log(buttonText);
				if (buttonText) {
					username = await page
						.locator("//button[@class='fBRZbb TrZEUc']")
						.nth(10)
						.textContent();
					await page
						.locator("//button[@class='fBRZbb TrZEUc']")
						.nth(10)
						.click();
				} else {
					await page.focus("//*[@name='Username']");
					await page.click("//*[@name='Username']");
					await page.fill("//*[@name='Username']", "", { delay: 100 });
					username = getRandomUsername(FirstName, LastName);
					await page.type("//*[@name='Username']", username, { delay: 100 });
				}
			}
		}

		console.log(username);
		return;

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

		const month = DateOfBirth ? moment(DateOfBirth).format("MM") : "7";
		const day = DateOfBirth ? moment(DateOfBirth).format("DD") : "29";
		const year = DateOfBirth ? moment(DateOfBirth).format("YYYY") : "2001";

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
		// await sql.connect(
		// 	"Server=salemseatsdev.database.windows.net;Database=salemseats-dev;user id=appuser;password=Salem@1234;Encrypt=true"
		// );
		// const result = await sql.query`UPDATE [dbo].[GoogleEmails]
		// 									SET IsCreated = 1,
		// 									Username=${username},
		// 									MobileNumber=+1${verificationData?.number},
		// 									Password=${password},
		// 									CreatedDate=${moment().format("YYYY-MM-DD HH:mm:ss")}
		//   									WHERE Id = ${Id}`;
		await browser.close();
	} catch (error) {
		console.error(error.message);
		await browser.close();
	}
};
createEmail({
	id: 39,
	firstName: "Anthony",
	lastName: "Wilder",
	genderId: 1,
	genderName: "Male",
	username: "antwilderr5",
	password: "Tickets123!",
	mobileNumber: null,
	recoveryMail: "forwarding@salemseats.com",
	dateOfBirth: null,
	isVerificationLinkSent: false,
	isVerificationComplete: false,
	isForwardingEnabled: false,
	isCreated: null,
	createdDate: null,
	insertedOn: "2023-05-12T17:37:53.54",
	insertedBy: "demitri@salemseats.com",
	updatedOn: "2023-05-16T09:16:18.973",
	excelId: null,
	createEmailsAttempts: 2,
	verificationLinkSentAttempts: 0,
	verificationCompleteAttempts: 0,
	forwardingAttempts: 0,
});

exports.CreateEmailWithPlayWright = createEmail;

// (async () => {
// 	let count = 0;
// 	while (true) {
// 		if (count === MAX_EMAILS) {
// 			break;
// 		}
// 		await createEmail({
// 			firstName: "",
// 			lastName: "",
// 			username: "",
// 			dob: "",
// 			gender: "",
// 		});
// 	}
// })();
