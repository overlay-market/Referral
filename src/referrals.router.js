const { Router } = require("express");
const referralsRouter = Router();
const {
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
} = require("./referrals.controller");

referralsRouter.get("/checkUserName/:userName", httpCheckForUsernameInProgram);

referralsRouter.get("/userAddressViaLink/:link", httpGetUserAddressViaLink);

referralsRouter.get("/hasReferrer/:address", httpHasReferrer);

referralsRouter.get("/getProgramData", httpGetProgramData);

referralsRouter.get("/userInfo/:user", httpGetUserInfo);

referralsRouter.post("/addReferral", httpAddReferral);

referralsRouter.post("/setLevelRate", httpSetLevelRate);

referralsRouter.post("/setDiscountDays", httpSetDiscountDays);

referralsRouter.post("/setDiscountBonus", httpSetDiscountBonus);

referralsRouter.post("/setReferralBonus", httpSetReferralBonus);

referralsRouter.post("/createReferralCode", httpCreateReferralCode);

referralsRouter.delete("/deleteReferralLink/:userName", httpDeleteReferralLink);

module.exports = referralsRouter;
