import { IsNotEmpty, IsIn, Min, IsArray, IsString } from "class-validator"
import { registerDecorator, ValidationOptions } from "class-validator"
import { ethers } from "ethers"

// Reference: https://www.npmjs.com/package/class-validator#custom-validation-classes
export function IsEthAddress(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isEthAddress",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return ethers.isAddress(value)
                },
                defaultMessage() {
                    // $value will be replaced with the value the user sent
                    return "invalid wallet ($value)"
                },
            },
        })
    }
}

export class UpdateRewardParams {
    @IsEthAddress()
    wallet: string
}

export class UpdateRewardDto {
    @IsNotEmpty()
    @IsIn(["referral"])
    program: string

    @IsNotEmpty()
    @Min(0)
    amount: number

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    proof: string[]
}
