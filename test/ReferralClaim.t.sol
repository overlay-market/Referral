// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {OverlayV1Token} from "src/OverlayV1Token.sol";
import {ReferralList} from "src/ReferralList.sol";

contract ReferralClaimTest is Test {
    ReferralList referralList;
    OverlayV1Token ovl;

    address alice;
    bytes32 merkleRoot;
    bytes32[] proof = [bytes32(0xceeae64152a2deaf8c661fccd5645458ba20261b16d2f6e090fe908b0ac9ca88)];

    address private AIRDROPPER = makeAddr("airdropper");

    function setUp() public {
        ovl = new OverlayV1Token();

        referralList = ReferralList(address(new ERC1967Proxy(address(new ReferralList()), "")));
        referralList.initialize(address(this), AIRDROPPER, address(ovl), address(0));

        deal(address(ovl), AIRDROPPER, 5000 ether);

        vm.prank(AIRDROPPER);
        ovl.approve(address(referralList), 5000 ether);

        // pre-computed merkle root that contains 100 ether for alice's address
        merkleRoot = 0xd0aa6a4e5b4e13462921d7518eebdb7b297a7877d6cfe078b0c318827392fb55;
        alice = 0x185a4dc360CE69bDCceE33b3784B0282f7961aea;
    }

    function test_initClaimPeriod() public {
        vm.prank(AIRDROPPER);
        referralList.initClaimPeriod(merkleRoot, 100 ether, block.timestamp);
        assertEq(referralList.referralClaim().merkleRoot(), merkleRoot);
        assertEq(referralList.referralClaim().lastRewardUpdate(), block.timestamp);
        assertEq(ovl.balanceOf(address(referralList.referralClaim())), 100 ether);
    }

    function test_initClaimPeriod_notAirdropper() public {
        vm.expectRevert(bytes4(keccak256("Unauthorized()")));
        referralList.initClaimPeriod(merkleRoot, 100 ether, block.timestamp);
    }

    function test_claimRewards() public {
        vm.prank(AIRDROPPER);
        referralList.initClaimPeriod(merkleRoot, 100 ether, block.timestamp);

        vm.startPrank(alice);
        referralList.claimRewards(alice, 100 ether, proof);

        assertEq(ovl.balanceOf(alice), 100 ether);

        vm.expectRevert(bytes4(keccak256("AlreadyClaimed()")));
        referralList.claimRewards(alice, 100 ether, proof);
    }

    function test_claimRewards_notInMerkle() public {
        vm.prank(AIRDROPPER);
        referralList.initClaimPeriod(merkleRoot, 100 ether, block.timestamp);

        vm.prank(alice);
        vm.expectRevert(bytes4(keccak256("NotInMerkle()")));
        referralList.claimRewards(address(0xb0b), 100 ether, proof);

        vm.prank(address(0xb0b));
        vm.expectRevert(bytes4(keccak256("NotInMerkle()")));
        referralList.claimRewards(address(0xb0b), 100 ether, proof);
    }

    function test_claimRewards_multiplePeriods() public {
        vm.prank(AIRDROPPER);
        referralList.initClaimPeriod(merkleRoot, 100 ether, block.timestamp);

        vm.prank(alice);
        referralList.claimRewards(alice, 100 ether, proof);

        assertEq(ovl.balanceOf(alice), 100 ether);

        vm.warp(block.timestamp + 1 weeks);

        vm.prank(AIRDROPPER);
        referralList.initClaimPeriod(merkleRoot, 100 ether, block.timestamp);

        vm.prank(alice);
        referralList.claimRewards(alice, 100 ether, proof);

        assertEq(ovl.balanceOf(alice), 200 ether);
    }

    function test_initClaimPeriod_withADifferentToken() public {
        OverlayV1Token ovl2 = new OverlayV1Token();
        deal(address(ovl2), AIRDROPPER, 5000 ether);

        vm.startPrank(AIRDROPPER);
        referralList.setRewardToken(address(ovl2));

        ovl2.approve(address(referralList), 5000 ether);

        referralList.initClaimPeriod(merkleRoot, 100 ether, block.timestamp);
        assertEq(ovl2.balanceOf(address(referralList.referralClaim())), 100 ether);

        vm.stopPrank();

        vm.prank(alice);
        referralList.claimRewards(alice, 100 ether, proof);
        assertEq(ovl2.balanceOf(alice), 100 ether);
    }
}
