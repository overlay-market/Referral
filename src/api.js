const express = require("express");
const referralsRouter = require("./referrals.router.js");
const fetcherRouter = require("./fetcher.router.js");

const api = express.Router();
api.use("/referral", referralsRouter);
api.use("/fetcher", fetcherRouter)

module.exports = api;
