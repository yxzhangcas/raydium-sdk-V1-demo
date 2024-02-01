const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");
const { PoolInfoLayout, SqrtPriceMath, TOKEN_PROGRAM_ID, Token, Liquidity } = require('@raydium-io/raydium-sdk');
const connection = new Connection(
    // clusterApiUrl('mainnet-beta'),
    'https://nameless-quaint-dinghy.solana-mainnet.quiknode.pro/0f0bf302c852fbe4abda32890a2c88d71d1a50ab/',
    // clusterApiUrl('devnet'),
    'confirmed'
);

async function main(connection) {

    const res = await Liquidity.fetchAllPoolKeys(connection, {4: new PublicKey('DqEqGzpUMtZNZSGmUpbkddf2dv8bNuSKzp4Qe51pHNHV'), 5: new PublicKey('So11111111111111111111111111111111111111112')});
    console.log(res)

    // const poolAccount = await connection.getParsedAccountInfo(new PublicKey('DUYv8xHTL61DicYYzsn2R2akLya2wHY76fpXZiRobbLN'));
    // const poolData = PoolInfoLayout.decode(poolAccount.value.data);
    // console.log(poolData);
    // console.log('DUYv8xHTL61DicYYzsn2R2akLya2wHY76fpXZiRobbLN');
    // console.log('poolData', poolData.sqrtPriceX64, poolData.mintDecimalsA, poolData.mintDecimalsB, poolData.liquidity);
    // console.log('current price -> ', SqrtPriceMath.sqrtPriceX64ToPrice(poolData.sqrtPriceX64, poolData.mintDecimalsA, poolData.mintDecimalsB));
    // console.log(poolData.sqrtPriceX64.toNumber())
}

main(connection).catch(console.error);
