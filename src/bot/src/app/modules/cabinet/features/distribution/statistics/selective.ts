import { Composer, InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Chat } from '@shared/types/Chat';
import type { Menu } from '@shared/types/Menu';
import db from '@shared/db';
import format from '@utils/formatting';
import menuStatistic from '@menus/modules/cabinet/distribution/statistic';

const selectiveStatisticsComposer = new Composer<MyContext>();

selectiveStatisticsComposer.callbackQuery(/^selectiveStatistic:/, async (ctx: MyContext) => {
    try {
        // await ctx.answerCallbackQuery({
        //     text: ctx.t('commands.cabinet.distribution.statistics.selective.notDone'),
        //     show_alert: true
        // });
        const menu = menuStatistic.selective(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в selectiveStatistic:', error);
    }
});

selectiveStatisticsComposer.callbackQuery(/^chatsForStatistics:/, async (ctx: MyContext) => {
    try {
        const nameDistribution = ctx.session.distribution.name!;
        const logsBaza = await db.result.getResults(nameDistribution);
        if (!logsBaza) return;

        const lastLog = logsBaza.at(-1)!;
        const infoChats = await db.chat.getChatsInfo(lastLog?.chats);

        if (logsBaza.length === 0 || !lastLog?.chats || !infoChats) {
            await ctx.answerCallbackQuery({
                text: ctx.t('commands.cabinet.distribution.chats.noSendout', {
                    call: ctx.session.distribution.call
                }),
                show_alert: true
            });
            return;
        }

        const menu = chat(ctx, lastLog.success, infoChats!);
        await ctx.editMessageText(format.escapeMarkdown(menu.text), {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в chatsForStatistics:', error);
    } finally {

    }
});

/**
 * Меню раздела чаты
 */
function chat(ctx: MyContext, success: number, chats: Chat[]): Menu<InlineKeyboard> {
    const text = [
        ctx.t('commands.cabinet.distribution.chats.amount', { success }),
        ctx.t('commands.cabinet.distribution.chats.path', { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    chats.forEach((chat: Chat) => {
        keyboard.url(chat.title, chat.link).row();
    });
    keyboard.text(ctx.t('utils.shared.back'), 'mainDistribution');

    return { text: format.escapeMarkdown(text), keyboard };
}

export default selectiveStatisticsComposer;