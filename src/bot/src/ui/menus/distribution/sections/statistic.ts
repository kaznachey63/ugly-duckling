import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { StatisticType } from '@shared/types/StatisticType';

/**
 * Меню раздела Статистика
 */
function main(ctx: MyContext): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution?.name;

    const text = [
        ctx.t('distribution.sections.statistics.main.title'),
        ctx.t('distribution.sections.statistics.main.path', { call: ctx.session.distribution.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t('distribution.sections.statistics.main.buttons.selective'), `selectiveStatistic${nameDistribution}`)
        .text(ctx.t('distribution.sections.statistics.main.buttons.comparative'), `comparativeStatistic${nameDistribution}`).row()
        .text(ctx.t('nav.back'), `mainDistribution${nameDistribution}`)
    ;
    return { text, keyboard }

}

function selective(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t('distribution.sections.statistics.selective.title'),
        ctx.t('distribution.sections.statistics.selective.path', { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .row().text(ctx.t('nav.back'), `mainStatistic${ctx.session.distribution.name}`)
    ;
    return { text, keyboard }
}

function comparative(ctx: MyContext): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;

    const text = [
        ctx.t('distribution.sections.statistics.comparative.main.title'),
        ctx.t('distribution.sections.statistics.comparative.main.path', { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t('distribution.sections.statistics.comparative.main.buttons.week'), `comparativeStatisticWeek${nameDistribution}`)
        .text(ctx.t('distribution.sections.statistics.comparative.main.buttons.month'), `comparativeStatisticMonth${nameDistribution}`).row()
        .text(ctx.t('nav.back'), `mainStatistic${ctx.session.distribution.name}`)
    ;
    return { text, keyboard }
}

function handlerComparative(ctx: MyContext, type: StatisticType): Menu<InlineKeyboard> {
    const text = [
        ctx.t(`distribution.sections.statistics.comparative.${type}.title`),
        ctx.t(`distribution.sections.statistics.comparative.${type}.path`, { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t('nav.back'), `comparativeStatistika${ctx.session.distribution.name}`);    
    return { text, keyboard }
}

export default {
    main,
    selective,
    comparative,
    handlerComparative
}