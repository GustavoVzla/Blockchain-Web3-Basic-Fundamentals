// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RequirePayments {
    mapping(address => uint) public balances;

    function deposit() public payable {
        require(msg.value > 0, "Must send some ETH");
        require(msg.value >= 0.1 ether, "Minimum deposit is 0.1 ETH");
        
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}