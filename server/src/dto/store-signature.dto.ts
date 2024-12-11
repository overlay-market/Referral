import { Transform } from "class-transformer"
import { IsEthereumAddress, Matches } from "class-validator"

export class StoreSignatureDto {
    @Transform(({ value }) => value.toLowerCase())
    @IsEthereumAddress()
    trader: string

    @Transform(({ value }) => value.toLowerCase())
    @IsEthereumAddress()
    affiliate: string

    @Matches(/^0x[a-fA-F0-9]{130}$/, { message: "Invalid signature format" })
    signature: string
}
