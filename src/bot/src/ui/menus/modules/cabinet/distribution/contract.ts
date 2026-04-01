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
export default function contract(ctx: MyContext, errorWithData: true): Menu<InlineKeyboard>
export default function contract(ctx: MyContext, contractInfo: ContractInfo, errorWithData: false): Menu<InlineKeyboard>
export default function contract(ctx: MyContext, contractInfoOrError: ContractInfo | boolean, errorWithData?: boolean): Menu<InlineKeyboard> {

    const is_error = typeof contractInfoOrError === 'boolean' ? contractInfoOrError : (errorWithData ?? false)
    const info = typeof contractInfoOrError === 'boolean' ? undefined : contractInfoOrError

    let textLines: string[] = []

    if (is_error) {
        textLines = [
            ctx.t("commands.cabinet.distribution.contract.title"),
            ctx.t("commands.cabinet.distribution.contract.error")
        ]
    }
    else if (info) {
        textLines = [
            ctx.t("commands.cabinet.distribution.contract.title"),
            ctx.t("commands.cabinet.distribution.contract.customer", { customer: info.customer }),
            ctx.t("commands.cabinet.distribution.contract.dateStart", { dateStart: info.dateStart }),
            ctx.t("commands.cabinet.distribution.contract.dateStop", { dateStop: info.dateStop }),
            ctx.t("commands.cabinet.distribution.contract.path", { call: ctx.session.distribution.call })
        ]
    }

    const text = format.escapeMarkdown(textLines.join('\n'))

    const keyboard = new InlineKeyboard()
        .text(ctx.t('commands.cabinet.distribution.contract.exportPDF'), `exportContract:${ctx.session.distribution.name}-pdf`)
        .row().text(ctx.t('utils.shared.back'), `mainDistribution:${ctx.session.distribution.name}`)
    ;

    return { text, keyboard }
}