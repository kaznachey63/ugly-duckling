import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';
import type { Time } from "@shared/types/Time";
import utils from "@utils";

export default async function updatingTime(ctx: MyContext) {
    const sendoutName = ctx.session.sendout.name!;
    const server = new ServerManager();

    let menu;
    if (!validateTime(ctx.message?.text!)) {
        menu = menuState.addingOrUpdateTime(ctx, false, false);
    }
    else {
        const formattedCronTime = formatCronTime(ctx.message?.text!);
        const formattedTime: Time = {
            cron: formatCronTime(ctx.message?.text!),
            label: utils.local.formatTimeToRu(formattedCronTime)!,
            id: ctx.session.other.time.positionId
        };

        await db.schedule.updateTime(ctx.session.sendout.schema, formattedTime);
        menu = menuState.addingOrUpdateTime(ctx, await server.restartProcessOrNot(sendoutName, true), true);
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}

function validateTime(time: string): boolean {
    const trimmed = time.trim();
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5]?[0-9]$/;

    if (timeRegex.test(trimmed)) {
        return true;
    }

    const parts = trimmed.split(/\s+/);
    return parts.length === 5;
}

function formatCronTime(time: string): string {
    const trimmed = time.trim();
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5]?[0-9]$/;

    if (timeRegex.test(trimmed)) {
        const [hour, minute] = trimmed.split(':');
        return `${minute!.padStart(2, '0')} ${hour!.padStart(2, '0')} * * *`;
    }

    const [minute, hour, day, month, week_day] = trimmed.split(/\s+/);
    return `${minute!.padStart(2, '0')} ${hour!.padStart(2, '0')} ${day} ${month} ${week_day}`;
}