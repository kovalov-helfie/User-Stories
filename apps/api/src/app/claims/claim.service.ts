import { Inject, Injectable } from "@nestjs/common";
import { CLAIM_REPOSITORY } from "../constants";
import { Claim } from "./claim.entity";

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
}

const compositeKey = (...keys:(string|number)[]) => 
    keys.map(el => el.toString().toLowerCase()).join('-')

@Injectable()
export class ClaimService {
    constructor(@Inject(CLAIM_REPOSITORY) private readonly claimRepository: typeof Claim){
    }

    async findAll() {
        return await this.claimRepository.findAll()
    }

    async findAllByUser({userAddress}:FindAllByUserParams) {
        return await this.claimRepository.findAll({where: {userAddress: userAddress.toLowerCase()}})
    }

    async findClaimById({userAddress, claimTopic}:FindClaimById) {
        return await this.claimRepository.findByPk(compositeKey(userAddress, claimTopic))
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

    async verifyClaim({userAddress, claimTopic}:VerifyClaimParams) {
        const [rows, entity] = await this.claimRepository.update(
            {isClaimVerified: true}, 
            {where : {claimUserKey: compositeKey(userAddress, claimTopic)}, returning: true})
        return entity;
    }
}