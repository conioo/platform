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
        // <Button className='audio-play' ref={audioInfo.refToAudio} onClick={() => onPlayHandle(text, audioInfo, managementAudio)}><i className='icon-play'></i></Button>
        <button className='icon-play audio-play' ref={audioInfo.refToAudio} onClick={() => onPlayHandle(text, audioInfo, managementAudio)}></button>
    )
}

function onPlayHandle(text: string, audioInfo: AudioInfo, managementAudio: useEasySpeechType) {
    if (audioInfo.isSpeaking) {
        EasySpeech.pause();

        audioInfo.isSpeaking = false;
        audioInfo.isPause = true;

        audioInfo.refToAudio.current?.classList.remove("icon-pause");
    }
    else {
        audioInfo.refToAudio.current?.classList.add("icon-pause");

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