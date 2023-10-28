import '../css/Hub.css'
import GapiLogin from '../google/GapiLogin';
import { convertToEnum, convertToName } from '../types/Language';
import { ActionFunctionArgs, Outlet, ParamParseKey, Params, useLoaderData, useNavigate } from 'react-router-dom';
import Paths from '../router/Paths';
import LanguageChanger from '../components/LanguageChanger';
import { selectLanguage, setLanguage } from '../redux/slices/language';
import { HandleGapiLoad } from '../google/services/AuhorizationService';
import { EasySpeechInit } from '../services/EasySpeechHandlers';
import store from '../redux/store';
import { useSelector } from 'react-redux';
import { selectIsLogin } from '../redux/slices/authentication';

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

    let language = convertToEnum(languageName);

    store.dispatch(setLanguage(language));

    return true;
}

async function FirstLoaded() {
    EasySpeechInit();
    await HandleGapiLoad();
}

export default function Hub() {
    console.log("Hub");

    const navigate = useNavigate();

    const language = convertToName(useSelector(selectLanguage));

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
                    <Outlet />
                </section>

                <section className='right-section'>
                </section>
            </section>

            <footer></footer>
        </>
    );
}