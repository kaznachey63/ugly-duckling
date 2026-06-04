import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import utils from '@utils';

function process(ctx: MyContext, processes: string[]): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.system.server.process.main.title"),
        ctx.t("modules.commands.panel.system.server.process.main.path", { processType: ctx.t(`utils.processType.${ctx.session.server.processType}`) }),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard();

    processes.forEach(process => {
        keyboard.text(process, `control:${process}`).row()
    });
    
    keyboard.text(ctx.t("utils.shared.buttons.back"), "mainServer");
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function control(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.system.server.process.control.main.title"),
        ctx.t("modules.commands.panel.system.server.process.control.main.path", { 
            processType: ctx.t(`utils.processType.${ctx.session.server.processType}`) ,
            processName: ctx.session.server.processName
        }),
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.commands.panel.system.server.process.control.main.buttons.condition"), "mainCondition")
        .text(ctx.t("modules.commands.panel.system.server.process.control.main.buttons.log"), "mainLog")
        .row().text(ctx.t("utils.shared.buttons.back"), `mainProcess-${ctx.session.server.processType}`);
    ;
    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

export default {
    process,
    control,
}