const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

mongoose.connect("mongodb://localhost:27017/storyDB", {
  useNewUrlParser: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storyScheme = mongoose.Schema({
  title: String,
  content: [String],
});

const Story = mongoose.model("Story", storyScheme);

// for including all css & image file in server
app.use(express.static(__dirname + "/public"));

//for using body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// for using ejs
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  Story.findOne({ title: "Rohan & Sohan" }, (err, found) => {
    if (err) {
      console.log(err);
    } else if (!found) {
      const story1 = new Story({
        title: "Rohan & Sohan",
        content: ["all hello ", "Nice people"],
      });
      const story2 = new Story({
        title: "Nobita & Sizuka",
        content: [],
      });

      story1.save();
      story2.save();
      res.render("index", { content: story1.content, title: story1.title });
    } else {
      res.render("index", { content: found.content, title: found.title });
    }
  });
});

app.post("/", (req, res) => {
  const title = req.body.title;
  Story.findOne({ title: title }, (err, found) => {
    if (!err) {
      found.content.push(req.body.story);
      found.save();
      res.render("index", { content: found.content, title: found.title });
    }
  });
});

app.get("/:title", (req, res) => {
  const title = req.params.title;

  Story.findOne({ title: title }, (err, foundStory) => {
    if (err) {
      console.log(err);
    } else if (!foundStory) {
      console.log("not found!");
      res.redirect("/");
    } else {
      res.render("index", {
        title: foundStory.title,
        content: foundStory.content,
      });
    }
  });
});

app.listen(3000, () => {
  console.log("running");
});
