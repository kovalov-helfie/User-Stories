import { Injectable } from "@nestjs/common";
import { recoverMessageAddress, Hex } from "viem";

@Injectable()
export class SignatureService {
    async verifySignature(methodStr:string, signature: string, address: string) {
        const message = `You [${address}] are going to sign this message for method [${methodStr}]`
        const recoveredAddress = await recoverMessageAddress({
            message: message,
            signature: signature as Hex
        })
        return recoveredAddress.toLowerCase() === address.toLowerCase()
    }
}