// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Functions and Modifiers
/// @notice Basic Solidity functions grouped by their related logic and modifiers

// ───────────────────────────────────────────────
// 🔧 VIRTUAL-OVERRIDE for Inheritance
// ───────────────────────────────────────────────

contract VirtualInheritance {
    function greet() public pure virtual returns (string memory) {
        return "Hello from the base contract";
    }
}

/// @title ChildFunctions - Demonstrates override usage
contract ChildFunctions is VirtualInheritance {
    function greet() public pure override returns (string memory) {
        return "Hello from the child contract";
    }
}
