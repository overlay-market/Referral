import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type AirdropCampaignDocument = HydratedDocument<AirdropCampaign>

type wallet = string

@Schema()
export class AirdropCampaign {
    @Prop()
    name: string

    @Prop({ type: Map, of: [String] })
    proofs: Record<wallet, string[]>

    @Prop({ type: Map, of: Number })
    rewards: Record<wallet, number>
}

export const AirdropCampaignSchema =
    SchemaFactory.createForClass(AirdropCampaign)
