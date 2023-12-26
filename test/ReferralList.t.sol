// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console2} from "forge-std/Test.sol";
import {ReferralList} from "src/ReferralList.sol";
import {IReferralList} from "src/IReferralList.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract ReferralListTest is Test {
    IERC20 private OVL = IERC20(vm.envAddress("OV_CONTRACT"));
    address private OWNER = makeAddr("owner");
    address private AIRDROPPER = makeAddr("airdropper");
    address private VERIFIER = makeAddr("verifier");
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

    function testSetAffiliateComission(uint256 tierNumber, uint48 comission) public {
        tierNumber = tierNumber % 2;
        IReferralList.Tier tier = IReferralList.Tier(tierNumber);
        vm.startPrank(AIRDROPPER);
        vm.expectEmit();
        emit IReferralList.SetAffiliateComission(tier, comission);
        rl.setAffiliateComission(tier, comission);
        assertEq(rl.tierAffiliateComission(tier), comission);
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
}
