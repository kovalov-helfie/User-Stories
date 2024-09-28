import { Inject, Injectable } from "@nestjs/common";
import { ASSET_REPOSITORY, CLAIM_REPOSITORY, IDENTITY_REPOSITORY, USER_REPOSITORY } from "../constants";
import { Claim } from "../claims/claim.entity";
import { Identity } from "../identities/identity.entity";
import { Asset } from "../assets/asset.entity";
import { User } from "../users/user.entity";

/// User Service
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
///

/// Claim Service
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
///

/// Identity Service
interface CreateIdentityParams {
    identityAddress: string;
    initialOwnerAddress: string;
}

interface FindIdentityParams {
    identityAddress: string;
}
///

/// Asset Service
interface FindAssetById {
    assetId: number;
}

interface CreateAssetParams {
    userAddress: string;
    name: string;
    description: string;
    type: string;
}

interface UpdateAssetUserParams {
    assetId: number;
    userAddress: string;
}

interface FindAssetParams {
    assetId: number;
}
///

const compositeKey = (...keys:(string|number)[]) => 
    keys.map(el => el.toString().toLowerCase()).join('-')


@Injectable()
export class ApiService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        @Inject(CLAIM_REPOSITORY) private readonly claimRepository: typeof Claim,
        @Inject(IDENTITY_REPOSITORY) private readonly identityRepository: typeof Identity,
        @Inject(ASSET_REPOSITORY) private readonly assetRepository: typeof Asset,
    ) {
    }

    /// User Service
    async findAllUsers() {
        return await this.userRepository.findAll()
    }

    async findUser({userAddress}:FindUserParams) {
        return await this.userRepository.findByPk(userAddress.toLowerCase())
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
    ///

    /// Claim Service
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
    ///

    /// IdentityService    
    async findAllIdentities() {
        return await this.identityRepository.findAll()
    }

    async findIdentity({identityAddress}:FindIdentityParams) {
        return await this.identityRepository.findByPk(identityAddress.toLowerCase())
    }

    async createIdentity({identityAddress,initialOwnerAddress}:CreateIdentityParams) {
        return await this.identityRepository.create({
            identityAddress: identityAddress.toLowerCase(), 
            initialOwnerAddress: initialOwnerAddress.toLowerCase(), 
        })
    }

    async isIdentityExist({identityAddress}:FindIdentityParams) {
        const identity = await this.identityRepository.findByPk(identityAddress.toLowerCase())
        return identity ? true : false
    }
    ///

    /// AssetService
    async findAllAssets() {
        return await this.assetRepository.findAll()
    }

    async findAllAssetsByUser({userAddress}:FindAllByUserParams) {
        return await this.assetRepository.findAll({where: {userAddress: userAddress.toLowerCase()}})
    }

    async findAssetById({assetId}:FindAssetById) {
        return await this.assetRepository.findByPk(assetId)
    }

    async isAssetExists({assetId}:FindAssetById) {
        const asset = await this.assetRepository.findByPk(assetId)
        return asset ? true : false
    }


    async createAsset({userAddress, name, description, type}:CreateAssetParams) {
        return await this.assetRepository.create({
            userAddress: userAddress.toLowerCase(),
            name: name,
            description: description,
            type: type
        })
    }

    async updateUserAsset({assetId, userAddress}:UpdateAssetUserParams) {
        const [rows, entity] = await this.assetRepository.update(
            {userAddress: userAddress}, 
            {where : {id: assetId, }, returning: true}
        )
        return entity;
    }

    async isAssetExist({assetId}:FindAssetParams) {
        const identity = await this.assetRepository.findByPk(assetId)
        return identity ? true : false
    }
    ///
}
