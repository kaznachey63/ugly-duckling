import DocxTemplater from 'docxtemplater';
import PizZip from 'pizzip';
import fs from 'fs/promises'
import path from 'node:path';
import type { ContractExport } from '@shared/types/ContractExport';

export class WordService {
    async execRender(data: ContractExport): Promise<Buffer<ArrayBufferLike>> {
        const contract = await fs.readFile(path.resolve('src', 'bot', 'src', 'common', 'services', 'exports', 'docs', 'contract.docx'));
        const zip = new PizZip(contract);

        const docx = new DocxTemplater(zip, {
            paragraphLoop: true,
            linebreaks: true
        });

        docx.render(data);
        return docx.getZip().generate({ type: 'nodebuffer' });
    }

    async write(data: string) {
        const messages_file = await fs.readFile(path.resolve('src', 'bot', 'src', 'common', 'services', 'exports', 'docs', 'messages.docx'));
        const zip = new PizZip(messages_file);
        const doc = new DocxTemplater(zip, { paragraphLoop: true, linebreaks: true })
        doc.render({ messages: data })
        return doc.getZip().generate({ type: 'nodebuffer' })
    }
}