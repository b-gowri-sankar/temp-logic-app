const router = require("express").Router();
const { createEmail } = require("../controllers/gmailcontroller");
//@desc Create Gmails
//GET /createGmails

router.get("/createGmails", createEmail);

module.exports = router;
