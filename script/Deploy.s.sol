// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/Test.sol";
import {ReferralList} from "src/ReferralList.sol";
import {ReferralListProxy} from "src/ProxyWrapper.sol";

abstract contract DeployReferralList is Script {
    function _deploy() internal returns (address proxyAddress) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner_ = vm.addr(deployerPrivateKey); // Auto-derive owner from private key
        address _airdropper = vm.envAddress("AIRDROPPER_ADDRESS");
        address _rewardToken = vm.envAddress("OV_CONTRACT");
        address _verifyingAddress = vm.envAddress("VERIFIER_ADDRESS");

        /*Proxy initialize data*/
        string memory functionName = "initialize(address,address,address,address)";
        bytes memory data = abi.encodeWithSignature(functionName, owner_, _airdropper, _rewardToken, _verifyingAddress);

        vm.startBroadcast(deployerPrivateKey);
        ReferralList impl = new ReferralList();
        ReferralListProxy proxy = new ReferralListProxy(address(impl), data);
        proxyAddress = address(proxy);

        vm.stopBroadcast();
        
        console2.log("Implementation deployed at:", address(impl));
        console2.log("Proxy deployed at:", proxyAddress);
        console2.log("Initial owner (deployer):", owner_);
    }
}

contract Deploy is DeployReferralList {
    function run() external {
        address proxyAddress = _deploy();
        
        // Transfer ownership to Safe if SAFE_ADDRESS is set
        address safeAddress = vm.envOr("SAFE_ADDRESS", address(0));
        if (safeAddress != address(0)) {
            uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
            
            console2.log("Transferring ownership to Safe:", safeAddress);
            
            vm.startBroadcast(deployerPrivateKey);
            ReferralList(proxyAddress).transferOwnership(safeAddress);
            vm.stopBroadcast();
            
            console2.log("Ownership transferred to Safe:", safeAddress);
        } else {
            console2.log("SAFE_ADDRESS not set, skipping ownership transfer");
        }
    }
}

/* If it doesn't verify automatically, run:
forge verify-contract \
    --chain-id 421614 \
    --num-of-optimizations 200 \
    --watch \
    --etherscan-api-key <api> \
    --compiler-version v0.8.19 \
    0xe0fd9b1a8e56bdb98f96a7a02182070cda0b778c \
    src/ReferralList.sol:ReferralList \

*/

/*
 To verify on Berachain use
 forge verify-contract 0xD7775619FD40CfF4C13076A0DA7fD8D2ab44A30f src/ReferralList.sol:ReferralList 
     --verifier-url 'https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api/' 
     --etherscan-api-key "verifyContract" 
     --num-of-optimizations 20
*/
