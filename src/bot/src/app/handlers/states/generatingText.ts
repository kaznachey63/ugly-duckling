import type { MyContext } from '@shared/types/SessionData';
import menuGeneratingText from '@menus/handlers/states/generatingText';
import common from '@utils/common';
import { gigaChat } from "@common/services/GigaChat/GigaChatInstance";

export default async function generatingText(ctx: MyContext) {
    const result = await gigaChat.ask(ctx.message?.text || "");

    ctx.session.generate.text = result;
    ctx.session.generate.entities = [];

    const menu = menuGeneratingText(ctx, result);
    common.resetSessionStates(ctx.session);

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}