//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Oui {
    event Deposit(address indexed sender, uint amount, uint balance);
    event Withdrawal(address indexed sender, uint amount, uint balance);

    address public owner;

    // map of addresses and balances
    mapping(address => uint) public deposits;

    // can't withdrawal unless you deposit
    modifier canWithdrawal() {
        require(deposits[msg.sender] > 0, "balance is 0");
        _;
    }

    // can't withdrawal more than you deposit
    modifier maxWithdrawal(uint _amount) {
        require(_amount <= deposits[msg.sender], "insufficient balance");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function withdrawal(uint _amount) external canWithdrawal maxWithdrawal(_amount) {
        deposits[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdrawal(msg.sender, _amount, deposits[msg.sender]);
    }

    function getAccountBalance(address _account) external view returns (uint) {
        return deposits[_account];
    }

    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }

    receive() external payable {
        deposits[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, deposits[msg.sender]);
    }
}
