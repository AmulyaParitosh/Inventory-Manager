const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserData,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/data", protect, getUserData);

module.exports = router;
