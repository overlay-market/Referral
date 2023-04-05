const account = require("../account.schema");
const referralBonusRate = require("../referralBonusRate.schema");

class Referral {
  /**
   * @dev Max referral level depth
   */
  const = MAX_REFER_DEPTH = 3;

  /**
   * @dev Max referee amount to bonus rate depth
   */
  const = MAX_REFEREE_BONUS_LEVEL = 3;

  constructor(
    decimals,
    referralBonus,
    secondsUntilInactive,
    onlyRewardActiveReferrers,
    levelRate,
    refereeBonusRateMap
  ) {
    if(levelRate.length <= 0, "Referral level should be at least one");
    if(levelRate.length > MAX_REFER_DEPTH, "Exceeded max referral level depth");
    if(refereeBonusRateMap.length % 2 !=
      0, "Referee Bonus Rate Map should be pass as [<lower amount>, <rate>, ....]");
    if(refereeBonusRateMap.length / 2 > MAX_REFEREE_BONUS_LEVEL, "Exceeded max referree bonus level depth");
    if(referralBonus > decimals, "Referral bonus exceeds 100%");
    if(this.sum(levelRate) > decimals, "Total level rate exceeds 100%");

    this.bonusRate = referralBonusRate.create({
      RBR: 'RBR',
      rate: [],
      decimal: decimals,
      levelRate: levelRate,
      lowerBound: [],
      referralBonus: referralBonus,
      secondsUntilInactive: secondsUntilInactive,
      onlyRewardActiveReferrers: onlyRewardActiveReferrers,
    })

    if (refereeBonusRateMap.length == 0) {
      this.bonusRate.rate.push(1)
      this.bonusRate.lowerBound.push(decimals)
      return
    }

    for (let i = 0; i < refereeBonusRateMap.length; i += 2) {
      if (refereeBonusRateMap[i + 1] > decimals) {
        revert("One of referee bonus rate exceeds 100%");
      }
      this.bonusRate.rate.push(refereeBonusRateMap[i])
      this.bonusRate.lowerBound.push(refereeBonusRateMap[i + 1])
    }
  }
  

  sum(data) {
    return data.reduce((acc, cur) => acc + cur, 0);
  }

  /**
   * @dev Utils function for check whether an address has the referrer
   */
  hasReferrer(addr) {
    return this.accounts[addr].referrer !== null;
  }

  registerReferer(referee, referrer) {
    if (referrer === address(0)) {
        revert("Referrer cannot be zero address");
      return;
    }
    if (referee === referrer) {
    }
  }

  /**
   * @dev Get block timestamp with function for testing mock
   */
  getTime() {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * @dev Given a user amount to calc in which rate period
   * @param amount The number of referrees
   */
  getRefereeBonusRate(amount) {
    let bonusRate = referralBonusRate.findOne({RBR: 'RBR'})
    let rate = bonusRate.rates[0]

    for (let i = 1; i < this.refereeBonusRateMap.length; i++) {
      if (amount < this.refereeBonusRateMap[i].lowerBound) {
        break;
      }

      rate = bonusRate.rates[i];
    }

    return rate;
  }

  isCircularReference(referrer, referee) {
    let parent = referrer;

    for (let i = 0; i < this.levelRate.length; i++) {
      if (!parent) {
        break;
      }

      if (parent === referee) {
        return true;
      }

      parent  = await account.findOne({ user: parent }).referrer;
    }

    return false;
  }

  /**
   * @dev Add an address as referrer
   * @param referrer The address would set as referrer of sender
   */
  async addReferrer(referrer, sender) {
    const userAccount = await account.findOne({ user: sender });

    if (this.isCircularReference(referrer, sender)) {
      return false;
    } else if (userAccount.referrer != null) {
      return false;
    }

    account.create({
      user: sender,
      referrer: referrer,
      reward: 0,
      referredCount: 0,
      lastActiveTimestamp: this.getTime(),
    });

    const referrerAccount = await account.findOne({ user: referrer });
    referrerAccount.referredCount = referrerAccount.referredCount++;

    await referrerAccount.save();
  }

  /**
   * @dev This will calc and pay referral to uplines instantly
   * @param value The number tokens will be calculated in referral process
   * @return the total referral bonus paid
   */
  async updateReferral(value, sender) {
    userAccount = await account.findOne({ user: sender });
    if (userAccount == null) return;

    let userAccount = this.accounts[sender];
    let totalReferal = 0;

    for (let i = 0; i < this.bonusRate.levelRate.length; i++) {
      let parent = userAccount.referrer;
      let parentAccount = await account.findOne({ user: userAccount.referrer });

      if (!parent) {
        break;
      }

      if (
        (this.onlyRewardActiveReferrers &&
          parentAccount.lastActiveTimestamp + this.bonusRate.secondsUntilInactive >=
            this.getTime()) ||
        !this.bonusRate.onlyRewardActiveReferrers
      ) {
        let c = (value * this.bonusRate.referralBonus) / this.bonusRate.decimals;
        c = (c * this.bonusRate.levelRate[i]) / this.bonusRate.decimals;
        c =
          (c * this.getRefereeBonusRate(parentAccount.referredCount)) /
          this.bonusRate.decimals;

        totalReferal += c;

        parentAccount.reward += c
        await parentAccount.save()
      }

      userAccount = parentAccount;
    }

    this.updateActiveTimestamp(sender);
    return totalReferal;
  }

  updateActiveTimestamp(user) {
    const timestamp = this.getTime();
    accounts[user].lastActiveTimestamp = timestamp;
  }

  setSecondsUntilInactive(secondsUntilInactive) {
    this.secondsUntilInactive = secondsUntilInactive;
  }

  setOnlyRewardAActiveReferrers(onlyRewardActiveReferrers) {
    this.onlyRewardActiveReferrers = onlyRewardActiveReferrers;
  }

  // Internal helper function
  getTime() {
    return Math.floor(Date.now() / 1000);
  }
}
