import {
    BadRequestException,
    Body,
    Controller,
    Param,
    Patch,
    HttpCode,
    HttpStatus,
} from "@nestjs/common"
import { RewardsService } from "./rewards.service"
import { UpdateRewardDto, UpdateRewardParams } from "./dto/update-reward.dto"

@Controller("rewards")
export class RewardsController {
    constructor(private readonly rewardsService: RewardsService) {}

    @Patch(":wallet")
    @HttpCode(HttpStatus.NO_CONTENT)
    async update(
        @Param() params: UpdateRewardParams,
        @Body() updateRewardDto: UpdateRewardDto,
    ) {
        try {
            await this.rewardsService.update(
                params.wallet,
                updateRewardDto,
            )
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
