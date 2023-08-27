import { useRef } from "react";
import AudioRefInfo from "../models/AudioInfo";
import ManagementAudio from "../services/ManagementAudio";
import '../css/AudioPlay.css';
import AudioInfo from "../models/AudioInfo";
import ManagementPlay from "../services/ManagementPlay";

interface AudioPlayProps {
    text: string;
    managementAudio: ManagementPlay;
}

export default function AudioPlay({ text, managementAudio }: AudioPlayProps) {
    console.log("AudioPlay");

    const synth = speechSynthesis;

    let voices = synth.getVoices();

    let utterance = new SpeechSynthesisUtterance(text);

    let audioInfo = new AudioInfo<HTMLButtonElement>(useRef(null));
    managementAudio.AddToCollection(audioInfo);

    utterance.onend = () => {
        managementAudio.ResetAudio(audioInfo);

        if (audioInfo.refToAudio.current?.classList.contains("icon-pause")) {
            audioInfo.refToAudio.current?.classList.toggle("icon-pause");
        }
    };

    const intervalId = setInterval(() => {
        console.log(voices);
        if (voices) {
            utterance.voice = voices[5];
            clearInterval(intervalId);
        }
    }, 100);

    return (
        <button className='icon-play audio-play' ref={audioInfo.refToAudio} onClick={onPlayHandle}></button>
    )

    function onPlayHandle() {

        if (audioInfo.isSpeaking) {
            synth.pause();
            audioInfo.isSpeaking = false;

            if (audioInfo.refToAudio.current?.classList.contains("icon-pause")) {
                audioInfo.refToAudio.current?.classList.toggle("icon-pause");
            }
        }
        else {
            if (!audioInfo.refToAudio.current?.classList.contains("icon-pause")) {
                audioInfo.refToAudio.current?.classList.toggle("icon-pause");
            }
            managementAudio.ResetAudioControls();
            synth.cancel();

            audioInfo.isSpeaking = true;
            synth.speak(utterance);
        }
    }
}