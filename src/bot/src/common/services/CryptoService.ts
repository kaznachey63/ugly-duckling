import constants from '@common/constants';
import crypto from 'crypto';

/**
 * Класс шифрования данных
 */
export class CryptoService {
    /**
     * Шифрование данных
     */
    static encrypt(data: string): string {
        const iv = crypto.randomBytes(constants.crypto.ivLength); 
        const cipher = crypto.createCipheriv(constants.crypto.cipherAlgorithm, constants.crypto.key!, iv);
        const encrypted = cipher.update(data, constants.shared.utf8 as crypto.Encoding, constants.crypto.hex as crypto.BinaryToTextEncoding) + cipher.final(constants.crypto.hex as crypto.BinaryToTextEncoding);
        return `${iv.toString(constants.crypto.hex as BufferEncoding)}:${encrypted}`;
    }

    /**
     * Дешифрование данных
     */
    static decrypt(hex: string): string {        
        const [ivHex, encryptedText] = hex.split(':');
        const iv = Buffer.from(ivHex!, constants.crypto.hex as BufferEncoding);
        const decipher = crypto.createDecipheriv(constants.crypto.cipherAlgorithm, constants.crypto.key!, iv);
        return decipher.update(encryptedText!, constants.crypto.hex as crypto.Encoding, constants.shared.utf8 as crypto.BinaryToTextEncoding) + decipher.final(constants.shared.utf8 as crypto.BinaryToTextEncoding);
    }

    /**
     * Создание слепого индекса (хеша) для поиска в БД
     */
    static makeSearchIndex(data: string): string {
        return crypto.createHmac(constants.crypto.hashAlgorithm, constants.crypto.salt!).update(data).digest(constants.crypto.hex as crypto.BinaryToTextEncoding);
    }
}