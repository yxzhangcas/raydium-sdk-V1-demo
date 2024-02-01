const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");

const connection = new Connection(
    clusterApiUrl('mainnet-beta'),
    // clusterApiUrl('devnet'),
    'confirmed'
);

const programAddress = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

async function main(connection, programAddress) {
    console.log("Monitoring logs for program: ", programAddress.toString());
    connection.onLogs(
        programAddress,
        ({ logs, err, signature }) => {
            if (err) return;
            if (logs && logs.some(log => log.includes('InitializeMint'))) {
                console.log('sig', signature);
                console.log('logs', logs);
            }
        },
        "finalized"
    );
}

main(connection, programAddress).catch(console.error);
