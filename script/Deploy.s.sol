// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
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
