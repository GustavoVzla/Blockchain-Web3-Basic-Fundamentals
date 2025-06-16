// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract DataStructures {
    // ───────────────────────────────────────────────
    // 📚 STRUCTS
    // ───────────────────────────────────────────────

    // 🌟 1. Struct: Custom data structure for books
    struct Book {
        string title;
        string author;
        uint256 year;
    }

    Book public book1 = Book("1984", "George Orwell", 1949);
    Book public book2; // Empty struct (default values)
    Book private book3; // Not accessible outside

    // 🌟 2. Struct: Customer profile
    struct Customer {
        uint256 id;
        string name;
        string email;
    }

    Customer internal customer1 = Customer(1, "Gustavo", "gustavo@mail.com");

    // ───────────────────────────────────────────────
    // 🧭 ENUMS
    // ───────────────────────────────────────────────

    // 🌟 Enum: Possible status values
    enum Status {
        Pending,
        Active,
        Inactive
    }

    Status public userStatus = Status.Pending;
    Status public itemStatus = Status.Active;
    Status public paymentStatus = Status.Inactive;

    // 🌟 Enum: Binary options (ON / OFF)
    enum Option {
        ON,
        OFF
    }

    Option public currentState;
    Option constant defaultChoice = Option.OFF;

    // ───────────────────────────────────────────────
    // 📦 ARRAYS
    // ───────────────────────────────────────────────

    // 🌟 Fixed-size arrays
    uint256[5] public fixedUintList = [1, 2, 3, 4, 5];
    uint256[3] public fixedArray = [10, 20, 30];

    // 🌟 Dynamic arrays
    uint256[] public dynamicUintList;
    string[] public names;

    // 🌟 Array of structs (dynamic)
    Customer[] public customerList;
    Book[] public bookList;

    // ───────────────────────────────────────────────
    // 🔑 MAPPINGS
    // ───────────────────────────────────────────────

    // 🌟 Mapping: Address => number (like balances or scores)
    mapping(address => uint256) public addressToNumber;

    // 🌟 Mapping: String => list of numbers (like grades)
    mapping(string => uint256[]) public nameToNumbers;

    // 🌟 Mapping: Address => Customer struct (full profile)
    mapping(address => Customer) public addressToCustomer;

    // ───────────────────────────────────────────────
    // ⚗️ COMBINATIONS
    // ───────────────────────────────────────────────

    // 🌟 Mapping to struct
    mapping(address => Book) public borrowedBooks;
    mapping(address => Status) public userStatuses;
    mapping(address => string) public userEmails;

    // 🌟 Array of structs
    Book[] public bestsellers;
    Book[] public wishlist;
    Book[] private archivedBooks;

    // 🌟 Struct that contains a mapping (advanced)
    struct User {
        string name;
        uint256 age;
        mapping(string => uint256) scores; // Only works in storage, not memory
    }

    // This type of struct must be stored in contract storage
    mapping(address => User) private users;
}
