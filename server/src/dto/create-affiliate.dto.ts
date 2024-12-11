import { Transform } from "class-transformer"
import { IsEthereumAddress } from "class-validator"

export class CreateAffiliateDto {
    @Transform(({ value }) => value.toLowerCase())
    @IsEthereumAddress()
    address: string
}
