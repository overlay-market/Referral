import { Controller, Post, Body, Get, Param, UseGuards } from "@nestjs/common"
import { AffiliateService } from "../services/affiliate.service"
import { CreateAffiliateDto } from "../dto/create-affiliate.dto"
import { CreateAliasDto } from "../dto/create-alias.dto"
import { DevModeGuard } from "../guards/dev-mode.guard"

@Controller("affiliates")
export class AffiliatesController {
    constructor(private readonly affiliateService: AffiliateService) {}

    @Post()
    @UseGuards(DevModeGuard)
    async create(@Body() createAffiliateDto: CreateAffiliateDto) {
        return this.affiliateService.create(createAffiliateDto)
    }

    @Get(":address")
    async isValid(@Param("address") address: string) {
        return { isValid: await this.affiliateService.isValid(address) }
    }

    @Get("/aliases/:alias")
    async affiliateByAlias(@Param("alias") alias: string) {
        return await this.affiliateService.getAffiliateByAlias(alias)
    }

    @Post("/aliases/")
    async createAlias(@Body() createAliasDto: CreateAliasDto) {
        return await this.affiliateService.addAlias(createAliasDto)
    }
}
