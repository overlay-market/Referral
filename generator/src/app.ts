import fs from "fs"
import path from "path"
import Generator from "./generator"

const configPath: string = path.join(__dirname, "../config.json")

/**
 * Throws error and exists process
 * @param {string} error to log
 */
function throwErrorAndExit(error: string): void {
    console.error(error)
    process.exit(1)
}

// Check if config exists
if (!fs.existsSync(configPath))
    throwErrorAndExit("Missing config.json. Please add.")

// Read config
const configFile: Buffer = fs.readFileSync(configPath)
const configData = JSON.parse(configFile.toString())

// Check if config contains airdrop key
if (configData["airdrop"] === undefined) throwErrorAndExit("Missing airdrop param in config. Please add.")
if (configData["decimals"] === undefined) throwErrorAndExit("Missing decimals param in config. Please add.")

// Collect config
const decimals: number = configData.decimals
const airdrop: Record<string, string> = configData.airdrop

// Initialize and call generator
const generator = new Generator(decimals, airdrop)
generator.process()