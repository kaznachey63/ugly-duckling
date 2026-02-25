import utils from "@utils";
import type { MyContext } from '@shared/types/SessionData';
import menuContract from '@menus/distribution/sections/contract';

/**
 * Обработчик контакта
 */
export default async function mainContract(ctx: MyContext) {
    const dataFromSheets = await utils.google.getRowsFromGS("Заказчики!A2:G");

    const row = dataFromSheets?.find(r => r?.[0] === ctx.session.distribution.label);

    // Твоя проверка
    if (!row || row.length < 4) {
        await ctx.reply("distribution.sections.contract.error");
        return;
    }

    const [, customer, dateStart, dateStop] = row as [undefined, string, string, string];

    const menu = menuContract(ctx, { customer, dateStart, dateStop });

    await ctx.editMessageText(menu.text, {
        parse_mode: 'MarkdownV2',
        reply_markup: menu.keyboard
    });
}