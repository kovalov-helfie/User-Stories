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
import { userAssetsProviders } from "../user-assets/user-asset.providers";
import { tokenClaimsProviders } from "../token-claims/token-claim.providers";
import { tokenIdentitiesProviders } from "../token-identities/token-identity.providers";
import { tokenComplianceRequestsProviders } from "../token-compliance/token-compliance-request.providers";
import { dvdTransfersProviders } from "../dvd-transfers/dvd-transfer.providers";
import { TokenClaimController } from "../token-claims/token-claim.controller";
import { TokenIdentityController } from "../token-identities/token-identity.controller";
import { TokenComplianceController } from "../token-compliance/token-compliance-request.controller";
import { DvdTransferController } from "../dvd-transfers/dvd-transfer.controller";
import { UserAssetController } from "../user-assets/user-asset.controller";

@Module({
    providers: [
        ApiService, 
        ...usersProviders, 
        ...claimsProviders, 
        ...identitysProviders, 
        ...assetsProviders, 
        ...userAssetsProviders,
        ...obligationsProviders,
        ...tokenClaimsProviders,
        ...tokenIdentitiesProviders,
        ...tokenComplianceRequestsProviders,
        ...dvdTransfersProviders,
    ],
    imports: [FileModule, SignatureModule],
    exports: [ApiService], 
    controllers: [
        UserController, 
        ClaimController, 
        IdentityController, 
        AssetController,
        UserAssetController,
        ObligationController,
        TokenClaimController,
        TokenIdentityController,
        TokenComplianceController,
        DvdTransferController,
    ]})
export class ApiModule {

}