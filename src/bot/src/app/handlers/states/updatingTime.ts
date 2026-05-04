import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';
import utils from "@utils";
import type { Schedule } from '@shared/types/DB';
import shared from './shared';

export default async function updatingTime(ctx: MyContext) {
    const sendoutName = ctx.session.sendout.name!;
    const server = new ServerManager();

    let menu;
    if (!shared.validateTime(ctx.message?.text!)) {
        menu = menuState.updatingTime(ctx, false, false);
    }
    else {
        const formattedCronTime = shared.formatCronTime(ctx.message?.text!);
        const formattedTime: Schedule = {
            cron: shared.formatCronTime(ctx.message?.text!),
            label: utils.local.formatTimeToRu(formattedCronTime)!,
            id: ctx.session.schedule.id!,
            sendout_id: ctx.session.sendout.id!
        };

        await db.schedule.update(formattedTime);
        menu = menuState.updatingTime(ctx, await server.restartProcessOrNot(sendoutName, true), true);
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}