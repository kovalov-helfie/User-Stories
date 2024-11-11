import { USER_ASSET_REPOSITORY } from "../constants";
import { UserAsset } from "./user-asset.entity";

export const userAssetsProviders = [{
    provide: USER_ASSET_REPOSITORY,
    useValue: UserAsset
}]