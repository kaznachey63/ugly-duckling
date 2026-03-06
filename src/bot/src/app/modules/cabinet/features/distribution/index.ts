import { Composer, GrammyError } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuDistribution from '@menus/commands/cabinet/distribution/main';

// Импорт разделов
import conditionComposer from './condition';
import contractComposer from './contract';
import scheduleComposer from './schedule';
import statisticsComposer from './statistics';

const distributionComposer = new Composer<MyContext>();

// ============================================================================
// 🔸 РЕГУЛЯРКА: mainDistribution (с параметром :name)
//    Пример: mainDistribution:dist_123
// ============================================================================
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

// ============================================================================
// ПОД-РАЗДЕЛЫ: подключение через .use()
// ============================================================================
distributionComposer.use(conditionComposer);
distributionComposer.use(contractComposer);
distributionComposer.use(scheduleComposer);
distributionComposer.use(statisticsComposer);

// ============================================================================
// ЭКСПОРТ
// ============================================================================
export default distributionComposer;