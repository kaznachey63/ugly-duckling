import { Composer, GrammyError } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuDistribution from '@menus/commands/cabinet/distribution/main';
import conditionComposer from './condition';
import contractComposer from './contract';
import scheduleComposer from './schedule';
import statisticsComposer from './statistics';
import messageComposer from './messages';

const distributionComposer = new Composer<MyContext>();

distributionComposer.callbackQuery(/^mainDistribution:/, async (ctx: MyContext) => {
    try {
        // Сохраняем выбранную рассылку в сессию
        const distName = ctx.callbackQuery?.data?.split(':')[1];
        if (distName) {
            ctx.session.distribution.name = distName;
        }

        const menu = await menuDistribution(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        if (error instanceof GrammyError && error.description?.includes('message is not modified')) {
            return;
        }
        console.error('Ошибка в mainDistribution:', error);
        throw error;
    } finally {
        
    }
});

distributionComposer.use(messageComposer);
distributionComposer.use(conditionComposer);
distributionComposer.use(contractComposer);
distributionComposer.use(scheduleComposer);
distributionComposer.use(statisticsComposer);

export default distributionComposer;