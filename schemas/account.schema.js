const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  referrer: {
    type: String,
    required: false,
  },
  reward: {
    type: Number,
    required: true,
  },
  uplines: {
    type: Array,
    required: true,
  },
  referredCount: {
    type: Number,
    required: true,
  },
});

// connect accountSchema with the "accounts" collection
module.exports = mongoose.model("account", accountSchema);
