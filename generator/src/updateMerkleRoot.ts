import fs from 'fs'
import path from 'path'
import { ethers } from 'ethers'
import 'dotenv/config'
import Generator from './generator'
import { throwErrorAndExit } from '.'
import OV_token_abi from "./abis/OV_token_abi.json";

const configPath: string = path.join(__dirname, '../config.json')

export const updateMerkleRoot = async () => {
  // Check if config exists
  if (!fs.existsSync(configPath)) throwErrorAndExit('Missing config.json. Please add.')

  // Read config
  const configFile: Buffer = fs.readFileSync(configPath)
  const configData = JSON.parse(configFile.toString())

  // Check if config contains needed keys
  if (configData['lastBlockTimestamp'] === undefined)
    throwErrorAndExit('Missing lastBlockTimestamp param in config. Please add.')
  if (configData['decimals'] === undefined)
    throwErrorAndExit('Missing decimals param in config. Please add.')
  if (configData['totalRewards'] === undefined)
    throwErrorAndExit('Missing totalRewards param in config. Please add.')
  if (configData['airdrop'] === undefined)
    throwErrorAndExit('Missing airdrop param in config. Please add.')

  // Collect config
  const decimals: number = configData.decimals
  const airdrop: Record<string, string> = configData.airdrop
  const lastBlockTimestamp: number = configData.lastBlockTimestamp
  const totalRewards: string = configData.totalRewards

  // Initialize and call generator
  const generator = new Generator(decimals, airdrop)
  generator.process(lastBlockTimestamp, totalRewards)

  // Update the merkle root in the contract
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER)
  const abi = ['function initClaimPeriod(bytes32,uint256,uint256)']
  const signer = new ethers.Wallet(process.env.AIRDROPPER_PK, provider)
  console.log('\nAirDropper wallet:', signer.address)
  const contract = new ethers.Contract(process.env.REFERRALS_ADDRESS, abi, signer)

  // validate allowance
  const ovTokenContract = new ethers.Contract(process.env.OV_TOKEN_ADDRESS, OV_token_abi, signer)
  const allowance = await ovTokenContract.allowance(signer.address, process.env.REFERRALS_ADDRESS)
  if (allowance.lt(totalRewards)) {
    console.log('\nAllowance is less than total rewards. Approving...')
    const tx = await ovTokenContract.approve(process.env.REFERRALS_ADDRESS, ethers.constants.MaxUint256)
    await tx.wait()
    console.log('\nApproved tx hash:', tx.hash)
  }

  // validate airdropper ov balance
  const ovBalance = await ovTokenContract.balanceOf(signer.address)
  if (ovBalance.lt(totalRewards)) {
    throwErrorAndExit('\nInsufficient OV balance in airdropper wallet. Please top up.')
  }

  // Note: make sure the signer has already given its approval to the Referrals contract
  const tx = await contract.initClaimPeriod(generator.getRoot(), totalRewards, lastBlockTimestamp)
  await tx.wait()
  console.log('\nRoot pushed to contract. Tx:', tx.hash)
}
