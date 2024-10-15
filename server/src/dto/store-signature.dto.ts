import { IsEthereumAddress, Matches } from "class-validator"

export class StoreSignatureDto {
    @IsEthereumAddress()
    trader: string

    @IsEthereumAddress()
    affiliate: string

    @Matches(/^0x[a-fA-F0-9]{130}$/, { message: "Invalid signature format" })
    signature: string
}
