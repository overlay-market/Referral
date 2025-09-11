import { ethers } from "ethers"

// Reference: https://docs.nestjs.com/techniques/configuration#custom-configuration-files
export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    signingKey: process.env.PRIVATE_KEY,
    subgraphUrl:
        "https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bsc/prod/gn",
    referrals: {
        minTradingVolume: ethers.parseEther("10000"), // 10000 OVL
        contract: "0x1a0ef183d548405705bb9b00e8b4ef3524ae090e",
        chainId: 56,
    },
    isDevelopmentMode: process.env.NODE_ENV !== "production",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/referral",
})
