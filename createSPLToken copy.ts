import { Account, TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { connection, DEFAULT_TOKEN, wallet } from "./config";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Token } from "@raydium-io/raydium-sdk";
import { BN } from "bn.js";
import { getWalletTokenAccount } from "./src/util";
import { ammCreatePool } from "./src/ammCreatePool";
import { createMarket } from "./src/utilsCreateMarket";

const keypair = Keypair.fromSecretKey(wallet.secretKey);

async function createSPLToken(): Promise<Token> {
  const mint: PublicKey = await createMint(connection, keypair, wallet.publicKey, null, 9);
  console.log('createMint', mint.toBase58());
  const tokenAccount: Account = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
  console.log('createTokenAccount', tokenAccount.address.toBase58());
  const res: string = await mintTo(connection, keypair, mint, tokenAccount.address, keypair, 100000000000000);
  console.log('mintTo', res);
  return new Token(TOKEN_PROGRAM_ID, mint, 9, '', '');
}

createSPLToken().catch(console.error);

// async function createOpenbookMarket(mint: Token) {
//   console.log('token1', mint);

//   const baseToken = DEFAULT_TOKEN.WSOL;
//   const quoteToken = mint;

//   await createMarket({
//     baseToken,
//     quoteToken,
//     wallet: wallet,
//   }).then(({ txids }) => {
//     console.log('txids', txids)
//   })
// }

// async function createPool(mint: Token) {
//   console.log('token2', mint);

//   const baseToken = DEFAULT_TOKEN.WSOL;
//   const quoteToken = mint;
//   const targetMargetId = Keypair.generate().publicKey;
//   const addBaseAmount = new BN(1000000);
//   const addQuoteAmount = new BN(10000000000000);
//   const startTime = Math.floor(Date.now() / 1000);
//   const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey);

//   await ammCreatePool({
//     startTime,
//     addBaseAmount,
//     addQuoteAmount,
//     baseToken,
//     quoteToken,
//     targetMargetId,
//     wallet,
//     walletTokenAccounts,
//   }).then(({ txids }) => console.log('txids', txids));
// }

// createSPLToken().then((mint) => createOpenbookMarket(mint).then(() => createPool(mint)));