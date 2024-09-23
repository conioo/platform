export default class AudioInfo{
    isSpeaking: boolean = false;
    audioButton: React.RefObject<HTMLButtonElement>;
    audioElement: React.RefObject<HTMLAudioElement> | undefined;

    isPause: boolean = false;

    constructor(audioButton: React.RefObject<HTMLButtonElement>, audioElement: React.RefObject<HTMLAudioElement> | undefined  = undefined)
    {
        this.audioButton = audioButton;
        this.audioElement = audioElement;
    }
}