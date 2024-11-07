const express = require("express");
const {
  getUserData,
  registerUser,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserData);
router.patch("/", protect, updateUser);
router.patch("/changepassword", protect, changePassword);
router.post("/register", registerUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);

module.exports = router;
