import {
    createWalletClient,
    http,
    encodePacked,
    keccak256,
    Address,
    createPublicClient,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { arbitrumSepolia } from "viem/chains"
import * as dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config({ path: "../.env" })
dotenv.config({ path: ".env" })

const ABI = [
    {
        name: "allowAffiliate",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ name: "_signature", type: "bytes" }],
        outputs: [],
    },
] as const

// Change the chain here
const CHAIN = arbitrumSepolia

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as Address
const PRIVATE_KEY = process.env.PRIVATE_KEY as string
const MONGO_URI = process.env.MONGO_URI

async function generateSignature(affiliate: Address): Promise<`0x${string}`> {
    const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)
    const walletClient = createWalletClient({
        account,
        chain: CHAIN,
        transport: http(),
    })

    const messageHash = keccak256(
        encodePacked(
            ["address", "address", "uint256"],
            [affiliate, CONTRACT_ADDRESS, BigInt(CHAIN.id)],
        ),
    )

    return (await walletClient.signMessage({
        account,
        message: { raw: messageHash },
    })) as `0x${string}`
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function processAffiliate(
    walletClient: any,
    publicClient: any,
    affiliateAddress: string,
    index: number,
): Promise<void> {
    try {
        console.log(`[INFO] Processing affiliate ${index + 1}`, {
            address: affiliateAddress,
        })

        const signature = await generateSignature(affiliateAddress as Address)

        // Get latest nonce
        const nonce = await publicClient.getTransactionCount({
            address: walletClient.account.address,
        })

        const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "allowAffiliate",
            args: [signature],
            nonce,
            legacyTx: true,
        })

        console.log("[SUCCESS] Transaction processed", {
            address: affiliateAddress,
            transactionHash: hash,
        })

        // Wait between transactions
        await delay(2000)
    } catch (error) {
        console.error("[ERROR] Transaction failed", {
            address: affiliateAddress,
            error: error.message,
        })
    }
}

async function main() {
    if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !MONGO_URI) {
        throw new Error("Missing required environment variables")
    }

    await mongoose.connect(MONGO_URI)
    const affiliates = await mongoose.connection
        .collection("affiliates")
        .find()
        .toArray()

    console.log(`[INFO] Found ${affiliates.length} affiliates to process`)

    if (affiliates.length === 0) {
        console.log("[WARN] No affiliates found in database")
        return
    }

    const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)
    const publicClient = createPublicClient({
        chain: CHAIN,
        transport: http(),
    })

    const walletClient = createWalletClient({
        account,
        chain: CHAIN,
        transport: http(),
    })

    for (let i = 0; i < affiliates.length; i++) {
        await processAffiliate(
            walletClient,
            publicClient,
            affiliates[i].address?.toLowerCase(),
            i,
        )
    }

    await mongoose.disconnect()
    console.log("[INFO] Processing completed")
}

main().catch((error) => {
    console.error("[ERROR] Script failed", error)
    process.exit(1)
})
