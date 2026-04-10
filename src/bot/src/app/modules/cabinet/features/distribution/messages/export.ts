import type { MyContext } from '@shared/types/SessionData';
import menuExport from '@menus/modules/cabinet/distribution/message/export';
import { Composer } from 'grammy';
import type { ExportType } from '@shared/types/ExportType';

const exportComposer = new Composer<MyContext>();

exportComposer.callbackQuery(/^mainExportMessages:/, async (ctx: MyContext) => {
    const menu = menuExport.main(ctx);
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

exportComposer.callbackQuery(/^mainExportMessages:/, async (ctx: MyContext) => {
    const exportType = ctx.callbackQuery?.data?.split(/-/)[1]! as ExportType;
    const menu = menuExport.result(ctx, 'txt', true);
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

export default exportComposer;