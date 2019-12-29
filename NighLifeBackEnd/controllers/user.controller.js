const userService = require("../services/user.service");

module.exports = {
  authenticate,
  getAllUsers,
  register,
  addHighScore
};

// Authenticate the user with the correct username and password
function authenticate(req, res, next) {
  console.log("Authenticate():", req.body);
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch(err => next(err));
}

// Get all users in database
function getAllUsers(req, res, next) {
  userService
    .getAllUsers()
    .then(users => res.json(users))
    .catch(err => next(err));
}

// Register a new user in data base
function register(req, res, next) {
  userService
    .addUser(req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

// Update the highscore for a user
function addHighScore(req, res, next) {
  userService
    .addHighScore(req.body.user, req.body.score)
    .then(message => res.json(message))
    .catch(err => next(err));
}
