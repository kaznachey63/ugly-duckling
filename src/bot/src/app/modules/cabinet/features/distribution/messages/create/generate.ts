import type { MyContext } from '@shared/types/SessionData';
import menuCreate from '@menus/modules/cabinet/distribution/message/create';
import { Composer } from 'grammy';
import { ServerManager } from "src/common/services/ServerManager";
import db from "@shared/db";
import common from '@utils/common';

const genereteComposer = new Composer<MyContext>();

// этот обработчик превее нинего т.к. соответсвие на последние значения
genereteComposer.callbackQuery(/^generateText:.+#\d+-(true|false)$/, async (ctx: MyContext) => {
    ctx.session.state.addingText = true;
    await ctx.editMessageText(ctx.t('utils.shared.processing'));

    ctx.session.other.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]?.split(/-/)[0]);
    const action = ctx.callbackQuery?.data!.split(/-/)[1] === 'true';    let menu: any = {};
    
    if (action) {        
        const nameDistribution = ctx.session.distribution.name!;

        await db.message.addMessage(nameDistribution, {
            id: 0,
            caption: ctx.session.other.text.generateText.trim()!,
            entities: ctx.session.other.text.generateEntities,
            media: null
        });
        const server = new ServerManager();
        menu = menuCreate.saveOrCancelGenerateText(ctx, action, await server.restartProcessOrNot(nameDistribution, true));
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
    ctx.session.state.generatingText = true;
    ctx.session.other.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
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