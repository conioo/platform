import { syncBuiltinESMExports } from "module";
import { useRef } from "react";
import AudioInfo from "../models/AudioInfo";
import ManagementAudio from "../services/ManagementAudio";

interface AudioProps {
    text: string;
    managementAudio: ManagementAudio
}

export default function AudioControl({ text, managementAudio }: AudioProps) {
    console.log("AudioControl");

    const synth = speechSynthesis;

    let voices = synth.getVoices();

    let utterance = new SpeechSynthesisUtterance(text);

    // for (let voice of voices) {
    //     console.log(voice.name);
    //     if (voice.name === "Google UK English Male") {
    //         utterance.voice = voice;
    //     }
    // }

    let audioInfo = new AudioInfo<HTMLAudioElement>(useRef(null));
    managementAudio.AddToCollection(audioInfo);

    utterance.onend = () => {
        managementAudio.ResetAudio(audioInfo);
    };

    utterance.voice = voices[5];

    return (
        <div className='audio-segment'>
            <audio controls key={Math.random()} ref={audioInfo.refToAudio} onPlay={onPlayHandle} onPause={onPauseHandle} src="https://github.com/miandrop/data-public/raw/main/One%20minute%20of%20silence%20(ID%200917)_BSB.mp3" >
            </audio>
        </div>
    )

    function onPlayHandle() {
        managementAudio.ResetAudioControls();
        synth.cancel();

        audioInfo.isSpeaking = true;
        synth.speak(utterance);

        // console.log("start");
        // if (synth.paused) {
        //     synth.resume();
        //     console.log("dalej leci");
        // } else {
        //     synth.speak(utterance);
        // }
    }

    function onPauseHandle() {
        synth.pause();
        // console.log(synth.speaking);
        // if (!synth.paused && synth.speaking) {
        //     synth.pause();
        // }
        // console.log(synth.speaking);
        // console.log("przerwa");
    }
}