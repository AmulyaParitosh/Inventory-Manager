const mongoos = require("mongoose");

const tokenSchema = mongoos.Schema({
  userId: {
    type: mongoos.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Token = mongoos.model("Token", tokenSchema);
module.exports = Token;
