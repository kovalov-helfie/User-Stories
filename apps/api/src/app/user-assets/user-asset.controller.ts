
import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import { SignatureService } from "../signatures/signature.service";
import { ApiService } from "../api/api.service";
import { UserAsset } from "./user-asset.entity";
import { CreateUserAssetDto } from "./dto/create-user-asset.dto";

@ApiTags('UserAssets')
@Controller('/user-assets')
export class UserAssetController {
    constructor(
        private readonly apiService: ApiService,
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all user assests', type: [UserAsset]})
    @ApiOperation({summary: "retrieve all user assests"})
    async getUserAssets() {
        return await this.apiService.findUserAssets();
    }

    @Get('user-asset/:userAddress-:tokenAddress')
    @ApiResponse({status: 200, description: 'user assets', type: UserAsset})
    @ApiOperation({summary: "retrieve all user assets"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getUserAssetsById(@Param('userAddress') userAddress: string, @Param('tokenAddress') tokenAddress: string) {
        return await this.apiService.findUserAssetById({userAddress: userAddress, tokenAddress: tokenAddress});
    }

    @Get('has-user-asset/:userAddress-:tokenAddress')
    @ApiResponse({status: 200, description: 'user has assets', type: Boolean})
    @ApiOperation({summary: "retrieve has user assets"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getHasUserAsset(@Param('userAddress') userAddress: string, @Param('tokenAddress') tokenAddress: string) {
        return await this.apiService.hasUserAsset({userAddress: userAddress, tokenAddress: tokenAddress});
    }

    @Post('add-user-asset')
    @ApiResponse({status: 201, description: 'add user asset', type: UserAsset})
    @ApiOperation({summary: "add user asset"})
    async createAsset(@Body() dto: CreateUserAssetDto) {
        if(!(await this.signatureService.verifySignature('addUserAsset', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        } else if(!(await this.apiService.isObligationSeller({obligationId: dto.obligationId, userAddress: dto.senderAddress}))) {
            throw new BadRequestException(`Not obligation [${dto.obligationId}] seller [${dto.senderAddress}]`)
        }
        const userAsset = await this.apiService.findUserAssetById({tokenAddress: dto.tokenAddress, userAddress: dto.userAddress});
        if(userAsset === null) {
            return await this.apiService.createUserAsset({
                tokenAddress: dto.tokenAddress,
                userAddress: dto.userAddress, 
            });
        } else {
            return userAsset;
        }
    }
}