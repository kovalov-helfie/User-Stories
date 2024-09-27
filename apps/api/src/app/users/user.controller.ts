import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { FindUserDto } from "./dto/find-user.dto";
import { VerifyUserDto } from "./dto/verify-user.dto";

@ApiTags('Users')
@Controller('/users')
export class UserController {
    constructor(private readonly userService: UserService) {
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
    createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser({userAddress: dto.userAddress});
    }

    @Patch('/verify-user')
    @ApiResponse({status: 200, description: 'verify user', type: User})
    @ApiOperation({summary: "add user"})
    verifyUser(@Body() dto: VerifyUserDto) {
        return this.userService.verifyUser({userAddress: dto.userAddress});
    }
}