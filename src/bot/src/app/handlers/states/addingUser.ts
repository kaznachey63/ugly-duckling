import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';

export default async function addingUser(ctx: MyContext) {
    const text = ctx.message?.text?.trim()!;
    await ctx.reply(text.split('\n').length.toString(), {
        parse_mode: "MarkdownV2"
    })
    // if (!validateUser(ctx.message?.text?.trim()!)) {
    //     return; // добавить перезагрузку для валидации
    // }

    // await db.message.addMessage(ctx.session.sendout.schema, {
    //     id: 0,
    //     caption: ctx.message?.text?.trim()!,
    //     entities: ctx.message?.entities!,
    //     media: null
    // });
    // const server = new ServerManager();
    // const menu = menuState.addingText(ctx, await server.restartProcessOrNot(ctx.session.sendout.name, true));
    // common.resetSessionStates(ctx.session);

    // await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
    //     reply_markup: menu.keyboard,
    //     parse_mode: "MarkdownV2"
    // });
}

function validateUser(text: string) {
    if (!text) return false;
    if (text.split('\n').length != 6)
    return true
}