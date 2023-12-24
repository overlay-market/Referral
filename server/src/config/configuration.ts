import { ethers } from "ethers"

// Reference: https://docs.nestjs.com/techniques/configuration#custom-configuration-files
export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    subgraphUrl: "https://api.studio.thegraph.com/query/49419/overlay-arb-sepolia/version/latest",
    affiliates: {
        minTradingVolume: ethers.parseEther("1000"), // 1000 OVL
    }
})
