// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {FallbackReceive} from "../../contracts/FallbackReceive.sol";

contract FallbackReceiveTest is Test {
    FallbackReceive public contractInstance;

    function setUp() public {
        contractInstance = new FallbackReceive();
    }

    function testReceiveEther() public {
        // Test receiving Ether via the receive function
        uint256 initialBalance = address(contractInstance).balance;
        (bool success, ) = address(contractInstance).call{value: 1 ether}("");

        assertTrue(success, "Ether reception failed");
        assertEq(
            address(contractInstance).balance,
            initialBalance + 1 ether,
            "Contract balance incorrect"
        );
        assertEq(
            contractInstance.receiveCount(),
            1,
            "Receive count should be 1"
        );
    }

    function testFallbackWithData() public {
        // Test fallback function with data
        uint256 initialBalance = address(contractInstance).balance;
        (bool success, ) = address(contractInstance).call{value: 0.5 ether}(
            "0x12345678"
        );

        assertTrue(success, "Fallback call failed");
        assertEq(
            address(contractInstance).balance,
            initialBalance + 0.5 ether,
            "Contract balance incorrect"
        );
        assertEq(
            contractInstance.fallbackCount(),
            1,
            "Fallback count should be 1"
        );
    }

    function testGetContractBalance() public {
        // Fund the contract and test balance getter
        (bool success, ) = address(contractInstance).call{value: 2 ether}("");
        assertTrue(success, "Funding failed");

        assertEq(
            contractInstance.getContractBalance(),
            2 ether,
            "getContractBalance returned incorrect value"
        );
    }

    function testResetStats() public {
        // Test statistics reset functionality
        (bool success, ) = address(contractInstance).call{value: 1 ether}("");
        assertTrue(success, "Funding failed");

        contractInstance.resetStats();

        assertEq(
            contractInstance.receiveCount(),
            0,
            "Receive count should be reset to 0"
        );
        assertEq(
            contractInstance.fallbackCount(),
            0,
            "Fallback count should be reset to 0"
        );
    }

    function testGetStats() public {
        // Test statistics getters
        (bool success, ) = address(contractInstance).call{value: 1 ether}("");
        assertTrue(success, "Receive call failed");

        (uint256 receiveCount, uint256 etherFromReceive) = contractInstance
            .getReceiveStats();
        assertEq(receiveCount, 1, "Receive count incorrect");
        assertEq(etherFromReceive, 1 ether, "Ether from receive incorrect");
    }
}
