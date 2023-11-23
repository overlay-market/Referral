// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {OwnableRoles} from "solady/src/auth/OwnableRoles.sol";
import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import {IReferralList} from "src/IReferralList.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ReferralList is OwnableRoles, Initializable, UUPSUpgradeable, IReferralList {
    uint256 public constant ROLE_AIRDROPPER = uint256(keccak256("ROLE_AIRDROPPER"));

    mapping(address trader => address affiliate) public referrals;
    mapping(address affiliate => bool isAllowed) public allowedAffiliates;

    address public rewardToken;
    uint48 public affiliateComission;
    uint48 public traderDiscount;

    constructor() {
        _disableInitializers();
    }

    function initialize(address _airdropper, address _rewardToken, uint48 _affiliateComission, uint48 _traderDiscount)
        public
        initializer
    {
        _initializeOwner(msg.sender);
        grantRoles(_airdropper, ROLE_AIRDROPPER);
        setRewardToken(_rewardToken);
        setAffiliateComission(_affiliateComission);
        setTraderDiscount(_traderDiscount);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function addAffiliate(address _affiliate) public {
        if (!allowedAffiliates[_affiliate]) revert AffiliateNotAllowed();
        referrals[msg.sender] = _affiliate;
        emit AddAffiliate(msg.sender, _affiliate);
    }

    function allowAffiliates(address[] memory _affiliates) public onlyOwner {
        for (uint256 i = 0; i < _affiliates.length; i++) {
            address affiliate = _affiliates[i];
            if (allowedAffiliates[affiliate]) revert AffiliateAlreadyExists();
            allowedAffiliates[affiliate] = true;
        }
        emit AllowAffiliates(_affiliates);
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

    function setRewardToken(address _rewardToken) public onlyOwner {
        rewardToken = _rewardToken;
        emit SetRewardToken(_rewardToken);
    }

    function setAffiliateComission(uint48 _affiliateComission) public onlyOwner {
        affiliateComission = _affiliateComission;
        emit SetAffiliateComission(_affiliateComission);
    }

    function setTraderDiscount(uint48 _traderDiscount) public onlyOwner {
        traderDiscount = _traderDiscount;
        emit SetTraderDiscount(_traderDiscount);
    }
}
