import { ParsedAccountData, PublicKey } from "@solana/web3.js";
import { CONNECTION_MAINNET, WSOL_TOKEN, wallet } from "./config";
import { Percent, PublicKeyish, Token, TokenAmount } from "@raydium-io/raydium-sdk";
import { swapOnlyAmm } from "./src/swapOnlyAmm";
import { getWalletTokenAccount } from "./src/util";
import { swapOnlyCLMM } from "./src/swapOnlyCLMM";

const connection = CONNECTION_MAINNET;

export async function processReqData(req_data: string) {
  const data = JSON.parse(req_data);

  const tokenBPubKey = new PublicKey(data['tokenB']);
  const tokenBAccount = await connection.getParsedAccountInfo(tokenBPubKey);
  const tokenBAccountData = tokenBAccount.value?.data as ParsedAccountData
  const tokenBProgram = tokenBAccount.value?.owner as PublicKeyish
  const TOKEN_B = new Token(tokenBProgram, tokenBPubKey, tokenBAccountData.parsed.info.decimals);
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey);

  // const poolPubKey = new PublicKey(data['pool']);
  // const poolAccount = await connection.getParsedAccountInfo(poolPubKey);
  // const poolAccountData = poolAccount.value?.data as Buffer
  // console.log('tokenB', tokenBAccount, tokenBAccountData.parsed);
  // console.log('pool', poolAccount, poolAccountData);

  // 提交Transaction
  const txids = await swapOnlyAmm({
    outputToken: TOKEN_B,
    targetPool: data['pool'],
    inputTokenAmount: new TokenAmount(WSOL_TOKEN, 1000000),
    slippage: new Percent(1, 100),
    walletTokenAccounts,
    wallet: wallet,
  }).then(({ txids }) => {
    console.log('amm txids', txids);
    return txids;
  }).catch(async (err) => {
    console.error('amm error', err);
    return await swapOnlyCLMM({
      outputToken: TOKEN_B,
      targetPool: data['pool'],
      inputTokenAmount: new TokenAmount(WSOL_TOKEN, 1000000),
      slippage: new Percent(1, 100),
      walletTokenAccounts,
      wallet: wallet,
    }).then(({ txids }) => {
      console.log('clmm txids', txids);
      return txids;
    }).catch((err) => {
      console.error('clmm error', err);
      return [];
    })
  });

  if (txids.length == 0) return; // JSON.stringify({ b: 'b' });

  console.log(data);
  console.log('txids[0]', txids[0]);

  setTimeout(async() => {
    // 检查执行结果
    const tx = await connection.getParsedTransaction(txids[0],
      { maxSupportedTransactionVersion: 0, commitment: 'confirmed' })
    console.log(txids[0], tx);
  }, 30000)



  // await swapOnlyAmm({
  //   outputToken: WSOL_TOKEN,
  //   targetPool: data['pool'],
  //   inputTokenAmount: new TokenAmount(TOKEN_B, )
  // })
  // return JSON.stringify({ a: 'a' });
  // if (data.pool in NEW_POOL_MAP) {
  //   return JSON.stringify('Duplicated Pool, Dropped.');
  // }
  // NEW_POOL_MAP[data.pool] = data;
  // return JSON.stringify('New Pool, Added.');
}