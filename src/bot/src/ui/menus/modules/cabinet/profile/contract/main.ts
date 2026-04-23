import type { MyContext } from '@shared/types/SessionData';
import type { Menu } from "@shared/types/Menu";
import { InlineKeyboard } from "grammy";
import format from "@utils/formatting";
import common from '@utils/common';

/**
 * Главное меню раздела договор
 */
export default function main(ctx: MyContext, contractsLength: number): Menu<InlineKeyboard> {
    let text = [
        ctx.t('commands.cabinet.profile.contract.main.title', { amount: contractsLength }),
        ctx.t('commands.cabinet.profile.contract.main.path', { call: ctx.session.sendout.call }),
    ];
    
    const keyboard = new InlineKeyboard();
    const sendoutCall = ctx.session.sendout.call;

    if (common.isAdmin(ctx.session.user.role)) {
        keyboard.text(ctx.t("commands.cabinet.profile.contract.main.buttons.create"), "createContract").style("success");
    }

    // Нет времени
    if (contractsLength == 0) {     
        text.push(ctx.t("commands.cabinet.profile.contract.main.empty", { call: sendoutCall }));
    }
    else {
        text.push(ctx.t('commands.cabinet.profile.contract.main.title', { amount: contractsLength }));

        if (common.isAdmin(ctx.session.user.role)) {
            keyboard.text(ctx.t("commands.cabinet.profile.contract.main.buttons.clear"), "clearContract").style("danger").row()
        }

        keyboard.text(ctx.t("commands.cabinet.profile.contract.main.buttons.view"), "viewContract").style("primary")
    }
  
    keyboard.row().text(ctx.t("utils.shared.back"), "mainProfile");
    text.push(ctx.t("commands.cabinet.distribution.schedule.main.path", { call: sendoutCall }));

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}