// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EventEmitter {
    // ──────── 📣 EVENT DEFINITIONS ─────────────
    // Each event has a name and can have associated data.

    event Deposit(address indexed from, uint amount);
    event UpdatedValue(uint oldValue, uint newValue);
    event UserRegistered(address indexed user, string name);

    // ──────── 📊 STATE VARIABLES ─────────────
    uint storedValue = 0;
    
    // Mapping to store user information
    mapping(address => string) private userNames;
    mapping(address => bool) private isUserRegistered;
    address[] private registeredUsers;

    // ──────── 💰 FUNCTION TO DEPOSIT AND EMIT AN EVENT ─────────────
    function deposit() public payable {
        require(msg.value > 0, "You must send some ETH!");

        emit Deposit(msg.sender, msg.value); // We emit the event
    }

    // ──────── 🔄 FUNCTION THAT UPDATES A VALUE AND EMITS ANOTHER EVENT ─────────────
    function updateValue(uint newValue) public {
        uint oldValue = storedValue;
        storedValue = newValue;

        emit UpdatedValue(oldValue, newValue); // We notify the change
    }

    // ──────── 👤 REGISTERS A USER AND EMITS A THIRD EVENT ─────────────
    function registerUser(string memory name) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!isUserRegistered[msg.sender], "User already registered");
        
        userNames[msg.sender] = name;
        isUserRegistered[msg.sender] = true;
        registeredUsers.push(msg.sender);
        
        emit UserRegistered(msg.sender, name); // We save who registered
    }

    // ──────── 🔍 AUXILIARY FUNCTIONS TO VIEW DATA ─────────────
    function getStoredValue() public view returns (uint) {
        return storedValue;
    }
    
    // Get user name by address
    function getUserName(address userAddress) public view returns (string memory) {
        require(isUserRegistered[userAddress], "User not registered");
        return userNames[userAddress];
    }
    
    // Check if a user is registered
    function isRegistered(address userAddress) public view returns (bool) {
        return isUserRegistered[userAddress];
    }
    
    // Get the caller's own name
    function getMyName() public view returns (string memory) {
        require(isUserRegistered[msg.sender], "You are not registered");
        return userNames[msg.sender];
    }
    
    // Get total number of registered users
    function getTotalRegisteredUsers() public view returns (uint) {
        return registeredUsers.length;
    }
    
    // Get all registered user addresses (be careful with gas costs for large arrays)
    function getAllRegisteredUsers() public view returns (address[] memory) {
        return registeredUsers;
    }
    
    // Get user info by index
    function getUserByIndex(uint index) public view returns (address userAddress, string memory userName) {
        require(index < registeredUsers.length, "Index out of bounds");
        address user = registeredUsers[index];
        return (user, userNames[user]);
    }
}
