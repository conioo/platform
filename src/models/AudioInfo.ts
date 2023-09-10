export default class AudioInfo{
    isSpeaking: boolean = false;
    refToAudio: React.RefObject<HTMLButtonElement>;

    constructor(refToAudio: React.RefObject<HTMLButtonElement>)
    {
        this.refToAudio = refToAudio;
    }
}