import { OBLIGATION_REPOSITORY } from "../constants";
import { Obligation } from "./obligation.entity";

export const obligationsProviders = [{
    provide: OBLIGATION_REPOSITORY,
    useValue: Obligation
}]