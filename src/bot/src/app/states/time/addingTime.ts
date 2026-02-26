import utils from "@utils";
import type { MyContext } from '@shared/types/SessionData';

export default async function addingTime(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const menuAddingText = Markup.inlineKeyboard(
        [Markup.button.callback("Назад в Время", "mainTime" + nameDistribution)]
    );

    if (typeof utils.formatting.checkMD(ctx.message) == 'string') {
        await ctx.reply(utils.formatting.checkMD(ctx.message).toString(), menuAddingText);
        return;
    }
    
    const userMessage = utils.formatting.setMD(ctx) ?? ctx.text?.trim();
    let lastMessages = await utils.file.readJson(nameDistribution, "resources", "messages");
    const newMessage = {
        text: userMessage,
        media: []
    };

    lastMessages.push(newMessage);
    await utils.file.saveData(nameDistribution, JSON.stringify(lastMessages, null, 2), "resources", "messages");

    const textMessage = await utils.server.reloadService(nameDistribution) ? "Время сохранено!" : "Время не сохранено!\nОбратитесь к администратору";

    await ctx.telegram.editMessageText(
        ctx?.chat?.id, // chat_id
        ctx.session.messageIds.forTextOrMedia, // message_id
        undefined, // inline_message_id
        textMessage,
        { reply_markup: menuAddingText.reply_markup }
    );
}

function validateTime(msg: string): boolean {
    if (msg.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)) {
        return true;
    }
    else {
        return false;
    }
}