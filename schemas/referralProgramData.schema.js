const mongoose = require("mongoose");

const referralProgramDataSchema = new mongoose.Schema({
  RPD: {
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
  discountDays: {
    type: Number,
    required: true,
  },
  discountBonus: {
    type: Number,
    required: true,
  },
  totalRewardsAvailableForClaim: {
    type: Number,
    required: true,
  },
  users: {
    type: Object,
    required: true,
  },
});

// connect referralProgramData with the "referralprogramdatas" collection
module.exports = mongoose.model(
  "referralProgramData",
  referralProgramDataSchema
);
