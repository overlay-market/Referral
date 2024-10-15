import { createWalletClient, http, createPublicClient } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { arbitrumSepolia } from "viem/chains"

// Replace with your actual private key
const PRIVATE_KEY =
    "0x1234567890123456789012345678901234567890123456789012345678901234"

async function generateSignature() {
    const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)

    const walletClient = createWalletClient({
        account,
        chain: arbitrumSepolia,
        transport: http(),
    })

    const publicClient = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(),
    })

    const affiliate = "0x1234567890123456789012345678901234567890" // Replace with the actual affiliate address

    const domain = {
        name: "Overlay Referrals",
        version: "1.0",
    }

    const types = {
        AffiliateTo: [{ name: "affiliate", type: "address" }],
    }

    const message = {
        affiliate,
    }

    const primaryType = "AffiliateTo"

    try {
        const signature = await walletClient.signTypedData({
            account,
            domain,
            types,
            primaryType,
            message,
        })

        console.log("Signature:", signature)

        // Verify the signature
        const signatureValid = await publicClient.verifyTypedData({
            address: account.address,
            domain,
            types,
            primaryType,
            message,
            signature,
        })

        console.log("Signer Address:", account.address)
        console.log("Signature is valid:", signatureValid)

        return {
            trader: account.address,
            affiliate,
            signature,
        }
    } catch (error) {
        console.error("Error generating signature:", error)
    }
}

generateSignature().then((result) => {
    if (result) {
        console.log("Result:", result)
    }
})
