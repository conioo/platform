import '../css/View.css';
import '../css/fontello/css/fontello.css';
import React, { useState, useEffect } from 'react';
import { Segment } from '../models/Segment';
import { State } from '../models/State';
import Action from '../types/Action';
import ActionType from '../types/ActionType';
import { OpenFile } from '../services/FilesService';
import AudioControl from './AudioControl';
import ManagementAudio from '../services/ManagementAudio';
import AudioPlay from './AudioPlay';
import ManagementPlay from '../services/ManagementPlay';

interface ViewProps {
    dispath: React.Dispatch<Action>;
    state: State;
}

export default function View({ state, dispath }: ViewProps) {
    console.log("view");
    const [segmentsData, setSegmentsData] = useState<Array<Segment> | null>(null);

    useEffect(() => {
        if (!segmentsData && state.fileNameToView) {
            const segmentsDataPromise = OpenFile(state, state.fileNameToView);

            segmentsDataPromise.then(segmentsData => {

                if (segmentsData !== undefined) {
                    setSegmentsData(segmentsData);
                }
            });
        }
    });

    let managementAudio = new ManagementPlay();

    if (segmentsData) {
        const buttons = segmentsData.map((segment: Segment, index: number) => {
            const ref = React.createRef<HTMLInputElement>();

            return (
                <>
                    <div key={Math.random()} className='audioplay-container'>
                        <AudioPlay key={Math.random()} text={segment.word} managementAudio={managementAudio}></AudioPlay>
                    </div>
                    <span key={Math.random()} className="sentence" >{segment.word}</span>
                    <span key={Math.random()} className="sentence" >{segment.meaning}</span>
                </>
            );
        });

        return (
            <>
                <h2>
                    {state.fileNameToView}
                </h2>

                <section className="view-segments">
                    {buttons}
                </section>
            </>
        );
    }
    else {
        return null;
    }


}