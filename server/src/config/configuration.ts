import { ethers } from "ethers"

// Reference: https://docs.nestjs.com/techniques/configuration#custom-configuration-files
export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    signingKey: process.env.PRIVATE_KEY,
    subgraphUrl:
        "https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bsc/prod/gn",
    referrals: {
        minTradingVolume: ethers.parseEther(process.env.VOLUME_THRESHOLD), // 10000 OVL
        contract: "0xd36a37a5c116ef661a84bd2314b4ef59e1a0f307",
        chainId: 56,
    },
    bscRpcUrl: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org",
    isDevelopmentMode: process.env.NODE_ENV !== "production",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/referral",
})
