// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Functions and Modifiers
/// @notice Basic Solidity functions grouped by their related logic and modifiers

contract DataLocation {
    // ───────────────────────────────────────────────
    // 🧠 DATA LOCATION: memory, storage, calldata
    // ───────────────────────────────────────────────

    function getGreeting(
        string memory name
    ) public pure returns (string memory) {
        return name;
    }

    function echoCalldata(
        string calldata input
    ) external pure returns (string calldata) {
        return input;
    }

    string[] public storageArray;

    function modifyStorageArray() public {
        string[] storage ref = storageArray;
        ref.push("Updated");
    }

    function clearStorageArray() public {
        delete storageArray;
    }

    function getArrayLength() public view returns (uint256) {
        return storageArray.length;
    }
}
