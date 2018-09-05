pragma solidity ^0.4.20;


contract Lottery {
    
    
    //define vearibles type, visability and variable name
    address public manager;
    
    //initilize players as an array of addresses
    // we now type the type of dynamic array
    address[] public players;
    
    //we now set the value of manager wen contract is deployed
    // constructors will be called
    function Lottery() public {
        
        //function body
        // take address of who deployed and assign value to manager
        manager = msg.sender;
        
        
    }
    
    // if some1 calles enter function add address to players 
    // and send some ether  (payable) and require sender to send ether
    function enter() public payable {
        require(msg.value > .01 ether);
        
        players.push(msg.sender);
        
    }
    
    //want to generate psudo random number
    function random() private view returns (uint) {
        
        // we want current block difficulty, current time and address of entrant
        // using sha3 algorithim  global variable  block.difficulty and now
       return uint(sha3(block.difficulty, now, players));
    }
    
    
    // new function pick winner    restricted is for the modifier later in the function
    function pickWinner() public restricted {
        
        // we want to make sure only manager can call this function so we use a require statememt
       
        
        // we create a new int called index
        
        uint index =  random() % players.length;   // % = remainder of division
        
        //access address of player who won []will access data in index and wil return an address
        // . transfer will take winnings and send to an address
        // this is reference to this contract and balance = amount of ether in account
        players[index].transfer(this.balance);   //  0x646464dkdo.....
        
// we wannt to find out who the last winner was
lastWinner = players[index];

        // we now want to reste the players array and start new Lottery
        // this creates a new dynamic array of type address
        players = new address[] (0);   // we want empty array so we use [0] to start up another round
        
        
        
    }
    
    // new function modifier which is added to contract  'restricted
    modifier restricted() {
       require (msg.sender == manager) ;
       _;       // _;  takes out all code related to function ad place it at the _  
    }
    
    // we want a function that returns all the players that have entered
    function getPlayers() public view returns (address[]) {
        return players;
    }
}

