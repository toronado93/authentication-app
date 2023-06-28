require("dotenv").config();
const { default: mongoose } = require("mongoose");
const User = require("/Users/ertac/Desktop/Local Project Storage/Node JS/Secrets - Starting Code/models/user.js");

const Monk_Url = process.env.MONGO_URL;
const Monk_Object = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Mongo Connection

const Atlas_Connection = async () => {
  try {
    const respond = await mongoose.connect(Monk_Url, Monk_Object);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

// User Finder

const Atlas_Finder = async (email, password, operation_type) => {
  // When new user is created , atlas finder only looks email.

  if (operation_type === "new_user") {
    const responde = await User.exists({ email: email });
    return responde;
  } else if (operation_type === "login") {
    const user = await User.exists({ email: email });

    if (user) {
      const user_data = await User.findOne({ email: email });

      if (password === user_data.password) {
        return true;
      }
    }
  }
};

// User Create
const Atlas_NewUSER = async (email, password) => {
  // Firstly Check If the user Exist Turn Customer failure

  const new_user = new User({ email: email, password: password });

  try {
    const responde = new_user.save();
    return responde;
  } catch (error) {
    console.log(error);
  }
};

module.exports.Atlas_Connection = Atlas_Connection;
module.exports.Atlas_NewUSER = Atlas_NewUSER;
module.exports.Atlas_Finder = Atlas_Finder;
