const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  referralLink: String,
  address: String,
})

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
    type: Map,
    of: usersSchema,
    required: true,
  },
  lastUpdate: {
    build: Number,
    unwind: Number,
  },
});

// connect referralProgramData with the "referralprogramdatas" collection
module.exports = mongoose.model(
  "referralProgramData",
  referralProgramDataSchema
);
