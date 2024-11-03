const express = require("express");
const {
  getUserData,
  registerUser,
  updateUser,
  changePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserData);
router.patch("/", protect, updateUser);
router.patch("/changepassword", protect, changePassword);
router.post("/register", registerUser);

module.exports = router;
