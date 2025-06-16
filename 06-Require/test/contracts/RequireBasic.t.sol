// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {RequireBasic} from "../../contracts/RequireBasic.sol";

contract RequireBasicTest is Test {
    RequireBasic public requireBasic;

    function setUp() public {
        requireBasic = new RequireBasic();
    }

    function test_InitialState() public view {
        assertEq(requireBasic.age(), 0);
        assertEq(requireBasic.name(), "");
    }

    function test_SetValidAge() public {
        requireBasic.setAge(25);
        assertEq(requireBasic.age(), 25);
    }

    function test_SetAge_RevertIfInvalid() public {
        vm.expectRevert("Age must be between 1 and 120");
        requireBasic.setAge(0);
        
        vm.expectRevert("Age must be between 1 and 120");
        requireBasic.setAge(121);
    }

    function test_SetValidName() public {
        requireBasic.setName("Alice");
        assertEq(requireBasic.name(), "Alice");
    }

    function test_SetName_RevertIfEmpty() public {
        vm.expectRevert("Name cannot be empty");
        requireBasic.setName("");
    }

    function test_IsAdult() public {
        requireBasic.setAge(18);
        assertTrue(requireBasic.isAdult());
        
        requireBasic.setAge(17);
        assertFalse(requireBasic.isAdult());
    }
}