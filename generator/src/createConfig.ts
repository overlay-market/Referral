import axios from "axios"
import fs from "fs"
import { ethers } from "ethers"
import "dotenv/config"
import Generator from "./generator"

export const createConfig = async () => {
    const {
      rewardsPending: airdrop,
      lastBlockTimestamp,
      totalRewards,
      top3Rewards
    } = await fetchReferralRewards()

    const decimals = 0 // subgraph returns raw number of tokens

    const merkleTree = new Generator(decimals, airdrop)

    // Reset rewards on rewards API
    await axios.delete(process.env.REWARDS_API_URI, {
      data: { campaign: "referral" },
      headers: {
        Authorization: `Token ${process.env.REWARDS_API_TOKEN}`
      }
    })
    
    // Update rewards on rewards API
    for (const [wallet, amount] of Object.entries(airdrop)) {
      const proof = merkleTree.generateProof(wallet, amount)
      console.log({wallet, amount, proof})

      try {
        await axios.patch(process.env.REWARDS_API_URI + wallet, {
          campaign: "referral",
          amount,
          proof,
        }, {
          headers: {
            Authorization: `Token ${process.env.REWARDS_API_TOKEN}`
          }
        })
      } catch(err) {
        throw new Error(`Error updating rewards for wallet ${wallet}: ${err.message}`)
      }
    }

    const tokenDecimals = 18

    console.log(`\nSubgraph: ${process.env.SUBGRAPH}`)
    console.log(`\nFound ${Object.keys(airdrop).length} wallets with rewards pending.`)
    console.log(`\nTop 3 wallets with most rewards pending:
      1. ${top3Rewards[0].wallet} - ${top3Rewards[0].amount} (${ethers.utils.formatUnits(top3Rewards[0].amount.toString(), tokenDecimals).toString()})
      2. ${top3Rewards[1].wallet} - ${top3Rewards[1].amount} (${ethers.utils.formatUnits(top3Rewards[1].amount.toString(), tokenDecimals).toString()})
      3. ${top3Rewards[2].wallet} - ${top3Rewards[2].amount} (${ethers.utils.formatUnits(top3Rewards[2].amount.toString(), tokenDecimals).toString()})`)
    console.log(`\nTotal amount of rewards pending: ${totalRewards} (${ethers.utils.formatUnits(totalRewards, tokenDecimals).toString()})`)

    console.log("\nUpdated rewards on the database.")

    // Write rewards to disk
    fs.writeFileSync(
        "./config.json",
        // note: `decimals = 0` since we are getting the raw number of tokens from the subgraph
        JSON.stringify({
          lastBlockTimestamp,
          decimals,
          totalRewards,
          airdrop
        }, null, 2)
    )

    console.log("Generated config.json.")
}

const fetchReferralRewards = async () => {
    let lastId = ethers.constants.AddressZero
    let lastBlockTimestamp = 0

    const rewardsPending: Record<string, string> = {}
    let res: {owner: {id: string}, totalRewardsPending: string, id: string}[] = []

    let totalRewards = BigInt(0)
    let top3Rewards: {wallet: string, amount: bigint}[] = [
        {wallet: ethers.constants.AddressZero, amount: BigInt(0)},
        {wallet: ethers.constants.AddressZero, amount: BigInt(0)},
        {wallet: ethers.constants.AddressZero, amount: BigInt(0)}
    ]
    
    console.log("Fetching rewards data from the subgraph...\n")

    do {
        const query = `query GetReferralRewards {
            referralPositions(
              orderBy: id
              orderDirection: asc
              where: {totalRewardsPending_gt: "0", id_gt: "${lastId}"}
              first: 1000
            ) {
              id
              totalRewardsPending
              owner {
                id
              }
            }
            _meta {
              block {
                timestamp
              }
            }
        }`
    
        const data = (await axios.post(process.env.SUBGRAPH, query )).data.data
    
        res = data.referralPositions
        lastBlockTimestamp = data._meta.block.timestamp

        res.forEach(({owner, totalRewardsPending}) => {
            rewardsPending[owner.id] = totalRewardsPending
            const amount = BigInt(totalRewardsPending)
            totalRewards += amount

            if (amount > top3Rewards[0].amount) {
                top3Rewards[2] = top3Rewards[1]
                top3Rewards[1] = top3Rewards[0]
                top3Rewards[0] = {wallet: owner.id, amount}
            } else if (amount > top3Rewards[1].amount) {
                top3Rewards[2] = top3Rewards[1]
                top3Rewards[1] = {wallet: owner.id, amount}
            } else if (amount > top3Rewards[2].amount) {
                top3Rewards[2] = {wallet: owner.id, amount}
            }
        })

        // responses are sorted by id
        lastId = res[res.length - 1].id
    } while (res.length === 1000)

    return {
      rewardsPending,
      lastBlockTimestamp,
      totalRewards: totalRewards.toString(),
      top3Rewards
    }
}