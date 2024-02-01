import { TOKEN_PROGRAM_ID, Token } from "@raydium-io/raydium-sdk";
import { DEFAULT_TOKEN, connection, wallet } from "./config";
import { createTokenWithMetaAndMint } from "./worker/createToken";
import { ammCreatePool } from "./src/ammCreatePool";
import { Keypair, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { getWalletTokenAccount } from "./src/util";

async function main() {
  const decimals: number = 9;

  // 1. 创建token，添加元数据，铸币
  const metadata = {
    name: "SHIBA INU",
    symbol: "SHIB",
    uri: "https://bafkreiag42qziwitwimywpwtqlnyrl55sdmekx56czywhxnq7v5zyykq6e.ipfs.nftstorage.link/",
  };
  const mint = await createTokenWithMetaAndMint(decimals, 1000000_000000000, metadata.name, metadata.symbol, metadata.uri);
  console.log('#### mint ####', mint);

  // 2. 创建池子
  const baseToken = DEFAULT_TOKEN.WSOL;
  const quoteToken = new Token(TOKEN_PROGRAM_ID, new PublicKey(mint), 9);
  const targetMargetId = Keypair.generate().publicKey;
  const addBaseAmount = new BN(10000);
  const addQuoteAmount = new BN(10000);
  const startTime = Math.floor(Date.now() / 1000);
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey);
  const txIds = await ammCreatePool({
    startTime, addBaseAmount, addQuoteAmount, baseToken, quoteToken, targetMargetId, wallet, walletTokenAccounts,
  })
  console.log('#### txIds ####', txIds);
}


main().catch(console.error);