import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import google from '@utils/google';
import menuContract from '@menus/modules/cabinet/distribution/contract';
import constants from '@constants';

const contractComposer = new Composer<MyContext>();

contractComposer.callbackQuery(/^mainContract:/, async (ctx: MyContext) => {
    try {
        const dataFromSheets = await google.getRowsFromGS(constants.google.rangeTable);
        const row = dataFromSheets?.find(r => r?.[0] === ctx.session.distribution.label);

        if (!row || row.length < 4) {
            await ctx.reply(ctx.t("commands.cabinet.distribution.contract.error"));
            return;
        }

        const [, customer, dateStart, dateStop] = row as [undefined, string, string, string];
        const menu = menuContract(ctx, { customer, dateStart, dateStop });

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в mainContract:', error);
    } finally {
        
    }
});

export default contractComposer;