import { createWalletClient, http, createPublicClient } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { arbitrumSepolia } from "viem/chains"

const PRIVATE_KEY =
    "0x1234567890123456789012345678901234567890123456789012345678901234"

async function generateAliasSignature() {
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

    const domain = {
        name: "Overlay Referrals",
        version: "1.0",
    }

    const types = {
        SetAlias: [
            { name: "affiliate", type: "address" },
            { name: "alias", type: "string" },
        ],
    }

    const message = {
        affiliate: account.address,
        alias: "DAYO",
    }

    try {
        const signature = await walletClient.signTypedData({
            account,
            domain,
            types,
            primaryType: "SetAlias",
            message,
        })

        console.log("Signature:", signature)

        const signatureValid = await publicClient.verifyTypedData({
            address: account.address,
            domain,
            types,
            primaryType: "SetAlias",
            message,
            signature,
        })

        console.log("Signer Address:", account.address)
        console.log("Alias:", message.alias)
        console.log("Signature is valid:", signatureValid)

        return {
            address: account.address,
            alias: message.alias,
            signature,
        }
    } catch (error) {
        console.error("Error generating signature:", error)
    }
}

generateAliasSignature().then((result) => {
    if (result) {
        console.log("Result:", result)
    }
})
