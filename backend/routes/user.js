const express = require("express");
const router = express.Router();
const { userLoggedInOrNot } = require("../middleware/authorisation");
const {
  handleSignUp,
  handleLogIn,
  handleLogOut,
  getUserById
} = require("../controllers/user");
router.post('/signup', handleSignUp);
router.post('/login', handleLogIn);
router.post('/logout', userLoggedInOrNot , handleLogOut);
router.get('/getuser', userLoggedInOrNot , getUserById);
module.exports = router;