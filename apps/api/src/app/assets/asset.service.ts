import { Inject, Injectable } from "@nestjs/common";
import { ASSET_REPOSITORY } from "../constants";
import { Asset } from "./asset.entity";

interface FindAllByUserParams {
    userAddress: string;
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

@Injectable()
export class AssetService {
    constructor(@Inject(ASSET_REPOSITORY) private readonly assetRepository: typeof Asset) {
    }

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
}