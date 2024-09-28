
import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { Asset } from "./asset.entity";
import { SignatureService } from "../signatures/signature.service";
import { UserClaimService } from "../users/user-claim.service";
import { AssetService } from "./asset.service";
import { CreateAssetDto } from "./dto/create-asset.dto";
import { UpdateAssetDto } from "./dto/update-asset.dto";

@ApiTags('Assets')
@Controller('/assets')
export class AssetController {
    constructor(
        private readonly assetService: AssetService,
        private readonly userClaimService: UserClaimService, 
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all assets', type: [Asset]})
    @ApiOperation({summary: "retrieve all assets"})
    async getAssets() {
        return await this.assetService.findAllAssets();
    }

    @Get('/:userAddress')
    @ApiResponse({status: 200, description: 'user assets', type: [Asset]})
    @ApiOperation({summary: "retrieve all user assets"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getAssetsByUser(@Param('userAddress') userAddress: string) {
        return await this.assetService.findAllAssetsByUser({userAddress: userAddress});
    }

    @Get('/asset/:userAddress/:assetId')
    @ApiResponse({status: 200, description: 'asset by assetId', type: Asset})
    @ApiOperation({summary: "retrieve asset by assetId"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'assetId', required: true, description: 'asset id', type: Number, example: 0})
    async getAsetById(@Param('userAddress') userAddress: string, @Param('assetId') assetId: string) { 
        return await this.assetService.findAssetById({assetId: Number(assetId)});
    }

    @Post('/add-asset')
    @ApiResponse({status: 201, description: 'add user asset', type: Asset})
    @ApiOperation({summary: "add user asset"})
    async createClaim(@Body() dto: CreateAssetDto) {
        if(!(await this.signatureService.verifySignature('addAsset', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.userClaimService.isUserExist({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        }
        return await this.assetService.createAsset({
            userAddress: dto.userAddress, 
            name: dto.name, 
            description: dto.description,
            type: dto.type
        });
    }

    @Patch('asset/update-user')
    @ApiResponse({status: 200, description: 'update userAddress on specific asset', type: Asset})
    @ApiOperation({summary: "update userAddress by assetId"})
    async updateDocgen(@Body() dto: UpdateAssetDto) {
        if(!(await this.signatureService.verifySignature('updateDocgen', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.userClaimService.isUserExist({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.assetService.isAssetExists({assetId: dto.assetId}))) {
            throw new BadRequestException(`Asset [${dto.assetId}] does not exist`)
        }
        return await this.assetService.updateUserAsset({
            assetId: dto.assetId,
            userAddress: dto.userAddress,
        });
    }
}