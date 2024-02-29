import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { SignaturesModule } from "./signatures/signatures.module"
import { RewardsModule } from "./rewards/rewards.module"
import configuration from "./config/configuration"

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        // Reference: https://docs.nestjs.com/techniques/mongodb#async-configuration
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("mongoUri"),
            }),
            inject: [ConfigService],
        }),
        SignaturesModule,
        RewardsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
