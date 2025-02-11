import { Address } from "./address.model";
import { Entrepreneurship } from "./entrepreneurship.model";

export interface Account {
id?: number,
username: string,
password?: string | null,
providerId?: String | null,
email: string,
name: string,
surname: string,
dateOfBirth: Date,
yearsOfExperience : number,
industry : string,
wallet : BigInt,
favorites: { entrepreneurship: Entrepreneurship}[],
isActivated:boolean;
address : Address;
}
