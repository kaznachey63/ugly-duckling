import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню раздела чаты
 */
export default function main(ctx: MyContext, amountOfChats: number): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.panel.data.chat.main.title", { amount: amountOfChats }),
        ctx.t("modules.commands.panel.data.chat.main.path")
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard();
    
    if (amountOfChats > 0) {
        keyboard.text(ctx.t("utils.shared.buttons.clear"), "clearChats").style("danger");
    }
    
    keyboard
        .text(ctx.t("modules.commands.panel.data.chat.main.buttons.reupload"), "reuploadChats").style("success").row()
        .text(ctx.t("utils.shared.buttons.back"), "mainData")
    ;
    return { text: format.escapeMarkdown(text), keyboard }
};