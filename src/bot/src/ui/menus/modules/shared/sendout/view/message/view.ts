import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import constants from '@constants';
import type { Message } from '@shared/types/DB';

// Отображение сообщения
function main(
    ctx: MyContext, 
    totalMessages: number, 
    currentDisplayPos: number, // 1-based: 1, 2, 3... (только для текста!)
    prevPosition: number | null, // position из БД для кнопки ⬅
    nextPosition: number | null, // position из БД для кнопки ➡
    currentPosition: number      // 🔥 НОВЫЙ: текущая position из БД (2, 3, 4...)
): Menu<InlineKeyboard> {
    
    const sendoutId = ctx.session.sendout.id;
    const message = ctx.session.message;
    
    const mediaCount = message.media?.length ?? 0;

    const text = [
        ctx.t("modules.shared.sendout.view.sendout.message.view.main.messageNumber", { number: currentDisplayPos }) + ' ' +
        ctx.t("modules.shared.sendout.view.sendout.message.view.main.amountMedia", { amount: mediaCount, maxMedia: constants.media.maxMedia }),
        `\`\`\`\n${message.caption ?? ''}\n\`\`\`\n`,
        ctx.t("modules.shared.sendout.view.sendout.message.view.main.path", { 
            call: ctx.session.sendout.call, 
            menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") 
        })
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.sendout.view.sendout.message.view.main.buttons.updateText"), `updateText:${sendoutId}#${message.id}`).style("primary")
        .text(ctx.t("utils.shared.buttons.remove"), `removeMessage:${sendoutId}#${message.id}`).style("danger").row();

    if (mediaCount > 0 && mediaCount < 4) {
        keyboard.text(ctx.t("modules.shared.sendout.view.sendout.message.view.main.buttons.addMedia"), `addMedia:${sendoutId}#${message.id}`).style("success")
               .text(ctx.t("modules.shared.sendout.view.sendout.message.view.main.buttons.clearAllMedia"), `clearAllMedia:${sendoutId}#${message.id}`).style("danger").row();
    } else if (mediaCount === 0) {
        keyboard.text(ctx.t("modules.shared.sendout.view.sendout.message.view.main.buttons.addMedia"), `addMedia:${sendoutId}#${message.id}`).style("success").row();
    } else if (mediaCount === 4) {
        keyboard.text(ctx.t("modules.shared.sendout.view.sendout.message.view.main.buttons.clearAllMedia"), `clearAllMedia:${sendoutId}#${message.id}`).style("danger").row();
    }

    // === ПАГИНАЦИЯ ===
    const paginationLabel = `${currentDisplayPos} / ${totalMessages}`;
    // Для кнопки n/n тоже используем display-номер, так как pagination меню само разберется
    const paginationCb = `paginationMessages:${sendoutId}#${currentDisplayPos}/${totalMessages}`;

    if (totalMessages === 1) {
        keyboard.text(paginationLabel, paginationCb).row();
    } else {
        // 🔥 ИСПРАВЛЕНИЕ: в колбэки стрелок кладем ПОЗИЦИИ из БД, а не display-номера
        if (prevPosition !== null) {
            keyboard.text("⬅", `viewMessage:${sendoutId}#${prevPosition}-prev`);
        }
        
        keyboard.text(paginationLabel, paginationCb);
        
        if (nextPosition !== null) {
            keyboard.text("➡", `viewMessage:${sendoutId}#${nextPosition}-next`);
        }
        keyboard.row();
    }

    keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${sendoutId}`);
    return { text: format.escapeMarkdown(text), keyboard };
}

// сообщения
function removeMessage(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.sendout.message.view.text.remove.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ];
    const keyboard = new InlineKeyboard();
    
    if (result) {
        text.unshift(ctx.t("modules.shared.sendout.view.sendout.message.view.text.remove.success"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
    }
    else {
        text.unshift(ctx.t("modules.shared.sendout.view.sendout.message.view.text.remove.error"));
        keyboard.text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}`);
    }
    
    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

// текст
function updateText(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.sendout.message.view.text.update.title"),
        ctx.t("modules.shared.sendout.view.sendout.message.view.text.update.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `mainMessage:${ctx.session.sendout.id}#${ctx.session.message.position}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

// медиа
function addMedia(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.sendout.message.view.media.add.title"),
        ctx.t("modules.shared.sendout.view.sendout.message.view.media.add.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#${ctx.session.message.position}-none`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function clearAllMedia(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [
        result ? 
            ctx.t("modules.shared.sendout.view.sendout.message.view.media.clearAll.success") :
            ctx.t("modules.shared.sendout.view.sendout.message.view.media.clearAll.error")
        ,
        ctx.t("modules.shared.sendout.view.sendout.message.view.media.clearAll.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#${ctx.session.message.position}-none`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function pagination(ctx: MyContext, messages: Message[]) {     
    const messagesLength = messages.length ?? 0;
    const text = [
        ctx.t("modules.shared.sendout.view.sendout.message.view.pagination.title"),
        ctx.t("modules.shared.sendout.view.sendout.message.view.pagination.path", { 
            call: ctx.session.sendout.call, 
            menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") 
        })
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    
    for (let i = 0; i < messagesLength; i++) {
        if (i % 5 == 0) keyboard.row();
        
        const displayNumber = i + 1; // То, что видит юзер (1, 2, 3...)
        const dbPosition = messages[i]!.position; // То, что лежит в БД (2, 3, 5...)
        
        keyboard.text(displayNumber.toString(), `viewMessage:${ctx.session.sendout.id}#${dbPosition}-none`);
    }

    const backPosition = ctx.session.message?.position ?? 0;
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `viewMessage:${ctx.session.sendout.id}#${backPosition}-none`);
    
    return { text: format.escapeMarkdown(text), keyboard }    
}

export default {
    main,
    removeMessage,
    updateText,
    addMedia,
    clearAllMedia,
    pagination
}