import {
  ENDPOINT as _ENDPOINT,
  Currency,
  DEVNET_PROGRAM_ID,
  LOOKUP_TABLE_CACHE,
  MAINNET_PROGRAM_ID,
  RAYDIUM_MAINNET,
  Token,
  TOKEN_PROGRAM_ID,
  TxVersion,
} from '@raydium-io/raydium-sdk';
import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} from '@solana/web3.js';

/**
 * 下面的部分都是自定义内容
 */
// -------------------- BEGIN --------------------
import bs58 from 'bs58';

export const CONN_HOST: string = 'localhost';
export const CONN_PORT: number = 6789;

export const RAYDIUM_LIQUIDITY_POOL_V4_ADDR: string = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
export const RAYDIUM_LIQUIDITY_POOL_V4_PUBKEY = new PublicKey(RAYDIUM_LIQUIDITY_POOL_V4_ADDR);

export const QUICKNODE_URL: string = 'https://nameless-quaint-dinghy.solana-mainnet.quiknode.pro/0f0bf302c852fbe4abda32890a2c88d71d1a50ab/';
export const MAINNET_URL: string = clusterApiUrl('mainnet-beta');
export const DEVNET_URL: string = clusterApiUrl('devnet');
export const TESTNET_URL: string = clusterApiUrl('testnet');

export const WSOL_TOKEN_ADDR: string = 'So11111111111111111111111111111111111111112';
export const WSOL_TOKEN: Token = new Token(TOKEN_PROGRAM_ID, new PublicKey(WSOL_TOKEN_ADDR), 9, 'WSOL', 'WSOL');

export const CONNECTION_QUICKNODE = new Connection(QUICKNODE_URL, 'confirmed');
export const CONNECTION_MAINNET = new Connection(MAINNET_URL, 'confirmed');
export const CONNECTION_DEVNET = new Connection(DEVNET_URL, 'confirmed');
export const CONNECTION_TESTNET = new Connection(TESTNET_URL, 'confirmed');

export const SECRET_KEY = bs58.decode('5G9CEQfMeyrw88rgaL61X46hyqcL5PBPKtBgVnouVkKCWpYDWiKzjWYknv2eip5Y1RGN77WNg7F3ki3seEWT7R4y');
export const PUBLIC_KEY = bs58.decode('6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs');
export const WALLET = Keypair.fromSecretKey(SECRET_KEY);

export const POOLS_TO_BUY = {}
export const POOLS_TO_SELL = {}
// -------------------- END --------------------

export const rpcUrl: string = DEVNET_URL;  // TODO: [ MAINNET_URL | DEVNET_URL ]
export const rpcToken: string | undefined = undefined

export const wallet = WALLET; // modified

export const connection = CONNECTION_DEVNET; // TODO: [ CONNECTION_MAINNET | CONNECTION_DEVNET ]

export const PROGRAMIDS = DEVNET_PROGRAM_ID; // TODO: [ MAINNET_PROGRAM_ID | DEVNET_PROGRAM_ID ]

export const ENDPOINT = _ENDPOINT;

export const RAYDIUM_MAINNET_API = RAYDIUM_MAINNET;

export const makeTxVersion = TxVersion.V0; // LEGACY

export const addLookupTableInfo = LOOKUP_TABLE_CACHE // only mainnet. other = undefined

export const DEFAULT_TOKEN = {
  'SOL': new Currency(9, 'USDC', 'USDC'),
  'WSOL': new Token(TOKEN_PROGRAM_ID, new PublicKey('So11111111111111111111111111111111111111112'), 9, 'WSOL', 'WSOL'),
  'USDC': new Token(TOKEN_PROGRAM_ID, new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), 6, 'USDC', 'USDC'),
  'RAY': new Token(TOKEN_PROGRAM_ID, new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'), 6, 'RAY', 'RAY'),
  'RAY_USDC-LP': new Token(TOKEN_PROGRAM_ID, new PublicKey('FGYXP4vBkMEtKhxrmEBcWN8VNmXX8qNgEJpENKDETZ4Y'), 6, 'RAY-USDC', 'RAY-USDC'),
}
