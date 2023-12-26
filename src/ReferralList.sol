// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {OwnableRoles} from "solady/src/auth/OwnableRoles.sol";
import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import {IReferralList} from "src/IReferralList.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ReferralList is OwnableRoles, Initializable, UUPSUpgradeable, IReferralList {
    uint256 internal constant ROLE_ADMIN = 1 << 0;
    uint256 internal constant ROLE_AIRDROPPER = 1 << 1;

    mapping(address trader => address affiliate) public referrals;
    mapping(address affiliate => Tier) public userTier;
    mapping(Tier => uint48) public tierAffiliateComission;
    mapping(Tier => uint48) public tierTraderDiscount;

    address public rewardToken;

    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_, address _airdropper, address _rewardToken) public initializer {
        _initializeOwner(owner_);
        grantRoles(_airdropper, 3);
        _setRewardToken(_rewardToken);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function addAffiliate(address _user) public {
        if (userTier[_user] == Tier.AFFILIATE) revert AffiliateNotAllowed();
        referrals[msg.sender] = _user;
        emit AddAffiliate(msg.sender, _user);
    }

    function addKOL(address _user) public {
        if (userTier[_user] == Tier.KOL) revert AffiliateNotAllowed();
        referrals[msg.sender] = _user;
        emit AddAffiliate(msg.sender, _user);
    }

    // TODO: Modify to use signature
    function allowAffiliates(address _affiliate) public onlyRoles(ROLE_ADMIN) {
        if (userTier[_affiliate] == Tier.AFFILIATE) revert AffiliateAlreadyExists();
        userTier[_affiliate] = Tier.AFFILIATE;
        emit AllowAffiliate(_affiliate);
    }

    function allowKOL(address _KOL) public onlyRoles(ROLE_ADMIN) {
        if (userTier[_KOL] == Tier.KOL) revert AffiliateAlreadyExists();
        userTier[_KOL] = Tier.KOL;
        emit AllowKOL(_KOL);
    }

    function airdropERC20(address[] calldata _addresses, uint256[] calldata _amounts, uint256 _totalAmount)
        external
        onlyRoles(ROLE_AIRDROPPER)
    {
        uint256 addressesLength = _addresses.length;
        if (addressesLength != _amounts.length) revert LengthMismatch();
        address _token = rewardToken;

        IERC20(_token).transferFrom(msg.sender, address(this), _totalAmount);
        for (uint256 i = 0; i < addressesLength; i++) {
            IERC20(_token).transfer(_addresses[i], _amounts[i]);
        }

        emit Airdrop();
    }

    function setRewardToken(address _rewardToken) public onlyRoles(ROLE_ADMIN) {
        _setRewardToken(_rewardToken);
    }

    function _setRewardToken(address _rewardToken) internal {
        rewardToken = _rewardToken;
        emit SetRewardToken(_rewardToken);
    }

    function setAffiliateComission(Tier _tier, uint48 _affiliateComission) public onlyRoles(ROLE_ADMIN) {
        _setAffiliateComission(_tier, _affiliateComission);
    }

    function _setAffiliateComission(Tier _tier, uint48 _affiliateComission) internal {
        tierAffiliateComission[_tier] = _affiliateComission;
        emit SetAffiliateComission(_tier, _affiliateComission);
    }

    function setTraderDiscount(Tier _tier, uint48 _traderDiscount) public onlyRoles(ROLE_ADMIN) {
        _setTraderDiscount(_tier, _traderDiscount);
    }

    function _setTraderDiscount(Tier _tier, uint48 _traderDiscount) internal {
        tierTraderDiscount[_tier] = _traderDiscount;
        emit SetTraderDiscount(_tier, _traderDiscount);
    }
}
