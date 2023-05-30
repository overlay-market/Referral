const mongoose = require("mongoose");

const testAccountSchema = new mongoose.Schema({
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
  date: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  referredCount: {
    type: Number,
    required: true,
  },
  referralLinks: {
    type: Object,
  },
});

// connect testAccountSchema with the "testaccounts" collection
module.exports = mongoose.model("testaccount", testAccountSchema);
