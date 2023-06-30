var loki = require('lokijs');
var db = new loki('db.json');
var codes = db.addCollection("codes")

exports.getAllCodes = async (req, res) => {
	try {
		res.status(200).json({
			data: codes.find().reverse()
		})
	} catch (error) {
		console.error(error);
		return res.status(500).json(error.message);
	}
}

exports.emailData = async (req, res) => {
	try {
		console.warn(req.body)
		let msg = req.body;
		let value = msg.match(/(^|[^\d])(\d{6})([^\d]|$)/);
		if(value !== null){
			console.log(value);
			codes.insert({code: value[2]})
		}
		db.saveDatabase()
		// console.log(JSON.stringify(req))
		return res.status(200).json({
			data: value,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json(error.message);
	}
};
