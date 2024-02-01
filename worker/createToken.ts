import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import "@solana/web3.js";
import { connection, wallet } from '../config';

export async function createTokenWithMetaAndMint(
  decimals: number, amount: number, name: string, symbol: string, uri: string
) {
  const umi = createUmi(connection);
  const userWallet = umi.eddsa.createKeypairFromSecretKey(wallet.secretKey);
  const userWalletSigner = createSignerFromKeypair(umi, userWallet);
  const mint = generateSigner(umi);
  umi.use(signerIdentity(userWalletSigner));
  umi.use(mplCandyMachine())
  const res = await createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: name,
    symbol: symbol,
    uri: uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: decimals,
    amount: amount,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);
  return mint.publicKey;
}
