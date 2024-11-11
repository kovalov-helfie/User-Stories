import { TOKEN_IDENTITY_REPOSITORY } from "../constants";
import { TokenIdentity } from "./token-identity.entity";

export const tokenIdentitiesProviders = [{
    provide: TOKEN_IDENTITY_REPOSITORY,
    useValue: TokenIdentity
}]