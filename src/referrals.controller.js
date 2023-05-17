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
  const result = await referral.createReferralCode(referralDetails);

  if (result) {
    res.status(201).json(referralDetails);
  } else {
    return res.status(400).json({
      error: result,
    });
  }
}

async function httpAddReferral(req, res) {
  let referralDetails = +req.body;

  console.log(referralDetails);
  const result = await referral.addReferrer(referralDetails);

  if (result) {
    res.status(201).json(referralDetails);
  } else {
    return res.status(400).json({
      error: result,
    });
  }
}

async function httpSetLevelRate(req, res) {
  let levelRate = req.body;
  const result = await referral.setLevelRate(levelRate);

  if (result) {
    res.status(201).json(levelRate);
  } else {
    return res.status(400).json({
      error: result,
    });
  }
}

async function httpSetDiscountDays(req, res) {
  let discountDays = req.body;
  const result = await referral.setDiscountDays(discountDays);

  if (result) {
    res.status(201).json(discountDays);
  } else {
    return res.status(400).json({
      error: result,
    });
  }
}

async function httpSetReferralBonus(req, res) {
  let bonus = req.body;
  const result = await referral.setReferralBonus(bonus);

  if (result) {
    res.status(201).json(bonus);
  } else {
    return res.status(400).json({
      error: result,
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
  return res.status(200).json(await referral.getUserAddressViaLink(link));
}

async function httpGetTotalRewardsAvailableForClaim(req, res) {
  return res
    .status(200)
    .json(await referral.getTotalRewardsAvailableForClaim());
}

async function httpGetUserInfo(req, res) {
  let userDetails = req.params.user;
  return res.status(200).json(await referral.getUserInfo(userDetails));
}

async function httpGetDiscountDays(req, res) {
  return res.status(200).json(await referral.getDiscountDays());
}

async function httpGetLevelRate(req, res) {
  return res.status(200).json(await referral.getLevelRate());
}

async function httpGetReferralBonus(req, res) {
  return res.status(200).json(await referral.getReferralBonus());
}

// async function httpGetAllLaunches(req, res) {
//   const { skip, limit } = getPagination(req.query);
//   const launches = await getAllLaunches(skip, limit);
//   return res.status(200).json(launches);
// }

module.exports = {
  httpGetTotalRewardsAvailableForClaim,
  httpCheckForUsernameInProgram,
  httpGetUserAddressViaLink,
  httpCreateReferralCode,
  httpSetReferralBonus,
  httpGetReferralBonus,
  httpSetDiscountDays,
  httpGetDiscountDays,
  httpSetLevelRate,
  httpGetLevelRate,
  httpGetUserInfo,
  httpAddReferral,
};
