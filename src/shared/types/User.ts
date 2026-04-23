import type { LanguageCode } from "grammy/types";
type Role = "admin" | "customer" | "unknown";

export interface User {
    telegramId: bigint,
    name: string,
    username: string,
    phone: string,
    language: LanguageCode,
    role: Role;
};