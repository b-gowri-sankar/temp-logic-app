const router = require("express").Router();
const { emailData, getAllCodes } = require("../controllers/apiData");
var loki = require("lokijs");
var db = new loki("db.json");
var doctors = db.addCollection("doctors");
//@desc Create Gmails
//GET /createGmails

router.post("/emailData", emailData);
router.post("/getallcodes", getAllCodes);
router.post("/adddata", (req, res) => {
	doctors.insert({ name: `Matt Smith`, doctorNumber: 11, created: new Date() });
	db.saveDatabase();
	res.status(200).json({
		message: "Added data successfully",
	});
});

router.post("/getalldata", (req, res) => {
	res.status(200).json({
		data: doctors.find().reverse(),
	});
});

router.get("/fileupload", (req, res) => {
	res.send(`<!DOCTYPE html>
    <html>
    <body>
    
    <p>Click on the "Choose File" button to upload a file:</p>
    
    <form action="/action_page.php">
      <input type="file" id="myFile" name="filename">
      <input type="submit">
    </form>
    
    </body>
    </html>
    `);
});

router.post("/post-formdata", (req, res) => {
	console.log(req.body);
	return res.status(200).json("data is sent successfully");
});

module.exports = router;
