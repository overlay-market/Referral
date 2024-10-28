import {
    Controller,
    Post,
    Body,
    NotFoundException,
    HttpCode,
    HttpStatus,
    Get,
    Param,
    BadRequestException,
} from "@nestjs/common"
import { SignatureService } from "../services/signature.service"
import { StoreSignatureDto } from "../dto/store-signature.dto"

@Controller("signatures")
export class SignaturesController {
    constructor(private readonly signatureService: SignatureService) { }

    @Get("check/:trader")
    @HttpCode(HttpStatus.OK)
    async checkSignature(@Param("trader") trader: string) {
        if (!trader.match(/^0x[a-fA-F0-9]{40}$/)) {
            throw new BadRequestException("Invalid Ethereum address format")
        }

        return { exists: await this.signatureService.checkSignature(trader) }
    }

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
