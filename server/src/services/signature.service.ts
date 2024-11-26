import {
    Injectable,
    ConflictException,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { recoverTypedDataAddress, Hex } from "viem"
import { Signature } from "../schemas/signature.schema"
import { Affiliate } from "../schemas/affiliate.schema"
import { StoreSignatureDto } from "../dto/store-signature.dto"

@Injectable()
export class SignatureService {
    constructor(
        @InjectModel(Signature.name) private signatureModel: Model<Signature>,
        @InjectModel(Affiliate.name) private affiliateModel: Model<Affiliate>,
    ) {}

    async store(storeSignatureDto: StoreSignatureDto): Promise<Signature> {
        const existingSignature = await this.signatureModel
            .findOne({ trader: storeSignatureDto.trader })
            .exec()
        if (existingSignature) {
            throw new ConflictException(
                "Signature already exists for this trader",
            )
        }

        const affiliate = await this.affiliateModel
            .findOne({ address: storeSignatureDto.affiliate })
            .exec()
        if (!affiliate) {
            throw new NotFoundException("Affiliate not found")
        }

        // Validate the signature
        const isValid = await this.validateSignature(storeSignatureDto)
        if (!isValid) {
            throw new BadRequestException("Invalid signature")
        }

        const createdSignature =
            await this.signatureModel.create(storeSignatureDto)
        return createdSignature.save()
    }

    private async validateSignature(
        storeSignatureDto: StoreSignatureDto,
    ): Promise<boolean> {
        const domain = {
            name: "Overlay Referrals",
            version: "1.0",
        }

        const types = {
            AffiliateTo: [{ name: "affiliate", type: "address" }],
        }

        const primaryType = "AffiliateTo"

        const message = {
            affiliate: storeSignatureDto.affiliate,
        }

        try {
            const signature = storeSignatureDto.signature as Hex
            const recoveredAddress = await recoverTypedDataAddress({
                domain,
                types,
                primaryType,
                message,
                signature,
            })

            return (
                recoveredAddress.toLowerCase() ===
                storeSignatureDto.trader.toLowerCase()
            )
        } catch (error) {
            console.error("Error validating signature:", error)
            return false
        }
    }

    async checkSignature(trader: string): Promise<Signature> {
        const signature = await this.signatureModel
            .findOne({ trader: trader })
            .exec()

        return signature
    }
}
