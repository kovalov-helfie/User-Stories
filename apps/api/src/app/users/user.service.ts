import { Inject, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { USER_REPOSITORY } from "../constants";

interface CreateUserParams {
    userAddress: string;
}

interface FindUserParams {
    userAddress: string;
}

interface VerifyUserParams {
    userAddress: string;
}

@Injectable()
export class UserService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) {
    }

    async findAll() {
        return await this.userRepository.findAll()
    }

    async findUser({userAddress}:FindUserParams) {
        return await this.userRepository.findByPk(userAddress.toLowerCase())
    }

    async isUserExist({userAddress}:FindUserParams) {
        const user = await this.userRepository.findByPk(userAddress.toLowerCase())
        return user ? true : false
    }

    async isUserVerified({userAddress}:FindUserParams) {
        const user = await this.userRepository.findByPk(userAddress.toLowerCase())
        if(user) {
            return user.isVerified
        }
        return false
    }

    async createUser({userAddress}:CreateUserParams) {
        return await this.userRepository.create({userAddress: userAddress.toLowerCase(), isVerified: false})
    }

    async verifyUser({userAddress}:VerifyUserParams) {
        const [rows, entity] = await this.userRepository.update(
            {isVerified: true}, 
            {where : {userAddress: userAddress.toLowerCase()}, returning: true}
        )
        return entity
    }
}