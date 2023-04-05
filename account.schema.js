const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  referrer: {
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  referredCount: {
    type: Number,
    required: true,
  },
  lastActiveTimestamp: {
    type: Number,
    required: true,
  },
});

// connect accountSchema with the "accounts" collection
module.exports = mongoose.model("account", accountSchema);
