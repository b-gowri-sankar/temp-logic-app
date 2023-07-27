const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

var multer = require("multer");
var upload = multer();

const app = express();

app.use(
	cors({
		origin: "*",
	})
);
app.use(bodyParser.text({ type: "text/plain" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(upload.array());
app.use(express.static("public"));

const PORT = 8000;

//available routes
app.use("/api", require("./routes"));

app.listen(PORT, () => {
	console.log(`Backend App Connected ${PORT}`);
});
