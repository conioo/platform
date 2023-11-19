import EasySpeech from 'easy-speech';
import React from "react";
import { useEasySpeechType } from "../../hooks/EasySpeech";
import AudioInfo from "../../models/AudioInfo";
import './AudioPlay.scss';
import Button from 'react-bootstrap/esm/Button';

interface AudioPlayProps {
    text: string;
    managementAudio: useEasySpeechType | undefined;
}

export default function AudioPlay({ text, managementAudio }: AudioPlayProps) {
    console.log("AudioPlay");

    if (managementAudio === undefined) {
        return <div></div>
    }

    let audioInfo = new AudioInfo(React.createRef());
    managementAudio.addAudioInfo(audioInfo);

    return (
        <Button className='audio-play' variant='outline-dark' onClick={() => onPlayHandle(text, audioInfo, managementAudio)}><i className="bi bi-play-fill" ref={audioInfo.refToAudio}></i></Button>
    )
}

function onPlayHandle(text: string, audioInfo: AudioInfo, managementAudio: useEasySpeechType) {
    if (audioInfo.isSpeaking) {
        EasySpeech.pause();

        audioInfo.isSpeaking = false;
        audioInfo.isPause = true;

        audioInfo.refToAudio.current?.classList.remove("bi-pause-fill");
        audioInfo.refToAudio.current?.classList.add("bi-play-fill");
    }
    else {
        audioInfo.refToAudio.current?.classList.add("bi-pause-fill");
        audioInfo.refToAudio.current?.classList.remove("bi-play-fill");

        if (audioInfo.isPause) {
            EasySpeech.resume();
            audioInfo.isPause = false;
        }
        else {
            managementAudio.reset();
            EasySpeech.speak({ text });
        }

        audioInfo.isSpeaking = true;
    }
}