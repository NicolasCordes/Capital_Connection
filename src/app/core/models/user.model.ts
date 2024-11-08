import { Address } from "./address.model";

export interface User {
Id?: Number,
name: String,
surname: String,
email: String,
dateOfBirth: Date,
wallet : BigInt,
yearsOfExperience : Number,
industry : string,
Address : Address
}
