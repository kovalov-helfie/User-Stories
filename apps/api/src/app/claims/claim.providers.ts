import { CLAIM_REPOSITORY } from "../constants";
import { Claim } from "./claim.entity";

export const claimsProviders = [{
    provide: CLAIM_REPOSITORY,
    useValue: Claim
}]