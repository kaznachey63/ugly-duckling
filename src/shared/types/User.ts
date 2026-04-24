import type { LanguageCode } from "grammy/types";
import type { RoleCode } from "./RoleCode";

interface Role {
    id?: number,
    code: RoleCode
};

export interface User {
    id?: number;
    telegramId: bigint | null;
    name: string | null;
    username: string | null;
    phone: string | null;
    language: LanguageCode;
    role: Role
}