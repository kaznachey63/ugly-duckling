import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import common from '@utils/common';
import { GigaChatService } from "@utils/GigaChatService";
import constants from "@constants";

export default async function generatingText(ctx: MyContext) {
    const gigaChat = new GigaChatService({ 
        authKey: process.env.GIGA_CHAT_API!,
        insecure: true
    });

    const result = await gigaChat.ask(constants.gigaChat.systemPrompt + ctx.message?.text);
    
    ctx.session.other.text.generateText = result;
    ctx.session.other.text.generateEntities = [];

    const menu = menuState.generatingText(ctx, result);
    common.resetSessionStates(ctx.session);

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}