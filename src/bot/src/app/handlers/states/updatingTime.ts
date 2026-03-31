import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';
import type { Time } from "@shared/types/Time";

export default async function updatingTime(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const server = new ServerManager();
    const userInput = ctx.message?.text!;

    console.log('[updatingTime] userInput:', userInput);
    console.log('[updatingTime] chatId:', ctx.chatId);
    console.log('[updatingTime] idForUpdateMessageFromState:', ctx.session.other.ids.idForUpdateMessageFromState);

    let menu;
    const isValid = validateTime(userInput);
    console.log('[updatingTime] validateTime result:', isValid);

    if (!isValid) {
        console.log('[updatingTime] Validation failed');
        menu = menuState.addingOrUpdateTime(ctx, await server.restartProcessOrNot(nameDistribution, true), false);
    }
    else {
        const formattedTime = formatTime(userInput);
        console.log('[updatingTime] formattedTime:', formattedTime);

        await db.time.updateTIme(ctx.session.distribution.schema, formattedTime);
        console.log('[updatingTime] DB update completed');

        menu = menuState.addingOrUpdateTime(ctx, await server.restartProcessOrNot(nameDistribution, true), true);
        common.resetSessionStates(ctx.session);
    }

    console.log('[updatingTime] menu.text:', menu.text);
    console.log('[updatingTime] menu.keyboard:', menu.keyboard);

    try {
        await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
        console.log('[updatingTime] Message updated successfully');
    } catch (error) {
        console.error('[updatingTime] Error updating message:', error);
    }
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

function formatTime(time: string): Time {
    const trimmed = time.trim();
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5]?[0-9]$/;

    if (timeRegex.test(trimmed)) {
        const [hour, minute] = trimmed.split(':');
        return {
            minute: minute!.padStart(2, '0'),
            hour: hour!.padStart(2, '0'),
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