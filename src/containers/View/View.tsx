import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useSelector, useStore } from 'react-redux';
import { useAsyncValue, useNavigate } from 'react-router-dom';
import AudioPlay from '../../components/AudioPlay/AudioPlay';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import Module from '../../models/Module';
import { selectIsAdmin, selectIsLogin } from '../../redux/slices/authentication';
import { selectBasePath, selectIsEasySpeech } from '../../redux/slices/language';
import { selectAllOptions, setVoiceName } from '../../redux/slices/moduleOptions';
import ChangeVoice, { ChangeVoiceRate, getEasySpeech, UpdatePlaybackRateForAllAudio } from '../../services/EasySpeechHandlers';
// import './View.scss';
import ClassicView from './Views/ClassicView/ClassicView';
import OverlayView from './Views/OverlayView';
import VerticalView from './Views/VerticalView';
import { getAudio } from '../../google/GoogleDriveService';
import { useImmer } from 'use-immer';

interface ViewProps {
    fileId: string;
}

export default function View({ fileId }: ViewProps): JSX.Element {
    console.log("View");

    let { playBackSpeed, displayMode, voiceName } = useSelector(selectAllOptions);

    const module = useAsyncValue() as Module;
    //const isEasySpeech = useSelector(selectIsEasySpeech);

    const [audioHub, setAudioHub] = useState(getEasySpeech);//isEasySpeech ? getEasySpeech : undefined
    const [showModal, setShowModal] = useState(false);

    const [previousDisplayMode, setPreviousDisplayMode] = useState(displayMode);

    const [text, setText] = useState<string>("");

    const [betterAudioUrl, setBetterAudioUrl] = useImmer<Array<string | undefined> | undefined>(undefined);

    //console.log(betterAudioUrl);
    let store = useStore();

    const navigate = useNavigate();
    const basePath = useSelector(selectBasePath);
    const isAdmin = useSelector(selectIsAdmin);

    //console.log(module);

    if (previousDisplayMode !== displayMode) {
        console.log("zzzzzzzzzzzzzzzzz");
        audioHub.resetState();
        setPreviousDisplayMode(displayMode);
    }

    // const isFirstRenderForDisplayMode = useRef(true);

    // useEffect(() => {
    //     if (isFirstRenderForDisplayMode.current) {
    //         isFirstRenderForDisplayMode.current = false;
    //     } else {
    //         audioHub.resetState();
    //         console.log("resssssssssset");
    //     }
    // }, [displayMode]); // useEffect będzie nasłuchiwał zmiany someProp

    useEffect(() => {
        store.dispatch(setVoiceName(module.voiceName));
    }, [])

    useEffect(() => {
        ChangeVoiceRate(playBackSpeed);

        // if (betterAudioUrl) {
        //     UpdatePlaybackRateForAllAudio(playBackSpeed);
        // }

    }, [playBackSpeed])


    useEffect(() => {
        ChangeVoice(voiceName);
    }, [voiceName])

    useEffect(() => {

        // for (let i = 0; i < module.sections.length; ++i) {
        //     //console.log(module.sections[i].audioId);
        //     if (module.sections[i].audioId)// !== undefined && module.sections[i].audioId !== ""
        //     {
        //         setAudioUrl(module.sections[i].audioId, i);
        //     }
        // }
        console.log("start encoding");
        //let tot: string;

        let newAudioUrl = new Array<string | undefined>(module.sections.length);
        let isOnes = false;

        for (let i = 0; i < module.sections.length; ++i) {

            if (module.sections[i].synths && module.sections[i].synths.length > 0) {
                // var snd = new Audio("data:audio/mpeg;base64," + module.sections[i].synths[0]);
                // snd.autoplay = false;
                // console.log("dddddddddddddddddddd");
                // snd.play();
                isOnes = true;
                const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
                    const byteCharacters = atob(b64Data);
                    const byteArrays = [];

                    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                        const slice = byteCharacters.slice(offset, offset + sliceSize);

                        const byteNumbers = new Array(slice.length);
                        for (let i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        const byteArray = new Uint8Array(byteNumbers);
                        byteArrays.push(byteArray);
                    }

                    const blob = new Blob(byteArrays, { type: contentType });
                    return blob;
                }

                const blob = b64toBlob(module.sections[i].synths[0], "audio/mpeg");
                const audioUrl = URL.createObjectURL(blob);
                //tot = audioUrl;
                //module.sections[i].synths[0]

                //const cleanBase64Audio = module.sections[i].synths[0].replace(/^"|"$/g, '');

                //const base64Data = cleanBase64Audio.split(',')[1];

                // Konwertuj Base64 na tablicę bajtów (Uint8Array)
                // const byteCharacters = atob(module.sections[i].synths[0].replace(/^"|"$/g, ''));
                // const byteNumbers = new Array(byteCharacters.length);
                // for (let i = 0; i < byteCharacters.length; i++) {
                //     byteNumbers[i] = byteCharacters.charCodeAt(i);
                // }
                // const byteArray = new Uint8Array(byteNumbers);

                // // Stwórz obiekt Blob dla audio, np. MP3
                // const blob = new Blob([byteArray], { type: 'audio/mp3' });

                // // Stwórz URL za pomocą URL.createObjectURL()
                // const audioUrl = URL.createObjectURL(blob);

                // console.log("tuuuuuuuuuuuuu", audioUrl);


                if (audioUrl) {
                    newAudioUrl[i] = audioUrl;
                }

            }
        }

        // setBetterAudioUrl(draft => {
        //     draft[0] = tot;  // Modyfikujesz stan bezpośrednio w draft
        //     draft[1] = tot;
        // });
        //console.log(newAudioUrl);
        console.log(isOnes);

        if (isOnes) {
            setBetterAudioUrl(newAudioUrl);
        }

        console.log("end encoding");
    }, []);

    return (
        <>
            <h1 className='view__mudule-name'>
                {module.name}
            </h1>

            <Form.Label className='view__font-size-label'>
                <Form.Range className='view__font-size-range' min={0.8} max={4} step={0.1} defaultValue={1.4} onChange={(event) => handleChangeFontSize(event.target.value)}></Form.Range>
            </Form.Label>

            {/* //if all not undefined multi  (stary sposób, kiedy nowy to ładować) tekst wczesniej obliczyc */}
            <AudioPlay key={"fullText"} text={text} managementAudio={audioHub} id={-1} isFullAudio={betterAudioUrl ? true : false}></AudioPlay>

            <section className='view__options'>
                {isAdmin && <Button className='base-icon-button view__option-button' variant='outline-secondary' onClick={() => { navigate(basePath + "/modify/" + fileId, { state: { toMainPage: true } }) }}><i className="bi bi-gear-fill"></i></Button>}
                <Button className='base-icon-button view__option-button' variant='outline-secondary' onClick={() => setShowModal(true)}><i className="bi bi-sliders"></i></Button>
                {showModal && <SettingsModal defaultVoiceName={module.voiceName} handleClose={closeModal} show={showModal} betterVoiceName={module.synthVoiceName ? module.synthVoiceName : undefined}></SettingsModal>}
            </section >

            {displayMode === "classic" && <ClassicView module={module} setText={setText} audioHub={audioHub} audioUrl={betterAudioUrl}></ClassicView>}
            {displayMode === "vertical" && <VerticalView module={module} setText={setText} audioHub={audioHub} audioUrl={betterAudioUrl}></VerticalView>}
            {displayMode === "overlay" && <OverlayView module={module} setText={setText} audioHub={audioHub} audioUrl={betterAudioUrl}></OverlayView>}
        </>
    );

    function handleChangeFontSize(newFontSize: string) {
        const viewSegment = document.getElementsByClassName('view')[0] as HTMLElement;

        if (viewSegment) {
            viewSegment.style.fontSize = `${newFontSize}rem`;
            document.body.style.setProperty("--tooltip-font-size", `${parseFloat(newFontSize) - 0.6}rem`);
        }

        // console.log(document.body.style.getPropertyValue("--tooltip-font-size"));
    }

    function closeModal() {
        setShowModal(false);
    }

    // async function setAudioUrl(audioUrl: string, index: number) {
    //     //console.log("urlssss");
    //     const url = await getAudio(audioUrl);

    //     //console.log(url);

    //     //betterAudioUrl[index] = url;

    //     setBetterAudioUrl(draft => {
    //         draft[index] = url;  // Modyfikujesz stan bezpośrednio w draft
    //     });
    //     //setBetterAudioUrl((state) => { state[index] = url });
    // }
}

//better nie działa dla no speech--
//ustawienia głosu--
//licznik znaków
//sccs
//test form
//duży głos dla better
//reszta sekcji dla better