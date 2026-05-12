import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

function remove(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard();
    let text = [
        ctx.t("modules.shared.contract.view.contract.remove.path", { dateStart: new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU') })
    ];

    if (result) {
        text.unshift(ctx.t("modules.shared.contract.view.contract.remove.success"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "viewContracts");
    }
    else {
        text.unshift(ctx.t("modules.shared.contract.view.contract.remove.error"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `viewUser#${ctx.session.contract.id}`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

function create(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.contract.view.contract.create.title"),    
        ctx.t("modules.shared.contract.view.contract.create.path")
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainContract");
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    remove,
    create
}