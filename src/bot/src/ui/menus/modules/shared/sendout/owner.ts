import type { MyContext } from "@shared/types/SessionData";
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { User } from "@shared/types/DB";
import formatting from "@utils/formatting";

/**
 * Меню просмотра владельца рассылки
 */
function main(ctx: MyContext, user: User | undefined): Menu<InlineKeyboard> {
    const sendoutId = ctx.session.sendout.id;
    const text: string[] = [
        '',
        ctx.t("modules.shared.sendout.view.owner.main.path", { call: ctx.session.sendout.call }),
    ];

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.sendout.view.owner.main.buttons.change"), `mainChangeOwner:${sendoutId}`).row()
        .text(ctx.t("utils.shared.buttons.back"), `viewSendout:${sendoutId}`)
    ;
        
    if (user) {
        text.unshift(
            ctx.t("modules.shared.sendout.view.owner.main.title"),
            ctx.t("modules.shared.sendout.view.owner.main.name", { name: user.name }),
            ctx.t("modules.shared.sendout.view.owner.main.phone", { phone: user.phone }),
        );
    }
    else text.unshift(ctx.t("modules.shared.sendout.view.owner.main.empty"));
        
    return { text: formatting.escapeMarkdown(text.join('\n')), keyboard }
}

/**
 * Меню выбора владельца для смены
 */
function update(ctx: MyContext, users: User[]): Menu<InlineKeyboard> {
    const text: string[] = [
        ctx.t("modules.shared.sendout.view.owner.update.main.title"),
        ctx.t("modules.shared.sendout.view.owner.update.main.path", { call: ctx.session.sendout.call }),
    ];

    const keyboard = new InlineKeyboard().text(ctx.t("modules.shared.sendout.view.owner.update.main.noOwner"), `mainAppointOwner:${ctx.session.sendout.id}=0`).row();
        
    users.forEach(user => {
        keyboard.text(
            user.name!, 
            `mainAppointOwner:${ctx.session.sendout.id}=${user.id}`
        ).row();
    });
    keyboard.text(ctx.t("utils.shared.buttons.back"), `mainOwner:${ctx.session.sendout.id}`)
    return { text: formatting.escapeMarkdown(text.join('\n\n')), keyboard }
}

/**
 * Меню результата смены рассылки
 */
function appoint(ctx: MyContext, user: User, result: boolean): Menu<InlineKeyboard> {
    const text: string[] = [
        ctx.t("modules.shared.sendout.view.owner.update.action.path", { 
            call: ctx.session.sendout.call,
            owner: user?.name ?? "Без владельца"
        }),
    ];

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainOwner:${ctx.session.sendout.id}`);

    if (result) text.unshift(ctx.t("modules.shared.sendout.view.owner.update.action.success"));
    else text.unshift(ctx.t("modules.shared.sendout.view.owner.update.action.error"));

    return { text: formatting.escapeMarkdown(text.join('\n\n')), keyboard }
}

export default {
    main,
    update,
    appoint
}