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
          users: [],
          lastUpdate: {
            build: 0,
            unwind: 0
          }
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
    const userAccount = await account.findOne({ user: addr.toLowerCase() });
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
    const userAccount = await account.findOne({ user: addr.toLowerCase() });
    return userAccount != null;
  }

  async createReferralCode(referralDetails) {
    // gets account DB of user that wants an account created
    let senderAccount = await account.findOne({
      user: referralDetails.sender.toLowerCase(),
    });

    if (await this.checkForUsernameInProgram(referralDetails.username.toLowerCase()))
      throw new Error("username already exist");

    if (
      senderAccount != null &&
      senderAccount.referralLinks !== undefined &&
      Object.keys(senderAccount.referralLinks).length !== 0
    ) {
      throw new Error("Can't create more than one referral link");
    }

    const userNewReferralLink = `https://app.overlay.market/#/markets?ref=${referralDetails.username.toLowerCase()}`;
    const data = await referralProgramData.findOne({ RPD: "RPD" });

    data.users.set(referralDetails.username.toLowerCase(), {referralLink: userNewReferralLink, address: referralDetails.sender.toLowerCase()})
    await this.save(data);

    // check if account is already created
    if (senderAccount == null) {
      let userNewReferral = {};
      userNewReferral[referralDetails.username.toLowerCase()] = userNewReferralLink;

      await this.createAccount(
        referralDetails.sender.toLowerCase(),
        "",
        this.getDateInSeconds(),
        userNewReferral
      );
    } else {
      console.log("creating object")
      // if not create one
      let obj = await this.getObject(
        {},
        referralDetails.username.toLowerCase(),
        userNewReferralLink
      );
      console.log({obj})
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
      user: referralDetails.referrer.toLowerCase(),
    });

    let userAccount = await account.findOne({ user: referralDetails.sender.toLowerCase() });

    if (await this.hasReferrer(referralDetails.sender.toLowerCase())) {
      throw new Error("Already has a referral");
    }

    if (referrerAccount == null) {
      throw new Error("Referrer account doesn't exist");
    }

    // checks if user adding a referral has a created account or not
    if (userAccount == null) {
      await this.createAccount(
        referralDetails.sender.toLowerCase(),
        referralDetails.referrer.toLowerCase(),
        this.getDateInSeconds()
      );
    }

    referrerAccount.referredCount = referrerAccount.referredCount + 1;
    await this.save(referrerAccount);

    return "referral successfully added";
  }

  /**
   * @dev This will calc and update rewards to uplines instantly
   * @param {Number} value - The total fee payed by the user
   * @param {String} sender - The sender of the transaction
   * @param {Number} txTimestamp - The timestamp of the transaction
   */
  async updateReferral(value, sender, txTimestamp) {
    // Find the user's account and referral program data
    let userAccount = await account.findOne({ user: sender.toLowerCase() });
    let data = this.programData;

    // If the user account doesn't exist or the account creation date  is after the transaction timestamp, return 0
    if (!userAccount || userAccount.date > txTimestamp ) {
      return 0
    }

    // Loop through each levelRate to calculate and distribute rewards to uplines
    for (let i = 0; i < data.levelRate.length; i++) {
      // gets the next upline of user that built a position and pays them i.e;
      // userThatBuiltPosition ---> referrer --- 1stDirectUpline
      // userThatBuiltPosition ---> 1stDirectUpline.referrer --- 2ndDirectUpline
      // userThatBuiltPosition ---> 2ndDirectUpline.referrer --- 3rdDirectUpline......pays to the depth set by levelRate
      let parent = userAccount.referrer;
      let parentAccount = await account.findOne({ user: userAccount.referrer });

      // If there is no parent (referrer), break the loop
      if (parent == "") {
        break;
      }

      // calculates the portion of fees an upline gets
      let c = (value * data.referralBonus) / data.decimal;
      c = (c * data.levelRate[i]) / data.decimal;

      // update parentAccount with the reward
      parentAccount.reward += c;
      // update totalRewards with the reward
      data.totalRewardsAvailableForClaim += c;

      await this.save(parentAccount);

      // update userAccount as parentAccount to get next upline parent in the loop
      userAccount = parentAccount;
    }

    let user = await account.findOne({ user: sender.toLowerCase() });
    // gets discount as a new user for the duration of discountDays
    if (user.date + data.discountDays > txTimestamp) {
      // calculates the portion of fees to discount
      let discount = (value * data.discountBonus) / data.decimal;

      // update user with the discount
      user.discount += discount;
      // update totalRewards with the discount
      data.totalRewardsAvailableForClaim += discount
      await this.save(user);
    }
    await this.save(data);
  }

  /**
   * @dev gets users uplines by depth of levelRate
   */
  async getUserUplines(sender) {
    let uplines = [];
    let userAccount = await account.findOne({ user: sender.toLowerCase() });

    if (!this.hasReferrer(sender.toLowerCase()) || userAccount.referrer == "") return [];

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
    const data = await referralProgramData.findOne({ RPD: "RPD" });
    let result = data.users.get(`${userName.toLowerCase()}`);
    return result != undefined;
  }

  /**
   * @dev Used to delete a user referral link
   */
  async deleteUserReferralLink(userName) {
    const data = await referralProgramData.findOne({ RPD: "RPD" });
    const result = data.users.get(`${userName.toLowerCase()}`);

    if (!result) throw new Error("user does not exist");
    let userAccount = await account.findOne({ user: result.address });

    let newObj1 = { ...userAccount.referralLinks };

    delete newObj1[`${userName.toLowerCase()}`];

    data.users.delete(`${userName.toLowerCase()}`)
    userAccount.referralLinks = newObj1;

    await this.save(data);
    await this.save(userAccount);
  }

  /**
   * @dev Used to check if user has the passed link
   */
  async getUserAddressViaLink(userName) {
    const data = await referralProgramData.findOne({ RPD: "RPD" });
    let result = data.users.get(`${userName.toLowerCase()}`);

    if (result) return result.address;
    else {
      throw new Error("user does not exist");
    }
  }

  /**
   * @dev Used to set new level rate
   */
  async setLevelRate(levelRate) {
    const data = await referralProgramData.findOne({ RPD: "RPD" });
    data.levelRate = levelRate.newRate;
    await this.save(data);
  }

  /**
   * @dev Used to set new discount days
   */
  async setDiscountDays(discountDays) {
    const data = await referralProgramData.findOne({ RPD: "RPD" });
    data.discountDays = discountDays.newValue;
    await this.save(data);
  }

  /**
   * @dev Used to set new referral bonus value
   */
  async setReferralBonus(newValue) {
    const data = await referralProgramData.findOne({ RPD: "RPD" });
    data.referralBonus = newValue.bonus;
    await this.save(data);
  }

  /**
   * @dev Used to set new discount bonus value
   */
  async setDiscountBonus(newValue) {
    const data = await referralProgramData.findOne({ RPD: "RPD" });
    data.discountBonus = newValue.bonus;
    await this.save(data);
  }

  /**
   * @dev Used to set new build lastUpdate
   */
  async setBuildLastUpdate(newValue) {
    const data = await referralProgramData.findOne({ RPD: "RPD" });
    data.lastUpdate.build = newValue;
    await this.save(data);
  }

  /**
   * @dev Used to set new unwind lastUpdate
   */
  async setUnwindLastUpdate(newValue) {
    const data = await referralProgramData.findOne({ RPD: "RPD" });
    data.lastUpdate.unwind = newValue;
    await this.save(data);
  }

  /**
   * @dev gets referral bonus
   */
  async getProgramData() {
    const data = await referralProgramData.findOne({ RPD: "RPD" });
    return data;
  }

  /**
   * @dev gets users referral count
   */
  async getUserInfo(user) {
    let userAccount = await account.findOne({ user: user.toLowerCase() });
    return userAccount;
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
  async createAccount(sender, referrer, date, referralLink = {}) {
    try {
      await account.create({
        user: sender,
        referrer: referrer,
        reward: 0,
        date: date,
        discount: 0,
        referredCount: 0,
        referralLinks: { $set: referralLink },
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
