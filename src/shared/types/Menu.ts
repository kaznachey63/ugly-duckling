import { InlineKeyboard, Keyboard } from "grammy";

export interface Menu<T extends InlineKeyboard | Keyboard = InlineKeyboard> {
    text: string;
    keyboard: T;
}