// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReferralList {
    enum Tier {
        NOTAFFILIATE,
        AFFILIATE,
        KOL
    }

    error AffiliateAlreadyExists();
    error AffiliateNotAllowed();
    error InvalidSignature();
    error LengthMismatch();

    event AllowAffiliate(address affiliates);
    event AllowKOL(address KOL);
    event AddAffiliate(address trader, address affiliate);
    event Airdrop();
    event SetRewardToken(address rewardToken);
    event SetVerifyingAddress(address verifyingAddress);
    event SetAffiliateComission(Tier tier, uint48 affiliateComission);
    event SetTraderDiscount(Tier tier, uint48 traderDiscount);
}
