import EasySpeech from "easy-speech";
import AudioInfo from "../models/AudioInfo";

export interface useEasySpeechType {
    addAudioInfo: (audioInfo: AudioInfo) => void;
    reset: () => void;
}

let audioInfoArray = new Array<AudioInfo>();

export function useEasySpeech(): useEasySpeechType {
    audioInfoArray = new Array<AudioInfo>();

    const addAudioInfo = (audioInfo: AudioInfo): void => {
        audioInfoArray.push(audioInfo);
    };

    const reset = () => {
        EasySpeech.cancel();

        for (let audioInfo of audioInfoArray) {
            if (audioInfo.isSpeaking) {
                audioInfo.refToAudio.current?.classList.remove("icon-pause");
                audioInfo.isSpeaking = false;
            }
        }
    };

    const handleEnd = () => {
        reset();
    };

    EasySpeech.on({ end: handleEnd });

    return ({
        addAudioInfo,
        reset
    });


    // ResetAudio(audioInfo: AudioInfo<HTMLButtonElement>) {
    //     if (audioInfo.refToAudio.current) {
    //         if (audioInfo.refToAudio.current.classList.contains("icon-pause")) {
    //             audioInfo.refToAudio.current.classList.toggle("icon-pause");
    //         }
    //         audioInfo.isSpeaking = false;
    //     }
    // }

    // ResetAudioControls() {
    //     for (let audioInfo of this.AudioInfoArray) {
    //         if (audioInfo.isSpeaking) {
    //             this.ResetAudio(audioInfo);
    //         }
    //     }
    // }

    // AddToCollection(audioInfo: AudioInfo<HTMLButtonElement>) {
    //     this.AudioInfoArray.push(audioInfo);
    // }

}