import { ParsedInnerInstruction, ParsedInstruction, PartiallyDecodedInstruction, PublicKey } from "@solana/web3.js";
import { CONNECTION_QUICKNODE, RAYDIUM_LIQUIDITY_POOL_V4_ADDR, RAYDIUM_LIQUIDITY_POOL_V4_PUBKEY } from "../config";
import { formatAmmKeysById } from "../src/formatAmmKeysById";
import { Liquidity, LiquidityPoolKeys, jsonInfo2PoolKeys } from "@raydium-io/raydium-sdk";

const connection = CONNECTION_QUICKNODE;

async function monitorPoolCreate() {
  connection.onLogs(
    RAYDIUM_LIQUIDITY_POOL_V4_PUBKEY,
    ({ logs, err, signature }) => {
      if (err) return;
      if (logs && logs.some(log => log.includes('initialize2'))) {
        console.log(signature);
        process(signature).catch(console.error);
      }
    }
  )
}

interface _PoolInfo {
  poolId: PublicKey,
  lpMint: PublicKey,
  lpDecimals?: number,
  lpSupply?: string,
  lpAmountOrigin?: string,
  lpAmountNow?: string,
  coinMint: PublicKey,
  coinDecimals?: number,
  coinSupply?: string,
  coinAmountOrigin?: string,
  coinAmountNow?: string,
  pcMint: PublicKey,
  pcDecimals?: number,
  pcSupply?: string,
  pcAmountOrigin?: string,
  pcAmountNow?: string,
}

async function process(signature: string) {
  await parseTransaction(signature)
    .then((poolData) => parseToken(poolData))
    .then((poolData) => parsePool(poolData))
}

async function parsePool(poolData: _PoolInfo | undefined) {
  if (poolData === undefined) return;

  const poolInfo = await formatAmmKeysById(poolData.poolId.toBase58());
  const poolKeys = jsonInfo2PoolKeys(poolInfo) as LiquidityPoolKeys;
  const liquidtyPoolInfo = await Liquidity.fetchInfo({connection, poolKeys});

  poolData.lpAmountNow = liquidtyPoolInfo.lpSupply.toString();
  poolData.coinAmountNow = liquidtyPoolInfo.baseReserve.toString();
  poolData.pcAmountNow = liquidtyPoolInfo.quoteReserve.toString();
  
  console.log(poolData);
}

async function parseToken(poolData: _PoolInfo | undefined) {
  if (poolData === undefined) return;

  const lpSupply = await connection.getTokenSupply(poolData.lpMint);
  const coinSupply = await connection.getTokenSupply(poolData.coinMint);
  const pcSupply = await connection.getTokenSupply(poolData.pcMint);

  poolData.lpDecimals = lpSupply.value.decimals
  poolData.lpSupply = lpSupply.value.amount
  poolData.coinDecimals = coinSupply.value.decimals
  poolData.coinSupply = coinSupply.value.amount
  poolData.pcDecimals = pcSupply.value.decimals
  poolData.pcSupply = pcSupply.value.amount

  console.log(poolData);
  return poolData;
}

async function parseTransaction(signature: string) {
  // 1. 获取交易信息，解析出需要的数据
  const tx = await connection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0, commitment: 'confirmed',
  })

  const msg_instructions = tx?.transaction.message.instructions as ParsedInstruction[] | PartiallyDecodedInstruction[]
  const msg_instruction = msg_instructions.find(ix => ix.programId.toBase58() === RAYDIUM_LIQUIDITY_POOL_V4_ADDR) as PartiallyDecodedInstruction;
  const accounts = msg_instruction.accounts;

  const poolId = accounts[4];
  const lpMint = accounts[7];
  const coinMint = accounts[8];
  const pcMint = accounts[9];
  const coinVault = accounts[10].toBase58();
  const pcVault = accounts[11].toBase58();

  const poolData: _PoolInfo = { poolId: poolId, lpMint: lpMint, coinMint: coinMint, pcMint: pcMint }

  const innerInstructions = tx?.meta?.innerInstructions as ParsedInnerInstruction[]
  const instructions = innerInstructions[0].instructions as ParsedInstruction[]
  for (const instruction of instructions) {
    if (instruction.programId.toString() !== 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') continue;
    const parsed = instruction.parsed as { type: string, info: object }
    if (parsed.type === 'transfer') {
      const info = parsed.info as { amount: string, authority: string, source: string, destination: string }
      if (info.destination === coinVault) {
        poolData.coinAmountOrigin = info.amount;
      } else if (info.destination === pcVault) {
        poolData.pcAmountOrigin = info.amount;
      } else {
        return;
      }
    } else if (parsed.type === 'mintTo') {
      const info = parsed.info as { amount: string, account: string, mint: string, mintAuthority: string }
      if (info.mint === lpMint.toBase58()) {
        poolData.lpAmountOrigin = info.amount;
      } else {
        return;
      }
    }
  }

  console.log(poolData);
  return poolData;
}


// monitorPoolCreate().catch(console.error);

process('3MUKTZGjxeQcYCtB8gTQwxJZHrr56amdbx4NQBRtTxyPHHzr5tZPRZhCyCaoWujrcTBuMpMqAGvZg1cYAyNx35vQ').catch(console.error);
