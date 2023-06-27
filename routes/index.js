const router = require("express").Router();
const { emailData } = require("../controllers/apiData");
//@desc Create Gmails
//GET /createGmails

router.post("/emailData", emailData)

module.exports = router;
