// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RequireBasic {
    uint public age;
    string public name;

    function setAge(uint _age) public {
        require(_age > 0 && _age <= 120, "Age must be between 1 and 120");
        age = _age;
    }

    function setName(string memory _name) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        name = _name;
    }

    function isAdult() public view returns (bool) {
        require(age > 0, "Age not set");
        return age >= 18;
    }
}