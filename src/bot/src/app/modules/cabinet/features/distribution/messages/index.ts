import db from '@shared/db';
import common from "@utils/common";
import type { MyContext } from '@shared/types/SessionData';
import menuMessage from '@menus/commands/cabinet/distribution/message/main';
import { Composer } from 'grammy';
import textComposer from './text';
import mediaComposer from './media';

const messageComposer = new Composer<MyContext>();

messageComposer.callbackQuery(/^mainMessage:/, async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const queryData = ctx.callbackQuery?.data;
    const nameDistribution = ctx.session.distribution.name!;
    
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;

    const positionId = messages.length!;
    ctx.session.state.text.positionId = Number(queryData!.split(/#/)[1]) ?? positionId;


    const menu = menuMessage(ctx, messages)
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

messageComposer.callbackQuery(/^paginationMessages:/, async (ctx: MyContext) => {
    const queryData = ctx.callbackQuery?.data;
    const dataPages = queryData!.split(/#/)[1];
    const [nowPage, allPage] = (dataPages?.split('/'))?.map(Number) || [];

    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.messages.text.amount.page", { nowPage: nowPage, allPage: allPage }), show_alert: true });
});

messageComposer.callbackQuery("parametersMessage", async (ctx: MyContext) => {
    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.messages.parameters.alert"), show_alert: true });
});

messageComposer.use(textComposer);
messageComposer.use(mediaComposer);

export default messageComposer;