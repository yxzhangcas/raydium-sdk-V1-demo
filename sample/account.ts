import { BN } from "bn.js";
import { CONNECTION_QUICKNODE, wallet } from "../config";
import { TokenAccountInfo, getUserTokenAccounts } from "../src/clmmMarketMaker/tokenAccount";

const connection = CONNECTION_QUICKNODE


// connection.getParsedAccountInfo(wallet.publicKey).then((data) => console.log(data));

// getUserTokenAccounts({
//   connection,
//   owner: wallet.publicKey,
//   commitment: 'confirmed',
// }).then((data) => {
//   for (const account of data.accounts) {
//     console.log(account.mint?.toString(), account.amount.toString())
//   }
// });

// let a = new BN(3090755513);
// console.log(a);