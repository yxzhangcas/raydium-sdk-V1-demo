# Install & Config

## Install Tool

- sh -c "$(curl -sSfL https://release.solana.com/v1.17.16/install)"
- solana --version
- solana --help

## Install Binary

- wget https://github.com/solana-labs/solana/releases/download/v1.17.16/solana-release-x86_64-unknown-linux-gnu.tar.bz2
- tar jxf solana-release-x86_64-unknown-linux-gnu.tar.bz2
- cd solana-release/
- export PATH=$PWD/bin:$PATH

## Wallet

- cat /root/.config/solana/id.json
[213,32,16,94,39,114,108,17,114,226,50,178,21,85,174,241,4,83,112,112,3,197,161,202,50,13,118,77,8,215,155,111,85,86,213,27,48,175,237,189,120,241,196,100,28,133,12,107,127,254,106,109,174,184,174,136,28,67,231,93,74,90,151,182]

# Remote Cluster

## Connecting to a Cluster

- solana config get
- solana config set --url https://api.devnet.solana.com
- solana --version
- solana cluster-version

## Airdrop

- solana balance 6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs
- solana airdrop 1 6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs
- solana account 6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs

## Transfer Token

- solana transfer --from /root/.config/solana/id.json ArEsYDhrJADLcfVMV1E3yGZuLrHaKhsfpvHFFKzUQzek 0.5 --allow-unfunded-recipient --url https://api.devnet.solana.com --fee-payer /root/.config/solana/id.json
- solana transfer --from /root/.config/solana/id.json ArEsYDhrJADLcfVMV1E3yGZuLrHaKhsfpvHFFKzUQzek 0.5 --allow-unfunded-recipient
- solana balance 6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs
- solana balance ArEsYDhrJADLcfVMV1E3yGZuLrHaKhsfpvHFFKzUQzek

# Local Cluster

## Run Cluster

- solana config set --url localhost
- solana config get
- rm -rf test-ledger/       (每次启动前都要先清理历史数据，因为服务器性能差，出块严重滞后，可能会卡死)
- solana-test-validator --log

## Transfer
// 新窗口验证：钱包初始化余额500000000SOL
- solana balance 6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs
- solana transfer --from /root/.config/solana/id.json ArEsYDhrJADLcfVMV1E3yGZuLrHaKhsfpvHFFKzUQzek 500000 --allow-unfunded-recipient
- solana balance 6k8T4fZ9cnfVCjsBPBmRqAiQXfYxN8ui1GCzgfP4mmjs
- solana balance ArEsYDhrJADLcfVMV1E3yGZuLrHaKhsfpvHFFKzUQzek

## Airdrop

- solana airdrop 2222 ArEsYDhrJADLcfVMV1E3yGZuLrHaKhsfpvHFFKzUQzek
- solana balance ArEsYDhrJADLcfVMV1E3yGZuLrHaKhsfpvHFFKzUQzek
