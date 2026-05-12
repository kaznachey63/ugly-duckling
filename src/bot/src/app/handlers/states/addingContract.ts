import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuAddingContract from '@menus/handlers/states/addingContract';
import common from '@utils/common';
import type { Contract } from "@shared/types/DB";

export default async function addingContract(ctx: MyContext) {
    let menu;
    
    if (!validateContract(ctx.message?.text?.trim()!)) {        
        menu = menuAddingContract(ctx, false, false);
    }
    else {
        const contract = formatContract(ctx);
        const resultContract = await db.contract.insert(contract);
        if (!resultContract) menu = menuAddingContract(ctx, false, true);
        else {
            const sendoutIds = ctx.session.contract.sendout?.map(s => { return s.id });
            const resultSendouts = await db.sendout.updateManyOfIds(ctx.session.contract.id!, sendoutIds!);
            
            if (!resultSendouts) menu = menuAddingContract(ctx, false, true);
            else menu = menuAddingContract(ctx, true, true);
        }
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}

function validateContract(text: string): boolean {
    if (typeof text !== 'string' || text.trim().length === 0) return false;    
    if (text.split('\n').length !== 3) return false;
    
    const [dateStart, dateEnd, price] = text.split('\n');
        
    if (dateStart !== '-' && isNaN(Date.parse(dateStart!))) return false;
    
    if (dateEnd !== '-' && isNaN(Date.parse(dateEnd!))) return false;
    
    if (price !== '-' && isNaN(Number(price))) return false;
    
    return true;
}

function formatContract(ctx: MyContext): Contract {
    const contractInText = ctx.message?.text?.trim()!;
    const [dateStart, dateEnd, price] = contractInText.split('\n');

    return {
        date_start: dateStart === '-' ? null : new Date(dateStart!),
        date_end: dateEnd === '-' ? null : new Date(dateEnd!),
        price: price === '-' ? null : Number(price),
        user_id: ctx.session.contract.user_id!,
    };
}