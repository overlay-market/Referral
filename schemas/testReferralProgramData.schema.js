const mongoose = require("mongoose");

const testReferralProgramDataSchema = new mongoose.Schema({
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

// connect referralProgramData with the "testreferralprogramdatas" collection
module.exports = mongoose.model(
  "testreferralProgramData",
  testReferralProgramDataSchema
);
