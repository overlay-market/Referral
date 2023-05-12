const link = require("../schemas/userLinks.schema");
const account = require("../schemas/account.schema");
const referralProgramData = require("../schemas/referralProgramData.schema");

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
    referralProgramData.findOne({ RBR: "RPD" }).then(async (value) => {
      this.bonusRate = value;

      if (this.bonusRate == null) {
        //If RPD hasn't been created, it creates one
        this.bonusRate = await referralProgramData.create({
          RPD: "RPD",
          decimal: decimals,
          levelRate: levelRate,
          discountDays: discountDays,
          referralBonus: referralBonus,
          discountBonus: discountBonus,
          totalRewardsAvailableForClaim: 0,
          users: { users: "users referral links" },
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

  async createReferralCode(username, sender) {
    let userNewReferralLink = username; // Hash of username as part of user referral code

    // add username to DB for all users
    let ob = await this.getObject(
      this.bonusRate.users,
      username,
      userNewReferralLink
    );

    this.bonusRate.users = ob;
    this.bonusRate.save();

    // gets account DB of user that wants an account created
    let senderAccount = await account.findOne({ user: sender });

    // gets links DB of user that wants an account created
    let senderLinks = await link.findOne({ user: sender });

    let userNewReferral = {};
    userNewReferral[username] = userNewReferralLink;

    // check if accounts are already created
    if (senderAccount == null && senderLinks == null) {
      // if not create them
      senderAccount = await account.create({
        user: sender,
        referrer: "",
        reward: 0,
        date: 0,
        uplines: [],
        discount: 0,
        referredCount: 0,
      });

      await link.create({
        user: sender,
        referralLinks: userNewReferral,
      });
      // check if link DB hasn't been created yet
    } else if (senderAccount != null && senderLinks == null) {
      // if not create one
      await link.create({
        user: sender,
        referralLinks: userNewReferral,
      });
    } else {
      // If both accounts has been create means user wants to create multiple referral links
      let userLinks = await link.findOne({ user: sender });

      let obj = await this.getObject(
        userLinks.referralLinks,
        username,
        userNewReferralLink
      );

      userLinks.referralLinks = obj;
      await userLinks.save();
    }

    return userNewReferralLink;
  }

  /**
   * @dev Add an address as referrer
   */
  async addReferrer(referrer, sender) {
    // gets referrer address from checking the address tied
    // to the referral link.

    let referrerAccount = await account.findOne({ user: referrer });
    let userAccount = await account.findOne({ user: sender });

    if (await this.isCircularReference(referrer, sender)) {
      return { tx: false, reason: "Referee cannot be one of referrer uplines" };
    }

    if (await this.hasReferrer(sender)) {
      return { tx: false, reason: "already has a referral" };
    }

    if (referrerAccount == null) {
      return { reason: "referrer account doesn't exist" };
    }

    // checks if user adding a referral has a created account or not
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
      // if they already do check if the referrer as they might not
      // have one if they only created a referral link and wasn't referred by anyone
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
      // gets the next upline of user that built a position and pays them i.e;
      // userThatBuiltPosition ---> referrer --- 1st direct upline
      // 1st direct upline ---> referrer --- 2nd direct upline
      // 2nd direct upline ---> referrer --- 3rd direct upline......pays to the depth set by levelRate
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

    // gets discount as a new user for the duration of discountDays
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

  /**
   * @dev Creates new object
   */
  async getObject(obj, key, value) {
    let newObj = { ...obj };
    newObj[key] = value;

    return newObj;
  }

  getDateInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * @dev Used to check if user name already exist or not
   * in the referral program
   */
  async checkForUsernameInProgram(username) {
    let result = await this.bonusRate.users[`${username}`];
    return result != undefined;
  }

  /**
   * @dev Used to check if user has the passed link
   */
  async checkForUserReferralLink(sender, link) {
    let userLinks = await link.findOne({ user: sender });
    let result = await userLinks.referralLinks[`${link}`];
    return result != undefined;
  }
};
