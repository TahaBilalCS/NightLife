var express = require("express");
var router = express.Router();
const userController = require("../controllers/user.controller");
const Role = require("../_helpers/role");
const authorize = require("../_helpers/authorize");

// These are the routes a user can reach
router.post("/authenticate", userController.authenticate);
router.post("/register", userController.register);
router.post("/highscore", userController.addHighScore);
router.get("/allusers", authorize(Role.admin), userController.getAllUsers);

module.exports = router;
