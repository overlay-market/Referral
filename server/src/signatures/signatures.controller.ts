import { BadRequestException, Controller, Get, Param } from "@nestjs/common"
import { SignaturesService } from "./signatures.service"

// All the routes for this controller will be prefixed with `/signatures`
@Controller("signatures")
export class SignaturesController {
    constructor(private readonly signaturesService: SignaturesService) {}

    @Get(":account")
    async requestSignature(@Param("account") account: string) {
        try {
            return await this.signaturesService.requestSignature(account)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
