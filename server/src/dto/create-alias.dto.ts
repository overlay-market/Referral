import {
    IsAlphanumeric,
    IsEthereumAddress,
    Length,
    Matches,
} from "class-validator"

export class CreateAliasDto {
    @IsEthereumAddress()
    address: string

    @IsAlphanumeric()
    @Length(3, 8, { message: "Alias must be between 3 and 8 characters" })
    alias: string

    @Matches(/^0x[a-fA-F0-9]{130}$/, { message: "Invalid signature format" })
    signature: string
}
