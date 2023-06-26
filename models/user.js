const mongoose = require("mongoose");
const mongoose_encryption = require("mongoose-encryption");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Generate a secret key using the value from your environment variable

module.exports = mongoose.model("User", userSchema);
