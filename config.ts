import {
  ENDPOINT as _ENDPOINT,
  Currency,
  LOOKUP_TABLE_CACHE,
  MAINNET_PROGRAM_ID,
  RAYDIUM_MAINNET,
  Token,
  TOKEN_PROGRAM_ID,
  TxVersion,
} from '@raydium-io/raydium-sdk';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js';
import bs58 from 'bs58';

// export const rpcUrl: string = 'https://evocative-multi-dew.solana-mainnet.quiknode.pro/a3fd84de3e382511fb618ff9abdcfb84a7ba5022/';
export const rpcUrl: string = clusterApiUrl('mainnet-beta');
export const rpcToken: string | undefined = undefined

const PUBLIC_KEY = bs58.decode('EosiWR9dEftULFm4NdT5aSHjuutpg9wikMXtEWty5C4S');
const SECRET_KEY = new Uint8Array([
  43, 186, 48, 89, 86, 42, 212, 13,
  9, 121, 53, 139, 122, 211, 17, 33,
  200, 46, 134, 135, 195, 209, 166, 215,
  183, 191, 152, 196, 89, 254, 64, 183,
  205, 41, 253, 218, 175, 182, 160, 103,
  23, 66, 94, 177, 53, 57, 213, 95,
  130, 236, 231, 17, 96, 122, 238, 203,
  179, 243, 198, 116, 223, 199, 185, 19]);

export const wallet = Keypair.fromSecretKey(SECRET_KEY)

export const connection = new Connection(rpcUrl);

export const PROGRAMIDS = MAINNET_PROGRAM_ID;

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