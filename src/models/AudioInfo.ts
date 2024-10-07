export default class AudioInfo{
    isSpeaking: boolean = false;
    audioButton: React.RefObject<HTMLButtonElement>;
    audioElement: React.RefObject<HTMLAudioElement> | undefined;
    id: number;

    isPause: boolean = false;

    constructor(id: number, audioButton: React.RefObject<HTMLButtonElement>, audioElement: React.RefObject<HTMLAudioElement> | undefined  = undefined)
    {
        this.audioButton = audioButton;
        this.audioElement = audioElement;
        this.id = id;
    }
}