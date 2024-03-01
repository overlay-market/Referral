// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IReferralList {
    enum Tier {
        NOT_AFFILIATE,
        AFFILIATE,
        KOL
    }

    error AffiliateAlreadyExists();
    error AffiliateNotAllowed();
    error InvalidSignature();
    error LengthMismatch();
    error ReferrerAlreadySet();

    event AllowAffiliate(address affiliate);
    event AllowKOL(address KOL);
    event AddAffiliateOrKOL(address trader, address affiliate);
    event NewClaimingPeriod(uint256 indexed period, bytes32 merkleRoot, uint256 totalRewards);
    event ClaimRewards(address indexed to, uint256 amount);
    event SetRewardToken(address rewardToken);
    event SetVerifyingAddress(address verifyingAddress);
    event SetAffiliateComission(Tier tier, uint48 affiliateComission);
    event SetTraderDiscount(Tier tier, uint48 traderDiscount);
}
