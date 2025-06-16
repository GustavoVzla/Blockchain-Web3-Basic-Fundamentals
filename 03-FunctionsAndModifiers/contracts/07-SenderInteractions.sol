// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Functions and Modifiers
/// @notice Basic Solidity functions grouped by their related logic and modifiers

contract SenderInteractions {
    // ───────────────────────────────────────────────
    // 👤 msg.sender Interactions
    // ───────────────────────────────────────────────
    address public lastSender;

    function whoAmI() public view returns (address) {
        return msg.sender;
    }

    function updateLastSender() public {
        lastSender = msg.sender;
    }
}
