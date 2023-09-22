import '../css/View.css';
import '../css/Colouring.css';
import '../css/fontello/css/fontello.css';
import React, { useState, useEffect } from 'react';
import Segment from '../models/Segment';
import State from '../models/State';
import Action from '../types/Action';
import ActionType from '../types/ActionType';
import AudioPlay from '../components/AudioPlay';
import { getModule } from '../google/GoogleDriveService';
import Module from '../models/Module';
import { useEasySpeech, useEasySpeechType } from '../hooks/EasySpeech';
import { ActionFunctionArgs, ParamParseKey, Params, useLoaderData, useParams } from 'react-router-dom';
import EasySpeech from 'easy-speech';
import { useDispatch } from 'react-redux';
import Paths from '../router/Paths';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.view>>;
}

export async function loader({ params }: Args): Promise<Module> {
    const fileId = params.fileid;

    console.log(fileId);

    if(!fileId)
    {
        throw new Error("missing file id");
    }

    let module = await getModule(fileId);

    return module;
}

export default function View(): JSX.Element {
    console.log("View");
    console.log(EasySpeech.status());

    let module = useLoaderData() as Module;
    let audioHub = useEasySpeech();

    let refToSlider = React.createRef<HTMLInputElement>();

    const segments = module.segments.map((segment: Segment, index: number) => {

        let wordPiecies = segment.sentence.split(" ");

        let allWords = wordPiecies.map((word: string, internalIndex: number) => {
            return getColoredSpan(word, segment.sentenceColors[internalIndex]);
        })

        let meaningPiecies = segment.translation.split(" ");

        let allMeanings = meaningPiecies.map((meaning: string, internalIndex: number) => {
            return getColoredSpan(meaning, segment.translationsColors[internalIndex]);
        })

        return (
            <>
                <div key={Math.random()} className='audioplay-container'>
                    <AudioPlay key={Math.random()} text={segment.sentence} managementAudio={audioHub}></AudioPlay>
                </div>
                <span key={Math.random()} className="sentence" >{allWords}</span>
                <span key={Math.random()} className="sentence" >{allMeanings}</span>
            </>
        );
    });

    return (
        <>
            <h2>
                {module.name}
            </h2>

            <input type="range" id="fontSlider" className='font-size-slider' ref={refToSlider} onChange={(event) => handleChangeFontSize(event)} min="10" max="55" defaultValue={20} step="1"></input>

            <section id="view-segments">
                {segments}
            </section>
        </>
    );

    function handleChangeFontSize(event: React.ChangeEvent<HTMLInputElement>) {
        if (!refToSlider.current) {
            return;
        }

        const viewSegment = document.getElementById('view-segments');

        if (viewSegment) {
            console.log(event.target.value);
            viewSegment.style.fontSize = `${event.target.value}px`;
        }
    }

    function getSpan(content: string, additionalClassName: string): JSX.Element {
        return (
            <span key={Math.random()} className={additionalClassName} >{content + " "}</span>
        );
    }

    function getColoredSpan(content: string, colorId: number): JSX.Element | null {
        switch (colorId) {
            case 0:
                return getSpan(content, "black");
            case 1:
                return getSpan(content, "orange");
            case 2:
                return getSpan(content, "red");
            case 3:
                return getSpan(content, "purple");
            case 4:
                return getSpan(content, "navy");
            case 5:
                return getSpan(content, "green");
            default:
                return null;
        }
    }
}