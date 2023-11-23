// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReferralList {
    error ReferredAlreadyExists();
    error ReferrerNotAllowed();

    event AddAllowedAffiliates(address[] affiliates);
}
