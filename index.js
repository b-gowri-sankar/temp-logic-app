const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = 8000;

//available routes
app.use("/api", require("./routes"));

app.listen(PORT, () => {
  console.log(`Backend App Connected ${PORT}`);
});
