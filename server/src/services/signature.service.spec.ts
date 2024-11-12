import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ConfigService } from "@nestjs/config"
import { SignatureService } from "./signature.service"
import { Signature } from "../schemas/signature.schema"
import { Affiliate } from "../schemas/affiliate.schema"
import {
    ConflictException,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common"

describe("SignatureService", () => {
    let service: SignatureService
    let signatureModel: Model<Signature>
    let affiliateModel: Model<Affiliate>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SignatureService,
                {
                    provide: getModelToken(Signature.name),
                    useValue: {
                        new: jest.fn().mockResolvedValue(mockSignature),
                        constructor: jest.fn().mockResolvedValue(mockSignature),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        exec: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(Affiliate.name),
                    useValue: {
                        findOne: jest.fn(),
                        exec: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key: string) => {
                            if (key === "referrals.chainId") return 1
                            if (key === "referrals.contract")
                                return "0x1234567890123456789012345678901234567890"
                            return undefined
                        }),
                    },
                },
            ],
        }).compile()

        service = module.get<SignatureService>(SignatureService)
        signatureModel = module.get<Model<Signature>>(
            getModelToken(Signature.name),
        )
        affiliateModel = module.get<Model<Affiliate>>(
            getModelToken(Affiliate.name),
        )
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    describe("store", () => {
        it("should throw NotFoundException if affiliate is not registered", async () => {
            const storeSignatureDto = {
                trader: "0x1111111111111111111111111111111111111111",
                affiliate: "0x2222222222222222222222222222222222222222",
                signature:
                    "0x1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
            }

            jest.spyOn(signatureModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(null),
            } as any)

            jest.spyOn(affiliateModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(null),
            } as any)

            await expect(service.store(storeSignatureDto)).rejects.toThrow(
                NotFoundException,
            )
        })

        it("should throw ConflictException if signature already exists for trader", async () => {
            const storeSignatureDto = {
                trader: "0x1111111111111111111111111111111111111111",
                affiliate: "0x2222222222222222222222222222222222222222",
                signature:
                    "0x1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
            }

            jest.spyOn(signatureModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(mockSignature),
            } as any)

            await expect(service.store(storeSignatureDto)).rejects.toThrow(
                ConflictException,
            )
        })

        it("should throw BadRequestException if signature is invalid", async () => {
            const storeSignatureDto = {
                trader: "0x1111111111111111111111111111111111111111",
                affiliate: "0x2222222222222222222222222222222222222222",
                signature:
                    "0x1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
            }

            jest.spyOn(signatureModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(null),
            } as any)

            jest.spyOn(affiliateModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce({
                    address: storeSignatureDto.affiliate,
                }),
            } as any)

            // Mock the validateSignature method to return false
            jest.spyOn(service as any, "validateSignature").mockResolvedValue(
                false,
            )

            await expect(service.store(storeSignatureDto)).rejects.toThrow(
                BadRequestException,
            )
        })

        it("should store signature if affiliate is registered and signature is valid", async () => {
            const storeSignatureDto = {
                trader: "0x1111111111111111111111111111111111111111",
                affiliate: "0x2222222222222222222222222222222222222222",
                signature:
                    "0x1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
            }

            jest.spyOn(signatureModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(null),
            } as any)

            jest.spyOn(affiliateModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce({
                    address: storeSignatureDto.affiliate,
                }),
            } as any)

            // Mock the validateSignature method to return true
            jest.spyOn(service as any, "validateSignature").mockResolvedValue(
                true,
            )

            const saveMock = jest.fn().mockResolvedValueOnce(mockSignature)
            jest.spyOn(signatureModel, "create").mockReturnValueOnce({
                save: saveMock,
            } as any)

            const result = await service.store(storeSignatureDto)
            expect(result).toEqual(mockSignature)
            expect(saveMock).toHaveBeenCalled()
        })
    })
})

const mockSignature = {
    trader: "0x1111111111111111111111111111111111111111",
    affiliate: "0x2222222222222222222222222222222222222222",
    signature:
        "0x1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
}
