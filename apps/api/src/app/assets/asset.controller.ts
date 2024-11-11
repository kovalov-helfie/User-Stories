
import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import { Asset } from "./asset.entity";
import { SignatureService } from "../signatures/signature.service";
import { CreateAssetDto } from "./dto/create-asset.dto";
import { UpdateAssetDto } from "./dto/update-asset.dto";
import { ApiService } from "../api/api.service";
import { VerifyAssetDto } from "./dto/verify-asset.dto";
import { SetTokenIdentityDto } from "./dto/set-token-identity.dto";

@ApiTags('Assets')
@Controller('/assets')
export class AssetController {
    constructor(
        private readonly apiService: ApiService,
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all assets', type: [Asset]})
    @ApiOperation({summary: "retrieve all assets"})
    @ApiQuery({name: 'withObligations', required: true, description: 'assets with obligations', type: Boolean, example: true})
    async getAssets(@Query('withObligations') withObligations: string) {
        return await this.apiService.findAllAssets({withObligations: withObligations === 'true'});
    }

    @Get(':userAddress')
    @ApiResponse({status: 200, description: 'user assets', type: [Asset]})
    @ApiOperation({summary: "retrieve all user assets"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiQuery({name: 'withObligations', required: true, description: 'assets with obligations', type: Boolean, example: true})
    async getAssetsByUser(@Param('userAddress') userAddress: string, @Query('withObligations') withObligations: string) {
        return await this.apiService.findAllAssetsByUser({userAddress: userAddress, withObligations: withObligations === 'true'});
    }

    @Get('asset/:tokenAddress')
    @ApiResponse({status: 200, description: 'asset by tokenAddress', type: Asset})
    @ApiOperation({summary: "retrieve asset by tokenAddress"})
    @ApiParam({name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getAssetById(@Param('tokenAddress') tokenAddress: string) { 
        return await this.apiService.findAssetById({tokenAddress: tokenAddress});
    }

    @Post('add-asset')
    @ApiResponse({status: 201, description: 'add user asset', type: Asset})
    @ApiOperation({summary: "add user asset"})
    async createAsset(@Body() dto: CreateAssetDto) {
        if(!(await this.signatureService.verifySignature('addAsset', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        } else if(dto.decimals <= 0 && dto.decimals > 18) {
            throw new BadRequestException(`Invalid decimals [${dto.decimals}]`)
        }
        const asset = await this.apiService.createAsset({
            tokenAddress: dto.tokenAddress,
            userAddress: dto.userAddress, 
            name: dto.name, 
            symbol: dto.symbol,
            decimals: dto.decimals
        });
        await this.apiService.createUserAsset({
            tokenAddress: dto.tokenAddress,
            userAddress: dto.userAddress, 
        });
        return asset;
    }

    @Patch('asset/update-user')
    @ApiResponse({status: 200, description: 'update userAddress on specific asset', type: Asset})
    @ApiOperation({summary: "update userAddress by tokenAddress"})
    async updateUserAsset(@Body() dto: UpdateAssetDto) {
        if(!(await this.signatureService.verifySignature('updateUserAsset', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isAssetExists({tokenAddress: dto.tokenAddress}))) {
            throw new BadRequestException(`Asset [${dto.tokenAddress}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        }
        return await this.apiService.updateUserAsset({
            tokenAddress: dto.tokenAddress,
            userAddress: dto.userAddress,
        });
    }

    @Patch('/set-asset-identity')
    @ApiResponse({status: 200, description: 'set user identity', type: Asset})
    @ApiOperation({summary: "set user identity"})
    async setIdentity(@Body() dto: SetTokenIdentityDto) {
        if(!(await this.signatureService.verifySignature('userSetTokenIdentity', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.senderAddress}))) {
            throw new ForbiddenException(`Sender [${dto.senderAddress}] does not exist`)
        } else if(!(await this.apiService.isAssetExists({tokenAddress: dto.tokenAddress}))) {
            throw new ForbiddenException(`Asset [${dto.tokenAddress}] does not exist`)
        } else if(!(await this.apiService.isAssetIdentity({tokenAddress: dto.tokenAddress}))) {
            throw new ForbiddenException(`Token identity [${dto.tokenAddress}] exists`)
        }

        return await this.apiService.setAssetIdentity({tokenAddress: dto.tokenAddress, identityAddress: dto.identityAddress});
    }

    @Patch('/verify-asset')
    @ApiResponse({status: 200, description: 'verify asset', type: Asset})
    @ApiOperation({summary: "verify asset"})
    async verifyUser(@Body() dto: VerifyAssetDto) {
        if(!(await this.signatureService.verifySignature('verifyAsset', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if(!(await this.apiService.isUserAdmin({userAddress: dto.senderAddress}))) {
            throw new ForbiddenException(`Sender [${dto.senderAddress}] is not an admin`)
        }
        if(dto.verify) {
            if(await this.apiService.isAssetVerified({tokenAddress: dto.tokenAddress})) {
                throw new BadRequestException(`Asset [${dto.tokenAddress}] is already verified`)
            } else if(!(await this.apiService.areAllTokenClaimsVerified({tokenAddress: dto.tokenAddress}))) {
                throw new BadRequestException(`User [${dto.senderAddress}] claims are not verified`)
            }
        } else {
            if(!(await this.apiService.isAssetVerified({tokenAddress: dto.tokenAddress}))) {
                throw new BadRequestException(`User [${dto.tokenAddress}] is not verified`)
            }
        }

        return await this.apiService.verifyAsset({tokenAddress: dto.tokenAddress, verify: dto.verify, country: dto.country});
    }
}