
import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { Asset } from "./asset.entity";
import { SignatureService } from "../signatures/signature.service";
import { CreateAssetDto } from "./dto/create-asset.dto";
import { UpdateAssetDto } from "./dto/update-asset.dto";
import { ApiService } from "../api/api.service";

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
    async getAssets() {
        return await this.apiService.findAllAssets();
    }

    @Get('/:userAddress')
    @ApiResponse({status: 200, description: 'user assets', type: [Asset]})
    @ApiOperation({summary: "retrieve all user assets"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getAssetsByUser(@Param('userAddress') userAddress: string) {
        return await this.apiService.findAllAssetsByUser({userAddress: userAddress});
    }

    @Get('/asset/:userAddress/:assetId')
    @ApiResponse({status: 200, description: 'asset by assetId', type: Asset})
    @ApiOperation({summary: "retrieve asset by assetId"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'assetId', required: true, description: 'asset id', type: Number, example: 0})
    async getAsetById(@Param('userAddress') userAddress: string, @Param('assetId') assetId: string) { 
        return await this.apiService.findAssetById({assetId: Number(assetId)});
    }

    @Post('/add-asset')
    @ApiResponse({status: 201, description: 'add user asset', type: Asset})
    @ApiOperation({summary: "add user asset"})
    async createClaim(@Body() dto: CreateAssetDto) {
        if(!(await this.signatureService.verifySignature('addAsset', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExist({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        }
        return await this.apiService.createAsset({
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
        } else if(!(await this.apiService.isUserExist({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isAssetExists({assetId: dto.assetId}))) {
            throw new BadRequestException(`Asset [${dto.assetId}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        }
        return await this.apiService.updateUserAsset({
            assetId: dto.assetId,
            userAddress: dto.userAddress,
        });
    }
}