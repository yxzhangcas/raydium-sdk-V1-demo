import { Liquidity, LiquidityPoolKeys, jsonInfo2PoolKeys } from "@raydium-io/raydium-sdk";
import { CONNECTION_QUICKNODE } from "../config";
import { formatAmmKeysById } from "../src/formatAmmKeysById";
import { ParsedInnerInstruction, ParsedInstruction } from "@solana/web3.js";

const connection = CONNECTION_QUICKNODE;

// const targetPool = 'EVzLJhqMtdC1nPmz8rNd6xGfVjDPxpLZgq7XJuNfMZ6' // USDC-RAY pool

// const targetPool = 'Akx7fnA38983sPWLJoRYeDdzQAm1ECPJkP1qbanot3mk' // GME-WSOL
const tokenA = 'So11111111111111111111111111111111111111112'
// const txId = '4guGdVqHx6disVsqfwSRjntC13FpNQoEwgTFLidkmKtyq2Xr3AWPQSFQumReEugWJsmKA2P3weKkcQpXkN5xAsXY';

const targetPool = 'DuYg19jNBrDF3dF1YwEVSP68NXa37hRHA2Tdn9MjA1ix' 
const txId = '2jE3Njj3XXRW6jccWHYGujv3YKZVEew7We2HPn2ybJ5vqWKPiuUQRVPDPRTXrBK7rzjny13EGemQe7gbnbQhkL8f';


async function poolInfo() {
  const targetPoolInfo = await formatAmmKeysById(targetPool);
  // console.log(targetPoolInfo);
  const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys
  // console.log(poolKeys);
  const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });
  console.log(poolInfo);
  console.log(poolInfo.startTime.toString(),
    new Date(parseInt(poolInfo.startTime.toString()) * 1000).toLocaleString());
  console.log(targetPoolInfo.baseMint, poolInfo.baseDecimals, poolInfo.baseReserve.toString());
  console.log(targetPoolInfo.quoteMint, poolInfo.quoteDecimals, poolInfo.quoteReserve.toString());
  console.log(targetPoolInfo.lpMint, poolInfo.lpDecimals, poolInfo.lpSupply.toString());

  const baseTokenSupply = await connection.getTokenSupply(poolKeys.baseMint);
  console.log(poolKeys.baseMint.toString(), baseTokenSupply.value.decimals, baseTokenSupply.value.amount);
  const quoteTokenSupply = await connection.getTokenSupply(poolKeys.quoteMint);
  console.log(poolKeys.quoteMint.toString(), quoteTokenSupply.value.decimals, quoteTokenSupply.value.amount);
  const LPTokenSupply = await connection.getTokenSupply(poolKeys.lpMint);
  console.log(poolKeys.lpMint.toString(), LPTokenSupply.value.decimals, LPTokenSupply.value.amount);
}

poolInfo().catch(console.error);


async function poolConfig() {
  const tx = await connection.getParsedTransaction(txId, 
    { maxSupportedTransactionVersion: 0, commitment: 'confirmed' });
  console.log(tx);
  const instructions = tx?.transaction.message.instructions;
  console.log(instructions);
  const innerInstructions = tx?.meta?.innerInstructions as ParsedInnerInstruction[];
  console.log(innerInstructions[0].instructions as ParsedInstruction[])
}

// poolConfig().catch(console.error);