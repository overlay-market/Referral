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
import { SignaturesService } from "../signatures/signatures.service"
import { StoreSignatureDto } from "../dto/store-signature.dto"

@Controller("signatures")
export class SignaturesController {
    constructor(
        private readonly signatureService: SignatureService,
        private readonly signaturesService: SignaturesService,
    ) {}

    @Get("check/:trader")
    @HttpCode(HttpStatus.OK)
    async checkSignature(@Param("trader") trader: string) {
        if (!trader.match(/^0x[a-fA-F0-9]{40}$/)) {
            throw new BadRequestException("Invalid Ethereum address format")
        }

        const signature = await this.signatureService.checkSignature(trader)

        return { exists: !!signature, affiliate: signature?.affiliate ?? "" }
    }

    @Get(":account")
    async requestSignature(@Param("account") account: string) {
        try {
            return await this.signaturesService.requestSignature(account)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
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
