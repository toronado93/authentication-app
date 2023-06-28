const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const { Atlas_NewUSER, Atlas_Finder } = require("./config/db");
require("dotenv").config();

const Atlas = require(__dirname + "/config/db.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Atlas Connection
Atlas.Atlas_Connection();

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    // Matched user password if everything is correct open secrets.ejs
    const username = req.body.username;
    const password = req.body.password;

    const responde = await Atlas.Atlas_Finder(username, password, "login");

    if (responde) {
      res.render("secrets.ejs");
    } else {
      res.send("Password is wrong or user not exist...");
    }
  });

app.get("/logout", (req, res) => {
  res.render("login");
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if email exist
    const responde = await Atlas.Atlas_Finder(username, password, "new_user");

    // If responde is null means user doesnt exist , process can be proceed.
    if (responde === null) {
      try {
        await Atlas.Atlas_NewUSER(username, password);
        console.log("New User Created");
        res.render("secrets.ejs");
      } catch (error) {
        console.log(error);
      }
    } else {
      res.send("User Exist..");
    }
  });

app.use(express.static("public"));
app.listen(3000, () => {
  console.log("Server is started on port 3000.");
});
