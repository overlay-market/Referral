import axios from "axios"
import fs from "fs"
import { ethers } from "ethers"
import "dotenv/config"
import Generator from "./generator"

const SUBGRAPH = "https://api.thegraph.com/subgraphs/name/overlay-market/overlay-sepolia-test"

const main = async () => {
    const {
      rewardsPending: airdrop,
      lastBlockTimestamp,
      totalRewards
    } = await fetchReferralRewards()

    const decimals = 0 // subgraph returns raw number of tokens

    const merkleTree = new Generator(decimals, airdrop)
    
    // Update rewards on rewards API
    for (const [wallet, amount] of Object.entries(airdrop)) {
      const proof = merkleTree.generateProof(wallet, amount)
      console.log({wallet, amount, proof})

      try {
        await axios.patch(process.env.REWARDS_API_URI + wallet, {
          campaign: "referral",
          amount: parseFloat(ethers.utils.formatEther(amount)),
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

    console.log("Updated rewards on the database.")

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
    
        const variables = {}
        const data = (await axios.post(SUBGRAPH, { query, variables })).data.data
    
        res = data.referralPositions
        lastBlockTimestamp = data._meta.block.timestamp

        res.forEach(({owner, totalRewardsPending}) => rewardsPending[owner.id] = totalRewardsPending)

        // responses are sorted by id
        lastId = res[res.length - 1].id
    } while (res.length === 1000)

    const totalRewards: bigint = Object.values(rewardsPending).reduce(
      (sum, value) => sum + BigInt(value),
      BigInt(0)
    )

    return {
      rewardsPending,
      lastBlockTimestamp,
      totalRewards: totalRewards.toString()
    }
}

main()
