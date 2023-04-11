require("dotenv").config();

const ethers = require("ethers");
const express = require("express");
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

async function nn() {
  referral = new referralClass(
    (decimals = 1000),
    (referralBonus = 800),
    (secondsUntilInactive = 365),
    (onlyRewardActiveReferrers = true),
    (levelRate = [600, 300, 100]),
    (refereeBonusRateMap = [1, 500, 5, 750, 15, 1000]),
    (MAX_REFER_DEPTH = 3),
    (MAX_REFEREE_BONUS_LEVEL = 3)
  );
  await read(referral);
}

// SOL_USDmarket.on("Build", async (sender, positionId) => {
//   await read(SOL_USDmarket, sender, positionId, referral);
// });

// APE_USDmarket.on("Build", async (sender, positionId) => {
//   await read(APE_USDmarket, sender, positionId, referral);
// });

// AVAX_USDmarket.on("Build", async (sender, positionId) => {
//   await read(AVAX_USDmarket, sender, positionId, referral);
// });

// MATIC_USDmarket.on("Build", async (sender, positionId) => {
//   await read(MATIC_USDmarket, sender, positionId, referral);
// });

// WBTC_USDmarket.on("Build", async (sender, positionId) => {
//   await read(WBTC_USDmarket, sender, positionId, referral);
// });

// LINK_USDmarket.on("Build", async (sender, positionId) => {
//   await read(LINK_USDmarket, sender, positionId, referral);
// });

server.listen(8080, async function () {
  await mongoConnect();
  console.log("Listening on http://0.0.0.0:8080");
});
