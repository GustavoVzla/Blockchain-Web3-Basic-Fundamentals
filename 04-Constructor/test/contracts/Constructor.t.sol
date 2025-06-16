// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {BasicConstructor, OwnerConstructor, ImmutableConstructor} from "../../contracts/Construnctor.sol";

contract ConstructorTest is Test {
    BasicConstructor basic;
    OwnerConstructor owner;
    ImmutableConstructor immutableContract;

    function setUp() public {
        basic = new BasicConstructor("Hardhat Rules");
        owner = new OwnerConstructor();
        immutableContract = new ImmutableConstructor(123);
    }

    function test_BasicConstructor() public view {
        assertEq(basic.name(), "Hardhat Rules");
    }

    function test_OwnerConstructor() public view {
        assertEq(owner.isOwner(), true);
    }

    function test_ImmutableConstructor() public view {
        assertEq(immutableContract.creator(), address(this));
        assertEq(immutableContract.initialValue(), 123);
    }
}
