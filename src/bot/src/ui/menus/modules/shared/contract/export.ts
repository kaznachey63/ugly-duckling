import type { ExportType } from '@shared/types/ExportType';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.contract.view.contract.export.main.title"),
        ctx.t("modules.shared.contract.view.contract.export.main.path",  { 
            menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet"), 
            dateStart: new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU') 
        }),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text("PDF", `exportContract#${ctx.session.contract.id}-pdf`)
        .text("Word", `exportContract#${ctx.session.contract.id}-word`)   
        .row().text(ctx.t("utils.shared.buttons.back"), `viewContract#${ctx.session.contract.id}`)
    ;
    
    return { text: format.escapeMarkdown(text), keyboard }
}

function action(ctx: MyContext, exportType: ExportType, result: boolean): Menu<InlineKeyboard> {
    const userIsAdmin = ctx.session.isAdmin;
    const text = [
        result ? 
            ctx.t("modules.shared.contract.view.contract.export.result.caption", { exportType: exportType }) :
            ctx.t("modules.shared.contract.view.contract.export.result.error")
        ,
        ctx.t("modules.shared.contract.view.contract.export.result.path", { 
            call: ctx.session.sendout.call, 
            exportType: exportType, 
            menu: userIsAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet"), 
            dateStart: new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU')
        }),
    ].join('\n');

    const keyboard = new InlineKeyboard().row().text(ctx.t("utils.shared.buttons.back"), `viewContract#${ctx.session.contract.id}`);
    
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,     
    action
}