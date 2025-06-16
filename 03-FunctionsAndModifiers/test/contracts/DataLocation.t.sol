// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {DataLocation} from "../../contracts/06-DataLocation.sol";

contract DataLocationTest is Test {
    DataLocation dataLoc;

    function setUp() public {
        dataLoc = new DataLocation();
    }

    function test_GetGreeting() public view {
        string memory input = "Hello";
        string memory output = dataLoc.getGreeting(input);
        assertEq(output, input);
    }

    function test_EchoCalldata() public view {
        string memory input = "Test Calldata";
        string memory output = dataLoc.echoCalldata(input);
        assertEq(output, input);
    }

    function test_StorageArray() public {
        // Initial length should be 0
        assertEq(dataLoc.getArrayLength(), 0);
        
        // Modify array
        dataLoc.modifyStorageArray();
        
        // Length should be 1
        assertEq(dataLoc.getArrayLength(), 1);
        
        // Check element
        assertEq(dataLoc.storageArray(0), "Updated");
        
        // Clear array
        dataLoc.clearStorageArray();
        
        // Length should be 0 again
        assertEq(dataLoc.getArrayLength(), 0);
    }

    function test_MultipleModifications() public {
        // Add multiple elements
        dataLoc.modifyStorageArray();
        dataLoc.modifyStorageArray();
        dataLoc.modifyStorageArray();
        
        // Length should be 3
        assertEq(dataLoc.getArrayLength(), 3);
        
        // All elements should be "Updated"
        assertEq(dataLoc.storageArray(0), "Updated");
        assertEq(dataLoc.storageArray(1), "Updated");
        assertEq(dataLoc.storageArray(2), "Updated");
    }
}