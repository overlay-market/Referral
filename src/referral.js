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
    if (levelRate.length <= 0)
      throw new Error("Referral level should be at least one");
    if (levelRate.length > maxReferDepth)
      throw new Error("Exceeded max referral level depth");

    if (referralBonus > decimals)
      throw new Error("Referral bonus exceeds 100%");
    if (this.sum(levelRate) > decimals)
      throw new Error("Total level rate exceeds 100%");

    // check if RPD collection already has 'RPD' data
    referralProgramData.findOne({ RPD: "RPD" }).then(async (value) => {
      this.programData = value;

      if (this.programData == null) {
        //If RPD hasn't been created, it creates one
        this.programData = await referralProgramData.create({
          RPD: "RPD",
          decimal: decimals,
          levelRate: levelRate,
          discountDays: discountDays,
          referralBonus: referralBonus,
          discountBonus: discountBonus,
          totalRewardsAvailableForClaim: 0,
          users: { users: ["users referral links", "users addresses"] },
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
      return true;
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

  async createReferralCode(referralDetails) {
    const userNewReferralLink = `https://overlay.market/${referralDetails.username}`; // Hash of referralDetails.username as part of user referral code

    // add referralDetails.username to DB for all users
    const obj = await this.getObject(
      this.programData.users,
      referralDetails.username,
      [userNewReferralLink, referralDetails.sender]
    );

    this.programData.users = obj;
    await this.save(this.programData);

    // gets account DB of user that wants an account created
    let senderAccount = await account.findOne({
      user: referralDetails.sender,
    });

    // check if account is already created
    if (senderAccount == null) {
      let userNewReferral = {};
      userNewReferral[referralDetails.username] = userNewReferralLink;

      await this.create(referralDetails.sender, "", 0, userNewReferral);
    } else if (
      senderAccount != null &&
      senderAccount.referralLinks["none"] != undefined
    ) {
      // Todo
      // check if user wants to create same link again
      // if not create one
      let obj = await this.getObject(
        {},
        referralDetails.username,
        userNewReferralLink
      );

      senderAccount.referralLinks = obj;
      await this.save(senderAccount);
    } else {
      // If account has been created and user has one referral link means user wants to create multiple referral links
      let obj = await this.getObject(
        senderAccount.referralLinks,
        referralDetails.username,
        userNewReferralLink
      );

      senderAccount.referralLinks = obj;
      await this.save(senderAccount);
    }

    return userNewReferralLink;
  }

  /**
   * @dev Add an address as referrer
   */
  async addReferrer(referralDetails) {
    let referrerAccount = await account.findOne({
      user: referralDetails.referrer,
    });
    let userAccount = await account.findOne({ user: referralDetails.sender });

    if (await this.hasReferrer(referralDetails.sender)) {
      throw new Error("Already has a referral");
    }

    if (referrerAccount == null) {
      throw new Error("Referrer account doesn't exist");
    }

    // checks if user adding a referral has a created account or not
    if (userAccount == null) {
      await this.create(
        referralDetails.sender,
        referralDetails.referrer,
        this.getDateInSeconds(),
        { none: "none" }
      );
    }

    referrerAccount.referredCount = referrerAccount.referredCount + 1;
    await this.save(referrerAccount);

    return true;
  }

  /**
   * @dev This will calc and update rewards to uplines instantly
   */
  async updateReferral(value, sender) {
    let userAccount = await account.findOne({ user: sender });
    let user = await account.findOne({ user: sender });
    let data = this.programData;

    for (let i = 0; i < data.levelRate.length; i++) {
      // gets the next upline of user that built a position and pays them i.e;
      // userThatBuiltPosition ---> referrer --- 1stDirectUpline
      // userThatBuiltPosition ---> 1stDirectUpline.referrer --- 2ndDirectUpline
      // userThatBuiltPosition ---> 2ndDirectUpline.referrer --- 3rdDirectUpline......pays to the depth set by levelRate
      let parent = userAccount.referrer;
      let parentAccount = await account.findOne({ user: userAccount.referrer });

      if (parent == "") {
        break;
      }

      // calculates the portion of fees an upline gets
      let c = (value * data.referralBonus) / data.decimal;
      c = (c * data.levelRate[i]) / data.decimal;

      parentAccount.reward += c;
      data.totalRewardsAvailableForClaim += c;

      await this.save(data);
      await this.save(parentAccount);

      userAccount = parentAccount;
    }

    // gets discount as a new user for the duration of discountDays
    if (user.date + data.discountDays > this.getDateInSeconds()) {
      let discount = (value * data.discountBonus) / data.decimal;
      user.discount = user.discount + discount;
      await this.save(user);
    }
  }

  /**
   * @dev gets users uplines by depth of levelRate
   */
  async getUserUplines(sender) {
    let uplines = [];
    let userAccount = await account.findOne({ user: sender });

    if (!this.hasReferrer(sender) || userAccount.referrer == "") return [];

    for (let i = 0; i < this.programData.levelRate.length; i++) {
      let parent = userAccount.referrer;
      let parentAccount = await account.findOne({ user: userAccount.referrer });

      if (parent == "") {
        break;
      }

      uplines.push(parent);
      userAccount = parentAccount;
    }

    return uplines;
  }

  /**
   * @dev Used to check if user name already exist or not
   * in the referral program
   */
  async checkForUsernameInProgram(userName) {
    let result = await this.programData.users[`${userName}`];
    return result != undefined;
  }

  /**
   * @dev Used to check if user has the passed link
   */
  async getUserAddressViaLink(userLink) {
    let result = await this.programData.users[`${userLink}`];
    return result[1];
  }

  /**
   * @dev Used to set new level rate
   */
  async setLevelRate(levelRate) {
    this.programData.levelRate = levelRate.newRate;
    await this.save(this.programData);
  }

  /**
   * @dev Used to set new discount days
   */
  async setDiscountDays(discountDays) {
    this.programData.discountDays = discountDays.newValue;
    await this.save(this.programData);
  }

  /**
   * @dev Used to set new referral bonus value
   */
  async setReferralBonus(newValue) {
    this.programData.referralBonus = newValue;
    await this.save(this.programData);
  }

  /**
   * @dev gets referral bonus
   */
  async getReferralBonus() {
    return this.programData.referralBonus;
  }

  /**
   * @dev gets referral bonus
   */
  async getLevelRate() {
    return this.programData.levelRate;
  }

  /**
   * @dev gets discount days
   */
  async getDiscountDays() {
    return this.programData.discountDays;
  }

  /**
   * @dev Used to set new discount bonus value
   */
  async setDiscountBonus(newValue) {
    this.programData.discountBonus = newValue;
    await this.save(this.programData);
  }

  /**
   * @dev gets users referral count
   */
  async getUserInfo(user) {
    let userAccount = await account.findOne({ user: user });
    return userAccount;
  }

  /**
   * @dev gets total rewards available for claiming
   */
  async getTotalRewardsAvailableForClaim() {
    return this.programData.totalRewardsAvailableForClaim;
  }

  /**
   * @dev Creates new object
   */
  async getObject(obj, key, value) {
    let newObj = { ...obj };
    newObj[key] = value;

    return newObj;
  }

  /**
   * @dev Creates new DB for account collection.
   */
  async create(sender, referrer, date, referralLink) {
    try {
      await account.create({
        user: sender,
        referrer: referrer,
        reward: 0,
        date: date,
        discount: 0,
        referredCount: 0,
        referralLinks: referralLink,
      });
    } catch (error) {
      throw new Error(`Error creating account in collection: ` + error.message);
    }
  }

  /**
   * @dev Saves updates made to a collection.
   */
  async save(collection) {
    try {
      await collection.save();
    } catch (error) {
      throw new Error(
        `Error saving ${collection} collection: ` + error.message
      );
    }
  }

  getDateInSeconds() {
    return Math.floor(Date.now() / 1000);
  }
};
