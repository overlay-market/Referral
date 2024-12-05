import {
    BadRequestException,
    ConflictException,
    Injectable,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Affiliate } from "../schemas/affiliate.schema"
import { CreateAffiliateDto } from "../dto/create-affiliate.dto"
import { CreateAliasDto } from "../dto/create-alias.dto"
import { getAddress, Hex, recoverTypedDataAddress } from "viem"

@Injectable()
export class AffiliateService {
    constructor(
        @InjectModel(Affiliate.name) private affiliateModel: Model<Affiliate>,
    ) {}

    async create(createAffiliateDto: CreateAffiliateDto): Promise<Affiliate> {
        const createdAffiliate = new this.affiliateModel(createAffiliateDto)
        return createdAffiliate.save()
    }

    async getState(
        address: string,
    ): Promise<{ isValid: boolean; alias: string }> {
        const affiliate = await this.affiliateModel.findOne({ address }).exec()
        return {
            isValid: !!affiliate,
            alias: affiliate?.alias || null,
        }
    }

    async getAffiliateByAlias(alias: string): Promise<Affiliate> {
        const aliasObj = await this.affiliateModel.findOne({ alias }).exec()
        return aliasObj
    }

    private getDomain() {
        return {
            name: "Overlay Referrals",
            version: "1.0",
        } as const
    }

    private getTypes() {
        return {
            SetAlias: [
                { name: "affiliate", type: "address" },
                { name: "alias", type: "string" },
            ],
        } as const
    }

    async addAlias(createAliasDto: CreateAliasDto): Promise<Affiliate> {
        const { address, alias, signature } = createAliasDto

        const existingAlias = await this.getAffiliateByAlias(alias)
        if (existingAlias) {
            throw new ConflictException("Alias already taken")
        }

        const affiliate = await this.affiliateModel.findOne({ address }).exec()
        if (!affiliate) {
            throw new BadRequestException("Affiliate not found")
        }
        if (affiliate.alias) {
            throw new BadRequestException("Affiliate already has an alias")
        }

        try {
            const recoveredAddress = await recoverTypedDataAddress({
                domain: this.getDomain(),
                types: this.getTypes(),
                primaryType: "SetAlias",
                message: { affiliate: getAddress(address), alias },
                signature: signature as Hex,
            })

            if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
                throw new BadRequestException("Invalid signature")
            }

            affiliate.alias = alias
            affiliate.aliasSignature = signature

            return affiliate.save()
        } catch (error) {
            console.error("Error validating signature:", error)
            throw new BadRequestException("Invalid signature")
        }
    }
}
