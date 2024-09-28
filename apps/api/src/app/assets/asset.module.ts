import { Module } from "@nestjs/common";
import { SignatureModule } from "../signatures/signature.module";
import { assetsProviders } from "./asset.providers";
import { AssetService } from "./asset.service";
import { AssetController } from "./asset.controller";
import { UserClaimModule } from "../users/user-claim.module";

@Module({providers: [AssetService, ...assetsProviders], imports: [UserClaimModule, SignatureModule], exports: [AssetService], controllers: [AssetController]})
export class AssetModule {

}