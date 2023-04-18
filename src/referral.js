const account = require("../schemas/account.schema");
const referralBonusRate = require("../schemas/referralBonusRate.schema");

module.exports = class Referral {
  constructor(
    decimals,
    referralBonus,
    levelRate,
    maxReferDepth,
    discountDays,
    discountBonus
  ) {
    if ((levelRate.length <= 0, "Referral level should be at least one"));
    if (levelRate.length > maxReferDepth)
      return "Exceeded max referral level depth";

    if (referralBonus > decimals) return "Referral bonus exceeds 100%";
    if (this.sum(levelRate) > decimals) return "Total level rate exceeds 100%";

    // check if RBR collection already has 'RBR' data
    referralBonusRate.findOne({ RBR: "RBR" }).then(async (value) => {
      this.bonusRate = value;

      if (this.bonusRate == null) {
        //If RBR hasn't been created, it creates one
        await referralBonusRate.create({
          RBR: "RBR",
          decimal: decimals,
          levelRate: levelRate,
          discountDays: discountDays,
          referralBonus: referralBonus,
          discountBonus: discountBonus,
          totalRewardsAvailableForClaim: 0,
        });
      }
    });
  }

  /**
   * @dev Adds up the entire values in data
   */
  sum(data) {
    let S;
    for (let i = 0; i < data.length; i++) {
      S += data[i];
    }
    return S;
  }

  /**
   * @dev check whether an address has the referrer
   */
  async hasReferrer(addr) {
    const userAccount = await account.findOne({ user: addr });
    if (userAccount != null) {
      return userAccount.referrer != "";
    } else {
      return false;
    }
  }

  /**
   * @dev check whether an address is part of the program
   */
  async isUser(addr) {
    const userAccount = await account.findOne({ user: addr });
    return userAccount != null;
  }

  /**
   * @dev check if referee is one of referrer uplines
   */
  async isCircularReference(referrer, referee) {
    let parent = referrer;
    let parentAccount = await account.findOne({ user: parent });

    for (let i = 0; i < this.bonusRate.levelRate.length; i++) {
      if (parent == referee) return true;

      if (parentAccount != null) {
        if (parentAccount.referrer == referee) return true;
        if (parentAccount.referrer == "") break;
      } else {
        break;
      }

      parent = await account.findOne({ user: parent }).referrer;
    }

    return false;
  }

  async createReferralCode(string) {
    // return the hash of string as part of user referral code
  }

  /**
   * @dev Add an address as referrer
   */
  async addReferrer(referrer, sender) {
    /*
    Given addReferrer function will be called only when users
    builds a position via someones referral link, the referred 
    account is also created as the senders account.
  */
    let referrerAccount = await account.findOne({ user: referrer });
    let userAccount = await account.findOne({ user: sender });

    if (await this.isCircularReference(referrer, sender)) {
      return { tx: false, reason: "Referee cannot be one of referrer uplines" };
    }

    if (await this.hasReferrer(sender)) {
      return { tx: false, reason: "already has a referral" };
    }

    if (referrerAccount == null) {
      referrerAccount = await account.create({
        user: referrer,
        referrer: "",
        reward: 0,
        date: 0,
        uplines: [],
        discount: 0,
        referredCount: 0,
      });
    }

    if (userAccount == null) {
      await account.create({
        user: sender,
        referrer: referrer,
        reward: 0,
        date: this.getDateInSeconds(),
        uplines: [],
        discount: 0,
        referredCount: 0,
      });
    } else if (userAccount.referrer == "") {
      userAccount.referrer = referrer;
      await userAccount.save();
    }

    referrerAccount.referredCount = referrerAccount.referredCount + 1;
    await referrerAccount.save();

    return { tx: true, reason: "" };
  }

  /**
   * @dev This will calc and update rewards to uplines instantly
   */
  async updateReferral(value, sender) {
    let userAccount = await account.findOne({ user: sender });
    let user = await account.findOne({ user: sender });

    let bonus = this.bonusRate;
    let uplines = [];

    for (let i = 0; i < bonus.levelRate.length; i++) {
      let parent = userAccount.referrer;
      let parentAccount = await account.findOne({ user: userAccount.referrer });

      if (parent == "") {
        break;
      }

      uplines.push(parent);

      // calculates the portion of fees an upline gets
      let c = (value * bonus.referralBonus) / bonus.decimal;
      c = (c * bonus.levelRate[i]) / bonus.decimal;

      parentAccount.reward += c;
      bonus.totalRewardsAvailableForClaim += c;

      await bonus.save();
      await parentAccount.save();

      userAccount = parentAccount;
    }

    if (user.date + bonus.discountDays > this.getDateInSeconds()) {
      let discount = (value * bonus.discountBonus) / bonus.decimal;
      user.discount = user.discount + discount;
      await user.save();
    }

    await this.updateUpline(uplines, user);
  }

  /**
   * @dev Updates users uplines
   */
  async updateUpline(uplines, userAccount) {
    if (uplines.length > this.bonusRate.levelRate.length) return;
    if (uplines.length > userAccount.uplines.length) {
      userAccount.uplines = uplines;
      await userAccount.save();
    }
  }

  /**
   * @dev gets users uplines
   */
  async getUplines(sender) {
    let userAccount = await account.findOne({ user: sender });
    return userAccount.uplines;
  }

  /**
   * @dev gets users rewards
   */
  async getUserReferralReward(users) {
    let userAccount = await account.findOne({ user: users });
    return userAccount.reward;
  }

  /**
   * @dev gets users referral count
   */
  async getUserReferralCount(users) {
    let userAccount = await account.findOne({ user: users });
    return userAccount.referredCount;
  }

  /**
   * @dev gets users referral count
   */
  async getUserDiscount(users) {
    let userAccount = await account.findOne({ user: users });
    return userAccount.discount;
  }

  /**
   * @dev gets total rewards available for claiming
   */
  async getTotalRewardsAvailableForClaim() {
    return this.bonusRate.totalRewardsAvailableForClaim;
  }

  getDateInSeconds() {
    return Math.floor(Date.now() / 1000);
  }
};
