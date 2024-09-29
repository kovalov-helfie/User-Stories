import { Module } from "@nestjs/common";
import { ClaimController } from "../claims/claim.controller";
import { IdentityController } from "../identities/identity.controller";
import { AssetController } from "../assets/asset.controller";
import { ApiService } from "./api.service";
import { UserController } from "../users/user.controller";
import { FileModule } from "../files/file.module";
import { SignatureModule } from "../signatures/signature.module";
import { usersProviders } from "../users/user.providers";
import { claimsProviders } from "../claims/claim.providers";
import { identitysProviders } from "../identities/identity.providers";
import { assetsProviders } from "../assets/asset.providers";
import { obligationsProviders } from "../obligations/obligation.providers";
import { ObligationController } from "../obligations/obligation.controller";

@Module({
    providers: [ApiService, ...usersProviders, ...claimsProviders, ...identitysProviders, ...assetsProviders, ...obligationsProviders],
    imports: [FileModule, SignatureModule],
    exports: [ApiService], 
    controllers: [UserController, ClaimController, IdentityController, AssetController, ObligationController]})
export class ApiModule {

}