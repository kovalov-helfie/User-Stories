import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from "@nestjs/swagger";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { SignatureService } from "../signatures/signature.service";
import { SetIdentityDto } from "./dto/set-identity.dto";
import { ApiService } from "../api/api.service";

@ApiTags('Users')
@Controller('/users')
export class UserController {
    constructor(
        private readonly apiService: ApiService,
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all users', type: [User]})
    @ApiOperation({summary: "retrieve all users"})
    async getUsers() {
        return await this.apiService.findAllUsers();
    }

    @Get('/:userAddress')
    @ApiResponse({status: 200, description: 'user', type: User})
    @ApiOperation({summary: "retrieve user by address"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getUser(@Param('userAddress') userAddress: string) {
        return await this.apiService.findUser({userAddress: userAddress});
    }

    @Post('/add-user')
    @ApiResponse({status: 201, description: 'add user', type: User})
    @ApiOperation({summary: "add user"})
    async createUser(@Body() dto: CreateUserDto) {
        if(!(await this.signatureService.verifySignature('createUser', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(await this.apiService.findUser({userAddress: dto.userAddress})) {
            throw new BadRequestException(`User [${dto.userAddress}] already exists`)
        }
        return await this.apiService.createUser({userAddress: dto.userAddress});
    }

    @Patch('/set-identity')
    @ApiResponse({status: 200, description: 'set user identity', type: User})
    @ApiOperation({summary: "set user identity"})
    async setIdentity(@Body() dto: SetIdentityDto) {
        if(!(await this.signatureService.verifySignature('userSetIdentity', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.senderAddress}))) {
            throw new ForbiddenException(`Sender [${dto.senderAddress}] does not exist`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new ForbiddenException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isUserIdentity({userAddress: dto.userAddress}))) {
            throw new ForbiddenException(`User identity [${dto.userAddress}] exists`)
        }

        return await this.apiService.setIdentity({userAddress: dto.userAddress, identityAddress: dto.identityAddress});
    }

    @Patch('/verify-user')
    @ApiResponse({status: 200, description: 'verify user', type: User})
    @ApiOperation({summary: "verify user"})
    async verifyUser(@Body() dto: VerifyUserDto) {
        if(!(await this.signatureService.verifySignature('verifyUser', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if(!(await this.apiService.isUserAdmin({userAddress: dto.senderAddress}))) {
            throw new ForbiddenException(`Sender [${dto.senderAddress}] is not an admin`)
        }
        if(dto.verify) {
            if(await this.apiService.isUserVerified({userAddress: dto.userAddress})) {
                throw new BadRequestException(`User [${dto.userAddress}] is already verified`)
            } else if(!(await this.apiService.areAllClaimsVerified({userAddress: dto.userAddress}))) {
                throw new BadRequestException(`User [${dto.userAddress}] claims are not verified`)
            }
        } else {
            if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
                throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
            }
        }

        return await this.apiService.verifyUser({userAddress: dto.userAddress, verify: dto.verify, country: dto.country});
    }

    @Patch('/verify-admin')
    @ApiResponse({status: 200, description: 'verify admin', type: User})
    @ApiOperation({summary: "verify admin"})
    async verifyAdmin(@Body() dto: VerifyUserDto) {
        if(!(await this.signatureService.verifySignature('verifyAdmin', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if(!(await this.apiService.isUserAdmin({userAddress: dto.senderAddress}))) {
            throw new ForbiddenException(`Sender [${dto.senderAddress}] is not an admin`)
        } 
        if(dto.verify) {
            if(!(await this.apiService.isUserAdmin({userAddress: dto.userAddress}))) {
                throw new ForbiddenException(`User [${dto.userAddress}] is already an admin`)
            } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
                throw new BadRequestException(`User [${dto.senderAddress}] is not verified`)
            }
        } else {
            if(await this.apiService.isUserAdmin({userAddress: dto.userAddress})) {
                throw new BadRequestException(`User [${dto.senderAddress}] is not an admin`)
            } 
        }

        return await this.apiService.verifyAdmin({userAddress: dto.userAddress, verify: dto.verify});
    }
}