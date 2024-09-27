import { Module } from "@nestjs/common";
import { ClaimService } from "./claim.service";
import { claimsProviders } from "./claim.providers";
import { ClaimController } from "./claim.controller";

@Module({providers: [ClaimService, ...claimsProviders], exports: [ClaimService], controllers: [ClaimController]})
export class ClaimModule {

}