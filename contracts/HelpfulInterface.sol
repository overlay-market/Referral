// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface HelpfulInterface {
    function build(uint256 collateral,
        uint256 leverage,
        bool isLong,
        uint256 priceLimit) external;

    function factory() external view returns (address);
    function params(uint256 idx) external view returns (uint256);

     function approve(address spender, uint256 amount) external returns (bool);

     function notional(address _address, address sender, uint id) external view returns (uint);
     function transfer(address recipient, uint256 amount) external returns (bool);
}