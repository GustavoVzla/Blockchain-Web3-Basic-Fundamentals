// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {MathOperations} from "../../contracts/01-MathOperations.sol";

contract MathOperationsTest is Test {
    MathOperations public mathOps;

    function setUp() public {
        mathOps = new MathOperations();
    }

    function test_Addition() public {
        uint256 result = mathOps.suma(5, 3);
        assertEq(result, 8, "Addition should return 8");
    }

    function test_Subtraction() public {
        uint256 result = mathOps.resta(10, 4);
        assertEq(result, 6, "Subtraction should return 6");
    }

    function test_Product() public {
        uint256 result = mathOps.prod(4, 5);
        assertEq(result, 20, "Product should return 20");
    }

    function test_Division() public {
        uint256 result = mathOps.div(15, 3);
        assertEq(result, 5, "Division should return 5");
    }

    function test_Exponentiation() public {
        uint256 result = mathOps.expon(2, 3);
        assertEq(result, 8, "Exponentiation should return 8");
    }

    function test_Modulo() public {
        uint256 result = mathOps.mod(10, 3);
        assertEq(result, 1, "Modulo should return 1");
    }

    function test_AddmodVsNative() public view {
        (uint a, uint b) = math._addmod(10, 15, 12);
        assertEq(a, addmod(10, 15, 12));
        assertEq(b, (10 + 15) % 12);
    }

    function test_MulmodVsNative() public view {
        (uint a, uint b) = math._mulmod(6, 7, 13);
        assertEq(a, mulmod(6, 7, 13));
        assertEq(b, (6 * 7) % 13);
    }
}
