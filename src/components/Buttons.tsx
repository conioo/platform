import React, { useState, useEffect, useRef } from 'react';
import '../css/Buttons.css';
import Segment from '../models/Segment';
import State from '../models/State';
import Action from '../types/Action';
import ActionType from '../types/ActionType';
import { saveModuleToGoogleDrive } from '../google/GoogleDriveService';
import Colouring from './Colouring';
import Module from '../models/Module';
import Language from '../types/Language';
import { useEasySpeechType } from '../hooks/EasySpeech';
import AudioPlay from './AudioPlay';

interface ButtonsProps {
    textAreaValue: string;
    dispath: React.Dispatch<Action>;
    state: State;
    managementAudio: useEasySpeechType
}

export default function Buttons({ textAreaValue, dispath, state, managementAudio }: ButtonsProps) {
    console.log("Buttons");

    const [module, setModule] = useState<Module>(new Module());
    const [isColouring, setIsColouring] = useState(false);

    useEffect(() => {
        GenerateModuleFromString(textAreaValue).then(module => setModule(module));
    }, [textAreaValue]);

    const segments = module.segments.map((segment: Segment, index: number) => {

        return (
            <>
                <span id={index.toString() + "e"} key={Math.random()} className='span-segment'>{segment.sentence}</span>
                <span contentEditable={true} suppressContentEditableWarning={true} id={index.toString() + "p"} key={Math.random()} className='span-segment'>{segment.translation}</span>
                <AudioPlay state={state} text={segment.sentence} managementAudio={managementAudio} key={Math.random()}></AudioPlay>
            </>
        );
    });

    function colour() {
        setIsColouring(true);
        setModule(getupdateModule());
    }

    function backToButtons() {
        setIsColouring(false);
    }

    console.log(isColouring);
    return (
        <>
            {
                (isColouring && <Colouring state={state} dispath={dispath} module={module} backToButtons={backToButtons}></Colouring>) ||
                (<>
                    <section className='segments'>
                        {segments}
                    </section>

                    <section>
                        <button onClick={colour} className='colour-button'>Koloruj</button>
                    </section>
                </>)
            }
        </>
    );

    async function GenerateModuleFromString(stringData: string): Promise<Module> {
        const sentences = stringData.split('\n');
        const translations = await TranslateSentences(sentences);

        let segments = new Array<Segment>(sentences.length);

        for (let i: number = 0; i < sentences.length; ++i) {
            segments[i] = new Segment(sentences[i], translations[i]);
        }

        let result = new Module(segments);
        return result;
    }

    function getupdateModule(): Module {

        let newSegmentsData = module.segments.slice();

        for (let i = 0; i < module.segments.length; ++i) {
            let spanElement = document.getElementById(i + "p") as HTMLSpanElement;

            if (spanElement.textContent) {
                newSegmentsData[i].translation = spanElement.textContent;
            }
            else {
                newSegmentsData[i].translation = "";
            }
        }

        return new Module(newSegmentsData);
    }

    async function TranslateSentences(sentences: Array<string>): Promise<Array<string>> {
        let sourceLanguage: string;

        if (state.language === Language.English) {
            sourceLanguage = 'en';
        }
        else {
            sourceLanguage = 'de';
        }

        const targetLanguage = 'pl';

        console.log(state.tokens);
        const request = require('sync-request');
        const baseApiUrl = `https://api-free.deepl.com/v2/translate?auth_key=${state.tokens.deepl}&source_lang=${sourceLanguage}&target_lang=${targetLanguage}`;

        let mainCounter = 0;
        let resultArray: Array<string> = new Array<string>();

        try {

            for (let i: number = 0; mainCounter < sentences.length; ++i) {
                let apiUrl = baseApiUrl;

                for (let j: number = 0; j < 50; ++j) {
                    apiUrl += "&text=" + sentences[mainCounter];
                    ++mainCounter;

                    if (mainCounter == sentences.length) {
                        break;
                    }
                }

                console.log(apiUrl);
                const response = request('POST', apiUrl);
                console.log(response);

                const responseBody = JSON.parse(response.getBody('utf8'));

                const responseTranslations = responseBody.translations.map((translation: any) => translation.text) as Array<string>;

                resultArray = resultArray.concat(responseTranslations);
            }

            return resultArray;
        } catch (error: any) {
            return ['Error: ' + error.message];
        }
    }
}