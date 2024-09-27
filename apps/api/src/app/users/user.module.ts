import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { usersProviders } from "./user.providers";
import { UserController } from "./user.controller";
import { SignatureModule } from "../signatures/signature.module";

@Module({providers: [UserService, ...usersProviders], imports: [SignatureModule], exports: [UserService], controllers: [UserController]})
export class UserModule {

}