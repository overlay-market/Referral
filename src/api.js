const express = require("express");
const referralsRouter = require("./referrals.router.js");

const api = express.Router();
api.use("/referral", referralsRouter);

module.exports = api;
