import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { usersProviders } from "./user.providers";
import { UserController } from "./user.controller";

@Module({providers: [UserService, ...usersProviders], exports: [UserService], controllers: [UserController]})
export class UserModule {

}