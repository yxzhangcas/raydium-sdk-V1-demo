import { CONNECTION_QUICKNODE } from "../config";

const connection = CONNECTION_QUICKNODE;

function checkCost() {
  connection.getMinimumBalanceForRentExemption(0).then(console.log);
  connection.getMinimumBalanceForRentExemption(1).then(console.log);
  // connection.getMinimumBalanceForRentExemption(10).then(console.log);
  // connection.getMinimumBalanceForRentExemption(100).then(console.log);
  // connection.getMinimumBalanceForRentExemption(1000).then(console.log);
  connection.getMinimumBalanceForRentExemption(10000).then(console.log);
  connection.getMinimumBalanceForRentExemption(100000).then(console.log);
  // connection.getMinimumBalanceForRentExemption(1000000).then(console.log);
  // connection.getMinimumBalanceForRentExemption(10000000).then(console.log);
  
  // base: 890880
  // 1: 6960
}

checkCost();