import type { MyContext } from '@shared/types/SessionData';
import type { Menu } from "@shared/types/Menu";
import { InlineKeyboard } from "grammy";
import utils from "@utils";

type ContractInfo = {
    customer: string;
    dateStart: string;
    dateStop: string;
};

/**
 * Меню обработчика контакта
 */
export default function contract(ctx: MyContext, contractInfo: ContractInfo): Menu<InlineKeyboard> {
    const textLines = [
        ctx.t('distribution.sections.contract.title', { customer: contractInfo.customer }),
        ctx.t('distribution.sections.contract.dateStart', { dateStart: contractInfo.dateStart }),
        ctx.t('distribution.sections.contract.dateStop', { dateStop: contractInfo.dateStop }),
        ctx.t('distribution.sections.contract.path', { call: ctx.session.distribution.call })
    ].join('\n');

    const text = utils.formatting.escapeMarkdown(textLines);

    const keyboard = new InlineKeyboard()
        .text(ctx.t('nav.back'), `mainDistribution${ctx.session.distribution.name}`)
    ;

    return { text, keyboard };
}