import AudioInfo from "../models/AudioInfo";

export interface useEasySpeechType {
    addAudioInfo: (audioInfo: AudioInfo) => void;
    reset: () => void;
}