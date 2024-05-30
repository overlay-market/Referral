# Merkle Airdrop Generator

This project is a Merkle Airdrop generator for the referral program of the Overlay Protocol. It's based on [our fork](https://github.com/overlay-market/merkle-airdrop) of [this](https://github.com/Anish-Agnihotri/merkle-airdrop-starter) other repository. Check the original repository for more information and context.

## Setup

1. Make a copy of the `.env.example` file and rename it to `.env`. Update the values accordingly.

    ```bash
    cp .env.example .env
    ```

2. Make sure the *Airdropper* account set in the `.env` already gave a token approval to the referrals contract beforehand. In the future, this could be added to these scripts so it's done automatically.
3. Install dependencies:

    ```bash
    npm install
    ```

4. Build the project:

    ```bash
    npm run build
    ```

## Merkle Tree Creation

1. Create a `config.json` file with all the wallets and rewards for the current epoch. These rewards will also be pushed to our database through the [Rewards API](https://github.com/overlay-market/rewards-api).

    ```bash
    npm run generate:config
    ```

2. Create the merkle tree and push the root to the referrals contract.

    ```bash
    npm run generate:merkle
    ```

    This will also save the merkle tree to a file in the `./trees` directory.
