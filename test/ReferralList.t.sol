// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import {ReferralList} from "src/ReferralList.sol";
import {IReferralList} from "src/IReferralList.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {ECDSA} from "solady/src/utils/ECDSA.sol";
import {SigUtils} from "./SigUtils.sol";

contract ReferralListTest is Test {
    using ECDSA for bytes32;

    SigUtils internal sigUtils;

    event Upgraded(address indexed implementation);

    IERC20 private OVL = IERC20(vm.envAddress("OV_CONTRACT"));
    address private OWNER = makeAddr("owner");
    address private AIRDROPPER = makeAddr("airdropper");
    uint256 private VERIFIER_PRIVATE_KEY = 0x0303456;
    address private VERIFIER = vm.addr(VERIFIER_PRIVATE_KEY);
    uint256 private USER_PRIVATE_KEY = 0x0404567;
    address private USER = vm.addr(USER_PRIVATE_KEY);
    ReferralList referralList;

    address[] addresses = new address[](500);
    uint256[] amounts = new uint256[](500);

    // EIP712 domain separator
    struct EIP712Domain {
        string name;
        string version;
    }

    event AllowKOL(address KOL);
    event AddAffiliateOrKOL(address trader, address affiliate);
    event SetRewardToken(address rewardToken);
    event SetVerifyingAddress(address verifyingAddress);
    event SetAffiliateComission(IReferralList.Tier tier, uint48 affiliateComission);
    event SetTraderDiscount(IReferralList.Tier tier, uint48 traderDiscount);

    function setUp() public {
        vm.createSelectFork(vm.envString("MAINNET_RPC"), 15_312_2295);
        vm.startPrank(OWNER);

        EIP712Domain memory _domain = EIP712Domain("Overlay Referrals", "1.0");
        sigUtils = new SigUtils(hashDomain(_domain));
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
        bytes32 msgHash =
            keccak256(abi.encodePacked(USER, address(referralList), block.chainid)).toEthSignedMessageHash();
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
        bytes32 msgHash =
            keccak256(abi.encodePacked(USER, address(referralList), block.chainid)).toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(VERIFIER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        vm.startPrank(USER);
        vm.expectRevert(selector);
        referralList.allowAffiliate(signature);
    }

    function testAllowAffiliateInvalidSignature() public {
        bytes4 selector = bytes4(keccak256("InvalidSignature()"));
        bytes32 msgHash =
            keccak256(abi.encodePacked(USER, address(referralList), block.chainid)).toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(VERIFIER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        vm.startPrank(makeAddr("kaker"));
        vm.expectRevert(selector);
        referralList.allowAffiliate(signature);
    }

    function testAllowAffiliateAlreadyExists() public {
        bytes32 msgHash =
            keccak256(abi.encodePacked(USER, address(referralList), block.chainid)).toEthSignedMessageHash();
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
        bytes32 msgHash =
            keccak256(abi.encodePacked(affiliate2, address(referralList), block.chainid)).toEthSignedMessageHash();
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

    function testAddAffiliateOrKolOnBehalfOf() public {
        // create and allow affiliate
        address affiliate = makeAddr("affiliate");
        vm.startPrank(AIRDROPPER);
        referralList.allowKOL(affiliate);

        // create a valid message hash, and valid signature for USER
        SigUtils.AffiliateTo memory affiliateTo = SigUtils.AffiliateTo({affiliate: affiliate});
        bytes32 msgHash = sigUtils.getTypedDataHash(affiliateTo);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(USER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.expectEmit(true, true, true, true);
        emit AddAffiliateOrKOL(USER, affiliate);

        referralList.addAffiliateOrKolOnBehalfOf(USER, affiliate, signature);
    }

    function testAddAffiliateOrKolOnBehalfOfInvalidDomain() public {
        // create and allow affiliate
        address affiliate = makeAddr("affiliate");
        vm.startPrank(AIRDROPPER);
        referralList.allowKOL(affiliate);

        // setup invalid domain
        EIP712Domain memory _invalidDomain = EIP712Domain("Overlay Referrals Invalid", "1.0");
        SigUtils invalidSigUtils = new SigUtils(hashDomain(_invalidDomain));

        // create a message hash, and signature for USER
        SigUtils.AffiliateTo memory affiliateTo = SigUtils.AffiliateTo({affiliate: affiliate});
        bytes32 msgHash = invalidSigUtils.getTypedDataHash(affiliateTo);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(USER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // expect to revert with InvalidSignature error
        bytes4 selector = bytes4(keccak256("InvalidSignature()"));
        vm.expectRevert(selector);
        referralList.addAffiliateOrKolOnBehalfOf(USER, affiliate, signature);
    }

    function testAddAffiliateOrKolOnBehalfOfInvalidSignature() public {
        // create and allow affiliate
        address affiliate = makeAddr("affiliate");
        vm.startPrank(AIRDROPPER);
        referralList.allowKOL(affiliate);

        // create a valid message hash, and valid signature for USER
        SigUtils.AffiliateTo memory affiliateTo = SigUtils.AffiliateTo({affiliate: affiliate});
        bytes32 msgHash = sigUtils.getTypedDataHash(affiliateTo);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(USER_PRIVATE_KEY, msgHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // expect to revert with InvalidSignature error
        bytes4 selector = bytes4(keccak256("InvalidSignature()"));
        vm.expectRevert(selector);
        // use invalid USER aka kaker
        referralList.addAffiliateOrKolOnBehalfOf(makeAddr("kaker"), affiliate, signature);
    }

    function testBatchAddAffiliateOrKolOnBehalfOf() public {
        address[] memory affiliates = new address[](3);
        address[] memory USERs = new address[](3);
        bytes[] memory signatures = new bytes[](3);

        // create and allow affiliate1
        address affiliate = makeAddr("affiliate");
        affiliates[0] = affiliate;
        vm.startPrank(AIRDROPPER);
        referralList.allowKOL(affiliate);
        // create and allow affiliate2
        address affiliate2 = makeAddr("affiliate2");
        affiliates[1] = affiliate2;
        referralList.allowKOL(affiliate2);
        // create and allow affiliate3
        address affiliate3 = makeAddr("affiliate3");
        affiliates[2] = affiliate3;
        referralList.allowKOL(affiliate3);

        // create a valid message hash, and valid signature for USERs
        uint32[3] memory users_pk = [0x0213456, 0x052436766, 0x02431657];
        uint256 amountOfIterations = users_pk.length;
        for (uint256 i; i < amountOfIterations; i++) {
            SigUtils.AffiliateTo memory affiliateTo = SigUtils.AffiliateTo({affiliate: affiliates[i]});
            bytes32 msgHash = sigUtils.getTypedDataHash(affiliateTo);
            (uint8 v, bytes32 r, bytes32 s) = vm.sign(users_pk[i], msgHash);
            bytes memory signature = abi.encodePacked(r, s, v);
            USERs[i] = vm.addr(users_pk[i]);
            signatures[i] = signature;
        }
        vm.expectEmit(true, true, true, true);
        emit AddAffiliateOrKOL(USERs[0], affiliates[0]);
        vm.expectEmit(true, true, true, true);
        emit AddAffiliateOrKOL(USERs[1], affiliates[1]);
        vm.expectEmit(true, true, true, true);
        emit AddAffiliateOrKOL(USERs[2], affiliates[2]);
        referralList.batchAddAffiliateOrKolOnBehalfOf(USERs, affiliates, signatures);
    }

    function testBatchAddAffiliateOrKolOnBehalfOfInvalidDomain() public {
        address[] memory affiliates = new address[](2);
        address[] memory USERs = new address[](2);
        bytes[] memory signatures = new bytes[](2);

        // create and allow affiliate1
        address affiliate = makeAddr("affiliate");
        affiliates[0] = affiliate;
        vm.startPrank(AIRDROPPER);
        referralList.allowKOL(affiliate);
        // create and allow affiliate2
        address affiliate2 = makeAddr("affiliate2");
        affiliates[1] = affiliate2;
        referralList.allowKOL(affiliate2);

        // setup invalid domain
        EIP712Domain memory _invalidDomain = EIP712Domain("Overlay Referrals Invalid", "1.0");
        SigUtils invalidSigUtils = new SigUtils(hashDomain(_invalidDomain));

        // create a valid message hash, and valid signature for USERs
        uint32[2] memory users_pk = [0x0213456, 0x052436766];
        uint256 amountOfIterations = users_pk.length;
        for (uint256 i; i < amountOfIterations; i++) {
            SigUtils.AffiliateTo memory affiliateTo = SigUtils.AffiliateTo({affiliate: affiliates[i]});
            bytes32 msgHash = invalidSigUtils.getTypedDataHash(affiliateTo);
            (uint8 v, bytes32 r, bytes32 s) = vm.sign(users_pk[i], msgHash);
            bytes memory signature = abi.encodePacked(r, s, v);
            USERs[i] = vm.addr(users_pk[i]);
            signatures[i] = signature;
        }

        // expect to revert with InvalidSignature error
        bytes4 selector = bytes4(keccak256("InvalidSignature()"));
        vm.expectRevert(selector);
        referralList.batchAddAffiliateOrKolOnBehalfOf(USERs, affiliates, signatures);
    }

    function testBatchAddAffiliateOrKolOnBehalfOfInvalidSignature() public {
        address[] memory affiliates = new address[](3);
        address[] memory USERs = new address[](3);
        bytes[] memory signatures = new bytes[](3);

        // create and allow affiliate1
        address affiliate = makeAddr("affiliate");
        affiliates[0] = affiliate;
        vm.startPrank(AIRDROPPER);
        referralList.allowKOL(affiliate);
        // create and allow affiliate2
        address affiliate2 = makeAddr("affiliate2");
        affiliates[1] = affiliate2;
        referralList.allowKOL(affiliate2);
        // create and allow affiliate3
        address affiliate3 = makeAddr("affiliate3");
        affiliates[2] = affiliate3;
        referralList.allowKOL(affiliate3);

        // create a valid message hash, and valid signature for USERs
        uint32[3] memory users_pk = [0x0213456, 0x052436766, 0x02431657];
        uint256 amountOfIterations = users_pk.length;
        for (uint256 i; i < amountOfIterations; i++) {
            SigUtils.AffiliateTo memory affiliateTo = SigUtils.AffiliateTo({affiliate: affiliates[i]});
            bytes32 msgHash = sigUtils.getTypedDataHash(affiliateTo);
            (uint8 v, bytes32 r, bytes32 s) = vm.sign(users_pk[i], msgHash);
            bytes memory signature = abi.encodePacked(r, s, v);
            USERs[i] = vm.addr(users_pk[i]);
            signatures[i] = signature;
        }

        USERs[0] = makeAddr("kaker");

        // expect to revert with InvalidSignature error
        bytes4 selector = bytes4(keccak256("InvalidSignature()"));
        vm.expectRevert(selector);
        referralList.batchAddAffiliateOrKolOnBehalfOf(USERs, affiliates, signatures);
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

    // Hashes the EIP712 domain separator struct
    function hashDomain(EIP712Domain memory domain) private pure returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version)"),
                keccak256(bytes(domain.name)),
                keccak256(bytes(domain.version))
            )
        );
    }
}
