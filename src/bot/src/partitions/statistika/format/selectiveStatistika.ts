import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';
import CalendarImpl from 'grammy-calendar-telegram';
export const Calendar = CalendarImpl;
export type Calendar = InstanceType<typeof CalendarImpl>;

type SelectiveStatistikaType = {
    ctx: MyContext,
    calendar: Calendar
};

export default async function selectiveStatistika({ ctx, calendar }: SelectiveStatistikaType) {
    const nameDistribution = ctx.session.distribution.name;
    let result = calendar.getCalendar();
    (result.reply_markup.inline_keyboard as any).push(
        [{ text: "🔙 Назад", callback_data: "mainStatistika" + nameDistribution }]
    );

    await ctx.editMessageText(utils.formatting.escapeMarkdown
        (
            "Выборочная статистика.\nНиже - календарь с датами. Чтобы просмотреть результат рассылки за какой-то день - просто кликните на него!\n\nЕсли рассылки: \n*не произошло, \n*не было, \n*не запланировано, \n*или другое \n- будет отображено сообщение с соответсвующим контекстом, не пугайтесь." +
            `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Статистика → *Выборочная*]`
        ),
        {
            parse_mode: "MarkdownV2",
            ...result
        }
    );
}