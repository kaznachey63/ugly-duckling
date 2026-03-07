import db from '@shared/db';
import common from "@utils/common";
import type { MyContext } from '@shared/types/SessionData';
import { Composer } from 'grammy';
import menuText from '@menus/commands/cabinet/distribution/message/text';
import { ServerManager } from "@utils/ServerManager";

const textComposer = new Composer<MyContext>();

textComposer.callbackQuery(/^addText/, async (ctx: MyContext) => {
    ctx.session.state.text.adding = true;
    const menu = menuText.add(ctx);

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.idForUpdateMessageFromState = msg.message_id;
    }
});

textComposer.callbackQuery(/^addingText/, async (ctx: MyContext) => {
    const nameDistribution = ctx.session.distribution.name!;

    await db.message.addMessage(nameDistribution, {
        id: 0,
        caption: ctx.message?.text?.trim()!,
        entities: ctx.message?.entities!,
        media: null
    });
    const server = new ServerManager();
    const menu = menuText.adding(ctx, await server.restartProcessOrNot(nameDistribution));
    common.resetSessionStates(ctx.session);

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

textComposer.callbackQuery(/^updateText/, async (ctx: MyContext) => {
    const queryData = ctx.callbackQuery?.data;
    ctx.session.state.text.updating = true;
    ctx.session.state.text.positionId = Number(queryData!.split(/#/)[1]);
    const menu = menuText.update(ctx);

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.idForUpdateMessageFromState = msg.message_id;
    }
});

textComposer.callbackQuery(/^updatingText/, async (ctx: MyContext) => {
    const nameDistribution = ctx.session.distribution.name!;
    const positionId = ctx.session.state.text.positionId!;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const messageId = messages[positionId]?.id!;

    await db.message.updateMessage(nameDistribution, messageId, {
        caption: ctx.message?.text?.trim()!,
        entities: ctx.message?.entities!,
    });

    const server = new ServerManager();
    const menu = menuText.updating(ctx, await server.restartProcessOrNot(nameDistribution));
    common.resetSessionStates(ctx.session);
    
    await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

textComposer.callbackQuery(/^removeText/, async (ctx: MyContext) => {
    const queryData = ctx.callbackQuery?.data;
    const nameDistribution = ctx.session.distribution.name!;
    const positionId = Number(queryData!.split(/#/)[1]);
    ctx.session.state.text.positionId = positionId;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const messageId = messages[positionId]?.id!;

    await db.message.removeMessage(nameDistribution, messageId);
    const server = new ServerManager();
    const menu = menuText.remove(ctx, await server.restartProcessOrNot(nameDistribution));

    try {
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    } catch (error) {
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    }
});

textComposer.callbackQuery(/^clearAll/, async (ctx: MyContext) => {
    const nameDistribution = ctx.session.distribution.name!;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;

    await db.message.removeAllMessage(nameDistribution);
    const server = new ServerManager();
    const menu = menuText.clearAll(ctx, await server.restartProcessOrNot(nameDistribution));
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

textComposer.callbackQuery("parametersText", async (ctx: MyContext) => {
    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.messages.text.parameters.alert"), show_alert: true });
});

export default textComposer;