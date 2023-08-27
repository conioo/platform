import { BaseOptions } from "vm";
import AudioInfo from "../models/AudioInfo";

export default class ManagementAudio {

    protected AudioInfoArray: Array<AudioInfo<HTMLButtonElement>>;

    constructor() {
        this.AudioInfoArray = new Array<AudioInfo<HTMLButtonElement>>();
    }

    ResetAudio(audioInfo: AudioInfo<HTMLButtonElement>) {
        if (audioInfo.refToAudio.current) {
            if (audioInfo.refToAudio.current.classList.contains("icon-pause")) {
                audioInfo.refToAudio.current.classList.toggle("icon-pause");
            }
            audioInfo.isSpeaking = false;
        }
    }

    ResetAudioControls() {
        for (let audioInfo of this.AudioInfoArray) {
            if (audioInfo.isSpeaking) {
                this.ResetAudio(audioInfo);
            }
        }
    }

    AddToCollection(audioInfo: AudioInfo<HTMLButtonElement>) {
        this.AudioInfoArray.push(audioInfo);
    }
}