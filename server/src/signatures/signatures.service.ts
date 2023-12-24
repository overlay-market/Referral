import { Injectable } from "@nestjs/common"

@Injectable()
export class SignaturesService {
    requestSignature(account: string) {
        return `Requested signature for document ${account}`
    }
}
