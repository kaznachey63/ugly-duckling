import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuContracts from "@menus/modules/shared/contract/contracts";
import { Composer } from "grammy";
import common from "@utils/common";

const contractComposer = new Composer<MyContext>();

/**
 * Главное меню раздела договоры
 */
contractComposer.callbackQuery("mainContracts", async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const menu = menuContracts.main(ctx, (await db.contract.getContracts())?.length!, common.isAdmin(ctx));
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

/**
 * Отображение списка контрактов
 */
contractComposer.callbackQuery("viewContracts", async (ctx: MyContext) => {
    const contracts = common.isAdmin(ctx) ? await db.contract.getContracts() : await db.contract.getContractsByUser(BigInt(ctx?.from!.id));
    const menu = menuContracts.viewContracts(ctx, contracts);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * Отображение выбранного пользователя
 */
contractComposer.callbackQuery(/^viewContract#/, async (ctx: MyContext) => {
    const contractId = Number(ctx.callbackQuery?.data?.split('#')[1]!);
    const menu = menuContracts.viewContract(ctx, (await db.contract.getContractById(contractId))!, common.isAdmin(ctx));
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

// /**
//  * Создание пользователя
//  */
// contractComposer.callbackQuery("createUser", async (ctx: MyContext) => {
//     ctx.session.state.addingUser = true;
//     const menu = menuUsers.create(ctx);
//     const msg = await ctx.editMessageText(menu.text, {
//         parse_mode: "MarkdownV2",
//         reply_markup: menu.keyboard,
//     });

//     // Сохранение айди для последующего редактирования этого же сообщения
//     if (typeof msg !== "boolean" && "message_id" in msg) {
//         ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
//     }
// });

// /**
//  * Удаление пользователя
//  */
// contractComposer.callbackQuery(/^removeUser#/, async (ctx: MyContext) => {
//     const userId = Number(ctx.callbackQuery?.data?.split('#')[1]!);
//     const user = (await db.user.getUser(userId))!;
//     let menu;
//     if (await db.user.removeFromSystem(userId)) {
//         menu = menuUsers.remove(ctx, user, true);
//     }
//     else {
//         menu = menuUsers.remove(ctx, user, false);
//     }    

//     await ctx.editMessageText(menu.text, {
//         parse_mode: "MarkdownV2",
//         reply_markup: menu.keyboard,
//     });
// });

export default contractComposer;

// --------------------------------------------------------------------------------

// import { Composer, InputFile } from 'grammy';
// import type { MyContext } from '@shared/types/SessionData';
// import menuContract from '@menus/modules/commands/cabinet/profile/contract/main';
// import constants from '@constants';
// import { PdfService } from 'src/common/services/exports/PdfService';
// import { WordService } from 'src/common/services/exports/WordService';
// import type { ExportType } from '@shared/types/ExportType';
// import type { ContractExport } from '@shared/types/ContractExport';
// import db from '@shared/db';

// const contractComposer = new Composer<MyContext>();

// contractComposer.callbackQuery(/^mainContract/, async (ctx: MyContext) => {
//     return ctx.answerCallbackQuery({ text: "Над разделом ведутся технические работы, попробуйте позже.", show_alert: true });

//     try {
//         const contracts = await db.contract.getContracts(ctx.from?.id!);
//         const menu = menuContract(ctx, contracts.length);

//         await ctx.editMessageText(menu.text, {
//             reply_markup: menu.keyboard,
//             parse_mode: 'MarkdownV2'
//         });
//     } catch (error) {
//         console.error('Ошибка в mainSchedule:', error);
//     }
// });

// contractComposer.callbackQuery(/^mainContract/, async (ctx: MyContext) => {
//     // return ctx.answerCallbackQuery({ text: "Над разделом ведутся технические работы, попробуйте позже.", show_alert: true });

//     if (!ctx.session.sendout.call) {
//         await ctx.answerCallbackQuery({ text: ctx.t("modules.commands.cabinet.profile.contract.main.notSuccess"), show_alert: true });
//         return;
//     }
    
//     try {
//         const contracts = await db.contract.getContracts(ctx.from?.id!);
//         let menu;
//         if (!contracts.length) {
//             menu = menuContract.main2(ctx, true);
//         }
//         else {
//             menu = menuContract.main2(ctx, contracts, false);
//         }

//         try {
//             const msg = await ctx.editMessageText(menu.text, {
//                 parse_mode: 'MarkdownV2',
//                 reply_markup: menu.keyboard
//             });

//             // Сохранение айди для последующего редактирования этого же сообщения
//             if (typeof msg !== "boolean" && "message_id" in msg) {
//                 ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
//             }
//         } catch {
//             await ctx.api.deleteMessage(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState);
//             const msg = await ctx.reply(menu.text, {
//                 parse_mode: 'MarkdownV2',
//                 reply_markup: menu.keyboard
//             });

//             // Сохранение айди для последующего редактирования этого же сообщения
//             if (typeof msg !== "boolean" && "message_id" in msg) {
//                 ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
//             }
//         }
//     } catch (error) {
//         console.error('Ошибка в mainContract:', error);
//     }
// });

// contractComposer.callbackQuery(/^mainExportContract:/, async (ctx: MyContext) => {
//     const menu = menuContract.mainExportContract(ctx);
//     await ctx.editMessageText(menu.text, {
//         parse_mode: 'MarkdownV2',
//         reply_markup: menu.keyboard
//     });
// });

// contractComposer.callbackQuery(/^exportContract:/, async (ctx: MyContext) => {   
//     const exportType = ctx.callbackQuery?.data?.split(/-/)[1]! as ExportType;
//     let buffer!: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike>;

//     const contractData = await dataForExport(ctx.session.sendout.label);
    
//     let menu;
//     let fileName;

//     try {
//         switch (exportType) {
//             case 'pdf': {
//                 const pdf = new PdfService();
//                 buffer = await pdf.execRender(contractData);
//                 fileName = "contract.pdf";
//                 break;
//             }
//             case 'word': {
//                 const word = new WordService();
//                 buffer = await word.execRender(contractData);
//                 fileName = "contract.docx";
//                 break;
//             }
//         }
//         menu = menuContract.exportContract(ctx, exportType, true);
//         await ctx.api.deleteMessage(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState);
//         const msg = await ctx.replyWithDocument(new InputFile(Buffer.from(buffer), fileName), { 
//             caption: menu.text, 
//             parse_mode: 'MarkdownV2',
//             reply_markup: menu.keyboard 
//         });

//         // Сохранение айди для последующего редактирования этого же сообщения
//         if (typeof msg !== "boolean" && "message_id" in msg) {
//             ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
//         }
//     } catch(error) {
//         console.error("Ошибка при экспорте: ", error);
//         menu = menuContract.exportContract(ctx, exportType, false);
//         await ctx.editMessageText(menu.text, { 
//             parse_mode: 'MarkdownV2',
//             reply_markup: menu.keyboard 
//         });
//     }
// });

// async function dataForExport(distributionLabel: string): Promise<ContractExport> {
//     const google = new GoogleService();
//     const dataFromSheets = await google.getRowsFromGS(constants.google.rangeTable);
//     const row = dataFromSheets?.find(r => r?.[0] === distributionLabel);
    
//     const [ startDay, startMonth, startYear ] = row![2]!.split('.');
//     const [ endDay, endMonth, endYear ] = row![3]!.split('.');
    
//     return {
//         startDay: startDay!,
//         startMonth: startMonth!,
//         startYear: startYear!,
//         customerName: row![1]!,
//         endDay: endDay!,
//         endMonth: endMonth!,
//         endYear: endYear!,
//         priceNumber: row![6]!,
//         priceString: "две тысячи",
//     };
// }

// export default contractComposer;