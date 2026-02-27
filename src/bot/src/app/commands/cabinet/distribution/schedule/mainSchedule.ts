import db from '@shared/db/index';
import type { MyContext } from '@shared/types/SessionData';
import menuSchedule from '@menus/commands/cabinet/distribution/schedule';
import common from '@utils/common';

/**
 * Главная странца графика. Отображение графика
 */
export default async function mainSchedule(ctx: MyContext) {
    common.sessionReset(ctx.session);
    const nameDistribution = ctx.session.distribution.name!;
    const times = await db.time.getTimesForBot(nameDistribution);
    const menu = menuSchedule.main(ctx, times!);

    await ctx.editMessageText(menu.text,
        {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        }
    );
}