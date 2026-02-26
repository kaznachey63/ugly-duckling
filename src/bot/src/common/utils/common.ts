import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import type { MyContext, SessionData } from '@shared/types/SessionData';

/**
 * Сброс сессии
 * @param session Сессия
 */
function sessionReset(session: any) {
    session.state.text.addingText = false;
    session.state.text.editingText = false;
    session.state.media.addingMedia = false;
    session.state.media.editinigMedia = false;
    session.typePartition.text.id = 0;
    session.typePartition.media.id = 0;
}

/**
 * Подгрузка меню (кабинета)
 * @param ctx Контекст
 */
async function loadMenu(ctx: MyContext) {
    const halfPath = path.join("src", "app", "cabinet")
    const switchQueryPath = await fs.realpath(halfPath);
    const handlerPath = path.join(switchQueryPath, "cabinet.ts");
    const handlerUrl = pathToFileURL(handlerPath).href;
    try {
        const handlerModule = await import(handlerUrl);
        await handlerModule.default(ctx);
    } catch (error) {
        console.error("Ошибка в подгрузке кабинета:", error);
    }
}

/**
 * Удаление двух сообщений (для обработчиков)
 * @param ctx Контекст
 * @param nameHandler Название обработчика
 */
async function deleteTwoMessages(ctx: MyContext, nameHandler: string) {
    try {
        if (nameHandler === "contact2") {
            await ctx.deleteMessage(ctx.message?.message_id! + 1);
        }
        else {
            await ctx.deleteMessage();
            await ctx.deleteMessage(ctx.message?.message_id! - 1);
        }
    } catch (error) {}
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, 250));
}

export default {
    sessionReset,
    loadMenu,
    deleteTwoMessages,
    sleep
};