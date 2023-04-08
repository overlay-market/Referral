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

async function read(referral) {
  // TODO

  /*
   from frontend if user indicate they have a referral address or 
   they come to app via a user referral link the 
   referral.addReferral() is called
  */
  await referral.addReferrer("sender", "ui");

  // if (referral.hasReferrer(sender)) {
  //   const national = await stateContract.national(
  //     marketContract.address,
  //     sender,
  //     positionId
  //   );

  //   const riskParamTradingFee = await marketContract.params(11);
  //   const userTradingFee = national * riskParamTradingFee;

  //   referral.updateReferral(userTradingFee, sender);
  // } else {
  //   return "user has no referral";
  // }
}

module.exports = {
  read,
  SOL_USDmarket,
  APE_USDmarket,
  WBTC_USDmarket,
  LINK_USDmarket,
  AVAX_USDmarket,
  MATIC_USDmarket,
};
