// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console2} from "forge-std/Test.sol";
import {ReferralList} from "src/ReferralList.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract ReferralListTest is Test {
    IERC20 constant OVL = IERC20(0x4305C4Bc521B052F17d389c2Fe9d37caBeB70d54);
    address private OWNER = makeAddr("owner");
    address private AIRDROPPER = makeAddr("airdropper");
    ReferralList rl;

    address[] addresses = new address[](500);
    uint256[] amounts = new uint256[](500);

    function setUp() public {
        vm.createSelectFork(vm.envString("ARBITRUM_RPC"), 15_312_2295);
        vm.startPrank(OWNER);
        rl = ReferralList(address(new ERC1967Proxy(address(new ReferralList()), "")));
        rl.initialize(AIRDROPPER, address(OVL));
        deal(address(OVL), AIRDROPPER, 5000 ether);
    }

    function testHappyPath() public {
        for (uint256 i = 0; i < 500; i++) {
            addresses[i] = address(uint160(i + 1));
            amounts[i] = 10 ether;
        }

        vm.startPrank(AIRDROPPER);

        OVL.approve(address(rl), 5000 ether);

        rl.airdropERC20(addresses, amounts, 5000 ether);
        assertEq(OVL.balanceOf(AIRDROPPER), 0);

        for (uint256 i = 0; i < 10; i++) {
            assertEq(OVL.balanceOf(address(uint160(i + 1))), 10 ether);
        }
    }

    function testNotEnoughApproval() public {
        for (uint256 i = 0; i < 10; i++) {
            addresses[i] = address(uint160(i + 1));
            amounts[i] = 10 ether;
        }

        vm.startPrank(AIRDROPPER);

        OVL.approve(address(rl), 50 ether);

        vm.expectRevert();

        rl.airdropERC20(addresses, amounts, 100 ether);
    }

    function testNotAirdropper() public {
        for (uint256 i = 0; i < 10; i++) {
            addresses[i] = address(uint160(i + 1));
            amounts[i] = 10 ether;
        }

        vm.startPrank(OWNER);

        OVL.approve(address(rl), 100 ether);

        vm.expectRevert();

        rl.airdropERC20(addresses, amounts, 100 ether);
    }

    function testAddNotAllowedReferrer() public {
        address affiliate = makeAddr("affiliate");
        vm.expectRevert();
        rl.addAffiliate(affiliate);
    }

    function testAllowAffiliates() public {
        address[] memory affiliates = new address[](2);
        affiliates[0] = makeAddr("affiliate1");
        affiliates[1] = makeAddr("affiliate2");
        rl.allowAffiliates(affiliates);
        assertTrue(rl.allowedAffiliates(affiliates[0]));
        assertTrue(rl.allowedAffiliates(affiliates[1]));
        rl.addAffiliate(affiliates[0]);
        assertEq(rl.referrals(OWNER), affiliates[0]);
    }
}
