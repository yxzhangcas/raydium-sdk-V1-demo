import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { CreateMetadataAccountV3InstructionAccounts, CreateMetadataAccountV3InstructionDataArgs, createMetadataAccountV3, createNft, fetchDigitalAsset, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { connection, wallet } from '../config';
import { createSignerFromKeypair } from '@metaplex-foundation/umi';
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { PublicKey } from '@solana/web3.js';
import { createSPLToken } from '../createSPLToken';
import { base58 } from '@metaplex-foundation/umi/serializers';

async function uploadMetadataForToken(offChainMetadata: any) {
  const token = await createSPLToken();
  const mint = token.mint;
  // const mint = new PublicKey('BhdfsXTc7UfGhhNp5aLmrLKUi2Sd7fJcXefzAyxxftPi');

  const umi = createUmi(connection);
  const keypair = fromWeb3JsKeypair(wallet);
  const signer = createSignerFromKeypair(umi, keypair);
  umi.identity = signer;
  umi.payer = signer;

  let argsCreateMetadataAccountV3: CreateMetadataAccountV3InstructionDataArgs & CreateMetadataAccountV3InstructionAccounts = {
    mint: fromWeb3JsPublicKey(mint),
    mintAuthority: signer,
    payer: signer,
    updateAuthority: keypair.publicKey,
    data: {
      name: offChainMetadata.name,
      symbol: offChainMetadata.symbol,
      uri: offChainMetadata.uri,
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    },
    isMutable: true,
    collectionDetails: null,
  }

  let instruction = createMetadataAccountV3(umi, argsCreateMetadataAccountV3)

  const transaction = await instruction.buildAndSign(umi);
  const transactionSignature = await umi.rpc.sendTransaction(transaction);
  const signature = base58.deserialize(transactionSignature);
  console.log({ signature });
}

const offChainMetadata = {
  name: 'SHIBA INU',
  symbol: 'SHIB',
  description: 'Missed Shiba Inu? This is your second chance. Shiba Army will rewrite history on Solana. Website: https://shibaonsol.pro Telegram: https://t.me/shiba_onsol Twitter: https://twitter.com/ShibaOnSol',
  image: 'https://bafkreic2l7agptg2wujtdnyzled7dfbjvsl7nj3wyvgyvexkwcuszgv47a.ipfs.nftstorage.link',
  uri: 'https://bafkreiag42qziwitwimywpwtqlnyrl55sdmekx56czywhxnq7v5zyykq6e.ipfs.nftstorage.link/',
}

uploadMetadataForToken(offChainMetadata).catch(console.error);