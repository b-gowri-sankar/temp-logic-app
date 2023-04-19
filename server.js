const express = require("express");

const app = express();
const dotenv = require("dotenv");
dotenv.config();
var cors = require("cors");

app.use(
	express.json({
		extended: false,
	})
);

app.use("/api/Gmail", require("./routes/gmailRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
