import type { LanguageCode } from "grammy/types";

export interface User {
    telegramId: bigint,
    name: string,
    username: string,
    phone: string,
    language: LanguageCode,
    role: "admin" | "customer" | "unknown";
};