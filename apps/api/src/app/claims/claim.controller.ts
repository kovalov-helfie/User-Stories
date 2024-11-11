import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UnauthorizedException, UploadedFile, UseInterceptors, Headers, StreamableFile, Query, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBody, ApiConsumes, ApiHeader, ApiQuery } from "@nestjs/swagger";
import { Claim } from "./claim.entity";
import { CreateClaimDto } from "./dto/create-claim.dto";
import { VerifyClaimDto } from "./dto/verify-claim.dto";
import { SignatureService } from "../signatures/signature.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "../files/file.service";
import { createReadStream } from "fs";
import { join } from "path";
import { ApiService } from "../api/api.service";
import { FILE_TYPES, MAX_FILE_SIZE } from "../constants";

@ApiTags('Claims')
@Controller('/claims')
export class ClaimController {
    constructor(
        private readonly apiService: ApiService, 
        private readonly signatureService: SignatureService,
        private readonly fileService: FileService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all claims', type: [Claim]})
    @ApiOperation({summary: "retrieve all claims"})
    @ApiQuery({name: 'withUsers', required: true, description: 'claims with users', type: Boolean, example: true})
    async getClaims(@Query('withUsers') withUsers: string) {
        return await this.apiService.findAllClaims({withUsers: withUsers === 'true'});
    }

    @Get('/:userAddress')
    @ApiResponse({status: 200, description: 'user claims', type: [Claim]})
    @ApiOperation({summary: "retrieve all user claims"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getClaimsByUser(@Param('userAddress') userAddress: string) {
        return await this.apiService.findAllClaimsByUser({userAddress: userAddress});
    }

    @Get('all-verified/:userAddress')
    @ApiResponse({status: 200, description: 'user claims', type: Boolean})
    @ApiOperation({summary: "retrieve all user claims"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getAllUserClaimsVerified(@Param('userAddress') userAddress: string) {
        return await this.apiService.areAllClaimsVerified({userAddress: userAddress});
    }

    @Get('/claim/:userAddress-:claimTopic')
    @ApiResponse({status: 200, description: 'claim by claimUserKey', type: Claim})
    @ApiOperation({summary: "retrieve claim by claimUserKey"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'claimTopic', required: true, description: 'claim topic', type: Number, example: 0})
    async getClaimById(@Param('userAddress') userAddress: string, @Param('claimTopic') claimTopic: string) { 
        return await this.apiService.findClaimById({userAddress: userAddress, claimTopic: Number(claimTopic)});
    }

    @Post('/add-claim')
    @ApiResponse({status: 201, description: 'add user claim', type: Claim})
    @ApiOperation({summary: "add user claim"})
    async createClaim(@Body() dto: CreateClaimDto) {
        if(!(await this.signatureService.verifySignature('createClaim', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(await this.apiService.findClaimById({userAddress: dto.userAddress, claimTopic: dto.claimTopic})) {
            throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] already exists`)
        }
        return await this.apiService.createClaim({
            userAddress: dto.userAddress, 
            claimTopic: dto.claimTopic,
        });
    }

    @Patch('claim/update-docgen/:userAddress-:claimTopic')
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
    @ApiResponse({status: 200, description: 'update user docgen on specific claim', type: Claim})
    @ApiOperation({summary: "update docgen by claimId"})
    @ApiHeader({
        name: 'signature',        
        description: 'user signature',
    })
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'claimTopic', required: true, description: 'claim topic', type: Number, example: 0})
    @UseInterceptors(FileInterceptor('file'))
    async updateDocgen(
            @Headers() headers,
            @Param('userAddress') userAddress: string, 
            @Param('claimTopic') claimTopic: string, 
            @UploadedFile('file',   
                new ParseFilePipe({
                validators: [   
                    new FileTypeValidator({ fileType: FILE_TYPES }),
                    new MaxFileSizeValidator({maxSize: MAX_FILE_SIZE })
                ]
              }),) file: Express.Multer.File) {
        const signature = headers['signature']
        if(!(await this.signatureService.verifySignature('updateDocgen', signature, userAddress))) {
            throw new UnauthorizedException(`User [${userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: userAddress}))) {
            throw new BadRequestException(`User [${userAddress}] does not exist`)
        } else if(!(await this.apiService.findClaimById({userAddress: userAddress, claimTopic: Number(claimTopic)}))) {
            throw new BadRequestException(`Claim [${userAddress}-${claimTopic}] does not exist`)
        } else if((await this.apiService.isClaimVerified({userAddress: userAddress, claimTopic: Number(claimTopic)}))) {
            throw new BadRequestException(`Claim [${userAddress}-${claimTopic}] is already verified`)
        }
        const keccakFile = await this.fileService.saveFile(file, `${userAddress}-${claimTopic}`)
        return await this.apiService.updateDocgen({
            userAddress: userAddress, 
            claimTopic: Number(claimTopic), 
            docGen: keccakFile.filename,
            data: keccakFile.data,
        });
    }

    @Get('/claim/docgen/:senderAddress/:userAddress-:claimTopic')
    @ApiResponse({ status: 200, description: 'claim by claimUserKey', type: Claim })
    @ApiOperation({ summary: "retrieve claim by claimUserKey" })
    @ApiHeader({
        name: 'signature',
        description: 'user signature',
    })
    @ApiParam({ name: 'senderAddress', required: true, description: 'eth sender address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' })
    @ApiParam({ name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' })
    @ApiParam({ name: 'claimTopic', required: true, description: 'claim topic', type: Number, example: 0 })
    async getDocgen(@Headers() headers, @Param('senderAddress') senderAddress: string, @Param('userAddress') userAddress: string, @Param('claimTopic') claimTopic: string): Promise<StreamableFile> {
        const signature = headers['signature']
        if (!(await this.apiService.isUserExists({ userAddress: userAddress }))) {
            throw new BadRequestException(`User [${userAddress}] does not exist`)
        } else if (!(await this.apiService.findClaimById({ userAddress: userAddress, claimTopic: Number(claimTopic) }))) {
            throw new BadRequestException(`Claim [${userAddress}-${claimTopic}] does not exist`)
        } else if(!(await this.apiService.isUserAdmin({ userAddress: senderAddress }))) {
            if (!(await this.signatureService.verifySignature('getDocgen', signature, senderAddress))) {
                throw new UnauthorizedException(`User [${senderAddress}] not authorized`)
            }
        }
        const docgen = await this.apiService.getClaimDocgen({ userAddress: userAddress, claimTopic: Number(claimTopic) })
        const file = createReadStream(join(process.cwd(), 'static', docgen));
        return new StreamableFile(file, {
            type: 'image/*',
            disposition: `attachment; filename="${docgen}"`,
        });
    }

    @Patch('/verify-user-claim')
    @ApiResponse({status: 200, description: 'verify user claim', type: Claim})
    @ApiOperation({summary: "verify user claim"})
    async verifyClaim(@Body() dto: VerifyClaimDto) {
        if(!(await this.signatureService.verifySignature('verifyClaim', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`Sender [${dto.senderAddress}] not authorized`)
        } else if(!(await this.apiService.isUserAdmin({userAddress: dto.senderAddress}))) {
            throw new BadRequestException(`Sender [${dto.senderAddress}] not verified`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.findClaimById({userAddress: dto.userAddress, claimTopic: dto.claimTopic}))) {
            throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] does not exist`)
        } 
        const isClaimVerified = await this.apiService.isClaimVerified({userAddress: dto.userAddress, claimTopic: dto.claimTopic})
        if(dto.verify) {
            if(isClaimVerified) {
                throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] is already verified`)
            }
        } else {
            if(!isClaimVerified) {
                throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] is not verified`)
            }
        }

        return await this.apiService.verifyClaim({userAddress: dto.userAddress, claimTopic: dto.claimTopic, verify: dto.verify});
    }
}