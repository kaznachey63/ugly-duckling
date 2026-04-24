import type { LanguageCode } from "grammy/types";
import type { Role } from "./Role";

export interface User {
    id?: number,
    telegramId: bigint,
    name: string,
    username: string,
    phone: string,
    language: LanguageCode,
    role: Role;
};