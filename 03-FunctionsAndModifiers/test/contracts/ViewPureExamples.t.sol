// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {ViewPureExamples} from "../../contracts/03-ViewPureExamples.sol";

contract ViewPureExamplesTest is Test {
    ViewPureExamples viewPure;

    function setUp() public {
        viewPure = new ViewPureExamples();
    }

    function test_StoredNumber() public view {
        assertEq(viewPure.storedNumber(), 30);
    }

    function test_GetName() public view {
        assertEq(viewPure.getName(), "Gustavo");
    }

    function test_GetNumber() public view {
        assertEq(viewPure.getNumber(), 200);
    }

    function test_ReadNumber() public view {
        assertEq(viewPure.readNumber(), 30);
    }
}