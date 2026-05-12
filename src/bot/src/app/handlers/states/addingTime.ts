import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuAddingTime from '@menus/handlers/states/addingTime';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';
import utils from "@utils";
import type { Schedule } from '@shared/types/DB';
import shared from './shared';

export default async function addingTime(ctx: MyContext) {
    let menu;
    if (!shared.validateTime(ctx.message?.text!)) {
        menu = menuAddingTime(ctx, false, false);
    }
    else {
        const formattedCronTime = shared.formatCronTime(ctx.message?.text!);
        const formattedTime: Schedule = {
            cron: shared.formatCronTime(ctx.message?.text!),
            label: utils.local.formatTimeToRu(formattedCronTime)!,
            sendout_id: ctx.session.sendout.id!
        };

        await db.schedule.create(formattedTime);
        const server = new ServerManager();
        menu = menuAddingTime(ctx, await server.restartProcessOrNot(ctx.session.sendout.name!, true), true);
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}