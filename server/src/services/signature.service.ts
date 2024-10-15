import { Injectable, ConflictException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Signature } from "../schemas/signature.schema"
import { StoreSignatureDto } from "../dto/store-signature.dto"

@Injectable()
export class SignatureService {
    constructor(
        @InjectModel(Signature.name) private signatureModel: Model<Signature>,
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
        const createdSignature = new this.signatureModel(storeSignatureDto)
        return createdSignature.save()
    }
}
