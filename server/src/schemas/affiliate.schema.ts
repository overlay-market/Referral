import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Affiliate extends Document {
    @Prop({ required: true, unique: true })
    address: string

    @Prop()
    alias: string

    @Prop()
    aliasSignature: string

    @Prop({ default: Date.now })
    createdAt: Date
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate)

AffiliateSchema.index({ alias: 1 }, { unique: true, sparse: true })
AffiliateSchema.index({ aliasSignature: 1 }, { unique: true, sparse: true })
