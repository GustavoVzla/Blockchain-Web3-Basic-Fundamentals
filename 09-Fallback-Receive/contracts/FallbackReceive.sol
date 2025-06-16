// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

//    Ether sent to Smart Contract
//               |
//        Is msg.data empty?
//          /              \
//         YES              NO
//         /                  \
//  Does receive() exist?    fallback()
//       /          \
//      YES          NO
//      /             \
//    receive()     fallback()

/// @title FallbackReceive - Fundamentals of fallback and receive functions
/// @notice Demonstrates the difference between fallback() and receive() and when each one is executed
/// @dev This contract teaches the decision flow when Ether is sent to a contract
contract FallbackReceive {
    // ───────────────────────────────────────────────
    // 📊 STATE VARIABLES
    // ───────────────────────────────────────────────

    /// @notice Counter of times receive() was executed
    uint256 public receiveCount;

    /// @notice Counter of times fallback() was executed
    uint256 public fallbackCount;

    /// @notice Total Ether received by receive()
    uint256 public etherFromReceive;

    /// @notice Total Ether received by fallback()
    uint256 public etherFromFallback;

    /// @notice Last sender who interacted with the contract
    address public lastSender;

    /// @notice Last data sent to the contract
    bytes public lastData;

    // ───────────────────────────────────────────────
    // 📢 EVENTS
    // ───────────────────────────────────────────────

    /// @notice Event emitted when receive() is executed
    /// @param sender Address that sent the Ether
    /// @param amount Amount of Ether received
    event ReceiveExecuted(address indexed sender, uint256 amount);

    /// @notice Event emitted when fallback() is executed
    /// @param sender Address that sent the transaction
    /// @param amount Amount of Ether received
    /// @param data Data sent with the transaction
    event FallbackExecuted(address indexed sender, uint256 amount, bytes data);

    // ───────────────────────────────────────────────
    // 💰 RECEIVE FUNCTION
    // ───────────────────────────────────────────────

    /// @notice Executed when Ether is sent WITHOUT data (msg.data is empty)
    /// @dev Conditions: msg.data.length == 0 && msg.value > 0
    receive() external payable {
        receiveCount++;
        etherFromReceive += msg.value;
        lastSender = msg.sender;
        lastData = "";

        emit ReceiveExecuted(msg.sender, msg.value);
    }

    // ───────────────────────────────────────────────
    // 🔄 FALLBACK FUNCTION
    // ───────────────────────────────────────────────

    /// @notice Executed when:
    /// 1. Data is sent (msg.data is not empty)
    /// 2. A function that doesn't exist is called
    /// 3. Ether is sent with data and receive() doesn't exist
    /// @dev It's the "catch-all" function of the contract
    fallback() external payable {
        fallbackCount++;
        etherFromFallback += msg.value;
        lastSender = msg.sender;
        lastData = msg.data;

        emit FallbackExecuted(msg.sender, msg.value, msg.data);
    }

    // ───────────────────────────────────────────────
    // 🔍 VIEW FUNCTIONS
    // ───────────────────────────────────────────────

    /// @notice Gets the total balance of the contract
    /// @return The balance in wei
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Gets receive() statistics
    /// @return count Number of times executed
    /// @return totalEther Total Ether received
    function getReceiveStats()
        external
        view
        returns (uint256 count, uint256 totalEther)
    {
        return (receiveCount, etherFromReceive);
    }

    /// @notice Gets fallback() statistics
    /// @return count Number of times executed
    /// @return totalEther Total Ether received
    function getFallbackStats()
        external
        view
        returns (uint256 count, uint256 totalEther)
    {
        return (fallbackCount, etherFromFallback);
    }

    /// @notice Gets information from the last interaction
    /// @return sender Last sender
    /// @return data Last data sent
    function getLastInteraction()
        external
        view
        returns (address sender, bytes memory data)
    {
        return (lastSender, lastData);
    }

    /// @notice Checks if the last data is empty
    /// @return true if lastData is empty
    function isLastDataEmpty() external view returns (bool) {
        return lastData.length == 0;
    }

    // ───────────────────────────────────────────────
    // 🔧 UTILITY FUNCTIONS
    // ───────────────────────────────────────────────

    /// @notice Resets all statistics (for testing only)
    function resetStats() external {
        receiveCount = 0;
        fallbackCount = 0;
        etherFromReceive = 0;
        etherFromFallback = 0;
        lastSender = address(0);
        lastData = "";
    }
}
