import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UnauthorizedException, UploadedFile, UseInterceptors, Headers, StreamableFile, Query, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBody, ApiConsumes, ApiHeader, ApiQuery } from "@nestjs/swagger";
import { SignatureService } from "../signatures/signature.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "../files/file.service";
import { createReadStream } from "fs";
import { join } from "path";
import { ApiService } from "../api/api.service";
import { FILE_TYPES, MAX_FILE_SIZE } from "../constants";
import { TokenClaim } from "./token-claim.entity";
import { CreateTokenClaimDto } from "./dto/create-token-claim.dto";
import { VerifyTokenClaimDto } from "./dto/verify-token-claim.dto";

@ApiTags('TokenClaims')
@Controller('/token-claims')
export class TokenClaimController {
    constructor(
        private readonly apiService: ApiService, 
        private readonly signatureService: SignatureService,
        private readonly fileService: FileService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all token claims', type: [TokenClaim]})
    @ApiOperation({summary: "retrieve all token claims"})
    @ApiQuery({name: 'withTokens', required: true, description: 'token claims with tokens', type: Boolean, example: true})
    async getTokenClaims(@Query('withTokens') withTokens: string) {
        return await this.apiService.findAllTokenClaims({withTokens: withTokens === 'true'});
    }

    @Get('/:tokenAddress')
    @ApiResponse({status: 200, description: 'token claims', type: [TokenClaim]})
    @ApiOperation({summary: "retrieve all token claims"})
    @ApiParam({name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getTokenClaimsByToken(@Param('tokenAddress') tokenAddress: string) {
        return await this.apiService.findAllTokenClaimsByToken({tokenAddress: tokenAddress});
    }

    @Get('all-verified/:tokenAddress')
    @ApiResponse({status: 200, description: 'token claims', type: Boolean})
    @ApiOperation({summary: "retrieve all token claims"})
    @ApiParam({name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getAllTokenClaimsVerified(@Param('tokenAddress') tokenAddress: string) {
        return await this.apiService.areAllTokenClaimsVerified({tokenAddress: tokenAddress});
    }

    @Get('/claim/:tokenAddress-:claimTopic')
    @ApiResponse({status: 200, description: 'claim by claimTokenKey', type: TokenClaim})
    @ApiOperation({summary: "retrieve claim by claimTokenKey"})
    @ApiParam({name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'claimTopic', required: true, description: 'claim topic', type: Number, example: 0})
    async getTokenClaimById(@Param('tokenAddress') tokenAddress: string, @Param('claimTopic') claimTopic: string) { 
        return await this.apiService.findTokenClaimById({tokenAddress: tokenAddress, claimTopic: Number(claimTopic)});
    }

    @Post('/add-claim')
    @ApiResponse({status: 201, description: 'add token claim', type: TokenClaim})
    @ApiOperation({summary: "add token claim"})
    async createTokenClaim(@Body() dto: CreateTokenClaimDto) {
        if(!(await this.signatureService.verifySignature('createTokenClaim', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if(!(await this.apiService.isAssetExists({tokenAddress: dto.tokenAddress}))) {
            throw new BadRequestException(`Asset [${dto.tokenAddress}] does not exist`)
        } else if(await this.apiService.findTokenClaimById({tokenAddress: dto.tokenAddress, claimTopic: dto.claimTopic})) {
            throw new BadRequestException(`Claim [${dto.tokenAddress}-${dto.claimTopic}] already exists`)
        }
        return await this.apiService.createTokenClaim({
            tokenAddress: dto.tokenAddress, 
            claimTopic: dto.claimTopic,
        });
    }

    @Patch('claim/update-docgen/:senderAddress-:tokenAddress-:claimTopic')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary',
              },
            },
        },
    })
    @ApiResponse({status: 200, description: 'update token docgen on specific claim', type: TokenClaim})
    @ApiOperation({summary: "update docgen by claimId"})
    @ApiHeader({
        name: 'signature',        
        description: 'user signature',
    })
    @ApiParam({name: 'senderAddress', required: true, description: 'eth sender address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'claimTopic', required: true, description: 'claim topic', type: Number, example: 0})
    @UseInterceptors(FileInterceptor('file'))
    async updateTokenDocgen(
            @Headers() headers,
            @Param('senderAddress') senderAddress: string, 
            @Param('tokenAddress') tokenAddress: string, 
            @Param('claimTopic') claimTopic: string, 
            @UploadedFile('file',   
                new ParseFilePipe({
                validators: [   
                    new FileTypeValidator({ fileType: FILE_TYPES }),
                    new MaxFileSizeValidator({maxSize: MAX_FILE_SIZE })
                ]
              }),) file: Express.Multer.File) {
        const signature = headers['signature']
        if(!(await this.signatureService.verifySignature('updateTokenDocgen', signature, senderAddress))) {
            throw new UnauthorizedException(`User [${tokenAddress}] not authorized`)
        } else if(!(await this.apiService.isAssetExists({tokenAddress: tokenAddress}))) {
            throw new BadRequestException(`Asset [${tokenAddress}] does not exist`)
        } else if(!(await this.apiService.findTokenClaimById({tokenAddress: tokenAddress, claimTopic: Number(claimTopic)}))) {
            throw new BadRequestException(`Claim [${tokenAddress}-${claimTopic}] does not exist`)
        } else if((await this.apiService.isTokenClaimVerified({tokenAddress: tokenAddress, claimTopic: Number(claimTopic)}))) {
            throw new BadRequestException(`Claim [${tokenAddress}-${claimTopic}] is already verified`)
        }
        const keccakFile = await this.fileService.saveFile(file, `${tokenAddress}-${claimTopic}`)
        return await this.apiService.updateTokenDocgen({
            tokenAddress: tokenAddress, 
            claimTopic: Number(claimTopic), 
            docGen: keccakFile.filename,
            data: keccakFile.data,
        });
    }

    @Get('/claim/docgen/:senderAddress/:tokenAddress-:claimTopic')
    @ApiResponse({ status: 200, description: 'claim by claimTokenKey', type: TokenClaim })
    @ApiOperation({ summary: "retrieve claim by claimTokenKey" })
    @ApiHeader({
        name: 'signature',
        description: 'user signature',
    })
    @ApiParam({ name: 'senderAddress', required: true, description: 'eth sender address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' })
    @ApiParam({ name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' })
    @ApiParam({ name: 'claimTopic', required: true, description: 'claim topic', type: Number, example: 0 })
    async getTokenDocgen(@Headers() headers, @Param('senderAddress') senderAddress: string, @Param('tokenAddress') tokenAddress: string, @Param('claimTopic') claimTopic: string): Promise<StreamableFile> {
        const signature = headers['signature']
        if (!(await this.apiService.isAssetExists({ tokenAddress: tokenAddress }))) {
            throw new BadRequestException(`Asset [${tokenAddress}] does not exist`)
        } else if (!(await this.apiService.findTokenClaimById({ tokenAddress: tokenAddress, claimTopic: Number(claimTopic) }))) {
            throw new BadRequestException(`Claim [${tokenAddress}-${claimTopic}] does not exist`)
        } else if(!(await this.apiService.isUserAdmin({ userAddress: senderAddress }))) {
            if (!(await this.signatureService.verifySignature('getTokenDocgen', signature, senderAddress))) {
                throw new UnauthorizedException(`User [${senderAddress}] not authorized`)
            }
        }
        const docgen = await this.apiService.getTokenClaimDocgen({ tokenAddress: tokenAddress, claimTopic: Number(claimTopic) })
        const file = createReadStream(join(process.cwd(), 'static', docgen));
        return new StreamableFile(file, {
            type: 'image/*',
            disposition: `attachment; filename="${docgen}"`,
        });
    }

    @Patch('/verify-token-claim')
    @ApiResponse({status: 200, description: 'verify token claim', type: TokenClaim})
    @ApiOperation({summary: "verify token claim"})
    async verifyTokenClaim(@Body() dto: VerifyTokenClaimDto) {
        if(!(await this.signatureService.verifySignature('verifyTokenClaim', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`Sender [${dto.senderAddress}] not authorized`)
        } else if(!(await this.apiService.isUserAdmin({userAddress: dto.senderAddress}))) {
            throw new BadRequestException(`Sender [${dto.senderAddress}] not verified`)
        } else if(!(await this.apiService.isAssetExists({tokenAddress: dto.tokenAddress}))) {
            throw new BadRequestException(`Asset [${dto.tokenAddress}] does not exist`)
        } else if(!(await this.apiService.findTokenClaimById({tokenAddress: dto.tokenAddress, claimTopic: dto.claimTopic}))) {
            throw new BadRequestException(`Claim [${dto.tokenAddress}-${dto.claimTopic}] does not exist`)
        } 
        const isTokenClaimVerified = await this.apiService.isTokenClaimVerified({tokenAddress: dto.tokenAddress, claimTopic: dto.claimTopic})
        if(dto.verify) {
            if(isTokenClaimVerified) {
                throw new BadRequestException(`Claim [${dto.tokenAddress}-${dto.claimTopic}] is already verified`)
            }
        } else {
            if(!isTokenClaimVerified) {
                throw new BadRequestException(`Claim [${dto.tokenAddress}-${dto.claimTopic}] is not verified`)
            }
        }

        return await this.apiService.verifyTokenClaim({tokenAddress: dto.tokenAddress, claimTopic: dto.claimTopic, verify: dto.verify});
    }
}