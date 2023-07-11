var loki = require("lokijs");
var db = new loki("db.json");
var codes = db.addCollection("codes");

exports.getAllCodes = async (req, res) => {
	try {
		res.status(200).json({
			data: codes.find().reverse(),
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json(error.message);
	}
};

exports.emailData = async (req, res) => {
	try {
		console.warn(req.body);
		let msg = req.body;
		let value = msg.match(/(^|[^\d])(\d{6})([^\d]|$)/);
		let mobileNumbers = [
			"12142565769",
			"12142818521",
			"12153250788",
			"12028660835",
			"12142450766",
		];
		let mobileNumber = 0;
		mobileNumbers.forEach((mob) => {
			if (req.body.includes(mob)) {
				mobileNumber = mob;
			}
		});
		if (value !== null) {
			console.log(value);
			codes.insert({ code: value[2], phNo: mobileNumber });
		}
		db.saveDatabase();
		// console.log(JSON.stringify(req))
		return res.status(200).json({
			data: value,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json(error.message);
	}
};
