import assert from 'assert';

import {
  jsonInfo2PoolKeys,
  Liquidity,
  LiquidityPoolKeys,
  Percent,
  Token,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { Keypair } from '@solana/web3.js';

import {
  connection,
  DEFAULT_TOKEN,
  makeTxVersion,
  wallet
} from '../config';
import { formatAmmKeysById } from './formatAmmKeysById';
import {
  buildAndSendTx,
  getWalletTokenAccount,
} from './util';

type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = {
  outputToken: Token
  targetPool: string
  inputTokenAmount: TokenAmount
  slippage: Percent
  walletTokenAccounts: WalletTokenAccounts
  wallet: Keypair
}

async function swapOnlyAmm(input: TestTxInputInfo) {
  // -------- pre-action: get pool info --------
  const targetPoolInfo = await formatAmmKeysById(input.targetPool)
  assert(targetPoolInfo, 'cannot find the target pool')
  const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys

  // -------- step 1: coumpute amount out --------
  const { amountOut, minAmountOut } = Liquidity.computeAmountOut({
    poolKeys: poolKeys,
    poolInfo: await Liquidity.fetchInfo({ connection, poolKeys }),
    amountIn: input.inputTokenAmount,
    currencyOut: input.outputToken,
    slippage: input.slippage,
  })

  // -------- step 2: create instructions by SDK function --------
  const { innerTransactions } = await Liquidity.makeSwapInstructionSimple({
    connection,
    poolKeys,
    userKeys: {
      tokenAccounts: input.walletTokenAccounts,
      owner: input.wallet.publicKey,
    },
    amountIn: input.inputTokenAmount,
    amountOut: minAmountOut,
    fixedSide: 'in',
    makeTxVersion,
  })

  console.log('amountOut:', amountOut.toFixed(), '  minAmountOut: ', minAmountOut.toFixed())

  return { txids: await buildAndSendTx(innerTransactions) }
}

async function howToUse() {
  const before = Date.now();
  console.log('before', before, new Date().toLocaleString());

  const inputToken = DEFAULT_TOKEN.WSOL // SOL
  const outputToken = DEFAULT_TOKEN.RAY // RAY
  const targetPool = 'AVs9TA4nWDzfPJE9gGVNJMVhcQy3V9PGazuz33BfG2RA' // SOL-RAY pool
  const inputTokenAmount = new TokenAmount(inputToken, 10000)
  const slippage = new Percent(1, 100)
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)

  const res = await swapOnlyAmm({
    outputToken,
    targetPool,
    inputTokenAmount,
    slippage,
    walletTokenAccounts,
    wallet: wallet,
  });
  console.log(res);

  const after = Date.now();
  console.log('after', after, new Date().toLocaleString());
  console.log('spend', after - before);
  
  return res;
}

if (process.argv[process.argv.length - 1] === 'testSwapOnlyAmm') {
  howToUse();
}