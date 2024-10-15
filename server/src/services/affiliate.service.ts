import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Affiliate } from "../schemas/affiliate.schema"
import { CreateAffiliateDto } from "../dto/create-affiliate.dto"

@Injectable()
export class AffiliateService {
    constructor(
        @InjectModel(Affiliate.name) private affiliateModel: Model<Affiliate>,
    ) {}

    async create(createAffiliateDto: CreateAffiliateDto): Promise<Affiliate> {
        const createdAffiliate = new this.affiliateModel(createAffiliateDto)
        return createdAffiliate.save()
    }

    async isValid(address: string): Promise<boolean> {
        const affiliate = await this.affiliateModel.findOne({ address }).exec()
        return !!affiliate
    }
}
