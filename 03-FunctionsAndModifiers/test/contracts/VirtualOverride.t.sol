// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {VirtualInheritance, ChildFunctions} from "../../contracts/08-VirtualOverride.sol";

contract VirtualOverrideTest is Test {
    VirtualInheritance baseContract;
    ChildFunctions childContract;

    function setUp() public {
        baseContract = new VirtualInheritance();
        childContract = new ChildFunctions();
    }

    function test_BaseContractGreet() public view {
        assertEq(baseContract.greet(), "Hello from the base contract");
    }

    function test_ChildContractGreet() public view {
        assertEq(childContract.greet(), "Hello from the child contract");
    }

    function test_PolymorphicBehavior() public view {
        // Create a reference to the base contract but point to the child contract
        VirtualInheritance polymorphicRef = VirtualInheritance(address(childContract));
        
        // Should call the child's implementation
        assertEq(polymorphicRef.greet(), "Hello from the child contract");
    }
}