import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuCabinet from '@menus/commands/cabinet/main';
import common from '@utils/common';
import init from '@utils/initialize';
import distributionComposer from './features/distribution'

const cabinetComposer = new Composer<MyContext>();

// ============================================================================
// КОМАНДА /cabinet
// ============================================================================
cabinetComposer.command('cabinet', async (ctx: MyContext) => {
    await processCabinet(ctx);
});

cabinetComposer.callbackQuery("mainCabinet", async (ctx: MyContext) => {
    await processCabinet(ctx);
});

async function processCabinet(ctx: MyContext) {
    try {
        // Сброс сессии
        ctx.session = init.createDefaultSession();

        // Пользователь есть в БД
        if (await db.user.userExistsInDB(ctx.from?.id!)) {
            await common.loadCabinet(ctx);
        } else {
            // Пользователя нет в БД — запрашиваем номер телефона
            const menu = menuCabinet.notAuthed(ctx);
            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        }
    } catch (error) {
        console.error('Ошибка в команде cabinet:', error);
    }
}

// ============================================================================
// ПОД-РАЗДЕЛЫ: подключение через .use()
// ============================================================================
cabinetComposer.use(distributionComposer);

// ============================================================================
// ЭКСПОРТ
// ============================================================================
export default cabinetComposer;