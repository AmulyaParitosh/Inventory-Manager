const express = require("express");
const { getUserData } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserData);

module.exports = router;
