export interface Donation {
    id?: number,
    amount: BigInt,
    date: Date
    id_entrepreneurship?: number;
    id_account?: number;
    isActivated:boolean;
}
