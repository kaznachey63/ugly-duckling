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

    const result = await gigaChat.ask(constants.systemPrompt + ctx.message?.text);
    
    ctx.session.state.text.generateText = result;
    ctx.session.state.text.generateEntities = [];

    const menu = menuState.generatingText(ctx, result);
    common.resetSessionStates(ctx.session);

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}