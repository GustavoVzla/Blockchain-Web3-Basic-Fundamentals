// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Modifier {
    uint public number;
    address public owner;
    bool private _isReady;

    // MODIFIER 1: Owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    // MODIFIER 2: Valid number
    modifier validNumber(uint _num) {
        require(_num > 0 && _num <= 100, "Number must be between 1 and 100");
        _;
    }

    // MODIFIER 3: Contract ready (as your example)
    modifier whenReady() {
        require(_isReady, "Contract is not ready");
        _;
    }

    constructor() {
        owner = msg.sender;
        _isReady = false;
    }

    // Function WITHOUT modifier
    function getNumber() public view returns (uint) {
        return number;
    }

    // Function WITH one modifier
    function setNumber(uint _num) public validNumber(_num) {
        number = _num;
    }

    // Function to activate the contract
    function makeReady() public onlyOwner {
        _isReady = true;
    }

    // Function WITH multiple modifiers
    function setNumberWhenReady(uint _num) public onlyOwner whenReady validNumber(_num) {
        number = _num * 2;
    }

    // Function to check if ready
    function isReady() public view returns (bool) {
        return _isReady;
    }
}