import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuAddingContract from '@menus/handlers/states/addingContract';
import common from '@utils/common';
import type { Contract } from "@shared/types/DataBase";
import constants from "@common/constants";

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
            const resultSendouts = await db.sendout.updateManyOfIds(resultContract.id, sendoutIds!);
            
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
    if (text.split('\n').length !== 2) return false;

    const [dateStart, dateEnd] = text.split('\n').map(s => s.trim());

    if (dateStart !== '-' && !isValidDateInput(dateStart!)) return false;
    if (dateEnd !== '-' && !isValidDateInput(dateEnd!)) return false;

    return true;
}

function isValidDateInput(input: string): boolean {
    const match = input.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return false;

    const [, dd, mm, yyyy] = match;
    const day = Number(dd);
    const month = Number(mm);
    const year = Number(yyyy);

    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function parseDate(input: string): Date {
    const [day, month, year] = input.split('-').map(Number);
    return new Date(Date.UTC(year!, month! - 1, day));
}

function formatContract(ctx: MyContext): Contract {
    const contractInText = ctx.message?.text?.trim()!;
    const [dateStart, dateEnd] = contractInText.split('\n');

    return {
        date_start: dateStart === '-' ? null : parseDate(dateStart!),
        date_end: dateEnd === '-' ? null : parseDate(dateEnd!),
        price: constants.price.days30 * ctx.session.contract.sendout?.length!,
        // @ts-ignore
        price_text: constants.priceText[ctx.session.contract.sendout?.length]!,
        user_id: ctx.session.contract.user_id!,
    };
}