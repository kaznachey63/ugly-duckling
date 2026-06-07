import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuAddingTime from '@menus/handlers/states/addingTime';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';
import utils from "@utils";
import type { Schedule } from '@shared/types/DB';
import shared from './shared';

export default async function addingTime(ctx: MyContext) {
    const lines = (ctx.message?.text ?? '')
        .replace(/\r/g, '')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
    ;

    if (!lines.length || lines.some(line => !shared.validateTime(line))) {
        const menu = menuAddingTime(ctx, false, false);
        return sendMenu(ctx, menu);
    }

    const times: Schedule[] = lines.map(line => {
        const cron = shared.formatCronTime(line);
        return {
            cron,
            label: utils.local.formatTimeToRu(ctx, cron)!,
            sendout_id: ctx.session.sendout.id!
        };
    });

    await db.schedule.createMany(times);

    const restartState = await ServerManager.restartProcessOrNot(ctx.session.sendout.name!, true);

    const menu = menuAddingTime(ctx, restartState, true);
    common.resetSessionStates(ctx.session);

    await sendMenu(ctx, menu);
}

async function sendMenu(ctx: MyContext, menu: any) {
    await ctx.api.editMessageText(
        ctx.chatId!,
        ctx.session.other.ids.idForUpdateMessageFromState,
        menu.text,
        {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        }
    );
}