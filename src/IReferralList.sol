// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReferralList {
    error AffiliateAlreadyExists();
    error AffiliateNotAllowed();

    event AllowAffiliates(address[] affiliates);
    event AddAffiliate(address trader, address affiliate);
}
