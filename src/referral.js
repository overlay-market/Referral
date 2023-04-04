class Referral {
  /**
   * @dev Max referral level depth
   */
  const = (MAX_REFER_DEPTH = 3);

  /**
   * @dev Max referee amount to bonus rate depth
   */
  const = (MAX_REFEREE_BONUS_LEVEL = 3);

  /**
   * @dev The struct of account information
   * @param referrer The referrer addresss
   * @param reward The total referral reward of an address
   * @param referredCount The total referral amount of an address
   * @param lastActiveTimestamp The last active timestamp of an address
   */
  Account = class {
    constructor() {
      this.referrer = null;
      this.reward = 0;
      this.referredCount = 0;
      this.lastActiveTimestamp = 0;
    }
  };

  /**
   * @dev The struct of referee amount to bonus rate
   * @param lowerBound The minial referee amount
   * @param rate The bonus rate for each referee amount
   */
  RefereeBonusRate = class {
    constructor(lowerBound, rate) {
      this.lowerBound = lowerBound;
      this.rate = rate;
    }
  };

  constructor(
    decimals,
    referralBonus,
    secondsUntilInactive,
    onlyRewardActiveReferrers,
    levelRate,
    refereeBonusRateMap
  ) {
    // super();
    // require(levelRate.length > 0, "Referral level should be at least one");
    // require(levelRate.length <=
    //   Referral.MAX_REFER_DEPTH, "Exceeded max referral level depth");
    // require(refereeBonusRateMap.length % 2 ===
    //   0, "Referee Bonus Rate Map should be pass as [<lower amount>, <rate>, ....]");
    // require(refereeBonusRateMap.length / 2 <=
    //   Referral.MAX_REFEREE_BONUS_LEVEL, "Exceeded max referree bonus level depth");
    // require(referralBonus <= decimals, "Referral bonus exceeds 100%");
    // require(this.sum(levelRate) <= decimals, "Total level rate exceeds 100%");

    this.decimals = decimals;
    this.referralBonus = referralBonus;
    this.secondsUntilInactive = secondsUntilInactive;
    this.onlyRewardActiveReferrers = onlyRewardActiveReferrers;
    this.levelRate = levelRate;

    this.refereeBonusRateMap =
      refereeBonusRateMap.length === 0
        ? [new Referral.RefereeBonusRate(1, decimals)]
        : refereeBonusRateMap.reduce((acc, cur, i) => {
            if (i % 2 === 0) {
              if (cur > decimals) {
                throw new Error("One of referee bonus rate exceeds 100%");
              }
              const obj = new Referral.RefereeBonusRate(
                cur,
                refereeBonusRateMap[i + 1]
              );
              return [...acc, obj];
            } else {
              return acc;
            }
          }, []);
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
      //   emit RegisteredRefererFailed(referee, referrer, "Referrer cannot be zero address");
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
    let rate = this.refereeBonusRateMap[0].rate;

    for (let i = 1; i < this.refereeBonusRateMap.length; i++) {
      if (amount < this.refereeBonusRateMap[i].lowerBound) {
        break;
      }

      rate = this.refereeBonusRateMap[i].rate;
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

      parent = this.accounts[parent].referrer;
    }

    return false;
  }

  /**
   * @dev Add an address as referrer
   * @param referrer The address would set as referrer of sender
   * @return whether success to add upline
   */
  addReferrer(referrer, sender) {
    if (this.isCircularReference(referrer, sender)) {
      return false;
    } else if (!this.accounts[sender].referrer) {
      return false;
    }

    let userAccount = this.accounts[sender];
    let parentAccount = this.accounts[referrer];

    userAccount.referrer = referrer;
    userAccount.lastActiveTimestamp = this.getTime();
    parentAccount.referredCount++;
    return true;
  }

  /**
   * @dev This will calc and pay referral to uplines instantly
   * @param value The number tokens will be calculated in referral process
   * @return the total referral bonus paid
   */
  updateReferral(value, sender) {
    let userAccount = this.accounts[sender];
    let totalReferal = 0;

    for (let i = 0; i < this.levelRate.length; i++) {
      let parent = userAccount.referrer;
      let parentAccount = this.accounts[userAccount.referrer];

      if (!parent) {
        break;
      }

      if (
        (this.onlyRewardActiveReferrers &&
          parentAccount.lastActiveTimestamp + this.secondsUntilInactive >=
            this.getTime()) ||
        !this.onlyRewardActiveReferrers
      ) {
        let c = (value * this.referralBonus) / this.decimals;
        c = (c * this.levelRate[i]) / this.decimals;
        c =
          (c * this.getRefereeBonusRate(parentAccount.referredCount)) /
          this.decimals;

        totalReferal += c;

        parentAccount.reward += c;
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
