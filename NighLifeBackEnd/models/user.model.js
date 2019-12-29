const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// These are the values we store for each user, most are required to add the user correctly
const schema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  userCase: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  role: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  highscore: { type: String, default: "0" }
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", schema);
