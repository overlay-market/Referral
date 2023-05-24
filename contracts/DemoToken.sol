// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract DemoToken is AccessControlEnumerable, ERC20("Demo", "DD") {
    constructor() {
        _mint(msg.sender, 1000000000000000000000);
    }
}
