// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {Modifier} from "../../contracts/Modifier.sol";

contract ModifierTest is Test {
    Modifier public modifier_contract;
    address public owner;
    address public user;

    function setUp() public {
        owner = address(this);
        user = address(0x123);
        modifier_contract = new Modifier();
    }

    function test_InitialState() public view {
        assertEq(modifier_contract.number(), 0);
        assertEq(modifier_contract.owner(), owner);
        assertFalse(modifier_contract.isReady());
    }

    function test_ValidNumber() public {
        // Valid number (1-100)
        modifier_contract.setNumber(50);
        assertEq(modifier_contract.getNumber(), 50, "Should set valid number");
    }

    function test_InvalidNumberZero() public {
        vm.expectRevert("Number must be between 1 and 100");
        modifier_contract.setNumber(0);
    }

    function test_InvalidNumberOver100() public {
        vm.expectRevert("Number must be between 1 and 100");
        modifier_contract.setNumber(101);
    }

    function test_OnlyOwnerCanActivate() public {
        // Owner can activate
        modifier_contract.activate();
        assertTrue(modifier_contract.isReady(), "Contract should be activated");
    }

    function test_OnlyOwnerModifier_RevertOnNonOwner() public {
        vm.prank(user);
        vm.expectRevert("Only owner can call this");
        modifier_contract.makeReady();
    }

    function test_WhenReadyModifier() public {
        // First activate the contract
        modifier_contract.activate();
        
        // Now can use function with whenReady
        modifier_contract.doSomethingWhenReady();
        // If we reach here, the function executed successfully
        assertTrue(true, "Function with whenReady modifier executed");
    }

    function test_WhenReadyModifierFails() public {
        // Don't activate contract first
        vm.expectRevert("Contract is not ready");
        modifier_contract.doSomethingWhenReady();
    }

    function test_MultipleModifiers() public {
        // Activate contract first
        modifier_contract.activate();
        
        // Test function with multiple modifiers
        modifier_contract.restrictedFunction(50);
        assertTrue(true, "Function with multiple modifiers executed");
    }
}
