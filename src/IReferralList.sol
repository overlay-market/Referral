// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReferralList {
    error ReferredAlreadyExists();
    error ReferrerNotAllowed();

    struct programConfig {
        address rewardToken;
        uint32 affiliateComission;
        uint32 traderDiscount;
        uint32 traderDiscountTimePeriod;
    }
}
