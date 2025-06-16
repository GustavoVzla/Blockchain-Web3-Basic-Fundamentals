// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {EventEmitter} from "../../contracts/EventEmitter.sol";

contract EventEmitterTest is Test {
    EventEmitter public eventEmitter;

    // ──────────────── 🧪 SETUP: Deploy contract before each test ────────────────
    function setUp() public {
        eventEmitter = new EventEmitter();
    }

    // ──────────────── 💰 TEST: deposit() should emit Deposit event ────────────────
    function test_Deposit_ShouldEmitDepositEvent() public {
        vm.expectEmit(true, false, false, true); // indexed, non-indexed, strict, topic filter
        emit EventEmitter.Deposit(address(this), 1 ether);

        eventEmitter.deposit{value: 1 ether}();

        assertEq(
            address(eventEmitter).balance,
            1 ether,
            "Contract balance should be 1 ether"
        );
    }

    // ──────────────── 🔄 TEST: updateValue() should emit ValueUpdated ────────────────
    function test_UpdateValue_ShouldEmitValueUpdatedEvent() public {
        vm.expectEmit(true, true, false, true);
        emit EventEmitter.ValueUpdated(0, 100);

        eventEmitter.updateValue(100);

        assertEq(
            eventEmitter.getStoredValue(),
            100,
            "Stored value should be updated to 100"
        );
    }

    // ──────────────── 👤 TEST: registerUser() should emit UserRegistered ────────────────
    function test_RegisterUser_ShouldEmitUserRegisteredEvent() public {
        string memory name = "Gustavo";

        vm.expectEmit(true, false, false, true);
        emit EventEmitter.UserRegistered(address(this), name);

        eventEmitter.registerUser(name);

        // No need for assert unless we store the user
    }
}
