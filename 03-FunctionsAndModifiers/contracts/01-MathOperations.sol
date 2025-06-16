// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Functions and Modifiers
/// @notice Basic Solidity functions grouped by their related logic and modifiers
/// @author Gustavo

contract MathOperations {
    // ───────────────────────────────────────────────
    // ➗ MATH OPERATIONS
    // ───────────────────────────────────────────────

    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }

    function subtract(uint a, uint b) public pure returns (uint) {
        return a - b;
    }

    function multiply(uint a, uint b) public pure returns (uint) {
        return a * b;
    }

    function divide(uint a, uint b) public pure returns (uint) {
        return a / b;
    }

    function power(uint a, uint b) public pure returns (uint) {
        return a ** b;
    }

    function modulo(uint a, uint b) public pure returns (uint) {
        return a % b;
    }

    function _addmod(uint x, uint y, uint k) public pure returns (uint, uint) {
        return (addmod(x, y, k), (x + y) % k);
    }

    function _mulmod(uint x, uint y, uint k) public pure returns (uint, uint) {
        return (mulmod(x, y, k), (x * y) % k);
    }
}
