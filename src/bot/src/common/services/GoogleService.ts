import { google, Auth } from 'googleapis';
import constants from '@constants';

export class GoogleService {
    private jwtClient: Auth.JWT;
    private spreadsheetId: string;

    constructor() {
        this.spreadsheetId = process.env.SPEADSHEET_ID!;

        this.jwtClient = new google.auth.JWT({
            email: process.env.GOOGLE_CLIENT_EMAIL!,
            key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
            scopes: [constants.google.scopeForAuth],
        });
    }

    private getSheetsClient() {
        return google.sheets({ version: 'v4', auth: this.jwtClient });
    }

    async getRowsFromGS(range: string): Promise<string[][] | undefined> {
        const sheets = this.getSheetsClient();

        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range,
        });

        return res.data.values ?? undefined;
    }
}