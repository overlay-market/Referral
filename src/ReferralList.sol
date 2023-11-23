// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {OwnableRoles} from "solady/src/auth/OwnableRoles.sol";
import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";

contract ReferralList is OwnableRoles, Initializable, UUPSUpgradeable {
    error ReferredAlreadyExists();
    error ReferrerNotAllowed();

    uint256 public constant ROLE_AIRDROPPER = uint256(keccak256("ROLE_AIRDROPPER"));

    mapping(address trader => address affiliate) public referrals;
    mapping(address affiliate => bool isAllowed) public allowedAffiliates;

    constructor() {
        _disableInitializers();
    }

    function initialize(address _airdropper) public initializer {
        _initializeOwner(msg.sender);
        grantRoles(_airdropper, ROLE_AIRDROPPER);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function addReferrer(address _referrer) public {
        if (!allowedAffiliates[_referrer]) revert ReferrerNotAllowed();
        referrals[msg.sender] = _referrer;
    }

    function addAllowedReferrer(address _referrer) public onlyOwner {
        if (allowedAffiliates[_referrer]) revert ReferredAlreadyExists();
        allowedAffiliates[_referrer] = true;
    }

    function airdropERC20(
        address _token,
        address[] calldata _addresses,
        uint256[] calldata _amounts,
        uint256 _totalAmount
    ) external payable onlyRoles(ROLE_AIRDROPPER) {
        assembly {
            // Check that the number of addresses matches the number of amounts
            if iszero(eq(_amounts.length, _addresses.length)) { revert(0, 0) }

            // transferFrom(address from, address to, uint256 amount)
            mstore(0x00, hex"23b872dd")
            // from address
            mstore(0x04, caller())
            // to address (this contract)
            mstore(0x24, address())
            // total amount
            mstore(0x44, _totalAmount)

            // transfer total amount to this contract
            if iszero(call(gas(), _token, 0, 0x00, 0x64, 0, 0)) { revert(0, 0) }

            // transfer(address to, uint256 value)
            mstore(0x00, hex"a9059cbb")

            // end of array
            let end := add(_addresses.offset, shl(5, _addresses.length))
            // diff = _addresses.offset - _amounts.offset
            let diff := sub(_addresses.offset, _amounts.offset)

            // Loop through the addresses
            for { let addressOffset := _addresses.offset } 1 {} {
                // to address
                mstore(0x04, calldataload(addressOffset))
                // amount
                mstore(0x24, calldataload(sub(addressOffset, diff)))
                // transfer the tokens
                if iszero(call(gas(), _token, 0, 0x00, 0x64, 0, 0)) { revert(0, 0) }
                // increment the address offset
                addressOffset := add(addressOffset, 0x20)
                // if addressOffset >= end, break
                if iszero(lt(addressOffset, end)) { break }
            }
        }
    }
}
