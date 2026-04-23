import type { MyContext } from '@shared/types/SessionData';
import type { Menu } from "@shared/types/Menu";
import { InlineKeyboard } from "grammy";
import format from "@utils/formatting";
import type { ExportType } from '@shared/types/ExportType';
import type { Contract } from '@shared/types/Contract';

/**
 * Меню обработчика контакта
 */
function main(ctx: MyContext, errorWithData: true): Menu<InlineKeyboard>
function main(ctx: MyContext, contractInfo: Contract[], errorWithData: false): Menu<InlineKeyboard>
function main(ctx: MyContext, contractInfoOrError: Contract[] | boolean, errorWithData?: boolean): Menu<InlineKeyboard> {

    const is_error = typeof contractInfoOrError === 'boolean' ? contractInfoOrError : (errorWithData ?? false)
    const info = typeof contractInfoOrError === 'boolean' ? undefined : contractInfoOrError

    let textLines: string[] = []

    if (is_error) {
        textLines = [
            ctx.t("commands.cabinet.profile.contract.main.title"),
            ctx.t("commands.cabinet.profile.contract.main.error")
        ]
    }
    else if (info) {
        textLines = [
            ctx.t("commands.cabinet.profile.contract.main.title"),
            ctx.t("commands.cabinet.profile.contract.main.customer", { customer: info[0]?.customerName }),
            ctx.t("commands.cabinet.profile.contract.main.dateStart", { dateStart: info[0]?.dateStart }),
            ctx.t("commands.cabinet.profile.contract.main.dateStop", { dateStop: info[0]?.dateEnd }),
            ctx.t("commands.cabinet.profile.contract.main.path", { call: ctx.session.sendout.call })
        ]
    }

    const text = format.escapeMarkdown(textLines.join('\n'))

    const keyboard = new InlineKeyboard()
        .text(ctx.t('utils.shared.export'), `mainExportContract:${ctx.session.sendout.name}`)
        .row().text(ctx.t('utils.shared.back'), `mainDistribution:${ctx.session.sendout.name}`)
    ;

    return { text, keyboard }
}

function mainExportContract(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t('commands.cabinet.profile.contract.export.main.title'),
        ctx.t('commands.cabinet.profile.contract.export.main.path', { call: ctx.session.sendout.call }),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t('utils.shared.pdf'), `exportContract:${ctx.session.sendout.name}-pdf`)
        .text(ctx.t('utils.shared.word'), `exportContract:${ctx.session.sendout.name}-word`)   
        .row().text(ctx.t('utils.shared.back'), `mainContract:${ctx.session.sendout.name}`)
    ;
    
    return { text: format.escapeMarkdown(text), keyboard }
}

function exportContract(ctx: MyContext, exportType: ExportType, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ? 
            ctx.t('commands.cabinet.profile.contract.export.result.caption', { exportType: exportType }) :
            ctx.t('commands.cabinet.profile.contract.export.result.error')
        ,
        ctx.t('commands.cabinet.profile.contract.export.result.path', { call: ctx.session.sendout.call, exportType: exportType }),
    ].join('\n');

    const keyboard = new InlineKeyboard().row().text(ctx.t('utils.shared.back'), `mainContract:${ctx.session.sendout.name}`);
    
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    exportContract,
    mainExportContract
}