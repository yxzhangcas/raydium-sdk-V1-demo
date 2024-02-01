const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");
const { PoolInfoLayout, SqrtPriceMath, TOKEN_PROGRAM_ID, Token } = require('@raydium-io/raydium-sdk');
const connection = new Connection(
    // clusterApiUrl('mainnet-beta'),
    'https://nameless-quaint-dinghy.solana-mainnet.quiknode.pro/0f0bf302c852fbe4abda32890a2c88d71d1a50ab/',
    // clusterApiUrl('devnet'),
    'confirmed'
);

const publicKey = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
const programAddress = new PublicKey(publicKey);

async function main(connection, programAddress) {
    console.log("Monitoring logs for program:", programAddress.toString());
    connection.onLogs(
        programAddress,
        ({ logs, err, signature }) => {
            if (err) return;
            if (logs && logs.some(log => log.includes('initialize2'))) {
                process(signature, connection);
            }
        },
        "finalized"
    );
}

async function process(txId, connection) {
    const tx = await connection.getParsedTransaction(
        txId,
        {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        }
    );

    const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() == publicKey).accounts;
    if (!accounts) return;

    console.log('txId', txId);

    const tokenAAccount = await connection.getParsedAccountInfo(accounts[8]);
    const tokenBAccount = await connection.getParsedAccountInfo(accounts[9]);
    const tokenA = new Token(tokenAAccount.value.owner, new PublicKey(accounts[8].toBase58()), tokenAAccount.value.data.parsed.info.decimals);
    const tokenB = new Token(tokenBAccount.value.owner, new PublicKey(accounts[9].toBase58()), tokenBAccount.value.data.parsed.info.decimals);
    console.log('tokenA', tokenA);
    console.log('tokenB', tokenB);
    console.log('pool', accounts[4].toBase58());
}

main(connection, programAddress).catch(console.error);

// txId 62UvQ9x1cExk8TL2rzM3XWMX8QmFWTMSvBMkEFzk2UsmiKQVUB2szTU16LbUjm6LChcsciaYexQ1rRsKnqaLnuQj
// tokenA Token {
//   decimals: 8,
//   symbol: 'UNKNOWN',
//   name: 'UNKNOWN',
//   programId: PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)] {
//     _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
//   },
//   mint: PublicKey [PublicKey(GEeCvvz4pqEvbVasBpe9ZeYC8tF8o5yn7cBMikpsShbB)] {
//     _bn: <BN: e25dec4ae10ca99c09b7d7efdaa107e0e026f323075a864993d7b12371b46806>
//   }
// }
// tokenB Token {
//   decimals: 9,
//   symbol: 'UNKNOWN',
//   name: 'UNKNOWN',
//   programId: PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)] {
//     _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
//   },
//   mint: PublicKey [PublicKey(So11111111111111111111111111111111111111112)] {
//     _bn: <BN: 69b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001>
//   }
// }
// pool 6sMck7UwwyrF6g5HDXZeYPGSXki29o26ssbJrwpBCuna
