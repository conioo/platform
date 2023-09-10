import FileBrowser from './FileBrowser';
import Record from './Record';
import View from './View';
import '../css/Hub.css'
import { useState, useReducer, useEffect } from 'react';
import State from '../models/State';
import reducer from '../reducer';
import ActionType from '../types/ActionType';
import GapiLogin from '../google/GapiLogin';
import EasySpeech from 'easy-speech';
import Language from '../types/Language';
import Router from './Router';

export default function Hub() {
    console.log("Hub");
    const [state, dispatch] = useReducer(reducer, new State());

    let isFileBrowser = false;

    console.log(EasySpeech.detect());


    EasySpeech.init({ maxTimeout: 5000, interval: 250 })
        .then(() => {
            console.log(EasySpeech.status());

            let voices = EasySpeech.voices();
            if (voices.length === 0) {
                console.log("any voices detected");
                return;
            }

            let defaultVoice: SpeechSynthesisVoice;

            if (state.language === Language.English) {
                let voice = voices.find((voice: SpeechSynthesisVoice) => voice.name === "Google UK English Male");
                if (!voice) {
                    voice = voices.find((voice: SpeechSynthesisVoice) => (voice.lang === "en-GB" || voice.lang === "en_GB" || voice.lang.includes("en")));

                    if (!voice) {
                        return;
                    }
                }
                defaultVoice = voice;
            }
            else {
                let voice = voices.find((voice: SpeechSynthesisVoice) => voice.name === "Google Deutsch");
                if (!voice) {
                    voice = voices.find((voice: SpeechSynthesisVoice) => (voice.lang === "de-DE" || voice.lang === "de_DE" || voice.lang.includes("de")));

                    if (!voice) {
                        return;
                    }
                }
                defaultVoice = voice;
            }

            EasySpeech.defaults({ voice: defaultVoice });
            EasySpeech.on({ end: () => { console.log("gowniana sytuacja") } });
        })
        .catch(e => console.error(e));

    // if (state.voices.length <= 0) {
    //     const allVoicesObtained = new Promise(function (resolve, reject) {
    //         let voices = window.speechSynthesis.getVoices();
    //         if (voices.length !== 0) {
    //             resolve(voices);
    //         } else {
    //             window.speechSynthesis.addEventListener("voiceschanged", function () {
    //                 voices = window.speechSynthesis.getVoices();
    //                 resolve(voices);
    //             });
    //         }
    //     });

    //     allVoicesObtained.then((voices: any) => {
    //         let usefulVoices = new Array<SpeechSynthesisVoice>();

    //         console.log(voices);

    //         let englishVoice = voices.find((voice: any) => voice.name === "Google UK English Male");

    //         console.log(englishVoice);
    //         if (!englishVoice) {
    //             englishVoice = voices.find((voice: any) => (voice.lang === "en-GB" || voice.lang === "de_DE"));

    //             console.log("tutaj");
    //             console.log(englishVoice);

    //             if (!englishVoice) {
    //                 return;
    //             }
    //         }

    //         usefulVoices.push(englishVoice);
    //         dispath({ type: ActionType.SetVoices, payload: usefulVoices });
    //     });
    // }

    const router = createBrowserRouter([
        {
            path: "/",
            element: <div>Hello world!</div>,
        },
        {
            path: "/bobo",
            element: <FileBrowser dispath={dispath} state={state}></FileBrowser>
        }
    ],
    {
        basename: "/platform"
    });

    return (
        <>
            <header>
                <div className='login'>
                    <button className='change-language-button' onClick={() => dispath({ type: ActionType.ChangeLanguage })}>Angielski</button>
                </div>

                <GapiLogin state={state} dispath={dispath}></GapiLogin>
            </header>

            <section className='sections-container'>
                <section className='left-section'>
                </section>

                <section className='main-section'>
                    {/* {
                        (state.fileToView && <View dispath={dispath} state={state} ></View>) ||
                        (state.isRecord && <Record dispath={dispath} state={state}></Record>) ||
                        (state.fileToModify && <ModifyFile dispath={dispath} state={state}></ModifyFile>) ||
                        (isFileBrowser = true, <FileBrowser dispath={dispath} state={state}></FileBrowser>)
                    } */}
                    <Router state={state} dispatch: {dispatch} />

                </section>

                <section className='right-section'>
                    {!isFileBrowser && <button className='return-button' onClick={() => { dispath({ type: ActionType.Return }) }}>Powrót</button>}
                </section>
            </section>

            <footer></footer>
        </>
    );
}