import type { ExportType } from "@shared/types/ExportType";
import type { Menu } from "@shared/types/Menu";
import type { MyContext } from "@shared/types/SessionData";
import { InlineKeyboard } from "grammy";
import format from '@utils/formatting';

function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t('commands.cabinet.distribution.messages.export.main.title'),
        ctx.t('commands.cabinet.distribution.contract.export.main.path', { call: ctx.session.sendout.call }),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text("PDF", `exportMessages:${ctx.session.sendout.name}-pdf`)
        .text("Word", `exportMessages:${ctx.session.sendout.name}-word`)   
        .text("Txt", `exportMessages:${ctx.session.sendout.name}-txt`)   
        .row().text(ctx.t('utils.shared.buttons.back'), `mainMessage:${ctx.session.sendout.name}`)
    ;
    
    return { text: format.escapeMarkdown(text), keyboard }
}

function result(ctx: MyContext, exportType: ExportType, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ? 
            ctx.t('commands.cabinet.distribution.messages.export.result.caption', { exportType: exportType }) :
            ctx.t('commands.cabinet.distribution.messages.export.result.error')
        ,
        ctx.t('commands.cabinet.distribution.messages.export.result.path', { call: ctx.session.sendout.call, exportType: exportType }),
    ].join('\n');

    const keyboard = new InlineKeyboard().row().text(ctx.t('utils.shared.buttons.back'), `mainMessage:${ctx.session.sendout.name}`);
    
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    result
}