import { useSelector } from 'react-redux';
import { ActionFunctionArgs, Outlet, ParamParseKey, Params, useNavigate } from 'react-router-dom';
import LanguageChanger from '../components/LanguageChanger';
import '../css/Hub.css';
import GapiLogin from '../google/GapiLogin';
import { HandleGapiLoad } from '../google/services/AuhorizationService';
import { selectLanguage, setLanguage } from '../redux/slices/language';
import store from '../redux/store';
import Paths from '../router/Paths';
import { EasySpeechInit } from '../services/EasySpeechHandlers';
import OldModule from '../models/Module';
import Module from '../models/NewModule';
import Section from '../models/Section';
import { updateFileInGoogleDrive, updateModuleInGoogleDrive } from '../google/GoogleDriveService';
import Language from '../types/Language';

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

    const navigate = useNavigate();

    const language = useSelector(selectLanguage);

    return (
        <>
            <header>
                <section className='header-left-section'>
                    <LanguageChanger></LanguageChanger>
                    <div className='login'>
                        <button className='change-language-button' onClick={() => navigate(`/${language}/browser/home`)}>Menu Główne</button>
                    </div>
                </section>
                <section className='header-right-section'>
                    <GapiLogin></GapiLogin>
                </section>
            </header>

            <section className='sections-container'>
                <section className='left-section'>
                </section>

                <section className='main-section'>
                    {/* <button onClick={() => cast()}>Zamieniamy</button> */}
                    <Outlet />
                </section>

                <section className='right-section'>
                </section>
            </section>

            <footer></footer>
        </>
    );

    async function cast() {
        let res = await gapi.client.drive.files.list({
            q: "name='module.json'",
        });
        let files = res.result.files;

        console.log(files);
        if (!files) return;

        for (let info of files) {

            if (!info.id) { console.log("blaad"); break; }

            let con = await gapi.client.drive.files.get({
                fileId: info.id,
                alt: "media"
            });

            const jsonData = JSON.parse(con.body) as OldModule;

            if (jsonData["segments"] === undefined) {
                alert(jsonData);
            }

            let newData = change(jsonData);
            console.log(newData);

            await updateFileInGoogleDrive(info.id, newData);
        }
    }

    function change(old: OldModule): Module {
        let nof = new Module();

        nof.language = old.language;
        nof.name = old.name;
        nof.voiceName = old.voiceName;
        nof.targetLanguage = Language.Polish;

        let sec = new Array<Section>();

        for (let seg of old.segments) {
            let one = seg as any;
            seg.translationColors = one['translationsColors'];

            sec.push(new Section([seg]));
        }

        nof.sections = sec;

        return nof;
    }
}