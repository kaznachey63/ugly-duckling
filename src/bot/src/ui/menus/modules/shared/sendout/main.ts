import { InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Menu } from '@shared/types/Menu';
import format from '@utils/formatting';
import type { Sendout } from '@shared/types/DB';

/**
 * Отображение рассылок
 */
export default function main(ctx: MyContext, sendouts: Sendout[]): Menu<InlineKeyboard> {
    const text: string[] = [
        ctx.t("modules.shared.sendout.main.path", { menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ];

    const keyboard = new InlineKeyboard();
    
    if (sendouts.length > 0) {
        text.unshift(ctx.t("modules.shared.sendout.main.title"));
        sendouts.forEach((sendout) => {
            keyboard.text(
                sendout.call! ?? sendout.label,
                `viewSendout:${sendout.id}`
            ).row();
        }); 
    }
    else {
        text.unshift(ctx.t("modules.shared.sendout.main.empty"));
    }
   
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), ctx.session.isAdmin ? "mainData" : "mainCabinet");

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard };
}