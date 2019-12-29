const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/database");
const User = db.User;

// Export these methods so that they can be used elsewhere
module.exports = {
  authenticate,
  getAllUsers,
  getById,
  addUser,
  addHighScore
};

// This method is written by Dr. Esakia and ensures that the hashed password is matched with the given password when logging in
async function authenticate({ username, password }) {
  const user = await User.findOne({ userCase: username.toUpperCase() });

  console.log(user);
  if (user && bcrypt.compareSync(password, user.hash)) {
    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);

    return {
      ...userWithoutHash,
      token
    };
  }
}

// Gets all users from database
async function getAllUsers() {
  return await User.find().select("-hash");
}

// Gets user by their id
async function getById(id) {
  return await User.find({ _id: id });
}

// Adds user to database
async function addUser(userParam) {
  // validate
  if (await User.findOne({ userCase: userParam.userCase })) {
    throw 'Username "' + userParam.username + '" is already taken';
  } else if (await User.findOne({ email: userParam.email })) {
    throw 'Email "' + userParam.email + '" is already taken';
  }
  const user = new User(userParam);
  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}

// We add the high score if the difficulty is Hard and previous score is lower than the new score
async function addHighScore(user, score) {
  const player = await User.find({ _id: user._id });
  // Get current user and see what their current score is and update accordingly
  if (player[0].highscore == "0") {
    player[0].highscore = score;
    await player[0].save();
  } else {
    var firstColon = player[0].highscore.indexOf(":");
    var secondColon = player[0].highscore.indexOf(":", firstColon + 1);
    var firstComma = player[0].highscore.indexOf(",");
    var secondComma = player[0].highscore.indexOf(",", firstComma + 1);
    var playerScore = player[0].highscore.substring(
      secondColon + 2,
      secondComma
    );

    firstColon = score.indexOf(":");
    secondColon = score.indexOf(":", firstColon + 1);
    firstComma = score.indexOf(",");
    secondComma = score.indexOf(",", firstComma + 1);
    var newPlayerScore = score.substring(secondColon + 2, secondComma);

    var numNewPlayerScore = Number(newPlayerScore);
    var numPlayerScore = Number(playerScore);

    // If new score is high score and difficulty is Hard
    if (numNewPlayerScore > numPlayerScore && score.includes("Hard")) {
      player[0].highscore = score;
      await player[0].save();
    }
    // If difficulty is Hard while current score difficulty is lower, then replace score with harder difficulty
    else if (
      score.includes("Hard") &&
      (player[0].highscore.includes("Easy") ||
        player[0].highscore.includes("Medium"))
    ) {
      player[0].highscore = score;
      await player[0].save();
    }
  }
}
