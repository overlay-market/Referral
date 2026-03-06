import {
    Injectable,
    OnModuleInit,
    ServiceUnavailableException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createPublicClient, getAddress, Hex, http } from "viem"
import { bsc } from "viem/chains"

const USER_TIER_ABI = [
    {
        inputs: [{ name: "", type: "address" }],
        name: "userTier",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
] as const

function createBscClient(rpcUrl: string) {
    return createPublicClient({
        chain: bsc,
        transport: http(rpcUrl, { timeout: 5000 }),
    })
}

@Injectable()
export class OnChainService implements OnModuleInit {
    private readContract: (typeof createBscClient extends (
        ...args: infer _
    ) => infer R
        ? R
        : never)["readContract"]
    private contract: Hex

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        const rpcUrl = this.configService.get<string>("bscRpcUrl")
        this.contract = this.configService.get<string>(
            "referrals.contract",
        ) as Hex
        const client = createBscClient(rpcUrl)
        this.readContract = client.readContract.bind(client)
    }

    async isAffiliate(userAddress: string): Promise<boolean> {
        try {
            const tier = await this.readContract({
                address: this.contract,
                abi: USER_TIER_ABI,
                functionName: "userTier",
                args: [getAddress(userAddress)],
            })

            return tier > 0n
        } catch (error) {
            console.error("On-chain affiliate check failed:", error)
            throw new ServiceUnavailableException(
                "Unable to verify on-chain affiliate status",
            )
        }
    }
}
