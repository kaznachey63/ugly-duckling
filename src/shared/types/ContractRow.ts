import type { LanguageCode } from "grammy/types";
import type { RoleCode } from "./RoleCode";

export interface ContractRow {
    id: number;
    date_start: Date;
    date_end: Date;
    price: number;
    user_id: number;
    name: string | null;
    telegram_id: bigint | null;
    username: string | null;
    phone: string | null;
    language: LanguageCode;
    role_code: RoleCode;
}