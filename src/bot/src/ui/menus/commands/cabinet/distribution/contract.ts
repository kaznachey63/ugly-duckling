import type { MyContext } from '@shared/types/SessionData';
import type { Menu } from "@shared/types/Menu";
import { InlineKeyboard } from "grammy";
import format from "@utils/formatting";

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
        ctx.t("commands.cabinet.distribution.contract.title"),
        ctx.t("commands.cabinet.distribution.contract.customer", { customer: contractInfo.customer }),
        ctx.t("commands.cabinet.distribution.contract.dateStart", { dateStart: contractInfo.dateStart }),
        ctx.t("commands.cabinet.distribution.contract.dateStop", { dateStop: contractInfo.dateStop }),
        ctx.t("commands.cabinet.distribution.contract.path", { call: ctx.session.distribution.call })
    ].join('\n');

    const text = format.escapeMarkdown(textLines);

    const keyboard = new InlineKeyboard()
        .text(ctx.t('utils.shared.back'), `mainDistribution:${ctx.session.distribution.name}`)
    ;

    return { text, keyboard };
}