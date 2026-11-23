import type { Sendout, User } from "@shared/types/DataBase";
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';
import constants from '@common/constants';
import common from '@utils/common';

function remove(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard();
    let text = [
        ctx.t("modules.shared.contract.view.contract.remove.path", { dateStart: common.getCurrentDate(ctx.session.contract.date_start) })
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
        ctx.t("modules.shared.contract.create.title"),
        ctx.t("modules.shared.contract.create.data.user"),
        '',
        ctx.t("modules.shared.contract.create.path"),
    ];

    const keyboard = new InlineKeyboard();
    users = users.filter(u => u.role_id != 3);
    users.forEach(user => {
        const userName = user.name ?? ctx.t("utils.shared.nameless");
        const callbackText = user.id == ctx.session.contract.user_id 
            ? userName + ' ☑️' 
            : userName;

        keyboard.text(callbackText, `pickUser#${user.id}`);

        if (user.telegram_id) {
            keyboard.url(constants.emoji.profile, constants.link.profileById + user.telegram_id);
        }
        keyboard.row();
    });

    keyboard
        .text(ctx.t("modules.shared.contract.create.step", { number: 1 }), "amountSteps")
        .text('➡', "chooseSendouts")   
        .row().text(ctx.t("utils.shared.buttons.back"), "mainContract")
    ;
    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}

function chooseSendouts(ctx: MyContext, sendouts: Sendout[]) {
    const text: string[] = [
        ctx.t("modules.shared.contract.create.title"),
        ctx.t("modules.shared.contract.create.data.sendout"),
        '',
        ctx.t("modules.shared.contract.create.path"),
    ];

    const keyboard = new InlineKeyboard();
        
    sendouts.forEach(sendout => {
        const sendoutName = sendout.call ?? ctx.t("utils.shared.nameless");
        const callbackText = ctx.session.contract.sendout?.some(s => s.id === sendout.id)
            ? sendoutName + ' ☑️'
            : sendoutName;

        keyboard.text(callbackText, `pickSendout#${sendout.id}`).row();
    });

    keyboard
        .text('⬅', "chooseUsers")
        .text(ctx.t("modules.shared.contract.create.step", { number: 2 }), "amountSteps")
        .text('➡', "inputContractData")
        .row().text(ctx.t("utils.shared.buttons.back"), "mainContract")
    ;

    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}

function inputData(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.contract.create.title"), 
        ctx.t("modules.shared.contract.create.data.contract"),
        '',   
        ctx.t("modules.shared.contract.create.path")
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text('⬅', "chooseSendouts")
        .text(ctx.t("modules.shared.contract.create.step", { number: 3 }), "amountSteps")
        .row().url(ctx.t("utils.shared.buttons.instruction"), constants.link.instruction.contract.add)
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