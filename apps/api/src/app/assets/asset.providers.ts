import { ASSET_REPOSITORY } from "../constants";
import { Asset } from "./asset.entity";

export const assetsProviders = [{
    provide: ASSET_REPOSITORY,
    useValue: Asset
}]