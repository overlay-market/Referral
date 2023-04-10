const ethers = require("ethers");
const abi = require("./Abi/abi1.json");
const config = require("./config.json");
const abi2 = require("./Abi/abi2.json");

const network = {
  name: "Arbitrum",
  chainId: 42161,
  _defaultProvider: (providers) =>
    new providers.JsonRpcProvider(
      `https://arb-mainnet.g.alchemy.com/v2/${process.env.ID}`
    ),
};

const provider = ethers.getDefaultProvider(network);

const SOL_USDmarket = getAddress(config.MARKETS["SOL/USD"], abi);
const APE_USDmarket = getAddress(config.MARKETS["APE/USD"], abi);

const WBTC_USDmarket = getAddress(config.MARKETS["WBTC/USD"], abi);
const LINK_USDmarket = getAddress(config.MARKETS["LINK/USD"], abi);

const AVAX_USDmarket = getAddress(config.MARKETS["AVAX/USD"], abi);
const MATIC_USDmarket = getAddress(config.MARKETS["MATIC/USD"], abi);

const stateContract = getAddress(
  config.CORE_CONTRACTS.OVERLAY_V1_STATE_CONTRACT_ADDRESS,
  abi2
);

function getAddress(address, abii) {
  const contract = new ethers.Contract(address, abii, provider);
  return contract;
}

async function read1(sender, id, referral, mark, SOL_USDmarketb) {
  await referral.addReferrer(
    "0x58DEbF4D4b04b3F5DB9e962DE81d589DD679f992",
    "0x58DEbF4D4b04b3F5DB9e962DE81d589DD679f992"
  );

  if (await referral.hasReferrer(sender, userTradingFee)) {
    await referral.updateReferral(userTradingFee, sender);
  } else {
    console.log("dd");
    return "user has no referral";
  }
}

async function read(sender, id, referral, mark, SOL_USDmarketb) {
  // TODO

  /*
   from frontend if user indicate they have a referral address or 
   they come to app via a user referral link the 
   referral.addReferral() is called
  */

  await referral.addReferrer(
    "0x58DEbF4D4b04b3F5DB9e962DE81d589DD679f992",
    "0x58DEbF4D4b04b3F5DB9e962DE81d589DD679f992"
  );

  if (await referral.hasReferrer(sender)) {
    const notional = await mark.notional(SOL_USDmarketb.address, sender, id);
    console.log("dd");
    const riskParamTradingFee = await SOL_USDmarketb.params(11);
    const userTradingFee = notional * riskParamTradingFee;
    console.log(userTradingFee / 1e18);
    await referral.updateReferral(userTradingFee / 1e18, sender);
  } else {
    console.log("dd");
    return "user has no referral";
  }

  // let f = await referral.getTotalRewardsAvailableForClaim();
  // let u = await referral.getUserReferralReward("nnn");
  // console.log(u, f);
  // console.log("works");
}

module.exports = {
  read,
  read1,
  SOL_USDmarket,
  APE_USDmarket,
  WBTC_USDmarket,
  LINK_USDmarket,
  AVAX_USDmarket,
  MATIC_USDmarket,
};
