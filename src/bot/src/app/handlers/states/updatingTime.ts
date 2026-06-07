import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuUpdatingTime from '@menus/handlers/states/updatingTime';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';
import utils from "@utils";
import type { Schedule } from '@shared/types/DB';
import shared from './shared';

export default async function updatingTime(ctx: MyContext) {
    let menu;
    if (!shared.validateTime(ctx.message?.text!)) {
        menu = menuUpdatingTime(ctx, false, false);
    }
    else {
        const formattedCronTime = shared.formatCronTime(ctx.message?.text!);
        const formattedTime: Schedule = {
            cron: shared.formatCronTime(ctx.message?.text!),
            label: utils.local.formatTimeToRu(ctx, formattedCronTime)!,
            id: ctx.session.schedule.id!,
            sendout_id: ctx.session.sendout.id!
        };

        await db.schedule.update(formattedTime);
        menu = menuUpdatingTime(ctx, await ServerManager.restartProcessOrNot(ctx.session.sendout.name!, true), true);
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}