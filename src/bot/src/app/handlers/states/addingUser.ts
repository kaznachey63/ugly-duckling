import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import common from '@utils/common';
import type { User } from "@shared/types/User";
import type { LanguageCode } from "grammy/types";
import type { Role } from "@shared/types/Role";

export default async function addingUser(ctx: MyContext) {
    let menu;
    const text = ctx.message?.text?.trim()!;
    if (!validateUser(text)) {        
        menu = menuState.addingUser(ctx, false, false);
    }
    else {
        const user = formatUser(text);
        menu = menuState.addingUser(ctx, await db.user.insertToDB(user), true);
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}

function validateUser(text: string): boolean {
    if (typeof text !== 'string' || text.trim().length === 0) return false;    
    if (text.split('\n').length !== 6) return false;
    return true;
}

function formatUser(userInText: string): User {
    const [telegramId, name, username, phone, language, roleCode] = userInText.split('\n');
    return {
        telegramId: BigInt(telegramId!),
        name: name!,
        username: username!,
        phone: phone!,
        language: language as LanguageCode,
        role: roleCode as Role
    };
}