import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { TokenIdentity } from "./token-identity.entity";
import { SignatureService } from "../signatures/signature.service";
import { CreateTokenIdentityDto } from "./dto/create-token-identity.dto";
import { ApiService } from "../api/api.service";

@ApiTags('TokenIdentities')
@Controller('/token-identities')
export class TokenIdentityController { 
    constructor(
        private readonly apiService: ApiService,
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all token identities', type: [TokenIdentity]})
    @ApiOperation({summary: "retrieve all token identities"})
    async getTokenIdentities() {
        return await this.apiService.findAllTokenIdentities();
    }

    @Get('/:tokenIdentityAddress')
    @ApiResponse({status: 200, description: 'token identity', type: TokenIdentity})
    @ApiOperation({summary: "retrieve token identity by address"})
    @ApiParam({name: 'identityAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getTokenIdentity(@Param('identityAddress') identityAddress: string) {
        return await this.apiService.findTokenIdentity({identityAddress: identityAddress});
    }

    @Post('/add-token-identity')
    @ApiResponse({status: 201, description: 'add identity', type: TokenIdentity})
    @ApiOperation({summary: "add identity"})
    async createTokenIdentity(@Body() dto: CreateTokenIdentityDto) {
        if(!(await this.signatureService.verifySignature('createTokenIdentity', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if((await this.apiService.isTokenIdentityExist({identityAddress: dto.identityAddress}))) {
            throw new BadRequestException(`Token identity [${dto.identityAddress}] already exists`)
        } else if(!(await this.apiService.isAssetExists({tokenAddress: dto.tokenAddress}))) {
            throw new BadRequestException(`User [${dto.senderAddress}] does not exists`)
        } 
        return await this.apiService.createTokenIdentity({
            identityAddress: dto.identityAddress,
            initialOwnerAddress: dto.senderAddress
        });
    }
}