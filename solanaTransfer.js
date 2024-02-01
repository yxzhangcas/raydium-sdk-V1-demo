/**
 * <<LOCAL CLUSTER>>
 * 1. 启动本地测试节点（需要清理旧数据，确保从最新时间开始出块）
 * cd solana-cluster/
 * rm -rf test-ledger/
 * solana-test-validator --log
 * 2. 设置连接本地测试节点
 * mkdir solana-sample
 * cd solana-sample/
 * vi sample.js
 * npm install --save @solana/web3.js
 * solana config set --url localhost
 * solana balance ArEsYDhrJADLcfVMV1E3yGZuLrHaKhsfpvHFFKzUQzek
 * node sample.js
 * solana balance ArEsYDhrJADLcfVMV1E3yGZuLrHaKhsfpvHFFKzUQzek
 */
// let HTTP_URL = 'http://localhost:8899/';
// let WS_URL = 'ws://localhost:8900/';

/**
 * <<DEVNET>>
 * solana config set --url https://api.devnet.solana.com
 * solana airdrop 1 
 */
let HTTP_URL = 'https://api.devnet.solana.com';
let WS_URL = 'wss://api.devnet.solana.com';

/**
 * <<TESTNET>>
 * solana config set --url https://api.testnet.solana.com
 * solana airdrop 1 
 */
// let HTTP_URL = 'https://api.testnet.solana.com';
// let WS_URL = 'wss://api.testnet.solana.com';

/**
 * <<MAINNET>>
 * solana config set --url https://api.mainnet-beta.solana.com
 */
// let HTTP_URL = 'https://api.mainnet-beta.solana.com';
// let WS_URL = 'wss://api.mainnet-beta.solana.com';

/**
 * <<MAINNET QUICKNODE>>
 * solana config set --url https://nameless-quaint-dinghy.solana-mainnet.quiknode.pro/0f0bf302c852fbe4abda32890a2c88d71d1a50ab/
 */
// let HTTP_URL = 'https://nameless-quaint-dinghy.solana-mainnet.quiknode.pro/0f0bf302c852fbe4abda32890a2c88d71d1a50ab/';
// let WS_URL = 'wss://nameless-quaint-dinghy.solana-mainnet.quiknode.pro/0f0bf302c852fbe4abda32890a2c88d71d1a50ab/';


const { Keypair } = require("@solana/web3.js");
let secretKey = Uint8Array.from([
    213,32,16,94,39,114,108,17,114,226,50,178,21,85,174,241,4,83,112,112,3,197,161,202,50,13,118,77,8,215,155,111,85,86,213,27,48,175,237,189,120,241,196,100,28,133,12,107,127,254,106,109,174,184,174,136,28,67,231,93,74,90,151,182
]);
let keypair = Keypair.fromSecretKey(secretKey);

const {
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    PublicKey,
} = require("@solana/web3.js");
let transaction = new Transaction();
transaction.add(
  SystemProgram.transfer({
    fromPubkey: keypair.publicKey,
    toPubkey: new PublicKey("ArEsYDhrJADLcfVMV1E3yGZuLrHaKhsfpvHFFKzUQzek"),
    lamports: LAMPORTS_PER_SOL * 0.01,
  }),
);

const {
    sendAndConfirmTransaction,
    Connection,
} = require("@solana/web3.js");
const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9);
let connection = new Connection(
    HTTP_URL,
    {
        wsEndpoint: WS_URL,
        httpHeaders: {"x-session-hash": SESSION_HASH}
    }
);
(async() => {sendAndConfirmTransaction(connection, transaction, [keypair]);})();
