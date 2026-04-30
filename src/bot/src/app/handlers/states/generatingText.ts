import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import common from '@utils/common';
import { gigaChat } from "src/common/services/GigaChat/GigaChatInstance";

export default async function generatingText(ctx: MyContext) {
    const result = await gigaChat.ask(ctx.message?.text || "");

    ctx.session.generate.text = result;
    ctx.session.generate.entities = [];

    const menu = menuState.generatingText(ctx, result);
    common.resetSessionStates(ctx.session);

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}