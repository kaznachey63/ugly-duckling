import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuStatistic from '@menus/modules/cabinet/distribution/statistic';
import selectiveStatisticsComposer from './selective';
import comparativeStatisticsComposer from './comparative';

const statisticsComposer = new Composer<MyContext>();

statisticsComposer.callbackQuery(/^mainStatistic:/, async (ctx: MyContext) => {
    try {        
        const menu = menuStatistic.main(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainStatistic:', error);
    } finally {
        
    }
});

statisticsComposer.use(selectiveStatisticsComposer);
statisticsComposer.use(comparativeStatisticsComposer);

export default statisticsComposer;