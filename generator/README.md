## Configuration

Create a `.env` file with the following variables, and update the values accordingly:

```env
REWARDS_API_TOKEN=<auth_token>
REWARDS_API_URI=http://localhost:3000/rewards/
SUBGRAPH=https://api.thegraph.com/subgraphs/name/overlay-market/overlay-sepolia-test
AIRDROPPER_PK=<private_key>
RPC_PROVIDER=https://arb-sepolia.g.alchemy.com/v2/<api_key>
REFERRALS_ADDRESS=0x1cee53ab89004b2a9e173edc6f51509f8eb32122
```

> The Airdropper needs to give token approval to the contract beforehand.

## Merkle Tree Creation

1. Build the project using:
    ```bash
    npm run build
    ```
2. Create the `config.json` file with all the wallets and rewards using:
    ```bash
    npm run generate:config
    ```
    > This will also update the rewards in the database.
3. Create the merkle tree using:
    ```bash
    npm run generate:merkle
    ```
