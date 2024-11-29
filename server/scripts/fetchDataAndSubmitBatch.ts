import { createWalletClient, http, Address, createPublicClient } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { arbitrumSepolia } from "viem/chains"
import * as dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config({ path: "../.env" })
dotenv.config({ path: ".env" })

const ABI = [
    {
        name: "batchAddAffiliateOrKolOnBehalfOf",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "_traders", type: "address[]" },
            { name: "_affiliates", type: "address[]" },
            { name: "signatures", type: "bytes[]" },
        ],
        outputs: [],
    },
] as const

// Change the chain here
const CHAIN = arbitrumSepolia

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as Address
const PRIVATE_KEY = process.env.PRIVATE_KEY as string
const MONGO_URI = process.env.MONGO_URI

async function processBatchSubmission(
    walletClient: any,
    publicClient: any,
    traders: Address[],
    affiliates: Address[],
    signatureValues: `0x${string}`[],
): Promise<void> {
    try {
        console.log("[INFO] Processing batch submission", {
            batchSize: traders.length,
        })

        const nonce = await publicClient.getTransactionCount({
            address: walletClient.account.address,
        })

        const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "batchAddAffiliateOrKolOnBehalfOf",
            args: [traders, affiliates, signatureValues],
            nonce,
            legacyTx: true,
        })

        console.log("[SUCCESS] Batch processed", {
            transactionHash: hash,
            processedCount: traders.length,
        })
    } catch (error) {
        console.error("[ERROR] Batch submission failed", {
            error: error.message,
        })
    }
}

async function main() {
    if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !MONGO_URI) {
        throw new Error("Missing required environment variables")
    }

    await mongoose.connect(MONGO_URI)
    const signatures = await mongoose.connection
        .collection("signatures")
        .find()
        .toArray()

    console.log(`[INFO] Found ${signatures.length} signatures to process`)

    if (signatures.length === 0) {
        console.log("[WARN] No signatures found in database")
        return
    }

    const traders: Address[] = []
    const affiliates: Address[] = []
    const signatureValues: `0x${string}`[] = []

    signatures.forEach((sig) => {
        if (sig.trader && sig.affiliate && sig.signature) {
            traders.push(sig.trader.toLowerCase() as Address)
            affiliates.push(sig.affiliate.toLowerCase() as Address)
            signatureValues.push(sig.signature as `0x${string}`)
        }
    })

    if (traders.length === 0) {
        console.log("[WARN] No valid signature data found")
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

    await processBatchSubmission(
        walletClient,
        publicClient,
        traders,
        affiliates,
        signatureValues,
    )

    await mongoose.disconnect()
    console.log("[INFO] Processing completed")
}

main().catch((error) => {
    console.error("[ERROR] Script failed", error)
    process.exit(1)
})
