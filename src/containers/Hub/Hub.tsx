import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { ActionFunctionArgs, Outlet, ParamParseKey, Params } from 'react-router-dom';
import { HandleGapiLoad } from '../../google/services/AuhorizationService';
import { setLanguage } from '../../redux/slices/language';
import { ModuleOptionsState, setOptions } from '../../redux/slices/moduleOptions';
import store from '../../redux/store';
import Paths from '../../router/Paths';
import { EasySpeechInit } from '../../services/EasySpeechHandlers';
import Language from '../../types/Language';
import Footer from '../Footer';
import Header from '../Header';
import './Hub.scss';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.hub>>;
}

let firstLoaded = true;

export async function loader({ params }: Args): Promise<boolean> {
    if (firstLoaded) {
        firstLoaded = false;
        await FirstLoaded();
    }

    const languageName = params.language;

    if (!languageName) {
        throw new Error("missing language");
    }

    let language = languageName as Language;

    store.dispatch(setLanguage(language));

    return true;
}

async function FirstLoaded() {
    HandleGapiLoad();
    await EasySpeechInit();
}

export default function Hub() {
    console.log("Hub");
    //data-bs-theme="dark"
    const [cookies] = useCookies(['view-options']);

    useEffect(() => {
        const viewOptionsCookie = cookies['view-options'] as ModuleOptionsState | undefined;

        if (viewOptionsCookie) {
            store.dispatch(setOptions(cookies['view-options']));
        }
    }, []);

    return (
        <>
            <Header></Header>

            <section className='hub__sections'>
                <section className='hub__left-section'>
                </section>

                <section className='hub__main-section'>
                    {/* <button onClick={() => cast()}>Zamieniamy</button> */}
                    <Outlet />
                </section>

                <section className='hub__right-section'>
                </section>
            </section>

            <Footer></Footer>
        </>
    );

    // async function cast() {
    //     let res = await gapi.client.drive.files.list({
    //         q: "name='module.json'",
    //     });
    //     let files = res.result.files;

    //     console.log(files);
    //     if (!files) return;

    //     for (let info of files) {

    //         if (!info.id) { console.log("blaad"); break; }

    //         let con = await gapi.client.drive.files.get({
    //             fileId: info.id,
    //             alt: "media"
    //         });

    //         const jsonData = JSON.parse(con.body) as OldModule;

    //         if (jsonData["segments"] === undefined) {
    //             alert(jsonData);
    //         }

    //         let newData = change(jsonData);
    //         console.log(newData);

    //         await updateFileInGoogleDrive(info.id, newData);
    //     }
    // }

    // function change(old: OldModule): Module {
    //     let nof = new Module();

    //     nof.language = old.language;
    //     nof.name = old.name;
    //     nof.voiceName = old.voiceName;
    //     nof.targetLanguage = TargetLanguage.Polish;

    //     let sec = new Array<Section>();

    //     for (let seg of old.segments) {
    //         let one = seg as any;
    //         seg.translationColors = one['translationsColors'];

    //         sec.push(new Section([seg]));
    //     }

    //     nof.sections = sec;

    //     return nof;
    // }
}