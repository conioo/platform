import Buttons from './Buttons';
import '../css/Record.css';
import React, { useState } from 'react';
import { State } from '../models/State';
import Action from '../types/Action';
import ActionType from '../types/ActionType';
import { Segment } from '../models/Segment';
import { OpenFile } from '../services/FilesService';

interface RecordProps {
    state: State;
    dispath: React.Dispatch<Action>;
}

export default function Record({ state, dispath }: RecordProps) {
    console.log("Record");

    const [textAreaValue, setTextAreaValue] = useState<string | null>(null);
    const [segmentsDataToModified, setSegmentsDataToModifed] = useState<Array<Segment> | null>(null);

    if (state.fileNameToModify) {
        OpenFile(state, state.fileNameToModify).then(segmentsData => {
            if (segmentsData) {
                setSegmentsDataToModifed(segmentsData);
            }
        });
    }

    return (
        <>
            <div className='textarea-div'>
                <textarea id='record-textarea'></textarea>
                {/* <button className='return-button' onClick={() => { dispath({ type: ActionType.ReturnFromRecord }) }}>Powrót</button> */}
            </div>
            <div>
                <button className='generate-segments-button' onClick={() => { SaveTextArea(); }} >Wygeneruj Kafelki</button>
            </div>
            {textAreaValue ? <Buttons textAreaValue={textAreaValue} dispath={dispath} state={state} /> : null}
            {/* <div>
                <button className='return-button' onClick={() => { dispath({ type: ActionType.ReturnFromRecord }) }}>Powrót</button>
            </div> */}
        </>
    );

    function SaveTextArea() {
        const textarea = (document.getElementById("record-textarea") as HTMLTextAreaElement);
        setTextAreaValue(textarea.value);
    }
}