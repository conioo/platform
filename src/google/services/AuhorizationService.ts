import { getSecrets } from "../GoogleDriveService";
import GoogleSecrets from "../GoogleSecrets";
import store from "../../redux/store";
import { login, logout } from "../../redux/slices/authentication";

export async function HandleGapiLoad() {
    await gapi.load('client:auth2', initClient);
};

async function initClient() {
    await gapi.client.init({
        apiKey: GoogleSecrets.API_KEY,
        clientId: GoogleSecrets.GITHUB_CLIENT_ID,
        discoveryDocs: GoogleSecrets.DISCOVERY_DOCS,
        scope: "https://www.googleapis.com/auth/drive",
    });

    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        await googleLogin();
    }
};

export async function googleLogin() {
    console.log("logowanie");

    let tokens = await getSecrets();

    if (!tokens) {
        throw new Error("invalid tokens");
    }

    store.dispatch(login(tokens.deepl));
}

export async function googleLogout() {
    console.log("wylogowanie");
    store.dispatch(logout());
}
