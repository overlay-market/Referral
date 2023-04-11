const {
  read,
  impersonate,
  fork_network,
  getLiveAddress,
} = require("../src/helper");

const { expect } = require("chai");
const config = require("../src/config.json");
const referralClass = require("../src/referral");
const { mongoConnect, mongoDisconnect } = require("../src/services/mongo");

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

  return referral;
}

describe("Referral Program", async function () {
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
    await mongoConnect();
    referral = await deployClass();

    await fork_network(78527593);

    await impersonate(impersonatedAddress);
    owner = await ethers.getSigner(impersonatedAddress);

    [user, user1, user2, user3, user4, user5, user6] =
      await ethers.getSigners();
    referrals = [user, user1, user2];

    let len = [user, user1];
    SOL_USDmarket = await getLiveAddress(config.MARKETS["SOL/USD"]);

    ovl = await getLiveAddress(
      config.CORE_CONTRACTS["OVERLAY_V1_TOKEN_CONTRACT_ADDRESS"]
    );

    await ovl
      .connect(owner)
      .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

    for (let i = 0; i < len.length; i++) {
      await ovl.connect(owner).transfer(len[i].address, "3000000000000000000");
      await ovl
        .connect(len[i])
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");
    }

    market = await getLiveAddress(
      config.CORE_CONTRACTS["OVERLAY_V1_STATE_CONTRACT_ADDRESS"]
    );
  });

  this.afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Referral", function () {
    async function build(user, flag, referrer) {
      let tx = await SOL_USDmarket.connect(user).build(
        "1000000000000000000",
        "1000000000000000000",
        true,
        "20300000000000000000"
      );

      let t = await tx.wait();

      let result = await read(
        t.events[0].args[0],
        t.events[0].args[1],
        referral,
        market,
        SOL_USDmarket,
        referrer,
        flag
      );

      return result;
    }
    it("Should fail and return user has no upline", async function () {
      await ovl.connect(user1).transfer(user4.address, "2000000000000000000");
      await ovl
        .connect(user4)
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

      const result = await build(user4, false, user1.address);
      expect(result).to.be.equal("user has no referral");
    });

    it("Should fail and  return referee cannot be one of referrer uplines", async function () {
      await ovl.connect(user1).transfer(user6.address, "2000000000000000000");
      await ovl
        .connect(user6)
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

      const result = await build(user6, true, user6.address);
      expect(result).to.be.equal("Referee cannot be one of referrer uplines");
    });

    it("Should add referral", async function () {
      await ovl.connect(user1).transfer(user4.address, "2000000000000000000");
      await ovl
        .connect(user4)
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

      const hasReferralBeforeTx = await referral.hasReferrer(user4.address);
      await build(user4, true, user1.address);
      const hasReferralAfterTx = await referral.hasReferrer(user4.address);

      expect(hasReferralBeforeTx).to.be.equal(false);
      expect(hasReferralAfterTx).to.be.equal(true);
    });

    it("Should update referral count", async function () {
      await ovl.connect(user1).transfer(user5.address, "2000000000000000000");
      await ovl
        .connect(user5)
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

      const userReferralBeforeTx = await referral.getUserReferralCount(
        user1.address
      );
      await build(user5, true, user1.address);

      const userReferralAfterTx = await referral.getUserReferralCount(
        user1.address
      );
      expect(userReferralAfterTx).to.be.above(userReferralBeforeTx);
    });

    it("Should pay all uplines", async function () {
      let users = [owner, user, user1];

      for (let i = 0; i < users.length; i++) {
        await build(users[i], true, referrals[i].address);
      }

      let uplines = await referral.getUplines(owner.address);
      let firstUplineBeforeBuild = await referral.getUserReferralReward(
        uplines[0]
      );

      await build(owner, false, referrals[2].address);
      let firstUplineAfterBuild = await referral.getUserReferralReward(
        uplines[0]
      );

      expect(firstUplineAfterBuild).to.be.above(firstUplineBeforeBuild);
    });

    it("Should fail and return already has a referral", async function () {
      const result = await build(owner, true, user6.address);
      expect(result).to.be.equal("already has a referral");
    });
  });
});
