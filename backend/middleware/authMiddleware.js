const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not Authorized. Please Login");
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      res.status(401);
      throw new Error("Invalid or expired token!");
    }

    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User not found.");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not Authorized. Please Login");
  }
});

module.exports = { protect };
