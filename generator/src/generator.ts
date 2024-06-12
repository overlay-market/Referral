import fs from "fs"
import path from "path"
import keccak256 from "keccak256"
import MerkleTree from "merkletreejs"
import { getAddress, parseUnits, solidityKeccak256 } from "ethers/lib/utils"

// Airdrop recipient addresses and scaled token values
type AirdropRecipient = {
    // Recipient address
    address: string
    // Scaled-to-decimals token value
    value: string
}

export default class Generator {
    // Airdrop recipients
    recipients: AirdropRecipient[] = []
    merkleTree: MerkleTree

    /**
     * Setup generator
     * @param {number} decimals of token
     * @param {Record<string, string>} airdrop address to token claim mapping
     */
    constructor(decimals: number, airdrop: Record<string, string>) {
        // For each airdrop entry
        for (const [address, tokens] of Object.entries(airdrop)) {
            // Push:
            this.recipients.push({
                // Checksum address
                address: getAddress(address),
                // Scaled number of tokens claimable by recipient
                value: parseUnits(tokens, decimals).toString(),
            })
        }

        // Generate merkle tree
        this.merkleTree = new MerkleTree(
            // Generate leafs
            this.recipients.map(({ address, value }) =>
                this.generateLeaf(address, value)
            ),
            // Hashing function
            keccak256,
            { sortPairs: true }
        )
    }

    /**
     * Generate Merkle Tree leaf from address and value
     * @param {string} address of airdrop claimee
     * @param {string} value of airdrop tokens to claimee
     * @returns {Buffer} Merkle Tree node
     */
    generateLeaf(address: string, value: string): Buffer {
        return Buffer.from(
            // Hash in appropriate Merkle format
            solidityKeccak256(["address", "uint256"], [address, value]).slice(
                2
            ),
            "hex"
        )
    }

    process(rootCreationTimestamp: number, totalRewards: string): void {
        // Collect and log merkle root
        const merkleRoot: string = this.merkleTree.getHexRoot()
        console.info(`\nGenerated Merkle root: ${merkleRoot} for t=${rootCreationTimestamp}`)
        console.log(`Total rewards: ${totalRewards}`)

        // Collect and save merkle tree + root
        fs.writeFileSync(
            // Output to merkle.json
            path.join(__dirname, `../trees/merkle_${rootCreationTimestamp}.json`),
            // Root + full tree
            JSON.stringify({
                merkleRoot,
                lastUpdateTimestamp: rootCreationTimestamp,
                totalRewards,
                tree: this.merkleTree,
            })
        )
        console.info(`\~Generated merkle tree and root saved to \`trees/merkle_${rootCreationTimestamp}.json\``)
    }

    generateProof(address: string, amount: string): string[] {
        const leaf: Buffer = this.generateLeaf(address, amount)
        return this.merkleTree.getHexProof(leaf)
    }

    getRoot(): string {
        return this.merkleTree.getHexRoot()
    }
}
