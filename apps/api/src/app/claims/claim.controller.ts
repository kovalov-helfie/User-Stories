import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { ClaimService } from "./claim.service";
import { Claim } from "./claim.entity";
import { ClaimIdDto } from "./dto/claim-id.dto";
import { ClaimUserDto } from "./dto/claim-user.dto";
import { CreateClaimDto } from "./dto/create-claim.dto";
import { UpdateDocgenDto } from "./dto/update-docgen.dto";
import { VerifyClaimDto } from "./dto/verify-claim.dto";

@ApiTags('Claims')
@Controller('/claims')
export class ClaimController {
    constructor(private readonly claimService: ClaimService) {
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
    createClaim(@Body() dto: CreateClaimDto) {
        return this.claimService.createClaim({userAddress: dto.userAddress, claimTopic: dto.claimTopic, docGen: dto.docgen});
    }

    @Patch('/update-docgen')
    @ApiResponse({status: 200, description: 'update user docgen on specific claim', type: Claim})
    @ApiOperation({summary: "update docgen by claimId"})
    updateDocgen(@Body() dto: UpdateDocgenDto) {
        return this.claimService.updateDocgen({userAddress: dto.userAddress, claimTopic: dto.claimTopic, docGen: dto.docgen});
    }

    @Patch('/verify-user')
    @ApiResponse({status: 200, description: 'verify user claim', type: Claim})
    @ApiOperation({summary: "verify user claim"})
    verifyClaim(@Body() dto: VerifyClaimDto) {
        return this.claimService.verifyClaim({userAddress: dto.userAddress, claimTopic: dto.claimTopic});
    }
}