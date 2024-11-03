const asyncHandler = require("express-async-handler");
const { generateToken } = require("./authController");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields!");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Please enter password larder than 6 letters");
  }

  // Check if email not already exist
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error(`The user is already registered with email ${email}`);
  }

  // Create new User
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;

    const token = generateToken(_id);

    // Send token in http-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // I day
      sameSite: "none",
      secure: true,
    });

    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data!");
  }
});

const getUserData = asyncHandler(async (req, res) => {
  const { _id, name, email, photo, phone, bio } = req.user;
  res.status(200).json({
    _id,
    name,
    email,
    photo,
    phone,
    bio,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  user = req.user;
  const { _id, name, photo, phone, bio } = user;
  user.name = req.body.name || name;
  user.photo = req.body.photo || photo;
  user.phone = req.body.phone || phone;
  user.boi = req.body.bio || bio;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    photo: updatedUser.photo,
    phone: updatedUser.phone,
    bio: updatedUser.bio,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    res.status(400);
    throw new Error("Please enter both current_password and new_password!");
  }

  const user = await User.findById(req.user._id);

  const passwordIsCorrect = await bcrypt.compare(
    current_password,
    user.password
  );

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("The current password does not match.");
  }

  user.password = new_password;
  await user.save();

  res.status(200).send("Password changed successfully.");
});

module.exports = {
  registerUser,
  getUserData,
  updateUser,
  changePassword,
};
