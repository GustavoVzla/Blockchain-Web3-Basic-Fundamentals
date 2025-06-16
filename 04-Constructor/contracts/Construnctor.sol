// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Constructor Examples
/// @notice Demonstrates different use cases of constructors in Solidity

// ─────────────────────────────────────────────────────
// 🧱 1. Basic Constructor (Initialization on deployment)
// ─────────────────────────────────────────────────────

contract BasicConstructor {
    string public name;

    /// @notice Initializes the contract with a name
    /// @param _name The name to store
    constructor(string memory _name) {
        name = _name;
    }
}

// ─────────────────────────────────────────────────────
// 👤 2. Owner Initialization (msg.sender as deployer)
// ─────────────────────────────────────────────────────

contract OwnerConstructor {
    address public owner;

    /// @notice Sets the deployer as the contract owner
    constructor() {
        owner = msg.sender;
    }

    /// @notice Returns true if the caller is the owner
    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }
}

// ─────────────────────────────────────────────────────
// 🛠️ 3. Immutable Variable Initialization
// ─────────────────────────────────────────────────────

contract ImmutableConstructor {
    address public immutable creator;
    uint256 public immutable initialValue;

    /// @notice Initializes immutable variables once at deployment
    /// @param _value A numeric value to store permanently
    constructor(uint256 _value) {
        creator = msg.sender;
        initialValue = _value;
    }
}
