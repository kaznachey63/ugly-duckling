import callback_query from './callback_query.js';
import setDateListener from './setDateListener.js';
import contact from './contact.js';
import start from './commands/start.js';
import help from './commands/help.js';
import about from './commands/about.js';
import cabinet from './commands/cabinet.js';
import form from './commands/form.js';
import { dispatchState } from './stateHandler.js';
import document from './document.js';

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
    document
};