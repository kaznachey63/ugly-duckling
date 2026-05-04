import type { Chat } from "./DB";

export interface Counter {
    good: number;
    chats: Chat[];
}