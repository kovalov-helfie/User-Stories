import { Inject, Injectable } from "@nestjs/common";
import { ASSET_REPOSITORY, CLAIM_REPOSITORY, DVD_TRANSFER_REPOSITORY, IDENTITY_REPOSITORY, OBLIGATION_REPOSITORY, TOKEN_CLAIM_REPOSITORY, TOKEN_COMPLIANCE_REQUEST_REPOSITORY, TOKEN_IDENTITY_REPOSITORY, USER_ASSET_REPOSITORY, USER_REPOSITORY } from "../constants";
import { Claim } from "../claims/claim.entity";
import { Identity } from "../identities/identity.entity";
import { Asset } from "../assets/asset.entity";
import { User } from "../users/user.entity";
import { Obligation } from "../obligations/obligation.entity";
import { TokenIdentity } from "../token-identities/token-identity.entity";
import { TokenClaim } from "../token-claims/token-claim.entity";
import { TokenComplianceRequest } from "../token-compliance/token-compliance-request.entity";
import { ExecuteStatus } from "../types";
import { Op } from "sequelize";
import { DvdTransfer } from "../dvd-transfers/dvd-transfer.entity";
import { UserAsset } from "../user-assets/user-asset.entity";

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
}

interface UpdateDocgenParams {
    userAddress: string;
    claimTopic: number;
    docGen: string;
    data: string;
}

interface VerifyClaimParams {
    userAddress: string;
    claimTopic: number;
    verify: boolean;
}
///

/// Token Claim Service
interface FindAllTokenClaimsWithTokens {
    withTokens: boolean;
}

interface FindAllByTokenParams {
    tokenAddress: string;
}

interface FindTokenClaimById {
    tokenAddress: string;
    claimTopic: number;
}

interface CreateTokenClaimParams {
    tokenAddress: string;
    claimTopic: number;
}

interface UpdateTokenDocgenParams {
    tokenAddress: string;
    claimTopic: number;
    docGen: string;
    data: string;
}

interface VerifyTokenClaimParams {
    tokenAddress: string;
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
    tokenAddress: string;
}

interface CreateAssetParams {
    tokenAddress: string;
    userAddress: string;
    name: string;
    symbol: string;
    decimals: number;
}

interface SetTokenIdentityParams {
    tokenAddress: string;
    identityAddress: string;
}

interface UpdateAssetUserParams {
    tokenAddress: string;
    userAddress: string;
}

interface isAvailableToCreateObligationParams {
    userAddress: string;
    obligationId: number;
}

interface UpdateAssetObligationParams {
    tokenAddress: string;
    obligationId: number;
}


interface VerifyAssetParams {
    tokenAddress: string;
    verify: boolean;
    country: number;
}
///


/// User Asset Service
interface CreateUserAssetParams {
    tokenAddress: string;
    userAddress: string;
}
///

// Token Compliance Request Service
interface FindTokenComplianceRequestsByUserAddress {
    userAddress: string;
}

interface FindTokenComplianceRequestsByTokenAddress {
    tokenAddress: string;
}

interface FindTokenComplianceRequestByTokenUser {
    tokenAddress: string;
    userAddress: string;
}

interface FindTokenComplianceRequestById {
    id: number;
}

interface CreateTokenComplianceRequest {
    tokenAddress: string;
    userAddress: string;
    amount: number;
}

interface VerifyTokenComplianceRequest {
    tokenAddress: string;
    userAddress: string;
    status: ExecuteStatus;
}
//

/// Obligation Service
interface FindAllObligationsWithAssets {
    withAssets: boolean;
    isExecuted?: boolean;
}

interface FindObligationByAssetAndSeller {
    tokenAddress: string;
    seller: string;
}

interface FindObligationById {
    obligationId: number;
}

interface CreateObligationParams {
    tokenAddress: string;
    userAddress: string;
    amount: number;
    txCount: number;
}

interface EditObligationParams {
    obligationId: number;
    amount: number;
    txCount: number;
}

