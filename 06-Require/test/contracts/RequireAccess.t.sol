// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {RequireAccess} from "../../contracts/RequireAccess.sol";

contract RequireAccessTest is Test {
    RequireAccess public requireAccess;
    address public owner;
    address public user1;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        requireAccess = new RequireAccess();
    }

    function test_InitialState() public view {
        assertEq(requireAccess.owner(), owner);
        assertFalse(requireAccess.authorizedUsers(user1));
    }

    function test_AddUser() public {
        requireAccess.addUser(user1);
        assertTrue(requireAccess.authorizedUsers(user1));
    }

    function test_AddUser_RevertIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert("Only owner can perform this action");
        requireAccess.addUser(user1);
    }

    function test_RemoveUser() public {
        requireAccess.addUser(user1);
        requireAccess.removeUser(user1);
        assertFalse(requireAccess.authorizedUsers(user1));
    }

    function test_RestrictedFunction_AllowsOwner() public view {
        requireAccess.restrictedFunction();
    }

    function test_RestrictedFunction_AllowsAuthorizedUser() public {
        requireAccess.addUser(user1);
        vm.prank(user1);
        requireAccess.restrictedFunction();
    }

    function test_RestrictedFunction_RevertIfNotAuthorized() public {
        vm.prank(user1);
        vm.expectRevert("User not authorized");
        requireAccess.restrictedFunction();
    }
}
