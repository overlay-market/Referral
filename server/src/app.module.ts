import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { SignaturesModule } from "./signatures/signatures.module"

@Module({
    imports: [SignaturesModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
