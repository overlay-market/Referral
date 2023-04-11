const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { assert, expect } = require("chai");
const { mongoConnect, mongoDisconnect } = require("../src/services/mongo");

const {
  getReward,
  read,
  getUplines,
  getUserReferralCount,
} = require("../src/helper");

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

async function deployClass() {
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

  console.log("Class deployed");
  return referral;
}

describe("Lock", async function () {
  let impersonatedAddress = "0x072D06505950FD8a55F8cbc2d3796aFff1D84C11",
    owner,
    ovl,
    user,
    user1,
    market,
    referral,
    referrals,
    SOL_USDmarket;

  beforeEach(async () => {
    await fork_network(78527593);
    await mongoConnect();
    await impersonate(impersonatedAddress);
    owner = await ethers.getSigner(impersonatedAddress);

    [user, user1, user2, user3, user4, user5] = await ethers.getSigners();
    referral = await deployClass();
    referrals = [user, user1, user2];

    let gfg = [user, user1];

    SOL_USDmarket = await getAddress(config.MARKETS["SOL/USD"]);

    ovl = await getAddress(
      config.CORE_CONTRACTS["OVERLAY_V1_TOKEN_CONTRACT_ADDRESS"]
    );

    await ovl
      .connect(owner)
      .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

    for (let i = 0; i < gfg.length; i++) {
      await ovl.connect(owner).transfer(gfg[i].address, "3000000000000000000");
      await ovl
        .connect(gfg[i])
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");
    }

    market = await getAddress(
      config.CORE_CONTRACTS["OVERLAY_V1_STATE_CONTRACT_ADDRESS"]
    );
  });

  this.afterAll(async () => {
    await mongoDisconnect();
  });

  async function build() {
    let users = [owner, user, user1];

    for (let i = 0; i < users.length; i++) {
      let tx = await SOL_USDmarket.connect(users[i]).build(
        "2000000000000000000",
        "1000000000000000000",
        true,
        "20300000000000000000"
      );

      let t = await tx.wait();

      await read(
        t.events[0].args[0],
        t.events[0].args[1],
        referral,
        market,
        SOL_USDmarket,
        referrals[i].address,
        true
      );
    }
  }

  describe("Referral", function () {
    it.skip("Should add referral", async function () {
      await ovl.connect(user1).transfer(user4.address, "2000000000000000000");
      await ovl
        .connect(user4)
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

      const hasReferralBeforeTx = await referral.hasReferrer(user4.address);

      let tx = await SOL_USDmarket.connect(user4).build(
        "1000000000000000000",
        "1000000000000000000",
        true,
        "20300000000000000000"
      );

      let t = await tx.wait();

      await read(
        t.events[0].args[0],
        t.events[0].args[1],
        referral,
        market,
        SOL_USDmarket,
        user1.address,
        true
      );

      const hasReferralAfterTx = await referral.hasReferrer(user4.address);

      expect(hasReferralBeforeTx).to.be.equal(false);
      expect(hasReferralAfterTx).to.be.equal(true);
    });

    it.skip("Should update referral count", async function () {
      await ovl.connect(user1).transfer(user5.address, "2000000000000000000");
      await ovl
        .connect(user5)
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

      const userReferralBeforeTx = await getUserReferralCount(
        user1.address,
        referral
      );

      let tx = await SOL_USDmarket.connect(user5).build(
        "1000000000000000000",
        "1000000000000000000",
        true,
        "20300000000000000000"
      );

      let t = await tx.wait();

      await read(
        t.events[0].args[0],
        t.events[0].args[1],
        referral,
        market,
        SOL_USDmarket,
        user1.address,
        true
      );

      const userReferralAfterTx = await getUserReferralCount(
        user1.address,
        referral
      );

      expect(userReferralAfterTx).to.be.above(userReferralBeforeTx);
    });

    it("Should pay all uplines", async function () {
      let uplines = await getUplines(owner.address, referral);
      let firstUplineBeforeBuild = await getReward(uplines[0], referral);
      let secondUplineBeforeBuild = await getReward(uplines[1], referral);
      let thirdUplineBeforeBuild = await getReward(uplines[2], referral);

      let tx = await SOL_USDmarket.connect(owner).build(
        "1000000000000000000",
        "1000000000000000000",
        true,
        "20300000000000000000"
      );

      let t = await tx.wait();

      await read(
        t.events[0].args[0],
        t.events[0].args[1],
        referral,
        market,
        SOL_USDmarket,
        referrals[2].address,
        true
      );
      let firstUplineAfterBuild = await getReward(uplines[0], referral);
      let secondUplineAfterBuild = await getReward(uplines[1], referral);
      let thirdUplineAfterBuild = await getReward(uplines[2], referral);

      expect(firstUplineAfterBuild).to.be.above(firstUplineBeforeBuild);
      expect(secondUplineAfterBuild).to.be.above(secondUplineBeforeBuild);
      expect(thirdUplineAfterBuild).to.be.above(thirdUplineBeforeBuild);
    });
  });
});
