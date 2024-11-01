const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  checkLoggedIn,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/status", checkLoggedIn);

module.exports = router;
