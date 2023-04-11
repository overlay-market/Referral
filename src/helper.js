const ether = require("ethers");
const { network } = require("hardhat");
const abi = require("./Abi/abi1.json");
const config = require("./config.json");
const abi2 = require("./Abi/abi2.json");

const networks = {
  name: "Arbitrum",
  chainId: 42161,
  _defaultProvider: (providers) =>
    new providers.JsonRpcProvider(
      `https://arb-mainnet.g.alchemy.com/v2/${process.env.ID}`
    ),
};

const provider = ether.getDefaultProvider(networks);

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

async function fork_network(blockNumber) {
  /// Use mainnet fork as provider
  return network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ID}`,
          blockNumber: blockNumber,
        },
      },
    ],
  });
}

async function getLiveAddress(address) {
  const contract = await ethers.getContractAt("Im", address);
  return contract;
}

async function impersonate(address) {
  return network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });
}

function getAddress(address, abii) {
  const contract = new ether.Contract(address, abii, provider);
  return contract;
}

async function read(
  sender,
  id,
  referral,
  mark,
  SOL_USDmarketb,
  referrer,
  referralLink
) {
  // TODO

  /*
   from frontend if user indicate they have a referral address or 
   they come to app via a user referral link the 
   referral.addReferral() is called
  */

  if (referralLink) {
    const result = await referral.addReferrer(referrer, sender);
    if (result["tx"]) {
      await u(sender, id, SOL_USDmarketb);
    } else return result["reason"];
  }

  if (await referral.hasReferrer(sender)) {
    await u(sender, id, SOL_USDmarketb);
  } else {
    return "user has no referral";
  }

  async function u(sender, id, SOL_USDmarketb) {
    const notional = await mark.notional(SOL_USDmarketb.address, sender, id);
    const riskParamTradingFee = await SOL_USDmarketb.params(11);

    const userTradingFee = notional * riskParamTradingFee;
    await referral.updateReferral(userTradingFee / 1e18, sender);
  }
}

module.exports = {
  read,
  impersonate,
  fork_network,
  SOL_USDmarket,
  APE_USDmarket,
  WBTC_USDmarket,
  LINK_USDmarket,
  AVAX_USDmarket,
  getLiveAddress,
  MATIC_USDmarket,
};
