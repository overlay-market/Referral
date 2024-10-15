import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { AffiliateService } from "./affiliate.service"
import { Affiliate } from "../schemas/affiliate.schema"

describe("AffiliateService", () => {
    let service: AffiliateService
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let model: Model<Affiliate>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AffiliateService,
                {
                    provide: getModelToken(Affiliate.name),
                    useValue: {
                        new: jest.fn().mockResolvedValue(mockAffiliate),
                        constructor: jest.fn().mockResolvedValue(mockAffiliate),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        create: jest.fn(),
                        remove: jest.fn(),
                        exec: jest.fn(),
                    },
                },
            ],
        }).compile()

        service = module.get<AffiliateService>(AffiliateService)
        model = module.get<Model<Affiliate>>(getModelToken(Affiliate.name))
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    // Add more tests here...
})

const mockAffiliate = {
    address: "0x1234567890123456789012345678901234567890",
}
