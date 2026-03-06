import type { MyContext } from '@shared/types/SessionData';

export default async function amountMessages(ctx: MyContext) {    
    const queryData = ctx.callbackQuery?.data;
    const dataPages =  queryData!.split(/:/)[1];
    const [ nowPage , allPage ] = (dataPages?.split('/'))?.map(Number) || [];
    
    await ctx.answerCallbackQuery({ 
        text: ctx.t("commands.cabinet.distribution.messages.text.amount.page", { nowPage: nowPage, allPage: allPage }), 
        show_alert: true 
    });
};