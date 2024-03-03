## Configuration

Create a `.env` file with the following variables, and update the values accordingly:

```env
REWARDS_API_TOKEN=<auth_token>
REWARDS_API_URI=http://localhost:3000/rewards/
SUBGRAPH=https://api.thegraph.com/subgraphs/name/overlay-market/overlay-sepolia-test
```

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
