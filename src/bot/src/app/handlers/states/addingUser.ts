import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import common from '@utils/common';
import type { User } from "@shared/types/User";
import type { LanguageCode } from "grammy/types";
import constants from "@constants";
import type { RoleCode } from "@shared/types/RoleCode";
import localization from "@utils/localization";
import type { LanguagesALlowed } from "@shared/types/LanguagesAllowed";

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
    
    const [telegramId, name, username, phone, language, roleCode] = text.split('\n');
    
    if (telegramId !== '-' && isNaN(Number(telegramId))) return false;
    
    if (name !== '-' && name!.trim().length === 0) return false;
    
    if (username !== "-" && (!/[a-zA-Z]/.test(username!) || /^\d+$/.test(username!) || /^_+$/.test(username!))) return false;    
    
    if (phone !== '-' && isNaN(Number(phone))) return false;
    
    if (language !== '-' && !constants.allowLanguages.includes(language as LanguagesALlowed)) return false;
    
    if (roleCode !== '-' && !constants.roles.includes(roleCode as RoleCode)) return false;
    
    return true;
}

function formatUser(userInText: string): User {
    const [telegramId, name, username, phone, language, roleCode] = userInText.split('\n');
    const itogRoleCode: RoleCode = roleCode === '-' ? "unknown" : roleCode! as RoleCode;

    return {
        telegramId: telegramId === '-' ? null : BigInt(telegramId!),
        name: name === '-' ? null : name!,
        username: username === '-' ? null : username!,
        phone: phone === '-' ? null : phone!,
        language: language === '-' ? 'ru' : (language as LanguageCode),
        role: {
            id: localization.getRoleId(itogRoleCode),
            code: itogRoleCode
        }
    };
}