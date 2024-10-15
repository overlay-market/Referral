import { Injectable, CanActivate } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class DevModeGuard implements CanActivate {
    constructor(private configService: ConfigService) {}

    canActivate(): boolean {
        return this.configService.get<boolean>("isDevelopmentMode")
    }
}
