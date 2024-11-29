// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/Test.sol";
import {ReferralList} from "src/ReferralList.sol";
import {ReferralListProxy} from "src/ProxyWrapper.sol";
import {ECDSA} from "solady/src/utils/ECDSA.sol";

contract ReferralListCalls is Script {
    using ECDSA for bytes32;

    uint256 verifierPrivateKey;
    uint256 affiliatePrivateKey;
    address affiliate;
    address contractAddress;
    ReferralList referralList;

    function setUp() public {
        verifierPrivateKey = vm.envUint("PRIVATE_KEY");
        affiliatePrivateKey = vm.envUint("AFFILIATE_PRIVATE_KEY");
        affiliate = vm.addr(affiliatePrivateKey);
        contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        referralList = ReferralList(contractAddress);
    }

    function run() external {
        setUp();

        // Uncomment the function you want to run
        // constructSignatureAndAllowAffiliate();
        // allowKOL();
        // claimRewards();
    }

    function constructSignatureAndAllowAffiliate() internal {
        bytes32 messageHash = keccak256(abi.encodePacked(affiliate, contractAddress, block.chainid));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(verifierPrivateKey, ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.startBroadcast(affiliatePrivateKey);
        referralList.allowAffiliate(signature);
        vm.stopBroadcast();
    }

    function allowKOL() internal {
        vm.startBroadcast(verifierPrivateKey);
        referralList.allowKOL(affiliate);
        vm.stopBroadcast();
    }

    function claimRewards() internal {
        address recipient = vm.envAddress("RECIPIENT_ADDRESS");
        uint256 amount = vm.envUint("CLAIM_AMOUNT");
        bytes32[] memory proof = loadMerkleProof();

        vm.startBroadcast(affiliatePrivateKey);
        referralList.claimRewards(recipient, amount, proof);
        vm.stopBroadcast();
    }

    function loadMerkleProof() internal view returns (bytes32[] memory) {
        string memory proofJson = vm.envString("MERKLE_PROOF");
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = bytes32(bytes(proofJson));
        return proof;
    }
}
