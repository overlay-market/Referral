import { createConfig } from './createConfig'
import { updateMerkleRoot } from './updateMerkleRoot'

/**
 * Throws error and exists process
 * @param {string} error to log
 */
export function throwErrorAndExit(error: string): void {
  console.error(error)
  process.exit(1)
}

async function main() {
  // Check if process.env contains needed keys
  if (!process.env.RPC_PROVIDER)
    throwErrorAndExit('Missing RPC_PROVIDER in process.env. Please add.')
  if (!process.env.AIRDROPPER_PK)
    throwErrorAndExit('Missing AIRDROPPER_PK in process.env. Please add.')
  if (!process.env.REFERRALS_ADDRESS)
    throwErrorAndExit('Missing REFERRALS_ADDRESS in process.env. Please add.')
  if (!process.env.OV_TOKEN_ADDRESS)
    throwErrorAndExit('Missing OV_TOKEN_ADDRESS in process.env. Please add.')
  if (!process.env.REWARDS_API_URI)
    throwErrorAndExit('Missing REWARDS_API_URI in process.env. Please add.')
  if (!process.env.REWARDS_API_TOKEN)
    throwErrorAndExit('Missing REWARDS_API_TOKEN in process.env. Please add.')
  if (!process.env.SUBGRAPH) throwErrorAndExit('Missing SUBGRAPH in process.env. Please add.')

  console.log('Starting rewards update process...')

  await createConfig()

  console.log(`\nPlease verify the summary above. Do you want to continue? (y/n)`)
  const response = await new Promise<string>((resolve) => {
    process.stdin.once('data', (data) => resolve(data.toString().trim()))
  })

  if (response !== 'y') {
    console.log('\nMerkle root update aborted. No changes were made on the contract. Exiting...')
    process.exit(0)
  }

  console.log('\nUpdating Merkle root on contract...')
  await updateMerkleRoot()
  
  process.exit(0)
}

main()
