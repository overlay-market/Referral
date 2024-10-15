import { IsEthereumAddress, IsString } from "class-validator"

export class StoreSignatureDto {
    @IsEthereumAddress()
    trader: string

    @IsEthereumAddress()
    affiliate: string

    @IsString()
    signature: string
}
