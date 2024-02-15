import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"
import { ethers } from "ethers"

@Injectable()
export class SignaturesService {
    constructor(private configService: ConfigService) { }

    async requestSignature(account: string) {
        const subgraphUrl = this.configService.get<string>("subgraphUrl")
        const signingKey = this.configService.get<string>("signingKey")
        const minTradingVolume = this.configService.get<bigint>(
            "referrals.minTradingVolume",
        )
        const contract = this.configService.get<string>("referrals.contract")
        const chainId = this.configService.get<number>("referrals.chainId")

        const query = `query GetOvlTotalVolumeTraded {
            account(id: "${account}") {
                ovlVolumeTraded
            }
        }`
        const variables = {}
        const user = (await axios.post(subgraphUrl, { query, variables })).data
            .data.account

        const ovlVolumeTraded = user ? BigInt(user.ovlVolumeTraded) : 0n

        if (ovlVolumeTraded < minTradingVolume)
            throw new Error("Trading volume is below the minimum")

        const signer = new ethers.Wallet(signingKey)
        // Reference: https://docs.ethers.org/v6/cookbook/signing/
        const message = ethers.solidityPackedKeccak256(
            ["address", "address", "uint"],
            [account, contract, chainId],
        )

        const signature = await signer.signMessage(ethers.getBytes(message))

        return {
            ovlVolumeTraded: ethers.formatEther(ovlVolumeTraded),
            signature,
        }
    }
}
