import { Controller, Post, Body } from "@nestjs/common"
import { SignatureService } from "../services/signature.service"
import { StoreSignatureDto } from "../dto/store-signature.dto"

@Controller("signatures")
export class SignaturesController {
    constructor(private readonly signatureService: SignatureService) {}

    @Post()
    async store(@Body() storeSignatureDto: StoreSignatureDto) {
        return this.signatureService.store(storeSignatureDto)
    }
}
