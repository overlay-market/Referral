// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {OwnableRoles} from "solady/src/auth/OwnableRoles.sol";
import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import {IReferralList} from "src/IReferralList.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {ECDSA} from "solady/src/utils/ECDSA.sol";
import {ReferralClaim} from "src/ReferralClaim.sol";

contract ReferralList is OwnableRoles, Initializable, UUPSUpgradeable, IReferralList {
    using ECDSA for bytes32;

    uint256 internal constant ROLE_ADMIN = 1 << 0; // b01
    uint256 internal constant ROLE_AIRDROPPER = 1 << 1; // b10

    mapping(address trader => address affiliate) public referrals;
    mapping(address affiliate => Tier) public userTier;
    mapping(Tier => uint48) public tierAffiliateComission;
    mapping(Tier => uint48) public tierTraderDiscount;

    address public rewardToken;
    address public verifyingAddress;

    ReferralClaim public referralClaim;

    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_, address _airdropper, address _rewardToken, address _verifyingAddress)
        public
        initializer
    {
        _initializeOwner(owner_);
        _grantRoles(_airdropper, ROLE_ADMIN | ROLE_AIRDROPPER); // b11
        _setVerifyingAddress(_verifyingAddress);
        referralClaim = new ReferralClaim(bytes32(0), _rewardToken);
        _setRewardToken(_rewardToken);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function addAffiliateOrKOL(address _user) public {
        if (msg.sender == _user) {
            revert SelfReferralNotAllowed();
        }
        if (userTier[_user] != Tier.AFFILIATE && userTier[_user] != Tier.KOL) {
            revert AffiliateNotAllowed();
        }
        if (referrals[msg.sender] != address(0)) {
            revert ReferrerAlreadySet();
        }
        referrals[msg.sender] = _user;
        emit AddAffiliateOrKOL(msg.sender, _user);
    }

    function allowAffiliate(bytes calldata signature) public {
        address affiliate = msg.sender;
        bytes32 signedMessageHash =
            keccak256(abi.encodePacked(affiliate, address(this), block.chainid)).toEthSignedMessageHash();
        if (signedMessageHash.recover(signature) != verifyingAddress) revert InvalidSignature();
        if (userTier[affiliate] != Tier.NOT_AFFILIATE) revert AffiliateAlreadyExists();
        userTier[affiliate] = Tier.AFFILIATE;
        emit AllowAffiliate(affiliate);
    }

    function allowKOL(address _KOL) public onlyRoles(ROLE_ADMIN) {
        if (userTier[_KOL] == Tier.KOL) revert AffiliateAlreadyExists();
        userTier[_KOL] = Tier.KOL;
        emit AllowKOL(_KOL);
    }

    function claimRewards(address to, uint256 amount, bytes32[] calldata proof) external {
        referralClaim.claim(to, amount, proof);
        emit ClaimRewards(to, amount);
    }

    function initClaimPeriod(bytes32 merkleRoot, uint256 totalRewards, uint256 lastUpdateTimestamp)
        public
        onlyRoles(ROLE_AIRDROPPER)
    {
        IERC20 token = IERC20(rewardToken);

        referralClaim.setMerkleRoot(merkleRoot, lastUpdateTimestamp);

        uint256 missingRewards = totalRewards - token.balanceOf(address(referralClaim));
        token.transferFrom(msg.sender, address(referralClaim), missingRewards);

        emit NewClaimingPeriod(lastUpdateTimestamp, merkleRoot, totalRewards);
    }

    function setRewardToken(address _rewardToken) public onlyRoles(ROLE_ADMIN) {
        _setRewardToken(_rewardToken);
    }

    function _setRewardToken(address _rewardToken) internal {
        rewardToken = _rewardToken;
        referralClaim.setToken(_rewardToken);
        emit SetRewardToken(_rewardToken);
    }

    function setVerifyingAddress(address _verifyingAddress) public onlyRoles(ROLE_ADMIN) {
        _setVerifyingAddress(_verifyingAddress);
    }

    function _setVerifyingAddress(address _verifyingAddress) internal {
        verifyingAddress = _verifyingAddress;
        emit SetVerifyingAddress(_verifyingAddress);
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
