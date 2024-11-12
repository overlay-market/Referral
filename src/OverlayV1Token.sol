// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "openzeppelin/token/ERC20/ERC20.sol";
import "openzeppelin/access/AccessControlEnumerable.sol";
import "openzeppelin/token/ERC20/IERC20.sol";
import "openzeppelin/access/IAccessControlEnumerable.sol";

bytes32 constant MINTER_ROLE = keccak256("MINTER");
bytes32 constant BURNER_ROLE = keccak256("BURNER");
bytes32 constant GOVERNOR_ROLE = keccak256("GOVERNOR");
bytes32 constant GUARDIAN_ROLE = keccak256("GUARDIAN");

interface IOverlayV1Token is IAccessControlEnumerable, IERC20 {
    function mint(address _recipient, uint256 _amount) external;

    function burn(uint256 _amount) external;
}

contract OverlayV1Token is IOverlayV1Token, AccessControlEnumerable, ERC20("Overlay", "OVL") {
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "ERC20: !minter");
        _;
    }

    modifier onlyBurner() {
        require(hasRole(BURNER_ROLE, msg.sender), "ERC20: !burner");
        _;
    }

    function mint(address _recipient, uint256 _amount) external onlyMinter {
        _mint(_recipient, _amount);
    }

    function burn(uint256 _amount) external onlyBurner {
        _burn(msg.sender, _amount);
    }
}
