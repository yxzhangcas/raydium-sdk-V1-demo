/**
 * TODO:
 * 1. 目前的流程会发送多次交易，可以融合到一个交易中进行发送
 * 2. 创建的Token是没有名字的，但不影响Token的正常工作
 */
const { 
    createMint, 
    getMint, 
    getOrCreateAssociatedTokenAccount, 
    getAccount, 
    mintTo
} = require('@solana/spl-token');

const { 
    clusterApiUrl, 
    Connection, 
    Keypair, 
    LAMPORTS_PER_SOL, 
    PublicKey
} = require('@solana/web3.js');

const bs58 = require("bs58");

const payer = Keypair.fromSecretKey(
    bs58.decode('5G9CEQfMeyrw88rgaL61X46hyqcL5PBPKtBgVnouVkKCWpYDWiKzjWYknv2eip5Y1RGN77WNg7F3ki3seEWT7R4y'))
const mintAuthority = new PublicKey('6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs');
const freezeAuthority = new PublicKey('6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs');

const connection = new Connection(
  clusterApiUrl('devnet'),
  'confirmed'
);

async function main() {
    // 创建Token
    const mint = await createMint(
      connection,
      payer,
      mintAuthority,
      freezeAuthority,
      9                                     // We are using 9 to match the CLI decimal default exactly
    );
    console.log(mint.toBase58());
    const mintInfo = await getMint(
        connection,
        mint
    )
    console.log(mintInfo.supply);           // 0
    // 创建Token对应账户
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
    )
    console.log(tokenAccount.address.toBase58());
    const tokenAccountInfo = await getAccount(
        connection,
        tokenAccount.address
    )
    console.log(tokenAccountInfo.amount);   // 0
    // 铸币
    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        mintAuthority,
        100000000000 // because decimals for the mint are set to 9
    )
    const mintInfo1 = await getMint(
        connection,
        mint
    )
    console.log(mintInfo1.supply);           // 100
    const tokenAccountInfo1 = await getAccount(
        connection,
        tokenAccount.address
    )
    console.log(tokenAccountInfo1.amount);   // 100
}

main();


/**
 * CfBMPUEDbUs36Bbw8bsRFzUrmZWVcD89RkRxA8bpVqpG
 * 0n
 * FrvZ22D83bSVJv1g2NRGPQseTxf8kKzGgntsyXKUiYUT
 * 0n
 * 100000000000n
 * 100000000000n
 */
