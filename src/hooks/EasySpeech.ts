import AudioInfo from "../models/AudioInfo";

export interface useEasySpeechType {
    addAudioInfo: (audioInfo: AudioInfo) => void;
    updateAudioInfo: (audioInfo: AudioInfo) => void;
    reset: () => void;
    onStart: () => void;
    onEnd: () => void;
    playAllAudio: () => void;
    stopAllAudio: () => void;
    resetState: () => void;
}