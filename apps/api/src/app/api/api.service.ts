import { Inject, Injectable } from "@nestjs/common";
import { ASSET_REPOSITORY, CLAIM_REPOSITORY, IDENTITY_REPOSITORY, OBLIGATION_REPOSITORY, USER_REPOSITORY } from "../constants";
import { Claim } from "../claims/claim.entity";
import { Identity } from "../identities/identity.entity";
import { Asset } from "../assets/asset.entity";
import { User } from "../users/user.entity";
import { Obligation } from "../obligations/obligation.entity";

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
    country: number;
}

interface VerifyAdminParams {
    userAddress: string;
    verify: boolean;
}
///

/// Claim Service
interface FindAllClaimsWithUsers {
    withUsers: boolean;
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
interface FindAllAssetsWithObligations {
    withObligations: boolean;
}

interface FindAllAssetsByUserWithObligations {
    userAddress: string;
    withObligations: boolean;
}

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

interface isAvailableToCreateObligationParams {
    userAddress: string;
    obligationId: number;
}

interface UpdateAssetObligationParams {
    assetId: number;
    obligationId: number;
}

interface FindAssetParams {
    assetId: number;
}
///

/// Obligation Service
interface FindAllObligationsWithAssets {
    withAssets: boolean;
    isNotExecuted?: boolean;
}

interface FindObligationByAssetId {
    assetId: number;
}

interface FindObligationById {
    obligationId: number;
}

interface CreateObligationParams {
    assetId: number;
    userAddress: string;
    minPurchaseAmount: number;
    lockupPeriod: number;
    transferRestrictionAddress: string;
}

interface UpdateObligationParams {
    obligationId: number;
    userAddress: string;
    minPurchaseAmount: number;
    lockupPeriod: number;
    transferRestrictionAddress: string;
}

interface ExecuteObligationParams {
    obligationId: number;
    userAddress: string;
    isExecuted: boolean;
}

interface DeleteObligationParams {
    obligationId: number;
}

interface FindObligationParams {
    obligationId: number;
}

interface FindObligationByOwnerParams {
    obligationId: number;
    userAddress: string;
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
        @Inject(OBLIGATION_REPOSITORY) private readonly obligationRepository: typeof Obligation,
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
            {identityAddress: identityAddress.toLowerCase()}, 
            {where : {userAddress: userAddress.toLowerCase()}, returning: true}
        )
        return entity
    }

    async verifyUser({userAddress, verify, country}:VerifyUserParams) {
        const [rows, entity] = await this.userRepository.update(
            {isVerified: verify, country: country}, 
            {where : {userAddress: userAddress.toLowerCase()}, returning: true}
        )
        return entity
    }

    async verifyAdmin({userAddress, verify}:VerifyAdminParams) {
        const [rows, entity] = await this.userRepository.update(
            {isAdmin: verify}, 
            {where : {userAddress: userAddress.toLowerCase()}, returning: true}
        )
        return entity
    }

    async isUserExists({userAddress}:FindUserParams) {
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

    async isUserIdentity({userAddress}:FindUserParams) {
        const user = await this.userRepository.findByPk(userAddress.toLowerCase())
        if(user) {
            return user.identityAddress === null
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
    async findAllClaims({withUsers}:FindAllClaimsWithUsers) {
        if(withUsers) {
            return await this.claimRepository.findAll({include: [User], order: [['claimTopic', 'ASC']]})
        } else {
            return await this.claimRepository.findAll({order: [['claimTopic', 'ASC']]})
        }
    }

    async findAllClaimsByUser({userAddress}:FindAllByUserParams) {
        return await this.claimRepository.findAll({where: {userAddress: userAddress.toLowerCase()}, order: [['claimTopic', 'ASC']]})
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
    async findAllAssets({withObligations}:FindAllAssetsWithObligations) {
        if(withObligations) {
            return await this.assetRepository.findAll({include: [Obligation]})
        } else {
            return await this.assetRepository.findAll()
        }
    }

    async findAllAssetsByUser({userAddress, withObligations}:FindAllAssetsByUserWithObligations) {
        if(withObligations) {
            return await this.assetRepository.findAll({
                where: {userAddress: userAddress.toLowerCase()}, 
                include: [Obligation],
                order: [['id', 'ASC']]
            })
        } else {
            return await this.assetRepository.findAll({where: {userAddress: userAddress.toLowerCase()}, order: [['id', 'ASC']]})
        }
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
            {userAddress: userAddress.toLowerCase()}, 
            {where : {id: assetId, }, returning: true}
        )
        return entity;
    }

    async updateAssetObligation({assetId, obligationId}:UpdateAssetObligationParams) {
        const [rows, entity] = await this.assetRepository.update(
            {obligationId: obligationId}, 
            {where : {id: assetId, }, returning: true}
        )
        return entity;
    }

    async isAssetExist({assetId}:FindAssetParams) {
        const asset = await this.assetRepository.findByPk(assetId)
        return asset ? true : false
    }
    ///

    /// ObligationService
        async findAllObligations({withAssets, isNotExecuted}:FindAllObligationsWithAssets) {
            if(isNotExecuted !== null && withAssets) {
                return await this.obligationRepository.findAll({
                    where: { isExecuted: isNotExecuted},
                    include: [Asset]
                })
            } else if(withAssets) {
                return await this.obligationRepository.findAll({
                    include: [Asset]
                })
            } else {
                return await this.obligationRepository.findAll()
            }
        }

        async findObligationByAsset({assetId}:FindObligationByAssetId) {
            return await this.obligationRepository.findOne({where: {assetId: assetId}})
        }

        async findObligationById({obligationId}:FindObligationById) {
            return await this.obligationRepository.findByPk(obligationId)
        }

        async getObligationUnlockDate({obligationId}:FindObligationById) {
            const obligation = await this.obligationRepository.findByPk(obligationId)
            const date = obligation?.createdAt
            date.setSeconds(date?.getSeconds() + obligation?.lockupPeriod)
            return date;
        }

        async createObligation({assetId, userAddress, lockupPeriod, minPurchaseAmount, transferRestrictionAddress}:CreateObligationParams) {
            return await this.obligationRepository.create({
                assetId: assetId,
                userAddress: userAddress.toLowerCase(),
                lockupPeriod: lockupPeriod,
                minPurchaseAmount: minPurchaseAmount,
                transferRestrictionAddress: transferRestrictionAddress.toLowerCase(),
                isExecuted: false,
            })
        }

        async updateObligation({obligationId, userAddress, lockupPeriod, minPurchaseAmount, transferRestrictionAddress}:UpdateObligationParams) {
            const [rows, entity] = await this.obligationRepository.update(
                {
                    userAddress: userAddress.toLowerCase(),
                    lockupPeriod: lockupPeriod, 
                    minPurchaseAmount: minPurchaseAmount, 
                    transferRestrictionAddress: transferRestrictionAddress.toLowerCase(),
                    isExecuted: false
                }, 
                {where : {id: obligationId, }, returning: true}
            )
            return entity;
        }
    
        async executeObligation({obligationId, userAddress, isExecuted}:ExecuteObligationParams) {
            const [rows, entity] = await this.obligationRepository.update(
                {userAddress: userAddress.toLowerCase(), isExecuted: isExecuted}, 
                {where : {id: obligationId, }, returning: true}
            )
            return entity;
        }

        async deleteObligation({obligationId}:DeleteObligationParams) {
            const rows = await this.obligationRepository.destroy({where: {id: obligationId}})
            return obligationId;
        }
        
        async isObligationExists({obligationId}:FindObligationParams) {
            const obligation = await this.obligationRepository.findByPk(obligationId)
            return obligation ? true : false
        }

        async isObligationExecuted({obligationId}:FindObligationParams) {
            const obligation = await this.obligationRepository.findByPk(obligationId)
            return obligation?.isExecuted
        }

        async isObligationOwner({obligationId, userAddress}:FindObligationByOwnerParams) {
            const obligation = await this.obligationRepository.findByPk(obligationId)
            if(obligation.isExecuted) {
                if(obligation?.userAddress === userAddress.toLowerCase()) {
                    return true;
                }
            }
            return obligation?.userAddress === userAddress.toLowerCase()
        }

        async isObligationNotLocked({userAddress, obligationId}:isAvailableToCreateObligationParams) {
            const obligation = await this.obligationRepository.findByPk(obligationId)
            if(obligation) {
                if(obligation.isExecuted) {
                    if(obligation.userAddress !== userAddress.toLowerCase()) {
                        const date = obligation.updatedAt.getTime()
                        const newDate = new Date(date + obligation.lockupPeriod * 1000)
                        if(Date.now() >= newDate.getTime()) {
                            return true
                        }
                    }
                }
            }
            return false;
        }

        async isObligationRestrictedAddress({userAddress, obligationId}:isAvailableToCreateObligationParams) {
            const obligation = await this.obligationRepository.findByPk(obligationId)
            if(obligation) {
                if(obligation.transferRestrictionAddress === 
                    userAddress.toLowerCase()) {
                    return true
                }
            }
            return false;
        }

        async isAvailableToUpdateObligation({userAddress, obligationId}:isAvailableToCreateObligationParams) {
            const obligation = await this.obligationRepository.findByPk(obligationId)
            if(obligation) {
                if(obligation.isExecuted) {
                    if(obligation.userAddress === userAddress.toLowerCase()) {
                        const date = obligation.updatedAt.getTime()
                        const newDate = new Date(date + obligation.lockupPeriod * 1000)
                        if(Date.now() >= newDate.getTime()) {
                            return true
                        }
                    }
                }
            }
            return false;
        }
    ///
}
