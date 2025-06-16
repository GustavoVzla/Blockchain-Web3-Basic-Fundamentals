// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title ContractLifecycle - Basic Solidity Elements
/// @notice Demonstrates fundamental Solidity concepts in a simple way
/// @author Gustavo
contract ContractLifecycle {
    // ═══════════════════════════════════════════════════════════════════════════════
    // 📊 BASIC VARIABLES (from VariablesAndModifiers contract)
    // ═══════════════════════════════════════════════════════════════════════════════
    
    address public owner;
    string public contractName;
    uint256 public totalBalance;
    bool public isActive;
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // 📋 BASIC DATA STRUCTURE (from DataStructures contract)
    // ═══════════════════════════════════════════════════════════════════════════════
    
    struct User {
        string name;
        uint256 balance;
        bool exists;
    }
    
    enum Status {
        Inactive,
        Active,
        Paused
    }
    
    mapping(address => User) public users;
    Status public contractStatus;
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // 📢 BASIC EVENTS (from EventEmitter contract)
    // ═══════════════════════════════════════════════════════════════════════════════
    
    event UserRegistered(address indexed user, string name);
    event DepositReceived(address indexed from, uint256 amount);
    event StatusChanged(Status newStatus);
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // 🔒 BASIC MODIFIER (from Modifier contract)
    // ═══════════════════════════════════════════════════════════════════════════════
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can do this");
        _;
    }
    
    modifier onlyActive() {
        require(contractStatus == Status.Active, "Contract must be active");
        _;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // 🏗️ BASIC CONSTRUCTOR (from Constructor contract)
    // ═══════════════════════════════════════════════════════════════════════════════
    
    constructor(string memory _name) {
        owner = msg.sender;
        contractName = _name;
        contractStatus = Status.Active;
        isActive = true;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // 🔧 BASIC FUNCTIONS WITH REQUIRE (from RequireExample contract)
    // ═══════════════════════════════════════════════════════════════════════════════
    
    function registerUser(string memory _name) external onlyActive {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(!users[msg.sender].exists, "User already registered");
        
        users[msg.sender] = User({
            name: _name,
            balance: 0,
            exists: true
        });
        
        emit UserRegistered(msg.sender, _name);
    }
    
    function deposit() external payable onlyActive {
        require(msg.value > 0, "Must send some Ether");
        require(users[msg.sender].exists, "Must register first");
        
        users[msg.sender].balance += msg.value;
        totalBalance += msg.value;
        
        emit DepositReceived(msg.sender, msg.value);
    }
    
    function changeStatus(Status _newStatus) external onlyOwner {
        contractStatus = _newStatus;
        isActive = (_newStatus == Status.Active);
        
        emit StatusChanged(_newStatus);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // 💰 BASIC PAYABLE FUNCTIONS (from PayableBasics contract)
    // ═══════════════════════════════════════════════════════════════════════════════
    
    receive() external payable {
        totalBalance += msg.value;
        emit DepositReceived(msg.sender, msg.value);
    }
    
    fallback() external payable {
        totalBalance += msg.value;
        emit DepositReceived(msg.sender, msg.value);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════════
    // 👀 BASIC QUERY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════════
    
    function getUserInfo(address _user) external view returns (string memory name, uint256 balance, bool exists) {
        User memory user = users[_user];
        return (user.name, user.balance, user.exists);
    }
    
    function getContractInfo() external view returns (string memory name, address ownerAddr, uint256 balance, Status status) {
        return (contractName, owner, totalBalance, contractStatus);
    }
}
