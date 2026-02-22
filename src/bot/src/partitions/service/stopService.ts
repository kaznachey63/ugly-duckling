import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function stopService(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    await ctx.editMessageText("Обновление. . .");

    const ssh = await utils.server.connectServer();
    await ssh.execCommand(`systemctl stop ${utils.local.getNameProcess(nameDistribution)}`);
    
    await ctx.answerCbQuery(`Рассылка от ${ctx.session.distribution.call} остановлена`, { show_alert: true });
    
    await utils.server.checkStatus(ctx);
}