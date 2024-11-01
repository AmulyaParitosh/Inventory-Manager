const asyncHandler = require("express-async-handler");

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

module.exports = {
  getUserData,
};
