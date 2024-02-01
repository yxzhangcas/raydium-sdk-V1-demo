const { Connection, PublicKey } = require("@solana/web3.js");

const connection = new Connection('https://api.mainnet-beta.solana.com');
const raydiumPoolProgramAddress = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
const tokenProgramAddress = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

async function main(connection, programAddress) {
    console.log("Monitoring logs for program: ", programAddress.toString());
    connection.onLogs(
        programAddress,                                             // LogsFilter
        ({ logs, err, signature }) => {                             // LogsCallback
            if (err) return;
            console.log('logs', logs);
        },
        "finalized"                                                 // Commitment
    );
}

//main(connection, raydiumPoolProgramAddress).catch(console.error);
main(connection, tokenProgramAddress).catch(console.error);
