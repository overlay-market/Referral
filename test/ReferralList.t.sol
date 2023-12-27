// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console2} from "forge-std/Test.sol";
import {ReferralList} from "src/ReferralList.sol";
import {IReferralList} from "src/IReferralList.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
    ReferralList rl;

    address[] addresses = new address[](500);
    uint256[] amounts = new uint256[](500);

    function setUp() public {
        vm.createSelectFork(vm.envString("MAINNET_RPC"), 15_312_2295);
        vm.startPrank(OWNER);
        rl = ReferralList(address(new ERC1967Proxy(address(new ReferralList()), "")));
        rl.initialize(OWNER, AIRDROPPER, address(OVL), VERIFIER);
        deal(address(OVL), AIRDROPPER, 5000 ether);
    }

    function testUpgrade() public {
        address newImplementation = address(new ReferralList());
        vm.expectEmit();
        emit Upgraded(newImplementation);
        rl.upgradeToAndCall(newImplementation, "");
    }

    function testAllowAffiliate() public {
        bytes32 msgHash = keccak256(abi.encodePacked(USER, address(rl), block.chainid)).toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(VERIFIER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        vm.startPrank(USER);
        rl.allowAffiliate(signature);
    }

    function testAllowAffiliateInvalidSignature() public {
        bytes4 selector = bytes4(keccak256("InvalidSignature()"));
        bytes32 msgHash = keccak256(abi.encodePacked(USER, address(rl), block.chainid)).toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(VERIFIER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        vm.startPrank(makeAddr("kaker"));
        vm.expectRevert(selector);
        rl.allowAffiliate(signature);
    }

    function testAllowAffiliateAlreadyExists() public {
        bytes4 selector = bytes4(keccak256("AffiliateAlreadyExists()"));
        bytes32 msgHash = keccak256(abi.encodePacked(USER, address(rl), block.chainid)).toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(VERIFIER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        vm.startPrank(USER);
        rl.allowAffiliate(signature);
        vm.expectRevert(selector);
        rl.allowAffiliate(signature);
    }

    function testSuccesfulAirdrop() public {
        for (uint256 i = 0; i < 500; i++) {
            addresses[i] = address(uint160(i + 1));
            amounts[i] = 10 ether;
        }

        vm.startPrank(AIRDROPPER);

        OVL.approve(address(rl), 5000 ether);

        vm.expectEmit();
        emit IReferralList.Airdrop();
        rl.airdropERC20(addresses, amounts, 5000 ether);
        assertEq(OVL.balanceOf(AIRDROPPER), 0);

        for (uint256 i = 0; i < 10; i++) {
            assertEq(OVL.balanceOf(address(uint160(i + 1))), 10 ether);
        }
    }

    function testLengthMismatch() public {
        bytes4 selector = bytes4(keccak256("LengthMismatch()"));
        address[] memory addresses2 = new address[](2);
        uint256[] memory amounts2 = new uint256[](1);

        addresses2[0] = address(uint160(1));
        addresses2[1] = address(uint160(2));
        amounts2[0] = 10 ether;

        vm.startPrank(AIRDROPPER);

        OVL.approve(address(rl), 100 ether);

        vm.expectRevert(selector);

        rl.airdropERC20(addresses2, amounts2, 100 ether);
    }

    function testNotEnoughApproval() public {
        for (uint256 i = 0; i < 10; i++) {
            addresses[i] = address(uint160(i + 1));
            amounts[i] = 10 ether;
        }

        vm.startPrank(AIRDROPPER);

        OVL.approve(address(rl), 50 ether);

        vm.expectRevert("ERC20: insufficient allowance");

        rl.airdropERC20(addresses, amounts, 100 ether);
    }

    function testNotAirdropper() public {
        bytes4 selector = bytes4(keccak256("Unauthorized()"));
        for (uint256 i = 0; i < 10; i++) {
            addresses[i] = address(uint160(i + 1));
            amounts[i] = 10 ether;
        }

        vm.startPrank(OWNER);

        OVL.approve(address(rl), 100 ether);

        vm.expectRevert(selector);

        rl.airdropERC20(addresses, amounts, 100 ether);
    }

    function testAddNotAllowedReferrer() public {
        bytes4 selector = bytes4(keccak256("AffiliateNotAllowed()"));
        address affiliate = makeAddr("affiliate");
        vm.startPrank(USER);
        vm.expectRevert(selector);
        rl.addAffiliateOrKOL(affiliate);
    }

    function testAddNotAllowedReferrerTwice() public {
        bytes4 selector = bytes4(keccak256("ReferrerAlreadySet()"));
        address affiliate = makeAddr("affiliate");
        vm.startPrank(AIRDROPPER);
        rl.allowKOL(affiliate);
        vm.startPrank(USER);
        rl.addAffiliateOrKOL(affiliate);
        vm.expectRevert(selector);
        rl.addAffiliateOrKOL(affiliate);
    }

    function testSetRewardToken() public {
        vm.startPrank(AIRDROPPER);
        address token = makeAddr("token");
        vm.expectEmit();
        emit IReferralList.SetRewardToken(token);
        rl.setRewardToken(token);
        assertEq(rl.rewardToken(), token);
    }

    function testSetRewardTokenNotAdmin() public {
        bytes4 selector = bytes4(keccak256("Unauthorized()"));
        vm.startPrank(makeAddr("kaker"));
        address token = makeAddr("token");
        vm.expectRevert(selector);
        rl.setRewardToken(token);
    }

    function testSetAffiliateComission(uint256 tierNumber, uint48 comission) public {
        tierNumber = tierNumber % 2;
        IReferralList.Tier tier = IReferralList.Tier(tierNumber);
        vm.startPrank(AIRDROPPER);
        vm.expectEmit();
        emit IReferralList.SetAffiliateComission(tier, comission);
        rl.setAffiliateComission(tier, comission);
        assertEq(rl.tierAffiliateComission(tier), comission);
    }

    function testSetAffiliateComissionNotAdmin() public {
        bytes4 selector = bytes4(keccak256("Unauthorized()"));
        vm.startPrank(makeAddr("kaker"));
        vm.expectRevert(selector);
        rl.setAffiliateComission(IReferralList.Tier.AFFILIATE, 0);
    }

    function testSetTraderDiscount(uint256 tierNumber, uint48 discount) public {
        tierNumber = tierNumber % 2;
        IReferralList.Tier tier = IReferralList.Tier(tierNumber);
        vm.startPrank(AIRDROPPER);
        vm.expectEmit();
        emit IReferralList.SetTraderDiscount(tier, discount);
        rl.setTraderDiscount(tier, discount);
        assertEq(rl.tierTraderDiscount(tier), discount);
    }

    function testSetTraderDiscountNotAdmin() public {
        bytes4 selector = bytes4(keccak256("Unauthorized()"));
        vm.startPrank(makeAddr("kaker"));
        vm.expectRevert(selector);
        rl.setTraderDiscount(IReferralList.Tier.AFFILIATE, 0);
    }
}
