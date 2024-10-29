import { User } from "../../../core/models/user.model";

export interface Investor extends User{
    portfolioValue : BigInt
}