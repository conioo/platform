import '../css/Hub.css'
import GapiLogin from '../google/GapiLogin';
import EasySpeech from 'easy-speech';
import Language, { convertToEnum } from '../types/Language';
import { ActionFunctionArgs, Outlet, ParamParseKey, Params, useLoaderData, useNavigate } from 'react-router-dom';
import Paths, { LanguagePathName } from '../router/Paths';
import { useAppDispatch } from '../redux/hook';
import LanguageChanger from '../components/LanguageChanger';
import { setLanguage } from '../redux/slices/language';
import { HandleGapiLoad } from '../google/services/AuhorizationService';
import { useEffect } from 'react';
import { ChangeVoice, EasySpeechInit } from '../services/EasySpeechHandlers';
import store from '../redux/store';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.hub>>;
}

let firstLoaded = true;

export async function loader({ params }: Args): Promise<boolean> {
    console.log("HubLoader");

    if (firstLoaded) {
        firstLoaded = false;
        await FirstLoaded();
    }

    const languageName = params.language;

    if (!languageName) {
        throw new Error("missing language");
    }

    let language = convertToEnum(languageName);

    if (language != store.getState().language.language) {// dla na poczatku niemiecki nie zadziala
        store.dispatch(setLanguage(language));
        ChangeVoice(language);
    }

    console.log("HubLoader-Koniec");
    return true;
}

async function FirstLoaded() {
    await HandleGapiLoad();
    await EasySpeechInit();
    console.log("po pp o");
}

export default function Hub() {
    console.log("Hub");

    // useEffect(() => { FirstLoaded() }, []);
    const navigate = useNavigate();

    return (
        <>
            <header>
                <LanguageChanger></LanguageChanger>
                <GapiLogin></GapiLogin>
            </header>

            <section className='sections-container'>
                <section className='left-section'>
                </section>

                <section className='main-section'>
                    <Outlet />
                </section>

                <section className='right-section'>
                    {<button className='return-button' onClick={() => { Return() }}>Powrót</button>}
                </section>
            </section>

            <footer></footer>
        </>
    );

    function Return() {
        navigate(-1);
    }
}