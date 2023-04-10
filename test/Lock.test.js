const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { assert, expect } = require("chai");
const { mongoConnect, mongoDisconnect } = require("../src/services/mongo");

const { getReward, read } = require("../src/helper");

const { network } = require("hardhat");
const abi = require("../src/Abi/abi1.json");
const config = require("../src/config.json");
const referralClass = require("../src/referral");

async function fork_network(blockNumber) {
  /// Use mainnet fork as provider
  return network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl: `https://arb-mainnet.g.alchemy.com/v2/RuGxhTpkUt3S6InAt33l_3NZc4pFwXxS`,
          blockNumber: blockNumber,
        },
      },
    ],
  });
}

async function getAddress(address) {
  const contract = await ethers.getContractAt("Im", address);
  return contract;
}

async function impersonate(address) {
  return network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });
}

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

  console.log("oo");
  return referral;
}

describe("Lock", async function () {
  let impersonatedAddress = "0x072D06505950FD8a55F8cbc2d3796aFff1D84C11",
    owner,
    ovl,
    market,
    SOL_USDmarket;

  beforeEach(async () => {
    await fork_network(78527593);
    await mongoConnect();
    await impersonate(impersonatedAddress);
    owner = await ethers.getSigner(impersonatedAddress);

    SOL_USDmarket = await getAddress(config.MARKETS["SOL/USD"]);

    ovl = await getAddress(
      config.CORE_CONTRACTS["OVERLAY_V1_TOKEN_CONTRACT_ADDRESS"]
    );

    await ovl
      .connect(owner)
      .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

    market = await getAddress(
      config.CORE_CONTRACTS["OVERLAY_V1_STATE_CONTRACT_ADDRESS"]
    );
  });

  this.afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Deployment", function () {
    it("Should failed to deploy when levels is empty", async function () {
      let tx = await SOL_USDmarket.connect(owner).build(
        "2000000000000000000",
        "1000000000000000000",
        true,
        "20300000000000000000"
      );

      let t = await tx.wait();
      console.log(t.events[0].args[1]);

      let referral = await nn();

      await read(
        t.events[0].args[0],
        t.events[0].args[1],
        referral,
        market,
        SOL_USDmarket,
        "0x58debf4d4b04b3f5db9e962de81d589dd679f992"
      );

      let b = await getReward(
        "0x58debf4d4b04b3f5db9e962de81d589dd679f992",
        referral
      );
      console.log(b, "l");

      // assert.equal(Number(bb), Number(2497847273020215));
    });

    it("Should set the right owner", async function () {});
  });
});
