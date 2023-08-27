import { BaseOptions } from "vm";
import AudioInfo from "../models/AudioInfo";

export default class ManagementAudio {

    protected AudioInfoArray: Array<AudioInfo<HTMLAudioElement>>;

    constructor(isAudio = true) {
        this.AudioInfoArray = new Array<AudioInfo<HTMLAudioElement>>();
    }

    ResetAudio(audioInfo: AudioInfo<HTMLAudioElement>) {
        if (audioInfo.refToAudio.current) {
            audioInfo.refToAudio.current.pause();
            audioInfo.refToAudio.current.currentTime = 0;
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

    AddToCollection(audioInfo: AudioInfo<HTMLAudioElement>) {
        this.AudioInfoArray.push(audioInfo);
    }
}