import Buttons from '../components/Buttons';
import '../css/Record.css';
import React, { useState } from 'react';
import State from '../models/State';
import Action from '../types/Action';
import { useEasySpeech, useEasySpeechType } from '../hooks/EasySpeech';
import { ActionFunctionArgs, ParamParseKey, Params } from 'react-router-dom';
import Paths from '../router/Paths';
import { useDispatch } from 'react-redux';

// interface Args extends ActionFunctionArgs {
//     params: Params<ParamParseKey<typeof Paths.record>>;
// }

// export async function loader({ params }: Args): Promise<Language> {
//     console.log("RecordLoader");

//     const languageName = params.language;
//     let language: Language;

//     if (languageName === LanguagePathName.english) {
//         language = Language.English;
//     }
//     else if (languageName === LanguagePathName.german) {
//         language = Language.German;
//     }
//     else {
//         throw new Error("ni ma takiego jezora")//blad jakis
//     }

// }

export default function Record() {
    console.log("Record");

    const [textAreaValue, setTextAreaValue] = useState<string | null>(null);
    const [audioHub, setAudioHub] = useState<useEasySpeechType>();

    return (
        <>
            <div className='textarea-div'>
                <textarea id='record-textarea'></textarea>
            </div>
            <div>
                <button className='generate-segments-button' onClick={() => { SaveTextArea(); }} >Wygeneruj Kafelki</button>
                <button className='separate-dots-button' onClick={() => { SeparateDots(); }} >Oddziel kropki</button>
            </div>
            {audioHub && textAreaValue ? <Buttons textAreaValue={textAreaValue} managementAudio={audioHub} /> : null}
        </>
    );

    function SaveTextArea() {
        const textarea = (document.getElementById("record-textarea") as HTMLTextAreaElement);

        let value = textarea.value;
        if (value[value.length - 1] === "\n") {
            textarea.value = value.slice(0, -1);
        }
        setTextAreaValue(textarea.value);
        setAudioHub(useEasySpeech());
    }

    function SeparateDots() {
        const textarea = (document.getElementById("record-textarea") as HTMLTextAreaElement);
        let textsArray = textarea.value.split(". ");

        let newTextArea = "";

        for (let i = 0; i < textsArray.length; ++i) {
            newTextArea += textsArray[i] + ".\n";
        }

        while (newTextArea.length > 0 && newTextArea[newTextArea.length - 1] === '\n') {
            newTextArea = newTextArea.slice(0, -1);
        }

        textarea.value = newTextArea;
    }
}