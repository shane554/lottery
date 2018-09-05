const path = require('path');  // so we do not have to install on terminal  will becompatable across all systems
const fs = require('fs');   //
const solc = require('solc');

// will create path from computer to inbox directory putting data in inbox.sol
// dirname = constant for node
//will create
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

//read the raw data from the contract
// first fill must be synched
const source = fs.readFileSync(lotteryPath, 'utf8' );

//.. console.log(solc.compile(source, 1).contracts);

// we can no write compile statement
// we now cal solc and number of contracts we call
//console.log   removed to make available to other files inside file and source code
//module exports big giant object with contract property
// wiyh all contracts compiled
// also return details about inbox contract we only care about bytecode
module.exports = solc.compile(source, 1).contracts[':Lottery'];
