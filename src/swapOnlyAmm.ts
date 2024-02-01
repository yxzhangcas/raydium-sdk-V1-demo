import assert from 'assert';

import {
  jsonInfo2PoolKeys,
  Liquidity,
  LiquidityPoolKeys,
  Percent,
  Token,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { LAMPORTS_PER_SOL, Keypair, PublicKey } from '@solana/web3.js';

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
  inputToken: Token
  slippage: Percent
  walletTokenAccounts: WalletTokenAccounts
  wallet: Keypair
}

export async function swapOnlyAmm(input: TestTxInputInfo) {
  // -------- pre-action: get pool info --------
  const targetPoolInfo = await formatAmmKeysById(input.targetPool)
  assert(targetPoolInfo, 'cannot find the target pool')
  // console.log(targetPoolInfo);
  const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys
  // console.log(poolKeys);

  const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });
  // console.log(poolInfo);
  console.log(poolInfo.baseReserve.toString())
  console.log(poolInfo.quoteReserve.toString())
  console.log(poolInfo.lpSupply.toString())
  const amount = Math.min(
    LAMPORTS_PER_SOL * 0.01, 
    parseInt(poolInfo.quoteReserve.toString().slice(0, -4)),
  );
  console.log(amount)
  const inputTokenAmount = new TokenAmount(input.inputToken, amount);
  // -------- step 1: coumpute amount out --------
  const { amountOut, minAmountOut } = Liquidity.computeAmountOut({
    poolKeys: poolKeys,
    poolInfo: await Liquidity.fetchInfo({ connection, poolKeys }),
    amountIn: inputTokenAmount,
    currencyOut: input.outputToken,
    slippage: input.slippage,
  })
  // console.log(amountOut, minAmountOut);

  // -------- step 2: create instructions by SDK function --------
  const { innerTransactions } = await Liquidity.makeSwapInstructionSimple({
    connection,
    poolKeys,
    userKeys: {
      tokenAccounts: input.walletTokenAccounts,
      owner: input.wallet.publicKey,
    },
    amountIn: inputTokenAmount,
    amountOut: minAmountOut,
    fixedSide: 'in',
    makeTxVersion,
  })
  // console.log(innerTransactions);

  console.log('amountOut:', amountOut.toFixed(), '  minAmountOut: ', minAmountOut.toFixed())

  return { txids: '---0---'}
  // return { txids: await buildAndSendTx(innerTransactions) }
}

async function howToUse() {
  const inputToken = new Token(
    new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), 
    new PublicKey('So11111111111111111111111111111111111111112'), 9, 'WSOL', 'WSOL');
  const outputToken = new Token(
    new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), 
    new PublicKey('J8UjmiSJASyKLTgwcvB6kTZyF9xDkvBEmU8yyNr12oh9'), 4, 'ORANG', 'ORANG');
  const targetPool = '6V479JYXTtxDoxgC3nANqKVWsCCTUXFinJn84kqNAv7B';
  const inputTokenAmount = new TokenAmount(inputToken, 1000000)
  const slippage = new Percent(1, 100)
  const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)
  // console.log(walletTokenAccounts);

  swapOnlyAmm({
    outputToken,
    targetPool,
    inputToken,
    slippage,
    walletTokenAccounts,
    wallet: wallet,
  }).then(({ txids }) => {
    /** continue with txids */
    console.log('txids', txids)
  })
}

howToUse();