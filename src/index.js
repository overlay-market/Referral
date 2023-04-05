require("dotenv").config();

const ethers = require("ethers");
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config.json");
const { createServer } = require("http");

const app = express();
const server = createServer(app);
const mongoDBUrl = `${process.env.MONGO_DB_URL}`;

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
  await read(SOL_USDmarket, sender, positionId);
});

APE_USDmarket.on("Build", async (sender, positionId) => {
  await read(APE_USDmarket, sender, positionId);
});

AVAX_USDmarket.on("Build", async (sender, positionId) => {
  await read(AVAX_USDmarket, sender, positionId);
});

MATIC_USDmarket.on("Build", async (sender, positionId) => {
  await read(MATIC_USDmarket, sender, positionId);
});

WBTC_USDmarket.on("Build", async (sender, positionId) => {
  await read(WBTC_USDmarket, sender, positionId);
});

LINK_USDmarket.on("Build", async (sender, positionId) => {
  await read(LINK_USDmarket, sender, positionId);
});
