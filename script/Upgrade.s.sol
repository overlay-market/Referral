// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {ReferralList} from "src/ReferralList.sol";

abstract contract Upgrade is Script {
    function _deploy() internal {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        ReferralList proxy = ReferralList(vm.envAddress("PROXY_ADDRESS"));

        vm.startBroadcast(deployerPrivateKey);
        proxy.upgradeTo(address(new ReferralList()));
        vm.stopBroadcast();
    }
}

contract UpgradeImplementation is Upgrade {
    function run() external {
        _deploy();
    }
}
