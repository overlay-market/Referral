import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from "@nestjs/mongoose"
import { ConfigService } from "@nestjs/config"
import { SignaturesService } from "./signatures.service"
import { Signature } from "../schemas/signature.schema"
import { Affiliate } from "../schemas/affiliate.schema"

describe("SignaturesService", () => {
    let service: SignaturesService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SignaturesService,
                {
                    provide: getModelToken(Signature.name),
                    useValue: {
                        new: jest.fn().mockResolvedValue({}),
                        constructor: jest.fn().mockResolvedValue({}),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        create: jest.fn(),
                        remove: jest.fn(),
                        exec: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(Affiliate.name),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue("some-value"),
                    },
                },
            ],
        }).compile()

        service = module.get<SignaturesService>(SignaturesService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    // Add more tests here
})
