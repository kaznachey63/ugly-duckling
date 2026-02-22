export interface ITelegramError extends Error {
    code?: string | number;
}