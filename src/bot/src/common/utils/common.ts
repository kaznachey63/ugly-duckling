import type { MyContext, SessionData } from '@shared/types/SessionData';
import menuCabinet from "@menus/modules/cabinet/main";
import db from "@shared/db";
import { GoogleService } from "src/common/services/GoogleService";
import type { Role } from '@shared/types/Role';
import constants from '@constants';

/**
 * Сброс сессии
 * @param session Сессия
 */
function resetSessionStates(session: SessionData) {
    session.state.addingText = false;
    session.state.updatingText = false;
    session.state.generatingText = false;
    session.state.addingTime = false;
    session.state.updatingTime = false;
    session.state.addingMedia = false;
    session.other.text.positionId = 0;
    session.other.media.positionId = 0;
    session.state.addingIdea = false;
}

/**
 * Проверка на админа по айди
 */
function isAdmin(id: number): boolean {
    return id === Number(process.env.ID_ADMIN);
}

/**
 * Получение роли пользователя по айди
 */
async function getRole(id: number): Promise<Role> {
    if (isAdmin(id)) return "admin";
    else if (await db.user.existsInDB(id)) return "customer";
    else return "unknown";
}

async function setPrimaryValuesSession(ctx: MyContext) {
    // Присваивание инфо о рассылке и пользователе
    ctx.session.user.role = await getRole(ctx.from?.id!);
    const nameDistribution = ctx?.callbackQuery?.data?.split(/:/)[1]?.split(/#/)[0]!;
    const infoDist = await db.distribution.getSendoutInfo(nameDistribution);
    if (infoDist) {
        ctx.session.distribution = {
            name: nameDistribution,
            call: infoDist.call_ru,
            label: infoDist.label, 
            schema: infoDist.schema
        }
    }
}

export default {
    resetSessionStates,
    isAdmin,
    getRole,
    setPrimaryValuesSession
};