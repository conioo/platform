import { getSecrets } from "../GoogleDriveAuthorizeService";
import store from "../../redux/store";
import { login, logout, setIsLogin } from "../../redux/slices/authentication";
import { redirect } from "react-router-dom";
import Paths from "../../router/Paths";
import { isatty } from "tty";

export async function HandleGapiLoad() {
    await gapi.load('client:auth2', initClient);
};

async function initClient() {

    // await gapi.client.init({
    //     clientId: "",
    //     scope: process.env.REACT_APP_SCOPES
    // });

    // console.log(gapi.auth2?.getAuthInstance()?.currentUser?.get()?.getBasicProfile()?.getEmail());
    // console.log("przed");

    await gapi.client.init({ 
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
        discoveryDocs: process.env.REACT_APP_DISCOVERY_DOCS ? [process.env.REACT_APP_DISCOVERY_DOCS, "https://texttospeech.googleapis.com/$discovery/rest?version=v1"] : undefined,
        scope: process.env.REACT_APP_SCOPES
    });
//"https://texttospeech.googleapis.com/$discovery/rest?version=v1"
    //console.log(gapi.auth2?.getAuthInstance().currentUser.get().getBasicProfile().getEmail());

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
                "name": "en-GB-Standard-B",
                "languageCode": "en-GB",
            },
            "input": {
                "text": "cat and dog are on the table"
            },
            "audioConfig": {
                "audioEncoding": "MP3"
            }
        }
    })
        .then(function (response: any) {
            console.log("Response", response);
        },
            function (err: any) { console.error("Execute error", err); });
}

// async function synthesizeText(text: string) {
//     // Upewnij się, że użytkownik jest zalogowany i pozyskaj token
//     const authInstance = gapi.auth2.getAuthInstance();
//     const user = authInstance.currentUser.get();
//     const accessToken = user.getAuthResponse().access_token;
  
//     // URL endpointu Google Text-to-Speech API
//     const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.REACT_APP_API_KEY}`;
  
//     // Dane do wysłania w zapytaniu (text input, voice settings)
//     const body = {
//       input: { text },
//       voice: {
//         languageCode: "en-GB",
//         name: "en-GB-Standard-B",
//         ssmlGender: "MALE",
//       },
//       audioConfig: {
//         audioEncoding: "MP3",
//       },
//     };
  
//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       const data = await response.json();
//       // Tu znajdziesz wynikowy plik audio w formacie base64
//       console.log("Synthesis result: ", data.audioContent);
  
//       // Jeśli chcesz odtworzyć audio w przeglądarce
//       const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
//       audio.play();
//     } catch (error) {
//       console.error("Error synthesizing speech: ", error);
//     }
//   }

export async function googleLogin(isAdmin: boolean = false) {
    if (isAdmin) {
        //await loadClient();
        //await execute();
        //synthesizeText("dog and cat");
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