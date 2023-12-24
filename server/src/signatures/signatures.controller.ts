import { Controller, Get, Param } from "@nestjs/common"
import { SignaturesService } from "./signatures.service"

// All the routes for this controller will be prefixed with `/signatures`
@Controller("signatures")
export class SignaturesController {
    constructor(private readonly signaturesService: SignaturesService) {}

    @Get(":account")
    requestSignature(@Param("account") account: string) {
        return this.signaturesService.requestSignature(account)
    }
}
