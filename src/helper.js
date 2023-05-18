const ether = require("ethers");
const { network } = require("hardhat");
const abi = require("./abi/abi1.json");
const config = require("./config.json");
const abi2 = require("./abi/abi2.json");

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
  const contract = await ethers.getContractAt("HelpfulInterface", address);
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

/**
 * @dev Reads event from Build(),
 * Calculates the tradingFee and calls referral class.
 */
async function read(sender, id, referral, stateContract, marketContract) {
  if (await referral.hasReferrer(sender)) {
    const notional = await stateContract.notional(
      marketContract.address,
      sender,
      id
    );
    const riskParamTradingFee = await marketContract.params(11);

    const userTradingFee = notional * riskParamTradingFee;
    await referral.updateReferral(userTradingFee / 1e18, sender);
  } else return "user has no referral";
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
