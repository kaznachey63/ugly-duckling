import type { Sendout, User } from '@shared/types/DB';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';
import constants from '@common/constants';

function remove(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard();
    let text = [
        ctx.t("modules.shared.contract.view.contract.remove.path", { dateStart: new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU') })
    ];

    if (result) {
        text.unshift(ctx.t("modules.shared.contract.view.contract.remove.success"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), "mainContract");
    }
    else {
        text.unshift(ctx.t("modules.shared.contract.view.contract.remove.error"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `viewContract#${ctx.session.contract.id}`);
    }
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

function chooseUsers(ctx: MyContext, users: User[]): Menu<InlineKeyboard> {
    const text: string[] = [
        ctx.t("modules.shared.shared.contract.create.title"),
        ctx.t("modules.shared.shared.contract.create.data.user"),
        '',
        ctx.t("modules.shared.shared.contract.create.path"),
    ];

    const keyboard = new InlineKeyboard();
    users =  users.filter(u => u.role_id != 3);
    users.forEach(user => {
        if (user.id == ctx.session.contract.user_id)
            keyboard
            .text(
                user.name! + ' ☑️', 
                `pickUser#${user.id}`
            )
            .url(
                constants.emoji.profile, 
                constants.link.profileById + user.telegram_id
            )
            .row();
        else
            keyboard.text(
                user.name!, 
                `pickUser#${user.id}`
            )
            .url(
                constants.emoji.profile, 
                constants.link.profileById + user.telegram_id
            )
            .row();
    });

    keyboard
        .text(ctx.t("modules.shared.shared.contract.create.step", { number: 1 }), "amountSteps")
        .text('➡', "chooseSendouts")   
        .row().text(ctx.t("utils.shared.buttons.back"), "mainContract")
    ;
    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}

function chooseSendouts(ctx: MyContext, sendouts: Sendout[]) {
    const text: string[] = [
        ctx.t("modules.shared.shared.contract.create.title"),
        ctx.t("modules.shared.shared.contract.create.data.sendout"),
        '',
        ctx.t("modules.shared.shared.contract.create.path"),
    ];

    const keyboard = new InlineKeyboard();
        
    sendouts.forEach(sendout => {
        if (ctx.session.contract.sendout?.some(s => s.id === sendout.id))            
            keyboard.text(
                sendout.call! + ' ☑️', 
                `pickSendout#${sendout.id}`
            ).row();
        else
            keyboard.text(
                sendout.call!, 
                `pickSendout#${sendout.id}`
            ).row();
    });

    keyboard
        .text('⬅', "chooseUsers")
        .text(ctx.t("modules.shared.shared.contract.create.step", { number: 2 }), "amountSteps")
        .text('➡', "inputContractData")
        .row().text(ctx.t("utils.shared.buttons.back"), "mainContract")
    ;

    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}

function inputData(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.shared.contract.create.title"), 
        ctx.t("modules.shared.shared.contract.create.data.contract"),
        '',   
        ctx.t("modules.shared.shared.contract.create.path")
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text('⬅', "chooseSendouts")
        .text(ctx.t("modules.shared.shared.contract.create.step", { number: 3 }), "amountSteps")
        .row().text(ctx.t("utils.shared.buttons.back"), "mainContract")
    ;
    
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    remove,
    chooseUsers,
    chooseSendouts,
    inputData
}