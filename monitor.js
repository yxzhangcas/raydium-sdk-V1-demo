const {
  CONNECTION_QUICKNODE,
  RAYDIUM_LIQUIDITY_POOL_V4_ADDR,
  RAYDIUM_LIQUIDITY_POOL_V4_PUBKEY,
  WSOL_TOKEN_ADDR
} = require("./config.ts");
const {
  call_server
} = require("./tcp.ts");

const connection = CONNECTION_QUICKNODE;

async function monitor() {
  connection.onLogs(
    RAYDIUM_LIQUIDITY_POOL_V4_PUBKEY,
    ({ logs, err, signature }) => {
      if (err) return;
      if (logs && logs.some(log => log.includes('initialize2'))) {
        process(signature).catch(console.error);
      }
    }
  )
}

async function process(txId) {
  const tx = await connection.getParsedTransaction(txId,
    { maxSupportedTransactionVersion: 0, commitment: 'confirmed' });
  // console.log('tx', tx);
  // console.log('tx', tx?.transaction.message.instructions)
  // console.log('tx', tx?.meta.innerInstructions)
  // console.log('tx', tx?.meta.logMessages)
  const accounts = tx?.transaction.message.instructions.find(
    ix => ix.programId.toBase58() == RAYDIUM_LIQUIDITY_POOL_V4_ADDR).accounts;
  if (!accounts) return;

  const pool = accounts[4].toBase58();
  const tokenA = accounts[8].toBase58();
  const tokenB = accounts[9].toBase58();

  data = { 'timestamp': new Date().toLocaleString(), 'pool': pool, 'tokenA': WSOL_TOKEN_ADDR }
  if (tokenA === WSOL_TOKEN_ADDR) {
    data['tokenB'] = tokenB;
  } else if (tokenB === WSOL_TOKEN_ADDR) {
    data['tokenB'] = tokenA;
  } else {
    return;
  }

  console.log(data)
  await call_server(JSON.stringify(data), true);
}

monitor().catch(console.error);
