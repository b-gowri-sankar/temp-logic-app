exports.emailData = async (req, res) => {
	try {
		console.warn(req)
		console.warn(req.body)
		let msg = req.body;
		let value = msg.match(/(^|[^\d])(\d{6})([^\d]|$)/);
		if(value !== null){
			console.log(value);
		}
		// console.log(JSON.stringify(req))
		return res.status(200).json({
			data: value,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json(error.message);
	}
};
