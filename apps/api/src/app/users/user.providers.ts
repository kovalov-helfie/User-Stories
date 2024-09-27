import { USER_REPOSITORY } from "../constants";
import { User } from "./user.entity";

export const usersProviders = [{
    provide: USER_REPOSITORY,
    useValue: User
}]