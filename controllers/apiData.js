exports.emailData = async (req, res) => {
	try {
		console.log(JSON.stringify(req.body))
		return res.status(200).json({
			data: req.body,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json(error.message);
	}
};
