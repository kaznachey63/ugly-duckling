import type { ExportType } from "@shared/types/ExportType";
import type { Menu } from "@shared/types/Menu";
import type { MyContext } from "@shared/types/SessionData";
import { InlineKeyboard } from "grammy";
import format from '@utils/formatting';
import constants from "@common/constants";

function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.schedule.export.main.title"),
        ctx.t("modules.shared.sendout.view.schedule.export.main.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(constants.exportt.type.pdf, `exportSchedule:${ctx.session.sendout.id}-pdf`)
        .text(constants.exportt.type.docx, `exportSchedule:${ctx.session.sendout.id}-word`)   
        .text(constants.exportt.type.txt, `exportSchedule:${ctx.session.sendout.id}-txt`)   
        .row().text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.id}`)
    ;
    
    return { text: format.escapeMarkdown(text), keyboard }
}

function result(ctx: MyContext, exportType: ExportType, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ? 
            ctx.t("modules.shared.sendout.view.schedule.export.result.caption", { exportType: exportType }) :
            ctx.t("modules.shared.sendout.view.schedule.export.result.error")
        ,
        ctx.t("modules.shared.sendout.view.schedule.export.result.path", { call: ctx.session.sendout.call, exportType: exportType, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ].join('\n');

    const keyboard = new InlineKeyboard().row().text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.id}`);
    
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    result
}