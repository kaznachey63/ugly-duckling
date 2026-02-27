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
        ctx.t("commands.cabinet.distribution.contract.title", { customer: contractInfo.customer }),
        ctx.t("commands.cabinet.distribution.contract.dateStart", { dateStart: contractInfo.dateStart }),
        ctx.t("commands.cabinet.distribution.contract.dateStop", { dateStop: contractInfo.dateStop }),
        ctx.t("commands.cabinet.distribution.contract.path", { call: ctx.session.distribution.call })
    ].join('\n');

    const text = utils.formatting.escapeMarkdown(textLines);

    const keyboard = new InlineKeyboard()
        .text(ctx.t('utils.shared.back'), `mainDistribution${ctx.session.distribution.name}`)
    ;

    return { text, keyboard };
}