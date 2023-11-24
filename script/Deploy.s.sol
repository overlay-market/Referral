// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/Test.sol";
import {ReferralList} from "src/ReferralList.sol";
import {ReferralListProxy} from "src/ProxyWrapper.sol";

abstract contract DeployReferralList is Script {
    function _deploy() internal {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address _airdropper = vm.envAddress("AIRDROPPER_ADDRESS");
        address _rewardToken = vm.envAddress("OV_CONTRACT");
        uint48 _affiliateComission = uint48(vm.envUint("AFFILIATE_COMMISION"));
        uint48 _traderDiscount = uint48(vm.envUint("TRADER_COMMISION"));

        /*Proxy initialize data*/
        string memory functionName = "initialize(address,address,uint48,uint48)";
        bytes memory data =
            abi.encodeWithSignature(functionName, _airdropper, _rewardToken, _affiliateComission, _traderDiscount);

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
    --constructor-args $(cast abi-encode "constructor(address,bytes)" 0x4316E319944E6880145Ca8c1B3A71528903cf963 0x2dd504510000000000000000000000009c3c9283d3e44854697cd22d3faa240cfb0328890000000000000000000000004305c4bc521b052f17d389c2fe9d37cabeb70d5400000000000000000000000000000000000000000000000000000000000186a000000000000000000000000000000000000000000000000000000000000186a0) \
    --compiler-version v0.8.23 \
    0x426cB483cad253aa7E514c6C2B76a3c215d9065b \
    src/ProxyWrapper.sol:ReferralListProxy \

*/
