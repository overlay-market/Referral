import { Transform } from "class-transformer"
import {
    IsAlphanumeric,
    IsEthereumAddress,
    Length,
    Matches,
} from "class-validator"

export class CreateAliasDto {
    @Transform(({ value }) => value.toLowerCase())
    @IsEthereumAddress()
    address: string

    @Transform(({ value }) => value.toLowerCase())
    @IsAlphanumeric(undefined, {
        message: "Alias can only contain letters and numbers",
    })
    @Length(3, 8, { message: "Alias must be between 3 and 8 characters" })
    alias: string

    @Matches(/^0x[a-fA-F0-9]{130}$/, { message: "Invalid signature format" })
    signature: string
}
