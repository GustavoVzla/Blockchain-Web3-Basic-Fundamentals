// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Functions and Modifiers
/// @notice Basic Solidity functions grouped by their related logic and modifiers
/// @author Gustavo

contract ViewPureExamples {
    // ───────────────────────────────────────────────
    // 🔍 VIEW & PURE EXAMPLES
    // ───────────────────────────────────────────────
    uint256 public storedNumber = 10 * 3;

    function getName() public pure returns (string memory) {
        return "Gustavo";
    }

    uint256 private constant z = 100;

    function getNumber() public pure returns (uint256) {
        return z * 2;
    }

    function readNumber() public view returns (uint256) {
        return storedNumber;
    }
}
