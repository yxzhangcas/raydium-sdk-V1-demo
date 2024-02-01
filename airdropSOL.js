const { 
    clusterApiUrl, 
    Connection, 
    Keypair, 
    LAMPORTS_PER_SOL 
} = require('@solana/web3.js');

const bs58 = require("bs58");

const payer = Keypair.fromSecretKey(
    bs58.decode('5G9CEQfMeyrw88rgaL61X46hyqcL5PBPKtBgVnouVkKCWpYDWiKzjWYknv2eip5Y1RGN77WNg7F3ki3seEWT7R4y'));

const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed'
);

async function main() {
    const airdropSignature = await connection.requestAirdrop(
        payer.publicKey,
        LAMPORTS_PER_SOL,
    );
    
    await connection.confirmTransaction(airdropSignature);
}

main();


/**
 * solana config set --url https://api.devnet.solana.com
 * solana balance 6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs
 * node airdropSOL.js
 * solana balance 6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs
 */