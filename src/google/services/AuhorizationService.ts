import { getSecrets } from "../GoogleDriveService";
import store from "../../redux/store";
import { login, logout, setIsLogin } from "../../redux/slices/authentication";
import { redirect } from "react-router-dom";
import Paths from "../../router/Paths";
import { convertToName } from "../../types/Language";

export async function HandleGapiLoad() {
    await gapi.load('client:auth2', initClient);
};

async function initClient() {
    await gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
        discoveryDocs: process.env.REACT_APP_DISCOVERY_DOCS ? [process.env.REACT_APP_DISCOVERY_DOCS] : undefined,
        scope: process.env.REACT_APP_SCOPES
    });

    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        await googleLogin();
    }
    else {
        store.dispatch(setIsLogin(false));
    }
};

export async function googleLogin() {
    let tokens = await getSecrets();

    if (!tokens) {
        throw new Error("invalid tokens");
    }

    store.dispatch(login(tokens.deepl));
}

export async function googleLogout() {
    store.dispatch(logout());
}

export async function authorizedAccess(): Promise<Response | undefined> {
    let state = store.getState();
    let isLogin = state.authentication.isLogin;

    if (isLogin === undefined) {
        await delay(100);
        return (await authorizedAccess());
    }

    if (!isLogin) {
        console.log(isLogin);
        return redirect(`/${convertToName(state.language.language)}/${Paths.noAuthorization}`);
    }
    else {
        return;
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}