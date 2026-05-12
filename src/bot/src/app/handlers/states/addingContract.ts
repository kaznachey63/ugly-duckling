import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuAddingContract from '@menus/handlers/states/addingContract';
import common from '@utils/common';
import type { Contract } from "@shared/types/DB";

export default async function addingContract(ctx: MyContext) {
    let menu;
    const text = ctx.message?.text?.trim()!;
    const userIds = (await db.user.getIds()).map(u => u.id) as number[];
    
    if (!validateContract(text, userIds!)) {        
        menu = menuAddingContract(ctx, false, false);
    }
    else {
        const contract = formatContract(text);
        menu = menuAddingContract(ctx, await db.contract.insert(contract), true);
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}

function validateContract(text: string, userIds: number[]): boolean {
    if (typeof text !== 'string' || text.trim().length === 0) return false;    
    if (text.split('\n').length !== 4) return false;
    
    const [userId, dateStart, dateEnd, price] = text.split('\n');
    
    if (userId !== '-' && isNaN(Number(userId)) && !userIds.includes(Number(userId))) return false;
    
    if (dateStart !== '-' && isNaN(Date.parse(dateStart!))) return false;
    
    if (dateEnd !== '-' && isNaN(Date.parse(dateEnd!))) return false;
    
    if (price !== '-' && isNaN(Number(price))) return false;
    
    return true;
}

function formatContract(contractInText: string): Contract {
    const [userId, dateStart, dateEnd, price] = contractInText.split('\n');

    return {
        user_id: userId === '-' ? null : Number(userId),
        date_start: dateStart === '-' ? null : new Date(dateStart!),
        date_end: dateEnd === '-' ? null : new Date(dateEnd!),
        price: price === '-' ? null : Number(price)
    };
}