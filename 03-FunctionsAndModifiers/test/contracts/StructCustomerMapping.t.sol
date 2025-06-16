// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {StructCustomerMapping} from "../../contracts/04-StructCustomerMapping.sol";

contract StructCustomerMappingTest is Test {
    StructCustomerMapping customerMap;
    address testUser = address(0x1);

    function setUp() public {
        customerMap = new StructCustomerMapping();
    }

    function test_SaveCustomer() public {
        vm.startPrank(testUser);
        
        customerMap.saveCustomer(1, "John Doe", "john@example.com");
        
        StructCustomerMapping.Customer memory customer = customerMap.getMyCustomer();
        assertEq(customer.id, 1);
        assertEq(customer.name, "John Doe");
        assertEq(customer.email, "john@example.com");
        
        vm.stopPrank();
    }

    function test_GetCustomerFromMapping() public {
        vm.startPrank(testUser);
        
        customerMap.saveCustomer(2, "Jane Smith", "jane@example.com");
        
        (uint256 id, string memory name, string memory email) = customerMap.customers(testUser);
        assertEq(id, 2);
        assertEq(name, "Jane Smith");
        assertEq(email, "jane@example.com");
        
        vm.stopPrank();
    }

    function test_MultipleUsers() public {
        address user1 = address(0x1);
        address user2 = address(0x2);
        
        vm.startPrank(user1);
        customerMap.saveCustomer(1, "User One", "one@example.com");
        vm.stopPrank();
        
        vm.startPrank(user2);
        customerMap.saveCustomer(2, "User Two", "two@example.com");
        vm.stopPrank();
        
        vm.startPrank(user1);
        StructCustomerMapping.Customer memory customer1 = customerMap.getMyCustomer();
        assertEq(customer1.id, 1);
        assertEq(customer1.name, "User One");
        vm.stopPrank();
        
        vm.startPrank(user2);
        StructCustomerMapping.Customer memory customer2 = customerMap.getMyCustomer();
        assertEq(customer2.id, 2);
        assertEq(customer2.name, "User Two");
        vm.stopPrank();
    }
}