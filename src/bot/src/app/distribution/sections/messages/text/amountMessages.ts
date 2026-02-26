import type { MyContext } from '@shared/types/SessionData';

export default async function amountText(ctx: MyContext) {
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;
    const dataPages =  queryData!.split(/:/)[1];
    const [ nowPage , allPage ] = (dataPages?.split('/'))?.map(Number) || [];
    
    await ctx.answerCallbackQuery({ 
        text: ctx.t("distribution.sections.messages.text.amount.page", { nowPage: nowPage, allPage: allPage }), 
        show_alert: true 
    });
};