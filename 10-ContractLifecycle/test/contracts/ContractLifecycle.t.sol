// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {ContractLifecycle} from "../../contracts/ContractLifecycle.sol";

contract ContractLifecycleTest is Test {
    ContractLifecycle public contractLifecycle;
    address public owner;
    address public user1;
    address public user2;

    // Events to test
    event UserRegistered(address indexed user, string name);
    event DepositReceived(address indexed from, uint256 amount);
    event StatusChanged(ContractLifecycle.Status newStatus);

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        contractLifecycle = new ContractLifecycle("Test Contract Lifecycle");

        // Give users some ETH for testing
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // 📚 INITIAL STATE TESTS (Constructor & Variables)
    // ══════════════════════════════════════════════════════════════════════════════

    function test_InitialState() public view {
        assertEq(contractLifecycle.owner(), owner);
        assertEq(contractLifecycle.contractName(), "Test Contract Lifecycle");
        assertEq(contractLifecycle.totalBalance(), 0);
        assertTrue(contractLifecycle.isActive());
        assertEq(
            uint(contractLifecycle.contractStatus()),
            uint(ContractLifecycle.Status.Active)
        );
    }

    function test_GetContractInfo() public view {
        (
            string memory name,
            address ownerAddr,
            uint256 balance,
            ContractLifecycle.Status status
        ) = contractLifecycle.getContractInfo();
        assertEq(name, "Test Contract Lifecycle");
        assertEq(ownerAddr, owner);
        assertEq(balance, 0);
        assertEq(uint(status), uint(ContractLifecycle.Status.Active));
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // 📚 USER REGISTRATION TESTS (Struct & Mapping & Require)
    // ══════════════════════════════════════════════════════════════════════════════

    function test_RegisterUser() public {
        vm.prank(user1);
        vm.expectEmit(true, false, false, true);
        emit UserRegistered(user1, "Alice");

        contractLifecycle.registerUser("Alice");

        (string memory name, uint256 balance, bool exists) = contractLifecycle
            .getUserInfo(user1);
        assertEq(name, "Alice");
        assertEq(balance, 0);
        assertTrue(exists);
    }

    function test_RegisterUser_RevertOnEmptyName() public {
        vm.prank(user1);
        vm.expectRevert("Name cannot be empty");
        contractLifecycle.registerUser("");
    }

    function test_RegisterUser_RevertOnAlreadyRegistered() public {
        vm.prank(user1);
        contractLifecycle.registerUser("Alice");

        vm.prank(user1);
        vm.expectRevert("User already registered");
        contractLifecycle.registerUser("Alice Again");
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // 📚 DEPOSIT TESTS (Payable Functions & Events)
    // ══════════════════════════════════════════════════════════════════════════════

    function test_Deposit() public {
        // First register user
        vm.prank(user1);
        contractLifecycle.registerUser("Alice");

        vm.prank(user1);
        vm.expectEmit(true, false, false, true);
        emit DepositReceived(user1, 1 ether);

        contractLifecycle.deposit{value: 1 ether}();

        (, uint256 balance, ) = contractLifecycle.getUserInfo(user1);
        assertEq(balance, 1 ether);
        assertEq(contractLifecycle.totalBalance(), 1 ether);
    }

    function test_Deposit_RevertOnZeroValue() public {
        vm.prank(user1);
        contractLifecycle.registerUser("Alice");

        vm.prank(user1);
        vm.expectRevert("Must send some Ether");
        contractLifecycle.deposit{value: 0}();
    }

    function test_Deposit_RevertOnUnregisteredUser() public {
        vm.prank(user1);
        vm.expectRevert("Must register first");
        contractLifecycle.deposit{value: 1 ether}();
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // 📚 MODIFIER TESTS (onlyOwner & onlyActive)
    // ══════════════════════════════════════════════════════════════════════════════

    function test_ChangeStatus_OnlyOwner() public {
        vm.expectEmit(false, false, false, true);
        emit StatusChanged(ContractLifecycle.Status.Paused);

        contractLifecycle.changeStatus(ContractLifecycle.Status.Paused);

        assertEq(
            uint(contractLifecycle.contractStatus()),
            uint(ContractLifecycle.Status.Paused)
        );
        assertFalse(contractLifecycle.isActive());
    }

    function test_ChangeStatus_RevertOnNonOwner() public {
        vm.prank(user1);
        vm.expectRevert("Only owner can do this");
        contractLifecycle.changeStatus(ContractLifecycle.Status.Paused);
    }

    function test_RegisterUser_RevertWhenInactive() public {
        // Pause contract
        contractLifecycle.changeStatus(ContractLifecycle.Status.Inactive);

        vm.prank(user1);
        vm.expectRevert("Contract must be active");
        contractLifecycle.registerUser("Alice");
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // 📚 RECEIVE & FALLBACK TESTS (Payable Functions)
    // ══════════════════════════════════════════════════════════════════════════════

    function test_ReceiveFunction() public {
        vm.expectEmit(true, false, false, true);
        emit DepositReceived(user1, 1 ether);

        vm.prank(user1);
        (bool success, ) = address(contractLifecycle).call{value: 1 ether}("");
        assertTrue(success);

        assertEq(contractLifecycle.totalBalance(), 1 ether);
    }

    function test_FallbackFunction() public {
        vm.expectEmit(true, false, false, true);
        emit DepositReceived(user1, 1 ether);

        vm.prank(user1);
        (bool success, ) = address(contractLifecycle).call{value: 1 ether}(
            "nonexistent"
        );
        assertTrue(success);

        assertEq(contractLifecycle.totalBalance(), 1 ether);
    }
}
