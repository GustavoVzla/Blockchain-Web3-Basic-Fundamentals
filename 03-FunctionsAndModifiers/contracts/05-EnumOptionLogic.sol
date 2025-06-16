// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Functions and Modifiers
/// @notice Basic Solidity functions grouped by their related logic and modifiers

contract EnumOptionLogic {
    // ───────────────────────────────────────────────
    // 🎚️ ENUM: Option + Logic
    // ───────────────────────────────────────────────

    enum Option {
        ON,
        OFF
    }

    Option public currentState = Option.OFF;

    function turnOn() public {
        currentState = Option.ON;
    }

    function turnOff() public {
        currentState = Option.OFF;
    }

    function getCurrentState() public view returns (Option) {
        return currentState;
    }
}
