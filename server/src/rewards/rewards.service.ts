import { Injectable } from "@nestjs/common"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import { AirdropCampaign } from "./schemas/airdrop-campaign.schema"
import { UpdateRewardDto } from "./dto/update-reward.dto"

@Injectable()
export class RewardsService {
    constructor(
        @InjectModel(AirdropCampaign.name)
        private campaignModel: Model<AirdropCampaign>,
    ) {}

    async update(wallet: string, updateRewardDto: UpdateRewardDto) {
        this.campaignModel
            .findOneAndUpdate(
                { name: updateRewardDto.campaign },
                {
                    $set: {
                        [`rewards.${wallet}`]: updateRewardDto.amount,
                        [`proofs.${wallet}`]: updateRewardDto.proof,
                    },
                },
                { upsert: true },
            )
            .exec()
    }
}
