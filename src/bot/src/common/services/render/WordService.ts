import DocxTemplater from 'docxtemplater';
import Pizzip from 'pizzip';
import fs from 'fs/promises'
import path from 'node:path';
import type { ContractData } from '@shared/types/ContractData';

export class WordService {
    async execRender(data: ContractData): Promise<Buffer<ArrayBufferLike>> {
        const contract = await fs.readFile(path.resolve('src', 'common', 'services', 'render', 'contracts', 'contract.docx'));
        const zip = new Pizzip(contract);

        const docx = new DocxTemplater(zip, {
            paragraphLoop: true,
            linebreaks: true
        });

        docx.render(data);
        return docx.getZip().generate({ type: 'nodebuffer' });
    }
}