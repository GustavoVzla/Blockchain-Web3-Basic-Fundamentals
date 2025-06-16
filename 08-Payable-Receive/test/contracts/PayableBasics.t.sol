// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {PayableBasics} from "../../contracts/PayableBasics.sol";

contract PayableBasicsTest is Test {
    PayableBasics public payableContract;
    address public user1;
    
    event EtherReceived(address sender, uint256 amount);

    function setUp() public {
        user1 = makeAddr("user1");
        vm.deal(user1, 10 ether);
        payableContract = new PayableBasics();
    }

    function test_ConstructorWithEther() public {
        uint256 initialAmount = 1 ether;
        
        vm.expectEmit(true, false, false, true);
        emit EtherReceived(address(this), initialAmount);
        
        PayableBasics newContract = new PayableBasics{value: initialAmount}();
        
        assertEq(newContract.getTotalReceived(), initialAmount);
        assertEq(address(newContract).balance, initialAmount);
    }

    function test_ReceiveFunction() public {
        uint256 sendAmount = 0.5 ether;
        
        vm.expectEmit(true, false, false, true);
        emit EtherReceived(user1, sendAmount);
        
        vm.prank(user1);
        (bool success,) = address(payableContract).call{value: sendAmount}("");
        
        assertTrue(success);
        assertEq(payableContract.getTotalReceived(), sendAmount);
        assertEq(payableContract.getContractBalance(), sendAmount);
    }

    function test_SendEtherFunction() public {
        uint256 sendAmount = 1 ether;
        
        vm.expectEmit(true, false, false, true);
        emit EtherReceived(user1, sendAmount);
        
        vm.prank(user1);
        payableContract.sendEther{value: sendAmount}();
        
        assertEq(payableContract.getTotalReceived(), sendAmount);
        assertEq(payableContract.getContractBalance(), sendAmount);
    }

    function test_SendEtherRevertWithZeroValue() public {
        vm.prank(user1);
        vm.expectRevert("Must send some Ether");
        payableContract.sendEther{value: 0}();
    }

    function test_ViewFunctions() public {
        uint256 sendAmount = 2 ether;
        
        vm.prank(user1);
        payableContract.sendEther{value: sendAmount}();
        
        assertEq(payableContract.getContractBalance(), sendAmount);
        assertEq(payableContract.getTotalReceived(), sendAmount);
    }
}
