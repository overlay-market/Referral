const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  referrer: {
    type: String,
    required: false,
  },
  reward: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  redeemed: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  referredCount: {
    type: Number,
    required: true,
  },
  referralLinks: {
    type: [String],
  },
});

// connect accountSchema with the "accounts" collection
module.exports = mongoose.model("accounts", accountSchema);
