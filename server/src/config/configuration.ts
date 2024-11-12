import { ethers } from "ethers"

// Reference: https://docs.nestjs.com/techniques/configuration#custom-configuration-files
export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    signingKey: process.env.PRIVATE_KEY,
    subgraphUrl:
        "https://api.studio.thegraph.com/query/49419/overlay-arb-sepolia/version/latest",
    referrals: {
        minTradingVolume: ethers.parseEther("1000"), // 1000 OVL
        contract: "0x1cee53AB89004b2a9E173edc6F51509f8eB32122",
        chainId: 421614,
    },
    isDevelopmentMode: process.env.NODE_ENV !== "production",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/referral",
})
