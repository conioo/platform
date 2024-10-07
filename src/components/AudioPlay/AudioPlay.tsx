import EasySpeech from 'easy-speech';
import React, { useEffect, useRef, useState } from "react";
import { useEasySpeechType } from "../../hooks/EasySpeech";
import AudioInfo from "../../models/AudioInfo";
import './AudioPlay.scss';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
import { selectAllOptions } from '../../redux/slices/moduleOptions';
import { selectIsEasySpeech } from '../../redux/slices/language';

interface AudioPlayProps {
    text: string;
    audioUrl?: string | undefined;
    managementAudio: useEasySpeechType;
    id: number;
    isFullAudio?: boolean;
}

export default function AudioPlay({ text, managementAudio, audioUrl, id, isFullAudio }: AudioPlayProps) {

    const [audioInfo, setAudioInfo] = useState<AudioInfo>(new AudioInfo(id, React.createRef(), !audioUrl ? undefined : React.createRef()));

    //console.log(audioUrl);
    let { playBackSpeed } = useSelector(selectAllOptions);
    //const isEasySpeech = useSelector(selectIsEasySpeech);

    useEffect(() => {
        if (managementAudio) {
            managementAudio.addAudioInfo(audioInfo);
        }
    }, []);

    useEffect(() => {
        if (audioInfo.audioElement?.current) {
            audioInfo.audioElement.current.playbackRate = playBackSpeed;
        }

    }, [playBackSpeed, audioInfo.audioElement?.current]);
    //let { playBackSpeed, displayMode, voiceName } = useSelector(selectAllOptions);


    useEffect(() => {

        if (audioUrl && !audioInfo.audioElement) {
            //immer not work
            // audioInfo.audioElement = React.createRef();
            // setAudioInfo(audioInfo);

            let newAudioElementRef = React.createRef<HTMLAudioElement>();

            var newAudioInfoState: AudioInfo = {
                ...audioInfo,
                audioElement: newAudioElementRef
            };

            setAudioInfo(newAudioInfoState);

            if (managementAudio) {
                managementAudio.updateAudioInfo(newAudioInfoState);
            }
        }
    }, [audioUrl]);

    //do poprawy głos easy znika zawsze
    // if (!isEasySpeech || !audioUrl) {
    //     return <div></div>
    // }

    // style={{ display: 'none' }}
    return (
        <>
            {
                audioInfo.audioElement &&
                <audio ref={audioInfo.audioElement} controls style={{ display: 'none' }} onEnded={managementAudio.onEnd} onPlay={managementAudio.onStart}>
                    <source
                        src={audioUrl}
                        type="audio/mpeg"
                    />
                </audio>
            }
            <Button className='audio-play' variant='outline-dark' onClick={() => onPlayHandle(text, audioInfo, managementAudio, isFullAudio)}><i className="bi bi-play-fill" ref={audioInfo.audioButton}></i></Button>
        </>
    )
}

function onPlayHandle(text: string, audioInfo: AudioInfo, managementAudio: useEasySpeechType, isFullAudio?: boolean) {

    if (isFullAudio) {
        //console.log("gramyyyyyyy");
        //console.log(isFullAudio);
        managementAudio.playAllAudio();//zatrzymac?
        return;
    }

    var hasBetterAudio = audioInfo.audioElement ? true : false;

    if (audioInfo.isSpeaking) {

        if (hasBetterAudio) {

            audioInfo.audioElement?.current?.pause();
        } else {

            EasySpeech.pause();
        }

        audioInfo.isSpeaking = false;
        audioInfo.isPause = true;

        audioInfo.audioButton.current?.classList.remove("bi-pause-fill");
        audioInfo.audioButton.current?.classList.add("bi-play-fill");
    }
    else {
        audioInfo.audioButton.current?.classList.add("bi-pause-fill");
        audioInfo.audioButton.current?.classList.remove("bi-play-fill");

        if (audioInfo.isPause) {

            if (hasBetterAudio) {

                audioInfo.audioElement?.current?.play();
            } else {

                EasySpeech.resume();
            }

            audioInfo.isPause = false;
        }
        else {
            managementAudio.reset();

            if (hasBetterAudio) {

                audioInfo.audioElement?.current?.play();
            } else {

                //console.log(text);
                EasySpeech.speak({ text });
            }
        }

        audioInfo.isSpeaking = true;
    }
}