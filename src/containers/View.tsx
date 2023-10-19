import '../css/View.css';
import '../css/Colouring.css';
import '../css/fontello/css/fontello.css';
import React, { useEffect } from 'react';
import Segment from '../models/Segment';
import AudioPlay from '../components/AudioPlay';
import { getModule } from '../google/GoogleDriveService';
import Module from '../models/Module';
import { useEasySpeech, } from '../hooks/EasySpeech';
import { ActionFunctionArgs, ParamParseKey, Params, useLoaderData } from 'react-router-dom';
import Paths from '../router/Paths';
import SettingsModal from '../components/SettingsModal';
import { useSelector } from 'react-redux';
import { ModuleOptionsState, selectAllOptions, setOptions, setVoiceName } from '../redux/slices/moduleOptions';
import { useCookies } from 'react-cookie';
import ChangeVoice, { ChangeVoiceRate } from '../services/EasySpeechHandlers';
import { useStore } from 'react-redux';
import { Colors } from '../types/Colors';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.view>>;
}

export async function loader({ params }: Args): Promise<Module> {
    const fileId = params.fileid;

    if (!fileId) {
        throw new Error("missing file id");
    }

    let module = await getModule(fileId);

    ChangeVoice(module.voiceName);

    return module;
}

export default function View(): JSX.Element {
    console.log("View");

    let module = useLoaderData() as Module;
    let audioHub = useEasySpeech();
    let { playBackSpeed, displayMode, isHidden, voiceName } = useSelector(selectAllOptions);
    let fullText = "";

    let isClassic = displayMode === "classic";

    let refToSlider = React.createRef<HTMLInputElement>();
    let store = useStore();

    const [cookies] = useCookies(['view-options']);

    console.log(module);

    useEffect(() => {
        let viewOptions = cookies['view-options'] as ModuleOptionsState;

        if (viewOptions === undefined) {
            return;
        }

        store.dispatch(setOptions(viewOptions));

    }, [cookies['view-options']]);

    useEffect(() => {
        store.dispatch(setVoiceName(module.voiceName));
    }, [])

    useEffect(() => {
        ChangeVoiceRate(playBackSpeed);
    }, [playBackSpeed])

    useEffect(() => {
        ChangeVoice(voiceName);
    }, [voiceName])

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

        let color = Colors[colorId];

        return getSpan(content, color);
    }
}