require("dotenv").config();

const ethers = require("ethers");
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config.json");
const { createServer } = require("http");
const referralClass = require("./referral");
const { mongoConnect } = require("./services/mongo");

const app = express();
const server = createServer(app);

const {
  read,
  SOL_USDmarket,
  APE_USDmarket,
  WBTC_USDmarket,
  LINK_USDmarket,
  AVAX_USDmarket,
  MATIC_USDmarket,
} = require("./helper");

SOL_USDmarket.on("Build", async (sender, positionId) => {
  await read(SOL_USDmarket, sender, positionId, referral);
});

APE_USDmarket.on("Build", async (sender, positionId) => {
  await read(APE_USDmarket, sender, positionId, referral);
});

AVAX_USDmarket.on("Build", async (sender, positionId) => {
  await read(AVAX_USDmarket, sender, positionId, referral);
});

MATIC_USDmarket.on("Build", async (sender, positionId) => {
  await read(MATIC_USDmarket, sender, positionId, referral);
});

WBTC_USDmarket.on("Build", async (sender, positionId) => {
  await read(WBTC_USDmarket, sender, positionId, referral);
});

LINK_USDmarket.on("Build", async (sender, positionId) => {
  await read(LINK_USDmarket, sender, positionId, referral);
});

server.listen(8080, async function () {
  await mongoConnect();
  console.log("Listening on http://0.0.0.0:8080");
});

module.exports = {
  nn,
};
