import { Address } from "./address.model";
import { Category } from "./category.model";

export interface User {
Id?: Number,
name: String,
surname: String,
email: String,
dateOfBirth: Date,
wallet : BigInt,
yearsOfExperience : Number,
industry : Category,
Address : Address
}
