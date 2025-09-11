import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import configuration from "./config/configuration"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AffiliatesController } from "./controllers/affiliates.controller"
import { SignaturesController } from "./controllers/signatures.controller"
import { AffiliateService } from "./services/affiliate.service"
import { SignatureService } from "./services/signature.service"
import { SignaturesService } from "./signatures/signatures.service"
import { Affiliate, AffiliateSchema } from "./schemas/affiliate.schema"
import { Signature, SignatureSchema } from "./schemas/signature.schema"

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("mongoUri"),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: Affiliate.name, schema: AffiliateSchema },
            { name: Signature.name, schema: SignatureSchema },
        ]),
    ],
    controllers: [AppController, AffiliatesController, SignaturesController],
    providers: [
        AppService,
        AffiliateService,
        SignatureService,
        SignaturesService,
    ],
})
export class AppModule {}