interface UpdateObligationParams {
    obligationId: number;
    userAddress: string;
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

/// DvdTransfer Service
interface FindAllDvdTransfers {
    withObligations: boolean;
}

interface FindDvdTransfersByToken {
    tokenAddress: string;
}

interface FindDvdTransfersByUser {
    userAddress: string;
}

interface FindDvdTransfersByUserAndSellerToken {
    userAddress: string;
    sellerToken: string;
}

interface FindDvdTransfersById {
    dvdTransferId: number;
}

interface CreateDvdTransferParams {
    obligationId: number;
    nonce: bigint;
    buyer: string;
    buyerToken: string;
    buyerAmount: number;
    seller: string;
    sellerToken: string;
    sellerAmount: number;
    transferId: string;
}

interface UpdateDvdTransfer {
    dvdTransferId: number;
    status: ExecuteStatus;
}

interface IsDvdTransferSeller {
    dvdTransferId: number;
    seller: string;
}
///

const compositeKey = (...keys: (string | number)[]) =>
    keys.map(el => el.toString().toLowerCase()).join('-')


@Injectable()
export class ApiService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        @Inject(CLAIM_REPOSITORY) private readonly claimRepository: typeof Claim,
        @Inject(IDENTITY_REPOSITORY) private readonly identityRepository: typeof Identity,
        @Inject(ASSET_REPOSITORY) private readonly assetRepository: typeof Asset,
        @Inject(USER_ASSET_REPOSITORY) private readonly userAssetRepository: typeof UserAsset,
        @Inject(OBLIGATION_REPOSITORY) private readonly obligationRepository: typeof Obligation,
        @Inject(TOKEN_IDENTITY_REPOSITORY) private readonly tokenIdentityRepository: typeof TokenIdentity,
        @Inject(TOKEN_CLAIM_REPOSITORY) private readonly tokenClaimRepository: typeof TokenClaim,
        @Inject(TOKEN_COMPLIANCE_REQUEST_REPOSITORY) private readonly tokenComplianceRequestRepository: typeof TokenComplianceRequest,
        @Inject(DVD_TRANSFER_REPOSITORY) private readonly dvdTransferRepository: typeof DvdTransfer,
    ) {
    }

    /// User Service
    async findAllUsers() {
        return await this.userRepository.findAll()
    }

    async findUser({ userAddress }: FindUserParams) {
        return await this.userRepository.findByPk(userAddress.toLowerCase())
    }

    async createUser({ userAddress }: CreateUserParams) {
        return await this.userRepository.create({ userAddress: userAddress.toLowerCase(), isVerified: false })
    }

    async setIdentity({ userAddress, identityAddress }: SetIdentityParams) {
        const [rows, entity] = await this.userRepository.update(
            { identityAddress: identityAddress.toLowerCase() },
            { where: { userAddress: userAddress.toLowerCase() }, returning: true }
        )
        return entity
    }

    async verifyUser({ userAddress, verify, country }: VerifyUserParams) {
        const [rows, entity] = await this.userRepository.update(
            { isVerified: verify, country: country },
            { where: { userAddress: userAddress.toLowerCase() }, returning: true }
        )
        return entity
    }

    async verifyAdmin({ userAddress, verify }: VerifyAdminParams) {
        const [rows, entity] = await this.userRepository.update(
            { isAdmin: verify },
            { where: { userAddress: userAddress.toLowerCase() }, returning: true }
        )
        return entity
    }

    async isUserExists({ userAddress }: FindUserParams) {
        const user = await this.userRepository.findByPk(userAddress.toLowerCase())
        return user ? true : false
    }

    async isUserVerified({ userAddress }: FindUserParams) {
        const user = await this.userRepository.findByPk(userAddress.toLowerCase())
        if (user) {
            return user.isVerified
        }
        return false
    }

    async isUserIdentity({ userAddress }: FindUserParams) {
        const user = await this.userRepository.findByPk(userAddress.toLowerCase())
        if (user) {
            return user.identityAddress === null
        }
        return false
    }

    async isUserAdmin({ userAddress }: FindUserParams) {
        const user = await this.userRepository.findByPk(userAddress.toLowerCase())
        if (user) {
            return user.isAdmin
        }
        return false
    }
    ///

    /// Claim Service
    async findAllClaims({ withUsers }: FindAllClaimsWithUsers) {
        if (withUsers) {
            return await this.claimRepository.findAll({ include: [User], order: [['claimTopic', 'ASC']] })
        } else {
            return await this.claimRepository.findAll({ order: [['claimTopic', 'ASC']] })
        }
    }

    async findAllClaimsByUser({ userAddress }: FindAllByUserParams) {
        return await this.claimRepository.findAll({
            where: { userAddress: userAddress.toLowerCase() },
            include: [User],
            order: [['claimTopic', 'ASC']]
        })
    }

    async findClaimById({ userAddress, claimTopic }: FindClaimById) {
        return await this.claimRepository.findByPk(compositeKey(userAddress, claimTopic))
    }

    async getClaimDocgen({ userAddress, claimTopic }: FindClaimById) {
        return (await this.claimRepository.findByPk(compositeKey(userAddress, claimTopic))).docGen
    }

    async createClaim({ userAddress, claimTopic }: CreateClaimParams) {
        return await this.claimRepository.create({
            claimUserKey: compositeKey(userAddress, claimTopic),
            userAddress: userAddress.toLowerCase(),
            claimTopic: claimTopic,
            docGen: '',
            data: '',
            isClaimVerified: false
        })
    }

    async updateDocgen({ userAddress, claimTopic, docGen, data }: UpdateDocgenParams) {
        const [rows, entity] = await this.claimRepository.update(
            { docGen: docGen, data: data },
            { where: { claimUserKey: compositeKey(userAddress, claimTopic), }, returning: true }
        )
        return entity;
    }

    async verifyClaim({ userAddress, claimTopic, verify }: VerifyClaimParams) {
        const [rows, entity] = await this.claimRepository.update(
            { isClaimVerified: verify },
            { where: { claimUserKey: compositeKey(userAddress, claimTopic) }, returning: true })
        return entity;
    }

    async isClaimVerified({ userAddress, claimTopic }: FindClaimById) {
        const claim = await this.claimRepository.findByPk(compositeKey(userAddress, claimTopic))
        if (claim) {
            return claim.isClaimVerified
        }
        return false
    }

    async areAllClaimsVerified({ userAddress }: FindAllByUserParams) {
        const claims = await this.claimRepository.findAll({ where: { userAddress: userAddress.toLowerCase() } })
        if (claims.find(el => el.isClaimVerified === false)) {
            return false
        }
        return true
    }
    ///

    /// TokenClaim Service
    async findAllTokenClaims({ withTokens }: FindAllTokenClaimsWithTokens) {
        if (withTokens) {
            return await this.tokenClaimRepository.findAll({ include: [Asset], order: [['claimTopic', 'ASC']] })
        } else {
            return await this.tokenClaimRepository.findAll({ order: [['claimTopic', 'ASC']] })
        }
    }

    async findAllTokenClaimsByToken({ tokenAddress }: FindAllByTokenParams) {
        return await this.tokenClaimRepository.findAll({
            where: { tokenAddress: tokenAddress.toLowerCase() },
            include: [Asset],
            order: [['claimTopic', 'ASC']]
        })
    }

    async findTokenClaimById({ tokenAddress, claimTopic }: FindTokenClaimById) {
        return await this.tokenClaimRepository.findByPk(compositeKey(tokenAddress, claimTopic))
    }

    async getTokenClaimDocgen({ tokenAddress, claimTopic }: FindTokenClaimById) {
        return (await this.tokenClaimRepository.findByPk(compositeKey(tokenAddress, claimTopic))).docGen
    }

    async createTokenClaim({ tokenAddress, claimTopic }: CreateTokenClaimParams) {
        return await this.tokenClaimRepository.create({
            claimTokenKey: compositeKey(tokenAddress, claimTopic),
            tokenAddress: tokenAddress.toLowerCase(),
            claimTopic: claimTopic,
            docGen: '',
            data: '',
            isClaimVerified: false
        })
    }

    async updateTokenDocgen({ tokenAddress, claimTopic, docGen, data }: UpdateTokenDocgenParams) {
        const [rows, entity] = await this.tokenClaimRepository.update(
            { docGen: docGen, data: data },
            { where: { claimTokenKey: compositeKey(tokenAddress, claimTopic), }, returning: true }
        )
        return entity;
    }

    async verifyTokenClaim({ tokenAddress, claimTopic, verify }: VerifyTokenClaimParams) {
        const [rows, entity] = await this.tokenClaimRepository.update(
            { isClaimVerified: verify },
            { where: { claimTokenKey: compositeKey(tokenAddress, claimTopic) }, returning: true })
        return entity;
    }

    async isTokenClaimVerified({ tokenAddress, claimTopic }: FindTokenClaimById) {
        const claim = await this.tokenClaimRepository.findByPk(compositeKey(tokenAddress, claimTopic))
        if (claim) {
            return claim.isClaimVerified
        }
        return false
    }

    async areAllTokenClaimsVerified({ tokenAddress }: FindAllByTokenParams) {
        const claims = await this.tokenClaimRepository.findAll({ where: { tokenAddress: tokenAddress.toLowerCase() } })
        if (claims.find(el => el.isClaimVerified === false)) {
            return false
        }
        return true
    }
    ///

    /// IdentityService    
    async findAllIdentities() {
        return await this.identityRepository.findAll()
    }

    async findIdentity({ identityAddress }: FindIdentityParams) {
        return await this.identityRepository.findByPk(identityAddress.toLowerCase())
    }

    async createIdentity({ identityAddress, initialOwnerAddress }: CreateIdentityParams) {
        return await this.identityRepository.create({
            identityAddress: identityAddress.toLowerCase(),
            initialOwnerAddress: initialOwnerAddress.toLowerCase(),
        })
    }

    async isIdentityExist({ identityAddress }: FindIdentityParams) {
        const identity = await this.identityRepository.findByPk(identityAddress.toLowerCase())
        return identity ? true : false
    }
    ///

    /// TokenIdentityService    
    async findAllTokenIdentities() {
        return await this.tokenIdentityRepository.findAll()
    }

    async findTokenIdentity({ identityAddress }: FindIdentityParams) {
        return await this.tokenIdentityRepository.findByPk(identityAddress.toLowerCase())
    }

    async createTokenIdentity({ identityAddress, initialOwnerAddress }: CreateIdentityParams) {
        return await this.tokenIdentityRepository.create({
            identityAddress: identityAddress.toLowerCase(),
            initialOwnerAddress: initialOwnerAddress.toLowerCase(),
        })
    }

    async isTokenIdentityExist({ identityAddress }: FindIdentityParams) {
        const identity = await this.tokenIdentityRepository.findByPk(identityAddress.toLowerCase())
        return identity ? true : false
    }
    ///

    /// AssetService
    async findAllAssets({ withObligations }: FindAllAssetsWithObligations) {
        if (withObligations) {
            return await this.assetRepository.findAll({ include: [Obligation] })
        } else {
            return await this.assetRepository.findAll()
        }
    }

    async findAllAssetsByUser({ userAddress, withObligations }: FindAllAssetsByUserWithObligations) {
        if (withObligations) {
            return await this.assetRepository.findAll({
                include: [{
                    model: UserAsset,
                    where: { userAddress: userAddress.toLowerCase() },
                    attributes: ['userAddress']
                }, Obligation],
                order: [['tokenAddress', 'ASC']]
            })
        } else {
            return await this.assetRepository.findAll({
                include: [{
                    model: UserAsset,
                    where: { userAddress: userAddress.toLowerCase() },
                    attributes: ['userAddress']
                }], order: [['tokenAddress', 'ASC']]
            })
        }
    }

    async findAssetById({ tokenAddress }: FindAssetById) {
        return await this.assetRepository.findByPk(tokenAddress.toLowerCase())
    }

    async createAsset({ tokenAddress, userAddress, name, symbol, decimals }: CreateAssetParams) {
        return await this.assetRepository.create({
            tokenAddress: tokenAddress.toLowerCase(),
            deployer: userAddress.toLowerCase(),
            name: name,
            symbol: symbol,
            decimals: decimals,
            isVerified: false
        })
    }

    async setAssetIdentity({ tokenAddress, identityAddress }: SetTokenIdentityParams) {
        const [rows, entity] = await this.assetRepository.update(
            { identityAddress: identityAddress.toLowerCase() },
            { where: { tokenAddress: tokenAddress.toLowerCase() }, returning: true }
        )
        return entity
    }

    async updateUserAsset({ tokenAddress, userAddress }: UpdateAssetUserParams) {
        const [rows, entity] = await this.assetRepository.update(
            { deployer: userAddress.toLowerCase() },
            { where: { tokenAddress: tokenAddress.toLowerCase(), }, returning: true }
        )
        return entity;
    }

    async verifyAsset({ tokenAddress, verify, country }: VerifyAssetParams) {
        const [rows, entity] = await this.assetRepository.update(
            { isVerified: verify, country: country },
            { where: { tokenAddress: tokenAddress.toLowerCase() }, returning: true }
        )
        return entity
    }

    async isAssetExists({ tokenAddress }: FindAssetById) {
        const asset = await this.assetRepository.findByPk(tokenAddress.toLowerCase())
        return asset ? true : false
    }

    async isAssetIdentity({ tokenAddress }: FindAssetById) {
        const user = await this.assetRepository.findByPk(tokenAddress.toLowerCase())
        if (user) {
            return user.identityAddress === null
        }
        return false
    }

    async isAssetVerified({ tokenAddress }: FindAssetById) {
        const asset = await this.assetRepository.findByPk(tokenAddress.toLowerCase())
        if (asset) {
            return asset.isVerified
        }
        return false
    }
    ///

    /// UserAsset Service

    async findUserAssets() {
        return await this.userAssetRepository.findAll();
    }

    async findUserAssetById({ tokenAddress, userAddress }: CreateUserAssetParams) {
        return await this.userAssetRepository.findOne({where: {
            tokenAddress: tokenAddress.toLowerCase(),
            userAddress: userAddress.toLowerCase(),
        }});
    }

    async createUserAsset({ tokenAddress, userAddress }: CreateUserAssetParams) {
        return await this.userAssetRepository.create({
            tokenAddress: tokenAddress.toLowerCase(),
            userAddress: userAddress.toLowerCase(),
        })
    }

    async hasUserAsset({ tokenAddress, userAddress }: CreateUserAssetParams) {
        const userAsset = await this.userAssetRepository.findOne({where: {
            tokenAddress: tokenAddress.toLowerCase(),
            userAddress: userAddress.toLowerCase(),
        }});
        return userAsset ? true : false;
    }
    ///

    /// TokenComplianceRequest Service
    async findAllTokenComplianceRequests() {
        return await this.tokenComplianceRequestRepository.findAll({
            order: [['id', 'DESC']]
        })
    }

    async findAllTokenComplianceRequestsForAdmin() {
        return await this.tokenComplianceRequestRepository.findAll({
            where: { status: ExecuteStatus.PROCESSING },
            order: [['id', 'DESC']]
        })
    }

    async findTokenComplianceRequestsByToken({ tokenAddress }: FindTokenComplianceRequestsByTokenAddress) {
        return await this.tokenComplianceRequestRepository.findAll({
            where: { tokenAddress: tokenAddress.toLowerCase() },
            order: [['id', 'DESC']]
        })
    }

    async findTokenComplianceRequestsByUser({ userAddress }: FindTokenComplianceRequestsByUserAddress) {
        return await this.tokenComplianceRequestRepository.findAll({
            where: { userAddress: userAddress.toLowerCase() },
            order: [['id', 'DESC']]
        })
    }

    async findTokenComplianceRequestByTokenUser({ tokenAddress, userAddress }: FindTokenComplianceRequestByTokenUser) {
        return await this.tokenComplianceRequestRepository.findAll(
            {
                where: {
                    tokenAddress: tokenAddress.toLowerCase(),
                    userAddress: userAddress.toLowerCase()
                }
            }
        )
    }

    async findTokenComplianceRequestById({ id }: FindTokenComplianceRequestById) {
        return await this.tokenComplianceRequestRepository.findByPk(id)
    }

    async createTokenComplianceRequest({ tokenAddress, userAddress, amount }: CreateTokenComplianceRequest) {
        return await this.tokenComplianceRequestRepository.create({
            tokenAddress: tokenAddress.toLowerCase(),
            userAddress: userAddress.toLowerCase(),
            maxTransferAmount: amount,
            status: ExecuteStatus.PROCESSING
        })
    }

    async executeTokenComplianceRequest({ tokenAddress, userAddress, status }: VerifyTokenComplianceRequest) {
        const [rows, entity] = await this.tokenComplianceRequestRepository.update(
            { status: status },
            {
                where: {
                    tokenAddress: tokenAddress.toLowerCase(),
                    userAddress: userAddress.toLowerCase(),
                    status: ExecuteStatus.PROCESSING
                },
                returning: true
            })
        return entity;
    }

    async isTokenComplianceStatusProcessing({ tokenAddress, userAddress }: FindTokenComplianceRequestByTokenUser) {
        const request = await this.tokenComplianceRequestRepository.findOne(
            {
                where: {
                    tokenAddress: tokenAddress.toLowerCase(),
                    userAddress: userAddress.toLowerCase(),
                    status: ExecuteStatus.PROCESSING
                }
            }
        )
        if (request) {
            return true
        }
        return false
    }
    ///

    /// ObligationService
    async findAllObligations({ withAssets, isExecuted }: FindAllObligationsWithAssets) {
        if (isExecuted !== null && withAssets) {
            return await this.obligationRepository.findAll({
                where: { isExecuted: !isExecuted },
                include: [Asset]
            })
        } else if (withAssets) {
            return await this.obligationRepository.findAll({
                include: [Asset]
            })
        } else {
            return await this.obligationRepository.findAll()
        }
    }

    async findObligationByAssetAndSeller({ tokenAddress, seller }: FindObligationByAssetAndSeller) {
        return await this.obligationRepository.findOne({ where: { tokenAddress: tokenAddress.toLowerCase(), seller: seller.toLowerCase(), isExecuted: false } })
    }

    async findObligationById({ obligationId }: FindObligationById) {
        return await this.obligationRepository.findByPk(obligationId)
    }

    async createObligation({ tokenAddress, userAddress, amount, txCount }: CreateObligationParams) {
        return await this.obligationRepository.create({
            tokenAddress: tokenAddress,
            seller: userAddress.toLowerCase(),
            amount: amount,
            txCount: txCount,
            isExecuted: false,
        })
    }

    async editObligation({ obligationId, amount, txCount }: EditObligationParams) {
        const [rows, entity] = await this.obligationRepository.update(
            { amount: amount, txCount: txCount},
            { where: { obligationId: obligationId, }, returning: true }
        )
        return entity;
    }

    async updateObligation({ obligationId, userAddress }: UpdateObligationParams) {
        const [rows, entity] = await this.obligationRepository.update(
            { buyer: userAddress.toLowerCase(), isExecuted: true },
            { where: { obligationId: obligationId, }, returning: true }
        )
        return entity;
    }

    async deleteObligation({obligationId}:DeleteObligationParams) {
        const rows = await this.obligationRepository.destroy({where: {obligationId: obligationId}})
        return obligationId;
    }

    async isObligationExists({ obligationId }: FindObligationParams) {
        const obligation = await this.obligationRepository.findByPk(obligationId)
        return obligation ? true : false
    }

    async isObligationExistsOnSeller({ tokenAddress, seller }: FindObligationByAssetAndSeller) {
        const obligation = await this.obligationRepository.findOne({ where: { tokenAddress: tokenAddress.toLowerCase(), seller: seller.toLowerCase() } })
        return obligation ? true : false
    }

    async isObligationExecuted({ obligationId }: FindObligationParams) {
        const obligation = await this.obligationRepository.findByPk(obligationId)
        return obligation?.isExecuted
    }

    async isObligationSeller({ obligationId, userAddress }: FindObligationByOwnerParams) {
        const obligation = await this.obligationRepository.findByPk(obligationId)
        if (obligation.isExecuted) {
            if (obligation?.seller === userAddress.toLowerCase()) {
                return true;
            }
        }
        return obligation?.seller === userAddress.toLowerCase()
    }
    ///

    /// DVDTransfer
    async findAllDvdTransfers({ withObligations }: FindAllDvdTransfers) {
        if (withObligations) {
            return await this.dvdTransferRepository.findAll({
                include: [Obligation]
            })
        } else {
            return await this.dvdTransferRepository.findAll()
        }
    }

    async findDvdTransfersByToken({ tokenAddress }: FindDvdTransfersByToken) {
        return await this.dvdTransferRepository.findAll({ where: { sellerToken: tokenAddress.toLowerCase() } })
    }

    async findDvdTransfersByUser({ userAddress }: FindDvdTransfersByUser) {
        return await this.dvdTransferRepository.findAll({
            where: {
                [Op.or]: [{ buyer: userAddress.toLowerCase() }, { seller: userAddress.toLowerCase() }]
            }
        })
    }

    async findDvdTransfersByUserAndSellerToken({ userAddress, sellerToken }: FindDvdTransfersByUserAndSellerToken) {
        return await this.dvdTransferRepository.findAll({
            where: {
                [Op.or]: [{ buyer: userAddress.toLowerCase() }, { seller: userAddress.toLowerCase() }],
                sellerToken: sellerToken.toLowerCase()
            }
        })
    }

    async findDvdTransferById({ dvdTransferId }: FindDvdTransfersById) {
        return await this.dvdTransferRepository.findByPk(dvdTransferId)
    }

    async createDvdTransfer({ obligationId, nonce, buyer, buyerToken, buyerAmount, seller, sellerToken, sellerAmount, transferId }: CreateDvdTransferParams) {
        return await this.dvdTransferRepository.create({
            obligationId: obligationId,
            nonce: nonce,
            buyer: buyer.toLowerCase(),
            buyerToken: buyerToken.toLowerCase(),
            buyerAmount: buyerAmount,
            seller: seller.toLowerCase(),
            sellerToken: sellerToken.toLowerCase(),
            sellerAmount: sellerAmount,
            transferId: transferId,
            status: ExecuteStatus.PROCESSING,
        })
    }

    async updateDvdTransfer({ dvdTransferId, status }: UpdateDvdTransfer) {
        const [rows, entity] = await this.dvdTransferRepository.update(
            { status: status },
            { where: { id: dvdTransferId, }, returning: true }
        )
        return entity;
    }

    async isDvdTransferExists({ dvdTransferId }: FindDvdTransfersById) {
        const dvdTransfer = await this.dvdTransferRepository.findByPk(dvdTransferId)
        return dvdTransfer ? true : false
    }

    async isDvdTransferProcessing({ dvdTransferId }: FindDvdTransfersById) {
        const dvdTransfer = await this.dvdTransferRepository.findByPk(dvdTransferId)
        if (dvdTransfer) {
            return dvdTransfer.status === ExecuteStatus.PROCESSING;
        }
        return false;
    }

    async isDvdTransferSeller({ dvdTransferId, seller }: IsDvdTransferSeller) {
        const dvdTransfer = await this.dvdTransferRepository.findByPk(dvdTransferId)
        if (dvdTransfer) {
            return dvdTransfer.seller.toLowerCase() === seller.toLowerCase();
        }
        return false;
    }
    ///
}
