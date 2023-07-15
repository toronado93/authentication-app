const mongoose = require("mongoose");
require("dotenv").config();
// const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Middleware
// userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
