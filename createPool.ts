/**
 * 流程：
 * 1. 创建Token - 参数：decimal - 返回：token publickey
 * 2. 创建Token元数据 - 参数：token & name & symbol & uri
 * 2. 创建Token对应的Account - 参数：token publickey - 返回：account
 * 3. 向Account账户铸币 - 参数：token & account & amount
 * 4. 向随机账户分散发币 - 参数：token & number & amount
 */

import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { connection, wallet } from "./config";
import { Account, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { createSignerFromKeypair } from "@metaplex-foundation/umi";
import { CreateMetadataAccountV3InstructionAccounts, CreateMetadataAccountV3InstructionDataArgs, createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi/serializers";

const keypair: Keypair = Keypair.fromSecretKey(wallet.secretKey);

export async function createToken(decimals: number): Promise<PublicKey> {
  const mint: PublicKey = await createMint(connection, keypair, wallet.publicKey, null, decimals);
  console.log('createToken', mint.toBase58());
  return mint;
}

export async function createTokenMetadata(mint: PublicKey, name: string, symbol: string, uri: string) {
  const umi = createUmi(connection);
  const keypair = fromWeb3JsKeypair(wallet);
  const signer = createSignerFromKeypair(umi, keypair);
  umi.identity = signer;
  umi.payer = signer;

  let argsCreateMetadataAccountV3: CreateMetadataAccountV3InstructionDataArgs & CreateMetadataAccountV3InstructionAccounts = {
    mint: fromWeb3JsPublicKey(mint),
    mintAuthority: signer,
    payer: signer,
    updateAuthority: keypair.publicKey,
    data: {
      name: name,
      symbol: symbol,
      uri: uri,
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    },
    isMutable: true,
    collectionDetails: null,
  }
  let instruction = createMetadataAccountV3(umi, argsCreateMetadataAccountV3)

  const transaction = await instruction.buildAndSign(umi);
  const transactionSignature = await umi.rpc.sendTransaction(transaction);

  const signature = base58.deserialize(transactionSignature);
  console.log('createTokenMetadata', signature[0]);
}

export async function createTokenAccount(mint: PublicKey): Promise<Account> {
  const tokenAccount: Account = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
  console.log('createTokenAccount', tokenAccount.address.toBase58());
  return tokenAccount;
}

export async function mintToV1(amount: number, mint: PublicKey, tokenAccount: Account) {
  const txId: string = await mintTo(connection, keypair, mint, tokenAccount.address, keypair, amount);
  console.log('mintToV1', txId);
}

export async function sendToV1(amount: number, mint: PublicKey, number: number) {
  let transaction = new Transaction();
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: Keypair.generate().publicKey,
      
    })
  )
}

export async function mintToV2(amount: number, mint: PublicKey, number: number) {
  for (let index = 0; index < number; index++) {
    const txId = await mintTo(connection, keypair, mint, Keypair.generate().publicKey, keypair, amount);
    console.log('mintToV2', txId);
  }
}

async function main() {
  const name: string = 'SHIBA INU';
  const symbol: string = 'SHIB';
  const uri: string = 'https://bafkreiag42qziwitwimywpwtqlnyrl55sdmekx56czywhxnq7v5zyykq6e.ipfs.nftstorage.link/';
  const amount: number = 1000000000000000;
  const amount2: number = 10000000000000;
  const number: number = 10;


  const mint: PublicKey = await createToken(9);
  await createTokenMetadata(mint, name, symbol, uri);
  const account: Account = await createTokenAccount(mint);
  await mintToV1(amount, mint, account);
  await sendToV1(amount2, mint, number);
}

main().catch(console.error);