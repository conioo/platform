import { google } from 'googleapis';

const CLIENT_ID = '732135631895-4eim47el07jd62qf5kgetik85ttnbs59.apps.googleusercontent.com';
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const API_KEY = 'AIzaSyC7PiVmIoolPjS7Vkoz4tCK5SNEfa6QPgw';


export function GoogleLogin() {
    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
    );

    const authUrl = oauth2Client.generateAuthUrl({
        // access_type: 'offline', // Wybierz "offline" aby uzyskać odświeżany token dostępu
        scope: SCOPES,
    });

    // Przekieruj użytkownika do authUrl, aby się zalogował
    window.location.href = authUrl;

    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
        oauth2Client.getToken(code, (err, tokens) => {
            if (err) {
                console.error('Błąd uzyskiwania tokena:', err);
            } else {
                // Tokeny są dostępne w obiekcie "tokens"
                console.log('Tokeny:', tokens);

                if (tokens) {
                    oauth2Client.setCredentials(tokens);
                }
                // Ustaw token autoryzacyjny w kliencie dla dalszych operacji
            }
        });
    }
}

