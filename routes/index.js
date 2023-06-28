const router = require("express").Router();
const { emailData } = require("../controllers/apiData");
var loki = require('lokijs');
var db = new loki('db.json');
var doctors = db.addCollection('doctors')
//@desc Create Gmails
//GET /createGmails

router.post("/emailData", emailData)
router.post("/adddata", (req, res) => {
    doctors.insert({ name: `Matt Smith`, doctorNumber: 11, created: new Date() });
    res.status(200).json({
        message:"Added data successfully"
    })
})

router.post("/getalldata", (req,res) => {
    res.status(200).json({
        data: doctors.find().reverse()
    })
})

module.exports = router;
