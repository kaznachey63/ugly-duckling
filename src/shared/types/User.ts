import type { LanguageCode } from "grammy/types";
import type { Role } from "./Role";

export interface User {
    id?: number;
    telegramId: bigint | null;
    name: string | null;
    username: string | null;
    phone: string | null;
    language: LanguageCode;
    role: Role
}