// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {RequirePayments} from "../../contracts/RequirePayments.sol";

contract RequirePaymentsTest is Test {
    RequirePayments public requirePayments;
    address public user1;

    function setUp() public {
        user1 = makeAddr("user1");
        requirePayments = new RequirePayments();
        vm.deal(user1, 10 ether);
    }

    function test_InitialState() public view {
        assertEq(requirePayments.balances(user1), 0);
    }

    function test_DepositValid() public {
        vm.prank(user1);
        requirePayments.deposit{value: 1 ether}();
        assertEq(requirePayments.balances(user1), 1 ether);
    }

    function test_Deposit_RevertIfTooSmall() public {
        vm.prank(user1);
        vm.expectRevert("Minimum deposit is 0.1 ETH");
        requirePayments.deposit{value: 0.05 ether}();
    }

    function test_WithdrawValid() public {
        vm.prank(user1);
        requirePayments.deposit{value: 1 ether}();
        
        vm.prank(user1);
        requirePayments.withdraw(0.5 ether);
        assertEq(requirePayments.balances(user1), 0.5 ether);
    }

    function test_Withdraw_RevertIfInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert("Insufficient balance");
        requirePayments.withdraw(1 ether);
    }

    function test_GetBalance() public {
        vm.prank(user1);
        requirePayments.deposit{value: 2 ether}();
        
        vm.prank(user1);
        uint256 balance = requirePayments.getBalance();
        assertEq(balance, 2 ether);
    }
}