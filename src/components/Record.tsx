import Buttons from './Buttons';
import '../css/Record.css';
import React, { useState } from 'react';
import State from '../models/State';
import Action from '../types/Action';
import { useEasySpeech, useEasySpeechType } from '../hooks/EasySpeech';

interface RecordProps {
    state: State;
    dispath: React.Dispatch<Action>;
}

export default function Record({ state, dispath }: RecordProps) {
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
            {audioHub && textAreaValue ? <Buttons textAreaValue={textAreaValue} dispath={dispath} state={state} managementAudio={audioHub} /> : null}
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