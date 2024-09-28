import { Inject, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { CLAIM_REPOSITORY, USER_REPOSITORY } from "../constants";
import { Claim } from "../claims/claim.entity";

interface CreateUserParams {
    userAddress: string;
}

interface FindUserParams {
    userAddress: string;
}

interface SetIdentityParams {
    userAddress: string;
    identityAddress: string;
}

interface VerifyUserParams {
    userAddress: string;
    verify: boolean;
}

interface FindAllByUserParams {
    userAddress: string;
}

interface FindClaimById {
    userAddress: string;
    claimTopic: number;
}

interface CreateClaimParams {
    userAddress: string;
    claimTopic: number;
    docGen: string;
}

interface UpdateDocgenParams {
    userAddress: string;
    claimTopic: number;
    docGen: string;
}

interface VerifyClaimParams {
    userAddress: string;
    claimTopic: number;
    verify: boolean;
}

const compositeKey = (...keys:(string|number)[]) => 
    keys.map(el => el.toString().toLowerCase()).join('-')

@Injectable()
export class UserClaimService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        @Inject(CLAIM_REPOSITORY) private readonly claimRepository: typeof Claim) {
    }

    async findAllUsers() {
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

    async isUserAdmin({userAddress}:FindUserParams) {
        const user = await this.userRepository.findByPk(userAddress.toLowerCase())
        if(user) {
            return user.isAdmin
        }
        return false
    }

    async createUser({userAddress}:CreateUserParams) {
        return await this.userRepository.create({userAddress: userAddress.toLowerCase(), isVerified: false})
    }

    async setIdentity({userAddress, identityAddress}:SetIdentityParams) {
        const [rows, entity] = await this.userRepository.update(
            {identityAddress: identityAddress}, 
            {where : {userAddress: userAddress.toLowerCase()}, returning: true}
        )
        return entity
    }

    async verifyUser({userAddress, verify}:VerifyUserParams) {
        const [rows, entity] = await this.userRepository.update(
            {isVerified: verify}, 
            {where : {userAddress: userAddress.toLowerCase()}, returning: true}
        )
        return entity
    }

    async verifyAdmin({userAddress, verify}:VerifyUserParams) {
        const [rows, entity] = await this.userRepository.update(
            {isAdmin: verify}, 
            {where : {userAddress: userAddress.toLowerCase()}, returning: true}
        )
        return entity
    }

    async findAllClaims() {
        return await this.claimRepository.findAll()
    }

    async findAllClaimsByUser({userAddress}:FindAllByUserParams) {
        return await this.claimRepository.findAll({where: {userAddress: userAddress.toLowerCase()}})
    }

    async findClaimById({userAddress, claimTopic}:FindClaimById) {
        return await this.claimRepository.findByPk(compositeKey(userAddress, claimTopic))
    }

    async getClaimDocgen({userAddress, claimTopic}:FindClaimById) {
        return (await this.claimRepository.findByPk(compositeKey(userAddress, claimTopic))).docGen
    }

    async isClaimVerified({userAddress, claimTopic}:FindClaimById) {
        const claim = await this.claimRepository.findByPk(compositeKey(userAddress, claimTopic))
        if(claim) {
            return claim.isClaimVerified
        }
        return false
    }

    async areAllClaimsVerified({userAddress}:FindAllByUserParams) {
        const claims = await this.claimRepository.findAll({where: {userAddress: userAddress.toLowerCase()}})
        if(claims.find(el => el.isClaimVerified === false)) {
            return false
        }
        return true
    }

    async createClaim({userAddress, claimTopic, docGen}:CreateClaimParams) {
        return await this.claimRepository.create({
            claimUserKey: compositeKey(userAddress, claimTopic),
            userAddress: userAddress.toLowerCase(),
            claimTopic: claimTopic,
            docGen: docGen,
            isClaimVerified: false
        })
    }

    async updateDocgen({userAddress, claimTopic, docGen}:UpdateDocgenParams) {
        const [rows, entity] = await this.claimRepository.update(
            {docGen: docGen}, 
            {where : {claimUserKey: compositeKey(userAddress, claimTopic), }, returning: true}
        )
        return entity;
    }

    async verifyClaim({userAddress, claimTopic, verify}:VerifyClaimParams) {
        const [rows, entity] = await this.claimRepository.update(
            {isClaimVerified: verify}, 
            {where : {claimUserKey: compositeKey(userAddress, claimTopic)}, returning: true})
        return entity;
    }
}