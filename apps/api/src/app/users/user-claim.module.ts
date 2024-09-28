import { Module } from "@nestjs/common";
import { UserClaimService } from "./user-claim.service";
import { usersProviders } from "./user.providers";
import { UserController } from "./user.controller";
import { SignatureModule } from "../signatures/signature.module";
import { ClaimController } from "../claims/claim.controller";
import { claimsProviders } from "../claims/claim.providers";
import { FileModule } from "../files/file.module";

@Module({
    providers: [UserClaimService, ...usersProviders, ...claimsProviders],
    imports: [SignatureModule, FileModule], 
    exports: [UserClaimService], 
    controllers: [UserController, ClaimController]})
export class UserClaimModule {

}