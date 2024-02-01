import { Account, TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { connection, wallet } from "./config";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Token } from "@raydium-io/raydium-sdk";


export async function createSPLToken(): Promise<Token> {
  console.log('createSPLToken start');

  const keypair: Keypair = Keypair.fromSecretKey(wallet.secretKey);
  console.log('keypair', keypair.publicKey.toBase58());
  const mint: PublicKey = await createMint(connection, keypair, wallet.publicKey, null, 9);
  console.log('createMint', mint.toBase58());
  const tokenAccount: Account = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
  console.log('createTokenAccount', tokenAccount.address.toBase58());
  const res: string = await mintTo(connection, keypair, mint, tokenAccount.address, keypair, 100000000000000);
  console.log('mintTo', res);

  console.log('createSPLToken finish');
  return new Token(TOKEN_PROGRAM_ID, mint, 9, '', '');
}


export async function createSPLTokenV2(): Promise<Token> {



  return new Token(TOKEN_PROGRAM_ID, mint, )
}

// createSPLToken().catch(console.error);
