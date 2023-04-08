const account = require("../account.schema");
const referralBonusRate = require("../referralBonusRate.schema");

module.exports = class Referral {
  constructor(
    decimals,
    referralBonus,
    secondsUntilInactive,
    onlyRewardActiveReferrers,
    levelRate,
    refereeBonusRateMap,
    MAX_REFER_DEPTH,
    MAX_REFEREE_BONUS_LEVEL
  ) {
    if ((levelRate.length <= 0, "Referral level should be at least one"));
    if (levelRate.length > MAX_REFER_DEPTH)
      return "Exceeded max referral level depth";
    if (refereeBonusRateMap.length % 2 != 0)
      return "Referee Bonus Rate Map should be pass as [<lower amount>, <rate>, ....]";
    if (refereeBonusRateMap.length / 2 > MAX_REFEREE_BONUS_LEVEL)
      return "Exceeded max referree bonus level depth";
    if (referralBonus > decimals) return "Referral bonus exceeds 100%";
    if (this.sum(levelRate) > decimals) return "Total level rate exceeds 100%";

    referralBonusRate.findOne({ RBR: "RBR" }).then(async (value) => {
      this.bonusRate = value;

      if (this.bonusRate == null) {
        await referralBonusRate.create({
          RBR: "RBR",
          rate: [],
          decimal: decimals,
          levelRate: levelRate,
          lowerBound: [],
          referralBonus: referralBonus,
          secondsUntilInactive: secondsUntilInactive,
          onlyRewardActiveReferrers: onlyRewardActiveReferrers,
        });

        this.bonusRate = await referralBonusRate.findOne({ RBR: "RBR" });

        if (refereeBonusRateMap.length == 0) {
          this.bonusRate.rate = [decimals];
          this.bonusRate.lowerBound = [1];
          return;
        }

        this.rate = [];
        this.lowerBound = [];

        for (let i = 0; i < refereeBonusRateMap.length; i += 2) {
          if (refereeBonusRateMap[i + 1] > decimals) {
            revert("One of referee bonus rate exceeds 100%");
          }
          this.lowerBound.push(refereeBonusRateMap[i]);
          this.rate.push(refereeBonusRateMap[i + 1]);
        }
        this.bonusRate.lowerBound = this.lowerBound;
        this.bonusRate.rate = this.rate;

        this.bonusRate.save();
      }
    });
  }

  sum(data) {
    return data.reduce((acc, cur) => acc + cur, 0);
  }

  /**
   * @dev Utils function for check whether an address has the referrer
   */
  async hasReferrer(addr) {
    const userAccount = await account.findOne({ user: addr });
    if (userAccount != null) {
      return userAccount.referrer != undefined;
    }
  }

  async isReferral(addr) {
    const userAccount = await account.findOne({ user: addr });
    return userAccount != null;
  }

  /**
   * @dev Get block timestamp with function for testing mock
   */
  getTime() {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * @dev Given a user amount to calc in which rate period
   * @param number The number of referrees
   */
  async getRefereeBonusRate(number) {
    let bonusRate = await referralBonusRate.findOne({ RBR: "RBR" });
    let rate = bonusRate.rate[0];

    for (let i = 1; i < bonusRate.lowerBound.length; i++) {
      if (number < bonusRate.lowerBound[i]) {
        break;
      }

      rate = bonusRate.rate[i];
    }
    return rate;
  }

  async isCircularReference(referrer, referee) {
    let parent = referrer;
    let parentAccount = await account.findOne({ user: parent });

    for (let i = 0; i < this.bonusRate.levelRate.length; i++) {
      if (parentAccount != null) {
        if (parentAccount.referrer == referee) return true;
        if (parentAccount.referrer == undefined) break;
      } else {
        break;
      }

      if (parent == referee) return true;

      parent = await account.findOne({ user: parent }).referrer;
    }

    return false;
  }

  async createReferralCode(string) {
    // return the hash of string as part of user referral code
  }

  /**
   * @dev Add an address as referrer
   * @param referrer The address would set as referrer of sender
   */
  async addReferrer(referrer, sender) {
    let referrerAccount = await account.findOne({ user: referrer });

    if (referrerAccount == null) {
      referrerAccount = account.create({
        user: referrer,
        referrer: "",
        reward: 0,
        referredCount: 0,
        lastActiveTimestamp: this.getTime(),
      });
    }

    if (await this.isCircularReference(referrer, sender)) {
      console.log("Referee cannot be one of referrer uplines");
      return "Referee cannot be one of referrer uplines";
    }

    if (await this.hasReferrer(sender)) {
      console.log("already have a referral");
      return "already have a referral";
    }

    account.create({
      user: sender,
      referrer: referrer,
      reward: 0,
      referredCount: 0,
      lastActiveTimestamp: this.getTime(),
    });

    referrerAccount.referredCount = referrerAccount.referredCount + 1;

    await referrerAccount.save();
    console.log("added");
  }

  /**
   * @dev This will calc and pay referral to uplines instantly
   * @param value The number tokens will be calculated in referral process
   * @return the total referral bonus paid
   */
  async updateReferral(value, sender) {
    let userAccount = await account.findOne({ user: sender });
    let bonus = this.bonusRate;
    // console.log(bonus, "l");

    for (let i = 0; i < bonus.levelRate.length; i++) {
      let parent = userAccount.referrer;
      let parentAccount = await account.findOne({ user: userAccount.referrer });

      if (parent == "") {
        break;
      }

      if (
        (bonus.onlyRewardActiveReferrers &&
          parentAccount.lastActiveTimestamp + bonus.secondsUntilInactive >=
            this.getTime()) ||
        !bonus.onlyRewardActiveReferrers
      ) {
        let c = (value * bonus.referralBonus) / bonus.decimal;

        c = (c * bonus.levelRate[i]) / bonus.decimal;

        c =
          (c * (await this.getRefereeBonusRate(parentAccount.referredCount))) /
          bonus.decimal;

        parentAccount.reward += c;
        await parentAccount.save();
      }

      userAccount = parentAccount;
    }

    this.updateActiveTimestamp(sender);
  }

  async updateActiveTimestamp(sender) {
    let userAccount = await account.findOne({ user: sender });
    userAccount.lastActiveTimestamp = this.getTime();
    await userAccount.save();
  }

  async setSecondsUntilInactive(secondsUntilInactive) {
    this.bonusRate.secondsUntilInactive = secondsUntilInactive;
    await this.bonusRate.save();
  }

  async setOnlyRewardActiveReferrers(onlyRewardActiveReferrers) {
    this.bonusRate.onlyRewardActiveReferrers = onlyRewardActiveReferrers;
    await this.bonusRate.save();
  }

  // Internal helper function
  getTime() {
    return Math.floor(Date.now() / 1000);
  }
};
