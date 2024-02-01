import { ParsedInnerInstruction, ParsedInstruction, PartiallyDecodedInstruction, PublicKey } from "@solana/web3.js";
import { CONNECTION_QUICKNODE, RAYDIUM_LIQUIDITY_POOL_V4_ADDR, RAYDIUM_LIQUIDITY_POOL_V4_PUBKEY } from "./config";
import { formatAmmKeysById } from "./src/formatAmmKeysById";
import { Liquidity, LiquidityPoolKeys, jsonInfo2PoolKeys } from "@raydium-io/raydium-sdk";

const connection = CONNECTION_QUICKNODE;

async function subscribePoolCreate(processTransaction: (txId: string) => Promise<void>) {
  connection.onLogs(
    RAYDIUM_LIQUIDITY_POOL_V4_PUBKEY,
    ({ logs, err, signature }) => {
      if (err) return;
      if (logs && logs.some(log => log.includes('initialize2'))) {
        console.log('----', signature);
        processTransaction(signature).catch(console.error);
      }
    }
  )
}

async function processLockLiquidity(txId: string) {
  const tx = await connection.getParsedTransaction(txId,
    { maxSupportedTransactionVersion: 0, commitment: 'confirmed' });

  const instruction = tx?.transaction.message.instructions
    .find(ix => ix.programId.toBase58() === RAYDIUM_LIQUIDITY_POOL_V4_ADDR) as PartiallyDecodedInstruction;
  const txAccounts = instruction.accounts;

  const poolId = txAccounts[4];
  const lpMint = txAccounts[7];
  const coinMint = txAccounts[8];
  const coinVault = txAccounts[10];
  const pcMint = txAccounts[9];
  const pcVault = txAccounts[11];

  let solMint, solVault, solAmount: string = '0';
  if (coinMint.toBase58() === 'So11111111111111111111111111111111111111112') {
    solMint = coinMint;
    solVault = coinVault;
  } else if (pcMint.toBase58() === 'So11111111111111111111111111111111111111112') {
    solMint = pcMint;
    solVault = pcVault;
  } else {
    console.log('----', txId, poolId.toBase58(), 0);
    return;
  }

  const innerInstructions = tx?.meta?.innerInstructions as ParsedInnerInstruction[]
  const instructions = innerInstructions[0].instructions as ParsedInstruction[]
  for (const instruction of instructions) {
    if (instruction.programId.toString() !== 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') continue;
    const parsed = instruction.parsed as { type: string, info: object }
    if (parsed.type === 'transfer') {
      const info = parsed.info as { amount: string, authority: string, source: string, destination: string }
      if (info.destination === solVault.toBase58()) {
        solAmount = info.amount;
      }
    }
  }
  const startTime = Math.round(Date.now() / 1000);
  console.log('----', txId, poolId.toBase58(), solAmount, startTime);
  // console.log(solAmount.length, parseInt(solAmount.substring(0, solAmount.length - 9)));
  if (solAmount.length > 9 && parseInt(solAmount.substring(0, solAmount.length - 9)) > 1) {
    checkLock(poolId, lpMint, parseInt(solAmount.substring(0, solAmount.length - 9)), startTime).catch(console.error);
  }
}

async function checkLock(poolId: PublicKey, lpMint: PublicKey, solAmount: number, startTime: number) {
  const poolLiquidity = await getPoolLiquidity(poolId);
  const lpTokenSupply = await getTokenSupply(lpMint);

  // const startTime = poolLiquidity.startTime.toNumber();
  const lpSupply = poolLiquidity.lpSupply.toNumber();
  const tokenSupply = parseInt(lpTokenSupply.value.amount);
  const nowTime = Math.round(Date.now() / 1000);
  console.log('----', poolId.toBase58(), solAmount, lpMint.toBase58(), lpSupply, tokenSupply, startTime, nowTime, nowTime - startTime);
  if (nowTime - startTime > 5 * 60) {
    console.log('[NO LOCK]', poolId.toBase58(), solAmount, lpMint.toBase58(), lpSupply, tokenSupply, startTime, nowTime, (nowTime - startTime));
  } else if (tokenSupply / lpSupply < 0.05) {
    console.log('[LOCKED]', poolId.toBase58(), solAmount, lpMint.toBase58(), lpSupply, tokenSupply, startTime, nowTime, (nowTime - startTime));
  } else {
    setTimeout(() => checkLock(poolId, lpMint, solAmount, startTime), 10 * 1000);
  }
}

async function getPoolLiquidity(poolId: PublicKey) {
  const poolInfo = await formatAmmKeysById(poolId.toBase58());
  const poolKeys = jsonInfo2PoolKeys(poolInfo) as LiquidityPoolKeys;
  const poolLiquidity = await Liquidity.fetchInfo({ connection, poolKeys });
  return poolLiquidity;
}

async function getTokenSupply(tokenId: PublicKey) {
  return await connection.getTokenSupply(tokenId);
}

subscribePoolCreate(processLockLiquidity).catch(console.error);