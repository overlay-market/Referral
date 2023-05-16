const {
  read,
  addReferral,
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
    (levelRate = [400, 300, 200, 100]),
    (maxReferDepth = 4),
    (discountDays = 2592000),
    (discountBonus = 200)
  );

  return referral;
}

describe("Referral Program", async function () {
  let owner,
    id,
    ovl,
    user,
    user1,
    market,
    referral,
    referrals,
    SOL_USDmarket,
    impersonatedAddress = "0x072D06505950FD8a55F8cbc2d3796aFff1D84C11";

  beforeEach(async () => {
    await mongoConnect();
    referral = await deployClass();

    await fork_network(78527593);
    await impersonate(impersonatedAddress);

    owner = await ethers.getSigner(impersonatedAddress);
    [user, user1, user2, user3, user4, user5, user6] =
      await ethers.getSigners();

    referrals = [user4, user5, user1];
    let len = [user, user2];

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
    async function build(user) {
      let tx = await SOL_USDmarket.connect(user).build(
        "1000000000000000000",
        "1000000000000000000",
        true,
        "20300000000000000000"
      );

      let t = await tx.wait();
      id = t.events[0].args[1];

      let result = await read(
        t.events[0].args[0],
        t.events[0].args[1],
        referral,
        market,
        SOL_USDmarket
      );

      return result;
    }

    it("Should fail and return user has no upline", async function () {
      await ovl.connect(owner).transfer(user4.address, "2000000000000000000");
      await ovl
        .connect(user4)
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

      const result = await build(user4);
      expect(result).to.be.equal("user has no referral");
    });

    it("Should add referral", async function () {
      await ovl.connect(owner).transfer(user4.address, "2000000000000000000");
      await ovl
        .connect(user4)
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

      await referral.createReferralCode("jhjyy", user1.address);

      const hasReferralBeforeTx = await referral.hasReferrer(user4.address);
      await addReferral(referral, user1.address, user4.address);
      const hasReferralAfterTx = await referral.hasReferrer(user4.address);

      expect(hasReferralBeforeTx).to.be.equal(false);
      expect(hasReferralAfterTx).to.be.equal(true);
    });

    it("Should update referral count", async function () {
      await ovl.connect(owner).transfer(user5.address, "2000000000000000000");
      await ovl
        .connect(user5)
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

      const userReferralBeforeTx = await referral.getUserReferralCount(
        user1.address
      );

      await addReferral(referral, user1.address, user5.address);

      await build(user5);

      const userReferralAfterTx = await referral.getUserReferralCount(
        user1.address
      );

      expect(userReferralAfterTx).to.be.above(userReferralBeforeTx);
    });

    it("Should pay all uplines", async function () {
      let users = [owner, user, user2];

      for (let i = 0; i < users.length; i++) {
        await addReferral(referral, referrals[i].address, users[i].address);
        await build(users[i]);
      }

      let uplines = await referral.getUserUplines(owner.address);
      let firstUplineBeforeBuild = await referral.getUserReferralReward(
        uplines[0]
      );

      await build(owner);
      let firstUplineAfterBuild = await referral.getUserReferralReward(
        uplines[0]
      );

      expect(firstUplineAfterBuild).to.be.above(firstUplineBeforeBuild);
    });

    it("Should fail and return already has a referral", async function () {
      const result = await addReferral(referral, owner.address, user2.address);
      expect(result).to.be.equal("already has a referral");
    });

    it("Should update discount correctly", async function () {
      let discountBeforeBuild = await referral.getUserDiscount(owner.address);
      await build(owner);

      const notional = await market.notional(
        SOL_USDmarket.address,
        owner.address,
        id
      );
      const riskParamTradingFee = await SOL_USDmarket.params(11);

      const userTradingFee = (notional * riskParamTradingFee) / 1e18;
      const fee = userTradingFee * 0.2;

      let discountAfterBuild = await referral.getUserDiscount(owner.address);
      expect(discountBeforeBuild + fee).to.be.equal(discountAfterBuild);
    });

    it("Discount should remain same if users date is set to zero", async function () {
      let discountBeforeBuild = await referral.getUserDiscount(user1.address);
      await build(user);

      let discountAfterBuild = await referral.getUserDiscount(user1.address);
      expect(discountBeforeBuild).to.be.equal(discountAfterBuild);
    });

    it("Should change level rate", async function () {
      let rate = await referral.getLevelRate();
      expect(rate.length).to.be.equal(4);
      await referral.setLevelRate([400, 350, 250]);
      rate = await referral.getLevelRate();
      expect(rate.length).to.be.equal(3);
    });
  });
});
