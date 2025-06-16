// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Functions and Modifiers
/// @notice Basic Solidity functions grouped by their related logic and modifiers
/// @author Gustavo

contract StateVariblesVisibilityExample {
    // ───────────────────────────────────────────────
    // 📍 STATE VARIABLES + VISIBILITY EXAMPLES
    // ───────────────────────────────────────────────

    uint256 public storedNumber;
    string public storedName;
    bool public isReady; // private visibility by default

    function setPublicNumber(uint256 _value) public {
        storedNumber = _value;
    }

    function setInternalName(string memory _name) public {
        // internal functions can only be called by other functions within the contract
        storedName = _name;
    }

    function toggleReadyPrivate() public {
        // private functions can only be called by other functions within the contract
        isReady = !isReady;
    }

    function usePrivateToggle() public {
        toggleReadyPrivate();
    }

    function setNumberExternal(uint256 _value) public {
        // external functions can be called by other contracts
        storedNumber = _value;
    }
}
