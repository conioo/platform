import EasySpeech from "easy-speech";
import AudioInfo from "../models/AudioInfo";
import { useSelector } from "react-redux";
import { selectIsEasySpeech } from "../redux/slices/language";

export interface useEasySpeechType {
    addAudioInfo: (audioInfo: AudioInfo) => void;
    reset: () => void;
}

let audioInfoArray = new Array<AudioInfo>();

export function useEasySpeech(): useEasySpeechType | undefined {

    if (!useSelector(selectIsEasySpeech)) {
        return undefined;
    }

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
}