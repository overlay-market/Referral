import { Transform } from "class-transformer"

export class AliasParamDto {
    @Transform(({ value }) => value.toLowerCase())
    alias: string
}
