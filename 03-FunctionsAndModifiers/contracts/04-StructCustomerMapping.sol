// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Functions and Modifiers
/// @notice Basic Solidity functions grouped by their related logic and modifiers
/// @author Gustavo

contract StructCustomerMapping {
    // ───────────────────────────────────────────────
    // 🧍‍♂️ STRUCT: Customer + Mapping
    // ───────────────────────────────────────────────

    struct Customer {
        uint256 id;
        string name;
        string email;
    }

    mapping(address => Customer) public customers;

    function saveCustomer(
        uint256 _id,
        string memory _name,
        string memory _email
    ) public {
        customers[msg.sender] = Customer(_id, _name, _email);
    }

    function getMyCustomer() public view returns (Customer memory) {
        return customers[msg.sender];
    }
}
