// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {EnumOptionLogic} from "../../contracts/05-EnumOptionLogic.sol";

contract EnumOptionLogicTest is Test {
    EnumOptionLogic enumOption;

    function setUp() public {
        enumOption = new EnumOptionLogic();
    }

    function test_InitialState() public view {
        // Initial state should be OFF (1)
        assertEq(uint(enumOption.currentState()), 1);
    }

    function test_TurnOn() public {
        enumOption.turnOn();
        // ON is 0
        assertEq(uint(enumOption.currentState()), 0);
    }

    function test_TurnOff() public {
        // First turn on
        enumOption.turnOn();
        assertEq(uint(enumOption.currentState()), 0);
        
        // Then turn off
        enumOption.turnOff();
        // OFF is 1
        assertEq(uint(enumOption.currentState()), 1);
    }

    function test_GetCurrentState() public {
        EnumOptionLogic.Option state = enumOption.getCurrentState();
        // Initial state should be OFF (1)
        assertEq(uint(state), 1);
        
        enumOption.turnOn();
        state = enumOption.getCurrentState();
        // ON is 0
        assertEq(uint(state), 0);
    }
}