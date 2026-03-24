import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';
import type { Time } from "@shared/types/Time";

export default async function addingTime(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const server = new ServerManager();

    let menu;
    if (!validateTime(ctx.message?.text!)) {
        menu = menuState.addingTime(ctx, await server.restartProcessOrNot(nameDistribution, true), false);
    }
    else {
        await db.time.addTime(ctx.session.distribution.schema, formatTime(ctx.message?.text!));
        menu = menuState.addingTime(ctx, await server.restartProcessOrNot(nameDistribution, true), true);
    }
    common.resetSessionStates(ctx.session);

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}

function validateTime(time: string): boolean {
    const trimmed = time.trim();
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (timeRegex.test(trimmed)) {
        return true;
    }

    const parts = trimmed.split(/\s+/);
    return parts.length === 5;
}

function formatTime(time: string): Time {
    const trimmed = time.trim();
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (timeRegex.test(trimmed)) {
        const [hour, minute] = trimmed.split(':');
        return {
            minute: minute!,
            hour: hour!,
            day: '*',
            month: '*',
            week_day: '*',
        };
    }

    const [minute, hour, day, month, week_day] = trimmed.split(/\s+/);

    return {
        minute: minute!,
        hour: hour!,
        day: day!,
        month: month!,
        week_day: week_day!,
    };
}