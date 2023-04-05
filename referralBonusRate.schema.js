const mongoose = require("mongoose");

const referralBonusRateSchema = new mongoose.Schema({
  lowerBound: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
});

// connect referralBonusRateSchema with the "referralbonusrates" collection
module.exports = mongoose.model("referralBonusRate", referralBonusRateSchema);
