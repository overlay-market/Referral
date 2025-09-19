import { ethers } from "ethers"

// Reference: https://docs.nestjs.com/techniques/configuration#custom-configuration-files
export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    signingKey: process.env.PRIVATE_KEY,
    subgraphUrl:
        "https://api.goldsky.com/api/public/project_clyiptt06ifuv01ul9xiwfj28/subgraphs/overlay-bsc/prod/gn",
    referrals: {
        minTradingVolume: ethers.parseEther(process.env.VOLUME_THRESHOLD), // 10000 OVL
        contract: "0xa19338c002a065f4dc3ad1949738ccdc4b10061d",
        chainId: 56,
    },
    isDevelopmentMode: process.env.NODE_ENV !== "production",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/referral",
})
