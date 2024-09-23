import EasySpeech from 'easy-speech';
import React, { useEffect, useRef, useState } from "react";
import { useEasySpeechType } from "../../hooks/EasySpeech";
import AudioInfo from "../../models/AudioInfo";
import './AudioPlay.scss';
import Button from 'react-bootstrap/esm/Button';
import { useImmer } from 'use-immer';

interface AudioPlayProps {
    text: string;
    audioUrl?: string | undefined;
    managementAudio: useEasySpeechType | undefined;
}

export default function AudioPlay({ text, managementAudio, audioUrl }: AudioPlayProps) {
    //const [audioElementRef, setAudioElementRef] = useState<React.RefObject<HTMLAudioElement> | undefined>(useRef<HTMLAudioElement>(null));
    const [audioInfo, setAudioInfo] = useState<AudioInfo>(new AudioInfo(React.createRef(), !audioUrl ? undefined : React.createRef()));
    //
    // if (audioUrl) {
    //     setAudioElementRef(useRef<HTMLAudioElement>(null));
    // }

    useEffect(() => {

        if (audioUrl) {
            audioInfo.audioElement = React.createRef();
            setAudioInfo(audioInfo);

            // setAudioInfo((prevState) => ({
            //     ...prevState,
            //     audioElement: React.createRef()
            // }));

            // setAudioInfo((draft) => {
            //     draft.audioElement = React.createRef();
            // });
        }
    }, [audioUrl]);

    useEffect(() => {
        if (managementAudio) {
            managementAudio.addAudioInfo(audioInfo);
        }
    }, []);

    if (managementAudio === undefined) {//zmienic wyzej
        return <div></div>
    }

    // style={{ display: 'none' }}
    return (
        <>
            {
                audioInfo.audioElement &&
                <audio ref={audioInfo.audioElement} controls style={{ display: 'none' }}>
                    <source
                        src={audioUrl}
                        type="audio/mpeg"
                    />
                </audio>
            }
            <Button className='audio-play' variant='outline-dark' onClick={() => onPlayHandle(text, audioInfo, managementAudio)}><i className="bi bi-play-fill" ref={audioInfo.audioButton}></i></Button>
        </>
    )
}

function onPlayHandle(text: string, audioInfo: AudioInfo, managementAudio: useEasySpeechType) {

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