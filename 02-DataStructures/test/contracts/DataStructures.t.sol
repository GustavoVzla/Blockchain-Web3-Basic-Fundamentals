// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {DataStructures} from "../../contracts/DataStructures.sol";

contract DataStructuresTest is Test {
    DataStructures ds;

    function setUp() public {
        ds = new DataStructures();
    }

    function test_Structs_Book1() public view {
        (string memory title, string memory author, uint256 year) = ds.book1();

        assertEq(title, "1984");
        assertEq(author, "George Orwell");
        assertEq(year, 1949);
    }

    function test_Enums_Status() public view {
        assertEq(uint(ds.userStatus()), 0); // Pending
        assertEq(uint(ds.itemStatus()), 1); // Active
        assertEq(uint(ds.paymentStatus()), 2); // Inactive
    }

    function test_Enum_OptionDefault() public view {
        assertEq(uint(ds.currentState()), 0); // ON by default
    }

    function test_Arrays_Fixed() public view {
        // The contract returns only 1 element per call
        assertEq(ds.fixedUintList(0), 1);
        assertEq(ds.fixedUintList(1), 2);
        assertEq(ds.fixedUintList(2), 3);
        assertEq(ds.fixedUintList(3), 4);
        assertEq(ds.fixedUintList(4), 5);

        assertEq(ds.fixedArray(0), 10);
        assertEq(ds.fixedArray(1), 20);
        assertEq(ds.fixedArray(2), 30);
    }
}
