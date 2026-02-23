import db from '@shared/db';
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import { Context } from 'grammy';
import {Calendar} from 'telegram-inline-calendar';
import type { MyContext } from '@shared/types/SessionData';

// 🔴 КЭШИ НА УРОВНЕ МОДУЛЯ
const handlersCache = new Map<string, any>();
const dirCache = new Map<string, string[]>();

/**
 * Обработчик нажатий на кнопки
 * @param ctx Контекст
 * @param calendar Календарь
 */
export default async function callback_query(ctx: MyContext, calendar: Calendar) {
    let queryData = "";
    if ("data" in ctx.callbackQuery!) {
        queryData = ctx.callbackQuery.data;
        console.log(queryData);
    }
    if (queryData.includes("calendar")) return;

    // 🔒 защита от повторных кликов
    if (ctx.session.busy) {
        // тут НЕЛЬЗЯ toast, он может быть уже подтверждён
        return;
    }
    ctx.session.busy = true;
    
    const skipToastCallbacks = [
        "mainChat",
        "parametrsMessage",
        "addMedia",
        "deleteMedia",
        "editMedia",
        "parametrsMedia",
        "amountText",
        "parametrsText",
        "startService",
        "stopService",
        "mainStatistika",
        "parametrsTime"
    ];

    const startsWithSkip = skipToastCallbacks.some(prefix =>
        queryData.startsWith(prefix)
    );

    if (!startsWithSkip) {
        await ctx.answerCallbackQuery('⏳ Обработка...');
    }

    let halfPath = path.join("src", "partitions");

    if (queryData.toLowerCase().includes("general")) {
        halfPath = path.join("src", "partitions", "general");
    }
    else if (queryData.toLowerCase().includes("chat")) {
        halfPath = path.join("src", "partitions", "chat");
    }
    else if (queryData.toLowerCase().includes("time")) {
        halfPath = path.join("src", "partitions", "time");
    }
    else if (queryData.toLowerCase().includes("message")) {
        halfPath = path.join("src", "partitions", "message");
    }
    else if (queryData.toLowerCase().includes("text")) {
        halfPath = path.join("src", "partitions", "message", "text");
    }
    else if (queryData.toLowerCase().includes("media")) {
        halfPath = path.join("src", "partitions", "message", "media");
    }
    else if (queryData.toLowerCase().includes("statistika")) {
        halfPath = path.join("src", "partitions", "statistika");

        if (queryData.toLowerCase().includes("selective")) {
            halfPath = path.join("src", "partitions", "statistika", "format");
        }
        else if (queryData.toLowerCase().includes("comparative")) {
            halfPath = path.join(
                "src",
                "partitions",
                "statistika",
                "format",
                "comparative"
            );

            if (
                queryData.toLowerCase().includes("week") ||
                queryData.toLowerCase().includes("month")
            ) {
                halfPath = path.join(
                    "src",
                    "partitions",
                    "statistika",
                    "format",
                    "comparative",
                    "type"
                );
            }
        }
    }
    else if (queryData.toLowerCase().includes("service")) {
        halfPath = path.join("src", "partitions", "service");
    }
    else if (queryData.toLowerCase().includes("menu")) {
        halfPath = path.join("src", "partitions", "menu");
    }

    const switchQueryPath = await fs.realpath(halfPath);

    // 🔴 КЭШ fs.readdir
    let files = dirCache.get(switchQueryPath);
    if (!files) {
        files = await fs.readdir(switchQueryPath);
        dirCache.set(switchQueryPath, files);
    }

    let nameFile = "";

    const targetFile = files.find(file => {
        nameFile = file.split(".")[0]!;
        return queryData.startsWith(nameFile);
    }) ?? "";

    if (targetFile) {
        const handlerPath = path.join(switchQueryPath, targetFile);
        const handlerUrl = pathToFileURL(handlerPath).href;

        try {
            // 🔴 КЭШ import()
            let handlerModule = handlersCache.get(handlerUrl);
            if (!handlerModule) {
                handlerModule = await import(handlerUrl);
                handlersCache.set(handlerUrl, handlerModule);
            }

            let nameDistribution = queryData.split(nameFile)[1]!;

            if (nameDistribution.includes(':')) {
                nameDistribution = nameDistribution.split(/:/)[0]!;
            }

            nameDistribution = nameDistribution.replace(/week|month/ig, "");
            const infoDist = await db.distribution.getDistributionInfo(nameDistribution);
            if (infoDist) {
                ctx.session.distribution = {
                    name: nameDistribution,
                    call: infoDist.call_ru,
                    label: infoDist.label, 
                    schema: infoDist.schema
                }
            }

            if (nameFile.toLowerCase().includes("selectivestatistika")) {
                await handlerModule.default({ ctx, calendar });
            } else {
                await handlerModule.default(ctx);
            }
        } catch (error) {
            console.error(
                `Ошибка в вызове файла ${targetFile} внтури обработчика callback_query:`,
                error
            );
        } finally {
            ctx.session.busy = false;
        }
    }
}