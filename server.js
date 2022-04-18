require("dotenv").config();
const express = require("express");
const cors = require("cors");
var app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const max = 2000000000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { Schema } = mongoose;

const urlSchema = new Schema({
  url: String,
  short_url: Number,
});

const Url = mongoose.model("Url", urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors(), bodyParser.urlencoded({extended: false}));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", function querypara2(req, res, done) {
  var randNumber = Math.floor(Math.random() * max);
  const url = new Url({
    url: req.body.url.toString(),
    short_url: randNumber,
  });
  url.save(function (err, data) {
    if (err) return console.error(err);
    return done(null, data);
  });
  res.json({ original_url: req.body.url, short_url: randNumber });
});

app.get("/api/shorturl/:short_url", function (req, res, done) {
  Url.findOne({ short_url: req.params.short_url }, function (err, doc) {
    if (err) return console.error(err);
    // res.json({12: "hello",hello: doc.url});
    res.redirect(String(doc.url));
  });
  
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
