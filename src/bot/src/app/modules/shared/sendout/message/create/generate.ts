import type { MyContext } from '@shared/types/SessionData';
import menuCreate from '@menus/modules/shared/sendout/message/create';
import { Composer } from 'grammy';
import { ServerManager } from "@common/services/ServerManager";
import db from '@shared/db';
import common from '@utils/common';
import type { Message } from '@shared/types/DB';

const genereteComposer = new Composer<MyContext>();

// этот обработчик превее нинего т.к. соответсвие на последние значения
genereteComposer.callbackQuery(/^generateText:.+-(true|false)$/, async (ctx: MyContext) => {
    if (ctx.session.sendout.mode_active) {
        await common.alertSendoutIsActive(ctx);
        return;
    }

    await ctx.editMessageText(ctx.t("utils.shared.processing"));

    const action = ctx.callbackQuery?.data!.split(/-/)[1] === 'true';    
    let menu: any = {};
    
    if (action) {        
        const message: Message = {
            caption: ctx.session.generate.text.trim()!,
            entities: ctx.session.generate.entities,
            sendout_id: ctx.session.sendout.id!
        };

        await db.message.create(message);
        menu = menuCreate.saveOrCancelGenerateText(ctx, action, await ServerManager.restartProcessOrNot(ctx.session.sendout.name!, true));
        common.resetSessionStates(ctx.session);
    }
    else {
        menu = menuCreate.saveOrCancelGenerateText(ctx, action);
    }

    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

genereteComposer.callbackQuery(/^generateText:/, async (ctx: MyContext) => {
    if (ctx.session.sendout.mode_active) {
        await common.alertSendoutIsActive(ctx);
        return;
    }
    
    ctx.session.state.generatingText = true;
    const menu = menuCreate.generate(ctx);
    
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

export default genereteComposer;