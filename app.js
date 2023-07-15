const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const Atlas = require(__dirname + "/config/db.js");
const app = express();
const User = require("/Users/ertac/Desktop/Local Project Storage/Node JS/Secrets - Starting Code/models/user.js");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { v4: uuidvrs4 } = require("uuid");
const FileStore = require("session-file-store")(session);

// Passport JS
const localStrategy = require("passport-local");
const passport = require("passport");

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Creating new session
app.use(
  session({
    genid: (req) => {
      //   console.log("1. in genid req.sessionID: ", req.sessionID);
      return uuidvrs4();
    },
    // store: new FileStore(),
    secret: "a private key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport

app.use(passport.initialize());
app.use(passport.session());

// Serialize
passport.serializeUser((user, done) => {
  // In this process we fill user info into the session object
  console.log("Serialized id", user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserialized");
  try {
    const user = await User.findById(id);
    console.log(user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Passport skeleton
passport.use(
  "login",
  new localStrategy(
    {
      //if your input name is different then username and password
      // you need to redirect them. if they are standart username and password
      //you dont need to add this first object argument
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        console.log("Authentication query");
        const user = await User.findOne({ email: username });

        // If user is not found or password is incorrect
        if (!user || !bcrypt.compareSync(password, user.password)) {
          console.log("User isnt exist or passsword not correct");
          return done(null, false);
        }

        // If authentication is succesfull
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Atlas Connection
Atlas.Atlas_Connection();

app.get("/", (req, res) => {
  //   console.log("Current Session ID: ", req.sessionID);
  //   console.log(req.session);
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // Authentication failed, render login page again
        return res.render("login.ejs");
      }
      console.log("Authentication success");

      //   Since we use manuall callback function , we are responsible to trigger
      // passport serialized as well.
      // Manually trigger passport.serializeUser
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        console.log("Authentication success");
        // Authentication successful, render the HTML page directly
        return res.render("secrets.ejs");
      });
    })(req, res, next);
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
