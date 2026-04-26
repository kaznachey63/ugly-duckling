import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuContracts from "@menus/modules/shared/contract/main";
import { Composer } from "grammy";
import common from "@utils/common";

const contractComposer = new Composer<MyContext>();

/**
 * Главное меню раздела договоры
 */
contractComposer.callbackQuery("mainContract", async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const menu = menuContracts.main(ctx, (await db.contract.getContracts())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

/**
 * Отображение списка контрактов
 */
contractComposer.callbackQuery("viewContracts", async (ctx: MyContext) => {
    const contracts = ctx.session.isAdmin ? await db.contract.getContracts() : await db.contract.getContractsByUser(BigInt(ctx?.from!.id));
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
    const menu = menuContracts.viewContract(ctx, (await db.contract.getContractById(contractId))!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * Удаление договора
 */
contractComposer.callbackQuery(/^removeContract#/, async (ctx: MyContext) => {
    const contractId = Number(ctx.callbackQuery?.data?.split('#')[1]!);
    const contract = (await db.contract.getContractById(contractId))!;
    let menu;
    if (await db.contract.removeContractById(contractId)) {
        menu = menuContracts.remove(ctx, contract, true);
    }
    else {
        menu = menuContracts.remove(ctx, contract, false);
    }    

    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

// /**
//  * Создание договора
//  */
// contractComposer.callbackQuery("createContract", async (ctx: MyContext) => {
//     ctx.session.state.addingContract = true;
//     const menu = menuContracts.create(ctx);
//     const msg = await ctx.editMessageText(menu.text, {
//         parse_mode: "MarkdownV2",
//         reply_markup: menu.keyboard,
//     });

//     // Сохранение айди для последующего редактирования этого же сообщения
//     if (typeof msg !== "boolean" && "message_id" in msg) {
//         ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
//     }
// });


export default contractComposer;

// --------------------------------------------------------------------------------

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