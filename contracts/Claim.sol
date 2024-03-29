// SPDX-License-Identifier: BUSL-1.1

/**
 * Created on 2023-05-24 01:00
 * @Summary A smart contract that let users claim referral rewards
 * @title Claim
 * @author: Overlay - c-n-o-t-e & tomascimach
 */

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@divergencetech/ethier/contracts/crypto/SignerManager.sol";
import "@divergencetech/ethier/contracts/crypto/SignatureChecker.sol";


error Claim_Exceeded_Daily_Claiming_Limit();
error Claim_Contract_Does_Not_Have_Enough_Tokens();

contract Claim is Pausable, ReentrancyGuard, SignerManager {
    using SignatureChecker for EnumerableSet.AddressSet;
    using SafeERC20 for IERC20;

    mapping(bytes32 => bool) private usedMessages;

    IERC20 public token;

    uint256 public maxDailyClaim;
    uint256 private totalDailyClaimed;
    uint256 private lastResetTimestamp;

    event TokensClaimed(address indexed recipient, uint256 amount);
    event TokensWithdrawn(address indexed recipient, uint256 amount);
    event MaxDailyClaimUpdated(uint256 newMaxDailyClaim);

    constructor(address _tokenAddress, uint256 _maxDailyClaim) {
        token = IERC20(_tokenAddress);
        lastResetTimestamp = block.timestamp;
        maxDailyClaim = _maxDailyClaim;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setMaxDailyClaim(uint256 _maxDailyClaim) external onlyOwner {
        maxDailyClaim = _maxDailyClaim;
        emit MaxDailyClaimUpdated(_maxDailyClaim);
    }

    function claimToken(
        bytes32 _nonce,
        bytes memory _data,
        bytes calldata _signature
    ) external nonReentrant whenNotPaused {
        uint256 currentTimestamp = block.timestamp;

        // Check if 24 hours have passed since the last reset
        if (lastResetTimestamp + 24 hours < currentTimestamp) {
            // Reset the total daily withdrawal amount
            totalDailyClaimed = 0;
            lastResetTimestamp = currentTimestamp;
        }

        // Verify the signature
        signers.requireValidSignature(
            abi.encodePacked(_data, _nonce),
            _signature,
            usedMessages
        );

        (uint256 amount, address recipient) = abi.decode(
            _data,
            (uint256, address)
        );

        if (totalDailyClaimed + amount > maxDailyClaim)
            revert Claim_Exceeded_Daily_Claiming_Limit();

        if (token.balanceOf(address(this)) < amount)
            revert Claim_Contract_Does_Not_Have_Enough_Tokens();

        totalDailyClaimed += amount;

        emit TokensClaimed(recipient, amount);

        token.safeTransfer(recipient, amount);
    }

    function withdrawToken(
        address _recipient,
        uint256 _amount
    ) external onlyOwner {
        if (token.balanceOf(address(this)) < _amount)
            revert Claim_Contract_Does_Not_Have_Enough_Tokens();

        emit TokensWithdrawn(_recipient, _amount);

        token.safeTransfer(_recipient, _amount);
    }
}
