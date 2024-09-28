import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { Claim } from "./claim.entity";
import { CreateClaimDto } from "./dto/create-claim.dto";
import { UpdateDocgenDto } from "./dto/update-docgen.dto";
import { VerifyClaimDto } from "./dto/verify-claim.dto";
import { SignatureService } from "../signatures/signature.service";
import { UserClaimService } from "../users/user-claim.service";

@ApiTags('Claims')
@Controller('/claims')
export class ClaimController {
    constructor(
        private readonly userClaimService: UserClaimService, 
        private readonly signatureService: SignatureService) {
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
        return await this.userClaimService.createClaim({userAddress: dto.userAddress, claimTopic: dto.claimTopic, docGen: dto.docgen});
    }

    @Patch('/update-docgen')
    @ApiResponse({status: 200, description: 'update user docgen on specific claim', type: Claim})
    @ApiOperation({summary: "update docgen by claimId"})
    async updateDocgen(@Body() dto: UpdateDocgenDto) {
        if(!(await this.signatureService.verifySignature('updateDocgen', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.userClaimService.isUserExist({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.userClaimService.findClaimById({userAddress: dto.userAddress, claimTopic: dto.claimTopic}))) {
            throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] does not exist`)
        }
        return await this.userClaimService.updateDocgen({userAddress: dto.userAddress, claimTopic: dto.claimTopic, docGen: dto.docgen});
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