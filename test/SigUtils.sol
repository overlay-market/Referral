// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract SigUtils {
    bytes32 internal DOMAIN_SEPARATOR;

    constructor(bytes32 _DOMAIN_SEPARATOR) {
        DOMAIN_SEPARATOR = _DOMAIN_SEPARATOR;
    }

    // keccak256(bytes("AffiliateTo(address affiliate)"))
    bytes32 public constant AFFILIATE_TO_TYPEHASH = keccak256(bytes("AffiliateTo(address affiliate)"));

    struct AffiliateTo {
        address affiliate;
    }

    // computes the hash of a permit
    function getStructHash(AffiliateTo memory _affiliateTo) internal pure returns (bytes32) {
        return keccak256(abi.encode(AFFILIATE_TO_TYPEHASH, _affiliateTo.affiliate));
    }

    // computes the hash of the fully encoded EIP-712 message for the domain, which can be used to recover the signer
    function getTypedDataHash(AffiliateTo memory _affiliateTo) public view returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, getStructHash(_affiliateTo)));
    }
}
