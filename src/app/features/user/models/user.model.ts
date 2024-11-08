import { Address } from "./address.model";

export interface User {
id?: number,
name: string,
surname: string,
email: string,
dateOfBirth: Date,
wallet : BigInt,
yearsOfExperience : number,
industry : string,
address : Address
}
