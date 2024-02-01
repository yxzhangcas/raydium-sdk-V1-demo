import { TOKEN_METADATA } from "./configMetadata";
import { createTokenWithMetaAndMint } from "./createToken";

async function main() {
  const token = TOKEN_METADATA.SORA;
  const mint = await createTokenWithMetaAndMint(token.decimals, token.supply, token.name, token.symbol, token.uri);
  console.log('#### mint ####', mint);
}

main().catch(console.error);