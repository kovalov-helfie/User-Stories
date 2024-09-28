import { IDENTITY_REPOSITORY } from "../constants";
import { Identity } from "./identity.entity";

export const identitysProviders = [{
    provide: IDENTITY_REPOSITORY,
    useValue: Identity
}]