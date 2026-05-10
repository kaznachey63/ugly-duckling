import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import utils from '@utils';
import type { LogSortType } from "@shared/types/LogSortType";
import constants from '@common/constants';

/**
 * Меню раздела Логи
 */
export default function log(ctx: MyContext, log: string): Menu<InlineKeyboard> {
    const logSort = ctx.session.server.logSort;
    const pages = buildLogPages(ctx, log, logSort);
    const page = Math.max(0, Math.min(ctx.session.server.logPage ?? 0, pages.length - 1));

    return {
        text: pages[page]!,
        keyboard: buildLogKeyboard(ctx, page, pages.length, logSort)
    };
}

function splitTextByLimit(text: string, limit: number): string[] {
    const result: string[] = [];

    for (let i = 0; i < text.length; i += limit) {
        result.push(text.slice(i, i + limit));
    }

    return result;
}

function buildLogPages(ctx: MyContext, log: string, logSort: LogSortType): string[] {
    const title =
        ctx.t("modules.commands.panel.system.server.process.control.log.title");

    const path = ctx.t(
        "modules.commands.panel.system.server.process.control.log.path",
        {
            processType: ctx.t(`utils.processType.${ctx.session.server.processType}`),
            processName: ctx.session.server.processName
        }
    );

    const separator = '------------------------------------';

    const header =
        utils.formatting.escapeMarkdown(
            title + '\n' +
            separator + '\n'
        );

    const footer =
        '\n' +
        separator + '\n' +
        utils.formatting.escapeMarkdown(path);

    const lines = logSort === "old" ? log.split('\n') : log.split('\n').reverse();

    const pages: string[] = [];
    let currentPage = header;

    for (const rawLine of lines) {
        const line = utils.formatting.escapeMarkdown(rawLine);
        const next = currentPage + line + '\n';

        if (next.length <= constants.message.maxCharsWithoutPremium - footer.length) {
            currentPage = next;
            continue;
        }

        if (currentPage !== header) {
            pages.push(currentPage + footer);
            currentPage = header;
        }

        const maxLineLength =
            constants.message.maxCharsWithoutPremium - header.length - footer.length - 1;

        const chunks = splitTextByLimit(line, maxLineLength);

        for (const chunk of chunks) {
            const page = header + chunk + '\n' + footer;

            if (page.length > constants.message.maxCharsWithoutPremium) {
                continue;
            }

            pages.push(page);
        }

        currentPage = header;
    }

    if (currentPage !== header) {
        pages.push(currentPage + footer);
    }

    return pages.length ? pages : [header + footer];
}

function buildLogKeyboard(ctx: MyContext, page: number, totalPages: number, logSort: LogSortType): InlineKeyboard {
    const keyboard = new InlineKeyboard();

    const row: any[] = [];

    if (page > 0) {
        row.push(InlineKeyboard.text("⬅️", `logPage-${page - 1}`));
    }

    row.push(InlineKeyboard.text(`${page + 1}/${totalPages}`, "logInfo"));

    if (page < totalPages - 1) {
        row.push(InlineKeyboard.text("➡️", `logPage-${page + 1}`));
    }

    keyboard.row(...row);

    keyboard.row().text(
        ctx.t("modules.commands.panel.system.server.process.control.log.sort", {
            sortType: ctx.t(`modules.commands.panel.system.server.process.control.log.sortType.${logSort}`)
        }),
        `sortLog-${logSort == 'new' ? 'old' : 'new'}`
    );

    keyboard.row().text(
        ctx.t("utils.shared.buttons.back"),
        `control:${ctx.session.server.processName}`
    );

    return keyboard;
}