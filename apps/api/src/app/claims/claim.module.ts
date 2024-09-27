import { Module } from "@nestjs/common";
import { ClaimService } from "./claim.service";
import { claimsProviders } from "./claim.providers";
import { ClaimController } from "./claim.controller";
import { SignatureModule } from "../signatures/signature.module";
import { UserModule } from "../users/user.module";

@Module({providers: [ClaimService, ...claimsProviders], imports: [UserModule, SignatureModule], exports: [ClaimService], controllers: [ClaimController]})
export class ClaimModule {

}