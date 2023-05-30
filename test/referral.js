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

      const body = {
        username: "jhjyy",
        sender: user1.address,
      };

      const body0 = {
        sender: user4.address,
        referrer: user1.address,
      };

      await referral.createReferralCode(body);

      const hasReferralBeforeTx = await referral.hasReferrer(user4.address);
      await referral.addReferrer(body0);
      const hasReferralAfterTx = await referral.hasReferrer(user4.address);

      expect(hasReferralBeforeTx).to.be.equal(false);
      expect(hasReferralAfterTx).to.be.equal(true);
    });

    it("Should update referral count", async function () {
      await ovl.connect(owner).transfer(user5.address, "2000000000000000000");
      await ovl
        .connect(user5)
        .approve(config.MARKETS["SOL/USD"], "2000000000000000000000");

      const userInfoBeforeTx = await referral.getUserInfo(user1.address);

      const body = {
        sender: user5.address,
        referrer: user1.address,
      };

      await referral.addReferrer(body);

      await build(user5);

      const userInfoAfterTx = await referral.getUserInfo(user1.address);

      expect(userInfoAfterTx.referredCount).to.be.above(
        userInfoBeforeTx.referredCount
      );
    });

    it("Should pay all uplines", async function () {
      let users = [owner, user, user2];

      for (let i = 0; i < users.length; i++) {
        const body = {
          sender: users[i].address,
          referrer: referrals[i].address,
        };

        await referral.addReferrer(body);
        await build(users[i]);
      }

      let uplines = await referral.getUserUplines(owner.address);
      let userInfoBeforeTx = await referral.getUserInfo(uplines[0]);

      await build(owner);
      let userInfoAfterTx = await referral.getUserInfo(uplines[0]);

      expect(userInfoAfterTx.reward).to.be.above(userInfoBeforeTx.reward);
    });

    it("Should fail and return already has a referral", async function () {
      const body = {
        sender: user2.address,
        referrer: owner.address,
      };

      let error;

      try {
        await referral.addReferrer(body);
      } catch (err) {
        error = err;
      }

      expect(`${error}`).to.be.equal("Error: Already has a referral");
    });

    it("Should update discount correctly", async function () {
      let userInfoBeforeBuild = await referral.getUserInfo(owner.address);
      await build(owner);

      const notional = await market.notional(
        SOL_USDmarket.address,
        owner.address,
        id
      );
      const riskParamTradingFee = await SOL_USDmarket.params(11);

      const userTradingFee = (notional * riskParamTradingFee) / 1e18;
      const fee = userTradingFee * 0.2;

      let userInfoAfterBuild = await referral.getUserInfo(owner.address);
      expect(userInfoBeforeBuild.discount + fee).to.be.equal(
        userInfoAfterBuild.discount
      );
    });

    it("Should change level rate", async function () {
      let data = await referral.getProgramData();
      expect(data.levelRate.length).to.be.equal(4);

      const body = {
        newRate: [40, 35, 25],
      };

      await referral.setLevelRate(body);

      data = await referral.getProgramData();
      expect(data.levelRate.length).to.be.equal(3);
    });
  });
});
