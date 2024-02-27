import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
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
        SignaturesModule,
        RewardsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
