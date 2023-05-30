const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
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

describe("Referral API", () => {
  beforeEach(async () => {
    await mongoConnect();
    await deployClass();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET", () => {
    it("it should respond with 200 success /referral/getProgramData", async () => {
      await request(app).get("/referral/getProgramData").expect(200);
    });

    it("it should respond with 200 success /referral/checkUserName/:username", async () => {
      await request(app).get("/referral/checkUserName/users").expect(200);
    });

    it("it should respond with 200 success /referral/hasReferrer/:address", async () => {
      await request(app)
        .get("/referral/hasReferrer/0x2AF142784eD8f0ED17101bb091D58519560825e9")
        .expect(200);
    });

    it("it should respond with 200 success /referral/userInfo/:user", async () => {
      await request(app)
        .get("/referral/userInfo/0x2AF142784eD8f0ED17101bb091D58519560825e9")
        .expect(200);
    });

    it("it should respond with 200 success /referral/userAddressViaLink/:link", async () => {
      await request(app).get("/referral/userAddressViaLink/users").expect(200);
    });
  });

  describe("Test POST", () => {
    const body = {
      username: "cnote",
      sender: "0x2AF142784eD8f0ED17101bb091D58519560825e9",
    };

    const body0 = {
      sender: "0xDc7543F7878bfa3C41a15Df7dd875B24Ce0D1AEE",
      referrer: "0x2AF142784eD8f0ED17101bb091D58519560825e9",
    };

    const body1 = {
      newRate: [40, 35, 25],
    };

    const body2 = {
      newValue: 7000000,
    };

    const body3 = {
      bonus: 100,
    };

    const body4 = {
      bonus: 700,
    };

    it("it should respond with 201 success for /referral/createReferralCode", async () => {
      expect(
        await referral.checkForUsernameInProgram(body.username)
      ).to.be.equal(false);

      await request(app)
        .post("/referral/createReferralCode")
        .send(body)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201);

      expect(
        await referral.checkForUsernameInProgram(body.username)
      ).to.be.equal(true);
    });

    it("it should respond with 201 success for /referral/addReferral", async () => {
      expect(await referral.isUser(body0.sender)).to.be.equal(false);
      expect(await referral.hasReferrer(body0.sender)).to.be.equal(false);

      await request(app)
        .post("/referral/addReferral")
        .send(body0)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201);

      expect(await referral.isUser(body0.sender)).to.be.equal(true);
      expect(await referral.hasReferrer(body0.sender)).to.be.equal(true);
    });

    it("it should respond with 201 success for /referral/setLevelRate", async () => {
      expect((await referral.getProgramData()).levelRate.length).to.be.equal(4);

      await request(app)
        .post("/referral/setLevelRate")
        .send(body1)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201);

      expect((await referral.getProgramData()).levelRate.length).to.be.equal(3);
    });

    it("it should respond with 201 success for /referral/setDiscountDays", async () => {
      expect((await referral.getProgramData()).discountDays).to.be.equal(
        2592000
      );
      await request(app)
        .post("/referral/setDiscountDays")
        .send(body2)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201);

      expect((await referral.getProgramData()).discountDays).to.be.equal(
        body2.newValue
      );
    });

    it("it should respond with 201 success for /referral/setDiscountBonus", async () => {
      expect((await referral.getProgramData()).discountBonus).to.be.equal(200);

      await request(app)
        .post("/referral/setDiscountBonus")
        .send(body3)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201);

      expect((await referral.getProgramData()).discountBonus).to.be.equal(
        body3.bonus
      );
    });

    it("it should respond with 201 success for /referral/setReferralBonus", async () => {
      expect((await referral.getProgramData()).referralBonus).to.be.equal(800);

      await request(app)
        .post("/referral/setReferralBonus")
        .send(body4)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201);

      expect((await referral.getProgramData()).referralBonus).to.be.equal(
        body4.bonus
      );
    });
  });
});
