const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter email and password");
  }

  // const hashedPassword =
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error(`No user with email: ${email}. Please Signup.`);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Wrong password entered.");
  }

  const { _id, name, photo, phone, bio } = user;

  const token = generateToken(_id);

  // Send token in http-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // I day
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    _id,
    name,
    email,
    photo,
    phone,
    bio,
    token,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  // there are some methods to logout
  // we are going with expire the cookie
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({
    msg: "Logged out successfully.",
  });
});

const checkLoggedIn = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (!verified) {
    return res.json(false);
  }
  return res.json(true);
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkLoggedIn,
};
