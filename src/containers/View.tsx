import '../css/View.css';
import '../css/Colouring.css';
import '../css/fontello/css/fontello.css';
import React, { isValidElement, useEffect, useState } from 'react';
import Segment from '../models/Segment';
import AudioPlay from '../components/AudioPlay';
import { getModule } from '../google/GoogleDriveService';
import Module from '../models/Module';
import { useEasySpeech, } from '../hooks/EasySpeech';
import { ActionFunctionArgs, ParamParseKey, Params, useLoaderData } from 'react-router-dom';
import Paths from '../router/Paths';
import { ChangeVoice, ChangeVoiceRate } from '../services/EasySpeechHandlers';
import SettingsModal from '../components/SettingsModal';
import { useSelector } from 'react-redux';
import { selectAllOptions, selectDisplayMode, setDisplayMode, setIsHidden, setPlayBackSpeed } from '../redux/slices/moduleOptions';
import store from '../redux/store';
import { useCookies } from 'react-cookie';
import { FormikValuesType } from '../components/Forms/OptionsModuleFormik';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.view>>;
}

export async function loader({ params }: Args): Promise<Module> {
    const fileId = params.fileid;

    if (!fileId) {
        throw new Error("missing file id");
    }

    let module = await getModule(fileId);

    await ChangeVoice(module.language, module.voiceType, store.getState().moduleOptions.playBackSpeed);

    return module;
}

export default function View(): JSX.Element {
    console.log("View");

    let module = useLoaderData() as Module;
    let audioHub = useEasySpeech();
    let { playBackSpeed, displayMode, isHidden } = useSelector(selectAllOptions);
    let fullText = "";

    let isClassic = displayMode === "classic";

    let refToSlider = React.createRef<HTMLInputElement>();

    ChangeVoiceRate(playBackSpeed);

    const [cookies] = useCookies(['view-options']);

    useEffect(() => {
        let viewOptions = cookies['view-options'] as FormikValuesType;

        if (viewOptions === undefined) {
            return;
        }

        store.dispatch(setDisplayMode(viewOptions.displayMode));
        store.dispatch(setPlayBackSpeed(viewOptions.playBackSpeed));
        store.dispatch(setIsHidden(viewOptions.isHidden));

    }, [cookies['view-options']]);

    const segments = module.segments.map((segment: Segment, index: number) => {
        fullText += segment.sentence + " ";

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
                <div key={index + "au"} className='audioplay-container'>
                    {segment.sentence.length > 0 && <AudioPlay key={Math.random()} text={segment.sentence} managementAudio={audioHub}></AudioPlay>}
                </div>
                <span key={index + "se"} className="sentence" >{allWords}</span>

                {!isClassic && <span key={index + "sp"}></span>}

                <section className='translation-section' key={index + "tr"}>
                    <span key={Math.random()} className="translation" >{allMeanings}</span>

                    {isHidden && segment.sentence.length > 0 && <button className='icon-exchange view-visible-button' onClick={(e) => hiddenButton(e.currentTarget)}></button>}
                </section>
            </>
        );
    });

    const hiddenButton = (button: HTMLButtonElement) => {
        button.style.visibility = 'hidden';
    };

    return (
        <>
            <h2>
                {module.name}
            </h2>

            <input type="range" id="fontSlider" className='font-size-slider' ref={refToSlider} onChange={(event) => handleChangeFontSize(event)} min="10" max="70" defaultValue={20} step="1"></input>

            <AudioPlay key={"fullText"} text={fullText} managementAudio={audioHub}></AudioPlay>

            <section className='view-options-section'>
                <SettingsModal></SettingsModal>
            </section>

            <section className={displayMode + "-segments view-segments"}>
                {segments}
            </section>
        </>
    );

    function handleChangeFontSize(event: React.ChangeEvent<HTMLInputElement>) {
        if (!refToSlider.current) {
            return;
        }

        const viewSegment = document.getElementsByClassName('view-segments')[0] as HTMLElement;

        if (viewSegment) {
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