import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import type { IMessage } from '@shared/types/IMessage';
import constants from '@constants';

export default function main(ctx: MyContext, messages: IMessage[], paginationIndex: number): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;

    let text = [];
    let keyboard = new InlineKeyboard();

    keyboard
        .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.paramsMessages"), "parametersMessage").row()
        .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.add"), `addText${nameDistribution}`).style("success")
    ;

    // Нет сообщений
    if (!messages?.length) {
        text.push(ctx.t("commands.cabinet.distribution.messages.main.noMessages", { call: callDistribution }));
    }
    else {
        const message = messages[paginationIndex];
        text.push(
            ctx.t("commands.cabinet.distribution.messages.main.messageNumb", { number: paginationIndex + 1 }) + ' ' +
            ctx.t("commands.cabinet.distribution.messages.main.amountMedia", { amount: message!.media?.length! || 0, maxMedia: constants.maxMedia }),
            `\`\`\`\n${message?.caption!}\n\`\`\``,
        );

        keyboard
            .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.clearAll"), `clearAllText${nameDistribution}`).style("danger").row()
            .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.paramsText"), "parametersText").row()
            .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.update"), `updateText${nameDistribution}:${paginationIndex}`).style("primary")
            .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.remove"), `removeText${nameDistribution}:${paginationIndex}`).style("danger").row()
            .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.paramsMedia"), "parametersMedia").row()
        ;

        // Медиа > 0 и != 4
        if (message?.media!.length! > 0 && message?.media!.length! != 4) {
            keyboard
                .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.addMedia"), `addMedia${nameDistribution}:${paginationIndex}`).style("success")
                .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.clearAll"), `clearAllMedia${nameDistribution}:${paginationIndex}`).style("danger").row()
            ;
        }
        
        // Медиа == 0
        if (message?.media!.length! == 0) {
            keyboard.text(ctx.t("commands.cabinet.distribution.messages.main.buttons.addMedia"), `addMedia${nameDistribution}:${paginationIndex}`).style("success").row();
        }

        // Медиа == 4
        if (message?.media!.length! == 4) {
            keyboard.text(ctx.t("commands.cabinet.distribution.messages.main.buttons.clearAll"), `clearAllMedia${nameDistribution}:${paginationIndex}`).style("danger").row();
        }

        // Навигация по сообщениям
        if (messages.length === 1) {
            keyboard.text(`${paginationIndex + 1} / ${messages.length}`, `amountMessages${nameDistribution}:${paginationIndex + 1}/${messages.length}`).row();
        } 
        else if (paginationIndex === 0) {
            keyboard
                .text(`${paginationIndex + 1} / ${messages.length}`, `amountMessages${nameDistribution}:${paginationIndex + 1}/${messages.length}`)
                .text("➡", `mainMessage${nameDistribution}:${paginationIndex + 1}`).row()
            ;
        } 
        else if (paginationIndex + 1 === messages.length) {
            keyboard
                .text("⬅", `mainMessage${nameDistribution}:${paginationIndex - 1}`)
                .text(`${paginationIndex + 1} / ${messages.length}`, `amountMessages${nameDistribution}:${paginationIndex + 1}/${messages.length}`).row()
            ;
        } 
        else {
            keyboard
                .text("⬅", `mainMessage${nameDistribution}:${paginationIndex - 1}`)
                .text(`${paginationIndex + 1} / ${messages.length}`, `amountMessages${nameDistribution}:${paginationIndex + 1}/${messages.length}`)
                .text("➡", `mainMessage${nameDistribution}:${paginationIndex + 1}`).row()
            ;
        }
    }
    keyboard.row();
    keyboard.text(ctx.t("utils.shared.back"), `mainDistribution${ctx.session.distribution.name}`);
    text.push(ctx.t("commands.cabinet.distribution.messages.main.path", { call: callDistribution }));
    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}