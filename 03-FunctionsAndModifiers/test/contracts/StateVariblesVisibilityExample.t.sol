// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {StateVariblesVisibilityExample} from "../../contracts/02-StateVariblesVisibilityExample.sol";

contract StateVariblesVisibilityExampleTest is Test {
    StateVariblesVisibilityExample stateVars;

    function setUp() public {
        stateVars = new StateVariblesVisibilityExample();
    }

    function test_InitialValues() public view {
        assertEq(stateVars.storedNumber(), 0);
        assertEq(stateVars.storedName(), "");
        assertEq(stateVars.isReady(), false);
    }

    function test_SetPublicNumber() public {
        stateVars.setPublicNumber(42);
        assertEq(stateVars.storedNumber(), 42);
    }

    function test_SetInternalName() public {
        stateVars.setInternalName("Test Name");
        assertEq(stateVars.storedName(), "Test Name");
    }

    function test_ToggleReadyPrivate() public {
        bool initialState = stateVars.isReady();
        stateVars.toggleReadyPrivate();
        assertEq(stateVars.isReady(), !initialState);
    }

    function test_UsePrivateToggle() public {
        bool initialState = stateVars.isReady();
        stateVars.usePrivateToggle();
        assertEq(stateVars.isReady(), !initialState);
    }

    function test_SetNumberExternal() public {
        stateVars.setNumberExternal(100);
        assertEq(stateVars.storedNumber(), 100);
    }
}