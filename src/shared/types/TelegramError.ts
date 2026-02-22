export interface TelegramError extends Error {
    code?: string | number;
}