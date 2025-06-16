// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RequireAccess {
    address public owner;
    mapping(address => bool) public authorizedUsers;

    constructor() {
        owner = msg.sender;
    }

    function addUser(address _user) public {
        require(msg.sender == owner, "Only owner can perform this action");
        require(_user != address(0), "Invalid address");
        require(!authorizedUsers[_user], "User already authorized");
        
        authorizedUsers[_user] = true;
    }

    function removeUser(address _user) public {
        require(msg.sender == owner, "Only owner can perform this action");
        require(_user != address(0), "Invalid address");
        require(authorizedUsers[_user], "User not authorized");
        
        authorizedUsers[_user] = false;
    }

    function restrictedFunction() public view {
        require(msg.sender == owner || authorizedUsers[msg.sender], "User not authorized");
    }
}