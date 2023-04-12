const mongoose = require("mongoose");

const referralBonusRateSchema = new mongoose.Schema({
  RBR: {
    type: String,
    required: true,
  },
  decimal: {
    type: Number,
    required: true,
  },
  levelRate: {
    type: Array,
    required: true,
  },
  referralBonus: {
    type: Number,
    required: true,
  },
  totalRewardsAvailableForClaim: {
    type: Number,
    required: true,
  },
});

// connect referralBonusRateSchema with the "referralbonusrates" collection
module.exports = mongoose.model("referralBonusRate", referralBonusRateSchema);
