import {
    Controller,
    Post,
    Body,
    NotFoundException,
    HttpCode,
    HttpStatus,
} from "@nestjs/common"
import { SignatureService } from "../services/signature.service"
import { StoreSignatureDto } from "../dto/store-signature.dto"

@Controller("signatures")
export class SignaturesController {
    constructor(private readonly signatureService: SignatureService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async store(@Body() storeSignatureDto: StoreSignatureDto) {
        try {
            return await this.signatureService.store(storeSignatureDto)
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException("Affiliate not found")
            }
            throw error
        }
    }
}
