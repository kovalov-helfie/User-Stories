import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { Identity } from "./identity.entity";
import { SignatureService } from "../signatures/signature.service";
import { CreateIdentityDto } from "./dto/create-identity.dto";
import { ApiService } from "../api/api.service";

@ApiTags('Identities')
@Controller('/identities')
export class IdentityController { 
    constructor(
        private readonly apiService: ApiService,
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all identities', type: [Identity]})
    @ApiOperation({summary: "retrieve all identities"})
    async getIdentities() {
        return await this.apiService.findAllIdentities();
    }

    @Get('/:identityAddress')
    @ApiResponse({status: 200, description: 'identity', type: Identity})
    @ApiOperation({summary: "retrieve identity by address"})
    @ApiParam({name: 'identityAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getIdentity(@Param('identityAddress') identityAddress: string) {
        return await this.apiService.findIdentity({identityAddress: identityAddress});
    }

    @Post('/add-identity')
    @ApiResponse({status: 201, description: 'add identity', type: Identity})
    @ApiOperation({summary: "add identity"})
    async createUser(@Body() dto: CreateIdentityDto) {
        if(!(await this.signatureService.verifySignature('createIdentity', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if(await this.apiService.isIdentityExist({identityAddress: dto.identityAddress})) {
            throw new BadRequestException(`Identity [${dto.identityAddress}] already exists`)
        } else if(await this.apiService.isUserExists({userAddress: dto.senderAddress})) {
            throw new BadRequestException(`User [${dto.senderAddress}] does not exists`)
        } 
        return await this.apiService.createIdentity({
            identityAddress: dto.identityAddress,
            initialOwnerAddress: dto.senderAddress
        });
    }
}