import path from 'path';
import { google } from 'googleapis';

/**
 * Чтение заданного диапазона ячеек
 * @param range Диапазон ячеек
 * @returns Массив ячеек если есть, что брать, иначе - выход
 */
async function getRowsFromGS(range: string): Promise<string[][] | undefined> {
    const pathToCredentials = path.join("src", "config", "credentials.json");
    const auth = new google.auth.GoogleAuth({
        keyFile: pathToCredentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPEADSHEET_ID!;
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range
    });
    const rows = res.data.values;
    return rows ? rows : undefined;
}

export default {
    getRowsFromGS
}