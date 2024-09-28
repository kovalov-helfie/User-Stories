import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { UserClaimService } from "./user-claim.service";
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { SignatureService } from "../signatures/signature.service";

@ApiTags('Users')
@Controller('/users')
export class UserController {
    constructor(
        private readonly userClaimService: UserClaimService, 
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all users', type: [User]})
    @ApiOperation({summary: "retrieve all users"})
    async getUsers() {
        return await this.userClaimService.findAllUsers();
    }

    @Get('/:userAddress')
    @ApiResponse({status: 200, description: 'user', type: User})
    @ApiOperation({summary: "retrieve user by address"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getUser(@Param('userAddress') userAddress: string) {
        return await this.userClaimService.findUser({userAddress: userAddress});
    }

    @Post('/add-user')
    @ApiResponse({status: 201, description: 'add user', type: User})
    @ApiOperation({summary: "add user"})
    async createUser(@Body() dto: CreateUserDto) {
        if(!(await this.signatureService.verifySignature('createUser', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(await this.userClaimService.findUser({userAddress: dto.userAddress})) {
            throw new BadRequestException(`User [${dto.userAddress}] already exists`)
        }
        return await this.userClaimService.createUser({userAddress: dto.userAddress});
    }

    @Patch('/verify-user')
    @ApiResponse({status: 200, description: 'verify user', type: User})
    @ApiOperation({summary: "verify user"})
    async verifyUser(@Body() dto: VerifyUserDto) {
        if(!(await this.signatureService.verifySignature('verifyUser', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if(!(await this.userClaimService.isUserVerified({userAddress: dto.senderAddress}))) {
            throw new ForbiddenException(`Sender [${dto.senderAddress}] not verified`)
        } else if(await this.userClaimService.isUserVerified({userAddress: dto.userAddress})) {
            throw new BadRequestException(`User [${dto.senderAddress}] is already verified`)
        } else if(await this.userClaimService.areAllClaimsVerified({userAddress: dto.userAddress})) {
            throw new BadRequestException(`User [${dto.senderAddress}] claims are not verified`)
        }
        return await this.userClaimService.verifyUser({userAddress: dto.userAddress});
    }
}