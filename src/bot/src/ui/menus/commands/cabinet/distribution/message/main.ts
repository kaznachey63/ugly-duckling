import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import type { IMessage } from '@shared/types/IMessage';
import constants from '@constants';

export default function main(ctx: MyContext, messages: IMessage[]): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;
    let positionId = ctx.session.state.text.positionId;
    console.log(positionId);
    
    let text = [];
    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.paramsMessages"), "parametersMessage").row()
        .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.add"), `addText:${nameDistribution}#${positionId + 1}`).style("success")
    ;

    // Нет сообщений
    if (!messages?.length) {
        text.push(ctx.t("commands.cabinet.distribution.messages.main.noMessages", { call: callDistribution }));
    }
    else {
        const message = messages[positionId];
        text.push(
            ctx.t("commands.cabinet.distribution.messages.main.messageNumb", { number: positionId + 1 }) + ' ' +
            ctx.t("commands.cabinet.distribution.messages.main.amountMedia", { amount: message!.media?.length!,  maxMedia: constants.maxMedia }),
            `\`\`\`\n${message?.caption!}\n\`\`\``,
        );

        keyboard
            .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.clearAll"), `clearAllText:${nameDistribution}`).style("danger").row()
            .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.paramsText"), "parametersText").row()
            .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.update"), `updateText:${nameDistribution}#${positionId}`).style("primary")
            .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.remove"), `removeText:${nameDistribution}#${positionId}`).style("danger").row()
            .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.paramsMedia"), "parametersMedia").row()
        ;

        // Медиа > 0 и != 4
        if (message?.media!.length! > 0 && message?.media!.length! != 4) {
            keyboard
                .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.addMedia"), `addMedia:${nameDistribution}#${positionId}`).style("success")
                .text(ctx.t("commands.cabinet.distribution.messages.main.buttons.clearAll"), `clearAllMedia:${nameDistribution}#${positionId}`).style("danger").row()
            ;
        }
        
        // Медиа == 0
        if (message?.media!.length! == 0) {
            keyboard.text(ctx.t("commands.cabinet.distribution.messages.main.buttons.addMedia"), `addMedia:${nameDistribution}#${positionId}`).style("success").row();
        }

        // Медиа == 4
        if (message?.media!.length! == 4) {
            keyboard.text(ctx.t("commands.cabinet.distribution.messages.main.buttons.clearAll"), `clearAllMedia:${nameDistribution}#${positionId}`).style("danger").row();
        }

        // Навигация по сообщениям
        if (messages.length === 1) {
            keyboard.text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`).row();
        } 
        else if (positionId === 0) {
            keyboard
                .text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`)
                .text("➡", `mainMessage:${nameDistribution}#${positionId + 1}`).row()
            ;
        } 
        else if (positionId + 1 === messages.length) {
            keyboard
                .text("⬅", `mainMessage:${nameDistribution}#${positionId - 1}`)
                .text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`).row()
            ;
        } 
        else {
            keyboard
                .text("⬅", `mainMessage:${nameDistribution}#${positionId - 1}`)
                .text(`${positionId + 1} / ${messages.length}`, `paginationMessages:${nameDistribution}#${positionId + 1}/${messages.length}`)
                .text("➡", `mainMessage:${nameDistribution}#${positionId + 1}`).row()
            ;
        }
    }
    keyboard.row();
    keyboard.text(ctx.t("utils.shared.back"), `mainDistribution:${ctx.session.distribution.name}`);
    text.push(ctx.t("commands.cabinet.distribution.messages.main.path", { call: callDistribution }));
    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}