import callback_query from './callback_query';
import setDateListener from './setDateListener';
import contact from './contact';
import { dispatchState } from './stateHandler';
import document from './document';

import start from './commands/start';
import help from './commands/help';
import about from './commands/about';
import cabinet from './commands/cabinet';
import form from './commands/form';
import settings from './commands/settings';

export default {
    callback_query,
    setDateListener,
    contact,
    start,
    help,
    about,
    cabinet,
    form,
    dispatchState,
    document,
    settings
};