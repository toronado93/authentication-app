const mongoose = require("mongoose");
const encryption = require("mongoose-encryption");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Generate a secret key using the value from your environment variable
// Encryption plugin options
const encryptionOptions = {
  encryptionKey: process.env.EncryptionKey, // Your encryption key
  signingKey: process.env.SigningKey, // Your signing key
  encryptedFields: ["password"], // Specify fields to be encrypted
};

// Apply encryption plugin to the schema
userSchema.plugin(encryption, encryptionOptions);

module.exports = mongoose.model("User", userSchema);
