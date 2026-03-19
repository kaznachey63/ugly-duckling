import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';

import contactComposer from './contact';
import textComposer from './text';
import mediaComposer from './media';
import documentComposer from './document';
import messageComposer from './message';

const handlersComposer = new Composer<MyContext>();

handlersComposer.use(contactComposer);
handlersComposer.use(messageComposer)
handlersComposer.use(textComposer);
handlersComposer.use(mediaComposer);
handlersComposer.use(documentComposer);

export default handlersComposer;