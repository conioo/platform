import { useRef } from "react";
import '../css/AudioPlay.css';
import AudioInfo from "../models/AudioInfo";
import EasySpeech from 'easy-speech';
import { useEasySpeechType } from "../hooks/EasySpeech";

interface AudioPlayProps {
    text: string;
    managementAudio: useEasySpeechType;
}

export default function AudioPlay({ text, managementAudio }: AudioPlayProps) {
    console.log("AudioPlay");

    let audioInfo = new AudioInfo(useRef(null));
    managementAudio.addAudioInfo(audioInfo);

    // utterance.onend = () => {
    //     managementAudio.ResetAudio(audioInfo);

    //     //zmienic ikone, isspekain

    //     if (audioInfo.refToAudio.current?.classList.contains("icon-pause")) {
    //         audioInfo.refToAudio.current?.classList.toggle("icon-pause");
    //     }
    // };

    return (
        <button className='icon-play audio-play' ref={audioInfo.refToAudio} onClick={onPlayHandle}></button>
    )

    function onPlayHandle() {

        if (audioInfo.isSpeaking) {
            //synth.pause();
            EasySpeech.cancel();
            audioInfo.isSpeaking = false;


            audioInfo.refToAudio.current?.classList.remove("icon-pause");
            // if (audioInfo.refToAudio.current?.classList.contains("icon-pause")) {
            //     audioInfo.refToAudio.current?.classList.toggle("icon-pause");
            // }
        }
        else {
            // if (!audioInfo.refToAudio.current?.classList.contains("icon-pause")) {
            //     audioInfo.refToAudio.current?.classList.toggle("icon-pause");
            // }
            audioInfo.refToAudio.current?.classList.add("icon-pause");

            managementAudio.reset();
            //synth.cancel();

            audioInfo.isSpeaking = true;


            //console.log(speechSynthesis.speaking);
            EasySpeech.speak({ text });
            //console.log(speechSynthesis.speaking);
            //EasySpeech.

            //synth.speak(utterance);
        }
    }
}