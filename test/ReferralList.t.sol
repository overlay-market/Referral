// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import {ReferralList} from "src/ReferralList.sol";
import {IReferralList} from "src/IReferralList.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {ECDSA} from "solady/src/utils/ECDSA.sol";

contract ReferralListTest is Test {
    using ECDSA for bytes32;

    event Upgraded(address indexed implementation);

    IERC20 private OVL = IERC20(vm.envAddress("OV_CONTRACT"));
    address private OWNER = makeAddr("owner");
    address private AIRDROPPER = makeAddr("airdropper");
    uint256 private VERIFIER_PRIVATE_KEY = 0x0303456;
    address private VERIFIER = vm.addr(VERIFIER_PRIVATE_KEY);
    address private USER = makeAddr("user");
    ReferralList referralList;

    address[] addresses = new address[](500);
    uint256[] amounts = new uint256[](500);

    event AllowKOL(address KOL);
    event AddAffiliateOrKOL(address trader, address affiliate);
    event SetRewardToken(address rewardToken);
    event SetVerifyingAddress(address verifyingAddress);
    event SetAffiliateComission(IReferralList.Tier tier, uint48 affiliateComission);
    event SetTraderDiscount(IReferralList.Tier tier, uint48 traderDiscount);

    function setUp() public {
        vm.createSelectFork(vm.envString("MAINNET_RPC"), 15_312_2295);
        vm.startPrank(OWNER);
        referralList = ReferralList(address(new ERC1967Proxy(address(new ReferralList()), "")));
        referralList.initialize(OWNER, AIRDROPPER, address(OVL), VERIFIER);
        deal(address(OVL), AIRDROPPER, 5000 ether);
    }

    function testUpgrade() public {
        address newImplementation = address(new ReferralList());
        vm.expectEmit();
        emit Upgraded(newImplementation);
        referralList.upgradeTo(newImplementation);
    }

    function testUpgradeInvalidAddress() public {
        vm.expectRevert();
        referralList.upgradeToAndCall(makeAddr("not a contract"), "");
    }

    function testAllowAffiliate() public {
        bytes32 msgHash = keccak256(abi.encodePacked(USER, address(referralList), block.chainid)).toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(VERIFIER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        vm.startPrank(USER);
        referralList.allowAffiliate(signature);
    }

    function testAllowKOL() public {
        bytes4 selector = bytes4(keccak256("AffiliateAlreadyExists()"));
        vm.startPrank(AIRDROPPER);
        vm.expectEmit();
        emit AllowKOL(USER);
        referralList.allowKOL(USER);

        vm.expectRevert(selector);
        referralList.allowKOL(USER);
    }

    function testDowngrade() public {
        bytes4 selector = bytes4(keccak256("AffiliateAlreadyExists()"));
        vm.startPrank(AIRDROPPER);
        referralList.allowKOL(USER);
        bytes32 msgHash = keccak256(abi.encodePacked(USER, address(referralList), block.chainid)).toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(VERIFIER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        vm.startPrank(USER);
        vm.expectRevert(selector);
        referralList.allowAffiliate(signature);
    }

    function testAllowAffiliateInvalidSignature() public {
        bytes4 selector = bytes4(keccak256("InvalidSignature()"));
        bytes32 msgHash = keccak256(abi.encodePacked(USER, address(referralList), block.chainid)).toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(VERIFIER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        vm.startPrank(makeAddr("kaker"));
        vm.expectRevert(selector);
        referralList.allowAffiliate(signature);
    }

    function testAllowAffiliateAlreadyExists() public {
        bytes32 msgHash = keccak256(abi.encodePacked(USER, address(referralList), block.chainid)).toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(VERIFIER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        vm.startPrank(USER);
        referralList.allowAffiliate(signature);
        vm.expectRevert(bytes4(keccak256("AffiliateAlreadyExists()")));
        referralList.allowAffiliate(signature);
    }

    function testAddNotAllowedReferrer() public {
        bytes4 selector = bytes4(keccak256("AffiliateNotAllowed()"));
        address affiliate = makeAddr("affiliate");
        vm.startPrank(USER);
        vm.expectRevert(selector);
        referralList.addAffiliateOrKOL(affiliate);
    }

    function testAddNotAllowedReferrerTwice() public {
        bytes4 selector = bytes4(keccak256("ReferrerAlreadySet()"));
        address affiliate2 = makeAddr("user2");
        bytes32 msgHash = keccak256(abi.encodePacked(affiliate2, address(referralList), block.chainid)).toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(VERIFIER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        vm.startPrank(affiliate2);
        referralList.allowAffiliate(signature);

        address affiliate = makeAddr("affiliate");
        vm.startPrank(AIRDROPPER);
        referralList.allowKOL(affiliate);
        vm.startPrank(USER);
        vm.expectEmit();
        emit AddAffiliateOrKOL(USER, affiliate);
        referralList.addAffiliateOrKOL(affiliate);

        vm.expectRevert(selector);
        referralList.addAffiliateOrKOL(affiliate);

        vm.expectRevert(selector);
        referralList.addAffiliateOrKOL(affiliate2);
    }

    function testSetRewardToken() public {
        vm.startPrank(AIRDROPPER);
        address token = makeAddr("token");
        vm.expectEmit();
        emit SetRewardToken(token);
        referralList.setRewardToken(token);
        assertEq(referralList.rewardToken(), token);

        address referralClaimToken = address(referralList.referralClaim().token());
        assertEq(referralClaimToken, token);
    }

    function testSetRewardTokenNotAdmin() public {
        bytes4 selector = bytes4(keccak256("Unauthorized()"));
        vm.startPrank(makeAddr("kaker"));
        address token = makeAddr("token");
        vm.expectRevert(selector);
        referralList.setRewardToken(token);
    }

    function testSetVerifyingAddress() public {
        vm.startPrank(AIRDROPPER);
        address verifyingAddress = makeAddr("verifyingAddress");
        vm.expectEmit();
        emit SetVerifyingAddress(verifyingAddress);
        referralList.setVerifyingAddress(verifyingAddress);
        assertEq(referralList.verifyingAddress(), verifyingAddress);
    }

    function testSetAffiliateComission(uint256 tierNumber, uint48 comission) public {
        tierNumber = tierNumber % 2;
        IReferralList.Tier tier = IReferralList.Tier(tierNumber);
        vm.startPrank(AIRDROPPER);
        vm.expectEmit();
        emit SetAffiliateComission(tier, comission);
        referralList.setAffiliateComission(tier, comission);
        assertEq(referralList.tierAffiliateComission(tier), comission);
    }

    function testSetAffiliateComissionNotAdmin() public {
        bytes4 selector = bytes4(keccak256("Unauthorized()"));
        vm.startPrank(makeAddr("kaker"));
        vm.expectRevert(selector);
        referralList.setAffiliateComission(IReferralList.Tier.AFFILIATE, 0);
    }

    function testSetTraderDiscount(uint256 tierNumber, uint48 discount) public {
        tierNumber = tierNumber % 2;
        IReferralList.Tier tier = IReferralList.Tier(tierNumber);
        vm.startPrank(AIRDROPPER);
        vm.expectEmit();
        emit SetTraderDiscount(tier, discount);
        referralList.setTraderDiscount(tier, discount);
        assertEq(referralList.tierTraderDiscount(tier), discount);
    }

    function testSetTraderDiscountNotAdmin() public {
        bytes4 selector = bytes4(keccak256("Unauthorized()"));
        vm.startPrank(makeAddr("kaker"));
        vm.expectRevert(selector);
        referralList.setTraderDiscount(IReferralList.Tier.AFFILIATE, 0);
    }

    function testSelfReferralNotAllowed() public {
        bytes4 selector = bytes4(keccak256("SelfReferralNotAllowed()"));
        vm.startPrank(AIRDROPPER);
        vm.expectRevert(selector);
        referralList.addAffiliateOrKOL(AIRDROPPER);
    }
}
