import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UnauthorizedException, UploadedFile, UseInterceptors, Headers, StreamableFile } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBody, ApiConsumes, ApiHeader } from "@nestjs/swagger";
import { Claim } from "./claim.entity";
import { CreateClaimDto } from "./dto/create-claim.dto";
import { VerifyClaimDto } from "./dto/verify-claim.dto";
import { SignatureService } from "../signatures/signature.service";
import { UserClaimService } from "../users/user-claim.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "../files/file.service";
import { createReadStream } from "fs";
import { join } from "path";

@ApiTags('Claims')
@Controller('/claims')
export class ClaimController {
    constructor(
        private readonly userClaimService: UserClaimService, 
        private readonly signatureService: SignatureService,
        private readonly fileService: FileService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all claims', type: [Claim]})
    @ApiOperation({summary: "retrieve all claims"})
    async getClaims() {
        return await this.userClaimService.findAllClaims();
    }

    @Get('/:userAddress')
    @ApiResponse({status: 200, description: 'user claims', type: [Claim]})
    @ApiOperation({summary: "retrieve all user claims"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getClaimsByUser(@Param('userAddress') userAddress: string) {
        return await this.userClaimService.findAllClaimsByUser({userAddress: userAddress});
    }

    @Get('/claim/:userAddress-:claimTopic')
    @ApiResponse({status: 200, description: 'claim by claimUserKey', type: Claim})
    @ApiOperation({summary: "retrieve claim by claimUserKey"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'claimTopic', required: true, description: 'claim topic', type: Number, example: 0})
    async getClaimById(@Param('userAddress') userAddress: string, @Param('claimTopic') claimTopic: string) { 
        return await this.userClaimService.findClaimById({userAddress: userAddress, claimTopic: Number(claimTopic)});
    }

    // TODO: file size/format filter
    @Post('/add-claim')
    @ApiResponse({status: 201, description: 'add user claim', type: Claim})
    @ApiOperation({summary: "add user claim"})
    async createClaim(@Body() dto: CreateClaimDto) {
        if(!(await this.signatureService.verifySignature('createClaim', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.userClaimService.isUserExist({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(await this.userClaimService.findClaimById({userAddress: dto.userAddress, claimTopic: dto.claimTopic})) {
            throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] already exists`)
        }
        return await this.userClaimService.createClaim({
            userAddress: dto.userAddress, 
            claimTopic: dto.claimTopic, 
            docGen: ''
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
            @UploadedFile('file') file: Express.Multer.File) {
        const signature = headers['signature']
        if(!(await this.signatureService.verifySignature('updateDocgen', signature, userAddress))) {
            throw new UnauthorizedException(`User [${userAddress}] not authorized`)
        } else if(!(await this.userClaimService.isUserExist({userAddress: userAddress}))) {
            throw new BadRequestException(`User [${userAddress}] does not exist`)
        } else if(!(await this.userClaimService.findClaimById({userAddress: userAddress, claimTopic: Number(claimTopic)}))) {
            throw new BadRequestException(`Claim [${userAddress}-${claimTopic}] does not exist`)
        }
        const fileName = await this.fileService.saveFile(file, `${userAddress}-${claimTopic}`)
        return await this.userClaimService.updateDocgen({
            userAddress: userAddress, 
            claimTopic: Number(claimTopic), 
            docGen: fileName
        });
    }

    @Get('/claim/docgen/:userAddress-:claimTopic')
    @ApiResponse({status: 200, description: 'claim by claimUserKey', type: Claim})
    @ApiOperation({summary: "retrieve claim by claimUserKey"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'claimTopic', required: true, description: 'claim topic', type: Number, example: 0})
    async getDocgen(@Param('userAddress') userAddress: string, @Param('claimTopic') claimTopic: string): Promise<StreamableFile> {
      if(!(await this.userClaimService.isUserExist({userAddress: userAddress}))) {
          throw new BadRequestException(`User [${userAddress}] does not exist`)
      } else if(!(await this.userClaimService.findClaimById({userAddress: userAddress, claimTopic: Number(claimTopic)}))) {
          throw new BadRequestException(`Claim [${userAddress}-${claimTopic}] does not exist`)
      } else if((await this.userClaimService.isClaimVerified({userAddress: userAddress, claimTopic: Number(claimTopic)}))) {
          throw new BadRequestException(`Claim [${userAddress}-${claimTopic}] is already verified`)
      }
      const docgen = await this.userClaimService.getClaimDocgen({userAddress: userAddress, claimTopic: Number(claimTopic)})
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
        if(!(await this.signatureService.verifySignature('verifyClaim', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.userClaimService.isUserExist({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.userClaimService.findClaimById({userAddress: dto.userAddress, claimTopic: dto.claimTopic}))) {
            throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] does not exist`)
        } else if((await this.userClaimService.isClaimVerified({userAddress: dto.userAddress, claimTopic: dto.claimTopic}))) {
            throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] is already verified`)
        }
        return await this.userClaimService.verifyClaim({userAddress: dto.userAddress, claimTopic: dto.claimTopic});
    }
}