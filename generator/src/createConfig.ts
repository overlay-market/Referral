import axios from "axios"
import fs from "fs"
import { ethers } from "ethers"

const SUBGRAPH = "https://api.thegraph.com/subgraphs/name/overlay-market/overlay-sepolia-test"

const main = async () => {
    const {
      rewardsPending: airdrop,
      lastBlockTimestamp,
      totalRewards
    } = await fetchReferralRewards()

    fs.writeFileSync(
        `./config.json`,
        // note: `decimals = 0` since we are getting the raw number of tokens from the subgraph
        JSON.stringify({
          lastBlockTimestamp,
          decimals: 0,
          totalRewards,
          airdrop
        }, null, 2)
    )

    console.log(`Generated config.json`)
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
