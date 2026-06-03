import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import utils from '@utils';
import type { ProcessStatus } from "@shared/types/ProcessStatus";

/**
 * Меню раздела Состояние
 */
export default function condition(ctx: MyContext, status: ProcessStatus): Menu<InlineKeyboard> {
    const processName = ctx.session.server.processName;

    let keyboard = new InlineKeyboard();
    
    switch (status) {
        case "active": {
            keyboard
                .text(
                    ctx.t("modules.commands.panel.system.server.process.control.condition.buttons.stop"),
                    "stopProcess"
                )
                .text(
                    ctx.t("modules.commands.panel.system.server.process.control.condition.buttons.restart"),
                    "restartProcess"
                )
            ;
            break;
        }
        case "failed":
        case "inactive": {
            keyboard.text(
                ctx.t("modules.commands.panel.system.server.process.control.condition.buttons.start"),
                "startProcess"
            );
            break;
        }
    }
    
    const text = [
        ctx.t(`modules.commands.panel.system.server.process.control.condition.status.${status}`),
        ctx.t("modules.commands.panel.system.server.process.control.condition.path", { 
            processType: ctx.t(`utils.processType.${ctx.session.server.processType}`) ,
            processName: ctx.session.server.processName
        }),
    ].join('\n\n');

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `control:${processName}`);
    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}