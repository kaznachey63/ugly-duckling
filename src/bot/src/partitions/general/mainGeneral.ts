import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function mainGeneral(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name;
    const dataFromSheets = await utils.google.getRowsFromGS("Заказчики!A2:G");
    const [, customer, dateStart, dateStop] = dataFromSheets!.find(row => row?.[0] === ctx.session.distribution.label) ?? "Нет данных";
    const menuGeneral = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", "menuDistribution" + nameDistribution)]
    );
    
    await ctx.editMessageText(
        utils.formatting.escapeMarkdown(
            "Общие сведения." +
            `\nЗаказчик: ${customer}` +
            `\nДата начала: ${dateStart}` +
            `\nДата окончания: ${dateStop}` +
            `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → *Договор*]`
        ),
        {
            parse_mode: 'MarkdownV2',
            ...menuGeneral
        }
    );
}