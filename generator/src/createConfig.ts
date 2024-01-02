import axios from "axios"
import fs from "fs"
import { ethers } from "ethers"

const SUBGRAPH = "https://api.studio.thegraph.com/query/49419/overlay-arb-sepolia/version/latest"

const main = async () => {
    const airdrop = await fetchReferralRewards()

    fs.writeFileSync(
        `./config.json`,
        // note: `decimals = 0` since we are getting the raw number of tokens from the subgraph
        JSON.stringify({decimals: 0, airdrop}, null, 2)
    )

    console.log(`Generated config.json`)
}

const fetchReferralRewards = async () => {
    let lastId = ethers.constants.AddressZero

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
        }`
    
        const variables = {}
    
        res = (await axios.post(SUBGRAPH, { query, variables })).data.data.referralPositions

        res.forEach(({owner, totalRewardsPending}) => rewardsPending[owner.id] = totalRewardsPending)

        // responses are sorted by id
        lastId = res[res.length - 1].id
    } while (res.length === 1000)

    return rewardsPending
}

main()
