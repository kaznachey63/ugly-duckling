import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';

const sharedComposer = new Composer<MyContext>();

sharedComposer.use();

export default sharedComposer;