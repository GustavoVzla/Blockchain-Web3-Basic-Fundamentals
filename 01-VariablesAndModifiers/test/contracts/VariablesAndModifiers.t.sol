// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {VariablesAndModifiers} from "../../contracts/VariablesAndModifiers.sol";

contract VariablesAndModifiersTest is Test {
    VariablesAndModifiers vmContract;

    function setUp() public {
        vmContract = new VariablesAndModifiers();
    }

    function test_Public_UintsAndInts() public view {
        assertEq(vmContract.positiveNumber(), 100);
        assertEq(vmContract.maxUint8(), 255);
        assertEq(vmContract.negativeNumber(), -50);
        assertEq(vmContract.publicUint(), 123);
    }

    function test_Public_StringsAndBytes() public view {
        assertEq(vmContract.greeting(), "Hello, Blockchain!");
        assertEq(vmContract.fixedBytes(), bytes32("Hola"));
        assertEq(vmContract.dynamicBytes(), hex"123456");
        assertEq(
            uint8(vmContract.singleByte()),
            0x42,
            "singleByte should be 0x42"
        );
    }

    function test_Public_Bools() public view {
        assertTrue(vmContract.isActive());
        assertTrue(vmContract.flagA());
    }

    function test_Public_Addresses() public view {
        assertEq(vmContract.owner(), address(this));
        assertEq(
            vmContract.developer(),
            0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
        );
    }

    function test_VisibilityModifiers() public view {
        assertEq(vmContract.visibleToAll(), 42);
    }

    function test_HashFunctions() public view {
        assertTrue(vmContract.hashKeccak() != bytes32(0));
        assertTrue(vmContract.hashSha256() != bytes32(0));
        assertTrue(vmContract.hashRipemd() != bytes20(0));
    }
}
