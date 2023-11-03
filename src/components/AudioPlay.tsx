import { useRef } from "react";
import '../css/AudioPlay.css';
import AudioInfo from "../models/AudioInfo";
import EasySpeech from 'easy-speech';
import { useEasySpeechType } from "../hooks/EasySpeech";
import React from "react";

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