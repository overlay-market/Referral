const { Router } = require("express");
const referralsRouter = Router();
const {
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
  httpHasReferrer,
} = require("./referrals.controller");

referralsRouter.get("/totalRewards", httpGetTotalRewardsAvailableForClaim);

referralsRouter.get("/checkUserName/:userName", httpCheckForUsernameInProgram);

referralsRouter.get("/userAddressViaLink/:link", httpGetUserAddressViaLink);

referralsRouter.get("/hasReferrer/:address", httpHasReferrer);

referralsRouter.get("/referralBonus", httpGetReferralBonus);

referralsRouter.get("/discountDays", httpGetDiscountDays);

referralsRouter.get("/userInfo/:user", httpGetUserInfo);

referralsRouter.get("/level", httpGetLevelRate);

referralsRouter.post("/addReferral", httpAddReferral);

referralsRouter.post("/setLevelRate", httpSetLevelRate);

referralsRouter.post("/setDiscountDays", httpSetDiscountDays);

referralsRouter.post("/setReferralBonus", httpSetReferralBonus);

referralsRouter.post("/createReferralCode", httpCreateReferralCode);

module.exports = referralsRouter;
