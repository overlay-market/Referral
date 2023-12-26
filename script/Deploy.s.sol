// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/Test.sol";
import {ReferralList} from "src/ReferralList.sol";
import {ReferralListProxy} from "src/ProxyWrapper.sol";

abstract contract DeployReferralList is Script {
    function _deploy() internal {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner_ = vm.envAddress("OWNER_ADDRESS");
        address _airdropper = vm.envAddress("AIRDROPPER_ADDRESS");
        address _rewardToken = vm.envAddress("OV_CONTRACT");
        address _verifyingAddress = vm.envAddress("VERIFIER_ADDRESS");

        /*Proxy initialize data*/
        string memory functionName = "initialize(address,address,address,address)";
        bytes memory data = abi.encodeWithSignature(functionName, owner_, _airdropper, _rewardToken, _verifyingAddress);

        vm.startBroadcast(deployerPrivateKey);
        ReferralList impl = new ReferralList();
        new ReferralListProxy(address(impl), data);

        vm.stopBroadcast();
    }
}

contract Deploy is DeployReferralList {
    function run() external {
        _deploy();
    }
}

/* If it doesn't verify automatically, run:
forge verify-contract \
    --chain-id 421614 \
    --num-of-optimizations 200 \
    --watch \
    --etherscan-api-key <api> \
    --compiler-version v0.8.23 \
    0xd1d872536A44A3b6af72238fd04822B1C8C38386 \
    src/ReferralList.sol:ReferralList \

*/
