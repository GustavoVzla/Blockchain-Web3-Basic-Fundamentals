// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VariablesAndModifiers {
    // ───────────────────────────────────────────────
    // 🏡 BASIC TYPES
    // ───────────────────────────────────────────────

    // 🌟 1. Unsigned and signed integers
    uint256 public positiveNumber = 100;
    uint8 public maxUint8 = 255;
    int256 public negativeNumber = -50;
    uint internal internalUint;
    int private privateInt = 10;
    uint public publicUint = 123;

    // 🌟 2. Strings and bytes
    string public greeting = "Hello, Blockchain!";
    string private privateMessage = "Only visible inside";
    bytes32 public fixedBytes = "Hola"; // Fixed size bytes
    bytes public dynamicBytes = hex"123456"; // Dynamic bytes array
    string internal internalNote = "Stored in storage";
    bytes1 public singleByte = 0x42; // Represents one byte

    // 🌟 3. Boolean values
    bool public isActive = true;
    bool internal isVerified;
    bool private isAdmin = false;
    bool public flagA = true;
    bool flagB; // default is false

    // 🌟 4. Ethereum addresses
    address public owner = msg.sender; // Caller of the contract
    address internal internalAddress = address(this); // This contract's address
    address private wallet = 0x0000000000000000000000000000000000000001;
    address public developer = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

    // ───────────────────────────────────────────────
    // 🔐 VISIBILITY MODIFIERS (for variables)
    // ───────────────────────────────────────────────

    uint256 public visibleToAll = 42; // 🔓 Public: accessible everywhere
    uint256 private secretValue = 99; // 🔒 Private: only inside this contract
    uint256 internal sharedValue = 1000; // 👪 Internal: contract and children

    // ❌ External: Not allowed on variables
    // external uint externalVar; // Invalid!

    // ───────────────────────────────────────────────
    // 📦 DATA LOCATION (only inside functions) — Explained for context
    // ───────────────────────────────────────────────
    /*
        The following data location modifiers are only used within functions,
        especially for structs, arrays, strings, or bytes:

        - memory: temporary, erased after function ends
        - storage: permanent, modifies contract storage
        - calldata: read-only input (external functions only)

        ❗ You’ll see them used like:
        function doSomething(string memory _text) public {}
    */

    // ───────────────────────────────────────────────
    // 🔑 HASHING EXAMPLES
    // ───────────────────────────────────────────────

    bytes32 public hashKeccak =
        keccak256(abi.encodePacked("Hello", uint256(10), msg.sender));

    bytes32 public hashSha256 = sha256(abi.encodePacked("Hello Solidity"));

    bytes20 public hashRipemd = ripemd160(abi.encodePacked("Hash me"));
}
