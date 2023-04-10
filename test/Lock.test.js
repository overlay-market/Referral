const { expect } = require("chai");
const { mongoConnect, mongoDisconnect } = require("../src/services/mongo");

const { read1 } = require("../src/helper");
const config = require("../src/config.json");
const referralClass = require("../src/referral");

// const inn = require("../src/index");
const mock = require("./mock");

// async function deployClass(sender, tradingFee) {
//   referral = new referralClass(
//     (decimals = 1000),
//     (referralBonus = 800),
//     (secondsUntilInactive = 365),
//     (onlyRewardActiveReferrers = true),
//     (levelRate = [600, 300, 100]),
//     (refereeBonusRateMap = [1, 500, 5, 750, 15, 1000]),
//     (MAX_REFER_DEPTH = 3),
//     (MAX_REFEREE_BONUS_LEVEL = 3)
//   );
//   console.log("oo");
//   await read1(sender, tradingFee);
// }

describe("Lock", () => {
  beforeEach(async () => {
    await mongoConnect();
    const tradingFee = mock.build(100);
    // await deployClass("sender", 66);
  });

  afterAll(async () => {
    jest.setTimeout(30000);
    jest.useFakeTimers();
    await mongoDisconnect();
  });

  describe("Deployment", function () {
    test("defines setRule()", async () => {
      async function g() {
        const h = new referralClass(
          (decimals = 1000),
          (referralBonus = 800),
          (secondsUntilInactive = 365),
          (onlyRewardActiveReferrers = true),
          (levelRate = [600, 300, 100]),
          (refereeBonusRateMap = [1, 500, 5, 750, 15, 1000]),
          (MAX_REFER_DEPTH = 3),
          (MAX_REFEREE_BONUS_LEVEL = 3)
        );
        return h;
      }
      let h = await g();
    });
  });
});
