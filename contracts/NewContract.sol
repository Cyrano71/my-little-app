// SPDX-License-Identifier: MIT 
pragma solidity 0.8.19;

contract MyContract{
    string greeting;
    constructor(){
        greeting = "Hello world";
    }

    function getGreeting() public view returns (string memory) {
        return greeting;
    }
    
}