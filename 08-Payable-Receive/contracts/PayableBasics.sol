// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title PayableBasics - Payable functions fundamentals
/// @notice Introduces basic concepts: payable constructor, receive, sendEther
/// @dev This contract teaches fundamental concepts for receiving Ether
contract PayableBasics {
    // ───────────────────────────────────────────────
    // 📊 STATE VARIABLES
    // ───────────────────────────────────────────────

    /// @notice Total amount of Ether received by the contract
    uint256 public totalReceived;

    // ───────────────────────────────────────────────
    // 📢 EVENTS
    // ───────────────────────────────────────────────

    /// @notice Event emitted when the contract receives Ether
    /// @param sender Address that sent the Ether
    /// @param amount Amount of Ether received in wei
    event EtherReceived(address sender, uint256 amount);

    // ───────────────────────────────────────────────
    // 🏗️ CONSTRUCTOR
    // ───────────────────────────────────────────────

    /// @notice Constructor that allows the contract to receive Ether during deployment
    /// @dev If Ether is sent during deployment, totalReceived is updated
    constructor() payable {
        if (msg.value > 0) {
            totalReceived += msg.value;
            emit EtherReceived(msg.sender, msg.value);
        }
    }

    // ───────────────────────────────────────────────
    // 💰 RECEIVE FUNCTION
    // ───────────────────────────────────────────────

    /// @notice Fallback function to receive Ether when no data is sent
    /// @dev Automatically executed when someone sends Ether without data
    receive() external payable {
        totalReceived += msg.value;
        emit EtherReceived(msg.sender, msg.value);
    }

    // ───────────────────────────────────────────────
    // 📥 ETHER RECEIVING FUNCTIONS
    // ───────────────────────────────────────────────

    /// @notice Explicit function to send Ether to this contract
    /// @dev Updates totalReceived and emits event
    function sendEther() external payable {
        require(msg.value > 0, "Must send some Ether");

        totalReceived += msg.value;
        emit EtherReceived(msg.sender, msg.value);
    }

    // ───────────────────────────────────────────────
    // 🔍 VIEW FUNCTIONS
    // ───────────────────────────────────────────────

    /// @notice Gets the current balance of this contract
    /// @return The balance in wei
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Gets the total amount of Ether received by this contract
    /// @return The total received in wei
    function getTotalReceived() external view returns (uint256) {
        return totalReceived;
    }
}
