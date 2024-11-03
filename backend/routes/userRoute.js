const express = require("express");
const {
  getUserData,
  registerUser,
  updateUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserData);
router.patch("/", protect, updateUser);
router.post("/register", registerUser);

module.exports = router;
