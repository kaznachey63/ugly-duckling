import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuContracts from "@menus/modules/shared/contract/main";
import { Composer, InputFile } from "grammy";
import common from "@utils/common";
import type { ExportType } from "@shared/types/ExportType";
import { PdfService } from "@common/services/exports/PdfService";
import { WordService } from "@common/services/exports/WordService";
import type { Contract } from "@shared/types/DB";
import type { ContractExport } from "@shared/types/ContractExport";

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
 * Отображение списка договоров
 */
contractComposer.callbackQuery("viewContracts", async (ctx: MyContext) => {
    const contracts = ctx.session.isAdmin ? await db.contract.getContracts() : await db.contract.getContractsByUserId(BigInt(ctx?.from!.id));
    const menu = menuContracts.viewContracts(ctx, contracts);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * Отображение договора за конкретным пользователем
 */
contractComposer.callbackQuery(/^viewContract#/, async (ctx: MyContext) => {
    ctx.session.contract = (await db.contract.getById(Number(ctx.callbackQuery?.data?.split('#')[1]!)))!;
    const menu = menuContracts.viewContract(ctx);
    
    try {
        const msg = await ctx.editMessageText(menu.text, {
            parse_mode: "MarkdownV2",
            reply_markup: menu.keyboard,
        });

        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    } catch {
        await ctx.api.deleteMessage(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState);
        const msg = await ctx.reply(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });

        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    }
});

/**
 * Удаление договора
 */
contractComposer.callbackQuery(/^removeContract#/, async (ctx: MyContext) => {
    const contractId = Number(ctx.callbackQuery?.data?.split('#')[1]!);
    ctx.session.contract = (await db.contract.getById(contractId))!;
    let menu;
    if (await db.contract.removeById(contractId)) {
        menu = menuContracts.remove(ctx, true);
    }
    else {
        menu = menuContracts.remove(ctx, false);
    }    

    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * Создание договора
 */
contractComposer.callbackQuery("createContract", async (ctx: MyContext) => {
    ctx.session.state.addingContract = true;
    const menu = menuContracts.create(ctx);
    const msg = await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

/**
 * Выбор формата экспорта
 */
contractComposer.callbackQuery(/^mainExportContract#/, async (ctx: MyContext) => {
    const menu = menuContracts.mainExportContract(ctx);
    await ctx.editMessageText(menu.text, {
        parse_mode: 'MarkdownV2',
        reply_markup: menu.keyboard
    });
});

/**
 * Экспорт договора в выбранный формат
 */
contractComposer.callbackQuery(/^exportContract#/, async (ctx: MyContext) => {   
    const exportType = ctx.callbackQuery?.data?.split(/-/)[1]! as ExportType;
    let buffer!: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike>;

    const contractData = dataForExport(ctx.session.contract);
    
    let menu;
    let fileName;

    try {
        switch (exportType) {
            case 'pdf': {
                const pdf = new PdfService();
                buffer = await pdf.execRender(contractData);
                fileName = "contract.pdf";
                break;
            }
            case 'word': {
                const word = new WordService();
                buffer = await word.execRender(contractData);
                fileName = "contract.docx";
                break;
            }
        }
        menu = menuContracts.exportContract(ctx, exportType, true);
        await ctx.api.deleteMessage(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState);
        const msg = await ctx.replyWithDocument(new InputFile(Buffer.from(buffer), fileName), { 
            caption: menu.text, 
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard 
        });

        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    } catch(error) {
        console.error("Ошибка при экспорте: ", error);
        menu = menuContracts.exportContract(ctx, exportType, false);
        await ctx.editMessageText(menu.text, { 
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard 
        });
    }
});

/**
 * Формирование данных для экспорта договора
 */
function dataForExport(contract: Contract): ContractExport {
    const start = new Date(contract.date_start!);
    const end = new Date(contract.date_end!);

    return {
        startDay: String(start.getDate()).padStart(2, '0'),
        startMonth: String(start.getMonth() + 1).padStart(2, '0'),
        startYear: String(start.getFullYear()),
        customerName: contract.user!.name!,
        endDay: String(end.getDate()).padStart(2, '0'),
        endMonth: String(end.getMonth() + 1).padStart(2, '0'),
        endYear: String(end.getFullYear()).slice(0, 3),
        priceNumber: String(contract.price).slice(0, 3),
        priceString: contract.price_text!
    };
}

export default contractComposer;

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