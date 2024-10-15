import {
    Injectable,
    ConflictException,
    NotFoundException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
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

        const createdSignature =
            await this.signatureModel.create(storeSignatureDto)
        return createdSignature.save()
    }
}
