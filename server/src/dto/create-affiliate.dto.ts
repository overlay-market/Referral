import { IsEthereumAddress } from "class-validator"

export class CreateAffiliateDto {
    @IsEthereumAddress()
    address: string
}
