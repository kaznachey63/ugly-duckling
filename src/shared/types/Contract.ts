import type { User } from "./User";

export interface Contract {
    id?: number,
    user: User,
    dateStart: Date,
    dateEnd: Date,
    price: number
};