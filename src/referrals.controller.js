const referralClass = require("./referral.js");

const referral = new referralClass(
  (decimals = 1000),
  (referralBonus = 800),
  (levelRate = [400, 300, 200, 100]),
  (maxReferDepth = 4),
  (discountDays = 2592000),
  (discountBonus = 200)
);

async function httpCreateReferralCode(req, res) {
  let referralDetails = req.body;

  try {
    const result = await referral.createReferralCode(referralDetails);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

async function httpAddReferral(req, res) {
  let referralDetails = req.body;

  try {
    res.status(201).json(await referral.addReferrer(referralDetails));
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

async function httpSetLevelRate(req, res) {
  let levelRate = req.body;

  try {
    await referral.setLevelRate(levelRate);
    res.status(201).json("New Level Rate Set");
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

async function httpSetDiscountDays(req, res) {
  let discountDays = req.body;

  try {
    await referral.setDiscountDays(discountDays);
    res.status(201).json("New Discount Days  Set");
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

async function httpSetReferralBonus(req, res) {
  let bonus = req.body;

  try {
    await referral.setReferralBonus(bonus);
    res.status(201).json("New Referral Bonus Set");
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

async function httpSetDiscountBonus(req, res) {
  let bonus = req.body;

  try {
    await referral.setDiscountBonus(bonus);
    res.status(201).json("New Discount Bonus Set");
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

async function httpCheckForUsernameInProgram(req, res) {
  let userName = req.params.userName;
  return res
    .status(200)
    .json(await referral.checkForUsernameInProgram(userName));
}

async function httpGetUserAddressViaLink(req, res) {
  let link = req.params.link;
  res.status(200).json(await referral.getUserAddressViaLink(link));
}

async function httpHasReferrer(req, res) {
  const address = req.params.address;
  return res.status(200).json(await referral.hasReferrer(address));
}

async function httpGetUserInfo(req, res) {
  let userDetails = req.params.user;
  return res.status(200).json(await referral.getUserInfo(userDetails));
}

async function httpGetProgramData(req, res) {
  return res.status(200).json(await referral.getProgramData());
}

async function httpDeleteReferralLink(req, res) {
  const userName = req.params.userName;

  try {
    await referral.deleteUserReferralLink(userName);
    res.status(200).json("Link Deleted");
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

module.exports = {
  httpCheckForUsernameInProgram,
  httpGetUserAddressViaLink,
  httpDeleteReferralLink,
  httpCreateReferralCode,
  httpSetReferralBonus,
  httpSetDiscountBonus,
  httpSetDiscountDays,
  httpGetProgramData,
  httpSetLevelRate,
  httpGetUserInfo,
  httpAddReferral,
  httpHasReferrer,
};
