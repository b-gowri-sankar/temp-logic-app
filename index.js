const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var loki = require('lokijs');
var db = new loki('db.json');
var doctors = db.addCollection('doctors')
doctors.insert({ name: `David Tennant`, doctorNumber: 10 });
doctors.insert({ name: `Matt Smith`, doctorNumber: 11 });
var res = doctors.find()
console.log(res)
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
