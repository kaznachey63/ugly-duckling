import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import commandsComposer from './commands';
import sharedComposer from './shared';

const modulesComposer = new Composer<MyContext>();

modulesComposer.use(commandsComposer);
modulesComposer.use(sharedComposer);

export default modulesComposer;