// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity 0.8.19;

import {IERC20} from "openzeppelin/token/ERC20/IERC20.sol";
import {MerkleProof} from "openzeppelin/utils/cryptography/MerkleProof.sol";
import {Ownable} from "openzeppelin/access/Ownable.sol";

contract ReferralClaim is Ownable {
    /// @notice ERC20-claimee inclusion root
    bytes32 public merkleRoot;

    /// @notice Contract address of airdropped token
    IERC20 public token;

    /// @notice Timestamp in which the merkle root was updated
    uint256 public lastRewardUpdate;

    /// @notice Timestamp in which `account` last claimed rewards
    mapping(address account => uint256) public lastClaim;

    /// @notice Thrown if address has already claimed
    error AlreadyClaimed();

    /// @notice Thrown if address/amount are not part of Merkle tree
    error NotInMerkle();

    /// @notice Creates a new MerkleClaimERC20 contract
    /// @param _token address of airdropped token
    /// @param _merkleRoot merkle root of claimees
    constructor(bytes32 _merkleRoot, address _token) {
        merkleRoot = _merkleRoot;
        token = IERC20(_token);
    }

    /// @notice Allows claiming tokens if address is part of merkle tree
    /// @param to address of claimee
    /// @param amount of tokens owed to claimee
    /// @param proof merkle proof to prove address and amount are in tree
    function claim(address to, uint256 amount, bytes32[] calldata proof) external onlyOwner {
        if (lastClaim[to] >= lastRewardUpdate) revert AlreadyClaimed();

        bytes32 leaf = keccak256(abi.encodePacked(to, amount));
        bool isValidLeaf = MerkleProof.verifyCalldata(proof, merkleRoot, leaf);
        if (!isValidLeaf) revert NotInMerkle();

        lastClaim[to] = block.timestamp;

        token.transfer(to, amount);
    }

    function setMerkleRoot(bytes32 _merkleRoot, uint256 _lastRewardUpdate) external onlyOwner {
        merkleRoot = _merkleRoot;
        lastRewardUpdate = _lastRewardUpdate;
    }

    function setToken(address _token) external onlyOwner {
        token = IERC20(_token);
    }
}
