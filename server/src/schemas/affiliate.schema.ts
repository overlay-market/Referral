import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Affiliate extends Document {
    @Prop({ required: true, unique: true })
    address: string

    @Prop({ unique: true })
    alias: string

    @Prop({ unique: true })
    aliasSignature: string

    @Prop({ default: Date.now })
    createdAt: Date
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate)