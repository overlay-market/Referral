// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReferralList {
    error AffiliateAlreadyExists();
    error AffiliateNotAllowed();
    error LengthMismatch();

    event AllowAffiliates(address[] affiliates);
    event AddAffiliate(address trader, address affiliate);
    event Airdrop();
    event SetRewardToken(address rewardToken);
    event SetAffiliateComission(uint48 affiliateComission);
    event SetTraderDiscount(uint48 traderDiscount);
}
