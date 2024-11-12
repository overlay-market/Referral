import { Test, TestingModule } from "@nestjs/testing"
import { SignaturesController } from "./signatures.controller"
import { SignaturesService } from "./signatures.service"

describe("SignaturesController", () => {
    let controller: SignaturesController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SignaturesController],
            providers: [
                {
                    provide: SignaturesService,
                    useValue: {
                        store: jest.fn(),
                    },
                },
            ],
        }).compile()

        controller = module.get<SignaturesController>(SignaturesController)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })

    // Add more tests here
})
