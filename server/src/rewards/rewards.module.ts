import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import {
    AirdropCampaign,
    AirdropCampaignSchema,
} from "./schemas/airdrop-campaign.schema"
import { RewardsController } from "./rewards.controller"
import { RewardsService } from "./rewards.service"

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AirdropCampaign.name, schema: AirdropCampaignSchema },
        ]),
    ],
    controllers: [RewardsController],
    providers: [RewardsService],
})
export class RewardsModule {}
