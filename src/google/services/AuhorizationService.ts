import { getSecrets } from "../GoogleDriveAuthorizeService";
import store from "../../redux/store";
import { login, logout, setIsLogin } from "../../redux/slices/authentication";
import { redirect } from "react-router-dom";
import Paths from "../../router/Paths";

export async function HandleGapiLoad() {
    await gapi.load('client:auth2', initClient);
};

async function initClient() {
    //console.log(gapi.client);
    await gapi.client.init({
        clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
        scope: process.env.REACT_APP_SCOPES
    });
    console.log(gapi.auth2);
    console.log(gapi.auth2?.getAuthInstance()?.currentUser?.get()?.getBasicProfile());

    await gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
        discoveryDocs: process.env.REACT_APP_DISCOVERY_DOCS ? [process.env.REACT_APP_DISCOVERY_DOCS] : undefined,
        scope: process.env.REACT_APP_SCOPES
    });

    console.log(gapi.auth2?.getAuthInstance().currentUser.get().getBasicProfile().getEmail());

    //gapi.auth2.GoogleAuth
    if (gapi.auth2?.getAuthInstance()?.isSignedIn?.get()) {
        // gapi.auth2?.getAuthInstance()?.
        if (gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail() === "modeplatform@gmail.com") {
            await googleLogin(true);
        }
        else {
            await googleLogin();
        }
    }
    else {
        store.dispatch(setIsLogin(false));
    }

    // await gapi.load('client:auth2', () => {
    //     gapi.auth2.init({
    //       client_id: CLIENT_ID_ADMIN,
    //       scope: 'profile email',
    //     }).then((auth) => {
    //       setAuthAdmin(auth);  // Zapisz instancję autoryzacji dla admina
    //     });
    //   });
};

async function loadClient() {

    //await gapi.client.load("https://texttospeech.googleapis.com/$discovery/rest?version=v1");
    await gapi.client.load("https://texttospeech.googleapis.com/$discovery/rest?version=v1");

    console.log("GAPI client loaded for API speeecchhhh");
    //  function (err) { console.error("Error loading GAPI client for API", err); });
}


function execute() {
    console.log("execute order");
    console.log((gapi.client as any).texttospeech);

    return (gapi.client as any).texttospeech.text.synthesize({
        "resource": {
            "voice": {
                "name": "en-GB-Standard-B"
            },
            "input": {
                "text": "cat and dog are on the table"
            },
            "audioConfig": {}
        }
    })
        .then(function (response: any) {
            console.log("Response", response);
        },
            function (err: any) { console.error("Execute error", err); });
}

export async function googleLogin(isAdmin: boolean = false) {

    if (isAdmin) {
        // await loadClient();
        // await execute();
        let tokens = await getSecrets();

        if (!tokens) {
            throw new Error("invalid tokens");
        }

        store.dispatch(login(tokens.deepl, true));
    }
    else {
        store.dispatch(login(undefined, false));
    }
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

    let isAdmin = state.authentication.isAdmin;

    if (!isAdmin) {
        console.log(isLogin);
        return redirect(`/${state.language.language}/${Paths.noAuthorization}`);
    }
    else {
        return;
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}