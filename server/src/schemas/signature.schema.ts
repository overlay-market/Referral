import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Signature extends Document {
    @Prop({ required: true, unique: true, lowercase: true })
    trader: string

    @Prop({ required: true, lowercase: true })
    affiliate: string

    @Prop({ required: true })
    signature: string

    @Prop({ default: Date.now })
    createdAt: Date
}

export const SignatureSchema = SchemaFactory.createForClass(Signature)
