import fs from "fs"
import path from "path"
import Generator from "./generator"

const configPath: string = path.join(__dirname, "../config.json")

const args = process.argv.slice(2)

if (args.length !== 2) {
    console.error("Wrong arguments. Use: `yarn generate:proof <address> <amount>`")
    process.exit(1)
}

const [address, amount] = args

const configFile: Buffer = fs.readFileSync(configPath)
const configData = JSON.parse(configFile.toString())

if (configData["airdrop"] === undefined || configData["decimals"] === undefined) {
    console.error("Missing airdrop or decimals param in config. Please add.")
    process.exit(1)
}

const decimals: number = configData.decimals
const airdrop: Record<string, string> = configData.airdrop

const generator = new Generator(decimals, airdrop)
const root = generator.getRoot()
const proof = generator.generateProof(address, amount)
const leaf = generator.generateLeaf(address, amount)

if (!generator.merkleTree.verify(proof, leaf, root))
    throw new Error("Error generating proof")

console.log(`Proof for address ${address} with amount ${amount}:`)
console.log(proof)
