import { BadRequestException, Body, Controller, ForbiddenException, Get, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { FindUserDto } from "./dto/find-user.dto";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { SignatureService } from "../signatures/signature.service";

@ApiTags('Users')
@Controller('/users')
export class UserController {
    constructor(
        private readonly userService: UserService, 
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all users', type: [User]})
    @ApiOperation({summary: "retrieve all users"})
    getUsers() {
        return this.userService.findAll();
    }

    @Get('/user')
    @ApiResponse({status: 200, description: 'user', type: [User]})
    @ApiOperation({summary: "retrieve user by address"})
    getUser(@Body() dto: FindUserDto) {
        return this.userService.findUser({userAddress: dto.userAddress});
    }

    @Post('/add-user')
    @ApiResponse({status: 201, description: 'add user', type: User})
    @ApiOperation({summary: "add user"})
    async createUser(@Body() dto: CreateUserDto) {
        if(!(await this.signatureService.verifySignature('createUser', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(await this.userService.findUser({userAddress: dto.userAddress})) {
            throw new BadRequestException(`User [${dto.userAddress}] already exists`)
        }
        return this.userService.createUser({userAddress: dto.userAddress});
    }

    @Patch('/verify-user')
    @ApiResponse({status: 200, description: 'verify user', type: User})
    @ApiOperation({summary: "verify user"})
    async verifyUser(@Body() dto: VerifyUserDto) {
        if(!(await this.signatureService.verifySignature('verifyUser', dto.signature, dto.senderAddress))) {
            throw new UnauthorizedException(`User [${dto.senderAddress}] not authorized`)
        } else if(!(await this.userService.isUserVerified({userAddress: dto.senderAddress}))) {
            throw new ForbiddenException(`Sender [${dto.senderAddress}] not verified`)
        } else if(await this.userService.isUserVerified({userAddress: dto.userAddress})) {
            throw new BadRequestException(`User [${dto.senderAddress}] is already verified`)
        }
        return this.userService.verifyUser({userAddress: dto.userAddress});
    }
}