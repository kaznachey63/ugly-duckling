import { google } from 'googleapis';

/**
 * Чтение заданного диапазона ячеек
 * @param range Диапазон ячеек
 * @returns Массив ячеек если есть, что брать, иначе - выход
 */
async function getRowsFromGS(range: string): Promise<string[][] | undefined> {
    const credentials = {
        type: process.env.GOOGLE_TYPE!,
        project_id: process.env.GOOGLE_PROJECT_ID!,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID!,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        auth_uri: process.env.GOOGLE_AUTH_URI!.trim(),
        token_uri: process.env.GOOGLE_TOKEN_URI!.trim(),
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL!.trim(),
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL!.trim(),
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN!,
    };

    const auth = new google.auth.GoogleAuth({
        credentials,
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