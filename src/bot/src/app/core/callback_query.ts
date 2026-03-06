import db from '@shared/db';
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import type { MyContext } from '@shared/types/SessionData';
import common from '@utils/common';

// 🔴 КЭШИ НА УРОВНЕ МОДУЛЯ
const handlersCache = new Map<string, any>();
const dirCache = new Map<string, string[]>();

/**
 * Обработчик нажатий на кнопки
 * @param ctx Контекст
 * @param calendar Календарь
 */
export default async function callback_query(ctx: MyContext) { //, calendar: Calendar) {
    let queryData = "";
    if ("data" in ctx.callbackQuery!) {
        queryData = ctx.callbackQuery.data;
        console.log(queryData);
    }
    if (queryData.includes("calendar")) return;

    let halfPath = path.join("src", "app", "commands", "cabinet", "distribution");

    if (queryData.toLowerCase().includes("contract")) {
        halfPath = path.join("src", "app", "commands", "cabinet", "distribution", "contract");
    }
    else if (queryData.toLowerCase().includes("time") || queryData.toLowerCase().includes("schedule")) {
        halfPath = path.join("src", "app", "commands", "cabinet", "distribution", "schedule");
    }
    else if (queryData.toLowerCase().includes("message")) {
        halfPath = path.join("src", "app", "commands", "cabinet", "distribution", "messages");
    }
    else if (queryData.toLowerCase().includes("text")) {
        halfPath = path.join("src", "app", "commands", "cabinet", "distribution", "messages", "text");
    }
    else if (queryData.toLowerCase().includes("media")) {
        halfPath = path.join("src", "app", "commands", "cabinet", "distribution", "messages", "media");
    }
    else if (queryData.toLowerCase().includes("statistic")) {
        halfPath = path.join("src", "app", "commands", "cabinet", "distribution", "statistics");

        if (queryData.toLowerCase().includes("selective")) {
            halfPath = path.join("src", "app", "commands", "cabinet", "distribution", "statistics", "format", "selective");
        }
        else if (queryData.toLowerCase().includes("comparative")) {
            halfPath = path.join(
                "src",
                "app", "commands", "cabinet", "distribution",
                "statistics",
                "format",
                "comparative"
            );

            if (
                queryData.toLowerCase().includes("week") ||
                queryData.toLowerCase().includes("month")
            ) {
                halfPath = path.join(
                    "src",
                    "app", "commands", "cabinet", "distribution",
                    "statistics",
                    "format",
                    "comparative",
                    "type"
                );
            }
        }
    }
    else if (queryData.toLowerCase().includes("condition") || queryData.toLowerCase().includes("startdistribution") || queryData.toLowerCase().includes("stopdistribution")) {
        halfPath = path.join("src", "app", "commands", "cabinet", "distribution", "condition");
    }
    else if (queryData.toLowerCase().includes("maindistribution")) {
        halfPath = path.join("src", "app", "commands", "cabinet", "distribution");
    }
    else if (queryData.toLowerCase().includes("cabinet")) {
        halfPath = path.join("src", "app", "commands", "cabinet");
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
                nameDistribution = nameDistribution.split(/:/)[1]!;
            }

            // Присваивание инфо о рассылке и пользователе
            ctx.session.user.role = await common.getRole(ctx.from?.id!);
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

            if (nameFile.toLowerCase().includes("selectivestatistic")) {
                await handlerModule.default(ctx);
            } else {
                await handlerModule.default(ctx);
            }
        } catch (error) {
            console.error(
                `Ошибка в вызове файла ${targetFile} внтури обработчика callback_query:`,
                error
            );
        } finally {
            try { await ctx.answerCallbackQuery(); } catch {}
        }
    }
}