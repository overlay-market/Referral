import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { SignatureService } from "./signature.service"
import { Signature } from "../schemas/signature.schema"
import { Affiliate } from "../schemas/affiliate.schema"
import { ConflictException, NotFoundException } from "@nestjs/common"

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
                trader: "0xtrader",
                affiliate: "0xaffiliate",
                signature: "0xsignature",
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

        it("should store signature if affiliate is registered", async () => {
            const storeSignatureDto = {
                trader: "0xtrader",
                affiliate: "0xaffiliate",
                signature: "0xsignature",
            }

            jest.spyOn(signatureModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(null),
            } as any)

            jest.spyOn(affiliateModel, "findOne").mockReturnValue({
                exec: jest
                    .fn()
                    .mockResolvedValueOnce({ address: "0xaffiliate" }),
            } as any)

            const saveMock = jest.fn().mockResolvedValueOnce(mockSignature)
            jest.spyOn(signatureModel, "create").mockImplementationOnce(
                () =>
                    ({
                        save: saveMock,
                    }) as any,
            )

            const result = await service.store(storeSignatureDto)
            expect(result).toEqual(mockSignature)
            expect(saveMock).toHaveBeenCalled()
        })

        it("should throw ConflictException if signature already exists for trader", async () => {
            const storeSignatureDto = {
                trader: "0xtrader",
                affiliate: "0xaffiliate",
                signature: "0xsignature",
            }

            jest.spyOn(signatureModel, "findOne").mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(mockSignature),
            } as any)

            await expect(service.store(storeSignatureDto)).rejects.toThrow(
                ConflictException,
            )
        })
    })
})

const mockSignature = {
    trader: "0xtrader",
    affiliate: "0xaffiliate",
    signature: "0xsignature",
}
