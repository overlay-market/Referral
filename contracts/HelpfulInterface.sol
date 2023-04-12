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

     event Build(
        address indexed sender, // address that initiated build (owns position)
        uint256 positionId, // id of built position
        uint256 oi, // oi of position at build
        uint256 debt, // debt of position at build
        bool isLong, // whether is long or short
        uint256 price // entry price
    );
}