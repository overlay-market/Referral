import {
    BadRequestException,
    Body,
    Controller,
    Param,
    Put,
} from "@nestjs/common"
import { RewardsService } from "./rewards.service"
import { UpdateRewardDto, UpdateRewardParams } from "./dto/update-reward.dto"

@Controller("rewards")
export class RewardsController {
    constructor(private readonly rewardsService: RewardsService) {}

    @Put(":wallet")
    async update(
        @Param() params: UpdateRewardParams,
        @Body() updateRewardDto: UpdateRewardDto,
    ) {
        try {
            return await this.rewardsService.update(
                params.wallet,
                updateRewardDto,
            )
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
