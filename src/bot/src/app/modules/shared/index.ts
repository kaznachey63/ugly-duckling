import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import contractComposer from './contract';
import sendoutComposer from './sendout';

const sharedComposer = new Composer<MyContext>();

sharedComposer.use(contractComposer);
sharedComposer.use(sendoutComposer);

export default sharedComposer;