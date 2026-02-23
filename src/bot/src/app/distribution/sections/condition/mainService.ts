import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function mainService(ctx: MyContext) {
    await utils.server.checkStatus(ctx);
}