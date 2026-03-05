import db from '@shared/db/index';
import local from "@utils/localization";
import type { MyContext } from '@shared/types/SessionData';
import menuSchedule from '@menus/commands/cabinet/distribution/schedule';

/**
 * Выбор действия: удаление или изменение времени
 */
export default async function updateOrRemoveTime(ctx: MyContext) {
    const queryData = ctx.callbackQuery?.data;
    const timeId = Number(queryData!.split(/:/)[1]);
    ctx.session.state.time.paginationId = timeId;
    const targetTime = local.formatTimeToRu(await db.time.getTime(ctx.session.distribution.schema, timeId));
    const menu = menuSchedule.updateOrRemove(ctx, targetTime!);

    await ctx.editMessageText(menu.text,
        {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        }
    );
}