// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {SenderInteractions} from "../../contracts/07-SenderInteractions.sol";

contract SenderInteractionsTest is Test {
    SenderInteractions senderInteract;
    address testUser = address(0x1);

    function setUp() public {
        senderInteract = new SenderInteractions();
    }

    function test_InitialLastSender() public view {
        assertEq(senderInteract.lastSender(), address(0));
    }

    function test_WhoAmI() public {
        vm.startPrank(testUser);
        
        address sender = senderInteract.whoAmI();
        assertEq(sender, testUser);
        
        vm.stopPrank();
    }

    function test_UpdateLastSender() public {
        vm.startPrank(testUser);
        
        senderInteract.updateLastSender();
        assertEq(senderInteract.lastSender(), testUser);
        
        vm.stopPrank();
    }

    function test_MultipleUsers() public {
        address user1 = address(0x1);
        address user2 = address(0x2);
        
        vm.startPrank(user1);
        senderInteract.updateLastSender();
        assertEq(senderInteract.lastSender(), user1);
        vm.stopPrank();
        
        vm.startPrank(user2);
        senderInteract.updateLastSender();
        assertEq(senderInteract.lastSender(), user2);
        vm.stopPrank();
    }
}