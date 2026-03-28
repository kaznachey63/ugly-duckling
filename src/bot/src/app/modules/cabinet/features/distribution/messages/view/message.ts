import db from '@shared/db';
import { Composer } from 'grammy';
import menuView from '@menus/modules/cabinet/distribution/message/view';
import { ServerManager } from "src/common/services/ServerManager";
import type { MyContext } from '@shared/types/SessionData';

const messageComposer = new Composer<MyContext>();

messageComposer.callbackQuery(/^removeMessage:/, async (ctx: MyContext) => {
    const nameDistribution = ctx.session.distribution.name!;
    const positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
    ctx.session.other.text.positionId = positionId;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const messageId = messages[positionId]?.id!;

    await db.message.removeMessage(nameDistribution, messageId);
    const server = new ServerManager();
    const menu = menuView.removeMessage(ctx, await server.restartProcessOrNot(nameDistribution, true));

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

messageComposer.callbackQuery(/^paginationMessages:/, async (ctx: MyContext) => {
    const queryData = ctx.callbackQuery?.data;
    const dataPages = queryData!.split(/#/)[1];
    const [nowPage, allPage] = (dataPages?.split('/'))?.map(Number)!;

    await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.messages.pagination", { nowPage: nowPage, allPage: allPage }), show_alert: true });
});

export default messageComposer;