//requiring required librarys
const assert = require('assert');  // assert part of node library

//requiring access to ganache our local test network
const ganache = require('ganache-cli');

//require Web3 constructor
const Web3 = require('web3');

//our instance of web3   provider can be replaced ganache etc
const web3 = new Web3(ganache.provider());

// we require our interfaace ABi and bytecode raw compiled data
const { interface, bytecode } = require('../compile');


//going to declare local variables which will hold an instance of contract
// and list of accounts
let lottery;
let accounts;

//before each statement will attempt to deploy contract
// and list all of the accounts   
// it will have some async code
beforeEach(async () => {
 //list of accounts
 accounts = await web3.eth.getAccounts();

 // we need to deploy instance of contract
 lottery = await new web3.eth.Contract(JSON.parse(interface))
 .deploy({ data: bytecode })
 .send({ from: accounts[0], gas: '1000000' })

 //console.log(accounts);

});

// our first describe statement
describe('Lottery Contract', () =>  {

// it statement to mak sure contract is deployed
it('deploys a contract' , () => {
	assert.ok(lottery.options.address);   // assert lotter contract was deployed to correct address
})

// we want to make sure that players address who enters is added to player array
it('allows one account to enter', async () => {
// we now attempt to enter into the lottery
await lottery.methods.enter().send({
//we want to know who is entering the lottery
	from: accounts[0],
	// we want to send a certain value
	value: web3.utils.toWei('0.02', 'ether')  //will convert to wei

	});
// now we want to get back list of players who entered
const players = await lottery.methods.getPlayers().call({
// we need to know who is calling the function
from: accounts[0]
});

// we now make assertions make sure only 1 record in array.
assert.equal(accounts[0], players[0]);

// we want to assert that correct address is stored 1 = value it should be
assert.equal(1, players.length);

});

//we now want to make sure we can enter on multiple accounts
//and each of the addresses will be stored in the payers array
it('allows multiple accounts to enter', async () => {
// we now attempt to enter into the lottery
await lottery.methods.enter().send({
//we want to know who is entering the lottery
	from: accounts[0],
	// we want to send a certain value
	value: web3.utils.toWei('0.02', 'ether')  //will convert to wei

	});

// we want to copy await code twice
await lottery.methods.enter().send({
//we want to know who is entering the lottery
	from: accounts[1],
	// we want to send a certain value
	value: web3.utils.toWei('0.02', 'ether')  //will convert to wei

	});

	await lottery.methods.enter().send({
//we want to know who is entering the lottery
	from: accounts[2],
	// we want to send a certain value
	value: web3.utils.toWei('0.02', 'ether')  //will convert to wei

	});

// now we want to get back list of players who entered
const players = await lottery.methods.getPlayers().call({
// we need to know who is calling the function
from: accounts[0]
});

// we now make assertions make sure 3 accounts record in array.
assert.equal(accounts[0], players[0]);
assert.equal(accounts[1], players[1]);
assert.equal(accounts[2], players[2]);
// we want to assert that correct address is stored 1 = value it should be
assert.equal(3, players.length);

});

// make sure accounts sends the right amount of ether to enter
it('requires a minumum amount of ether to enter', async () => {

	try{
await lottery.methods.enter().send({
	from: accounts[0],
	value: 0

});
//we also want to add a failing assertion to make sure it fails
assert(false);

} catch (err) {    // catch catches errors that are thrown in above await call
assert(err);    // assures us that some value will be passes into err for truthness

}

});

// we want to make sure if someone elses calls pick winner an error will be thrown
// we dont have to actually enter into the contract
it('only manager can call pick winner', async ()  => {
try{
await lottery.methods.pickWinner().send({
from: accounts[1]

});
assert(false);   // to automatacially fail the test

}  catch (err) {
	assert(err);
}

});

// we want to write a test that runns through contract from start to finish
// we want to verify winner recieves money 
// and player array is reset and emptied out

it('sends money to the winner and resets the players array', async () => {
// we will only enter 1 player to test to save on code
await lottery.methods.enter().send({
from: accounts[0],
value: web3.utils.toWei('2', 'ether')

});

// we want balance before transaction and after pick winner
// we should have 2 ether less
const initialBalance = await web3.eth.getBalance(accounts[0]);

//now we can pick the winner
await lottery.methods.pickWinner().send({ from: accounts[0] }); //accounts [0] should recieve 2 ether that was sent in

// to get final balance
const finalBalance = await web3.eth.getBalance(accounts[0]);

// now we compare difference of initial balance and final balance diff should be gas used
// it should have difference of less than 2 ether and greater than 1.8 ether
const difference = finalBalance - initialBalance;

// to find out how much gas was used
//console.log(finalBalance - initialBalance);

assert(difference > web3.utils.toWei('1.8', 'ether'));

});

});


