import { ethers } from "ethers"

// Reference: https://docs.nestjs.com/techniques/configuration#custom-configuration-files
export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    signingKey: process.env.PRIVATE_KEY,
    subgraphUrl: "https://api.studio.thegraph.com/query/49419/overlay-arb-sepolia/version/latest",
    referrals: {
        minTradingVolume: ethers.parseEther("1000"), // 1000 OVL
        contract: "0x426cB483cad253aa7E514c6C2B76a3c215d9065b",
        chainId: 421614,
    }
})
