// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "solady/src/auth/OwnableRoles.sol";

contract ReferralList is Ownable {
    error ReferredAlreadyExists();
    error ReferrerNotAllowed();

    mapping(address referred => address referrer) public referrals;
    mapping(address referrer => bool isAllowed) public allowedReferrers;

    constructor() {
        _initializeOwner(msg.sender);
    }

    function addReferrer(address _referrer) public {
        if (referrals[_referrer] != address(0)) revert ReferredAlreadyExists();
        referrals[msg.sender] = _referrer;
    }

    function addAllowedReferrer(address _referrer) public {
        if (referrals[_referrer] != address(0)) revert ReferredAlreadyExists();
        allowedReferrers[_referrer] = true;
    }
}
