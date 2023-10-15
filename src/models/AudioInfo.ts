export default class AudioInfo{
    isSpeaking: boolean = false;
    refToAudio: React.RefObject<HTMLButtonElement>;
    isPause: boolean = false;

    constructor(refToAudio: React.RefObject<HTMLButtonElement>)
    {
        this.refToAudio = refToAudio;
    }
}