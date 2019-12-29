const config = require("../config.json");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
  useCreateIndex: true,
  useNewUrlParser: true
});

// Our database only has users
module.exports = {
  User: require("../models/user.model")
};
