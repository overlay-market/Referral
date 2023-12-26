import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { SignaturesModule } from "./signatures/signatures.module"
import configuration from "./config/configuration"

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        SignaturesModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
