import { BadRequestException, Body, Controller, Get, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { ClaimService } from "./claim.service";
import { Claim } from "./claim.entity";
import { ClaimIdDto } from "./dto/claim-id.dto";
import { ClaimUserDto } from "./dto/claim-user.dto";
import { CreateClaimDto } from "./dto/create-claim.dto";
import { UpdateDocgenDto } from "./dto/update-docgen.dto";
import { VerifyClaimDto } from "./dto/verify-claim.dto";
import { SignatureService } from "../signatures/signature.service";
import { UserService } from "../users/user.service";

@ApiTags('Claims')
@Controller('/claims')
export class ClaimController {
    constructor(
        private readonly claimService: ClaimService, 
        private readonly userService: UserService, 
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all claims', type: [Claim]})
    @ApiOperation({summary: "retrieve all claims"})
    getClaims() {
        return this.claimService.findAll();
    }

    @Get('/user-claims')
    @ApiResponse({status: 200, description: 'user claims', type: [Claim]})
    @ApiOperation({summary: "retrieve all user claims"})
    getClaimsByUser(@Body() dto: ClaimUserDto) {
        return this.claimService.findAllByUser({userAddress: dto.userAddress});
    }

    @Get('/claim-by-id')
    @ApiResponse({status: 200, description: 'claim by id', type: [Claim]})
    @ApiOperation({summary: "retrieve claim by id"})
    getClaimsById(@Body() dto: ClaimIdDto) {
        return this.claimService.findClaimById({userAddress: dto.userAddress, claimTopic: dto.claimTopic});
    }

    @Post('/add-claim')
    @ApiResponse({status: 201, description: 'add user claim', type: Claim})
    @ApiOperation({summary: "add user claim"})
    async createClaim(@Body() dto: CreateClaimDto) {
        if(!(await this.signatureService.verifySignature('createClaim', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.userService.findUser({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(await this.claimService.findClaimById({userAddress: dto.userAddress, claimTopic: dto.claimTopic})) {
            throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] already exists`)
        }
        return this.claimService.createClaim({userAddress: dto.userAddress, claimTopic: dto.claimTopic, docGen: dto.docgen});
    }

    @Patch('/update-docgen')
    @ApiResponse({status: 200, description: 'update user docgen on specific claim', type: Claim})
    @ApiOperation({summary: "update docgen by claimId"})
    async updateDocgen(@Body() dto: UpdateDocgenDto) {
        if(!(await this.signatureService.verifySignature('updateDocgen', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.userService.findUser({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.claimService.findClaimById({userAddress: dto.userAddress, claimTopic: dto.claimTopic}))) {
            throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] does not exist`)
        }
        return this.claimService.updateDocgen({userAddress: dto.userAddress, claimTopic: dto.claimTopic, docGen: dto.docgen});
    }

    @Patch('/verify-user-claim')
    @ApiResponse({status: 200, description: 'verify user claim', type: Claim})
    @ApiOperation({summary: "verify user claim"})
    async verifyClaim(@Body() dto: VerifyClaimDto) {
        if(!(await this.signatureService.verifySignature('verifyClaim', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.userService.findUser({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.claimService.findClaimById({userAddress: dto.userAddress, claimTopic: dto.claimTopic}))) {
            throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] does not exist`)
        } else if((await this.claimService.isClaimVerified({userAddress: dto.userAddress, claimTopic: dto.claimTopic}))) {
            throw new BadRequestException(`Claim [${dto.userAddress}-${dto.claimTopic}] is already verified`)
        }
        return this.claimService.verifyClaim({userAddress: dto.userAddress, claimTopic: dto.claimTopic});
    }
}