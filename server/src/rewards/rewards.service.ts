import { Injectable } from "@nestjs/common"
import { UpdateRewardDto } from "./dto/update-reward.dto"

@Injectable()
export class RewardsService {
    async update(wallet: string, updateRewardDto: UpdateRewardDto) {
        return {
            wallet,
            ...updateRewardDto,
        }
    }
}
