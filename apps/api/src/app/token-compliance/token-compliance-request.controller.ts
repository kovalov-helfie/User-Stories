import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { TokenComplianceRequest } from "./token-compliance-request.entity";
import { SignatureService } from "../signatures/signature.service";
import { CreateTokenComplianceRequestDto } from "./dto/create-token-compliance-request.dto";
import { ApiService } from "../api/api.service";
import { ExecuteStatus } from "../types";
import { VerifyTokenComplianceRequestDto } from "./dto/verify-token-compliance-request.dto";

@ApiTags('TokenComplianceRequests')
@Controller('/token-compliance-requests')
export class TokenComplianceController {
    constructor(
        private readonly apiService: ApiService,
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({ status: 200, description: 'all token compliances', type: [TokenComplianceRequest] })
    @ApiOperation({ summary: "retrieve all token compliances" })
    async getTokenComplianceRequests() {
        return await this.apiService.findAllTokenComplianceRequests();
    }

    @Get('/all-for-admin')
    @ApiResponse({ status: 200, description: 'all token compliances for admin', type: [TokenComplianceRequest] })
    @ApiOperation({ summary: "retrieve all token compliances for admin" })
    async getTokenComplianceRequestsForAdmin() {
        return await this.apiService.findAllTokenComplianceRequestsForAdmin();
    }

    @Get('/:tokenAddress')
    @ApiResponse({ status: 200, description: 'token compliance requests by token', type: [TokenComplianceRequest] })
    @ApiOperation({ summary: "retrieve token compliance requests by token" })
    @ApiParam({ name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' })
    async getTokenComplianceRequestsByToken(@Param('tokenAddress') tokenAddress: string) {
        return await this.apiService.findTokenComplianceRequestsByToken({ tokenAddress: tokenAddress });
    }

    @Get('/:userAddress')
    @ApiResponse({ status: 200, description: 'token compliance requests by user', type: [TokenComplianceRequest] })
    @ApiOperation({ summary: "retrieve token compliance requests by user" })
    @ApiParam({ name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' })
    async getTokenComplianceRequestsByUser(@Param('userAddress') userAddress: string) {
        return await this.apiService.findTokenComplianceRequestsByUser({ userAddress: userAddress });
    }

    @Get('/:tokenAddress-:userAddress')
    @ApiResponse({ status: 200, description: 'token compliance requests by user and token', type: [TokenComplianceRequest] })
    @ApiOperation({ summary: "retrieve token compliance requests by user and token" })
    @ApiParam({ name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' })
    @ApiParam({ name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' })
    async getTokenComplianceRequestByTokenUser(@Param('tokenAddress') tokenAddress: string, @Param('userAddress') userAddress: string) {
        return await this.apiService.findTokenComplianceRequestByTokenUser({ tokenAddress: tokenAddress, userAddress: userAddress });
    }

    @Get('token-compliance-request-exists/:tokenAddress-:userAddress')
    @ApiResponse({ status: 200, description: 'existance Processing request by user and token', type: Boolean })
    @ApiOperation({ summary: "retrieve if exists Processing request by user and token" })
    @ApiParam({ name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' })
    @ApiParam({ name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' })
    async getIsProcessingTokenComplianceRequest(@Param('tokenAddress') tokenAddress: string, @Param('userAddress') userAddress: string) {
        return await this.apiService.isTokenComplianceStatusProcessing({ tokenAddress: tokenAddress, userAddress: userAddress });
    }


    @Get('token-compliance-request/:id')
    @ApiResponse({ status: 200, description: 'token compliance request by id', type: TokenComplianceRequest })
    @ApiOperation({ summary: "retrieve token compliance request by id" })
    @ApiParam({name: 'id', required: true, description: 'id', type: Number, example: 0})
    async getTokenComplianceRequest(@Param('id') id: string) {
        return await this.apiService.findTokenComplianceRequestById({id: Number(id)});
    }

    @Post('/add-token-compliance-request')
    @ApiResponse({ status: 201, description: 'add token compliance request', type: TokenComplianceRequest })
    @ApiOperation({ summary: "add token compliance request" })
    async createTokenComplianceRequest(@Body() dto: CreateTokenComplianceRequestDto) {
        if (!(await this.signatureService.verifySignature('createTokenComplianceRequest', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if (!(await this.apiService.isUserExists({ userAddress: dto.senderAddress }))) {
            throw new BadRequestException(`User [${dto.senderAddress}] does not exist`)
        } else if (!(await this.apiService.isUserVerified({ userAddress: dto.senderAddress }))) {
            throw new BadRequestException(`User [${dto.senderAddress}] is not verified`)
        } else if (!(await this.apiService.hasUserAsset({ tokenAddress: dto.tokenAddress, userAddress: dto.senderAddress }))) {
            throw new BadRequestException(`User [${dto.senderAddress}] doesnt have an asset [${dto.tokenAddress}]`)
        } else if ((await this.apiService.isTokenComplianceStatusProcessing({ tokenAddress: dto.tokenAddress, userAddress: dto.senderAddress }))) {
            throw new BadRequestException(`Token Compliance Request [${dto.senderAddress}-${dto.senderAddress}] is already viewed`)
        }
        return await this.apiService.createTokenComplianceRequest({
            tokenAddress: dto.tokenAddress,
            userAddress: dto.senderAddress,
            amount: dto.amount
        });
    }

    @Patch('/verify-token-compliance-request')
    @ApiResponse({ status: 200, description: 'verify token compliance request', type: TokenComplianceRequest })
    @ApiOperation({ summary: "verify token compliance request" })
    async verifyTokenComplianceRequest(@Body() dto: VerifyTokenComplianceRequestDto) {
        if (!(await this.signatureService.verifySignature('verifyTokenComplianceRequest', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`Sender [${dto.senderAddress}] not authorized`)
        } else if (!(await this.apiService.isUserAdmin({ userAddress: dto.senderAddress }))) {
            throw new BadRequestException(`Sender [${dto.senderAddress}] not admin`)
        } else if (!(await this.apiService.isUserVerified({ userAddress: dto.userAddress }))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        } else if (!(await this.apiService.hasUserAsset({ tokenAddress: dto.tokenAddress, userAddress: dto.userAddress }))) {
            throw new BadRequestException(`User [${dto.userAddress}] doesnt have an asset [${dto.tokenAddress}]`)
        } else if (!(await this.apiService.isTokenComplianceStatusProcessing({ tokenAddress: dto.tokenAddress, userAddress: dto.userAddress }))) {
            throw new BadRequestException(`Token Compliance Request [${dto.tokenAddress}-${dto.userAddress}] is already viewed`)
        }

        const status = dto.verify ? ExecuteStatus.EXECUTED : ExecuteStatus.CANCELED;
        return await this.apiService.executeTokenComplianceRequest({ tokenAddress: dto.tokenAddress, userAddress: dto.userAddress, status: status });
    }
}